'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { EncryptionDemo } from '../components/fhe/EncryptionDemo';
import { ComputationDemo } from '../components/fhe/ComputationDemo';
import { KeyManager } from '../components/fhe/KeyManager';
import { BankingExample } from '../components/examples/BankingExample';
import { MedicalExample } from '../components/examples/MedicalExample';
import { FHEProvider, useFHEContext } from '../components/fhe/FHEProvider';
import { Card } from '../components/ui/Card';

type TabType = 'overview' | 'encryption' | 'computation' | 'keys' | 'banking' | 'medical';

function StatusBadge({ label, status, isReady }: { label: string; status: string; isReady: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-green-500' : 'bg-yellow-500'}`} />
      <span className="text-sm text-gray-300">
        <span className="font-semibold">{label}:</span> {status}
      </span>
    </div>
  );
}

function HomePage() {
  const { isReady } = useFHEContext();
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'encryption', label: 'Encryption', icon: '🔐' },
    { id: 'computation', label: 'Computation', icon: '⚡' },
    { id: 'keys', label: 'Keys', icon: '🔑' },
    { id: 'banking', label: 'Banking', icon: '💰' },
    { id: 'medical', label: 'Medical', icon: '🏥' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            FHE SDK Complete Demo
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Powered by <span className="text-purple-400 font-semibold">@fhevm/sdk</span>
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Next.js 14 • React Hooks • Fully Homomorphic Encryption
          </p>
        </div>

        {/* Connection Status */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Connection Status</h2>
              <div className="flex flex-wrap gap-4">
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

        {/* Tab Navigation */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <Card title="Welcome to FHE SDK Demo" description="Explore comprehensive FHE integration examples">
                <div className="space-y-4">
                  <p className="text-gray-300">
                    This demonstration showcases the complete capabilities of <strong className="text-purple-400">@fhevm/sdk</strong> with Next.js 14.
                    Explore various FHE operations through interactive examples.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                      <h4 className="text-lg font-semibold text-purple-300 mb-2">Core Features</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>✓ Value encryption with multiple types</li>
                        <li>✓ Homomorphic computations</li>
                        <li>✓ Key management</li>
                        <li>✓ API route examples</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                      <h4 className="text-lg font-semibold text-blue-300 mb-2">Use Cases</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>✓ Private banking transactions</li>
                        <li>✓ Confidential medical records</li>
                        <li>✓ Anonymous voting systems</li>
                        <li>✓ Encrypted data analytics</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 mt-4">
                    <h4 className="text-sm font-semibold text-green-300 mb-2">Getting Started</h4>
                    <ol className="text-xs text-gray-300 space-y-1 list-decimal list-inside">
                      <li>Ensure your wallet is connected</li>
                      <li>Wait for FHEVM to initialize</li>
                      <li>Explore different tabs to see FHE in action</li>
                      <li>Try the banking and medical examples for real-world scenarios</li>
                    </ol>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tabs.slice(1).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all text-left"
                  >
                    <div className="text-4xl mb-3">{tab.icon}</div>
                    <h4 className="text-lg font-semibold text-white mb-2">{tab.label}</h4>
                    <p className="text-sm text-gray-400">
                      {tab.id === 'encryption' && 'Encrypt values with various types'}
                      {tab.id === 'computation' && 'Perform homomorphic operations'}
                      {tab.id === 'keys' && 'Manage encryption keys'}
                      {tab.id === 'banking' && 'Private financial transactions'}
                      {tab.id === 'medical' && 'Confidential health records'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'encryption' && (
            <div className="animate-fade-in">
              <EncryptionDemo />
            </div>
          )}

          {activeTab === 'computation' && (
            <div className="animate-fade-in">
              <ComputationDemo />
            </div>
          )}

          {activeTab === 'keys' && (
            <div className="animate-fade-in">
              <KeyManager />
            </div>
          )}

          {activeTab === 'banking' && (
            <div className="animate-fade-in">
              <BankingExample />
            </div>
          )}

          {activeTab === 'medical' && (
            <div className="animate-fade-in">
              <MedicalExample />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-400">
          <p>Built with @fhevm/sdk • Next.js 14 • Tailwind CSS</p>
          <p className="mt-2">Demonstrating complete FHE integration</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <FHEProvider>
      <HomePage />
    </FHEProvider>
  );
}
