import { ApiV2Response } from "../../../src/types/general";

// Generic response validator
export function validateApiV2Response<T>(
  response: any
): response is ApiV2Response<T> {
  return (
    typeof response === "object" &&
    response !== null &&
    typeof response.success === "boolean" &&
    Array.isArray(response.data)
  );
}

// Helper function to validate array responses
export function validateArrayResponse<T>(
  response: any,
  itemValidator: (item: any) => item is T
): response is ApiV2Response<T[]> {
  if (!validateApiV2Response(response)) {
    return false;
  }

  if (!Array.isArray(response.data)) {
    return false;
  }

  return response.data.every(itemValidator);
}

// Helper function to validate single item responses
export function validateSingleResponse<T>(
  response: any,
  itemValidator: (item: any) => item is T
): response is ApiV2Response<T[]> {
  if (!validateApiV2Response(response)) {
    return false;
  }

  if (!Array.isArray(response.data) || response.data.length === 0) {
    return false;
  }

  return itemValidator(response.data[0]);
}
