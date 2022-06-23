import { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useAppContext } from "../../context/state";

const ReserveItem = ({ data, tab, startLoading, update }) => {

    const { WEB3, account, registrarContract } = useAppContext();
    const [isLoading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [prices, setPrices] = useState({});
    const [resolver, setResolver] = useState('');

    useEffect(() => {
        async function getReserves() {
            setLoading(true);
            const _domain = await registrarContract.methods.queryDomain(data.domain).call();
            const _resolver = await WEB3.eth.ens.getResolver(_domain.name + '.eth');
            
            console.log("_resolver", _resolver, _domain)
            setResolver(_resolver._address);
            setName(_domain.name);
            setPrices(_domain.price);
            setLoading(false);
        }

        getReserves();
    }, [data])

    
    const confirmSubdomain = async() => {
        if (!account) {
            NotificationManager.warning("Please connect wallet");
            return;
        }
        startLoading(true);
        try {
            await registrarContract.methods.register(data.domain, data.name, resolver).send({
                from: account
            });
            NotificationManager.success("Success");

        } catch(err) {
            console.log(err);
        }
        startLoading(false);
        update();
    }

    const declineSubdomain = async() => {
        startLoading(true);
        try {
            await registrarContract.methods.declineSubdomain(data.domain, data.name).send({
                from: account
            });
            NotificationManager.success("Success");
        } catch(err) {
            console.log(err);
        }
        startLoading(false);
        update();
    }

    return (
        <>
        {
            isLoading ? (
                <div
                    className="flex w-full items-center justify-between rounded-lg bg-white px-4 py-2 text-left text-sm font-medium text-purple-900 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 cursor-pointer py-7"
                >
                    <div className='flex gap-8 items-center w-full animate-pulse'>
                        <span className="bg-blue-300 h-4 w-11/12 rounded-lg"></span>
                        <span className="bg-blue-300 h-4 w-11/12 rounded-lg"></span>
                        <span className="bg-blue-300 h-4 w-11/12 rounded-lg"></span>
                        <span className="bg-blue-300 h-4 w-11/12 rounded-lg"></span>
                    </div>
                </div>
            )
            :
            <>
                {
                    !Object.keys(data).length ? <></>
                    :
                    <div
                        className="flex w-full items-center justify-between rounded-lg bg-white px-4 py-2 text-left text-sm font-medium text-purple-900 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 cursor-pointer"
                    >
                        <div className='flex gap-8 items-center'>
                            <span className="text-xl font-bold">{data.name}</span>
                            <span>{data.owner}</span>
                            <span>{ prices[data.subscription] ? WEB3.utils.fromWei(`${prices[data.subscription]}`): 0} ETH</span>
                            <span>{name}.eth</span>
                        </div>
                        <div className='flex gap-3'>
                            {
                                tab == 'request' && <button
                                    className="p-5 border-2 border-sky-200 hover:border-sky-400 rounded-full"
                                    onClick={confirmSubdomain}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </button>
                            }
                            <button
                                className="p-5 border-2 border-rose-200 hover:border-rose-400 rounded-full"
                                onClick={declineSubdomain}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                }
            </>
        }
        </>
    )
}

export default ReserveItem;