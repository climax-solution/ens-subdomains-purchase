import { useState } from "react";
import Collect from "../../components/collect";

const Collected = () => {

    const [list, setList] = useState([...new Array(4)]);
    return (
        <div className="flex flex-wrap gap-2">
        {
            list.map((item, idx) => (
                <Collect key={idx}/>
            ))
        }
        </div>
    )
}

export default Collected;