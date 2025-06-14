import { AccountAPI } from "./account";
import { TokenAPI } from "./tokenApi";
import { NFTAPI } from "./nftApi";
import { TransactionAPI } from "./transactionApi";
import { BlockAPI } from "./blockApi";
import { MonitoringAPI } from "./monitoringApi";

/**
 * Main API V2 client
 */
export class APIV2 {
  private _apiKey: string;
  private _account?: AccountAPI;
  private _token?: TokenAPI;
  private _nft?: NFTAPI;
  private _transaction?: TransactionAPI;
  private _block?: BlockAPI;
  private _monitoring?: MonitoringAPI;

  /**
   * Creates a new instance of APIV2
   * @param apiKey API key for authentication
   */
  constructor(apiKey: string) {
    this._apiKey = apiKey;
  }

  /**
   * Get account-related API endpoints
   */
  get account(): AccountAPI {
    if (!this._account) {
      this._account = new AccountAPI(this._apiKey);
    }
    return this._account;
  }

  /**
   * Get token-related API endpoints
   */
  get token(): TokenAPI {
    if (!this._token) {
      this._token = new TokenAPI(this._apiKey);
    }
    return this._token;
  }

  /**
   * Get NFT-related API endpoints
   */
  get nft(): NFTAPI {
    if (!this._nft) {
      this._nft = new NFTAPI(this._apiKey);
    }
    return this._nft;
  }

  /**
   * Get transaction-related API endpoints
   */
  get transaction(): TransactionAPI {
    if (!this._transaction) {
      this._transaction = new TransactionAPI(this._apiKey);
    }
    return this._transaction;
  }

  /**
   * Get block-related API endpoints
   */
  get block(): BlockAPI {
    if (!this._block) {
      this._block = new BlockAPI(this._apiKey);
    }
    return this._block;
  }

  /**
   * Get monitoring-related API endpoints
   */
  get monitoring(): MonitoringAPI {
    if (!this._monitoring) {
      this._monitoring = new MonitoringAPI(this._apiKey);
    }
    return this._monitoring;
  }
}
