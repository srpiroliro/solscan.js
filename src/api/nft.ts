import { makeGetRequest, appendArrayParams, appendQueryParam } from '../utils';
import { BaseApiV2 } from "./base";

/**
 * NFTAPI class for NFT-related endpoints
 */
export class NFTAPI extends BaseApiV2 {
  /**
   * Creates a new instance of NFTAPI
   * @param apiKey API key for authentication
   */
  constructor(apiKey: string) {
    super(apiKey);
    this.urlModule = `${this.url}nft/`;
  }

  /**
   * Get NFT news
   * @param options Optional parameters
   * @returns Promise with NFT news
   */
  public async news(
    options?: {
      filter?: string;
      page?: number;
      pageSize?: number;
    }
  ): Promise<any> {
    let methodUrl = `${this.urlModule}news?filter=${options?.filter || 'created_time'}`;

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
   * Get NFT activities
   * @param options Optional parameters
   * @returns Promise with NFT activities
   */
  public async activities(
    options?: {
      activityType?: string[];
      from?: string;
      to?: string;
      currencyToken?: string;
      collection?: string;
      price?: number[];
      source?: string[];
      token?: string;
      blockTime?: number[];
      page?: number;
      pageSize?: number;
    }
  ): Promise<any> {
    let methodUrl = `${this.urlModule}activities?page=${options?.page || 1}`;

    if (options) {
      const { 
        activityType, from, to, currencyToken, collection,
        price, source, token, blockTime, pageSize 
      } = options;

      if (activityType && Array.isArray(activityType)) {
        methodUrl = appendArrayParams(methodUrl, 'activity_type', activityType);
      }

      if (from) {
        methodUrl = appendQueryParam(methodUrl, 'from', from);
      }

      if (to) {
        methodUrl = appendQueryParam(methodUrl, 'to', to);
      }

      if (currencyToken) {
        methodUrl = appendQueryParam(methodUrl, 'currency_token', currencyToken);
      }

      if (collection) {
        methodUrl = appendQueryParam(methodUrl, 'collection', collection);
      }

      // Price requires currency_token
      if (price && Array.isArray(price) && currencyToken) {
        methodUrl = appendArrayParams(methodUrl, 'price', price);
      }

      if (source && Array.isArray(source)) {
        methodUrl = appendArrayParams(methodUrl, 'source', source);
      }

      if (token) {
        methodUrl = appendQueryParam(methodUrl, 'token', token);
      }

      if (blockTime && Array.isArray(blockTime)) {
        methodUrl = appendArrayParams(methodUrl, 'block_time', blockTime);
      }

      if (typeof pageSize === 'number') {
        methodUrl = appendQueryParam(methodUrl, 'page_size', pageSize);
      }
    }

    return makeGetRequest(methodUrl, this.headers);
  }

  /**
   * Get the list of NFT collections
   * @param options Optional parameters
   * @returns Promise with NFT collections
   */
  public async collectionLists(
    options?: {
      range?: number;
      collection?: string;
      page?: number;
      pageSize?: number;
      sortBy?: string;
      sortOrder?: string;
    }
  ): Promise<any> {
    let methodUrl = `${this.urlModule}collection/lists?range=${options?.range || 1}`;

    if (options) {
      const { collection, page, pageSize, sortBy, sortOrder } = options;

      if (collection) {
        methodUrl = appendQueryParam(methodUrl, 'collection', collection);
      }

      if (typeof page === 'number') {
        methodUrl = appendQueryParam(methodUrl, 'page', page);
      }

      if (typeof pageSize === 'number') {
        methodUrl = appendQueryParam(methodUrl, 'page_size', pageSize);
      }

      if (sortBy) {
        methodUrl = appendQueryParam(methodUrl, 'sort_by', sortBy);
      }

      if (sortOrder) {
        methodUrl = appendQueryParam(methodUrl, 'sort_order', sortOrder);
      }
    }

    return makeGetRequest(methodUrl, this.headers);
  }

  /**
   * Get the list of items of a NFT collection
   * @param collection Collection ID (required)
   * @param options Optional parameters
   * @returns Promise with collection items
   */
  public async collectionItems(
    collection: string,
    options?: {
      page?: number;
      pageSize?: number;
      sortBy?: string;
    }
  ): Promise<any> {
    let methodUrl = `${this.urlModule}collection/items?collection=${collection}`;

    if (options) {
      const { page, pageSize, sortBy } = options;

      if (typeof page === 'number') {
        methodUrl = appendQueryParam(methodUrl, 'page', page);
      }

      if (typeof pageSize === 'number') {
        methodUrl = appendQueryParam(methodUrl, 'page_size', pageSize);
      }

      if (sortBy) {
        methodUrl = appendQueryParam(methodUrl, 'sort_by', sortBy);
      }
    }

    return makeGetRequest(methodUrl, this.headers);
  }
} 