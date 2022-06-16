import { useState, Fragment, useRef, useEffect } from "react";
import { Dialog, Transition } from '@headlessui/react'
import { CloudUploadIcon } from '@heroicons/react/outline'
import axios from "axios";
import { gql, useQuery } from "@apollo/client";
import getWeb3 from "../../utility/getWeb3";
import { useAppContext } from "../../context/state";

const NETWORK_INFORMATION_QUERY = gql`
  query getNetworkInfo @client {
    accounts
    isReadOnly
    isSafeApp
    avatar
    network
    displayName
  }
`

const Collect = ({ ite, name, id }) => {

    const { account, domainContract, regisrarContract } = useAppContext();

    const [isOpen, setOpenModal] = useState(false);
    const [avatar, setAvatar] = useState("https://openseauserdata.com/files/66b5f0d3387b8fc662a2d6d19468c863.svg");
    const cancelButtonRef = useRef(null);

    const [oneM, setOneM] = useState('');
    const [sixM, setSixM] = useState('');
    const [oneY, setOneY] = useState('');
    const [forever, setForever] = useState('');

    const {
        data: { network }
    } = useQuery(NETWORK_INFORMATION_QUERY)

    useEffect(() => {
        if (name && network) {
            fetchAvatar();
        }
    }, [name, network]);

    useEffect(() => {
        async function get() {
            await getWeb3();
        }
        
        get();

    }, []);

    const fetchAvatar = async() => {
        await axios.get(`https://metadata.ens.domains/${network}/${process.env.ENSDomain}/${id}`).then(res => {
            const { image } = res.data;
            if (image) setAvatar(image);
        }).catch(err => {
            console.log(err);
        });
    }

    const listDomain = async() => {
        if (domainContract && regisrarContract && account ) {
            const allowance = await domainContract.methods.getApproved(id.toString(0)).call();
            console.log(allowance);
            if (allowance.toLowerCase() != process.env.Registrar.toLowerCase()) {
                await domainContract.methods.approve(process.env.Registrar, id.toString(10)).send({
                    from: account
                });
            }

            const prices = [
                convertToEth(oneM),
                convertToEth(sixM),
                convertToEth(oneY),
                convertToEth(forever)
            ];

            const list_fee = await regisrarContract.methods.list_fee().call();

            await regisrarContract.methods.configureDomainFor(id, prices).send({
                from: account,
                value: list_fee
            });
        }
    }

    const convertToEth = (price) => {
        return WEB3.utils.toWei(price, 'ether');
    }

    const closeModal = () => {
        setOneM('');
        setSixM('');
        setOneY('');
        setForever('');
        setOpenModal(false);
    };

    return (
        <>
            <div className="sm:max-w-xs bg-white rounded-lg border border-gray-100 shadow-md dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-col items-center pb-10">
                    <span className="w-full aspect-square">
                        <img
                            src={avatar}
                            className="w-full"
                            alt=""
                        />
                    </span>
                    <h5 className="mb-1 mt-5 text-xl font-medium text-gray-900 dark:text-white">{name}</h5>
                    <div className="flex mt-4 space-x-3 lg:mt-6">
                        <a href="#" className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => setOpenModal(true)}>List</a>
                        <a href="#" className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">Delist</a>
                    </div>
                </div>
            </div>

            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <CloudUploadIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                            </div>
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                    List Domain
                                                </Dialog.Title>
                                                <div className="mt-2 mb-4">
                                                    <p className="text-sm text-gray-500">
                                                    Are you sure you want to deactivate your account? All of your data will be permanently
                                                    removed. This action cannot be undone.
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="number"
                                                            className="border-2 p-4 pr-28 rounded-md  focus-visible:border-indigo-500 shadow-sm sm:text-sm border-gray-300 w-full outline-0 rounded-md col-span-6"
                                                            value={oneM}
                                                            onChange={(e) => setOneM(e.target.value)}
                                                        />
                                                        <span className="absolute right-2 p-2 border-2 rounded-lg shadow-md w-24 text-center">1 month</span>
                                                    </div>
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="number"
                                                            className="border-2 p-4 pr-28 rounded-md  focus-visible:border-indigo-500 shadow-sm sm:text-sm border-gray-300 w-full outline-0 rounded-md col-span-6"
                                                            value={sixM}
                                                            onChange={(e) => setSixM(e.target.value)}                                                        />
                                                        <span className="absolute right-2 p-2 border-2 rounded-lg shadow-md w-24 text-center">6 months</span>
                                                    </div>
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="number"
                                                            className="border-2 p-4 pr-28 rounded-md  focus-visible:border-indigo-500 shadow-sm sm:text-sm border-gray-300 w-full outline-0 rounded-md col-span-6"
                                                            value={oneY}
                                                            onChange={(e) => setOneY(e.target.value)}
                                                        />
                                                        <span className="absolute right-2 p-2 border-2 rounded-lg shadow-md w-24 text-center">1 year</span>
                                                    </div>
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="number"
                                                            className="border-2 p-4 pr-28 rounded-md  focus-visible:border-indigo-500 shadow-sm sm:text-sm border-gray-300 w-full outline-0 rounded-md col-span-6"
                                                            value={forever}
                                                            onChange={(e) => setForever(e.target.value)}
                                                        />
                                                        <span className="absolute right-2 p-2 border-2 rounded-lg shadow-md w-24 text-center">Forever</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <button
                                            type="button"
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                            onClick={listDomain}
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                            onClick={closeModal}
                                            ref={cancelButtonRef}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}

export default Collect;