import { NextRequest, NextResponse } from 'next/server';

/**
 * FHE Operations API Route
 * Handles general FHE operations and status checks
 */
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      status: 'operational',
      version: '1.0.0',
      endpoints: {
        encrypt: '/api/fhe/encrypt',
        decrypt: '/api/fhe/decrypt',
        compute: '/api/fhe/compute',
        keys: '/api/keys',
      },
      message: 'FHE API is ready',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get FHE API status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, data } = body;

    if (!operation || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: operation, data' },
        { status: 400 }
      );
    }

    // Route to appropriate operation
    switch (operation) {
      case 'encrypt':
        return NextResponse.json({
          success: true,
          message: 'Use /api/fhe/encrypt endpoint',
        });
      case 'decrypt':
        return NextResponse.json({
          success: true,
          message: 'Use /api/fhe/decrypt endpoint',
        });
      case 'compute':
        return NextResponse.json({
          success: true,
          message: 'Use /api/fhe/compute endpoint',
        });
      default:
        return NextResponse.json(
          { error: `Unknown operation: ${operation}` },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
}
