import axios from "axios";
import User from "../../components/user";
import Empty from "../../components/empty";
import { Combobox, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from "react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/outline";
import Loader from "../../components/loader";

const people = [
    { id: 1, name: 'Latest', isLatest: true },
    { id: 2, name: 'Oldest', isLatest: false },
]

const Users = () => {

    const [selected, setSelected] = useState(people[0])
    const [query, setQuery] = useState('')
    const [walletAddress, setWalletAddress] = useState('');
    const [users, setUsers] = useState([]);
    const [list, setList] = useState(users);
    const [isLoading, setLoading] = useState(true);

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

    useEffect(() => {
        async function getUser() {
            setLoading(true);
            const _users = await axios.post(`${process.env.backend}/users/get-list`).then(res => {
                const { list: _list } = res.data;
                return _list;
            }).catch(err => {
                return [];
            });

            setList(_users);
            setUsers(_users);
            setLoading(false);
        }

        getUser();
    }, [])

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
                    onChange={(e) => {if (!isLoading) setWalletAddress(e.target.value)} }
                />
            </div>
            <div className="flex flex-wrap gap-3 p-4">
                {
                    isLoading ? <Loader/>
                    : <>
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
                    </>
                }
                
            </div>
        </div>
        
    )
}

export default Users;