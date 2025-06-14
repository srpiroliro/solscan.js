import { AccountAPI } from "./api/account";
import { TokenAPI } from "./api/token";
import { NFTAPI } from "./api/nft";
import { TransactionAPI } from "./api/transaction";
import { BlockAPI } from "./api/block";
import { MonitoringAPI } from "./api/monitoring";
import { makeGetRequest } from "./utils";
import { PublicAPI } from "./api/public";

/**
 * Main class for Solscan API client
 */
export class SolscanAPI {
  private _apiKey: string;

  private _publicApi?: PublicAPI;

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
  get public(): PublicAPI {
    if (!this._publicApi) {
      this._publicApi = new PublicAPI(this._apiKey);
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
