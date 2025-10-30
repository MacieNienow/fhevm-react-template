/**
 * API-related TypeScript type definitions
 */

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EncryptionRequest {
  value: number | string | boolean;
  type?: string;
}

export interface EncryptionResponse {
  success: boolean;
  type: string;
  note?: string;
  example?: {
    hook: string;
    code: string;
  };
}

export interface DecryptionRequest {
  handle: string | bigint;
  contractAddress: string;
  userAddress: string;
  signature?: string;
  publicKey?: string;
}

export interface DecryptionResponse {
  success: boolean;
  note?: string;
  example?: {
    hook: string;
    code: string;
  };
  requiredFields?: Record<string, string>;
}

export interface ComputationRequest {
  operation: string;
  operands: unknown[];
  contractAddress?: string;
}

export interface ComputationResponse {
  success: boolean;
  operation: string;
  operandCount: number;
  note?: string;
  example?: {
    solidity: string;
  };
  supportedOperations?: string[];
}

export interface KeyManagementRequest {
  operation: string;
  publicKey?: string;
  userAddress?: string;
}

export interface KeyManagementResponse {
  success: boolean;
  chainId?: number;
  contractAddress?: string;
  message?: string;
  note?: string;
  example?: {
    usage: string;
    gateway: string;
  };
}

export interface FHEAPIStatus {
  status: string;
  version: string;
  endpoints: Record<string, string>;
  message: string;
}
