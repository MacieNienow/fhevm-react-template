import { getInstance } from './instance';
import type { PublicKey } from './types';
import type { Hex } from 'viem';

/**
 * Get the public key for encryption
 *
 * @returns Public key
 *
 * @example
 * ```typescript
 * const publicKey = getPublicKey();
 * console.log('Public Key:', publicKey.key);
 * ```
 */
export function getPublicKey(): PublicKey {
  const fhevm = getInstance();
  return fhevm.publicKey;
}

/**
 * Get EIP-712 domain for a contract
 *
 * @param contractAddress - Contract address
 * @returns EIP-712 domain
 *
 * @example
 * ```typescript
 * const domain = getEIP712Domain(contractAddress);
 * ```
 */
export function getEIP712Domain(contractAddress: `0x${string}`) {
  const fhevm = getInstance();

  return {
    name: 'Authorization token',
    version: '1',
    chainId: fhevm.config.chainId,
    verifyingContract: contractAddress,
  };
}

/**
 * Convert bytes to hex string
 *
 * @param bytes - Uint8Array
 * @returns Hex string
 */
export function bytesToHex(bytes: Uint8Array): Hex {
  return `0x${Buffer.from(bytes).toString('hex')}` as Hex;
}

/**
 * Convert hex string to bytes
 *
 * @param hex - Hex string
 * @returns Uint8Array
 */
export function hexToBytes(hex: Hex): Uint8Array {
  const cleaned = hex.replace(/^0x/, '');
  return new Uint8Array(
    cleaned.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
}

/**
 * Validate contract address format
 *
 * @param address - Address to validate
 * @returns True if valid
 */
export function isValidAddress(address: string): address is `0x${string}` {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
