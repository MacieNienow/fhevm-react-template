/**
 * FHE type definitions and utilities
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
  type: EncryptedType;
}

export interface FHEConfig {
  gatewayAddress: `0x${string}`;
  chainId: number;
  rpcUrl?: string;
}

export interface PermitSignature {
  signature: string;
  publicKey: string;
}

/**
 * Get the maximum value for an encrypted type
 */
export function getMaxValue(type: EncryptedType): bigint {
  const maxValues: Record<EncryptedType, bigint> = {
    ebool: 1n,
    euint4: 15n,
    euint8: 255n,
    euint16: 65535n,
    euint32: 4294967295n,
    euint64: 18446744073709551615n,
    euint128: (1n << 128n) - 1n,
    euint256: (1n << 256n) - 1n,
    eaddress: (1n << 160n) - 1n,
  };
  return maxValues[type];
}

/**
 * Validate if a value fits in the encrypted type
 */
export function validateValueForType(value: number | bigint, type: EncryptedType): boolean {
  const bigValue = BigInt(value);
  if (bigValue < 0n) {
    return false;
  }
  return bigValue <= getMaxValue(type);
}

/**
 * Get the recommended type for a value
 */
export function getRecommendedType(value: number | bigint): EncryptedType {
  const bigValue = BigInt(value);

  if (bigValue <= 1n) return 'ebool';
  if (bigValue <= 15n) return 'euint4';
  if (bigValue <= 255n) return 'euint8';
  if (bigValue <= 65535n) return 'euint16';
  if (bigValue <= 4294967295n) return 'euint32';
  if (bigValue <= 18446744073709551615n) return 'euint64';
  if (bigValue < (1n << 128n)) return 'euint128';

  return 'euint256';
}
