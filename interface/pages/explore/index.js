import { useEffect, useState, Fragment } from "react";
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

import Domain from "../../components/domain";
import Loader from "../../components/loader";
import { useAppContext } from '../../context/state';
import Empty from "../../components/empty";
import Pagination from "../../components/pagination";
import { useRouter } from "next/router";

const people = [
  { id: 1, name: 'Latest', isLatest: true },
  { id: 2, name: 'Oldest', isLatest: false },
]

const ExploreDomains = () => {
  
    const { WEB3, registrarContract } = useAppContext();
    const { query: querys } = useRouter();
    const [domains, setDomains] = useState([]);
    const [current, setCurrent] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [selected, setSelected] = useState(people[0])
    const [query, setQuery] = useState('')
    const [domainName, setDomainName] = useState('');

    useEffect(() => {
      if (registrarContract) {
        fetchDomains();
      }
    }, [registrarContract]);

    const fetchDomains = async() => {
      setLoading(true);
      let _domains = await registrarContract.methods.queryEntireDomains().call();
      //console.log(_domains);
      _domains = [..._domains];
      _domains = _domains.reverse();
      setDomains(_domains);
      setCurrent(_domains);
      setLoading(false);
    }

    useEffect(() => {
      filterENS();
    } ,[domainName, selected]);

    const filterENS = () => {
      let _domains = [...domains];
      if (domainName) {
        const isAddress = WEB3.utils.isAddress(domainName);
        if (!isAddress) _domains = _domains.filter(item => (item.name + ".eth").indexOf(domainName.toLowerCase()) > -1);
        else _domains = _domains.filter(item => (item.owner.toLowerCase()).indexOf(domainName.toLowerCase()) > -1);
      }

      if (!selected.isLatest) _domains = _domains.reverse();
      setCurrent(_domains);
    }

    const filteredPeople =
      query === ''
        ? people
        : people.filter((person) =>
            person.name
              .toLowerCase()
              .replace(/\s+/g, '')
              .includes(query.toLowerCase().replace(/\s+/g, ''))
    )

    const activePage = parseInt(querys.page) ? parseInt(querys.page) : 1;
    return (
        <div className="flex flex-col gap-3 p-4">
            {
              isLoading ? <Loader/>
              :<>
                <div className="flex flex-wrap gap-2 justify-center items-center mt-6">
                  <input
                    type="text"
                    className="shadow-md border border-violet-300 text-white outline-0 py-2 px-4 rounded-full bg-transparent w-96"
                    placeholder="Search ENS...."
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                  />
                  <Combobox value={selected} onChange={setSelected}>
                    <div className="relative">
                      <div className="relative w-40 cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                        <Combobox.Input
                          className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                          displayValue={(person) => person.name}
                          onChange={(event) => setQuery(event.target.value)}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <SelectorIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </Combobox.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery('')}
                      >
                        <Combobox.Options className="absolute w-40 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {filteredPeople.length === 0 && query !== '' ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                              Nothing found.
                            </div>
                          ) : (
                            filteredPeople.map((person) => (
                              <Combobox.Option
                                key={person.id}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                  }`
                                }
                                value={person}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? 'font-medium' : 'font-normal'
                                      }`}
                                    >
                                      {person.name}
                                    </span>
                                    {selected ? (
                                      <span
                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                          active ? 'text-white' : 'text-teal-600'
                                        }`}
                                      >
                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Combobox.Option>
                            ))
                          )}
                        </Combobox.Options>
                      </Transition>
                    </div>
                  </Combobox>
                </div>
                <div className="flex flex-wrap gap-2">
                  {
                    [...current.slice(25 * (activePage - 1), 25 * activePage)].map((item, idx) => (
                        <Domain
                          key={idx}
                          labelhash={WEB3.utils.sha3(item.name)
                        }/>
                    ))
                  }
                  {
                    ![...current.slice(25 * (activePage - 1), 25 * activePage)].length && <Empty/>
                  }
                  <Pagination
                    initialPage={activePage}
                    totalPages={Math.ceil(current.length / 25)}
                  />
                </div>
              </>
            }
        </div>
    )
}

export default ExploreDomains;