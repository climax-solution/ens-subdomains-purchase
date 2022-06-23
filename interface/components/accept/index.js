import { useEffect, useState } from 'react';
import moment from "moment";
import { NotificationManager} from 'react-notifications';
import { useAppContext } from "../../context/state";

const Accept = ({ data, update, tab, startLoading }) => {

    const { WEB3, account, registrarContract } = useAppContext();
    const [isLoading, setLoading] = useState(true);
    const [isAble, setAble] = useState(false);
    const [expire, setExpire] = useState();

    useEffect(() => {
        async function checkAble() {
            setLoading(true);
            const domain_label = WEB3.utils.sha3(data.domain);
            const state = await registrarContract.methods.getReserveIndex(domain_label, data.subdomain).call();
            setExpire(state.expiration);

            if (tab == "reserve" && lowercase(account) == lowercase(state.owner) && state.price == data.price && state.createdAt == data.createdAt) setAble(true);
            else {
                if (lowercase(state.owner) != "0x0000000000000000000000000000000000000000" && state.createdAt == data.createdAt) setAble(true);
                else setAble(false);
            }
            setLoading(false);
        }
        if (registrarContract) {
            checkAble();
        }
    }, [data, registrarContract])

    const removeSubDomain = async() => {
        startLoading(true);

        try {
            const { timestamp } = await WEB3.eth.getBlock('latest');
            const domain_label = WEB3.utils.sha3(data.domain);
            const state = await registrarContract.methods.getReserveIndex(domain_label, data.subdomain).call();
            if (state.expiration > timestamp && lowercase(account) == lowercase(state.owner) || state.expiration < timestamp) {
                await registrarContract.methods.removeSubdomain(domain_label, data.subdomain).send({
                    from: account
                });
                NotificationManager.success("Success");
            } else {
                NotificationManager.warning("Not available");
            }

        } catch(err) {

        }
        startLoading(false);
        update();
    }

    const lowercase = (str) => {
        return str.toLowerCase();
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
                ) :
                <>
                    {
                        !Object.keys(data).length ? <></>
                        :
                        <div
                            className="flex w-full items-center justify-between rounded-lg bg-white px-4 py-2 text-left text-sm font-medium text-purple-900 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 cursor-pointer h-20"
                        >
                            <div className='flex gap-8 items-center'>
                                <span className="text-xl font-bold">{data.subdomain}</span>
                                <span>{data.domain}.eth</span>
                                <span>{ tab == "request" ? data.reserver : data.owner }</span>
                                <span>{ WEB3.utils.fromWei(data.price)} ETH</span>
                                <span className='font-bold'>{ isAble ? moment(expire * 1000).format('MMMM Do YYYY, h:mm:ss a') : "Expired"}</span>
                            </div>
                            { isAble && <div className='flex gap-3'>
                                <button
                                    className="p-5 border-2 border-rose-200 hover:border-rose-400 rounded-full"
                                    onClick={removeSubDomain}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div> }
                        </div>
                    }
                </>
            }
        </>
    )
}

export default Accept;