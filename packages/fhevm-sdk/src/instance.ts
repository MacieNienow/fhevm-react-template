import { createInstance, initFhevm } from 'fhevmjs';
import type { FhevmConfig, FhevmInstance, PublicKey } from './types';

let globalInstance: FhevmInstance | null = null;

/**
 * Create a new FHEVM instance
 *
 * @param config - FHEVM configuration
 * @returns Promise resolving to FHEVM instance
 *
 * @example
 * ```typescript
 * const fhevm = await createFhevmInstance({
 *   gatewayAddress: '0x...',
 *   chainId: 11155111,
 * });
 * ```
 */
export async function createFhevmInstance(
  config: FhevmConfig
): Promise<FhevmInstance> {
  // Initialize fhevmjs if not already done
  await initFhevm();

  // Create instance with gateway address
  const instance = await createInstance({
    chainId: config.chainId,
    publicKeyVerifier: config.gatewayAddress,
    gatewayUrl: config.rpcUrl,
  });

  // Get public key
  const publicKey: PublicKey = {
    key: instance.getPublicKey(),
    signature: '0x' as `0x${string}`, // Signature comes from gateway
  };

  const fhevmInstance: FhevmInstance = {
    instance,
    publicKey,
    config,
  };

  // Store as global instance for convenience
  globalInstance = fhevmInstance;

  return fhevmInstance;
}

/**
 * Get the global FHEVM instance
 *
 * @returns Global FHEVM instance or null if not initialized
 * @throws Error if instance not initialized
 *
 * @example
 * ```typescript
 * const fhevm = getInstance();
 * const encrypted = fhevm.instance.encrypt64(42n);
 * ```
 */
export function getInstance(): FhevmInstance {
  if (!globalInstance) {
    throw new Error(
      'FHEVM instance not initialized. Call createFhevmInstance() first.'
    );
  }
  return globalInstance;
}

/**
 * Check if FHEVM instance is initialized
 *
 * @returns True if instance exists
 */
export function hasInstance(): boolean {
  return globalInstance !== null;
}

/**
 * Reset the global instance (useful for testing)
 */
export function resetInstance(): void {
  globalInstance = null;
}
