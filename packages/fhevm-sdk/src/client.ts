import { createFhevmInstance, getInstance } from './instance';
import { encryptValue, encryptBatch, reencryptValue } from './encryption';
import { createPermit } from './permit';
import { getPublicKey, getEIP712Domain } from './utils';
import type { FhevmConfig, EncryptedType, ContractAddress } from './types';
import type { Address } from 'viem';

/**
 * FHEVM Client - High-level API for FHE operations
 *
 * @example
 * ```typescript
 * const client = new FhevmClient({
 *   gatewayAddress: '0x...',
 *   chainId: 11155111,
 * });
 *
 * await client.init();
 *
 * // Encrypt a value
 * const encrypted = await client.encrypt(42, 'euint64');
 *
 * // Create permit for decryption
 * const permit = await client.createPermit(contractAddress, userAddress, signer);
 * ```
 */
export class FhevmClient {
  private config: FhevmConfig;
  private initialized: boolean = false;

  constructor(config: FhevmConfig) {
    this.config = config;
  }

  /**
   * Initialize the FHEVM client
   */
  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    await createFhevmInstance(this.config);
    this.initialized = true;
  }

  /**
   * Encrypt a value
   *
   * @param value - Value to encrypt
   * @param type - Encrypted type
   * @returns Encrypted value
   */
  async encrypt(value: number | bigint, type: EncryptedType = 'euint64') {
    this.ensureInitialized();
    return encryptValue(value, type);
  }

  /**
   * Encrypt multiple values
   *
   * @param values - Values to encrypt
   * @param type - Encrypted type
   * @returns Array of encrypted values
   */
  async encryptBatch(values: (number | bigint)[], type: EncryptedType = 'euint64') {
    this.ensureInitialized();
    return encryptBatch(values, type);
  }

  /**
   * Create a permit for decryption
   *
   * @param contractAddress - Contract address
   * @param userAddress - User address
   * @param signer - Signing function
   * @returns Permit signature
   */
  async createPermit(
    contractAddress: ContractAddress,
    userAddress: Address,
    signer: (message: any) => Promise<`0x${string}`>
  ) {
    this.ensureInitialized();
    return createPermit(contractAddress, userAddress, signer);
  }

  /**
   * Re-encrypt a value for client-side decryption
   *
   * @param handle - Encrypted value handle
   * @param contractAddress - Contract address
   * @param userAddress - User address
   * @param signature - Permit signature
   * @returns Decrypted value
   */
  async reencrypt(
    handle: bigint,
    contractAddress: ContractAddress,
    userAddress: Address,
    signature: `0x${string}`
  ) {
    this.ensureInitialized();
    const publicKey = getPublicKey();
    return reencryptValue({
      handle,
      contractAddress,
      userAddress,
      signature,
      publicKey: publicKey.key,
    });
  }

  /**
   * Get the public key
   */
  getPublicKey() {
    this.ensureInitialized();
    return getPublicKey();
  }

  /**
   * Get EIP-712 domain for a contract
   */
  getEIP712Domain(contractAddress: ContractAddress) {
    this.ensureInitialized();
    return getEIP712Domain(contractAddress);
  }

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('FhevmClient not initialized. Call init() first.');
    }
  }
}
