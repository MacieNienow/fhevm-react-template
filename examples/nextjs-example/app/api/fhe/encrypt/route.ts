import { NextRequest, NextResponse } from 'next/server';

/**
 * FHE Encryption API Route
 * Handles encryption of values using FHEVM SDK
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { value, type = 'euint64' } = body;

    if (value === undefined || value === null) {
      return NextResponse.json(
        { error: 'Missing required field: value' },
        { status: 400 }
      );
    }

    // Validate encryption type
    const validTypes = [
      'ebool',
      'euint4',
      'euint8',
      'euint16',
      'euint32',
      'euint64',
      'euint128',
      'euint256',
      'eaddress',
    ];

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid encryption type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Note: Actual encryption happens client-side with @fhevm/sdk
    // This endpoint serves as an example for server-side validation
    // and can be extended for server-side encryption if needed

    return NextResponse.json({
      success: true,
      message: 'Encryption request validated',
      type,
      note: 'Client-side encryption recommended using @fhevm/sdk/react hooks',
      example: {
        hook: 'useEncrypt',
        code: `const { encrypt } = useEncrypt('${type}');\nconst encrypted = await encrypt(${value});`,
      },
    });
  } catch (error) {
    console.error('Encryption API error:', error);
    return NextResponse.json(
      { error: 'Encryption request failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/fhe/encrypt',
    method: 'POST',
    description: 'Validates encryption requests for FHE operations',
    parameters: {
      value: 'number | string | boolean - Value to encrypt',
      type: 'string - Encryption type (euint64, euint32, etc.)',
    },
    supportedTypes: [
      'ebool',
      'euint4',
      'euint8',
      'euint16',
      'euint32',
      'euint64',
      'euint128',
      'euint256',
      'eaddress',
    ],
  });
}
