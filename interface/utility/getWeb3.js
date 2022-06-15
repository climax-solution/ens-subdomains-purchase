import { getNetworkId } from "@ensdomains/ui";
import Web3 from "web3";

import ensAbi from "./constant/ens.json";
import subDomainAbi from "./constant/subdomain.json";
import { getProvider } from "./setup";

const getWeb3 = async() => {
    const provider =  await getProvider(false);
    const web3 = new Web3(provider);
    const networkId = await getNetworkId();
    const ENSDomain = new web3.eth.Contract(ensAbi, process.env.ENSDomain);
    const SubdomainReg = new web3.eth.Contract(subDomainAbi, process.env.Registrar);
    return { web3, ENSDomain, SubdomainReg };
}

export default getWeb3;