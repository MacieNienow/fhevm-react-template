'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useFhevm } from '@fhevm/sdk/react';

interface FHEContextType {
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
  gatewayAddress: string;
  chainId: number;
}

const FHEContext = createContext<FHEContextType | undefined>(undefined);

export function FHEProvider({ children }: { children: ReactNode }) {
  const gatewayAddress = (process.env.NEXT_PUBLIC_TAXI_GATEWAY_ADDRESS || '0x79d6742b1Bf62452bfcBC6b137ed4eA1ba459a6B') as `0x${string}`;
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 11155111);

  const { isReady, isLoading, error } = useFhevm({
    gatewayAddress,
    chainId,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <FHEContext.Provider
      value={{
        isReady,
        isLoading,
        error: error || null,
        gatewayAddress,
        chainId,
      }}
    >
      {children}
    </FHEContext.Provider>
  );
}

export function useFHEContext() {
  const context = useContext(FHEContext);
  if (context === undefined) {
    throw new Error('useFHEContext must be used within FHEProvider');
  }
  return context;
}
