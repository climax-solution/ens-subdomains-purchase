import React, { useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client'

import { connectProvider, disconnectProvider } from '../../utility/utils/providerUtils'
import { useAppContext } from '../../context/state'
import getWeb3 from '../../utility/getWeb3'
import axios from 'axios'

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

function NetworkInformation({ className = 'text-white' }) {
  const { setAccount, setNetwork, setWEB3, setDomainContract, setRegistrarContract } = useAppContext();
  const {
    data: { accounts, network }
  } = useQuery (NETWORK_INFORMATION_QUERY)

  const [wallets, setWallets] = useState([]);
  useEffect(() => {
    async function fetchInstance() {
      const { web3, ENSDomain, SubdomainReg } = await getWeb3();
      const __accounts = await web3.eth.getAccounts();
      const _network = await web3.eth.net.getNetworkType();

      setWallets(__accounts);
      setAccount(accounts ? accounts[0] : '');
      setNetwork(_network == 'main' ? 'mainnet' : '');
      setWEB3(web3);
      setDomainContract(ENSDomain);
      setRegistrarContract(SubdomainReg);
      if (accounts) await createNewUser(accounts[0]);
    }
    fetchInstance();
  }, [network, accounts])

  const shorten = (str, cut = 4) => {
      if (str) {
        const res = str.substr(0, cut) + '...' + str.substr(-cut);
        return res;
      }
      return "";
  }

  const createNewUser = async(address) => {
    await axios.post(`${process.env.backend}/users/create-new-user`, { address }).then(res => {

    }).catch(err => {

    })
  }

  return (
    <div className={'flex flex-col gap-2 items-center ' + className}>
        <span>
        { (!accounts || !accounts.length) ? "Main Network (Read Only)" : network + "(" + shorten(accounts[0]) + ")" }
        </span>
        <button
          className="px-4 py-1 w-38 text-sm font-semibold rounded-lg border border-white-600 bg-transparent"
          onClick={ (!accounts || !accounts.length) ? connectProvider : disconnectProvider}
          type="button"
        >{ ((!accounts || !accounts.length) ? "Connect" : "Disconnect") + " Wallet"}</button>
    </div>
  )
}
export default NetworkInformation
