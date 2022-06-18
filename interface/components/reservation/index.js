import { useEffect, useState } from "react";
import { useAppContext } from "../../context/state";
import ReserveItem from "./item";

const Reservation = ({ label }) => {

    const { WEB3, registrarContract } = useAppContext();
    const [name, setName] = useState('');
    const [list, setList] = useState([]);
    const [prices, setPrices] = useState({});
    const [resolver, setResolver] = useState('');

    useEffect(() => {
        async function getReserves() {
            const _domain = await registrarContract.methods.queryDomain(label).call();
            const reserves = await registrarContract.methods.queryReservesList(label).call();
            const _resolver = await WEB3.eth.ens.getResolver(_domain.name + '.eth');
            
            // console.log("_resolver", _resolver)
            setResolver(_resolver._address);
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
                            resolver={resolver}
                        />
                    )
                })
            }
        </>
        
    )
}

export default Reservation;