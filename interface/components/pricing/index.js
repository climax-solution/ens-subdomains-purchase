import { useState } from "react";
import { useAppContext } from "../../context/state";

const PricingItem = ({ level, popular, price, text, labelhash, ite }) => {

    const { WEB3, account, registrarContract } = useAppContext();
    const [subdomain, setSubDomain] = useState('');
    const reserve = async() => {
        try {
            await registrarContract.methods.reserveSubdomain(labelhash, subdomain, ite).send({
                from: account,
                value: WEB3.utils.toWei(price)
            });
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div className="max-w-xxs flex flex-col py-8 bg-white rounded-md shadow-lg hover:scale-105 transition duration-500 p-4 w-full cursor-pointer">
            <div className="flex flex-wrap items-center justify-between mb-6">
                <span className="mr-3 text-lg md:text-xl text-coolGray-800 font-medium">{ level }</span>
                { popular && <span className="inline-block py-px px-2 text-xs leading-5 text-white bg-yellow-500 font-medium uppercase rounded-full">popular</span> }
            </div>
            <div className="mb-6 text-center">
                <span className="text-6xl md:text-7xl text-coolGray-900 font-semibold">{ price }</span>
                <span className="ml-2 text-3xl text-coolGray-900 font-bold">ETH</span>
            </div>
            <p className="mb-6 text-coolGray-400 text-center font-medium">{text}</p>
            <div className="text-center">
                <input
                    type="text"
                    className="border-2 border-green-600 outline-0 h-10 px-4 w-36 mb-4 rounded-full transition text-center"
                    value={subdomain}
                    onChange={(e) => setSubDomain(e.target.value)}
                />
            </div>
            <button
                className="inline-block py-4 px-7 mb-4 w-full text-base md:text-lg leading-6 text-green-50 font-medium text-center bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md shadow-sm"
                onClick={reserve}
            >Reserve</button>
        </div>
    )
}

export default PricingItem;