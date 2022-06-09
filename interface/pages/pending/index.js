import { useState } from 'react';
import Reservation from '../../components/reservation';

const PendingList = () => {
    const [list, setList] = useState([...new Array(5)]);

    return (
        <div className='flex flex-col gap-3'>
            {
                list.map((item, idx) => (
                    <Reservation key={idx}/>
                ))
            }
        </div>
    )
}

export default PendingList;