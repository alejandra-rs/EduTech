import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { getUserByEmail } from "@services/connections";

export const useCurrentUser = () => {
    const { accounts, inProgress } = useMsal();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (inProgress === "none") {
                if (accounts.length > 0) {
                    try {
                        const user = await getUserByEmail(accounts[0].username);
                        setUserData(user);
                    } catch (error) {
                        console.error("Error obteniendo el usuario:", error);
                    }
                }
                setIsLoading(false);
            }
        };
        fetchData();
    }, [accounts, inProgress]);
    return {
        userData,
        isLoading,
        account: accounts[0] ?? null,
    };
};