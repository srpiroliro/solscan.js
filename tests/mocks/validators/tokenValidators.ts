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
    typeof data.creator === "string" &&
    typeof data.create_tx === "string" &&
    typeof data.created_time === "number" &&
    typeof data.metadata === "object" &&
    data.metadata !== null &&
    typeof data.metadata.name === "string" &&
    typeof data.metadata.symbol === "string" &&
    typeof data.metadata.description === "string" &&
    (data.mint_authority === null || typeof data.mint_authority === "string") &&
    (data.freeze_authority === null ||
      typeof data.freeze_authority === "string") &&
    typeof data.price === "number" &&
    typeof data.volume_24h === "number" &&
    typeof data.market_cap === "number" &&
    typeof data.market_cap_rank === "number" &&
    typeof data.price_change_24h === "number"
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
    typeof data.address === "string" &&
    typeof data.amount === "number" &&
    typeof data.decimals === "number" &&
    typeof data.owner === "string" &&
    typeof data.rank === "number"
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
