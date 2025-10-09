# @fhevm/sdk

**Universal FHEVM SDK** - Framework-agnostic encryption and decryption utilities for building confidential frontends with Fully Homomorphic Encryption (FHE).

## ✨ Features

- 🎯 **Framework Agnostic**: Works with React, Vue, Node.js, or any JavaScript environment
- 📦 **All-in-One Package**: Wraps all required dependencies (fhevmjs, viem, etc.)
- 🪝 **Wagmi-like API**: Familiar hooks-based interface for Web3 developers
- ⚡ **Quick Setup**: < 10 lines of code to get started
- 🔐 **Complete FHE Flow**: Initialization, encryption, decryption, and contract interaction
- 🧩 **Modular & Reusable**: Clean components adaptable to different frameworks
- 📚 **Well Documented**: Comprehensive guides and examples

## 🚀 Quick Start

### Installation

```bash
npm install @fhevm/sdk
# or
yarn add @fhevm/sdk
# or
pnpm add @fhevm/sdk
```

### Basic Usage (Framework Agnostic)

```typescript
import { createFhevmInstance, encryptValue } from '@fhevm/sdk';

// 1. Initialize FHEVM
const fhevm = await createFhevmInstance({
  gatewayAddress: '0x...',
  chainId: 11155111, // Sepolia
});

// 2. Encrypt a value
const encrypted = await encryptValue(42, 'euint64');

// 3. Use in contract call
await contract.write.setValue([encrypted.data]);
```

### React Usage

```typescript
import { useFhevm, useEncrypt } from '@fhevm/sdk/react';

function App() {
  // 1. Initialize FHEVM
  const { fhevm, isLoading } = useFhevm({
    gatewayAddress: '0x...',
    chainId: 11155111,
  });

  // 2. Use encryption hook
  const { encrypt } = useEncrypt('euint64');

  const handleSubmit = async () => {
    const encrypted = await encrypt(42);
    await contract.write.setValue([encrypted.data]);
  };

  if (isLoading) return <div>Loading...</div>;

  return <button onClick={handleSubmit}>Encrypt & Submit</button>;
}
```

## 📖 Full Documentation

### Core API

#### `createFhevmInstance(config)`

Initialize the FHEVM instance:

```typescript
import { createFhevmInstance } from '@fhevm/sdk';

const fhevm = await createFhevmInstance({
  gatewayAddress: '0x79d6742b1Bf62452bfcBC6b137ed4eA1ba459a6B',
  chainId: 11155111,
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY', // optional
});
```

#### `encryptValue(value, type)`

Encrypt a value for FHE computation:

```typescript
import { encryptValue } from '@fhevm/sdk';

// Encrypt different types
const encBool = await encryptValue(true, 'ebool');
const enc8 = await encryptValue(255, 'euint8');
const enc64 = await encryptValue(1000000n, 'euint64');

// Use in contract
await contract.write.setAge([enc64.data]);
```

**Supported Types**: `ebool`, `euint4`, `euint8`, `euint16`, `euint32`, `euint64`, `euint128`, `euint256`, `eaddress`

#### `encryptBatch(values, type)`

Encrypt multiple values at once:

```typescript
import { encryptBatch } from '@fhevm/sdk';

const encrypted = await encryptBatch([1, 2, 3, 4, 5], 'euint32');
await contract.write.setValues(encrypted.map((e) => e.data));
```

#### `createPermit(contractAddress, userAddress, signer)`

Create EIP-712 permit for decryption:

```typescript
import { createPermit } from '@fhevm/sdk';

const permit = await createPermit(
  contractAddress,
  userAddress,
  async (message) => await wallet.signTypedData(message)
);

// Use permit for re-encryption
const decrypted = await reencryptValue({
  handle,
  contractAddress,
  userAddress,
  signature: permit.signature,
  publicKey: permit.publicKey,
});
```

#### `FhevmClient`

High-level class-based API:

```typescript
import { FhevmClient } from '@fhevm/sdk';

const client = new FhevmClient({
  gatewayAddress: '0x...',
  chainId: 11155111,
});

await client.init();

// Encrypt
const encrypted = await client.encrypt(42, 'euint64');

// Create permit
const permit = await client.createPermit(contractAddress, userAddress, signer);

// Re-encrypt for decryption
const decrypted = await client.reencrypt(handle, contractAddress, userAddress, signature);
```

### React Hooks

#### `useFhevm(config)`

Initialize and manage FHEVM instance:

```typescript
import { useFhevm } from '@fhevm/sdk/react';

function App() {
  const { fhevm, isLoading, error, isReady } = useFhevm({
    gatewayAddress: '0x...',
    chainId: 11155111,
  });

  if (isLoading) return <div>Loading FHEVM...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>FHEVM Ready!</div>;
}
```

#### `useEncrypt(type)`

Hook for encrypting values:

```typescript
import { useEncrypt } from '@fhevm/sdk/react';

function EncryptForm() {
  const { encrypt, encryptMany, isEncrypting, error } = useEncrypt('euint64');

  const handleSubmit = async (value: number) => {
    try {
      const encrypted = await encrypt(value);
      await contract.write.setValue([encrypted.data]);
    } catch (err) {
      console.error('Encryption failed:', err);
    }
  };

  return (
    <form onSubmit={() => handleSubmit(42)}>
      <button type="submit" disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Submit'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
```

#### `usePermit(contractAddress, userAddress)`

Hook for creating permits:

```typescript
import { usePermit } from '@fhevm/sdk/react';
import { useWalletClient } from 'wagmi';

function DecryptButton({ contractAddress, userAddress }) {
  const { data: wallet } = useWalletClient();
  const { createPermitSignature, isCreating } = usePermit(contractAddress, userAddress);

  const handleDecrypt = async () => {
    const permit = await createPermitSignature(async (message) =>
      wallet.signTypedData(message)
    );

    // Use permit for decryption
    const decrypted = await reencrypt(handle, permit);
  };

  return (
    <button onClick={handleDecrypt} disabled={isCreating}>
      {isCreating ? 'Creating Permit...' : 'Decrypt'}
    </button>
  );
}
```

#### `usePublicKey()`

Get the FHEVM public key:

```typescript
import { usePublicKey } from '@fhevm/sdk/react';

function PublicKeyDisplay() {
  const publicKey = usePublicKey();

  if (!publicKey) return <div>Loading...</div>;

  return <div>Public Key: {publicKey.substring(0, 20)}...</div>;
}
```

### Utilities

```typescript
import { getPublicKey, getEIP712Domain, bytesToHex, hexToBytes, isValidAddress } from '@fhevm/sdk';

// Get public key
const pk = getPublicKey();

// Get EIP-712 domain for signing
const domain = getEIP712Domain(contractAddress);

// Convert bytes/hex
const hex = bytesToHex(encrypted.data);
const bytes = hexToBytes('0x1234...');

// Validate addresses
if (isValidAddress(addr)) {
  // Valid Ethereum address
}
```

## 🎯 Complete Example

### Private Ride-Sharing Platform

```typescript
import { useFhevm, useEncrypt, usePermit } from '@fhevm/sdk/react';
import { useWalletClient, useWriteContract } from 'wagmi';

function DriverRegistration() {
  const { isReady } = useFhevm({
    gatewayAddress: '0x79d6742b1Bf62452bfcBC6b137ed4eA1ba459a6B',
    chainId: 11155111,
  });

  const { encrypt, isEncrypting } = useEncrypt('euint64');
  const { writeContract } = useWriteContract();

  const registerDriver = async (latitude: number, longitude: number) => {
    // Encrypt location coordinates
    const [encLat, encLon] = await Promise.all([encrypt(latitude), encrypt(longitude)]);

    // Submit to contract
    await writeContract({
      address: '0x9e77F5121215474e473401E9768a517DAFde1f87',
      abi: TAXI_DISPATCH_ABI,
      functionName: 'registerDriver',
      args: [encLat.data, encLon.data],
    });
  };

  if (!isReady) return <div>Initializing...</div>;

  return (
    <button onClick={() => registerDriver(40.7128, -74.006)} disabled={isEncrypting}>
      Register as Driver
    </button>
  );
}
```

## 🌐 Framework Support

### React

```typescript
import { useFhevm, useEncrypt } from '@fhevm/sdk/react';
```

### Vue (Composition API)

```typescript
import { createFhevmInstance, encryptValue } from '@fhevm/sdk';
import { ref, onMounted } from 'vue';

export function useFhevmComposable(config) {
  const fhevm = ref(null);
  const isLoading = ref(true);

  onMounted(async () => {
    fhevm.value = await createFhevmInstance(config);
    isLoading.value = false;
  });

  return { fhevm, isLoading };
}
```

### Node.js

```typescript
import { createFhevmInstance, encryptValue } from '@fhevm/sdk';

const fhevm = await createFhevmInstance({
  gatewayAddress: '0x...',
  chainId: 11155111,
});

const encrypted = await encryptValue(42, 'euint64');
console.log('Encrypted:', encrypted.hex);
```

## 📦 Package Structure

```
@fhevm/sdk/
├── index.ts          # Core exports (framework-agnostic)
├── react.ts          # React hooks
├── client.ts         # FhevmClient class
├── instance.ts       # Instance management
├── encryption.ts     # Encryption utilities
├── permit.ts         # Permit/signature handling
├── utils.ts          # Helper functions
└── types.ts          # TypeScript types
```

## 🔧 Configuration

### FhevmConfig

```typescript
interface FhevmConfig {
  /** Gateway contract address for decryption */
  gatewayAddress: Address;
  /** Network chain ID */
  chainId: number;
  /** RPC URL (optional) */
  rpcUrl?: string;
  /** ACL contract address (optional) */
  aclAddress?: Address;
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Type checking
npm run type-check

# Build
npm run build
```

## 📚 Resources

- **Zama FHEVM Docs**: [docs.zama.ai](https://docs.zama.ai)
- **fhevmjs**: [github.com/zama-ai/fhevmjs](https://github.com/zama-ai/fhevmjs)
- **Examples**: See `examples/` directory

## 🤝 Contributing

Contributions welcome! Please see [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details.

---

**Built for the Zama FHE Challenge** 🏆

**Powered by**: [Zama FHEVM](https://docs.zama.ai)
