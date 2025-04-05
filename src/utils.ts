import axios, { AxiosRequestConfig } from 'axios';

/**
 * Make a GET request to the API
 * @param url The URL to request
 * @param headers Headers to include in the request
 * @returns Promise with the response data
 */
export async function makeGetRequest(url: string, headers: Record<string, string>): Promise<any> {
  try {
    const config: AxiosRequestConfig = {
      headers
    };
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API request failed: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Build query parameters for arrays
 * @param baseUrl Base URL
 * @param param Parameter name
 * @param values Array of values
 * @returns URL with query parameters
 */
export function appendArrayParams(baseUrl: string, param: string, values: (string | number)[]): string {
  let url = baseUrl;
  
  values.forEach((value, index) => {
    const separator = index === 0 && !url.includes('?') ? '?' : '&';
    url += `${separator}${param}[]=${encodeURIComponent(String(value))}`;
  });
  
  return url;
}

/**
 * Append a query parameter to a URL
 * @param url The base URL
 * @param name Parameter name
 * @param value Parameter value
 * @returns URL with the added parameter
 */
export function appendQueryParam(url: string, name: string, value: string | number | boolean): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${name}=${encodeURIComponent(String(value))}`;
} 