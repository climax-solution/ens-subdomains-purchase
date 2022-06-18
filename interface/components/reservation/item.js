import { useEffect, useState } from "react";
import { useAppContext } from "../../context/state";

const ReserveItem = ({ name, prices, domain, resolver }) => {

    const { WEB3, account, registrarContract } = useAppContext();
    const [info, setInfo] = useState({});
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchReserveItem() {
            setLoading(true);
            const item = await registrarContract.methods.queryReserves(name).call();
            setInfo(item);
            setLoading(false);
        }

        fetchReserveItem();
    }, [name, registrarContract])

    
    const confirmSubdomain = async() => {
        try {
            await registrarContract.methods.register(info.domain, name, resolver).send({
                from: account
            });

        } catch(err) {
            console.log(err);
        }
    }

    return (
        <>
        {
            isLoading ? <h2>Loading</h2>
            :
            <>
                {
                    !Object.keys(info).length ? <></>
                    :
                    <div
                        className="flex w-full items-center justify-between rounded-lg bg-white px-4 py-2 text-left text-sm font-medium text-purple-900 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 cursor-pointer"
                    >
                        <div className='flex gap-8 items-center'>
                            <span className="text-xl font-bold">{name}</span>
                            <span>{info.owner}</span>
                            <span>{ prices[info.subscription] ? WEB3.utils.fromWei(`${prices[info.subscription]}`): 0} ETH</span>
                            <span>{domain}.eth</span>
                        </div>
                        <div className='flex gap-3'>
                            <button
                                className="p-5 border-2 border-sky-200 hover:border-sky-400 rounded-full"
                                onClick={confirmSubdomain}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                            <button className="p-5 border-2 border-rose-200 hover:border-rose-400 rounded-full">
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