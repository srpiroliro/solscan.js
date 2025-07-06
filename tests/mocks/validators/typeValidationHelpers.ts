import { ApiV2Response } from "../../../src/types/general";

/**
 * Type validation helpers for comprehensive type checking in tests
 */

/**
 * Validates that an object satisfies a TypeScript type at runtime
 * This is used to ensure mock data and API responses match expected types
 */
export function validateTypeAlignment<T>(
  data: any,
  validator: (data: any) => data is T,
  typeName: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!validator(data)) {
    errors.push(`Data does not match expected type ${typeName}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates that mock data matches TypeScript types at compile time and runtime
 */
export function createTypeSafeValidator<T>(
  validator: (data: any) => data is T,
  typeName: string
) {
  return function (data: T): T {
    const validation = validateTypeAlignment(data, validator, typeName);
    if (!validation.valid) {
      throw new Error(
        `Type validation failed for ${typeName}: ${validation.errors.join(", ")}`
      );
    }
    return data;
  };
}

/**
 * Deep type validation for nested objects
 */
export function validateNestedObject<T>(
  data: any,
  validator: (data: any) => data is T,
  path: string = "root"
): { valid: boolean; errors: string[]; path: string } {
  const errors: string[] = [];

  if (typeof data !== "object" || data === null) {
    errors.push(`${path}: Expected object, got ${typeof data}`);
    return { valid: false, errors, path };
  }

  if (!validator(data)) {
    errors.push(`${path}: Failed type validation`);
  }

  return {
    valid: errors.length === 0,
    errors,
    path,
  };
}

/**
 * Validates array items individually
 */
export function validateArrayItems<T>(
  data: any[],
  validator: (data: any) => data is T,
  typeName: string
): { valid: boolean; errors: string[]; invalidIndices: number[] } {
  const errors: string[] = [];
  const invalidIndices: number[] = [];

  data.forEach((item, index) => {
    if (!validator(item)) {
      errors.push(`Item at index ${index} failed ${typeName} validation`);
      invalidIndices.push(index);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    invalidIndices,
  };
}

/**
 * Validates API response wrapper structure
 */
export function validateApiResponseStructure<T>(
  response: any,
  dataValidator: (data: any) => data is T,
  typeName: string,
  expectArray: boolean = false
): {
  valid: boolean;
  errors: string[];
  structureValid: boolean;
  dataValid: boolean;
} {
  const errors: string[] = [];
  let structureValid = true;
  let dataValid = true;

  // Validate response structure
  if (typeof response !== "object" || response === null) {
    errors.push("Response is not an object");
    structureValid = false;
  } else {
    if (typeof response.success !== "boolean") {
      errors.push("Response.success is not a boolean");
      structureValid = false;
    }

    if (expectArray) {
      if (!Array.isArray(response.data)) {
        errors.push("Response.data is not an array");
        structureValid = false;
      }
    } else {
      if (typeof response.data !== "object" || response.data === null) {
        errors.push("Response.data is not an object");
        structureValid = false;
      }
    }
  }

  // Validate data content if structure is valid
  if (structureValid) {
    if (expectArray) {
      const arrayValidation = validateArrayItems(
        response.data,
        dataValidator,
        typeName
      );
      if (!arrayValidation.valid) {
        errors.push(...arrayValidation.errors);
        dataValid = false;
      }
    } else {
      // Single item expected
      if (!dataValidator(response.data)) {
        errors.push(`Single data item failed ${typeName} validation`);
        dataValid = false;
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    structureValid,
    dataValid,
  };
}

/**
 * Creates a type-safe mock data validator
 */
export function createMockValidator<T>(
  validator: (data: any) => data is T,
  typeName: string
) {
  return function validateMock(mockData: ApiV2Response<T>): boolean {
    const validation = validateApiResponseStructure(
      mockData,
      validator,
      typeName,
      true
    );

    if (!validation.valid) {
      console.error(
        `Mock data validation failed for ${typeName}:`,
        validation.errors
      );
      return false;
    }

    return true;
  };
}

/**
 * Validates optional fields properly handle undefined/null values
 */
export function validateOptionalField<T>(
  value: any,
  validator: (value: T) => boolean,
  fieldName: string,
  allowNull: boolean = false
): { valid: boolean; error?: string } {
  if (value === undefined) {
    return { valid: true };
  }

  if (value === null && allowNull) {
    return { valid: true };
  }

  if (value === null && !allowNull) {
    return { valid: false, error: `${fieldName} cannot be null` };
  }

  if (!validator(value)) {
    return {
      valid: false,
      error: `${fieldName} failed validation: expected type, got ${typeof value}`,
    };
  }

  return { valid: true };
}

/**
 * Type assertion helper that throws on validation failure
 */
export function assertTypeValid<T>(
  data: any,
  validator: (data: any) => data is T,
  typeName: string
): asserts data is T {
  if (!validator(data)) {
    throw new Error(`Type assertion failed: data is not of type ${typeName}`);
  }
}

/**
 * Validates enum values
 */
export function validateEnumValue<T extends string | number>(
  value: any,
  enumObject: Record<string, T>,
  enumName: string
): { valid: boolean; error?: string } {
  const validValues = Object.values(enumObject);
  if (!validValues.includes(value)) {
    return {
      valid: false,
      error: `Invalid ${enumName} value: ${value}. Valid values: ${validValues.join(
        ", "
      )}`,
    };
  }
  return { valid: true };
}