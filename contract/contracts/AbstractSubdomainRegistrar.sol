// //SPDX-License-Identifier: MIT

// pragma solidity ^0.8.4;

// import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
// import "./Resolver.sol";
// import "./RegistrarInterface.sol";

// contract AbstractSubdomainRegistrar is RegistrarInterface {

//     // namehash('eth')
//     bytes32 constant public TLD_NODE = 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae;

//     bool public stopped = false;
//     address public registrarOwner;
//     address public migration;

//     address public registrar;

//     ENS public ens;

//     modifier owner_only(bytes32 label) {
//         require(owner(label) == msg.sender);
//         _;
//     }

//     modifier not_stopped() {
//         require(!stopped);
//         _;
//     }

//     modifier registrar_owner_only() {
//         require(msg.sender == registrarOwner);
//         _;
//     }

//     event DomainTransferred(bytes32 indexed label, string name);

//     constructor(ENS _ens) {
//         ens = _ens;
//         registrar = ens.owner(TLD_NODE);
//         registrarOwner = msg.sender;
//     }

//     function doRegistration(bytes32 node, bytes32 label, address subdomainOwner, Resolver resolver) internal {
//         // Get the subdomain so we can configure it
//         ens.setSubnodeOwner(node, label, address(this));

//         bytes32 subnode = keccak256(abi.encodePacked(node, label));
//         // Set the subdomain's resolver
//         ens.setResolver(subnode, address(resolver));

//         // Set the address record on the resolver
//         resolver.setAddr(subnode, subdomainOwner);

//         // Pass ownership of the new subdomain to the registrant
//         ens.setOwner(subnode, subdomainOwner);
//     }

//     function supportsInterface(bytes4 interfaceID) public pure returns (bool) {
//         return (
//             (interfaceID == 0x01ffc9a7) // supportsInterface(bytes4)
//             || (interfaceID == 0xc1b15f5a) // RegistrarInterface
//         );
//     }

//     /**
//      * @dev Sets the resolver record for a name in ENS.
//      * @param name The name to set the resolver for.
//      * @param resolver The address of the resolver
//      */
//     function setResolver(string memory name, address resolver) public owner_only(keccak256(bytes(name))) {
//         bytes32 label = keccak256(bytes(name));
//         bytes32 node = keccak256(abi.encodePacked(TLD_NODE, label));
//         ens.setResolver(node, resolver);
//     }

//     /**
//      * @dev Stops the registrar, disabling configuring of new domains.
//      */
//     function stop() public not_stopped registrar_owner_only {
//         stopped = true;
//     }

//     function transferOwnership(address newOwner) public registrar_owner_only {
//         registrarOwner = newOwner;
//     }

//     function owner(bytes32 label) public virtual view returns (address);
// }