import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import PricingItem from "../../components/pricing";
import { useAppContext } from "../../context/state";

const list = [
    {
        level: "Basic",
        text: "Work for 1 month",
        period: "",
        popular: false
    },
    {
        level: "Primary",
        text: "Work for 6 months",
        period: "",
        popular: false
    },
    {
        level: "Medium",
        text: "Work for 1 year",
        period: "",
        popular: true
    },
    {
        level: "Forever",
        text: "Work forever",
        period: "",
        popular: false
    }
];

const Pricing = () => {

    const { WEB3, registrarContract } = useAppContext();
    const router = useRouter();
    const { domain } = router.query;

    const [prices, setPrices] = useState([]);
    const [labelhash, setLabelHash] = useState();
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchSubscription() {
            setLoading(true);
            const names = domain.split('.');
            const bytename = WEB3.utils.sha3(names[0]);
            const domain_ = await registrarContract.methods.queryDomain(bytename).call();
            if (domain_.name == names[0]) {
                setLabelHash(bytename);
                setPrices(domain_.price);
            }
            setLoading(false);
        }

        if (registrarContract && domain) fetchSubscription();
    }, [registrarContract, domain]);

    return (
        <div className="flex gap-2 p-4 h-screen justify-center items-center">
            {
                isLoading ? <Loader/>
                : <>
                    {
                        prices.length ? list.map((item, idx) => (
                            <PricingItem
                                level={item.level}
                                price={WEB3.utils.fromWei(prices[idx])}
                                text={item.text}
                                period={item.period}
                                popular={item.popular}
                                labelhash={labelhash}
                                ite={idx}
                                key={idx}
                            />
                        )) : <></>
                    }
                </>
            }
            
        </div>
    )
}

export default Pricing;