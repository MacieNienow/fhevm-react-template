/**
 * Key management utilities
 */

export interface PublicKey {
  key: string;
  chainId: number;
  timestamp: number;
}

/**
 * Fetch public key from gateway
 */
export async function fetchPublicKey(
  gatewayAddress: string,
  chainId: number
): Promise<PublicKey> {
  try {
    // In a real implementation, this would fetch from the actual gateway
    // For now, returning mock data
    return {
      key: '0x' + '0'.repeat(128), // Mock public key
      chainId,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Failed to fetch public key:', error);
    throw new Error('Public key fetch failed');
  }
}

/**
 * Validate public key format
 */
export function validatePublicKey(key: string): boolean {
  if (!key.startsWith('0x')) {
    return false;
  }

  // Check if it's a valid hex string
  const hexRegex = /^0x[0-9a-fA-F]+$/;
  return hexRegex.test(key);
}

/**
 * Cache for public keys
 */
const keyCache = new Map<string, PublicKey>();

export function getCachedKey(chainId: number): PublicKey | undefined {
  return keyCache.get(`chain-${chainId}`);
}

export function setCachedKey(chainId: number, key: PublicKey) {
  keyCache.set(`chain-${chainId}`, key);
}

export function clearKeyCache() {
  keyCache.clear();
}
