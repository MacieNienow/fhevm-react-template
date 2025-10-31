# Node.js FHEVM Example

CLI application demonstrating @fhevm/sdk server-side integration.

## Features

- Server-side FHE encryption
- Functional and class-based API examples
- Real-world use case demonstrations
- Performance benchmarking
- CLI-friendly output

## Getting Started

```bash
# Install dependencies
npm install

# Run the example
npm start

# Run with auto-reload
npm run dev
```

## Examples Included

### 1. Functional API
Simple encryption using functional approach:
```typescript
import { createFhevmInstance, encryptValue } from '@fhevm/sdk';

const fhevm = await createFhevmInstance({
  gatewayAddress: '0x79d6742b1Bf62452bfcBC6b137ed4eA1ba459a6B',
  chainId: 11155111,
});

const encrypted = await encryptValue(42, 'euint64');
```

### 2. Class-based API
Using the FhevmClient class:
```typescript
import { FhevmClient } from '@fhevm/sdk';

const client = new FhevmClient({
  gatewayAddress: '0x79d6742b1Bf62452bfcBC6b137ed4eA1ba459a6B',
  chainId: 11155111,
});

await client.init();
const encrypted = await client.encrypt(1000000, 'euint64');
```

### 3. Real-world Use Case
Private medical data encryption example.

### 4. Performance Benchmark
Compare single vs batch encryption performance.

## Use Cases

Perfect for:
- Backend services
- CLI tools
- Data preprocessing
- Testing and development
- Automated encryption workflows
- Serverless functions

## Learn More

- [SDK Documentation](../../packages/fhevm-sdk/README.md)
- [React Example](../react-example) - Frontend integration
- [Next.js Example](../nextjs-example) - Full-stack application
