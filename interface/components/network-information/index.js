import React, { useEffect } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client'

import { connectProvider, disconnectProvider } from '../../utility/utils/providerUtils'
import { useAppContext } from '../../context/state'
import getWeb3 from '../../utility/getWeb3'

const NETWORK_INFORMATION_QUERY = gql`
  query getNetworkInfo @client {
    accounts
    isReadOnly
    isSafeApp
    avatar
    network
    displayName
  }
`

function NetworkInformation() {
  const { setAccount, setNetwork, setWEB3, setDomainContract, setRegistrarContract } = useAppContext();

  const {
    data: { accounts, network }
  } = useQuery (NETWORK_INFORMATION_QUERY)

  useEffect(() => {
    async function fetchInstance() {
      const { web3, ENSDomain, SubdomainReg } = await getWeb3();
      const __accounts = await web3.eth.getAccounts();
      const _network = await web3.eth.net.getNetworkType();
      console.log("__accounts", __accounts, _network);
      
      setAccount(accounts ? accounts[0] : '');
      setNetwork(_network);
      setWEB3(web3);
      setDomainContract(ENSDomain);
      setRegistrarContract(SubdomainReg);
    }
    fetchInstance();
  }, [network, accounts])

  const shorten = (str, cut = 4) => {
      const res = str.substr(0, cut) + '...' + str.substr(-cut);
      return res;
  }

  return (
    <div className='flex flex-col gap-2 items-center'>
        <span className='text-white'>
        { !accounts ? "Main Network (Read Only)" : network + "(" + shorten(accounts[0]) + ")" }
        </span>
        <button
        className="px-4 py-1 w-38 text-sm text-white font-semibold rounded-lg border border-white-600 bg-transparent"
        onClick={ !accounts ? connectProvider : disconnectProvider}
        >{ (!accounts ? "Connect" : "Disconnect") + " Wallet"}</button>
    </div>
  )
}
export default NetworkInformation
