import { NextRequest, NextResponse } from 'next/server';

/**
 * FHE Homomorphic Computation API Route
 * Handles computation requests on encrypted data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, operands, contractAddress } = body;

    if (!operation || !operands || !Array.isArray(operands)) {
      return NextResponse.json(
        {
          error: 'Missing required fields: operation, operands (array)',
        },
        { status: 400 }
      );
    }

    // Validate operation type
    const validOperations = [
      'add',
      'sub',
      'mul',
      'div',
      'eq',
      'ne',
      'gt',
      'gte',
      'lt',
      'lte',
      'and',
      'or',
      'xor',
      'not',
      'shl',
      'shr',
      'min',
      'max',
    ];

    if (!validOperations.includes(operation)) {
      return NextResponse.json(
        {
          error: `Invalid operation. Must be one of: ${validOperations.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Note: Homomorphic computations happen on-chain in smart contracts
    // This endpoint serves as documentation and validation

    return NextResponse.json({
      success: true,
      message: 'Computation request validated',
      operation,
      operandCount: operands.length,
      note: 'Homomorphic computations are performed on-chain in smart contracts',
      example: {
        solidity: `
// Example Solidity contract with FHE computation
import "fhevm/lib/TFHE.sol";

contract Calculator {
  function add(einput encA, einput encB) public returns (euint64) {
    euint64 a = TFHE.asEuint64(encA);
    euint64 b = TFHE.asEuint64(encB);
    return TFHE.add(a, b);
  }
}`,
      },
      supportedOperations: validOperations,
    });
  } catch (error) {
    console.error('Computation API error:', error);
    return NextResponse.json(
      { error: 'Computation request failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/fhe/compute',
    method: 'POST',
    description: 'Validates homomorphic computation requests',
    parameters: {
      operation: 'string - Type of computation (add, sub, mul, etc.)',
      operands: 'array - Encrypted operands',
      contractAddress: 'string - Contract performing computation',
    },
    supportedOperations: {
      arithmetic: ['add', 'sub', 'mul', 'div'],
      comparison: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte'],
      logical: ['and', 'or', 'xor', 'not'],
      bitwise: ['shl', 'shr'],
      minMax: ['min', 'max'],
    },
    note: 'Actual computations happen on-chain using TFHE library',
  });
}
