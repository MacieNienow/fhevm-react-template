/**
 * Validation utilities for forms and data
 */

/**
 * Validate numeric input
 */
export function validateNumber(value: string | number, options?: {
  min?: number;
  max?: number;
  integer?: boolean;
}): { valid: boolean; error?: string } {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { valid: false, error: 'Invalid number' };
  }

  if (options?.integer && !Number.isInteger(num)) {
    return { valid: false, error: 'Must be an integer' };
  }

  if (options?.min !== undefined && num < options.min) {
    return { valid: false, error: `Must be at least ${options.min}` };
  }

  if (options?.max !== undefined && num > options.max) {
    return { valid: false, error: `Must be at most ${options.max}` };
  }

  return { valid: true };
}

/**
 * Validate encryption type input
 */
export function validateEncryptionType(type: string): boolean {
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
  return validTypes.includes(type);
}

/**
 * Validate operation type
 */
export function validateOperation(operation: string): boolean {
  const validOperations = [
    'add', 'sub', 'mul', 'div',
    'eq', 'ne', 'gt', 'gte', 'lt', 'lte',
    'and', 'or', 'xor', 'not',
    'shl', 'shr',
    'min', 'max',
  ];
  return validOperations.includes(operation);
}

/**
 * Validate form data
 */
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean;
  message?: string;
}

export function validateField(
  value: unknown,
  rules: ValidationRule
): { valid: boolean; error?: string } {
  if (rules.required && !value) {
    return { valid: false, error: rules.message || 'This field is required' };
  }

  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return {
        valid: false,
        error: rules.message || `Minimum length is ${rules.minLength}`,
      };
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return {
        valid: false,
        error: rules.message || `Maximum length is ${rules.maxLength}`,
      };
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return {
        valid: false,
        error: rules.message || 'Invalid format',
      };
    }
  }

  if (rules.custom && !rules.custom(value)) {
    return {
      valid: false,
      error: rules.message || 'Validation failed',
    };
  }

  return { valid: true };
}

/**
 * Validate multiple fields
 */
export function validateForm(
  data: Record<string, unknown>,
  rules: Record<string, ValidationRule>
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const result = validateField(data[field], fieldRules);
    if (!result.valid && result.error) {
      errors[field] = result.error;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
