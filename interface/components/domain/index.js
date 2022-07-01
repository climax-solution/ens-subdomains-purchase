import { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../../context/state";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/outline";
import Star from "../review/star";

const Domain = ({ labelhash, owner }) => {

    const { registrarContract, network } = useAppContext();

    const [info, setInfo] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [isRateGetting, setRateGetting] = useState(true);
    const [star, setStar] = useState(0);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            await axios.get(`https://metadata.ens.domains/${network}/${process.env.ENSDomain}/${labelhash}`).then(res => {
                setInfo(res.data);
            }).catch(err => {
                //console.log(err);
            });
            setLoading(false);
        }
        if (registrarContract && labelhash) fetchData();
    }, [registrarContract, labelhash]);

    useEffect(() => {
        async function getStar() {
            setRateGetting(true);
            await axios.post(`${process.env.backend}/users/create-new-user`, { address: owner}).then(res => {}).catch(err => {});
            const _list = await axios.post(`${process.env.backend}/reviews/get-list`, { address: owner}).then(res => {
                const { list } = res.data;
                return list;
            }).catch(err => {
                return [];
            });
            let star_sum = 0;
            _list.map(item => star_sum += parseInt(item.star) /_list.length );
            setStar(Math.round(star_sum));
            setRateGetting(false);
        }
        getStar();
    }, [owner]);

    const shorten = (str, cut = 4) => {
        if (str) {
          const res = str.substr(0, cut) + '...' + str.substr(-cut);
          return res;
        }
        return "";
    }

    return (
        <>
            {
                isLoading ?
                <div className="xs:max-w-15rem inline-block w-full bg-white rounded-lg border border-gray-100 shadow-md dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex flex-col w-full items-center pb-10 animate-pulse">
                        <span className="w-full aspect-square bg-gray-300"/>
                        <div className="mb-1 mt-5 h-8 bg-gray-300 w-4/6 rounded-lg "/>
                        <div className="py-2 px-4 text-sm font-medium text-center bg-gray-300 bg-white rounded-lg w-4/6 h-8"/>
                    </div>
                </div>
                :
                (
                    Object.keys(info).length &&
                    <div className="xs:max-w-15rem inline-block w-full bg-white rounded-lg border border-gray-100 shadow-md dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex flex-col items-center pb-10">
                            <span className="w-full aspect-square">
                                <img
                                    src={info.image}
                                    className="w-full"
                                    alt=""
                                />
                            </span>
                            <h5 className="mb-1 mt-5 text-xl font-medium text-gray-900 dark:text-white">{info.name}</h5>
                            <div className="flex mt-2 space-x-3 lg:mt-2">
                                <Link href={`/reserve/${info.name}`}>
                                    <a className="inline-flex items-center py-2 px-7 text-sm font-medium text-center text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">Reserve</a>
                                </Link>
                            </div>
                            <div className="mt-2 flex gap-2 items-center p-2 border rounded-lg">
                                <UserIcon className="w-4 h-4"/>
                                <Link href={`/review/${owner}`}>
                                    <a className="text-black text-sm hover:text-sky-600">{shorten(owner)}</a>
                                </Link>
                            </div>
                            <div className="mt-3">
                                { isRateGetting ? <span className="w-24 h-3 animate-pulse bg-gray-400 inline-block rounded-md"/> : <Star gold={star}/> }
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Domain;