var HashRegistrar = artifacts.require("HashRegistrar");
var TestResolver = artifacts.require("TestResolver");

// var ENSs = artifacts.require("ENSRegistry");
var contract = require("@truffle/contract");
var data = require("@ensdomains/ens-contracts/build/contracts/ENSRegistry.json");
var ENS = contract(data);


const EthRegistrarSubdomainRegistrar = artifacts.require("EthRegistrarSubdomainRegistrar");
var namehash = require('eth-ens-namehash');
var sha3 = require('js-sha3').keccak_256;

module.exports = async function (deployer, network, accounts) {
  console.log('network =>',network);

  // return deployer.then(async () => {
    // if (network == 'ropsten') {
      await deployer.deploy(ENS);

      const ens = await ENS.deployed();
      console.log('ens', ens);
      // await deployer.deploy(HashRegistrar, ens.address, namehash.hash('eth'), 1493895600);
      // await deployer.deploy(TestResolver);

      // await ens.setSubnodeOwner('0x0', '0x' + sha3('eth'), accounts[0]);
      // await ens.setSubnodeOwner(namehash.hash('eth'), '0x' + sha3('resolver'), accounts[0]);

      // const resolver = await TestResolver.deployed();
      // await ens.setResolver(namehash.hash('resolver.eth'), resolver.address);

      // const dhr = await HashRegistrar.deployed();
      // await ens.setSubnodeOwner('0x0', '0x' + sha3('eth'), dhr.address);

      // await deployer.deploy(EthRegistrarSubdomainRegistrar, ens.address);

      // const registrar = await EthRegistrarSubdomainRegistrar.deployed();
      // // deployer.deploy(EthRegistrarSubdomainRegistrar, ens);
    // } else {
      // const ens = ENS.deployed();
      // await deployer.deploy(SubdomainRegistrar, ens.address);
    // }
  // });
};