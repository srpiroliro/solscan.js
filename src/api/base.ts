/**
 * Base class for API V2 endpoints
 */
export class BaseApiV2 {
  protected url: string;
  protected headers: Record<string, string>;
  protected urlModule: string;

  /**
   * Creates a new instance of BaseApiV2
   * @param apiKey API key for authentication
   */
  constructor(apiKey: string) {
    this.url = "https://pro-api.solscan.io/v2.0/";
    this.headers = { token: apiKey };
    this.urlModule = "";
  }
}
