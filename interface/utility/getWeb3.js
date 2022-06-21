import Web3 from "web3";

import ensAbi from "./constant/ens.json";
import subDomainAbi from "./constant/subdomain.json";
import { getProvider } from "./setup";

const getWeb3 = async() => {
    let provider =  await getProvider(false);
    if (!provider) provider = "https://rinkeby.infura.io/v3/e5f6b05589544b1bb8526dc3c034c63e";
    const web3 = new Web3(provider);
    console.log(provider, web3);

    const ENSRegistry = new web3.eth.Contract(ensAbi, process.env.ENSDomain);
    const SubdomainReg = new web3.eth.Contract(subDomainAbi, process.env.Registrar);
    const ENSDomain = new web3.eth.Contract(ensAbi, process.env.ENSRegistry);
    return { web3, ENSDomain, SubdomainReg, ENSRegistry };
}

export default getWeb3;