import { PublicAPI } from './publicApi';
import { APIV2 } from './apiV2';

/**
 * Main class for Solscan API client
 */
export class SolscanAPI {
  private _apiKey: string;
  private _publicApi?: PublicAPI;
  private _apiV2?: APIV2;

  /**
   * Creates a new instance of SolscanAPI
   * @param apiKey API key for authentication
   */
  constructor(apiKey: string) {
    this._apiKey = apiKey;
  }

  /**
   * Get public API endpoints
   */
  get publicApi(): PublicAPI {
    if (!this._publicApi) {
      this._publicApi = new PublicAPI(this._apiKey);
    }
    return this._publicApi;
  }

  /**
   * Get API V2 endpoints
   */
  get apiV2(): APIV2 {
    if (!this._apiV2) {
      this._apiV2 = new APIV2(this._apiKey);
    }
    return this._apiV2;
  }
}

export { PublicAPI, APIV2 };
