import type { PermitSignature, ContractAddress } from './types';
import { getInstance } from './instance';
import type { Address } from 'viem';

/**
 * Create an EIP-712 permit signature for decryption
 *
 * @param contractAddress - Contract address to access
 * @param userAddress - User address requesting access
 * @param signer - Function to sign the permit (e.g., from wallet)
 * @returns Permit signature
 *
 * @example
 * ```typescript
 * const permit = await createPermit(
 *   contractAddress,
 *   userAddress,
 *   async (message) => await wallet.signTypedData(message)
 * );
 * ```
 */
export async function createPermit(
  contractAddress: ContractAddress,
  userAddress: Address,
  signer: (message: any) => Promise<`0x${string}`>
): Promise<PermitSignature> {
  const fhevm = getInstance();

  // EIP-712 domain
  const domain = {
    name: 'Authorization token',
    version: '1',
    chainId: fhevm.config.chainId,
    verifyingContract: contractAddress,
  };

  // EIP-712 types
  const types = {
    Permit: [
      { name: 'issuer', type: 'address' },
      { name: 'contract', type: 'address' },
      { name: 'publicKey', type: 'bytes' },
    ],
  };

  // Message to sign
  const message = {
    issuer: userAddress,
    contract: contractAddress,
    publicKey: fhevm.publicKey.key,
  };

  // Full EIP-712 message
  const eip712Message = {
    domain,
    types,
    primaryType: 'Permit' as const,
    message,
  };

  // Sign the message
  const signature = await signer(eip712Message);

  return {
    contractAddress,
    userAddress,
    signature,
    publicKey: fhevm.publicKey.key,
  };
}

/**
 * Get a stored permit signature
 *
 * @param contractAddress - Contract address
 * @param userAddress - User address
 * @returns Stored permit or null
 */
export function getPermit(
  contractAddress: ContractAddress,
  userAddress: Address
): PermitSignature | null {
  // In a real implementation, this would retrieve from storage
  // For now, return null (permits should be created on-demand)
  return null;
}

/**
 * Store a permit signature for later use
 *
 * @param permit - Permit to store
 */
export function storePermit(permit: PermitSignature): void {
  // In a real implementation, this would store in localStorage or similar
  // For now, this is a no-op
}

/**
 * Clear all stored permits
 */
export function clearPermits(): void {
  // Clear all stored permits
}
