/**
 * React hooks for FHEVM SDK
 * Framework-specific integration for React applications
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createFhevmInstance, getInstance, hasInstance } from './instance';
import { encryptValue, encryptBatch } from './encryption';
import { createPermit } from './permit';
import type { FhevmConfig, FhevmInstance, EncryptedType, ContractAddress, EncryptedValue } from './types';
import type { Address } from 'viem';

/**
 * Hook to initialize and manage FHEVM instance
 *
 * @param config - FHEVM configuration
 * @returns FHEVM instance and loading state
 *
 * @example
 * ```typescript
 * function App() {
 *   const { fhevm, isLoading, error } = useFhevm({
 *     gatewayAddress: '0x...',
 *     chainId: 11155111,
 *   });
 *
 *   if (isLoading) return <div>Loading FHEVM...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return <div>FHEVM Ready!</div>;
 * }
 * ```
 */
export function useFhevm(config: FhevmConfig) {
  const [fhevm, setFhevm] = useState<FhevmInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        setIsLoading(true);
        setError(null);

        const instance = await createFhevmInstance(config);

        if (mounted) {
          setFhevm(instance);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, [config.chainId, config.gatewayAddress]);

  return { fhevm, isLoading, error, isReady: !isLoading && !error };
}

/**
 * Hook to encrypt values
 *
 * @param type - Encrypted type
 * @returns Encryption function and state
 *
 * @example
 * ```typescript
 * function EncryptInput() {
 *   const { encrypt, isEncrypting, error } = useEncrypt('euint64');
 *
 *   const handleSubmit = async () => {
 *     const encrypted = await encrypt(42);
 *     await contract.write.setValue([encrypted.data]);
 *   };
 *
 *   return <button onClick={handleSubmit}>Encrypt & Submit</button>;
 * }
 * ```
 */
export function useEncrypt(type: EncryptedType = 'euint64') {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (value: number | bigint): Promise<EncryptedValue> => {
      try {
        setIsEncrypting(true);
        setError(null);

        const encrypted = await encryptValue(value, type);

        setIsEncrypting(false);
        return encrypted;
      } catch (err) {
        const error = err as Error;
        setError(error);
        setIsEncrypting(false);
        throw error;
      }
    },
    [type]
  );

  const encryptMany = useCallback(
    async (values: (number | bigint)[]): Promise<EncryptedValue[]> => {
      try {
        setIsEncrypting(true);
        setError(null);

        const encrypted = await encryptBatch(values, type);

        setIsEncrypting(false);
        return encrypted;
      } catch (err) {
        const error = err as Error;
        setError(error);
        setIsEncrypting(false);
        throw error;
      }
    },
    [type]
  );

  return { encrypt, encryptMany, isEncrypting, error };
}

/**
 * Hook to create permit signatures
 *
 * @param contractAddress - Contract address
 * @param userAddress - User address
 * @returns Permit creation function and state
 *
 * @example
 * ```typescript
 * function DecryptButton({ contractAddress, userAddress }) {
 *   const { createPermitSignature, isCreating, error } = usePermit(
 *     contractAddress,
 *     userAddress
 *   );
 *
 *   const handleDecrypt = async () => {
 *     const permit = await createPermitSignature(
 *       async (message) => await wallet.signTypedData(message)
 *     );
 *     // Use permit for decryption
 *   };
 *
 *   return <button onClick={handleDecrypt}>Decrypt</button>;
 * }
 * ```
 */
export function usePermit(
  contractAddress: ContractAddress,
  userAddress: Address | undefined
) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPermitSignature = useCallback(
    async (signer: (message: any) => Promise<`0x${string}`>) => {
      if (!userAddress) {
        throw new Error('User address is required');
      }

      try {
        setIsCreating(true);
        setError(null);

        const permit = await createPermit(contractAddress, userAddress, signer);

        setIsCreating(false);
        return permit;
      } catch (err) {
        const error = err as Error;
        setError(error);
        setIsCreating(false);
        throw error;
      }
    },
    [contractAddress, userAddress]
  );

  return { createPermitSignature, isCreating, error };
}

/**
 * Hook to get FHEVM public key
 *
 * @returns Public key or null if not initialized
 *
 * @example
 * ```typescript
 * function PublicKeyDisplay() {
 *   const publicKey = usePublicKey();
 *
 *   if (!publicKey) return <div>Loading...</div>;
 *
 *   return <div>Public Key: {publicKey.key}</div>;
 * }
 * ```
 */
export function usePublicKey() {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  useEffect(() => {
    if (hasInstance()) {
      const instance = getInstance();
      setPublicKey(instance.publicKey.key);
    }
  }, []);

  return publicKey;
}

/**
 * Provider component for FHEVM context (optional pattern)
 *
 * @example
 * ```typescript
 * function App() {
 *   return (
 *     <FhevmProvider config={{ gatewayAddress: '0x...', chainId: 11155111 }}>
 *       <YourApp />
 *     </FhevmProvider>
 *   );
 * }
 * ```
 */
export function FhevmProvider({
  config,
  children,
}: {
  config: FhevmConfig;
  children: React.ReactNode;
}) {
  const { isLoading, error, isReady } = useFhevm(config);

  if (isLoading) {
    return <div>Initializing FHEVM...</div>;
  }

  if (error) {
    return <div>Error initializing FHEVM: {error.message}</div>;
  }

  return <>{children}</>;
}
