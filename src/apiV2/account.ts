import {
  AccountBalanceChange,
  AccountDefiActivity,
  AccountDefiActivityType,
  AccountDetail,
  AccountLeaderboard,
  AccountMetadata,
  AccountPortfolio,
  AccountTokenAccount,
  AccountTransaction,
  AccountTransfer,
  AccountType,
  Flow,
} from "../types/account";
import { ApiV2Response, SortByOrder } from "../types/general";
import { makeGetRequest, appendArrayParams, appendQueryParam } from "../utils";
import { BaseApiV2 } from "./baseApiV2";

/**
 * AccountAPI class for account-related endpoints
 */
export class AccountAPI extends BaseApiV2 {
  /**
   * Creates a new instance of AccountAPI
   * @param apiKey API key for authentication
   */
  constructor(apiKey: string) {
    super(apiKey);
    this.urlModule = `${this.url}account/`;
  }

  /**
   * Get defi activities involving an account
   * @param address Address of an account (required)
   * @param options Optional parameters
   * @returns Promise with defi activities
   */
  public async defiActivities(
    address: string,
    options?: {
      activityType?: AccountDefiActivityType[];
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
  ): Promise<ApiV2Response<AccountDefiActivity[]>> {
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
   * Get transfer data of an account
   * @param address Address of an account (required)
   * @param options Optional parameters
   * @returns Promise with transfer data
   */
  public async transfer(
    address: string,
    options?: {
      activityType?: AccountType[];
      tokenAccount?: string;
      from?: string;
      to?: string;
      token?: string;
      amount?: number[];
      excludeAmountZero?: boolean;
      flow?: Flow;
      blockTime?: number[];
      page?: number;
      pageSize?: 10 | 20 | 30 | 40 | 60 | 100;
      sortBy?: "block_time";
      sortOrder?: SortByOrder;
    },
  ): Promise<ApiV2Response<AccountTransfer[]>> {
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
        page,
        pageSize,
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
   * Get token accounts of an account
   * @param address Address of an account (required)
   * @param type Type of token (token, nft)
   * @param options Optional parameters
   * @returns Promise with token accounts
   */
  public async tokenAccounts(
    address: string,
    type: "token" | "nft",
    options?: {
      hideZero?: boolean;
      page?: number;
      pageSize?: 10 | 20 | 30 | 40;
    },
  ): Promise<ApiV2Response<AccountTokenAccount[]>> {
    let methodUrl = `${this.urlModule}token-accounts?address=${address}&type=${type}`;

    if (options) {
      const { hideZero, page, pageSize } = options;

      if (typeof hideZero === "boolean") {
        methodUrl = appendQueryParam(methodUrl, "hide_zero", hideZero);
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
   * Get balance change activities involving an account
   * @param address Address of an account (required)
   * @param options Optional parameters
   * @returns Promise with balance change activities
   */
  public async balanceChangeActivities(
    address: string,
    options?: {
      token?: string;
      removeSpam?: boolean;
      amount?: number[];
      flow?: string;
      blockTime?: number[];
      page?: number;
      pageSize?: 10 | 20 | 30 | 40 | 60 | 100;
      sortBy?: "block_time";
      sortOrder?: SortByOrder;
    },
  ): Promise<ApiV2Response<AccountBalanceChange[]>> {
    let methodUrl = `${this.urlModule}balance_change?address=${address}`;

    if (options) {
      const {
        token,
        removeSpam,
        amount,
        flow,
        blockTime,
        page,
        pageSize,
        sortBy,
        sortOrder,
      } = options;

      if (token) {
        methodUrl = appendQueryParam(methodUrl, "token", token);
      }

      if (amount && Array.isArray(amount)) {
        methodUrl = appendArrayParams(methodUrl, "amount", amount);
      }

      if (flow) {
        methodUrl = appendQueryParam(methodUrl, "flow", flow);
      }

      if (typeof removeSpam === "boolean") {
        methodUrl = appendQueryParam(methodUrl, "remove_spam", removeSpam);
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
   * Get the list of transactions of an account
   * @param address Address of an account (required)
   * @param options Optional parameters
   * @returns Promise with transactions
   */
  public async transactions(
    address: string,
    options?: {
      before?: string;
      limit?: 10 | 20 | 30 | 40;
    },
  ): Promise<ApiV2Response<AccountTransaction[]>> {
    let methodUrl = `${this.urlModule}transactions?address=${address}`;

    if (options) {
      const { before, limit } = options;

      if (before) {
        methodUrl = appendQueryParam(methodUrl, "before", before);
      }

      if (typeof limit === "number") {
        methodUrl = appendQueryParam(methodUrl, "limit", limit);
      }
    }

    return makeGetRequest(methodUrl, this.headers);
  }

  /**
   * Get the list of stake accounts of an account
   * @param address Address of an account (required)
   * @param options Optional parameters
   * @returns Promise with stake accounts
   */
  public async stake(
    address: string,
    options?: {
      page?: number;
      pageSize?: number;
    },
  ): Promise<ApiV2Response<any>> {
    let methodUrl = `${this.urlModule}stake?address=${address}`;

    if (options) {
      const { page, pageSize } = options;

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
   * Get the details of an account
   * @param address Address of an account (required)
   * @returns Promise with account details
   */
  public async detail(address: string): Promise<ApiV2Response<AccountDetail>> {
    const methodUrl = `${this.urlModule}detail?address=${address}`;
    return makeGetRequest(methodUrl, this.headers);
  }

  /**
   * Export the rewards for an account
   * @param address Address of an account (required)
   * @param timeFrom The start time for the export (Unix time in seconds)
   * @param timeTo The end time for the export (Unix time in seconds)
   * @returns Promise with rewards export
   */
  public async rewardsExport(
    address: string,
    timeFrom: number,
    timeTo: number,
  ): Promise<ApiV2Response<any>> {
    const methodUrl = `${this.urlModule}reward/export?address=${address}&time_from=${timeFrom}&time_to=${timeTo}`;
    return makeGetRequest(methodUrl, this.headers);
  }

  /**
   * Export transfer data of an account
   * @param address Address of an account (required)
   * @param options Optional parameters
   * @returns Promise with transfer export
   */
  public async transferExport(
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
    },
  ): Promise<ApiV2Response<any>> {
    let methodUrl = `${this.urlModule}transfer/export?address=${address}`;

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
    }

    return makeGetRequest(methodUrl, this.headers);
  }

  public async portfolio(
    address: string,
  ): Promise<ApiV2Response<AccountPortfolio>> {
    let methodUrl = `${this.urlModule}portfolio?address=${address}`;

    return makeGetRequest(methodUrl, this.headers);
  }

  public async metadata(
    address: string,
  ): Promise<ApiV2Response<AccountMetadata>> {
    let methodUrl = `${this.urlModule}metadata?address=${address}`;

    return makeGetRequest(methodUrl, this.headers);
  }

  public async leaderboard(options: {
    sortBy?: "sol_values" | "stake_values" | "token_values" | "total_values";
    sortOrder?: SortByOrder;
    page?: number;
    pageSize?: 10 | 20 | 30 | 40 | 60 | 100;
  }): Promise<ApiV2Response<AccountLeaderboard>> {
    let methodUrl = `${this.urlModule}leaderboard`;

    if (options.sortBy) {
      methodUrl = appendQueryParam(methodUrl, "sort_by", options.sortBy);
    }

    if (options.sortOrder) {
      methodUrl = appendQueryParam(methodUrl, "sort_order", options.sortOrder);
    }

    if (options.page) {
      methodUrl = appendQueryParam(methodUrl, "page", options.page);
    }

    if (options.pageSize) {
      methodUrl = appendQueryParam(methodUrl, "page_size", options.pageSize);
    }

    return makeGetRequest(methodUrl, this.headers);
  }
}
