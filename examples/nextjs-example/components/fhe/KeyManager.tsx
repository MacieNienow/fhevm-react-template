'use client';

import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useFHEContext } from './FHEProvider';

export function KeyManager() {
  const { isReady, gatewayAddress, chainId } = useFHEContext();
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const fetchPublicKey = async () => {
    try {
      setIsLoading(true);
      setStatus('Fetching public key from gateway...');

      // Simulate public key fetch (actual implementation would use @fhevm/sdk)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockPublicKey = '0x' + '1234567890abcdef'.repeat(8);
      setPublicKey(mockPublicKey);
      setStatus('Public key retrieved successfully');
    } catch (error) {
      console.error('Key fetch error:', error);
      setStatus(`Error: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isReady && !publicKey) {
      fetchPublicKey();
    }
  }, [isReady]);

  return (
    <Card title="Key Management" description="Manage FHE encryption keys">
      <div className="space-y-4">
        {/* Gateway Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Gateway Address
            </label>
            <div className="p-2 bg-black/30 rounded border border-white/10">
              <code className="text-xs text-gray-300 break-all">
                {gatewayAddress}
              </code>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Chain ID
            </label>
            <div className="p-2 bg-black/30 rounded border border-white/10">
              <code className="text-xs text-gray-300">
                {chainId} (Sepolia)
              </code>
            </div>
          </div>
        </div>

        {/* Public Key */}
        {publicKey && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Public Key
            </label>
            <div className="p-3 bg-black/30 rounded-lg border border-white/10">
              <code className="text-xs text-green-400 break-all font-mono">
                {publicKey}
              </code>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={fetchPublicKey}
            disabled={isLoading || !isReady}
            isLoading={isLoading}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Refresh Key
          </Button>
          <Button
            onClick={() => {
              if (publicKey) {
                navigator.clipboard.writeText(publicKey);
                setStatus('Public key copied to clipboard');
              }
            }}
            disabled={!publicKey}
            variant="ghost"
            size="sm"
            className="flex-1"
          >
            Copy Key
          </Button>
        </div>

        {/* Status */}
        {status && (
          <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/50">
            <p className="text-sm text-white">{status}</p>
          </div>
        )}

        {/* Info */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-300 mb-2">About Keys</h4>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Public keys are used to encrypt data before sending to contracts</li>
            <li>• Keys are retrieved from the FHE gateway</li>
            <li>• Each chain has its own set of encryption keys</li>
            <li>• Keys are managed automatically by @fhevm/sdk</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
