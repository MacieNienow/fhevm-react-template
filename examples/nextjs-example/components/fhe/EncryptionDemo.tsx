'use client';

import { useState } from 'react';
import { useEncrypt } from '@fhevm/sdk/react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useFHEContext } from './FHEProvider';

type EncryptedType = 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'euint128' | 'ebool';

export function EncryptionDemo() {
  const { isReady } = useFHEContext();
  const [value, setValue] = useState('42');
  const [selectedType, setSelectedType] = useState<EncryptedType>('euint64');
  const [encryptedData, setEncryptedData] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const { encrypt, isEncrypting } = useEncrypt(selectedType);

  const handleEncrypt = async () => {
    try {
      setStatus('Encrypting...');
      setEncryptedData(null);

      const numValue = selectedType === 'ebool'
        ? (value.toLowerCase() === 'true' ? 1 : 0)
        : parseInt(value);

      if (isNaN(numValue)) {
        setStatus('Error: Invalid number');
        return;
      }

      const encrypted = await encrypt(numValue);
      setEncryptedData(encrypted.hex);
      setStatus('Encryption successful!');
    } catch (error) {
      console.error('Encryption error:', error);
      setStatus(`Error: ${(error as Error).message}`);
    }
  };

  const encryptedTypes: EncryptedType[] = ['euint8', 'euint16', 'euint32', 'euint64', 'euint128', 'ebool'];

  return (
    <Card title="FHE Encryption Demo" description="Encrypt values using Fully Homomorphic Encryption">
      <div className="space-y-4">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Encryption Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {encryptedTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedType === type
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Value Input */}
        <Input
          label="Value to Encrypt"
          type={selectedType === 'ebool' ? 'text' : 'number'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={selectedType === 'ebool' ? 'true or false' : 'Enter a number'}
        />

        {/* Encrypt Button */}
        <Button
          onClick={handleEncrypt}
          disabled={!isReady || !value || isEncrypting}
          isLoading={isEncrypting}
          className="w-full"
        >
          {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
        </Button>

        {/* Status */}
        {status && (
          <div className={`p-3 rounded-lg ${
            status.includes('Error') ? 'bg-red-500/20 border border-red-500/50' : 'bg-green-500/20 border border-green-500/50'
          }`}>
            <p className="text-sm text-white">{status}</p>
          </div>
        )}

        {/* Encrypted Result */}
        {encryptedData && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Encrypted Data (Hex)
            </label>
            <div className="p-3 bg-black/30 rounded-lg border border-white/10">
              <code className="text-xs text-green-400 break-all font-mono">
                {encryptedData}
              </code>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Length: {encryptedData.length} characters
            </p>
          </div>
        )}

        {/* Info */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-300 mb-2">How it works</h4>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>1. Select the encryption type based on your data range</li>
            <li>2. Enter the value you want to encrypt</li>
            <li>3. Click encrypt to generate FHE ciphertext</li>
            <li>4. Use the encrypted data in smart contract calls</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
