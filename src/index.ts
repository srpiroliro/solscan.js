import { APIV2 } from "./apiV2";
import { AccountAPI } from "./apiV2/account";
import { TokenAPI } from "./apiV2/tokenApi";
import { NFTAPI } from "./apiV2/nftApi";
import { TransactionAPI } from "./apiV2/transactionApi";
import { BlockAPI } from "./apiV2/blockApi";
import { MonitoringAPI } from "./apiV2/monitoringApi";
import { makeGetRequest } from "./utils";

/**
 * PublicAPI functionality integrated into main SolscanAPI class
 */
class PublicAPIIntegration {
  private url: string;
  private headers: Record<string, string>;

  /**
   * Creates a new instance of PublicAPI integration
   * @param apiKey API key for authentication
   */
  constructor(apiKey: string) {
    this.url = "https://public-api.solscan.io/";
    this.headers = { token: apiKey };
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

/**
 * Main class for Solscan API client
 */
export class SolscanAPI {
  private _apiKey: string;

  private _publicApi?: PublicAPIIntegration;

  private _account?: AccountAPI;
  private _token?: TokenAPI;
  private _nft?: NFTAPI;
  private _transaction?: TransactionAPI;
  private _block?: BlockAPI;
  private _monitoring?: MonitoringAPI;

  /**
   * Creates a new instance of SolscanAPI
   * @param apiKey API key for authentication
   */
  constructor(apiKey?: string) {
    this._apiKey = apiKey || process.env.SOLSCAN_API_KEY || "";
  }

  /**
   * Get public API endpoints
   */
  get public(): PublicAPIIntegration {
    if (!this._publicApi) {
      this._publicApi = new PublicAPIIntegration(this._apiKey);
    }
    return this._publicApi;
  }

  /**
   * Get account-related API endpoints (direct access)
   */
  get account(): AccountAPI {
    if (!this._account) {
      this._account = new AccountAPI(this._apiKey);
    }
    return this._account;
  }

  /**
   * Get token-related API endpoints (direct access)
   */
  get token(): TokenAPI {
    if (!this._token) {
      this._token = new TokenAPI(this._apiKey);
    }
    return this._token;
  }

  /**
   * Get NFT-related API endpoints (direct access)
   */
  get nft(): NFTAPI {
    if (!this._nft) {
      this._nft = new NFTAPI(this._apiKey);
    }
    return this._nft;
  }

  /**
   * Get transaction-related API endpoints (direct access)
   */
  get transaction(): TransactionAPI {
    if (!this._transaction) {
      this._transaction = new TransactionAPI(this._apiKey);
    }
    return this._transaction;
  }

  /**
   * Get block-related API endpoints (direct access)
   */
  get block(): BlockAPI {
    if (!this._block) {
      this._block = new BlockAPI(this._apiKey);
    }
    return this._block;
  }

  /**
   * Get monitoring-related API endpoints (direct access)
   */
  get monitoring(): MonitoringAPI {
    if (!this._monitoring) {
      this._monitoring = new MonitoringAPI(this._apiKey);
    }
    return this._monitoring;
  }
}
