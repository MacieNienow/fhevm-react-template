import { useState, useCallback } from 'react';
import { useEncrypt } from '@fhevm/sdk/react';
import type { EncryptedType } from '@fhevm/sdk';

/**
 * Enhanced encryption hook with batch operations and error handling
 */
export function useEncryption(defaultType: EncryptedType = 'euint64') {
  const { encrypt, isEncrypting } = useEncrypt(defaultType);
  const [error, setError] = useState<Error | null>(null);
  const [lastEncrypted, setLastEncrypted] = useState<string | null>(null);

  const encryptValue = useCallback(async (value: number | bigint) => {
    try {
      setError(null);
      const encrypted = await encrypt(value);
      setLastEncrypted(encrypted.hex);
      return encrypted;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Encryption failed');
      setError(error);
      throw error;
    }
  }, [encrypt]);

  const encryptBatch = useCallback(async (values: (number | bigint)[]) => {
    try {
      setError(null);
      const encrypted = await Promise.all(values.map(v => encrypt(v)));
      return encrypted;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Batch encryption failed');
      setError(error);
      throw error;
    }
  }, [encrypt]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    encrypt: encryptValue,
    encryptBatch,
    isEncrypting,
    error,
    lastEncrypted,
    clearError,
  };
}
