import { makeGetRequest, appendQueryParam } from '../utils';
import { BaseApiV2 } from './baseApiV2';

/**
 * BlockAPI class for block-related endpoints
 */
export class BlockAPI extends BaseApiV2 {
  /**
   * Creates a new instance of BlockAPI
   * @param apiKey API key for authentication
   */
  constructor(apiKey: string) {
    super(apiKey);
    this.urlModule = `${this.url}block/`;
  }

  /**
   * Get the list of the latest blocks
   * @param limit Number of blocks to return (default: 100)
   * @returns Promise with the latest blocks
   */
  public async last(limit: number = 100): Promise<any> {
    const methodUrl = `${this.urlModule}last?limit=${limit}`;
    return makeGetRequest(methodUrl, this.headers);
  }

  /**
   * Get the list of transactions of a block
   * @param block Block slot index (required)
   * @param options Optional parameters
   * @returns Promise with block transactions
   */
  public async transactions(
    block: number,
    options?: {
      page?: number;
      pageSize?: number;
    }
  ): Promise<any> {
    let methodUrl = `${this.urlModule}transactions?block=${block}`;

    if (options) {
      const { page, pageSize } = options;

      if (typeof page === 'number') {
        methodUrl = appendQueryParam(methodUrl, 'page', page);
      }

      if (typeof pageSize === 'number') {
        methodUrl = appendQueryParam(methodUrl, 'page_size', pageSize);
      }
    }

    return makeGetRequest(methodUrl, this.headers);
  }

  /**
   * Get the details of a block
   * @param block Block slot index (required)
   * @returns Promise with block details
   */
  public async detail(block: number): Promise<any> {
    const methodUrl = `${this.urlModule}detail?block=${block}`;
    return makeGetRequest(methodUrl, this.headers);
  }
} 