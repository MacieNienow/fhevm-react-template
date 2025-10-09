import type { FhevmInstance as FhevmJsInstance } from 'fhevmjs';
import type { Address, Hex } from 'viem';

/**
 * FHEVM SDK Configuration
 */
export interface FhevmConfig {
  /** Gateway contract address for decryption */
  gatewayAddress: Address;
  /** Network chain ID */
  chainId: number;
  /** RPC URL for the network */
  rpcUrl?: string;
  /** ACL contract address (optional) */
  aclAddress?: Address;
}

/**
 * FHEVM Instance wrapper
 */
export interface FhevmInstance {
  /** Underlying fhevmjs instance */
  instance: FhevmJsInstance;
  /** Public key for encryption */
  publicKey: PublicKey;
  /** Configuration used */
  config: FhevmConfig;
}

/**
 * Public key for FHE encryption
 */
export interface PublicKey {
  /** Hex-encoded public key */
  key: Hex;
  /** Signature of the public key */
  signature: Hex;
}

/**
 * Encrypted value ready for contract interaction
 */
export interface EncryptedValue {
  /** Encrypted data as bytes */
  data: Uint8Array;
  /** Hex-encoded encrypted data */
  hex: Hex;
  /** Input proof (if required) */
  inputProof?: Hex;
}

/**
 * Decrypted value from contract
 */
export interface DecryptedValue<T = bigint> {
  /** Decrypted value */
  value: T;
  /** Original encrypted data */
  encrypted: Hex;
}

/**
 * EIP-712 permit signature for decryption
 */
export interface PermitSignature {
  /** Contract address being accessed */
  contractAddress: Address;
  /** User address requesting access */
  userAddress: Address;
  /** Signature hex string */
  signature: Hex;
  /** Public key used */
  publicKey: Hex;
}

/**
 * Contract address type alias
 */
export type ContractAddress = Address;

/**
 * Supported encrypted types
 */
export type EncryptedType =
  | 'ebool'
  | 'euint4'
  | 'euint8'
  | 'euint16'
  | 'euint32'
  | 'euint64'
  | 'euint128'
  | 'euint256'
  | 'eaddress';

/**
 * Re-encryption request
 */
export interface ReencryptRequest {
  /** Contract address */
  contractAddress: Address;
  /** User address */
  userAddress: Address;
  /** Encrypted value handle */
  handle: bigint;
  /** Signature for permission */
  signature: Hex;
  /** Public key */
  publicKey: Hex;
}
