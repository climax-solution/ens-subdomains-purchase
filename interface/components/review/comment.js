import { UserIcon } from "@heroicons/react/outline";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import Star from "./star";

const Comment = ({ data }) => {

    const [isLoading, setLoading] = useState(true);
    const [joinedDate, setJoinedDate] = useState('');

    useEffect(() => {
        if (data?.from) {
            fetchWriter();
        }
    }, [data]);

    const fetchWriter = async() => {
        setLoading(true);
        await axios.post(`${process.env.backend}/users/get-user`, { address: data.from}).then(res => {
            const { created_at } = res.data;
            setJoinedDate(created_at);
        }).catch(err => {

        });
        setLoading(false);
    }

    const shorten = (str, cut = 4) => {
        if (str) {
          const res = str.substr(0, cut) + '...' + str.substr(-cut);
          return res;
        }
        return "";
    }

    return (
        <article className="mt-4">
            <div className="flex items-center mb-4 space-x-4">
                <UserIcon className="bg-white w-14 h-14 rounded-full border-2 p-2"/>
                <div className="space-y-1 font-medium dark:text-white">
                    <p className="text-white flex flex-col gap-2"><span>{shorten(data.from)}</span> {isLoading ? <time className="animate-pulse w-48 h-4 bg-white rounded-md"/> : <time className="block text-sm text-sky-500 dark:text-sky-400">Joined on {moment(joinedDate).format('LLL')}</time>}</p>
                </div>
            </div>
            <Star
                gold={data?.star ? data.star : 0}
            />
            <footer className="mb-5 text-sm text-white dark:text-white"><p>Reviewed on <time className="font-bold">{moment(data.created_at).format('LLLL')}</time></p></footer>
            <p className="mb-2 font-light text-white dark:text-white p-4 border rounded-lg">{data.comment}</p>
            <div className="border-t border-2 my-12 border-gray-400"></div>
        </article>
    )
}

export default Comment;