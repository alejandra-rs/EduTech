import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { getUserByEmail } from "@services/connections";

export const useCurrentUser = () => {
    const { accounts } = useMsal();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (accounts.length > 0) {
                const user = await getUserByEmail(accounts[0].username);
                setUserData(user);
            }
        };
        fetchData();
    }, [accounts]);

    return {
        userData,
        account: accounts[0] ?? null,
    };
};