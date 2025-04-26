export type TokenTransfer = {
  block_id: string;
  trans_id: string;
  block_time: number;
  time: string;
  activity_type: string;
  from_address: string;
  to_address: string;
  token_address: string;
  token_decimals: number;
  amount: number;
};

export type ChildRouter = {
  token1: string;
  token1_decimals: number;
  amount1: string;
  token2: string;
  token2_decimals: number;
  amount2: string;
};

export type Routers = {
  token1: string;
  token1_decimals: number;
  amount1: number;
  token2: string;
  token2_decimals: number;
  amount2: number;
  child_routers: ChildRouter[];
};

export type TokenDefiActivities = {
  block_id: number;
  trans_id: string;
  block_time: number;
  activity_type: string;
  from_address: string;
  to_address: string;
  sources: string[];
  platform: string;
  routers: Routers;
};

export type TokenMarket = {
  pool_id: string;
  program_id: string;
  token_1: string;
  token_2: string;
  token_account_1: string;
  token_account_2: string;
  total_trades_24h: number;
  total_trades_prev_24h: number;
  total_volume_24h: number;
  total_volume_prev_24h: number;
};

export type TokenMetadata = {
  name: string;
  image: string;
  symbol: string;
  description: string;
  twitter?: string;
  website?: string;
};

export type TokenMeta = {
  address: string;
  name: string;
  symbol: string;
  icon: string;
  decimals: number;
  holder: number;
  creator: string;
  create_tx: string;
  created_time: number;
  metadata: TokenMetadata;
  mint_authority: string | null;
  freeze_authority: string | null;
  supply: string;
  price: number;
  volume_24h: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_24h: number;
};

export type TokenMetaMulti = TokenMeta;

export type TokenPrice = {
  date: number;
  price: number;
};

export type TokenPriceMulti = {
  token_address: string;
  prices: TokenPrice[];
};

export type TokenHolder = {
  address: string;
  amount: number;
  decimals: number;
  owner: string;
  rank: number;
};

export type TokenHolders = {
  total: number;
  items: TokenHolder[];
};

export type TokenListItem = {
  address: string;
  decimals: number;
  name: string;
  symbol: string;
  market_cap: number;
  price: number;
  price_24h_change: number;
  holder: number; // number of holders
  created_time: number;
};

export type TokenList = TokenListItem[];

export type TokenTop = {
  total: number;
  items: TokenListItem[];
};
