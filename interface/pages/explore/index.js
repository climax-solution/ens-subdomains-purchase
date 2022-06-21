import { useEffect, useState } from "react";
import Domain from "../../components/domain";
import Loader from "../../components/loader";
import { useAppContext } from '../../context/state';

const ExploreDomains = () => {
  
    const [domains, setDomains] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const { WEB3, registrarContract } = useAppContext();

    useEffect(() => {
      if (registrarContract) {
        fetchDomains();
      }
    }, [registrarContract]);

    const fetchDomains = async() => {
      setLoading(true);
      let _domains = await registrarContract.methods.queryEntireDomains().call();
      console.log(_domains);
      _domains = [..._domains];
      setDomains(_domains);
      setLoading(false);
    }

    return (
        <div className="flex flex-wrap gap-2 p-4">
            {
              isLoading ? <Loader/>
              :<>
                {
                  domains.map((item, idx) => (
                      <Domain
                        key={idx}
                        labelhash={WEB3.utils.sha3(item.name)
                      }/>
                  ))
                }
              </>
            }
        </div>
    )
}

export default ExploreDomains;