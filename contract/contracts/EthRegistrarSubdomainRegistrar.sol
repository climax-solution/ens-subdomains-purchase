//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@ensdomains/ens-contracts/contracts/ethregistrar/BaseRegistrar.sol";
import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "./Resolver.sol";
import "./RegistrarInterface.sol";

/**
 * @dev Implements an ENS registrar that sells subdomains on behalf of their owners.
 *
 * Users may register a subdomain by calling `register` with the name of the domain
 * they wish to register under, and the label hash of the subdomain they want to
 * register. They must also specify the new owner of the domain, and the referrer,
 * who is paid an optional finder's fee. The registrar then configures a simple
 * default resolver, which resolves `addr` lookups to the new owner, and sets
 * the `owner` account as the owner of the subdomain in ENS.
 *
 * New domains may be added by calling `configureDomain`, then transferring
 * ownership in the ENS registry to this contract. Ownership in the contract
 * may be transferred using `transfer`, and a domain may be unlisted for sale
 * using `unlistDomain`. There is (deliberately) no way to recover ownership
 * in ENS once the name is transferred to this registrar.
 *
 * Critically, this contract does not check one key property of a listed domain:
 *
 * - Is the name UTS46 normalised?
 *
 * User applications MUST check these two elements for each domain before
 * offering them to users for registration.
 *
 * Applications should additionally check that the domains they are offering to
 * register are controlled by this registrar, since calls to `register` will
 * fail if this is not the case.
 */

contract EthRegistrarSubdomainRegistrar is RegistrarInterface {
    
    struct Domain {
        string name;
        address payable owner;
        uint[] price;
        bool existed;
        uint entire_index;
        uint label_index;
        string[] reserves;
    }

    struct Reserve {
        bytes32 domain;
        address owner;
        uint subscription;
        uint index;
    }

    // namehash('eth')
    bytes32 constant public TLD_NODE = 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae;

    bool public stopped = false;

    address public registrarOwner;
    address public registrar;

    ENS public ens;

    uint256 public reserve_fee = 500;
    uint256 public list_fee = 0.01 ether;

    address payable treasury;

    bytes32[] public domains;
    mapping (bytes32 => Domain) domain_property;
    mapping (address => bytes32[]) labels;
    mapping (string => Reserve) reserve_property;

    modifier owner_only(bytes32 label) {
        require(owner(label) == msg.sender, "not domain owner");
        _;
    }

    modifier not_stopped() {
        require(!stopped);
        _;
    }

    modifier registrar_owner_only() {
        require(msg.sender == registrarOwner, "not registrar owner");
        _;
    }

    event DomainTransferred(bytes32 indexed label, string name);

    constructor(ENS _ens) {
        ens = _ens;
        registrar = ens.owner(TLD_NODE);
        registrarOwner = msg.sender;
        treasury = payable(msg.sender);
    }

    function doRegistration(bytes32 node, bytes32 label, address subdomainOwner, Resolver resolver) internal {
        // Get the subdomain so we can configure it
        ens.setSubnodeOwner(node, label, address(this));

        bytes32 subnode = keccak256(abi.encodePacked(node, label));
        // Set the subdomain's resolver
        ens.setResolver(subnode, address(resolver));

        // Set the address record on the resolver
        resolver.setAddr(subnode, subdomainOwner);

        // Pass ownership of the new subdomain to the registrant
        ens.setOwner(subnode, subdomainOwner);
    }

    function supportsInterface(bytes4 interfaceID) public pure returns (bool) {
        return (
            (interfaceID == 0x01ffc9a7) // supportsInterface(bytes4)
            || (interfaceID == 0xc1b15f5a) // RegistrarInterface
        );
    }

    /**
     * @dev Stops the registrar, disabling configuring of new domains.
     */
    function stop() public not_stopped registrar_owner_only {
        stopped = true;
    }

    function transferOwnership(address newOwner) public registrar_owner_only {
        registrarOwner = newOwner;
    }

    /**
     * @dev owner returns the address of the account that controls a domain.
     *      Initially this is a null address. If the name has been
     *      transferred to this contract, then the internal mapping is consulted
     *      to determine who controls it. If the owner is not set,
     *      the owner of the domain in the Registrar is returned.
     * @param label The label hash of the deed to check.
     * @return The address owning the deed.
     */
    function owner(bytes32 label) public view returns (address) {
        // if (domain_property[label].owner != address(0x0)) {
        //     return domain_property[label].owner;
        // }

        return BaseRegistrar(registrar).ownerOf(uint256(label));
    }

    /**
     * @dev Configures a domain, optionally transferring it to a new owner.
     * @param name The name to configure.
     * @param price The price in wei to charge for subdomain registrations.
     *        when the permanent registrar is replaced. Can only be set to a non-zero
     *        value once.
     */
    function configureDomainFor(string memory name, uint[] memory price) public owner_only(keccak256(bytes(name))) payable {
        require(msg.value >= list_fee, "not enough fee");
        require(price.length == 4, "not correct price list");
        
        treasury.transfer(msg.value);

        bytes32 label = keccak256(bytes(name));
        Domain storage domain = domain_property[label];

        if (address(domain.owner) != msg.sender) {
            domain.owner = payable(msg.sender);
        }

        if (domains[domain.entire_index] != label) {
            domain.entire_index = domains.length;
            domains.push(label);
        }

        if (keccak256(bytes(domain.name)) != label) {
            domain.name = name;
        }

        domain.price = price;
        if (!domain.existed) {
            domain.label_index = labels[msg.sender].length;
            labels[msg.sender].push(label);
        }

        else {
            if (labels[msg.sender][domain.label_index] != label) {
                if (labels[msg.sender].length < domain.label_index) {
                    domain.label_index = labels[msg.sender].length;
                    labels[msg.sender].push(label);
                }
            }
        }

        emit DomainConfigured(label);
    }

    /**
     * @dev Unlists a domain
     * May only be called by the owner.
     * @param name The name of the domain to unlist.
     */
    function unlistDomain(string memory name) public owner_only(keccak256(bytes(name))) {
        bytes32 label = keccak256(bytes(name));
        Domain memory domain = domain_property[label];
        require((domain.reserves).length == 0, "existing reserve yet");

        if (domains[domain.entire_index] == label) delete domains[domain.entire_index];
        if (labels[domain.owner][domain.label_index] == label) delete labels[domain.owner][domain.label_index];

        emit DomainUnlisted(label);
    }

    /**
     * @dev Registers a subdomain.
     * @param label The label hash of the domain to register a subdomain of.
     * @param subdomain The desired subdomain label.
     */

    function register(bytes32 label, string calldata subdomain, address resolver) external not_stopped owner_only(label) {
        Reserve memory _reserve = reserve_property[subdomain];
        Domain memory domain = domain_property[label];

        require(_reserve.owner != address(0), "no reserved");
        require(_reserve.domain == label, "not matched domain");
        require(keccak256(bytes(domain.name)) == label);

        address subdomainOwner = _reserve.owner;
        bytes32 domainNode = keccak256(abi.encodePacked(TLD_NODE, label));
        bytes32 subdomainLabel = keccak256(bytes(subdomain));

        // Subdomain must not be registered already.
        require(ens.owner(keccak256(abi.encodePacked(domainNode, subdomainLabel))) == address(0));
        // Send any referral fee
        uint256 total = domain.price[_reserve.subscription];
        if (reserve_fee > 0) {
            uint256 reserveFee = (domain.price[_reserve.subscription] * reserve_fee) / 10000;
            treasury.transfer(reserveFee);
            total -= reserveFee;
        }

        // Send the registration fee
        if (total > 0) {
            domain.owner.transfer(total);
        }

        doRegistration(domainNode, subdomainLabel, subdomainOwner, Resolver(resolver));

        emit NewRegistration(label, subdomain, subdomainOwner, treasury, domain.price[_reserve.subscription]);
    }

    function queryEntireDomains() public view returns(bytes32[] memory) {
        return domains;
    }

    function queryDomain(bytes32 name) public view returns(Domain memory) {
        return domain_property[name];
    }

    function queryLabels(address _owner) public view returns(bytes32[] memory) {
        return labels[_owner];
    }
    
    function queryReservesList(bytes32 label) public view returns(string[] memory) {
        return domain_property[label].reserves;
    }

    function queryReserves(string memory name) public view returns(Reserve memory) {
        return reserve_property[name];
    }
    
    function reserveSubdomain(bytes32 label, string calldata subdomain, uint subscription) external payable {
        require(domain_property[label].existed, "no domain listed");
        require(reserve_property[subdomain].domain == "", "someone already requested");
        require(msg.value >= domain_property[label].price[subscription], "not enough fee");

        string[] storage reserves = domain_property[label].reserves;
        reserves.push(subdomain);
        reserve_property[subdomain] = Reserve(label, msg.sender, subscription, reserves.length);
    }

    function declineSubdomain(string calldata subdomain) external {
        Reserve memory reserve = reserve_property[subdomain];
        require(reserve.owner != address(0), "no reserve exist");
        require(reserve.owner == msg.sender || msg.sender == owner(reserve.domain), "no reserve exist");
        delete reserve_property[subdomain];
        delete domain_property[reserve.domain].reserves[reserve.index];
    }

    function updateListFee(uint _fee) external registrar_owner_only {
        list_fee = _fee;
    }

    function updateReserveFee(uint _fee) external registrar_owner_only {
        reserve_fee = _fee;
    }
}
