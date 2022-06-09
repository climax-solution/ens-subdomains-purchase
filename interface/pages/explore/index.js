import { useState } from "react";
import Domain from "../../components/domain";

const ExploreDomains = () => {

    const [domains, setDomains] = useState([...new Array(8)])
    return (
        <div className="flex flex-wrap gap-2">
            {
                domains.map((item, idx) => (
                    <Domain key={idx} ite={idx}/>
                ))
            }
        </div>
    )
}

export default ExploreDomains;