import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import NetworkInformation from "./network-information";
import { useAppContext } from "../context/state";
import Loader from "./loader";
import {NotificationContainer} from 'react-notifications';

function Layout({ children }) {

    const { pathname: path, query } = useRouter();
    const { isLoading } = useAppContext();
    const [ isPendingDown, setPendingDown ] = useState(false);
    const [ isAcceptedDown, setAcceptedDown] = useState(false);

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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 icon icon-tabler icon-shopping-cart" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <Link href="/explore" className="text-sm ml-2">Explore Domains</Link>
                            </div>
                        </li>                        
                        <li className={"flex w-full justify-between cursor-pointer items-center mb-6 " + ((path.slice(1)).indexOf("collected") == 0 ? "text-white hover:text-white-600" : "text-gray-600 hover:text-gray-500")}>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <Link href="/collected" className="text-sm  ml-2">Manage Domains</Link>
                            </div>
                        </li>
                        <li className={"flex w-full justify-between flex-col cursor-pointer items-center mb-6 " + (path.slice(1, 8) == 'pending' ? "text-white hover:text-white-600" : "text-gray-600 hover:text-gray-500")}>
                            <div className="flex w-full items-center" onClick={() => setPendingDown(!isPendingDown)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 icon icon-tabler icon-clock" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <a>Pending List</a>
                                <svg
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fas"
                                    className="w-3 h-3 ml-3"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 448 512"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
                                    />
                                </svg>
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
                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 256 256" className="w-6 h-6" xmlSpace="preserve" fill="currentColor">
                                    <g transform="translate(128 128) scale(0.97 0.97)">
                                        <g
                                            style={{
                                                stroke: "none",
                                                strokeWidth: 0,
                                                strokeDasharray: "none",
                                                strokeLinecap: "butt",
                                                strokeLinejoin: "miter",
                                                strokeMiterlimit: 10,
                                                fillRule: "nonzero",
                                                opacity: 1
                                            }}
                                            transform="translate(-130.05 -130.05000000000004) scale(2.89 2.89)"
                                        >
                                        <path
                                            d="M 89.328 2.625 L 89.328 2.625 c -1.701 -2.859 -5.728 -3.151 -7.824 -0.568 L 46.532 45.173 c -0.856 1.055 -2.483 0.997 -3.262 -0.115 l -8.382 -11.97 c -2.852 -4.073 -8.789 -4.335 -11.989 -0.531 l 0 0 c -2.207 2.624 -2.374 6.403 -0.408 9.211 l 17.157 24.502 c 2.088 2.982 6.507 2.977 8.588 -0.011 l 4.925 -7.07 L 89.135 7.813 C 90.214 6.272 90.289 4.242 89.328 2.625 z"
                                            style={{
                                                stroke: "none",
                                                strokeWidth: 1,
                                                strokeDasharray: "none",
                                                strokeLinecap: "butt",
                                                strokeLinejoin: "miter",
                                                strokeMiterlimit: 10,
                                                fillRule: "nonzero",
                                                opacity: 1
                                            }}
                                            transform=" matrix(1 0 0 1 0 0) "
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M 45 90 C 20.187 90 0 69.813 0 45 C 0 20.187 20.187 0 45 0 c 6.072 0 11.967 1.19 17.518 3.538 c 2.034 0.861 2.986 3.208 2.125 5.242 c -0.859 2.035 -3.207 2.987 -5.242 2.126 C 54.842 8.978 49.996 8 45 8 C 24.598 8 8 24.598 8 45 c 0 20.402 16.598 37 37 37 c 20.402 0 37 -16.598 37 -37 c 0 -3.248 -0.42 -6.469 -1.249 -9.573 c -0.57 -2.134 0.698 -4.327 2.832 -4.897 c 2.133 -0.571 4.326 0.698 4.896 2.833 C 89.488 37.14 90 41.055 90 45 C 90 69.813 69.813 90 45 90 z"
                                            style={{
                                                stroke: "none",
                                                strokeWidth: 0.5,
                                                strokeDasharray: "none",
                                                strokeLinecap: "butt",
                                                strokeLinejoin: "miter",
                                                strokeMiterlimit: 10,
                                                fillRule: "nonzero",
                                                opacity: 1
                                            }}
                                            transform=" matrix(1 0 0 1 0 0) "
                                            strokeLinecap="round"
                                        />
                                        </g>
                                    </g>
                                </svg>

                                <a>Accepted List</a>
                                <svg
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fas"
                                    className="w-3 h-3 ml-3"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 448 512"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
                                    />
                                </svg>
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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 icon icon-tabler icon-tabler-messages" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10" />
                                <path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2" />
                            </svg>
                        </li>
                        <li className="cursor-pointer text-white pt-5 pb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 icon icon-tabler icon-tabler-settings" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <circle cx={12} cy={12} r={3} />
                            </svg>
                        </li>
                        <li className="cursor-pointer text-white pt-5 pb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 icon icon-tabler icon-tabler-archive" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <rect x={3} y={4} width={18} height={4} rx={2} />
                                <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10" />
                                <line x1={10} y1={12} x2={14} y2={12} />
                            </svg>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="sticky top-0 z-40 absolute bg-gray-800 shadow md:h-full flex-col justify-between sm:hidden  transition duration-150 ease-in-out" id="mobile-nav">
                <div className="p-8 border-t border-gray-700">
                    <ul className="w-full flex items-center justify-between bg-gray-800">
                        <li className={`flex w-full justify-between cursor-pointer items-center xxs:justify-center ${path.slice(1) == 'explore' ? "text-white hover:text-white-600" : "text-gray-600 hover:text-gray-500"}`}>
                            <Link href="/explore">
                                <a className="flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 icon icon-tabler icon-shopping-cart" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="text-sm ml-2 xxs:hidden xs:inline">Explore Domains</span>
                                </a>
                            </Link>
                        </li>
                        <li className={"flex w-full justify-between cursor-pointer items-center xxs:justify-center " + (path.slice(1) == 'pending' ? "text-white hover:text-white-600" : "text-gray-600 hover:text-gray-500")}>
                            <Link href="/pending">
                                <a className="flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 icon icon-tabler icon-clock" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm ml-2 xxs:hidden xs:inline">Pending List</span>
                                </a>
                            </Link>
                        </li>
                        <li className={"flex w-full justify-between cursor-pointer items-center xxs:justify-center " + ((path.slice(1)).indexOf("collected") == 0 ? "text-white hover:text-white-600" : "text-gray-600 hover:text-gray-500")}>
                            <Link href="/collected">
                                <a className="flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <span className="text-sm ml-2 xxs:hidden xs:inline">Manage Domains</span>
                                </a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            {/* Sidebar ends */}
            {/* Remove class [ h-64 ] when adding a card block */}
            <div className="container mx-auto h-full min-h-screen relative max-h-screen overflow-auto">
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
