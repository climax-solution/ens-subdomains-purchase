import axios from "axios";
import User from "../../components/user";
import Empty from "../../components/empty";
import { Combobox, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from "react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/outline";

const people = [
    { id: 1, name: 'Latest', isLatest: true },
    { id: 2, name: 'Oldest', isLatest: false },
]

const Users = ({ users }) => {

    const [selected, setSelected] = useState(people[0])
    const [query, setQuery] = useState('')
    const [walletAddress, setWalletAddress] = useState('');
    const [list, setList] = useState(users);

    const filteredPeople =
      query === ''
        ? people
        : people.filter((person) =>
            person.name
              .toLowerCase()
              .replace(/\s+/g, '')
              .includes(query.toLowerCase().replace(/\s+/g, ''))
    )

    useEffect(() => {
        filterUser();
    }, [walletAddress]);

    const filterUser = () => {
        if (walletAddress) {
            const filtered = users.filter(item => (normalize(item.address)).indexOf(normalize(walletAddress)) > -1);
            setList(filtered);
        }
        else setList(users);
    }

    const normalize = (str) => {
        return str.toLowerCase();
    }

    return (
        <div>
            <div className="flex flex-wrap gap-2 justify-center items-center mt-6">
                <input
                    type="text"
                    className="shadow-md border border-violet-300 text-white outline-0 py-2 px-4 rounded-full bg-transparent w-96"
                    placeholder="Search User...."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                />
            </div>
            <div className="flex flex-wrap gap-3 p-4">
                {
                    list.map((item, idx) => (
                        <User
                            key={idx}
                            address={item.address}
                        />
                    ))
                }
                {
                    !list.length && <Empty/>
                }
            </div>
        </div>
        
    )
}

export async function getStaticProps() {
    const users = await axios.post(`${process.env.backend}/users/get-list`).then(res => {
        const { list } = res.data;
        return list;
    }).catch(err => {
        return [];
    })

    return {
        props: {
            users
        }
    }
}

export default Users;