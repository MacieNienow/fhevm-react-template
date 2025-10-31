# API Documentation

Complete API reference for @fhevm/sdk.

## Table of Contents

- [Core API](#core-api)
- [React Hooks](#react-hooks)
- [Types](#types)
- [Examples](#examples)

## Core API

### `createFhevmInstance(config)`

Initialize FHEVM instance globally.

**Parameters:**
- `config: FhevmConfig` - Configuration object
  - `gatewayAddress: Address` - Gateway contract address
  - `chainId: number` - Chain ID (e.g., 11155111 for Sepolia)
  - `rpcUrl?: string` - Optional RPC URL

**Returns:** `Promise<FhevmInstance>`

**Example:**
```typescript
import { createFhevmInstance } from '@fhevm/sdk';

const fhevm = await createFhevmInstance({
  gatewayAddress: '0x79d6742b1Bf62452bfcBC6b137ed4eA1ba459a6B',
  chainId: 11155111,
});
```

### `encryptValue(value, type)`

Encrypt a single value.

**Parameters:**
- `value: number | bigint` - Value to encrypt
- `type: EncryptedType` - Type of encryption (default: 'euint64')

**Returns:** `Promise<EncryptedValue>`

**Example:**
```typescript
import { encryptValue } from '@fhevm/sdk';

const encrypted = await encryptValue(42, 'euint64');
console.log(encrypted.hex); // Hex string
console.log(encrypted.data); // Uint8Array
```

### `encryptBatch(values, type)`

Encrypt multiple values efficiently.

**Parameters:**
- `values: (number | bigint)[]` - Array of values
- `type: EncryptedType` - Type of encryption (default: 'euint64')

**Returns:** `Promise<EncryptedValue[]>`

**Example:**
```typescript
import { encryptBatch } from '@fhevm/sdk';

const encrypted = await encryptBatch([10, 20, 30], 'euint32');
```

### `createPermit(contractAddress, userAddress, signer)`

Create EIP-712 permit signature for decryption.

**Parameters:**
- `contractAddress: Address` - Contract address
- `userAddress: Address` - User address
- `signer: (message: any) => Promise<string>` - Signing function

**Returns:** `Promise<PermitSignature>`

**Example:**
```typescript
import { createPermit } from '@fhevm/sdk';

const permit = await createPermit(
  contractAddress,
  userAddress,
  async (message) => await wallet.signTypedData(message)
);
```

### `FhevmClient`

Class-based API for FHE operations.

**Methods:**
- `init()` - Initialize client
- `encrypt(value, type)` - Encrypt value
- `encryptBatch(values, type)` - Batch encrypt
- `createPermit(contractAddress, userAddress, signer)` - Create permit
- `reencrypt(handle, contractAddress, userAddress, signature)` - Re-encrypt for decryption
- `getPublicKey()` - Get public key
- `getEIP712Domain(contractAddress)` - Get EIP-712 domain
- `isInitialized()` - Check initialization status

**Example:**
```typescript
import { FhevmClient } from '@fhevm/sdk';

const client = new FhevmClient({
  gatewayAddress: '0x79d6742b1Bf62452bfcBC6b137ed4eA1ba459a6B',
  chainId: 11155111,
});

await client.init();
const encrypted = await client.encrypt(42, 'euint64');
```

## React Hooks

### `useFhevm(config)`

Initialize FHEVM in React application.

**Parameters:**
- `config: FhevmConfig` - Configuration object

**Returns:**
```typescript
{
  fhevm: FhevmInstance | null;
  isLoading: boolean;
  error: Error | null;
  isReady: boolean;
}
```

**Example:**
```typescript
import { useFhevm } from '@fhevm/sdk/react';

function App() {
  const { isReady, isLoading, error } = useFhevm({
    gatewayAddress: '0x79d6742b1Bf62452bfcBC6b137ed4eA1ba459a6B',
    chainId: 11155111,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>FHEVM Ready!</div>;
}
```

### `useEncrypt(type)`

Hook for encrypting values.

**Parameters:**
- `type: EncryptedType` - Encryption type (default: 'euint64')

**Returns:**
```typescript
{
  encrypt: (value: number | bigint) => Promise<EncryptedValue>;
  encryptMany: (values: (number | bigint)[]) => Promise<EncryptedValue[]>;
  isEncrypting: boolean;
  error: Error | null;
}
```

**Example:**
```typescript
import { useEncrypt } from '@fhevm/sdk/react';

function EncryptButton() {
  const { encrypt, isEncrypting } = useEncrypt('euint64');

  const handleClick = async () => {
    const encrypted = await encrypt(42);
    // Use encrypted.data in contract call
  };

  return (
    <button onClick={handleClick} disabled={isEncrypting}>
      Encrypt
    </button>
  );
}
```

### `usePermit(contractAddress, userAddress)`

Hook for creating permit signatures.

**Parameters:**
- `contractAddress: Address` - Contract address
- `userAddress: Address | undefined` - User address

**Returns:**
```typescript
{
  createPermitSignature: (signer: SignerFunction) => Promise<PermitSignature>;
  isCreating: boolean;
  error: Error | null;
}
```

**Example:**
```typescript
import { usePermit } from '@fhevm/sdk/react';
import { useSignTypedData } from 'wagmi';

function DecryptButton({ contractAddress, userAddress }) {
  const { createPermitSignature, isCreating } = usePermit(
    contractAddress,
    userAddress
  );
  const { signTypedDataAsync } = useSignTypedData();

  const handleDecrypt = async () => {
    const permit = await createPermitSignature(
      async (message) => await signTypedDataAsync(message)
    );
    // Use permit for decryption
  };

  return <button onClick={handleDecrypt}>Decrypt</button>;
}
```

### `FhevmProvider`

React context provider for FHEVM.

**Props:**
- `config: FhevmConfig` - Configuration
- `children: ReactNode` - Child components

**Example:**
```typescript
import { FhevmProvider } from '@fhevm/sdk/react';

function App() {
  return (
    <FhevmProvider
      config={{
        gatewayAddress: '0x79d6742b1Bf62452bfcBC6b137ed4eA1ba459a6B',
        chainId: 11155111,
      }}
    >
      <YourApp />
    </FhevmProvider>
  );
}
```

## Types

### `EncryptedType`

Supported encrypted types:
- `'ebool'` - Encrypted boolean
- `'euint4'` - Encrypted 4-bit unsigned integer
- `'euint8'` - Encrypted 8-bit unsigned integer
- `'euint16'` - Encrypted 16-bit unsigned integer
- `'euint32'` - Encrypted 32-bit unsigned integer
- `'euint64'` - Encrypted 64-bit unsigned integer
- `'euint128'` - Encrypted 128-bit unsigned integer
- `'euint256'` - Encrypted 256-bit unsigned integer
- `'eaddress'` - Encrypted address

### `FhevmConfig`

```typescript
interface FhevmConfig {
  gatewayAddress: Address;
  chainId: number;
  rpcUrl?: string;
}
```

### `EncryptedValue`

```typescript
interface EncryptedValue {
  data: Uint8Array;  // Binary data for contract
  hex: string;       // Hex string representation
}
```

### `FhevmInstance`

```typescript
interface FhevmInstance {
  instance: FhevmJsInstance;
  publicKey: PublicKey;
}
```

## Examples

See the [examples directory](../examples/) for complete working examples:

- [Next.js Example](../examples/nextjs-example/) - Full React integration
- [React Example](../examples/react-example/) - Simple Vite setup
- [Node.js Example](../examples/nodejs-example/) - Server-side usage
- [Private Taxi Dispatch](../examples/PrivateTaxiDispatch/) - Real-world application
