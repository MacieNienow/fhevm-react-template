import { NextRequest, NextResponse } from 'next/server';

/**
 * FHE Decryption API Route
 * Handles decryption requests using permit signatures
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { handle, contractAddress, userAddress, signature, publicKey } = body;

    // Validate required fields
    if (!handle || !contractAddress || !userAddress) {
      return NextResponse.json(
        {
          error: 'Missing required fields: handle, contractAddress, userAddress',
        },
        { status: 400 }
      );
    }

    // Note: Actual decryption happens through the gateway
    // This endpoint serves as an example for server-side validation

    return NextResponse.json({
      success: true,
      message: 'Decryption request validated',
      note: 'Client-side decryption recommended using @fhevm/sdk reencrypt methods',
      example: {
        hook: 'usePermit',
        code: `const { createPermitSignature } = usePermit(contractAddress, userAddress);\nconst permit = await createPermitSignature(signer);\nconst decrypted = await reencrypt(handle, permit);`,
      },
      requiredFields: {
        handle: 'Encrypted value handle',
        contractAddress: 'Contract address',
        userAddress: 'User wallet address',
        signature: 'EIP-712 permit signature',
        publicKey: 'User public key',
      },
    });
  } catch (error) {
    console.error('Decryption API error:', error);
    return NextResponse.json(
      { error: 'Decryption request failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/fhe/decrypt',
    method: 'POST',
    description: 'Validates decryption requests for FHE operations',
    parameters: {
      handle: 'bigint - Encrypted value handle',
      contractAddress: 'string - Contract address',
      userAddress: 'string - User wallet address',
      signature: 'string - EIP-712 permit signature',
      publicKey: 'string - User public key',
    },
    workflow: [
      '1. Create EIP-712 permit signature',
      '2. Request re-encryption from gateway',
      '3. Decrypt using user private key',
    ],
  });
}
