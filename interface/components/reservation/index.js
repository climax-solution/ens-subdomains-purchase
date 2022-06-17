import { useEffect, useState } from "react";
import { useAppContext } from "../../context/state";
import ReserveItem from "./item";

const Reservation = ({ label }) => {

    const { registrarContract } = useAppContext();
    const [name, setName] = useState('');
    const [list, setList] = useState([]);
    const [prices, setPrices] = useState({});

    useEffect(() => {
        async function getReserves() {
            const _domain = await registrarContract.methods.queryDomain(label).call();
            const reserves = await registrarContract.methods.queryReservesList(label).call();
            console.log(reserves);
            setName(_domain.name);
            setPrices(_domain.price);
            setList(reserves);
        }

        getReserves();
    }, [label])

    return (
        <>
            {
                list.map((item, idx) => {
                    return (
                        <ReserveItem
                            name={item}
                            prices={prices}
                            key={idx}
                            domain={name}
                        />
                    )
                })
            }
        </>
        
    )
}

export default Reservation;