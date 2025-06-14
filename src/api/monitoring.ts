import { makeGetRequest } from '../utils';
import { BaseApiV2 } from "./base";

/**
 * MonitoringAPI class for monitoring-related endpoints
 */
export class MonitoringAPI extends BaseApiV2 {
  /**
   * Creates a new instance of MonitoringAPI
   * @param apiKey API key for authentication
   */
  constructor(apiKey: string) {
    super(apiKey);
    this.urlModule = `${this.url}monitor/`;
  }

  /**
   * Get the used Compute Units of a subscriber
   * @returns Promise with usage information
   */
  public async usage(): Promise<any> {
    const methodUrl = `${this.urlModule}usage`;
    return makeGetRequest(methodUrl, this.headers);
  }
} 