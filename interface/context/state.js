import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppWrapper({ children }) {

    const [account, setAccount] = useState();
    const [network, setNetwork] = useState();
    const [isLoading, setLoading] = useState(false);
    const [WEB3, setWEB3] = useState();
    const [domainContract, setDomainContract] = useState();
    const [registrarContract, setRegistrarContract] = useState();

    const context = {
        account, network, WEB3, domainContract, registrarContract, isLoading,
        setWEB3, setDomainContract, setRegistrarContract, setAccount, setNetwork, setLoading
    }

    return (
        <AppContext.Provider value={context}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}