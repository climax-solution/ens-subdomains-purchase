import { useEffect, useState } from "react";
import { useQuery  } from '@apollo/client'
import moment from "moment";
import Collect from "../../components/collect";
import {
    GET_DOMAINS_SUBGRAPH,
    GET_REGISTRATIONS_SUBGRAPH,
    GET_ERRORS
} from '../../utility/graphql/queries'
import {
  normaliseOrMark
} from '../../utility/utils/utils'
import { decryptName, checkIsDecrypted } from '../../utility/api/labels'
import { useBlock } from "../../utility/hooks";
import Loader from "../../components/loader";
import { useAppContext } from "../../context/state";
import Empty from "../../components/empty";

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
  const registrationsQuery = useQuery (GET_REGISTRATIONS_SUBGRAPH, {
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

  const controllersQuery = useQuery (GET_DOMAINS_SUBGRAPH, {
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


const Domains = () => {

  const { WEB3, account, registrarContract } = useAppContext();
  const domainType = 'registrant';

  const [list, setList] = useState([]);
  const [isUpdated, setUpdated] = useState(true);
  let [resultsPerPage] = useState(25);
  let [activeSort] = useState({
    type: 'expiryDate',
    direction: 'asc'
  })

  useEffect(() => {
    if (registrarContract && account) {
      fetchListedDomains();
    }
  },[registrarContract, isUpdated]);

  const fetchListedDomains = async() => {
    const domains = await registrarContract.methods.queryEntireDomains().call();

    let _list = [];
    for (let i = 0; i < domains.length; i ++) {
      if ((domains[i].owner).toLowerCase() == account.toLowerCase()) {
        const domain = domains[i];
        _list.push({
          name: domain.name + '.eth',
          listed: true,
          labelName: domain.name,
          labelhash: WEB3.utils.sha3(domain.name)
        });
      }
    };
    setList(_list);

  }

    const normalisedAddress = normaliseAddress(account)
    const pageQuery = ""
    const page = pageQuery ? parseInt(pageQuery) : 1
    const { block } = useBlock()

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
  
    const { loading, data, error } = useDomains({
      resultsPerPage,
      domainType,
      address: normalisedAddress,
      sort: activeSort,
      page,
      expiryDate
    })
  
    const {
      data: { globalError }
    } = useQuery (GET_ERRORS)
  
    if (error) {
      return <>Error getting domains. {JSON.stringify(error)}</>
    }

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
      return <h2>{globalError.invalidCharacter}</h2>
    }

    let domains = decryptedDomains
    domains = domains.map((item) => {
      const filtered = list.filter((_list) => _list.labelhash == item.domain.labelhash);
      if (filtered.length) return { ...item, domain: { listed: true, ...item.domain } };
      return { ...item, domain: { listed: false, ...item.domain } };
    });

    return (
        <div className="flex flex-wrap justify-even gap-2 p-10">
        {
            domains.map(({domain: item}, idx) => (
                <Collect
                  key={idx}
                  name={item.name}
                  labelName={item.labelName}
                  listed={item.listed}
                  id={item.labelhash.toString(10)}
                  update={() => setUpdated(!isUpdated)}
                />
            ))
        }

        { !domains.length && <Empty/> }
        </div>
    )
}

const Collected = () => {
  const { account } = useAppContext();
  
  return (
    <>
      {
        account ? <Domains/> : <h2>EMPTY</h2>
      }
    </>
  )
}

export default Collected;