# Private Ride-Sharing Platform - Next.js Example

**Complete showcase of @fhevm/sdk** in a real-world application.

## Overview

This example demonstrates how to build a privacy-first ride-sharing platform using **@fhevm/sdk** with Next.js 14, RainbowKit, and Wagmi.

### Features Implemented

- 🔐 **Encrypted Driver Locations**: Location coordinates encrypted with FHE (euint64)
- 🚗 **Confidential Ride Offers**: Prices encrypted until accepted
- ⭐ **Anonymous Ratings**: Driver ratings computed on encrypted data
- 💼 **Wallet Integration**: RainbowKit + Wagmi v2
- 📊 **Real-time Updates**: Transaction history with encrypted data

## Quick Start

### Installation

```bash
cd examples/nextjs-example
npm install
```

### Environment Setup

Create `.env.local`:

```env
# Blockchain Configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=sepolia

# Contract Addresses (Sepolia)
NEXT_PUBLIC_PAUSER_SET_ADDRESS=0x23903e691644780737F7ac079C58C5B76195Bcdd
NEXT_PUBLIC_TAXI_GATEWAY_ADDRESS=0x79d6742b1Bf62452bfcBC6b137ed4eA1ba459a6B
NEXT_PUBLIC_PRIVATE_TAXI_DISPATCH_ADDRESS=0x9e77F5121215474e473401E9768a517DAFde1f87

# RPC URL
NEXT_PUBLIC_SEPOLIA_RPC_URL=your_rpc_url_here

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Using @fhevm/sdk

### 1. Initialize FHEVM

**File**: `app/providers.tsx`

```typescript
import { useFhevm } from '@fhevm/sdk/react';

function Providers({ children }) {
  const { fhevm, isLoading } = useFhevm({
    gatewayAddress: process.env.NEXT_PUBLIC_TAXI_GATEWAY_ADDRESS!,
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
  });

  if (isLoading) return <div>Initializing FHE...</div>;

  return <>{children}</>;
}
```

### 2. Encrypt Location Data

**File**: `hooks/useDriverRegistration.ts`

```typescript
import { useEncrypt } from '@fhevm/sdk/react';
import { useWriteContract } from 'wagmi';

export function useDriverRegistration() {
  const { encrypt, isEncrypting } = useEncrypt('euint64');
  const { writeContract } = useWriteContract();

  const registerDriver = async (latitude: number, longitude: number) => {
    // Encrypt location coordinates
    const [encLat, encLon] = await Promise.all([
      encrypt(latitude),
      encrypt(longitude),
    ]);

    // Submit to contract
    await writeContract({
      address: CONTRACT_ADDRESS,
      abi: PRIVATE_TAXI_DISPATCH_ABI,
      functionName: 'registerDriver',
      args: [encLat.data, encLon.data],
    });
  };

  return { registerDriver, isEncrypting };
}
```

### 3. Submit Encrypted Offers

**File**: `hooks/useRideOffer.ts`

```typescript
import { useEncrypt } from '@fhevm/sdk/react';

export function useRideOffer() {
  const { encrypt } = useEncrypt('euint64');

  const submitOffer = async (requestId: number, price: number) => {
    // Encrypt price
    const encryptedPrice = await encrypt(price);

    // Submit offer with encrypted price
    await contract.write.submitOffer([
      requestId,
      encryptedPrice.data,
    ]);
  };

  return { submitOffer };
}
```

### 4. Decrypt with Permits

**File**: `hooks/useDecryption.ts`

```typescript
import { usePermit } from '@fhevm/sdk/react';
import { useWalletClient } from 'wagmi';

export function useDecryption(contractAddress: string) {
  const { data: wallet } = useWalletClient();
  const { createPermitSignature, isCreating } = usePermit(
    contractAddress,
    wallet?.account.address
  );

  const decryptValue = async (handle: bigint) => {
    // Create permit signature
    const permit = await createPermitSignature(
      async (message) => await wallet!.signTypedData(message)
    );

    // Use permit for re-encryption
    const decrypted = await reencryptValue({
      handle,
      contractAddress,
      userAddress: wallet!.account.address,
      signature: permit.signature,
      publicKey: permit.publicKey,
    });

    return decrypted;
  };

  return { decryptValue, isCreating };
}
```

## Architecture

```
┌─────────────────────────────────────────────┐
│          Frontend (Next.js 14)              │
│  ┌───────────────────────────────────────┐  │
│  │   @fhevm/sdk Integration              │  │
│  │   - useFhevm()                        │  │
│  │   - useEncrypt()                      │  │
│  │   - usePermit()                       │  │
│  └───────────────────────────────────────┘  │
│                    ↓                         │
│  ┌───────────────────────────────────────┐  │
│  │   Wagmi + RainbowKit                  │  │
│  │   - useAccount()                      │  │
│  │   - useWriteContract()                │  │
│  │   - useReadContract()                 │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│     Smart Contracts (Sepolia)               │
│  - PrivateTaxiDispatch                      │
│  - TaxiGateway                              │
│  - PauserSet                                │
└─────────────────────────────────────────────┘
```

## Project Structure

```
nextjs-example/
├── app/
│   ├── layout.tsx          # Root layout with FHEVM provider
│   ├── page.tsx            # Home page
│   ├── providers.tsx       # Web3 + FHEVM providers
│   └── globals.css         # Styles
│
├── components/
│   ├── DriverDashboard.tsx     # Driver registration & management
│   ├── PassengerDashboard.tsx  # Ride requests & offers
│   ├── RideHistory.tsx         # Transaction history
│   └── ui/                     # Reusable UI components
│
├── hooks/
│   ├── useDriverRegistration.ts  # Driver registration hook
│   ├── useRideOffer.ts           # Offer submission hook
│   ├── useDecryption.ts          # Decryption hook
│   └── useTransactionHistory.ts  # History tracking
│
├── config/
│   ├── contracts.ts        # Contract ABIs & addresses
│   └── wagmi.ts           # Wagmi configuration
│
└── lib/
    ├── types.ts           # TypeScript types
    └── utils.ts           # Helper functions
```

## Key Components

### Driver Registration

**Component**: `components/DriverDashboard.tsx`

Demonstrates:
- ✅ Using `useEncrypt()` for location encryption
- ✅ Batch encryption for latitude/longitude
- ✅ Loading states during encryption
- ✅ Error handling

### Ride Request

**Component**: `components/PassengerDashboard.tsx`

Demonstrates:
- ✅ Multiple encrypted inputs (pickup, destination, max fare)
- ✅ Form validation before encryption
- ✅ Transaction confirmation

### Offer Submission

**Component**: `components/RideOffers.tsx`

Demonstrates:
- ✅ Encrypting price offers
- ✅ Viewing encrypted offers
- ✅ Accepting offers

### Decryption

**Component**: `components/DecryptButton.tsx`

Demonstrates:
- ✅ Creating EIP-712 permits
- ✅ Re-encryption for client-side decryption
- ✅ Displaying decrypted values

## Smart Contract Integration

### PrivateTaxiDispatch Contract

**Network**: Sepolia Testnet
**Address**: `0x9e77F5121215474e473401E9768a517DAFde1f87`

**Key Functions**:

```solidity
// Register driver with encrypted location
function registerDriver(
    bytes calldata encLat,
    bytes calldata encLon
) external;

// Submit encrypted ride offer
function submitOffer(
    uint256 requestId,
    bytes calldata encryptedPrice
) external;

// Complete ride with rating
function completeRide(
    uint256 rideId,
    uint8 rating
) external;
```

## SDK Usage Examples

### Example 1: Simple Encryption

```typescript
import { useEncrypt } from '@fhevm/sdk/react';

function EncryptExample() {
  const { encrypt, isEncrypting } = useEncrypt('euint64');

  const handleSubmit = async () => {
    const encrypted = await encrypt(42);
    console.log('Encrypted:', encrypted.hex);
  };

  return (
    <button onClick={handleSubmit} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
    </button>
  );
}
```

### Example 2: Batch Encryption

```typescript
import { encryptBatch } from '@fhevm/sdk';

async function encryptCoordinates(lat: number, lon: number) {
  const encrypted = await encryptBatch([lat, lon], 'euint64');
  return encrypted;
}
```

### Example 3: Permission-based Decryption

```typescript
import { usePermit } from '@fhevm/sdk/react';

function DecryptExample({ handle }) {
  const { createPermitSignature } = usePermit(contractAddress, userAddress);

  const decrypt = async () => {
    const permit = await createPermitSignature(signer);
    const value = await reencrypt(handle, permit);
    return value;
  };

  return <button onClick={decrypt}>Decrypt</button>;
}
```

## Performance Optimizations

### Code Splitting

```typescript
// next.config.mjs
experimental: {
  optimizePackageImports: ['@fhevm/sdk', '@rainbow-me/rainbowkit', 'wagmi'],
}
```

### Caching FHEVM Instance

```typescript
// Singleton pattern for FHEVM instance
const fhevm = getInstance(); // Reuses existing instance
```

### Batch Operations

```typescript
// Encrypt multiple values in one call
const encrypted = await encryptBatch([val1, val2, val3], 'euint32');
```

## Testing

```bash
# Run type checking
npm run type-check

# Lint code
npm run lint

# Build for production
npm run build
```

## Deployment

### Vercel

```bash
# Deploy to Vercel
vercel

# Or use the button in main README
```

### Environment Variables

Set these in Vercel:
- `NEXT_PUBLIC_CHAIN_ID`
- `NEXT_PUBLIC_PAUSER_SET_ADDRESS`
- `NEXT_PUBLIC_TAXI_GATEWAY_ADDRESS`
- `NEXT_PUBLIC_PRIVATE_TAXI_DISPATCH_ADDRESS`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_SEPOLIA_RPC_URL`

## Learning Resources

- **@fhevm/sdk Docs**: [../../packages/fhevm-sdk/README.md](../../packages/fhevm-sdk/README.md)
- **Zama FHEVM**: [docs.zama.ai](https://docs.zama.ai)
- **Wagmi**: [wagmi.sh](https://wagmi.sh)
- **RainbowKit**: [rainbowkit.com](https://rainbowkit.com)

## License

MIT - see [LICENSE](../../LICENSE)

---

**Built with @fhevm/sdk** - Making FHE encryption simple and intuitive 🔐
