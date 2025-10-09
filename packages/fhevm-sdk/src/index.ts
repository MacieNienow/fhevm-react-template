/**
 * @fhevm/sdk - Universal FHEVM SDK
 * Framework-agnostic encryption and decryption utilities for confidential smart contracts
 */

export { FhevmClient } from './client';
export { createFhevmInstance, getInstance } from './instance';
export { encryptValue, decryptValue, reencryptValue } from './encryption';
export { createPermit, getPermit } from './permit';
export { getPublicKey, getEIP712Domain } from './utils';

export type {
  FhevmConfig,
  FhevmInstance,
  EncryptedValue,
  DecryptedValue,
  PermitSignature,
  PublicKey,
  ContractAddress,
} from './types';

// Re-export commonly used types from fhevmjs
export type { FhevmInstance as FhevmJsInstance } from 'fhevmjs';
