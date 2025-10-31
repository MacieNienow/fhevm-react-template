# React FHEVM Example

Simple React application demonstrating @fhevm/sdk integration with Vite.

## Features

- React 18 with TypeScript
- Vite for fast development
- Direct SDK hooks integration
- Encrypted value counter demo
- Minimal setup required

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## SDK Integration

This example demonstrates the simplest way to integrate @fhevm/sdk into a React application:

```typescript
import { useFhevm, useEncrypt } from '@fhevm/sdk/react';

function App() {
  const { isReady } = useFhevm({
    gatewayAddress: '0x79d6742b1Bf62452bfcBC6b137ed4eA1ba459a6B',
    chainId: 11155111,
  });

  const { encrypt, isEncrypting } = useEncrypt('euint64');

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42);
    console.log('Encrypted:', encrypted.hex);
  };

  return (
    <button onClick={handleEncrypt} disabled={!isReady || isEncrypting}>
      Encrypt Value
    </button>
  );
}
```

## Learn More

- [SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Next.js Example](../nextjs-example) - More advanced integration
- [Private Taxi Dispatch](../PrivateTaxiDispatch) - Real-world application
