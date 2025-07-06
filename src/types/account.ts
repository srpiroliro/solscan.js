export enum AccountType {
  ACTIVITY_SPL_TRANSFER,
  ACTIVITY_SPL_BURN,
  ACTIVITY_SPL_MINT,
  ACTIVITY_SPL_CREATE_ACCOUNT,
}

export enum AccountDefiActivityType {
  ACTIVITY_TOKEN_SWAP,
  ACTIVITY_AGG_TOKEN_SWAP,
  ACTIVITY_TOKEN_ADD_LIQ,
  ACTIVITY_TOKEN_REMOVE_LIQ,
  ACTIVITY_SPL_TOKEN_STAKE,
  ACTIVITY_SPL_TOKEN_UNSTAKE,
  ACTIVITY_TOKEN_DEPOSIT_VAULT,
  ACTIVITY_TOKEN_WITHDRAW_VAULT,
  ACTIVITY_SPL_INIT_MINT,
  ACTIVITY_ORDERBOOK_ORDER_PLACE,
}

export type Flow = "in" | "out";

/* ----------------------- */

export type AccountDetail = {
  account: string;
  lamports: number;
  type: string;
  executable: boolean;
  owner_program: string;
  rent_epoch: number;
  is_oncurve: number;
};

export type AccountTransfer = {
  block_id: number;
  trans_id: string;
  block_time: number;
  time: string;
  activity_type: string;
  from_address: string;
  from_token_account: string;
  to_address: string;
  to_token_account: string;
  token_address: string;
  token_decimals: number;
  amount: number;
  flow: string;
};

export type AccountDefiActivity = {
  block_id: number;
  trans_id: string;
  block_time: number;
  time: string;
  activity_type: string;
  from_address: string;
  sources: string[];
  platform: string[];
  value: number;
  routers: {
    token1: string;
    token1_decimals: number;
    amount1: number | null;
    token2?: string;
    token2_decimals: number;
    amount2?: number;
    child_routers?: Array<{
      token1: string;
      token1_decimals: number;
      amount1: string;
      token2: string;
      token2_decimals: number;
      amount2: string;
      program_address: string;
      pool_address: string;
    }>;
  };
};

export type AccountBalanceChange = {
  block_id: number;
  block_time: number;
  time: string;
  trans_id: string;
  address: string;
  token_address: string;
  token_decimals: number;
  token_account: string;
  amount: number;
  pre_balance: number;
  post_balance: number;
  change_type: "inc" | "dec";
  fee: number;
};

export type AccountTransaction = {
  slot: number;
  fee: number;
  status: "Success" | "Fail";
  signer: string;
  block_time: number;
  tx_hash: string;
  parsed_instructions: {
    type: string;
    program: string;
    program_id: string;
  }[];
  program_ids: string;
  time: string;
};

type Token = {
  token_address?: string; // undefined on native token

  amount: number; // The token raw amount
  balance: number; // The token balance. Calculated by formula: balance = amount / (10 ^ decimals)
  token_price: number; // The token price in USD
  token_decimals: number; // The token decimal
  token_name: string; // The token name
  token_symbol: string; // The token symbol
  token_icon: string; // The token icon
  value: number; // The token value in USD
};

export type AccountPortfolio = {
  total_value: number; // usd
  native_balance: Token;
  tokens: Token[];
};

export type AccountTokenAccount = {
  token_account: string;
  token_address: string;
  amount: number;
  token_decimals: number;
  owner: string;
};

export type AccountMetadata = {
  account_address: string;
  account_label: string;
  account_icon: string;
  account_tags: string[];
  account_type: string;
};

export type AccountLeaderboard = {
  total: number;
  data: {
    account: string;
    sol_values: number;
    token_values: number;
    stake_values: number;
    total_values: number;
  }[];
};

export type AccountStake = {
  stake_account: string;
  validator: string;
  amount: number;
  status: string;
  activation_epoch: number;
  deactivation_epoch: number | null;
};
