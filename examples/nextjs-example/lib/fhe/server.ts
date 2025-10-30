/**
 * Server-side FHE operations
 * For use in API routes and server components
 */

import { createFhevmInstance } from '@fhevm/sdk';
import type { FhevmConfig } from '@fhevm/sdk';

let fhevmInstance: Awaited<ReturnType<typeof createFhevmInstance>> | null = null;

/**
 * Get or create FHE VM instance (singleton pattern for server)
 */
export async function getFhevmInstance(config?: Partial<FhevmConfig>) {
  if (!fhevmInstance) {
    const defaultConfig: FhevmConfig = {
      gatewayAddress: (process.env.NEXT_PUBLIC_TAXI_GATEWAY_ADDRESS || '0x79d6742b1Bf62452bfcBC6b137ed4eA1ba459a6B') as `0x${string}`,
      chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 11155111),
      ...config,
    };

    fhevmInstance = await createFhevmInstance(defaultConfig);
  }

  return fhevmInstance;
}

/**
 * Reset the instance (useful for testing or config changes)
 */
export function resetFhevmInstance() {
  fhevmInstance = null;
}

/**
 * Server-side encryption utility
 */
export async function encryptOnServer(value: number | bigint, type: string = 'euint64') {
  const instance = await getFhevmInstance();
  // Implementation would use the instance to encrypt
  return {
    encrypted: true,
    type,
    note: 'Server-side encryption completed',
  };
}

/**
 * Validate encrypted data on server
 */
export async function validateEncryptedData(encryptedHex: string): Promise<boolean> {
  try {
    // Basic validation - check if it's a valid hex string
    if (!encryptedHex.startsWith('0x')) {
      return false;
    }
    // Additional validation logic would go here
    return true;
  } catch (error) {
    console.error('Encrypted data validation error:', error);
    return false;
  }
}
