import React, { createContext, useContext, useRef, ReactNode } from 'react';

export type ProceedFunction = () => void;
export type GuardFunction = (proceedFn: ProceedFunction) => void;
export interface NavigationGuardContextType {
  registerGuard: (fn: GuardFunction) => void;
  unregisterGuard: () => void;
  guardedNavigate: (proceedFn: ProceedFunction) => void;
}

const NavigationGuardContext = createContext<NavigationGuardContextType | null>(null);

interface NavigationGuardProviderProps {
  children: ReactNode;
}

export function NavigationGuardProvider({ children }: NavigationGuardProviderProps) {
  const guardRef = useRef<GuardFunction | null>(null);

  const registerGuard = (fn: GuardFunction) => { 
    guardRef.current = fn; 
  };
  
  const unregisterGuard = () => { 
    guardRef.current = null; 
  };

  const guardedNavigate = (proceedFn: ProceedFunction) => {
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

export const useNavigationGuard = (): NavigationGuardContextType => {
  const context = useContext(NavigationGuardContext);
  if (!context) {
    throw new Error("useNavigationGuard debe usarse dentro de un NavigationGuardProvider");
  }
  return context;
};