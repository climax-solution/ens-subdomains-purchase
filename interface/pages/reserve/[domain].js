import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Empty from "../../components/empty";
import Loader from "../../components/loader";
import PricingItem from "../../components/pricing";
import { useAppContext } from "../../context/state";

const list = [
    {
        level: "Basic",
        text: "Works for 1 Month",
        period: "",
        popular: false
    },
    {
        level: "Primary",
        text: "Works for 6 Months",
        period: "",
        popular: false
    },
    {
        level: "Medium",
        text: "Works for 1 Year",
        period: "",
        popular: true
    },
    {
        level: "Forever",
        text: "Works Forever",
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
            try {
                const domain_ = await registrarContract.methods.queryDomain(bytename).call();
                if (domain_.name == names[0]) {
                    setLabelHash(bytename);
                    setPrices(domain_.price);
                }
            } catch(err) {
                //console.log(err);
            }
            setLoading(false);
        }

        if (registrarContract && domain) fetchSubscription();
    }, [registrarContract, domain]);

    return (
        <div className="flex flex-wrap gap-2 p-4 justify-evenly h-screen items-center">
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
                        )) : <Empty/>
                    }
                </>
            }
            
        </div>
    )
}

export default Pricing;