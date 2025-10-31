import { createFhevmInstance, encryptValue, encryptBatch } from '@fhevm/sdk';
import type { FhevmConfig, EncryptedType } from '@fhevm/sdk';

/**
 * Client-side FHE operations
 * Provides utilities for encryption in the browser
 */

export class FHEClient {
  private config: FhevmConfig;
  private instance: Awaited<ReturnType<typeof createFhevmInstance>> | null = null;

  constructor(config: FhevmConfig) {
    this.config = config;
  }

  async initialize() {
    if (!this.instance) {
      this.instance = await createFhevmInstance(this.config);
    }
    return this.instance;
  }

  async encrypt(value: number | bigint, type: EncryptedType = 'euint64') {
    await this.initialize();
    return encryptValue(value, type);
  }

  async encryptMultiple(values: (number | bigint)[], type: EncryptedType = 'euint64') {
    await this.initialize();
    return encryptBatch(values, type);
  }

  getConfig() {
    return this.config;
  }

  isInitialized() {
    return this.instance !== null;
  }
}

export async function createFHEClient(config?: Partial<FhevmConfig>) {
  const defaultConfig: FhevmConfig = {
    gatewayAddress: (process.env.NEXT_PUBLIC_TAXI_GATEWAY_ADDRESS || '0x79d6742b1Bf62452bfcBC6b137ed4eA1ba459a6B') as `0x${string}`,
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 11155111),
    ...config,
  };

  const client = new FHEClient(defaultConfig);
  await client.initialize();
  return client;
}
