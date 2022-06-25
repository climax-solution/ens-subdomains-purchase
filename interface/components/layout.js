import React, { useState, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import NetworkInformation from "./network-information";
import { useAppContext } from "../context/state";
import Loader from "./loader";
import {NotificationContainer} from 'react-notifications';
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { CheckCircleIcon, ChevronDownIcon, ClockIcon, CogIcon, MenuIcon, MinusSmIcon, PlusSmIcon, QuestionMarkCircleIcon, ShoppingCartIcon, CollectionIcon, XIcon, ArchiveIcon } from "@heroicons/react/outline";

const subCategories = [
    {
        name: 'Explore Domains',
        href: '/explore',
        icon: <ShoppingCartIcon className="h-6 w-6"/>
    },
    {
        name: 'Manage Domains',
        href: '/collected',
        icon: <CollectionIcon className="h-6 w-6"/>
    },
]

const filters = [
    {
      id: 'pending',
      name: 'Pending List',
      icon: <ClockIcon className="w-6 h-6"/>,
      options: [
        { href: 'reserve' },
        { href: 'request' },
      ]
    },
    {
      id: 'accepted',
      name: 'Accepted List',
      icon: <CheckCircleIcon className="w-6 h-6"/>,
      options: [
        { href: 'reserve' },
        { href: 'request' },
      ]
    }
]

function Layout({ children }) {

    const { pathname: path, query } = useRouter();
    const { isLoading } = useAppContext();
    const [ isPendingDown, setPendingDown ] = useState(false);
    const [ isAcceptedDown, setAcceptedDown] = useState(false);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

    return (
        <div className="flex flex-no-wrap xxs:flex-col sm:flex-row">
            <NotificationContainer/>
            {/* Sidebar starts */}
            {/* Remove class [ hidden ] and replace [ sm:flex ] with [ flex ] */}
            <div className="w-80 absolute sm:relative bg-gray-800 min-h-screen shadow md:h-full flex-col justify-between hidden sm:flex">
                <div className="px-8">
                    <div className="my-7 w-full text-center cursor-pointer">
                        <Link href="/" className="shadow-lg hover:shadow-cyan-500/50">
                            <a>
                                <Image
                                    src="/logo.png"
                                    width="128"
                                    height="115"
                                    alt=""
                                    className="logo-icon"
                                    onDragStart={ (e) => e.preventDefault() }
                                />
                            </a>
                        </Link>
                    </div>
                    <NetworkInformation/>
                    <ul className="mt-6 w-40 mx-auto">
                        <li className={`flex w-full justify-between cursor-pointer items-center mb-6 ${path.slice(1) == 'explore' ? "text-white hover:text-white-600" : "text-gray-600 hover:text-gray-500"}`}>
                            <div className="flex items-center">
                                <ShoppingCartIcon className="w-6 h-6"/>
                                <Link href="/explore" className="text-sm ml-2">Explore Domains</Link>
                            </div>
                        </li>                        
                        <li className={"flex w-full justify-between cursor-pointer items-center mb-6 " + ((path.slice(1)).indexOf("collected") == 0 ? "text-white hover:text-white-600" : "text-gray-600 hover:text-gray-500")}>
                            <div className="flex items-center">
                                <CollectionIcon className="w-6 h-6"/>
                                <Link href="/collected" className="text-sm  ml-2">Manage Domains</Link>
                            </div>
                        </li>
                        <li className={"flex w-full justify-between flex-col cursor-pointer items-center mb-6 " + (path.slice(1, 8) == 'pending' ? "text-white hover:text-white-600" : "text-gray-600 hover:text-gray-500")}>
                            <div className="flex w-full items-center" onClick={() => setPendingDown(!isPendingDown)}>
                                <ClockIcon className="w-6 h-6"/>
                                <a>Pending List </a>
                                <ChevronDownIcon className="w-6 h-6 ml-4"/>
                            </div>
                            <ul className={"relative accordion-collapse collapse " + (isPendingDown ? "" : "hidden")}>
                                <li className="relative">
                                    <Link href="/pending/reserve"><a className={"flex items-center text-lg py-4 pl-12 pr-6 h-6 overflow-hidden text-ellipsis whitespace-nowrap rounded hover:text-slate-200 transition duration-300 ease-in-out " + ((path.slice(1).indexOf("pending") == 0 && query.tab == 'reserve') ? "text-slate-200" : "text-gray-700")} data-mdb-ripple="true" data-mdb-ripple-color="dark">Reserves</a></Link>
                                </li>
                                <li className="relative">
                                    <Link href="/pending/request"><a className={"flex items-center text-lg py-4 pl-12 pr-6 h-6 overflow-hidden text-ellipsis whitespace-nowrap rounded hover:text-slate-200 transition duration-300 ease-in-out " + ((path.slice(1).indexOf("pending") == 0 && query.tab == 'request') ? "text-slate-200" : "text-gray-700")} data-mdb-ripple="true" data-mdb-ripple-color="dark">Requests</a></Link>
                                </li>
                            </ul>
                        </li>
                        <li className={"flex w-full justify-between flex-col cursor-pointer items-center mb-6 " + (path.slice(1, 9) == 'accepted' ? "text-white hover:text-white-600" : "text-gray-600 hover:text-gray-500")}>
                            <div className="flex w-full items-center" onClick={() => setAcceptedDown(!isAcceptedDown)}>
                                <CheckCircleIcon className="w-6 h-6"/>
                                <a>Accepted List</a>
                                <ChevronDownIcon className="w-6 h-6 ml-2"/>
                            </div>
                            <ul className={"relative accordion-collapse collapse " + (isAcceptedDown ? "" : "hidden")}>
                                <li className="relative">
                                    <Link href="/accepted/reserve"><a className={"flex items-center text-lg py-4 pl-12 pr-6 h-6 overflow-hidden text-ellipsis whitespace-nowrap rounded hover:text-slate-200 transition duration-300 ease-in-out " + ((path.slice(1).indexOf("accepted") == 0 && query.tab == 'reserve') ? "text-slate-200" : "text-gray-700")} data-mdb-ripple="true" data-mdb-ripple-color="dark">Reserves</a></Link>
                                </li>
                                <li className="relative">
                                    <Link href="/accepted/request"><a className={"flex items-center text-lg py-4 pl-12 pr-6 h-6 overflow-hidden text-ellipsis whitespace-nowrap rounded hover:text-slate-200 transition duration-300 ease-in-out " + ((path.slice(1).indexOf("accepted") == 0 && query.tab == 'request') ? "text-slate-200" : "text-gray-700")} data-mdb-ripple="true" data-mdb-ripple-color="dark">Requests</a></Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className="px-8 border-t border-gray-700">
                    <ul className="w-full flex items-center justify-between bg-gray-800">
                        <li className="cursor-pointer text-white pt-5 pb-3">
                            <a href="https://twitter.com/EnsExpress" target="_blank" rel="noreferrer">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    x="0px"
                                    y="0px"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 48 48"
                                    style={{ fill: "#000000" }}
                                >
                                    <path
                                        fill="#03A9F4"
                                        d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429"
                                    />
                                </svg>
                            </a>
                        </li>
                        <li className="cursor-pointer text-white pt-5 pb-3">
                            <QuestionMarkCircleIcon className="w-6 h-6"/>
                        </li>
                        <li className="cursor-pointer text-white pt-5 pb-3">
                            <CogIcon className="w-6 h-6"/>
                        </li>
                        <li className="cursor-pointer text-white pt-5 pb-3">
                            <ArchiveIcon className="w-6 h-6"/>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="relative top-0 z-40 absolute bg-gray-800 shadow md:h-full flex-col justify-between sm:hidden  transition duration-150 ease-in-out" id="mobile-nav">
                
                <div className="flex justify-between px-8 py-4 border-t border-gray-700 items-center">
                    <button
                        className="w-12 h-12 p-2 border-2 rounded border-slate-200 text-white cursor-pointer"
                        onClick={() => setMobileFiltersOpen(true)}
                    >
                        <MenuIcon className="w-7 h-7"/>
                    </button>
                    <div className="text-center cursor-pointer">
                        <Link href="/" className="shadow-lg hover:shadow-cyan-500/50">
                            <a>
                                <Image
                                    src="/logo.png"
                                    width="64"
                                    height="57"
                                    alt=""
                                    className="logo-icon"
                                    onDragStart={ (e) => e.preventDefault() }
                                />
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
            <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                <Dialog as="div" className="relative z-40 sm:hidden" onClose={setMobileFiltersOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed m-0 inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex z-40">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative max-w-xs w-full h-full bg-white shadow-xl py-4 flex flex-col overflow-y-auto">
                                <div className="px-4 flex items-center justify-between">
                                    <button
                                    type="button"
                                    className="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400"
                                    onClick={() => setMobileFiltersOpen(false)}
                                    >
                                        <XIcon className="w-6 h-6"/>
                                    </button>
                                    <h2 className="text-lg w-full text-center font-medium text-gray-900">Menu</h2>
                                </div>

                                {/* Filters */}
                                <div className="flex flex-col h-full justify-between">
                                <form className="mt-4 border-t border-gray-200 px-4">
                                    <div className="py-4">
                                        <NetworkInformation className="text-black"/>
                                    </div>
                                    <ul role="list" className="font-medium text-gray-900 px-2 py-3">
                                        {subCategories.map((category) => (
                                            <li key={category.name} className="my-2" onClick={() => setMobileFiltersOpen(false)}>
                                                <Link href={`${category.href}`}>
                                                    <a className="block py-2 capitalize flex items-center gap-2">
                                                        <>
                                                        {category.icon}
                                                        {category.name}
                                                        </>
                                                    </a>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                    {filters.map((section) => (
                                        <Disclosure as="div" key={section.id} className="border-gray-200 px-4 pb-6">
                                            {({ open }) => (
                                            <>
                                                <h3 className="-mx-2 -my-3 flow-root">
                                                    <Disclosure.Button className="pr-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500">
                                                        <span className="font-medium text-gray-900 flex gap-2 items-center">{section.icon}{section.name}</span>
                                                        <span className="ml-6 flex items-center">
                                                        {open ? (
                                                            <MinusSmIcon className="h-5 w-5" aria-hidden="true" />
                                                        ) : (
                                                            <PlusSmIcon className="h-5 w-5" aria-hidden="true" />
                                                        )}
                                                        </span>
                                                    </Disclosure.Button>
                                                    </h3>
                                                <Disclosure.Panel className="pt-6">
                                                    <ul className="space-y-6 font-medium text-gray-900 px-2 py-3">
                                                        {section.options.map((option, optionIdx) => (
                                                            <li key={option.href + optionIdx} onClick={() => setMobileFiltersOpen(false)}>
                                                                <Link href={`/${section.id}/${option.href}`}>
                                                                    <a className="block px-2 py-3 capitalize">
                                                                        {option.href}
                                                                    </a>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </Disclosure.Panel>
                                            </>
                                            )}
                                        </Disclosure>
                                    ))}
                                </form>
                                    <div className="px-8 border-t border-gray-700">
                                        <ul className="w-full flex items-center justify-between">
                                            <li className="cursor-pointer text-gray pt-5">
                                                <a href="https://twitter.com/EnsExpress" target="_blank" rel="noreferrer">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        x="0px"
                                                        y="0px"
                                                        width={24}
                                                        height={24}
                                                        viewBox="0 0 48 48"
                                                        style={{ fill: "#000000" }}
                                                    >
                                                        <path
                                                            fill="#03A9F4"
                                                            d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429"
                                                        />
                                                    </svg>
                                                </a>
                                            </li>
                                            <li className="cursor-pointer text-gray pt-5">
                                                <QuestionMarkCircleIcon className="w-6 h-6"/>
                                            </li>
                                            <li className="cursor-pointer text-gray pt-5">
                                                <CogIcon className="w-6 h-6"/>
                                            </li>
                                            <li className="cursor-pointer text-gray pt-5">
                                                <ArchiveIcon className="w-6 h-6"/>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
            {/* Sidebar ends */}
            {/* Remove class [ h-64 ] when adding a card block */}
            <div className="w-full mx-auto h-full min-h-screen relative max-h-screen overflow-auto">
                {/* Remove class [ border-dashed border-2 border-gray-300 ] to remove dotted border */}
                
                <div className="w-full h-full rounded 
                iop-oiu">{
                    isLoading ? <Loader/> : children
                }</div>
            </div>
        </div>
    );
}

export default Layout;
