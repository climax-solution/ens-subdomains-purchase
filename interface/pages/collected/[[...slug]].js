import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import moment from "moment";
import Collect from "../../components/collect";
import {
    GET_FAVOURITES,
    GET_DOMAINS_SUBGRAPH,
    GET_REGISTRATIONS_SUBGRAPH,
    GET_ERRORS
} from '../../utility/graphql/queries'
import {
  getEtherScanAddr,
  normaliseOrMark
} from '../../utility/utils/utils'
import { decryptName, checkIsDecrypted } from '../../utility/api/labels'
import { globalErrorReactive } from '../../utility/apollo/reactiveVars'
import { useBlock } from "../../utility/hooks";
import Loader from "../../components/loader";

const RESET_STATE_QUERY = gql`
  query resetStateQuery @client {
    networkId
    isENSReady
  }
`

function filterOutReverse(domains) {
    return domains.filter(domain => domain.parent)
  }
  
  function normaliseAddress(address) {
    return address.toLowerCase()
  }
  
  function decryptNames(domains) {
    return domains.map(d => {
      const name = decryptName(d.domain.name)
      return {
        ...d,
        domain: {
          ...d.domain,
          name: name,
          labelName: checkIsDecrypted(name[0]) ? name.split('.')[0] : null
        }
      }
    })
  }

function useDomains({
    resultsPerPage,
    domainType,
    address,
    sort,
    page,
    expiryDate
  }) {
    const skip = (page - 1) * resultsPerPage
    const registrationsQuery = useQuery(GET_REGISTRATIONS_SUBGRAPH, {
      variables: {
        id: address,
        first: resultsPerPage,
        skip,
        orderBy: sort.type,
        orderDirection: sort.direction,
        expiryDate
      },
      skip: domainType !== 'registrant',
      fetchPolicy: 'no-cache'
    })
  
    const controllersQuery = useQuery(GET_DOMAINS_SUBGRAPH, {
      variables: {
        id: address,
        first: resultsPerPage,
        skip
      },
      skip: domainType !== 'controller',
      fetchPolicy: 'no-cache'
    })
  
    if (domainType === 'registrant') {
      return registrationsQuery
    } else if (domainType === 'controller') {
      return controllersQuery
    } else {
      throw new Error('Unrecognised domainType')
    }
  }

export const useResetState = (
    setYears,
    setCheckedBoxes,
    setSelectAll,
    networkId,
    address,
    globalErrorReactive
  ) => {
    useEffect(() => {
      setYears(1)
      setCheckedBoxes({})
      setSelectAll(null)
      globalErrorReactive({
        ...globalErrorReactive(),
        invalidCharacter: null
      })
    }, [networkId, address])
}

const Collected = () => {

    const router = useRouter();
    const { slug } = router.query;
    const address = "0x0F09aE2ba91449a7B4201721f98f482cAF9737Ee";
    const domainType = 'registrant';

    const {
        data: { networkId }
      } = useQuery(RESET_STATE_QUERY)
      console.log("networkId", networkId);
      const normalisedAddress = normaliseAddress(address)
      const pageQuery = ""
      const page = pageQuery ? parseInt(pageQuery) : 1
      const { block } = useBlock()
      let [activeSort, setActiveSort] = useState({
        type: 'expiryDate',
        direction: 'asc'
      })
      let [resultsPerPage, setResultsPerPage] = useState(25)
      let [checkedBoxes, setCheckedBoxes] = useState({})
      let [years, setYears] = useState(1)
      const [selectAll, setSelectAll] = useState(false)
      useResetState(
        setYears,
        setCheckedBoxes,
        setSelectAll,
        networkId,
        address,
        globalErrorReactive
      )
    
      let currentDate, expiryDate
      if (process.env.REACT_APP_STAGE === 'local') {
        if (block) {
          currentDate = moment(block.timestamp * 1000)
        }
      } else {
        currentDate = moment()
      }
      if (currentDate) {
        expiryDate = currentDate.subtract(90, 'days').unix()
      }
    
      const { loading, data, error, refetch } = useDomains({
        resultsPerPage,
        domainType,
        address: normalisedAddress,
        sort: activeSort,
        page,
        expiryDate
      })
    
      const {
        data: { globalError }
      } = useQuery(GET_ERRORS)
    
      if (error) {
        return <>Error getting domains. {JSON.stringify(error)}</>
      }
      console.log(loading, data);
      if (loading) {
        return <Loader/>
      }
    
      let normalisedDomains = []
    
      if (domainType === 'registrant' && data.account) {
        normalisedDomains = [...data.account.registrations]
      } else if (domainType === 'controller' && data.account) {
        normalisedDomains = [
          ...filterOutReverse(data.account.domains).map(domain => ({ domain }))
        ]
      }
    
      let decryptedDomains = normaliseOrMark(
        decryptNames(normalisedDomains),
        'labelName',
        true
      )
      if (globalError.invalidCharacter || !decryptedDomains) {
        return <InvalidCharacterError message={globalError.invalidCharacter} />
      }
      let domains = decryptedDomains

    return (
        <div className="flex flex-wrap justify-even gap-2 p-10">
        {
            domains.map((item, idx) => (
                <Collect
                  key={idx}
                  name={item.domain.name}
                  id={item.domain.labelhash.toString(10)}
                />
            ))
        }
        </div>
    )
}

export default Collected;