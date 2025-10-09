'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { FhevmProvider } from '@fhevm/sdk/react';
import { config } from '../config/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <FhevmProvider
            config={{
              gatewayAddress: process.env.NEXT_PUBLIC_TAXI_GATEWAY_ADDRESS as `0x${string}`,
              chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 11155111),
              rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
            }}
          >
            {children}
          </FhevmProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
