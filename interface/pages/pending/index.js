import { useEffect, useState } from 'react';
import Reservation from '../../components/reservation';
import { useAppContext } from '../../context/state';

const PendingList = () => {
    const [list, setList] = useState([]);
    const { account, registrarContract } = useAppContext();

    useEffect(() => {
        async function getLabels() {
            const labels = await registrarContract.methods.queryLabels(account).call();
            setList(labels);
        }
        if (account) {
            getLabels();
        }

    }, [registrarContract]);

    console.log("labels", list);
    return (
        <div className='flex flex-col gap-3'>
            {
                list.map((item, idx) => (
                    <Reservation key={idx} label={item}/>
                ))
            }
        </div>
    )
}

export default PendingList;