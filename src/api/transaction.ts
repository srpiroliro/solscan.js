import { makeGetRequest, appendQueryParam } from '../utils';
import { BaseApiV2 } from "./base";

/**
 * TransactionAPI class for transaction-related endpoints
 */
export class TransactionAPI extends BaseApiV2 {
  /**
   * Creates a new instance of TransactionAPI
   * @param apiKey API key for authentication
   */
  constructor(apiKey: string) {
    super(apiKey);
    this.urlModule = `${this.url}transaction/`;
  }

  /**
   * Get the list of the latest transactions
   * @param options Optional parameters
   * @returns Promise with the latest transactions
   */
  public async last(
    options?: {
      limit?: number;
      filter?: string;
    }
  ): Promise<any> {
    let methodUrl = `${this.urlModule}last?filter=${options?.filter || 'exceptVote'}`;

    if (options?.limit) {
      methodUrl = appendQueryParam(methodUrl, 'limit', options.limit);
    }

    return makeGetRequest(methodUrl, this.headers);
  }

  /**
   * Get the detail of a transaction
   * @param tx Transaction signature (required)
   * @returns Promise with transaction details
   */
  public async detail(tx: string): Promise<any> {
    const methodUrl = `${this.urlModule}detail?tx=${tx}`;
    return makeGetRequest(methodUrl, this.headers);
  }

  /**
   * Get the actions of a transaction
   * @param tx Transaction signature (required)
   * @returns Promise with transaction actions
   */
  public async actions(tx: string): Promise<any> {
    const methodUrl = `${this.urlModule}actions?tx=${tx}`;
    return makeGetRequest(methodUrl, this.headers);
  }
} 