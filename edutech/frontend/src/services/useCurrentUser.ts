import { useState, useEffect, useRef } from "react";
import { useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser";
import { getUserByEmail } from "./connections-students";
import { Student } from "../models/student/student.model";

interface CurrentUserHook {
    userData: Student | null;
    isLoading: boolean;
    account: AccountInfo | null;
    refetch: () => Promise<void>;
}

export const useCurrentUser = (): CurrentUserHook => {
    const { accounts } = useMsal();
    const [userData, setUserData] = useState<Student | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const accountsRef = useRef(accounts);
    useEffect(() => { accountsRef.current = accounts; }, [accounts]);

    const fetchData = useRef(async () => {
        if (accountsRef.current.length === 0) return;
        setIsLoading(true);
        try {
            const user = await getUserByEmail(accountsRef.current[0].username);
            setUserData(user);
        } catch (error) {
            console.error("Error obteniendo el usuario:", error);
        } finally {
            setIsLoading(false);
        }
    }).current;

    useEffect(() => {
        if (accounts.length > 0) fetchData();
    }, [accounts]);

    return {
        userData,
        isLoading,
        account: (accounts[0] as AccountInfo) ?? null,
        refetch: fetchData,
    };
};