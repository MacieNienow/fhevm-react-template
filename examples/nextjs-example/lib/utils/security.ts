/**
 * Security utilities for FHE operations
 */

/**
 * Sanitize input values before encryption
 */
export function sanitizeInput(value: string): string {
  return value.trim().replace(/[^\d.-]/g, '');
}

/**
 * Validate address format
 */
export function isValidAddress(address: string): boolean {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate hex string
 */
export function isValidHex(hex: string): boolean {
  if (!hex) return false;
  return /^0x[a-fA-F0-9]+$/.test(hex);
}

/**
 * Mask sensitive data for display
 */
export function maskData(data: string, visibleChars: number = 6): string {
  if (data.length <= visibleChars * 2) return data;
  return `${data.slice(0, visibleChars)}...${data.slice(-visibleChars)}`;
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 10, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Filter out old attempts
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);

    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  reset(key: string) {
    this.attempts.delete(key);
  }
}

/**
 * Validate contract interaction parameters
 */
export function validateContractParams(params: {
  address?: string;
  functionName?: string;
  args?: unknown[];
}): { valid: boolean; error?: string } {
  if (params.address && !isValidAddress(params.address)) {
    return { valid: false, error: 'Invalid contract address' };
  }

  if (params.functionName && typeof params.functionName !== 'string') {
    return { valid: false, error: 'Invalid function name' };
  }

  if (params.args && !Array.isArray(params.args)) {
    return { valid: false, error: 'Arguments must be an array' };
  }

  return { valid: true };
}
