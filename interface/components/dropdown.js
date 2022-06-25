import { Popover, Transition } from '@headlessui/react'
import Link from "next/link";
import { Fragment } from 'react'
import { useRouter } from "next/router";

const Dropdown = ({ list, icon, type }) => {
    const { pathname: path, query } = useRouter();
    console.log(path, query);
    return (
        <Popover>
            {({ open }) => (
            <>
                <Popover.Button
                    className={`${open ? '' : 'text-opacity-90'}`}
                >
                <span className={path.indexOf(type) == 1 ? 'text-white' : ""}>{icon}</span>
                </Popover.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                >
                <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2 text-center">
                            {list.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                >
                                    <span className={"capitalize -m-3 items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 text-center " + ((path.indexOf(type) == 1 && query.tab == item.name) ? "font-bold" : "")}>{item.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </Popover.Panel>
                </Transition>
            </>
            )}
        </Popover>
    )
}

export default Dropdown;