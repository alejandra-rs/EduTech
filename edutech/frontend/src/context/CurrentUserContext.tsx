import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useMsal } from "@azure/msal-react";
import type { AccountInfo } from "@azure/msal-browser";
import { getUserByEmail, syncUser } from "../services/connections-students";
import { initializeAuth, initializeCurrentUser } from "../services/api";
import { loginRequest } from "../services/authConfig";
import type { Student } from "../models/student/student.model";

interface CurrentUserContextValue {
  userData: Student | null;
  isLoading: boolean;
  error: Error | null;
  account: AccountInfo | null;
  refetch: () => Promise<void>;
}

const CurrentUserContext = createContext<CurrentUserContextValue>({
  userData: null,
  isLoading: true,
  error: null,
  account: null,
  refetch: async () => {},
});

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const { accounts, instance } = useMsal();
  const [userData, setUserData] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const accountsRef = useRef(accounts);
  useEffect(() => { accountsRef.current = accounts; }, [accounts]);

  const initialized = useRef(false);

  const refetch = useCallback(async () => {
    if (accountsRef.current.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const user = await getUserByEmail(accountsRef.current[0].username);
      setUserData(user);
      if (user?.id) initializeCurrentUser(user.id);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      console.error("Error obteniendo el usuario:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (accounts.length === 0 || initialized.current) return;
    initialized.current = true;

    initializeAuth(() =>
      instance.acquireTokenSilent({ ...loginRequest, account: accounts[0] })
        .then(r => r.accessToken)
    );

    syncUser(instance, accounts[0])
      .catch((e) => console.error("syncUser failed:", e))
      .finally(() => refetch());
  }, [accounts, instance, refetch]);

  return (
    <CurrentUserContext.Provider value={{ userData, isLoading, error, account: accounts[0] ?? null, refetch }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser(): CurrentUserContextValue {
  return useContext(CurrentUserContext);
}
