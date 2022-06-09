import PricingItem from "../../components/pricing";

const list = [
    {
        level: "Basic",
        price: "0.01",
        text: "Work for 1 month",
        period: "",
        popular: false
    },
    {
        level: "Primary",
        price: "0.05",
        text: "Work for 6 months",
        period: "",
        popular: false
    },
    {
        level: "Medium",
        price: "0.1",
        text: "Work for 1 year",
        period: "",
        popular: true
    },
    {
        level: "Forever",
        price: "0.3",
        text: "Work forever",
        period: "",
        popular: false
    }
];

const Pricing = () => {
    return (
        <div className="flex gap-2 h-screen items-center">
            {
                list.map((item, idx) => (
                    <PricingItem
                        level={item.level}
                        price={item.price}
                        text={item.text}
                        period={item.period}
                        popular={item.popular}
                        key={idx}
                    />
                ))
            }
        </div>
    )
}

export default Pricing;