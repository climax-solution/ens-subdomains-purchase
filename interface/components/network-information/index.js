import React from 'react'
import { gql } from '@apollo/client'
import { useQuery, useMutation } from '@apollo/client'

import { GET_REVERSE_RECORD } from '../../utility/graphql/queries'
import { connectProvider, disconnectProvider } from '../../utility/utils/providerUtils'

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
  const {
    data: { accounts, isSafeApp, network, displayName, isReadOnly }
  } = useQuery(NETWORK_INFORMATION_QUERY)

  const {
    data: { getReverseRecord } = {},
    loading: reverseRecordLoading
  } = useQuery(GET_REVERSE_RECORD, {
    variables: {
      address: accounts?.[0]
    },
    skip: !accounts?.length
  })

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
