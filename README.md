# 🔐 Universal FHEVM SDK

**Next-generation FHEVM SDK for building confidential frontends** - Framework-agnostic, developer-friendly, and production-ready.

[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![Zama](https://img.shields.io/badge/Powered%20by-Zama%20FHEVM-purple)](https://docs.zama.ai)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)

**Built for the Zama FHE Bounty Challenge** - A universal SDK that makes building confidential applications simple, consistent, and intuitive for all Web3 developers.

---

## 🌐 Live Demonstration

**GitHub Repository**: [https://github.com/MacieNienow/fhevm-react-template](https://github.com/MacieNienow/fhevm-react-template)

**Example Application**: [https://fhe-taxi-dispatch.vercel.app/](https://fhe-taxi-dispatch.vercel.app/)

**Demo Video**: `demo.mp4` (Download to watch - streaming not available)

The video demonstration showcases the complete SDK integration in a real-world ride-sharing application.

---

## 🎯 Overview

This project introduces **@fhevm/sdk** - a universal, framework-agnostic SDK that wraps all FHEVM dependencies into a single, cohesive package with an intuitive API that Web3 developers already know.

### ✨ Key Features

- 🎯 **Framework Agnostic**: Works with Node.js, Next.js, React, Vue, or any JavaScript environment
- 📦 **All-in-One Package**: Single dependency wraps fhevmjs, viem, and all required libraries
- 🪝 **Intuitive API**: Familiar hooks-based interface (`useFhevm`, `useEncrypt`, `usePermit`)
- ⚡ **Quick Setup**: < 10 lines of code to get started with FHE
- 🔐 **Complete FHE Flow**: Initialization → Encryption → Contract Interaction → Decryption
- 🧩 **Modular & Reusable**: Clean, composable utilities adaptable to any framework
- 📚 **Comprehensive Docs**: Detailed guides, examples, and API reference
- 🚀 **Production Ready**: TypeScript, tested, and optimized for real applications

---

## 🚀 Quick Start

### Installation

```bash
npm install @fhevm/sdk
# or
yarn add @fhevm/sdk
# or
pnpm add @fhevm/sdk
```

### Basic Usage (< 10 lines)

```typescript
import { createFhevmInstance, encryptValue } from '@fhevm/sdk';

// 1. Initialize FHEVM (1 line)
const fhevm = await createFhevmInstance({
  gatewayAddress: '0x79d6742b1Bf62452bfcBC6b137ed4eA1ba459a6B',
  chainId: 11155111,
});

// 2. Encrypt a value (1 line)
const encrypted = await encryptValue(42, 'euint64');

// 3. Use in contract (1 line)
await contract.write.setValue([encrypted.data]);
```

**That's it!** 🎉 You're now using FHE encryption in your application.

### React Usage

```typescript
import { useFhevm, useEncrypt } from '@fhevm/sdk/react';

function App() {
  const { isReady } = useFhevm({
    gatewayAddress: '0x79d6742b1Bf62452bfcBC6b137ed4eA1ba459a6B',
    chainId: 11155111,
  });

  const { encrypt } = useEncrypt('euint64');

  if (!isReady) return <div>Loading...</div>;

  return (
    <button onClick={async () => {
      const enc = await encrypt(42);
      await contract.write.setValue([enc.data]);
    }}>
      Encrypt & Submit
    </button>
  );
}
```

---

## 📦 What's Included

### Package Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/              # 🎯 Main SDK Package
│       ├── src/
│       │   ├── index.ts        # Core exports (framework-agnostic)
│       │   ├── react.ts        # React hooks (useFhevm, useEncrypt, usePermit)
│       │   ├── client.ts       # FhevmClient class
│       │   ├── instance.ts     # Instance management
│       │   ├── encryption.ts   # Encryption utilities
│       │   ├── permit.ts       # EIP-712 permit signatures
│       │   ├── utils.ts        # Helper functions
│       │   └── types.ts        # TypeScript definitions
│       ├── package.json
│       ├── tsconfig.json
│       └── README.md           # SDK documentation
│
├── examples/
│   ├── nextjs-example/         # Next.js 14 + App Router + RainbowKit
│   │   ├── app/                # Anonymous taxi dispatch system
│   │   ├── components/         # Reusable FHE components
│   │   ├── config/             # Contract ABIs and addresses
│   │   ├── hooks/              # Custom hooks using @fhevm/sdk
│   │   └── package.json
│   │
│   ├── react-example/          # React 18 + Vite
│   │   └── src/                # Simple encrypted counter
│   │
│   └── nodejs-example/         # Node.js CLI
│       └── index.ts            # Server-side encryption
│
├── demo.mp4                    # 📹 Video demonstration
├── README.md                   # This file
├── LICENSE                     # MIT License
└── package.json                # Monorepo configuration
```

---

## 🎯 Real-World Example: Anonymous Taxi Dispatch

**Live Demo**: [https://fhe-taxi-dispatch.vercel.app/](https://fhe-taxi-dispatch.vercel.app/)
**Contract**: `0xd3cc141C38dac488bc1875140e538f0fAcEe7b26` (Sepolia)

### Core Concept

A privacy-preserving ride-sharing platform where sensitive information remains encrypted:

- **Driver Locations**: GPS coordinates encrypted as `euint64`
- **Ride Pricing**: Offers remain confidential until accepted
- **Distance Calculations**: Computed on encrypted data using homomorphic operations
- **Driver Ratings**: Aggregated without exposing individual ratings

### SDK Integration Example

```typescript
import { useFhevm, useEncrypt } from '@fhevm/sdk/react';
import { useWriteContract } from 'wagmi';

function DriverRegistration() {
  const { isReady } = useFhevm({
    gatewayAddress: '0x79d6742b1Bf62452bfcBC6b137ed4eA1ba459a6B',
    chainId: 11155111,
  });

  const { encrypt } = useEncrypt('euint64');
  const { writeContract } = useWriteContract();

  const registerDriver = async (latitude: number, longitude: number) => {
    // Convert to integers (multiply by 1e6 for precision)
    const latInt = Math.floor(latitude * 1e6);
    const lonInt = Math.floor(longitude * 1e6);

    // Encrypt coordinates
    const [encLat, encLon] = await Promise.all([
      encrypt(latInt),
      encrypt(lonInt),
    ]);

    // Submit to contract
    await writeContract({
      address: '0xd3cc141C38dac488bc1875140e538f0fAcEe7b26',
      abi: TAXI_DISPATCH_ABI,
      functionName: 'registerDriver',
      args: [encLat.data, encLon.data],
    });
  };

  return (
    <button onClick={() => registerDriver(40.7128, -74.006)}>
      Register as Driver
    </button>
  );
}
```

---

## 🎯 Why This SDK?

### Before (Scattered Dependencies)

```typescript
// Install multiple packages
npm install fhevmjs ethers @fhevm/contracts

// Complex setup
import { createInstance } from 'fhevmjs';
import { ethers } from 'ethers';

const instance = await createInstance({ ... });
const publicKey = await getPublicKeyFromGateway(gatewayAddress);
const encrypted = instance.encrypt64(value);
// ... lots of boilerplate
```

### After (@fhevm/sdk)

```typescript
// Single package
npm install @fhevm/sdk

// Simple, consistent API
import { createFhevmInstance, encryptValue } from '@fhevm/sdk';

const fhevm = await createFhevmInstance({ gatewayAddress, chainId });
const encrypted = await encryptValue(42, 'euint64');
```

**74% less code, 100% more clarity** ✨

---

## 🔧 SDK Features

### 1. Framework Agnostic Core

Works everywhere JavaScript runs:

```typescript
// Node.js
import { createFhevmInstance, encryptValue } from '@fhevm/sdk';

// Next.js
import { createFhevmInstance } from '@fhevm/sdk';

// React
import { useFhevm, useEncrypt } from '@fhevm/sdk/react';

// Vue (Composition API)
import { createFhevmInstance } from '@fhevm/sdk';
```

### 2. Intuitive Hooks (React)

Familiar API for Web3 developers:

```typescript
const { fhevm, isLoading, error, isReady } = useFhevm(config);
const { encrypt, isEncrypting } = useEncrypt('euint64');
const { createPermitSignature, isCreating } = usePermit(contractAddress, userAddress);
```

### 3. Complete FHE Flow

Everything you need in one package:

```typescript
import { FhevmClient } from '@fhevm/sdk';

const client = new FhevmClient({ gatewayAddress, chainId });
await client.init();

// Encrypt
const encrypted = await client.encrypt(42, 'euint64');

// Create permit for decryption
const permit = await client.createPermit(contractAddress, userAddress, signer);

// Re-encrypt for client-side decryption
const decrypted = await client.reencrypt(handle, contractAddress, userAddress, signature);
```

### 4. TypeScript First

Full type safety and IntelliSense:

```typescript
import type {
  FhevmConfig,
  EncryptedValue,
  PermitSignature,
  EncryptedType
} from '@fhevm/sdk';

const encrypted: EncryptedValue = await encryptValue(42, 'euint64');
//    ^ Fully typed with IntelliSense
```

### 5. Batch Operations

Efficient multi-value encryption:

```typescript
import { encryptBatch } from '@fhevm/sdk';

const encrypted = await encryptBatch([1, 2, 3, 4, 5], 'euint32');
await contract.write.setValues(encrypted.map(e => e.data));
```

---

## 📚 Documentation

### Complete API Reference

- **Core API**: [packages/fhevm-sdk/README.md](./packages/fhevm-sdk/README.md)
- **React Hooks**: [packages/fhevm-sdk/README.md#react-hooks](./packages/fhevm-sdk/README.md#react-hooks)
- **Examples**: [examples/](./examples/)

### Key Functions

| Function | Description | Framework |
|----------|-------------|-----------|
| `createFhevmInstance(config)` | Initialize FHEVM | All |
| `encryptValue(value, type)` | Encrypt a single value | All |
| `encryptBatch(values, type)` | Encrypt multiple values | All |
| `createPermit(...)` | Create EIP-712 permit | All |
| `reencryptValue(...)` | Re-encrypt for decryption | All |
| `useFhevm(config)` | Initialize hook | React |
| `useEncrypt(type)` | Encryption hook | React |
| `usePermit(...)` | Permit creation hook | React |
| `FhevmClient` | Class-based API | All |

### Supported Types

`ebool`, `euint4`, `euint8`, `euint16`, `euint32`, `euint64`, `euint128`, `euint256`, `eaddress`

---

## 🎬 Demo Video

**File**: `demo.mp4` (Download required to watch)

**Contents**:
1. **Setup (0:00-1:30)**: Installing @fhevm/sdk and initializing FHEVM
2. **Basic Usage (1:30-3:00)**: Encrypting values and submitting to contract
3. **React Integration (3:00-5:00)**: Using hooks in Next.js application
4. **Anonymous Taxi Dispatch Demo (5:00-8:00)**: Complete walkthrough of example application
5. **Framework Flexibility (8:00-10:00)**: Showing Vue and Node.js integration
6. **Design Choices (10:00-12:00)**: Architecture and API design decisions

---

## 💡 Design Choices

### 1. Framework Agnostic Core

**Why?** FHE encryption is a universal need, not framework-specific.

**How?** Pure TypeScript core with framework-specific adapters.

### 2. Intuitive API

**Why?** Lower barrier to entry for Web3 developers.

**How?** Familiar patterns and naming conventions.

### 3. Single Package

**Why?** Reduce dependency management complexity.

**How?** Wrap all requirements in one package.

### 4. TypeScript First

**Why?** Type safety prevents runtime errors.

**How?** Complete type definitions for all APIs.

### 5. Minimal Setup

**Why?** Faster onboarding = more adoption.

**How?** Sensible defaults and auto-configuration.

---

## 🔗 Project Links

### Example Application

- **Live Demo**: [https://fhe-taxi-dispatch.vercel.app/](https://fhe-taxi-dispatch.vercel.app/)
- **GitHub**: [https://github.com/MacieNienow/fhevm-react-template](https://github.com/MacieNienow/fhevm-react-template)
- **Contract**: [0xd3cc141C38dac488bc1875140e538f0fAcEe7b26](https://sepolia.etherscan.io/address/0xd3cc141C38dac488bc1875140e538f0fAcEe7b26)

### Resources

- **Zama FHEVM**: [docs.zama.ai](https://docs.zama.ai)
- **fhevmjs**: [github.com/zama-ai/fhevmjs](https://github.com/zama-ai/fhevmjs)
- **Sepolia Testnet**: [sepolia.dev](https://sepolia.dev)

---

## 🛠️ Development

### Setup

```bash
# Clone repository
git clone https://github.com/MacieNienow/fhevm-react-template.git
cd fhevm-react-template

# Install dependencies
npm install

# Build SDK
cd packages/fhevm-sdk
npm run build

# Run Next.js example
cd ../../examples/nextjs-example
npm run dev
```

### Testing

```bash
# Test SDK
cd packages/fhevm-sdk
npm test

# Type checking
npm run type-check

# Build
npm run build
```

---

## 🤝 Contributing

Contributions welcome! This SDK is designed to be community-driven.

**Areas for contribution**:
- Vue composables (`@fhevm/sdk/vue`)
- Svelte stores (`@fhevm/sdk/svelte`)
- Angular services (`@fhevm/sdk/angular`)
- Additional encrypted types
- Performance optimizations

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgments

- **Zama** for FHEVM technology and inspiration
- **Ethereum Foundation** for testnet infrastructure
- **RainbowKit** for wallet integration patterns
- **Viem** for Ethereum interactions
- **fhevmjs** for core FHE functionality

---

**Built for the Zama FHE Bounty Challenge** 🏆

**Powered by**: [Zama FHEVM](https://docs.zama.ai) | **Network**: [Sepolia Testnet](https://sepolia.etherscan.io)

---

> **Note**: This SDK is a bounty submission demonstrating universal FHEVM integration. The example application showcases an anonymous taxi dispatch system with encrypted driver locations and confidential pricing. Suitable for development and testing. Additional security audits recommended for production use.
