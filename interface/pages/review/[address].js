import { PencilAltIcon, UserIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import Star from "../../components/review/star";
import { useAppContext } from "../../context/state";
import { Dialog, Transition } from '@headlessui/react'
import Comment from "../../components/review/comment";
import { NotificationManager } from "react-notifications";
import Empty from "../../components/empty";
import ReviewLoader from "../../components/loader/review";
import GearLoading from "../../components/loader/gear";

const Review = () => {
    const { query } = useRouter();
    const { WEB3, account, registrarContract } = useAppContext();

    const [reviews, setReviews] = useState([]);
    const [star, setStar] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const [isProcess, setProcess] = useState(false);
    const [isOpen, setOpen] = useState(false);
    const [activeStar, setActiveStar] = useState(0);
    const [subdomain, setSubdomain] = useState('');
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (query.address && WEB3) {
            fetchReviews();
        }

    }, [query, WEB3]);

    const normalize = (str) => {
        return str.toLowerCase();
    }

    const fetchReviews = async() => {
        const isAddress = WEB3.utils.isAddress(query.address);
        if (isAddress) {
            setLoading(true);
            await axios.post(`${process.env.backend}/users/create-new-user`, { address: query.address}).then(res => {}).catch(err => {});
            const _list = await axios.post(`${process.env.backend}/reviews/get-list`, { address: query.address}).then(res => {
                const { list } = res.data;
                return list;
            }).catch(err => {
                return [];
            });
            let star_sum = 0;
            _list.map(item => star_sum += parseInt(item.star) /_list.length );
            setReviews(_list);
            setStar(star_sum);
            setLoading(false);
        }
        else setLoading(false);
    }
    
    const handleStar = (idx) => {
        setActiveStar(idx);
    }

    const leftReview = async() => {
        if (!activeStar) {
            NotificationManager.warning('Please choose rate');
            return;
        }
        if (!subdomain) {
            NotificationManager.warning('Please input subdomain');
            return;
        }
        if (!comment) {
            NotificationManager.warning('Please input comment');
            return;
        }

        setProcess(true);
        const list = await registrarContract.getPastEvents('NewRegistration', {
            filter: { owner: account },
            fromBlock: 15020207,
            toBlock: 'latest'
        }).then((events) => {
            let result = [];
            events.map(({ returnValues: item}) => {
                if (item.subdomain == subdomain && normalize(item.reserver) == normalize(account) && normalize(query.address) == normalize(item.owner)) result.push(item);
            });
            return result;
        });
        if (!list.length) {
            NotificationManager.warning("Can't find your past reservations");
            setProcess(false);
            return;
        }
        try {
            const msgParams = JSON.stringify({
                domain: {
                    chainId: 1,
                    name: 'ENS Express for subdomain',
                    verifyingContract: process.env.Registrar,
                    version: '1'
                },
            
                message: {
                    star: activeStar,
                    from: account,
                    to: query.address,
                    subdomain: subdomain,
                    comment: comment
                },
                primaryType: 'Review',
                types: {
                    EIP712Domain: [
                        { name: 'name', type: 'string' },
                        { name: 'version', type: 'string' },
                        { name: 'chainId', type: 'uint256' },
                        { name: 'verifyingContract', type: 'address' }
                    ],
                    Review: [
                        { name: 'star', type: 'uint256' },
                        { name: 'from', type: 'address' },
                        { name: 'to', type: 'address' },
                        { name: 'subdomain', type: 'string' },
                        { name: 'comment', type: 'string' },
                    ],
                },
            });
        
            var params = [account, msgParams];
            var method = 'eth_signTypedData_v3';
            WEB3.currentProvider.sendAsync({
                method,
                params,
                from: account,
            }, async(err, result) => {
                if (err) throw Error();
                const review_data = {
                    star: activeStar,
                    from: account,
                    to: query.address,
                    subdomain: subdomain,
                    comment: comment,
                    signature: result.result
                }
                await axios.post(`${process.env.backend}/reviews/leave-review`, review_data).then(res => {
                    NotificationManager.success('Left review successfully!');
                }).catch(errs => {
                    NotificationManager.error('Failed');
                });
            })
        } catch(err) {
            console.log(err);
        }
        closeModal();
        setProcess(false);
    }

    const closeModal = () => {
        setOpen(false);
        setStar(0);
        setSubdomain('');
        setComment('');
    }

    const shorten = (str, cut = 4) => {
        if (str) {
          const res = str.substr(0, cut) + '...' + str.substr(-cut);
          return res;
        }
        return "";
    }

    console.log("isLoading", isLoading);
    return (
        <>
            { isProcess ? <GearLoading/> : "" }
            <div className="flex flex-col gap-3 p-4">
                <div className="flex flex-wrap gap-2 md:px-12 px-4 mt-24 items-center justify-center lg:justify-between sticky top-0">
                    <div className="flex items-center gap-3 ">
                        <UserIcon className="w-24 h-24 rounded-full border-2 p-2 bg-white"/>
                        <div className="flex flex-col gap-3">
                            <span className="text-white hidden md:inline-block">{query.address}</span>
                            <span className="text-white inline-block md:hidden">{shorten(query.address)}</span>
                            <Star
                                gold={Math.round(star)}
                            />
                        </div>
                    </div>
                    {
                        (account && query.address.toLowerCase() != account?.toLowerCase()) ? (
                            <button
                                className="border p-3 text-white rounded-lg hover:shadow-lg hover:bg-indigo-500 flex items-center gap-2"
                                onClick={() => setOpen(true)}
                            ><PencilAltIcon className="w-6 h-6"/><span>Write Review</span></button>
                        ) : ""
                    }
                </div>
                <div className="px-8 mt-8 flex flex-col gap-3">
                    {
                        isLoading ? <>
                            {
                                [...Array(3)].map((item, idx) => (
                                    <ReviewLoader key={idx}/>
                                ))
                            }
                        </>
                        : <>
                            {
                                reviews.map((item, idx) => {
                                    return (
                                        <Comment
                                            key={idx}
                                            data={item}
                                        />
                                    )
                                })
                            }
                            {
                                !reviews.length && <Empty/>
                            }
                        </>
                    }
                    
                </div>
                <Transition.Root show={isOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-10"
                        initialFocus={null}
                        onClose={() => {}}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" />
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
                                                    <PencilAltIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                                </div>
                                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                        Leave Review
                                                    </Dialog.Title>
                                                </div>                                           
                                            </div>
                                            <div className="flex gap-3 justify-center cursor-pointer">
                                                
                                                {
                                                    [...Array(5)].map((item, idx) => (
                                                        <svg className={"w-12 h-12 " + (activeStar > idx ? "text-yellow-500" : "text-gray-500")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" onMouseOver={() => handleStar(idx + 1)} key={idx}>
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))
                                                }
                                            </div>
                                            <input
                                                type="text"
                                                className="border p-4 pr-28 focus-visible:border-indigo-500 shadow-sm sm:text-sm w-full outline-0 rounded-md mt-4"
                                                placeholder="Please input subdomain name"
                                                value={subdomain}
                                                onChange={(e) => setSubdomain(e.target.value)}
                                                onBlur={() => setSubdomain(subdomain.trim())}
                                            />
                                            <textarea
                                                className="border p-4 pr-28 focus-visible:border-indigo-500 shadow-sm sm:text-sm w-full outline-0 rounded-md mt-4"
                                                placeholder="Leave your comment ...."
                                                rows="5"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                onBlur={() => setComment(comment.trim())}
                                            />
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                            <button
                                                type="button"
                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                onClick={leftReview}
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                                onClick={closeModal}
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
            </div>
        </>
    )
}

export default Review;