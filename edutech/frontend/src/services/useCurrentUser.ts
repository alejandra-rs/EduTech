import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser";
import { getUserByEmail } from "./connections-students";
import { Student } from "../models/student.model";
interface CurrentUserHook {
    userData: Student | null;
    isAdmin: boolean;
    isLoading: boolean;
    account: AccountInfo | null;
}

export const useCurrentUser = (): CurrentUserHook => {
    const { accounts, inProgress } = useMsal();
    const [userData, setUserData] = useState<Student | null>(null);
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
        isAdmin: Boolean(userData?.isAdmin),
        isLoading,
        account:  (accounts[0] as AccountInfo)  ?? null,
    };
};