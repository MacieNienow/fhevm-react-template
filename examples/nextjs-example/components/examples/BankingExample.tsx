'use client';

import { useState } from 'react';
import { useEncrypt } from '@fhevm/sdk/react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useFHEContext } from '../fhe/FHEProvider';

export function BankingExample() {
  const { isReady } = useFHEContext();
  const [balance, setBalance] = useState('1000');
  const [amount, setAmount] = useState('');
  const [operation, setOperation] = useState<'deposit' | 'withdraw'>('deposit');
  const [result, setResult] = useState<string | null>(null);

  const { encrypt, isEncrypting } = useEncrypt('euint64');

  const handleTransaction = async () => {
    try {
      const amountNum = parseInt(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        setResult('Error: Invalid amount');
        return;
      }

      setResult('Encrypting transaction...');

      const encryptedAmount = await encrypt(amountNum);

      setResult(`
Transaction Encrypted Successfully!

Operation: ${operation.toUpperCase()}
Amount: ${amount} (encrypted)
Encrypted Data: ${encryptedAmount.hex.substring(0, 30)}...

In a real application, this encrypted transaction would be
sent to a smart contract which would:
1. Verify the transaction using FHE
2. Update your balance homomorphically (without decryption)
3. Emit events with encrypted amounts
4. Maintain complete privacy of transaction details
      `.trim());

      setTimeout(() => {
        const newBalance = operation === 'deposit'
          ? parseInt(balance) + amountNum
          : parseInt(balance) - amountNum;
        setBalance(newBalance.toString());
        setAmount('');
      }, 1000);
    } catch (error) {
      console.error('Transaction error:', error);
      setResult(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-bold text-white">Private Banking Example</h3>
        <p className="text-sm text-gray-400 mt-1">
          Confidential balance and transactions using FHE
        </p>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Balance Display */}
          <div className="p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl border border-purple-500/30">
            <p className="text-sm text-gray-400 mb-1">Encrypted Balance</p>
            <p className="text-3xl font-bold text-white">${balance}</p>
            <p className="text-xs text-gray-400 mt-2">
              (In production, this would be encrypted and hidden)
            </p>
          </div>

          {/* Operation Selection */}
          <div className="flex gap-2">
            <button
              onClick={() => setOperation('deposit')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                operation === 'deposit'
                  ? 'bg-green-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              Deposit
            </button>
            <button
              onClick={() => setOperation('withdraw')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                operation === 'withdraw'
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              Withdraw
            </button>
          </div>

          {/* Amount Input */}
          <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />

          {/* Submit Button */}
          <Button
            onClick={handleTransaction}
            disabled={!isReady || !amount || isEncrypting}
            isLoading={isEncrypting}
            className="w-full"
            variant={operation === 'deposit' ? 'primary' : 'secondary'}
          >
            {isEncrypting ? 'Processing...' : `${operation === 'deposit' ? 'Deposit' : 'Withdraw'} (Encrypted)`}
          </Button>

          {/* Result */}
          {result && (
            <div className={`p-3 rounded-lg ${
              result.includes('Error')
                ? 'bg-red-500/20 border border-red-500/50'
                : 'bg-green-500/20 border border-green-500/50'
            }`}>
              <pre className="text-xs text-white whitespace-pre-wrap">
                {result}
              </pre>
            </div>
          )}

          {/* Info */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-300 mb-2">
              Privacy Features
            </h4>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Balances stored encrypted on-chain</li>
              <li>• Transaction amounts never revealed</li>
              <li>• Computations performed on encrypted data</li>
              <li>• Only authorized parties can decrypt balances</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
