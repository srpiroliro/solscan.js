import { makeGetRequest, appendArrayParams, appendQueryParam } from "../utils";
import { BaseApiV2 } from "./base";
import { ApiV2Response, SortByOrder } from "../types/general";
import {
  TokenMeta,
  TokenMarket,
  TokenTransfer,
  TokenDefiActivities,
  TokenPrice,
  TokenPriceMulti,
  TokenHolders,
  TokenListItem,
  TokenTop,
  TokenList,
} from "../types/token";

/**
 * TokenAPI class for token-related endpoints
 */
export class TokenAPI extends BaseApiV2 {
  /**
   * Creates a new instance of TokenAPI
   * @param apiKey API key for authentication
   */
  constructor(apiKey: string) {
    super(apiKey);
    this.urlModule = `${this.url}token/`;
  }

  /**
   * Get the metadata of a token
   * @param address Address of a token (required)
   * @returns Promise with token metadata
   */
  public async meta(address: string): Promise<ApiV2Response<TokenMeta>> {
    const methodUrl = `${this.urlModule}meta?address=${address}`;
    return makeGetRequest(methodUrl, this.headers);
  }

  /**
   * Get the metadata of a token
   * @param address Address of a token (required)
   * @returns Promise with token metadata
   */
  public async metaMulti(
    addresses: string[],
  ): Promise<ApiV2Response<TokenMeta[]>> {
    let methodUrl = `${this.urlModule}meta/multi`;

    if (!addresses?.length) throw new Error("Addresses are required");

    methodUrl += `?address[]=${addresses[0]}`;
    for (let i = 1; i < addresses.length; i++) {
      methodUrl += `&address[]=${addresses[i]}`;
    }

    return makeGetRequest(methodUrl, this.headers);
  }

  /**
   * Get token markets
   * @param token Token pair addresses
   * @param options Optional parameters
   * @returns Promise with token markets
   */
  public async markets(
    token: string[],
    options?: {
      sortBy?: string;
      program?: string[];
      page?: number;
      pageSize?: number;
    },
  ): Promise<ApiV2Response<TokenMarket[]>> {
    if (!token || !token.length) {
      throw new Error("Token pair addresses are required");
    }

    let methodUrl = `${this.urlModule}markets?token[]=${token[0]}`;

    // Add remaining tokens
    for (let i = 1; i < token.length; i++) {
      methodUrl = appendQueryParam(methodUrl, "token[]", token[i]);
    }

    if (options) {
      const { sortBy, program, page, pageSize } = options;

      if (sortBy) {
        methodUrl = appendQueryParam(methodUrl, "sort_by", sortBy);
      }

      if (program && Array.isArray(program)) {
        methodUrl = appendArrayParams(methodUrl, "program", program);
      }

      if (typeof page === "number") {
        methodUrl = appendQueryParam(methodUrl, "page", page);
      }

      if (typeof pageSize === "number") {
        methodUrl = appendQueryParam(methodUrl, "page_size", pageSize);
      }
    }

    return makeGetRequest(methodUrl, this.headers);
  }

  /**
   * Get token market info
   * @param address Address of a token (required)
   * @returns Promise with token market info
   */
  public async marketInfo(
    address: string,
  ): Promise<ApiV2Response<TokenMarket>> {
    const methodUrl = `${this.urlModule}market/info?address=${address}`;
    return makeGetRequest(methodUrl, this.headers);
  }

  /**
   * Get transfer data of a token
   * @param address Address of a token (required)
   * @param options Optional parameters
   * @returns Promise with token transfer data
   */
  public async transfer(
    address: string,
    options?: {
      activityType?: string[];
      tokenAccount?: string;
      from?: string;
      to?: string;
      token?: string;
      amount?: number[];
      excludeAmountZero?: boolean;
      flow?: string;
      blockTime?: number[];
      sortBy?: string;
      sortOrder?: string;
    },
  ): Promise<ApiV2Response<TokenTransfer>> {
    let methodUrl = `${this.urlModule}transfer?address=${address}`;

    if (options) {
      const {
        activityType,
        tokenAccount,
        from,
        to,
        token,
        amount,
        excludeAmountZero,
        flow,
        blockTime,
        sortBy,
        sortOrder,
      } = options;

      if (activityType && Array.isArray(activityType)) {
        methodUrl = appendArrayParams(methodUrl, "activity_type", activityType);
      }

      if (tokenAccount) {
        methodUrl = appendQueryParam(methodUrl, "token_account", tokenAccount);
      }

      if (from) {
        methodUrl = appendQueryParam(methodUrl, "from", from);
      }

      if (to) {
        methodUrl = appendQueryParam(methodUrl, "to", to);
      }

      if (token) {
        methodUrl = appendQueryParam(methodUrl, "token", token);
      }

      if (amount && Array.isArray(amount)) {
        methodUrl = appendArrayParams(methodUrl, "amount", amount);
      }

      if (typeof excludeAmountZero === "boolean") {
        methodUrl = appendQueryParam(
          methodUrl,
          "exclude_amount_zero",
          excludeAmountZero,
        );
      }

      if (flow) {
        methodUrl = appendQueryParam(methodUrl, "flow", flow);
      }

      if (blockTime && Array.isArray(blockTime)) {
        methodUrl = appendArrayParams(methodUrl, "block_time", blockTime);
      }

      if (sortBy) {
        methodUrl = appendQueryParam(methodUrl, "sort_by", sortBy);
      }

      if (sortOrder) {
        methodUrl = appendQueryParam(methodUrl, "sort_order", sortOrder);
      }
    }

    return makeGetRequest(methodUrl, this.headers);
  }

  /**
   * Get defi activities involving a token
   * @param address Address of a token (required)
   * @param options Optional parameters
   * @returns Promise with token defi activities
   */
  public async defiActivities(
    address: string,
    options?: {
      activityType?: string[];
      from?: string;
      platform?: string[];
      source?: string[];
      token?: string;
      blockTime?: number[];
      page?: number;
      pageSize?: 10 | 20 | 30 | 40 | 60 | 100;
      sortBy?: "block_time";
      sortOrder?: SortByOrder;
    },
  ): Promise<ApiV2Response<TokenDefiActivities[]>> {
    let methodUrl = `${this.urlModule}defi/activities?address=${address}`;

    if (options) {
      const {
        activityType,
        from,
        platform,
        source,
        token,
        blockTime,
        page,
        pageSize,
        sortBy,
        sortOrder,
      } = options;

      if (activityType && Array.isArray(activityType)) {
        methodUrl = appendArrayParams(methodUrl, "activity_type", activityType);
      }

      if (from) {
        methodUrl = appendQueryParam(methodUrl, "from", from);
      }

      if (platform && Array.isArray(platform)) {
        methodUrl = appendArrayParams(methodUrl, "platform", platform);
      }

      if (source && Array.isArray(source)) {
        methodUrl = appendArrayParams(methodUrl, "source", source);
      }

      if (token) {
        methodUrl = appendQueryParam(methodUrl, "token", token);
      }

      if (blockTime && Array.isArray(blockTime)) {
        methodUrl = appendArrayParams(methodUrl, "block_time", blockTime);
      }

      if (typeof page === "number") {
        methodUrl = appendQueryParam(methodUrl, "page", page);
      }

      if (typeof pageSize === "number") {
        methodUrl = appendQueryParam(methodUrl, "page_size", pageSize);
      }

      if (sortBy) {
        methodUrl = appendQueryParam(methodUrl, "sort_by", sortBy);
      }

      if (sortOrder) {
        methodUrl = appendQueryParam(methodUrl, "sort_order", sortOrder);
      }
    }

    return makeGetRequest(methodUrl, this.headers);
  }

  /**
   * Get the list of tokens
   * @param options Optional parameters
   * @returns Promise with token list
   */
  public async list(options?: {
    page?: number;
    pageSize?: 10 | 20 | 30 | 40 | 60 | 100;
    sortBy?: "holder" | "market_cap" | "created_time";
    sortOrder?: SortByOrder;
  }): Promise<ApiV2Response<TokenList>> {
    let methodUrl = `${this.urlModule}list?page=${options?.page || 1}`;

    if (options) {
      const { pageSize, sortBy, sortOrder } = options;

      if (typeof pageSize === "number") {
        methodUrl = appendQueryParam(methodUrl, "page_size", pageSize);
      }

      if (sortBy) {
        methodUrl = appendQueryParam(methodUrl, "sort_by", sortBy);
      }

      if (sortOrder) {
        methodUrl = appendQueryParam(methodUrl, "sort_order", sortOrder);
      }
    }

    return makeGetRequest(methodUrl, this.headers);
  }

  /**
   * Get token market volume
   * @param address Address of a token (required)
   * @param options Optional parameters
   * @returns Promise with token market volume
   */
  public async marketVolume(
    address: string,
    options?: {
      time?: number[];
    },
  ): Promise<ApiV2Response<TokenPrice>> {
    let methodUrl = `${this.urlModule}market/volume?address=${address}`;

    if (options?.time && Array.isArray(options.time)) {
      methodUrl = appendArrayParams(methodUrl, "time", options.time);
    }

    return makeGetRequest(methodUrl, this.headers);
  }

  /**
   * Get the list of trending tokens
   * @param limit Number of items to return (default: 10)
   * @returns Promise with trending tokens
   */
  public async trending(limit: number = 10): Promise<ApiV2Response<TokenList>> {
    const methodUrl = `${this.urlModule}trending?limit=${limit}`;
    return makeGetRequest(methodUrl, this.headers);
  }

  /**
   * Get price of a token
   * @param address Address of a token (required)
   * @param options Optional parameters
   * @returns Promise with token price
   */
  public async tokenPrice(
    address: string,
    options?: {
      time?: number[];
    },
  ): Promise<ApiV2Response<TokenPrice>> {
    let methodUrl = `${this.urlModule}price?address=${address}`;

    if (options?.time && Array.isArray(options.time)) {
      methodUrl = appendArrayParams(methodUrl, "time", options.time);
    }

    return makeGetRequest(methodUrl, this.headers);
  }

  /**
   * Get token holders
   * @param address Address of a token (required)
   * @param options Optional parameters
   * @returns Promise with token holders
   */
  public async holders(
    address: string,
    options?: {
      page?: number;
      pageSize?: 10 | 20 | 30 | 40;
      fromAmount?: number;
      toAmount?: number;
    },
  ): Promise<ApiV2Response<TokenHolders>> {
    let methodUrl = `${this.urlModule}holders?address=${address}&page=${
      options?.page || 1
    }`;

    if (options) {
      const { pageSize, fromAmount, toAmount } = options;

      if (typeof pageSize === "number") {
        methodUrl = appendQueryParam(methodUrl, "page_size", pageSize);
      }

      if (typeof fromAmount === "number") {
        methodUrl = appendQueryParam(methodUrl, "from_amount", fromAmount);
      }

      if (typeof toAmount === "number") {
        methodUrl = appendQueryParam(methodUrl, "to_amount", toAmount);
      }
    }

    return makeGetRequest(methodUrl, this.headers);
  }

  /**
   * Get the list of top tokens
   * @returns Promise with top tokens
   */
  public async top(): Promise<ApiV2Response<TokenTop>> {
    const methodUrl = `${this.urlModule}top`;
    return makeGetRequest(methodUrl, this.headers);
  }
}
