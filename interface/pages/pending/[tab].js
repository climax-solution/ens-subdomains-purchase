import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Empty from '../../components/empty';
import Loader from '../../components/loader';
 import ReserveItem from '../../components/reservation/item';
import { useAppContext } from '../../context/state';

const PendingList = () => {
    const { query } = useRouter();
    const { tab } = query;

    const { account, registrarContract, WEB3 } = useAppContext();
    const [list, setList] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [isUpdate, setUpdate] = useState(true);

    useEffect(() => {
        async function getReserves() {
            setLoading(true);
            let reserves = await registrarContract.methods.queryReservesList().call();
            reserves = [...reserves];
            if (tab == 'reserve') { 
                reserves = reserves.filter(item => item.owner.toLowerCase() == account.toLowerCase());
            }
            
            else if (tab == 'request') {
                let domains = await registrarContract.methods.queryEntireDomains().call();
                domains = [...domains];
                domains = domains.filter(item => item.owner.toLowerCase() == account.toLowerCase());
                reserves = reserves.filter(item => {
                    const filtered = domains.filter(domain => WEB3.utils.sha3(domain.name) == item.domain);
                    if (filtered.length) return true;
                    return false;
                })
            }
            else reserves = [];

            setList(reserves);
            setLoading(false);
        }
        if (account) {
            getReserves();
        }

    }, [registrarContract, tab, isUpdate]);

    return (
        <div className='flex flex-col gap-3 p-4'>
            {
                isLoading ? <Loader/>
                : <>
                    {
                        list.map((item, idx) => (
                            <ReserveItem
                                key={idx}
                                data={item}
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

export default PendingList;