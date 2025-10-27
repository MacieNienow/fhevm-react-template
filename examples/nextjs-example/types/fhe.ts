/**
 * FHE-related TypeScript type definitions
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

export interface EncryptedValue {
  data: Uint8Array;
  hex: string;
  type?: EncryptedType;
}

export interface FHEConfig {
  gatewayAddress: `0x${string}`;
  chainId: number;
  rpcUrl?: string;
}

export interface PublicKey {
  key: string;
  chainId: number;
  timestamp?: number;
}

export interface PermitSignature {
  signature: string;
  publicKey: string;
  contractAddress: string;
  userAddress: string;
}

export interface DecryptionRequest {
  handle: bigint;
  contractAddress: string;
  userAddress: string;
  signature: string;
  publicKey: string;
}

export interface ComputationOperation {
  type: 'add' | 'sub' | 'mul' | 'div' | 'gt' | 'lt' | 'eq' | 'ne' | 'and' | 'or';
  operands: EncryptedValue[];
  result?: EncryptedValue;
}

export interface FHEContextValue {
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
  gatewayAddress: string;
  chainId: number;
}
