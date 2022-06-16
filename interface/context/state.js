import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppWrapper({ children }) {

    const [account, setAccount] = useState();
    const [WEB3, setWEB3] = useState();
    const [domainContract, setDomainContract] = useState();
    const [registrarContract, setRegistrarContract] = useState();

    const context = {
        account,WEB3, domainContract, registrarContract,
        setWEB3, setDomainContract, setRegistrarContract, setAccount
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