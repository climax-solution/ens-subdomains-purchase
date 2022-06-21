//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "@ensdomains/ens-contracts/contracts/ethregistrar/BaseRegistrar.sol";
import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";

contract EthRegistrarSubdomainRegistrar {
    
    struct Domain {
        string name;
        address payable owner;
        uint256[] price;
        uint256 reserve_count;
    }

    struct Reserve {
        string name;
        bytes32 domain;
        address owner;
        uint256 subscription;
    }

    struct Exist {
        uint256 index;
        bool existed;
    }
    // namehash('eth')
    bytes32 constant public TLD_NODE = 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae;

    bool public stopped = false;

    address public registrarOwner;
    address public registrar;
    address payable treasury;

    ENS public ens;

    uint256 public reserve_fee = 500;
    uint256 public list_fee = 0.01 ether;

    Domain[] public domains;
    Reserve[] public reserves;

    mapping(bytes32 => Exist) domain_index;
    mapping(bytes32 => mapping(string => Exist)) reserve_indexes;

    event NewRegistration(bytes32 label, bytes32 subdomain, address owner, uint256 price);
    event DomainConfigured(bytes32 indexed label);
    event DomainUnlisted(bytes32 indexed label);
    
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


    constructor(ENS _ens) {
        ens = _ens;
        registrar = ens.owner(TLD_NODE);
        registrarOwner = msg.sender;
        treasury = payable(msg.sender);
    }

    function doRegistration(bytes32 node, bytes32 label, address subdomainOwner, address resolver) internal {
        // Get the subdomain so we can configure it
        ens.setSubnodeRecord(node, label, subdomainOwner, resolver, getTTL(node));
    }

    function getTTL(bytes32 node) public view returns(uint64) {
        return ens.ttl(node);
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
        return BaseRegistrar(registrar).ownerOf(uint256(label));
    }

    /**
     * @dev Configures a domain, optionally transferring it to a new owner.
     * @param name The name to configure.
     * @param price The price in wei to charge for subdomain registrations.
     *        when the permanent registrar is replaced. Can only be set to a non-zero
     *        value once.
     */
    function configureDomainFor(string memory name, uint256[] memory price) public payable {
        bytes32 label = keccak256(bytes(name));
        Exist memory key = domain_index[label];

        require(!key.existed, "already listed");
        require(msg.value >= list_fee, "not enough fee");
        require(price.length == 4, "not correct price list");
        
        treasury.transfer(msg.value);

        domain_index[label] = Exist(domains.length, true);
        Domain memory new_domain = Domain(name, payable(msg.sender), price, 0);
        domains.push(new_domain);

        emit DomainConfigured(label);
    }

    /**
     * @dev Unlists a domain
     * May only be called by the owner.
     * @param name The name of the domain to unlist.
     */
    function unlistDomain(string memory name) public owner_only(keccak256(bytes(name))) {
        bytes32 label = keccak256(bytes(name));
        Exist memory key = domain_index[label];

        Domain memory domain = domains[key.index];

        require(key.existed, "no domain listed");
        require(domain.reserve_count == 0, "existing reserve yet");

        if (keccak256(bytes(domain.name)) == label) {
            domains[key.index] = domains[domains.length - 1];
            bytes32 lastLabel = keccak256(bytes(domains[domains.length - 1].name));
            domain_index[lastLabel].index = key.index;
            domains.pop();
            delete domain_index[label];
        }

        emit DomainUnlisted(label);
    }

    /**
     * @dev Registers a subdomain.
     * @param label The label hash of the domain to register a subdomain of.
     * @param subdomain The desired subdomain label.
     */

    function register(bytes32 label, string calldata subdomain, address resolver) external not_stopped owner_only(label) {
        Exist memory domain_key = domain_index[label];
        Exist memory reserve_key = reserve_indexes[label][subdomain];

        require(domain_key.existed, "no domain listed");
        
        Domain memory domain = domains[domain_key.index];
        Reserve memory reserve = reserves[reserve_key.index];
        
        require(reserve.owner != address(0) || !reserve_key.existed, "no reserved");
        require(reserve.domain == label, "not matched domain");

        reserves[reserve_key.index] = reserves[reserves.length - 1];
        reserve_indexes[label][reserves[reserve_key.index].name] = Exist(reserve_key.index, true);
        reserves.pop();

        address subdomainOwner = reserve.owner;
        bytes32 domainNode = keccak256(abi.encodePacked(TLD_NODE, label));
        bytes32 subdomainLabel = keccak256(bytes(subdomain));

        uint256 total = domain.price[reserve.subscription];
        if (reserve_fee > 0) {
            uint256 reserveFee = (domain.price[reserve.subscription] * reserve_fee) / 10000;
            treasury.transfer(reserveFee);
            total -= reserveFee;
        }

        // Send the registration fee
        if (total > 0) {
            domain.owner.transfer(total);
        }

        doRegistration(domainNode, subdomainLabel, subdomainOwner, resolver);

        delete reserve_indexes[label][subdomain];

        emit NewRegistration(label, subdomainLabel, subdomainOwner, domain.price[reserve.subscription]);
    }

    function queryEntireDomains() public view returns(Domain[] memory) {
        return domains;
    }

    function queryDomain(bytes32 label) public view returns(Domain memory) {
        Exist memory key = domain_index[label];
        require(key.existed, "no domain listed");
        return domains[key.index];
    }

    function queryReservesList() public view returns(Reserve[] memory) {
        return reserves;
    }

    function reserveSubdomain(bytes32 label, string calldata subdomain, uint subscription) external payable {
        Exist memory domain_key = domain_index[label];
        Exist memory reserve_key = reserve_indexes[label][subdomain];

        require(domain_key.existed, "no domain listed");
        require(!reserve_key.existed, "no reserved");
        require(address(domains[domain_key.index].owner) != address(0), "no domain listed");
        // require(reserves[domain_key.index].domain == "", "someone already requested");
        require(msg.value >= domains[domain_key.index].price[subscription], "not enough fee");

        reserve_indexes[label][subdomain] = Exist(reserves.length, true);
        reserves.push(Reserve(subdomain, label, msg.sender, subscription));
    }

    function declineSubdomain(bytes32 label, string calldata subdomain) external {
        Exist memory reserve_key = reserve_indexes[label][subdomain];
        uint256 index = reserve_key.index;

        require(reserve_key.existed, "no reserved");

        Reserve memory reserve = reserves[index];
        
        require(reserve.domain == label, "no domain exist");
        require(reserve.owner == msg.sender || msg.sender == owner(label), "no reserve exist");

        reserves[index] = reserves[reserves.length - 1];
        reserve_indexes[reserves[index].domain][reserves[index].name] = Exist(index, true);

        reserves.pop();
        delete reserve_indexes[label][subdomain];
    }

    function updateListFee(uint _fee) external registrar_owner_only {
        list_fee = _fee;
    }

    function updateReserveFee(uint _fee) external registrar_owner_only {
        reserve_fee = _fee;
    }
}
