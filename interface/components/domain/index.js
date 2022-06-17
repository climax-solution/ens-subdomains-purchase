import { useState, Fragment, useRef, useEffect } from "react";
import axios from "axios";
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/outline'
import { useAppContext } from "../../context/state";
import Link from "next/link";

const Domain = ({ labelhash }) => {

    const { registrarContract, network } = useAppContext();

    const [isOpen, setOpenModal] = useState(false);
    const [info, setInfo] = useState({});
    const [isLoading, setLoading] = useState(false);
    const cancelButtonRef = useRef(null)

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            await axios.get(`https://metadata.ens.domains/${network}/${process.env.ENSDomain}/${labelhash}`).then(res => {
                setInfo(res.data);
            }).catch(err => {
                console.log(err);
            });
            setLoading(false);
        }
        if (registrarContract && labelhash) fetchData();
    }, [registrarContract, labelhash]);

    return (
        <>
            {
                isLoading ? <h2>Loading....</h2>
                :
                (
                    Object.keys(info).length &&
                    <div className="sm:max-w-xs bg-white rounded-lg border border-gray-100 shadow-md dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex flex-col items-center pb-10">
                            <span className="w-full aspect-square">
                                <img
                                    src={info.image}
                                    className="w-full"
                                    alt=""
                                />
                            </span>
                            <h5 className="mb-1 mt-5 text-xl font-medium text-gray-900 dark:text-white">{info.name}</h5>
                            <div className="flex mt-4 space-x-3 lg:mt-6">
                                <Link href={`/reserve/${info.name}`}>
                                    <a className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">Reserve</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Domain;