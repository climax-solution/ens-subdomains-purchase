import { useEffect, useState } from "react";
import Domain from "../../components/domain";
import Loader from "../../components/loader";
import { useAppContext } from '../../context/state';

const ExploreDomains = () => {
    const [domains, setDomains] = useState([]);
    const { registrarContract } = useAppContext();

    useEffect(() => {
      if (registrarContract) {
        fetchDomains();
      }
    }, [registrarContract]);

    const fetchDomains = async() => {
      const _domains = await registrarContract.methods.queryEntireDomains().call();
      console.log(_domains);
      setDomains(_domains);
    }

    return (
        <div className="flex flex-wrap gap-2 p-4">
            {
                domains.map((item, idx) => (
                    <Domain key={idx} labelhash={item}/>
                ))
            }
        </div>
    )
}

export default ExploreDomains;