// src/hooks/useCurrentUser.ts
import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser"; 
import { getUserByEmail } from "./connections-students";
import { Student } from "../models/student.model";
interface CurrentUserHook {
    userData: Student | null;
    account: AccountInfo | null;
}

export const useCurrentUser = (): CurrentUserHook => {
    const { accounts } = useMsal();
    
    const [userData, setUserData] = useState<Student | null>(null);

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
        account: (accounts[0] as AccountInfo) ?? null, 
    };
};
