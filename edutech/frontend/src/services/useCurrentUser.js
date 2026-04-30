import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { getUserByEmail } from "@services/connections";

const BASE_URL = "http://127.0.0.1:8000";


export const useCurrentUser = () => {
  const { accounts } = useMsal();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (accounts.length > 0) {
        const user = await getUserByEmail(accounts[0].username);
        setUserData(user);
      }
      setLoading(false);
    };
    fetchData();
  }, [accounts]);

  return {
    userData,
    isAdmin: Boolean(userData?.is_admin),
    loading,
    account: accounts[0] ?? null,
  };
};
