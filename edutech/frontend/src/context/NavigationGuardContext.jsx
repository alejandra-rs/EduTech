import { createContext, useContext, useRef } from 'react';

const NavigationGuardContext = createContext(null);

export function NavigationGuardProvider({ children }) {
  const guardRef = useRef(null);

  const registerGuard = (fn) => { guardRef.current = fn; };
  const unregisterGuard = () => { guardRef.current = null; };

  const guardedNavigate = (proceedFn) => {
    if (guardRef.current) {
      guardRef.current(proceedFn);
    } else {
      proceedFn();
    }
  };

  return (
    <NavigationGuardContext.Provider value={{ registerGuard, unregisterGuard, guardedNavigate }}>
      {children}
    </NavigationGuardContext.Provider>
  );
}

export const useNavigationGuard = () => useContext(NavigationGuardContext);
