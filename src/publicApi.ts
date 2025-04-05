import { makeGetRequest } from './utils';

/**
 * PublicAPI class for accessing public endpoints of Solscan API
 */
export class PublicAPI {
  private url: string;
  private headers: Record<string, string>;

  /**
   * Creates a new instance of PublicAPI
   * @param apiKey API key for authentication
   */
  constructor(apiKey: string) {
    this.url = 'https://public-api.solscan.io/';
    this.headers = { "token": apiKey };
  }

  /**
   * Get chain information
   * @returns Promise with chain information
   */
  public async chainInfo(): Promise<any> {
    const methodUrl = `${this.url}chaininfo`;
    return makeGetRequest(methodUrl, this.headers);
  }
} 