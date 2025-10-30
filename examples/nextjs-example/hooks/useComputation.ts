import { useState, useCallback } from 'react';
import { useEncrypt } from '@fhevm/sdk/react';

type ComputationOperation = 'add' | 'sub' | 'mul' | 'div' | 'gt' | 'lt' | 'eq' | 'ne';

/**
 * Hook for preparing homomorphic computation operations
 */
export function useComputation(type: 'euint32' | 'euint64' = 'euint32') {
  const { encrypt, isEncrypting } = useEncrypt(type);
  const [isComputing, setIsComputing] = useState(false);
  const [result, setResult] = useState<{
    operation: ComputationOperation;
    operands: string[];
    description: string;
  } | null>(null);

  const prepareComputation = useCallback(async (
    operation: ComputationOperation,
    valueA: number,
    valueB: number
  ) => {
    try {
      setIsComputing(true);
      setResult(null);

      const [encA, encB] = await Promise.all([
        encrypt(valueA),
        encrypt(valueB),
      ]);

      const description = getOperationDescription(operation, valueA, valueB);

      setResult({
        operation,
        operands: [encA.hex, encB.hex],
        description,
      });

      return {
        operation,
        encryptedA: encA,
        encryptedB: encB,
        description,
      };
    } catch (error) {
      console.error('Computation preparation error:', error);
      throw error;
    } finally {
      setIsComputing(false);
    }
  }, [encrypt]);

  return {
    prepareComputation,
    isComputing: isComputing || isEncrypting,
    result,
  };
}

function getOperationDescription(op: ComputationOperation, a: number, b: number): string {
  const operations: Record<ComputationOperation, string> = {
    add: `Add ${a} + ${b} on encrypted values`,
    sub: `Subtract ${a} - ${b} on encrypted values`,
    mul: `Multiply ${a} × ${b} on encrypted values`,
    div: `Divide ${a} ÷ ${b} on encrypted values`,
    gt: `Check if ${a} > ${b} on encrypted values`,
    lt: `Check if ${a} < ${b} on encrypted values`,
    eq: `Check if ${a} = ${b} on encrypted values`,
    ne: `Check if ${a} ≠ ${b} on encrypted values`,
  };
  return operations[op];
}
