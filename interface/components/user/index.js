import { SearchIcon, UserIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import Link from "next/link";
import Star from "../review/star";
import axios from "axios";

const User = ({ address }) => {

    const [star, setStar] = useState(0);
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        const fetchReviews = async() => {
            setLoading(true);
            const _list = await axios.post(`${process.env.backend}/reviews/get-list`, { address }).then(res => {
                const { list } = res.data;
                return list;
            }).catch(err => {
                return [];
            });
            let star_sum = 0;
            _list.map(item => star_sum += parseInt(item.star) /_list.length );
            setStar(star_sum);
            setLoading(false);
        }
        fetchReviews();
    }, [address]);

    const shorten = (str, cut = 4) => {
        if (str) {
          const res = str.substr(0, cut) + '...' + str.substr(-cut);
          return res;
        }
        return "";
    }

    return (
        <div className="w-52 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 px-3">
            <div className="flex flex-col items-center pb-10 mt-10">
                <UserIcon className="mb-3 w-24 h-24 rounded-full border-2 p-2"/>
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{shorten(address)}</h5>
                <div className="flex items-center">
                    {
                        isLoading ? <span className="animate-pulse w-32 h-4 bg-gray-400 rounded-md inline-block"/>
                        : <Star gold={star}/>
                    }
                    
                </div>
                <div className="flex mt-4 space-x-3 lg:mt-6">
                    <Link href={`/review/${address}`}>
                        <a className="inline-flex items-center p-4 text-sm font-medium text-center text-gray-900 bg-white rounded-full border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">
                            <SearchIcon className="w-4 h-4"/>
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default User;