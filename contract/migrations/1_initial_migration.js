// const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
// const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";

// // var HashRegistrar = artifacts.require("HashRegistrar");
// var TestResolver = artifacts.require("TestResolver");
// const ENSRegistry = artifacts.require("ENSRegistry")
// const FIFSRegistrar = artifacts.require("FIFSRegistrar")
// // const ReverseRegistrar = artifacts.require("ReverseRegistrar")
// const PublicResolver = artifacts.require("PublicResolver")
// const tld = "eth";

const EthRegistrarSubdomainRegistrar = artifacts.require("EthRegistrarSubdomainRegistrar");
// var namehash = require('eth-ens-namehash');
// var sha3 = require('js-sha3').keccak_256;

const ens_address = "0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e";
module.exports = async function (deployer, network, accounts) {

  // await deployer.deploy(ENSRegistry);
  // const ens = await ENSRegistry.deployed()

  // await deployer.deploy(PublicResolver, ens.address, ZERO_ADDRESS);
  // const resolver = await PublicResolver.deployed()
  // await setupResolver(ens, resolver, accounts)

  // await deployer.deploy(FIFSRegistrar, ens.address, namehash.hash(tld));
  // const registrar = await FIFSRegistrar.deployed()
  // await setupRegistrar(ens, registrar);
  // const reverseRegistrar = await deployer.deploy(ReverseRegistrar, ens.address, resolver.address);
  // await reverseRegistrar.deployed()
  // await setupReverseRegistrar(ens, registrar, reverseRegistrar, accounts);
  await deployer.deploy(EthRegistrarSubdomainRegistrar, ens_address);
  const subdomain = await EthRegistrarSubdomainRegistrar.deployed();
};

// async function setupResolver(ens, resolver, accounts) {
//   const resolverNode = namehash.hash("resolver.eth");
//   const resolverLabel = "0x" + sha3("eth");
//   await ens.setSubnodeOwner(ZERO_HASH, resolverLabel, accounts[0]);
//   await ens.setSubnodeOwner(namehash.hash('eth'), '0x' + sha3('resolver'), accounts[0]);
//   await ens.setResolver(resolverNode, resolver.address);
//   await resolver.setAddr(resolverNode, resolver.address);
// }

// async function setupRegistrar(ens, registrar) {
//   await ens.setSubnodeOwner(ZERO_HASH, "0x" + sha3(tld), registrar.address);
// }

// async function setupReverseRegistrar(ens, registrar, reverseRegistrar, accounts) {
//   await ens.setSubnodeOwner(ZERO_HASH, "0x" + sha3("reverse"), accounts[0]);
//   await ens.setSubnodeOwner("0x" + namehash.hash("reverse"), "0x" + sha3("addr"), reverseRegistrar.address);
// }