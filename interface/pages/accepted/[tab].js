import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import Accept from '../../components/accept';
import Empty from '../../components/empty';
import Loader from '../../components/loader';
import { useAppContext } from "../../context/state";

const Accepted = () => {
    const { query } = useRouter();
    const { tab } = query;

    const { registrarContract, account } = useAppContext();
    const [list, setList] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [isUpdate, setUpdate] = useState(true);

    useEffect(() => {
        if (registrarContract) {
            setLoading(true);
            try {
                registrarContract.getPastEvents('NewRegistration', {
                    filter: { owner: account },
                    fromBlock: 10892100,
                    toBlock: 'latest'
                }, function(error, events) {
                    //console.log(events);
                    if (!error) {
                        if (tab == 'reserve') {
                            events = events.filter(({returnValues: item}) => item.reserver.toLowerCase() == account.toLowerCase());
                        }
                        else if (tab == 'request') {
                            events = events.filter(({returnValues: item}) => item.owner.toLowerCase() == account.toLowerCase());
                        }
                        else events = [];
                        setList(events);
                    }
                })
            } catch(ess) {
                //console.log(ess);
            }
            setLoading(false);
        }
    }, [registrarContract, tab, isUpdate]);

    return (
        <div className='p-4 flex flex-col gap-3'>
            {
                isLoading ? <Loader/>
                : <>
                    {
                        list.map((item, idx) => (
                            <Accept
                                data={item.returnValues}
                                key={idx}
                                tab={tab}
                                update={() => setUpdate(!isUpdate)}
                                startLoading={setLoading}
                            />
                        ))
                    }
                    {
                        !list.length && <Empty/>
                    }
                </>
            }
        </div>
    )
}

export default Accepted;