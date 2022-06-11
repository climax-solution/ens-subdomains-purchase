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
  filterNormalised,
  normaliseOrMark
} from '../../utility/utils/utils'
import { decryptName, checkIsDecrypted } from '../../utility/api/labels'
import { calculateIsExpiredSoon } from '../../utility/utils/dates'
import { globalErrorReactive } from '../../utility/apollo/reactiveVars'
import { useBlock } from "../../utility/hooks";

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
    const DEFAULT_RESULTS_PER_PAGE = 25
    const [list, setList] = useState([...new Array(6)]);
    const address = "0x0F09aE2ba91449a7B4201721f98f482cAF9737Ee";
    const domainType = 'registrant';

    const {
        data: { networkId, isENSReady }
      } = useQuery(RESET_STATE_QUERY)
      const normalisedAddress = normaliseAddress(address)
      const pageQuery = ""
      const page = pageQuery ? parseInt(pageQuery) : 1
      const { block } = useBlock()
      let [resultsPerPage, setResultsPerPage] = useState(DEFAULT_RESULTS_PER_PAGE)
      let [etherScanAddr, setEtherScanAddr] = useState(null)
      let [activeSort, setActiveSort] = useState({
        type: 'expiryDate',
        direction: 'asc'
      })
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
      const { data: { favourites } = [] } = useQuery(GET_FAVOURITES)
      useEffect(() => {
        if (isENSReady) {
          getEtherScanAddr().then(setEtherScanAddr)
        }
      }, [isENSReady])
    
      if (error) {
        console.log(error)
        return <>Error getting domains. {JSON.stringify(error)}</>
      }
    
      if (loading) {
        // return <Loader withWrap large />
        return <p>Loading ...</p>
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
      // let sortedDomains = decryptedDomains.sort(getSortFunc(activeSort))
      let domains = decryptedDomains
      console.log("decryptedDomains", decryptedDomains);
      const selectedNames = Object.entries(checkedBoxes)
        .filter(([key, value]) => value)
        .map(([key]) => key)
    
      const allNames = domains
        .filter(d => d.domain.labelName)
        .map(d => d.domain.name)
    
      const selectAllNames = () => {
        const obj = allNames.reduce((acc, name) => {
          acc[name] = true
          return acc
        }, {})
    
        setCheckedBoxes(obj)
      }
    
      const hasNamesExpiringSoon = !!domains.find(domain =>
        calculateIsExpiredSoon(domain.expiryDate)
      )

    return (
        <div className="flex flex-wrap justify-even gap-2">
        {
            list.map((item, idx) => (
                <Collect key={idx}/>
            ))
        }
        </div>
    )
}

export default Collected;