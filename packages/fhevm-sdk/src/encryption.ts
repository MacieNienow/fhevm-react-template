import type { EncryptedValue, DecryptedValue, EncryptedType, ReencryptRequest } from './types';
import { getInstance } from './instance';
import type { Hex } from 'viem';

/**
 * Encrypt a value for FHE computation
 *
 * @param value - Value to encrypt (number or bigint)
 * @param type - Encrypted type (euint8, euint16, euint32, euint64, etc.)
 * @returns Encrypted value ready for contract interaction
 *
 * @example
 * ```typescript
 * // Encrypt a number
 * const encrypted = await encryptValue(42, 'euint64');
 * await contract.write.setAge([encrypted.data]);
 * ```
 */
export async function encryptValue(
  value: number | bigint,
  type: EncryptedType = 'euint64'
): Promise<EncryptedValue> {
  const fhevm = getInstance();
  const bigintValue = BigInt(value);

  let encrypted: Uint8Array;

  switch (type) {
    case 'ebool':
      encrypted = fhevm.instance.encryptBool(bigintValue !== 0n);
      break;
    case 'euint4':
      encrypted = fhevm.instance.encrypt4(bigintValue);
      break;
    case 'euint8':
      encrypted = fhevm.instance.encrypt8(bigintValue);
      break;
    case 'euint16':
      encrypted = fhevm.instance.encrypt16(bigintValue);
      break;
    case 'euint32':
      encrypted = fhevm.instance.encrypt32(bigintValue);
      break;
    case 'euint64':
      encrypted = fhevm.instance.encrypt64(bigintValue);
      break;
    case 'euint128':
      encrypted = fhevm.instance.encrypt128(bigintValue);
      break;
    case 'euint256':
      encrypted = fhevm.instance.encrypt256(bigintValue);
      break;
    case 'eaddress':
      encrypted = fhevm.instance.encryptAddress(bigintValue);
      break;
    default:
      throw new Error(`Unsupported encrypted type: ${type}`);
  }

  return {
    data: encrypted,
    hex: `0x${Buffer.from(encrypted).toString('hex')}` as Hex,
  };
}

/**
 * Decrypt a value from the gateway
 *
 * @param handle - Encrypted value handle
 * @param contractAddress - Contract address
 * @param userAddress - User address
 * @returns Decrypted value
 *
 * @example
 * ```typescript
 * const handle = await contract.read.getAge();
 * const decrypted = await decryptValue(handle, contractAddress, userAddress);
 * console.log('Age:', decrypted.value);
 * ```
 */
export async function decryptValue<T = bigint>(
  handle: bigint,
  contractAddress: `0x${string}`,
  userAddress: `0x${string}`
): Promise<DecryptedValue<T>> {
  const fhevm = getInstance();

  // In a real implementation, this would call the gateway
  // For now, we'll throw a descriptive error
  throw new Error(
    'Decryption requires gateway integration. Use reencryptValue() for client-side decryption.'
  );
}

/**
 * Re-encrypt a value for client-side decryption
 *
 * @param request - Re-encryption request with signature
 * @returns Decrypted value
 *
 * @example
 * ```typescript
 * const signature = await signPermit(contractAddress, userAddress);
 * const decrypted = await reencryptValue({
 *   contractAddress,
 *   userAddress,
 *   handle,
 *   signature,
 *   publicKey: fhevm.publicKey.key,
 * });
 * ```
 */
export async function reencryptValue(
  request: ReencryptRequest
): Promise<bigint> {
  const fhevm = getInstance();

  // Re-encrypt using the instance
  const reencrypted = await fhevm.instance.reencrypt(
    request.handle,
    request.contractAddress,
    request.userAddress,
    request.signature,
    request.publicKey
  );

  return reencrypted;
}

/**
 * Encrypt multiple values at once
 *
 * @param values - Array of values to encrypt
 * @param type - Encrypted type
 * @returns Array of encrypted values
 *
 * @example
 * ```typescript
 * const encrypted = await encryptBatch([1, 2, 3], 'euint32');
 * await contract.write.setValues(encrypted.map(e => e.data));
 * ```
 */
export async function encryptBatch(
  values: (number | bigint)[],
  type: EncryptedType = 'euint64'
): Promise<EncryptedValue[]> {
  return Promise.all(values.map((value) => encryptValue(value, type)));
}
