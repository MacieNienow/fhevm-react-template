import { useFhevm } from '@fhevm/sdk/react';

/**
 * Custom hook for FHE operations
 * Wraps @fhevm/sdk's useFhevm with additional functionality
 */
export function useFHE() {
  const gatewayAddress = (process.env.NEXT_PUBLIC_TAXI_GATEWAY_ADDRESS || '0x79d6742b1Bf62452bfcBC6b137ed4eA1ba459a6B') as `0x${string}`;
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 11155111);

  const { fhevm, isLoading, isReady, error } = useFhevm({
    gatewayAddress,
    chainId,
  });

  return {
    fhevm,
    isLoading,
    isReady,
    error,
    gatewayAddress,
    chainId,
  };
}
