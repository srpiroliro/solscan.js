import {
  TokenMeta,
  TokenMarket,
  TokenTransfer,
  TokenHolders,
  TokenList,
} from "../../../src/types/token";

// Token validators
export function validateTokenMeta(data: any): data is TokenMeta {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.address === "string" &&
    typeof data.symbol === "string" &&
    typeof data.name === "string" &&
    typeof data.decimals === "number" &&
    typeof data.supply === "string" &&
    typeof data.icon === "string" &&
    typeof data.holder === "number" &&
    // Optional fields
    (data.creator === undefined || typeof data.creator === "string") &&
    (data.create_tx === undefined || typeof data.create_tx === "string") &&
    (data.created_time === undefined || typeof data.created_time === "number") &&
    (data.first_mint_tx === undefined || typeof data.first_mint_tx === "string") &&
    (data.first_mint_time === undefined || typeof data.first_mint_time === "number") &&
    (data.metadata === null || 
      (typeof data.metadata === "object" &&
        data.metadata !== null &&
        typeof data.metadata.name === "string" &&
        typeof data.metadata.symbol === "string" &&
        typeof data.metadata.description === "string" &&
        (data.metadata.twitter === undefined || typeof data.metadata.twitter === "string") &&
        (data.metadata.website === undefined || typeof data.metadata.website === "string") &&
        typeof data.metadata.image === "string")) &&
    (data.metadata_uri === undefined || typeof data.metadata_uri === "string") &&
    (data.mint_authority === null || typeof data.mint_authority === "string") &&
    (data.freeze_authority === null || typeof data.freeze_authority === "string") &&
    typeof data.price === "number" &&
    (data.volume_24h === undefined || typeof data.volume_24h === "number") &&
    typeof data.market_cap === "number" &&
    (data.market_cap_rank === null || typeof data.market_cap_rank === "number") &&
    (data.price_change_24h === undefined || typeof data.price_change_24h === "number") &&
    (data.total_dex_vol_24h === undefined || typeof data.total_dex_vol_24h === "number") &&
    (data.dex_vol_change_24h === undefined || typeof data.dex_vol_change_24h === "number")
  );
}

export function validateTokenMarket(data: any): data is TokenMarket {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.pool_id === "string" &&
    typeof data.program_id === "string" &&
    typeof data.token_1 === "string" &&
    typeof data.token_2 === "string" &&
    typeof data.token_account_1 === "string" &&
    typeof data.token_account_2 === "string" &&
    typeof data.total_trades_24h === "number" &&
    typeof data.total_trades_prev_24h === "number" &&
    typeof data.total_volume_24h === "number" &&
    typeof data.total_volume_prev_24h === "number"
  );
}

export function validateTokenTransfer(data: any): data is TokenTransfer {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.block_id === "string" &&
    typeof data.trans_id === "string" &&
    typeof data.block_time === "number" &&
    typeof data.time === "string" &&
    typeof data.activity_type === "string" &&
    typeof data.from_address === "string" &&
    typeof data.to_address === "string" &&
    typeof data.token_address === "string" &&
    typeof data.token_decimals === "number" &&
    typeof data.amount === "number"
  );
}

export function validateTokenHolders(data: any): data is TokenHolders {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.total === "number" &&
    Array.isArray(data.items) &&
    data.items.every(
      (item: any) =>
        typeof item === "object" &&
        item !== null &&
        typeof item.address === "string" &&
        typeof item.amount === "number" &&
        typeof item.decimals === "number" &&
        typeof item.owner === "string" &&
        typeof item.rank === "number"
    )
  );
}

export function validateTokenList(data: any): data is TokenList {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.address === "string" &&
    typeof data.symbol === "string" &&
    typeof data.name === "string" &&
    typeof data.price === "number" &&
    typeof data.volume_24h === "number" &&
    typeof data.market_cap === "number" &&
    typeof data.price_change_24h === "number"
  );
}
