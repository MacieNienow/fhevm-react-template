'use client';

import { useFhevm, useEncrypt } from '@fhevm/sdk/react';
import { useAccount, useWriteContract } from 'wagmi';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PRIVATE_TAXI_DISPATCH_ADDRESS as `0x${string}`;

const PRIVATE_TAXI_DISPATCH_ABI = [
  {
    inputs: [
      { internalType: 'bytes', name: 'encLat', type: 'bytes' },
      { internalType: 'bytes', name: 'encLon', type: 'bytes' },
    ],
    name: 'registerDriver',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export default function Home() {
  const { isReady } = useFhevm({
    gatewayAddress: process.env.NEXT_PUBLIC_TAXI_GATEWAY_ADDRESS as `0x${string}`,
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 11155111),
  });

  const { address, isConnected } = useAccount();
  const { encrypt, isEncrypting } = useEncrypt('euint64');
  const { writeContract, isPending } = useWriteContract();

  const [latitude, setLatitude] = useState('40.7128');
  const [longitude, setLongitude] = useState('-74.0060');
  const [status, setStatus] = useState('');

  const handleRegisterDriver = async () => {
    try {
      setStatus('Encrypting location...');

      // Convert coordinates to integers (multiply by 1e6 for precision)
      const latInt = Math.floor(parseFloat(latitude) * 1e6);
      const lonInt = Math.floor(parseFloat(longitude) * 1e6);

      // Encrypt coordinates using @fhevm/sdk
      const [encLat, encLon] = await Promise.all([
        encrypt(latInt),
        encrypt(lonInt),
      ]);

      setStatus('Submitting to blockchain...');

      // Submit to contract
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: PRIVATE_TAXI_DISPATCH_ABI,
        functionName: 'registerDriver',
        args: [encLat.data, encLon.data],
      });

      setStatus('✅ Driver registered successfully!');
    } catch (error) {
      console.error('Error:', error);
      setStatus(`❌ Error: ${(error as Error).message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🔐 Private Ride Platform
          </h1>
          <p className="text-xl text-gray-300">
            Powered by <span className="text-purple-400 font-semibold">@fhevm/sdk</span>
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Encrypted locations • Confidential pricing • Anonymous ratings
          </p>
        </div>

        {/* Connection Status */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Connection Status</h2>
              <div className="flex gap-4">
                <StatusBadge
                  label="FHEVM"
                  status={isReady ? 'Ready' : 'Loading...'}
                  isReady={isReady}
                />
                <StatusBadge
                  label="Wallet"
                  status={isConnected ? 'Connected' : 'Not Connected'}
                  isReady={isConnected}
                />
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>

        {/* SDK Demo */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            SDK Demo: Register as Driver
          </h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Latitude
              </label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="40.7128"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Longitude
              </label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="-74.0060"
              />
            </div>
          </div>

          <button
            onClick={handleRegisterDriver}
            disabled={!isReady || !isConnected || isEncrypting || isPending}
            className="w-full py-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isEncrypting || isPending
              ? 'Processing...'
              : 'Register Driver (Encrypted)'}
          </button>

          {status && (
            <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/20">
              <p className="text-sm text-gray-300">{status}</p>
            </div>
          )}
        </div>

        {/* Code Example */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mt-6">
          <h3 className="text-xl font-bold text-white mb-4">
            📝 How It Works
          </h3>

          <div className="bg-black/30 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
              <code>{`import { useEncrypt } from '@fhevm/sdk/react';

// 1. Initialize encryption hook
const { encrypt, isEncrypting } = useEncrypt('euint64');

// 2. Encrypt values
const [encLat, encLon] = await Promise.all([
  encrypt(latitude),
  encrypt(longitude),
]);

// 3. Submit to contract
await writeContract({
  address: CONTRACT_ADDRESS,
  abi: ABI,
  functionName: 'registerDriver',
  args: [encLat.data, encLon.data],
});`}</code>
            </pre>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <FeatureCard
            icon="🔐"
            title="Encrypted Locations"
            description="Driver coordinates encrypted with FHE"
          />
          <FeatureCard
            icon="⚡"
            title="< 10 Lines"
            description="Quick setup with @fhevm/sdk"
          />
          <FeatureCard
            icon="🎯"
            title="Wagmi-like API"
            description="Familiar hooks for Web3 devs"
          />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  label,
  status,
  isReady,
}: {
  label: string;
  status: string;
  isReady: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${
          isReady ? 'bg-green-500' : 'bg-yellow-500'
        }`}
      />
      <span className="text-sm text-gray-300">
        <span className="font-semibold">{label}:</span> {status}
      </span>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="text-4xl mb-3">{icon}</div>
      <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
