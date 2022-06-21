import { useEffect, useState } from "react";
import { useAppContext } from "../../context/state";
import ReserveItem from "./item";

const Reservation = ({ data }) => {

    const { WEB3, registrarContract } = useAppContext();
    const [name, setName] = useState('');
    const [list, setList] = useState([]);
    const [prices, setPrices] = useState({});
    const [resolver, setResolver] = useState('');

    useEffect(() => {
        async function getReserves() {
            const _domain = await registrarContract.methods.queryDomain(data.domain).call();
            const _resolver = await WEB3.eth.ens.getResolver(_domain.name + '.eth');
            
            console.log("_resolver", _resolver, _domain)
            setResolver(_resolver._address);
            setName(_domain.name);
            setPrices(_domain.price);
        }

        getReserves();
    }, [data])

    return (
        <>
            <ReserveItem
                name={data.name}
                prices={prices}
                domain={name}
                resolver={resolver}
            />
        </>
        
    )
}

export default Reservation;