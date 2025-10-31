'use client';

import { useState } from 'react';
import { useEncrypt } from '@fhevm/sdk/react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useFHEContext } from './FHEProvider';

type Operation = 'add' | 'sub' | 'mul' | 'gt' | 'lt' | 'eq';

export function ComputationDemo() {
  const { isReady } = useFHEContext();
  const [valueA, setValueA] = useState('10');
  const [valueB, setValueB] = useState('5');
  const [operation, setOperation] = useState<Operation>('add');
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const { encrypt, isEncrypting } = useEncrypt('euint32');

  const operations: { op: Operation; label: string; symbol: string }[] = [
    { op: 'add', label: 'Add', symbol: '+' },
    { op: 'sub', label: 'Subtract', symbol: '-' },
    { op: 'mul', label: 'Multiply', symbol: '×' },
    { op: 'gt', label: 'Greater Than', symbol: '>' },
    { op: 'lt', label: 'Less Than', symbol: '<' },
    { op: 'eq', label: 'Equal', symbol: '=' },
  ];

  const handleCompute = async () => {
    try {
      setStatus('Encrypting values...');
      setResult(null);

      const numA = parseInt(valueA);
      const numB = parseInt(valueB);

      if (isNaN(numA) || isNaN(numB)) {
        setStatus('Error: Invalid numbers');
        return;
      }

      const [encA, encB] = await Promise.all([
        encrypt(numA),
        encrypt(numB),
      ]);

      setStatus('Values encrypted successfully!');
      setResult(`
Encrypted Value A: ${encA.hex.substring(0, 20)}...
Encrypted Value B: ${encB.hex.substring(0, 20)}...

These encrypted values can now be used in smart contracts for
homomorphic computation: TFHE.${operation}(a, b)

The computation happens entirely on encrypted data without
revealing the actual values!
      `.trim());
    } catch (error) {
      console.error('Computation error:', error);
      setStatus(`Error: ${(error as Error).message}`);
    }
  };

  const selectedOp = operations.find(o => o.op === operation);

  return (
    <Card title="Homomorphic Computation Demo" description="Perform computations on encrypted data">
      <div className="space-y-4">
        {/* Operation Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Operation Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {operations.map((op) => (
              <button
                key={op.op}
                onClick={() => setOperation(op.op)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  operation === op.op
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {op.symbol} {op.label}
              </button>
            ))}
          </div>
        </div>

        {/* Value Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Value A"
            type="number"
            value={valueA}
            onChange={(e) => setValueA(e.target.value)}
            placeholder="Enter first value"
          />
          <Input
            label="Value B"
            type="number"
            value={valueB}
            onChange={(e) => setValueB(e.target.value)}
            placeholder="Enter second value"
          />
        </div>

        {/* Expression Display */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/20">
          <p className="text-center text-2xl font-mono text-white">
            {valueA} {selectedOp?.symbol} {valueB}
          </p>
          <p className="text-center text-sm text-gray-400 mt-2">
            This will be computed on encrypted values
          </p>
        </div>

        {/* Compute Button */}
        <Button
          onClick={handleCompute}
          disabled={!isReady || !valueA || !valueB || isEncrypting}
          isLoading={isEncrypting}
          className="w-full"
        >
          {isEncrypting ? 'Encrypting...' : 'Encrypt & Prepare Computation'}
        </Button>

        {/* Status */}
        {status && (
          <div className={`p-3 rounded-lg ${
            status.includes('Error') ? 'bg-red-500/20 border border-red-500/50' : 'bg-green-500/20 border border-green-500/50'
          }`}>
            <p className="text-sm text-white">{status}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Computation Details
            </label>
            <div className="p-3 bg-black/30 rounded-lg border border-white/10">
              <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono">
                {result}
              </pre>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-300 mb-2">Homomorphic Operations</h4>
          <p className="text-xs text-gray-300">
            FHE allows computations on encrypted data. The smart contract can perform
            operations like addition, multiplication, or comparisons without ever
            decrypting the values. The result remains encrypted until explicitly
            decrypted by an authorized party.
          </p>
        </div>
      </div>
    </Card>
  );
}
