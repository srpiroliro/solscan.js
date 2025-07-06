import { ApiV2Response } from "../../src/types/general";
import {
  TokenMeta,
  TokenMarket,
  TokenTransfer,
  TokenHolders,
  TokenList,
} from "../../src/types/token";
import {
  AccountDetail,
  AccountTransfer,
  AccountDefiActivity,
  AccountBalanceChange,
  AccountTransaction,
  AccountPortfolio,
  AccountTokenAccount,
  AccountMetadata,
  AccountLeaderboard,
} from "../../src/types/account";

// Mock API responses
export const mockTokenMeta: ApiV2Response<TokenMeta> = {
  success: true,
  data: {
    address: "So11111111111111111111111111111111111111112",
    name: "Wrapped SOL",
    symbol: "SOL",
    icon: "https://example.com/sol-icon.png",
    decimals: 9,
    holder: 1000000,
    creator: "11111111111111111111111111111111",
    create_tx: "abcdef1234567890",
    created_time: 1640995200,
    metadata: {
      name: "Wrapped SOL",
      image: "https://example.com/sol-icon.png",
      symbol: "SOL",
      description: "Wrapped Solana token",
      website: "https://solana.com",
      twitter: "https://twitter.com/solana",
    },
    mint_authority: null,
    freeze_authority: null,
    supply: "1000000000000000000",
    price: 100.5,
    volume_24h: 1000000,
    market_cap: 50000000000,
    market_cap_rank: 5,
    price_change_24h: 2.5,
  },
};

export const mockTokenMetaMulti: ApiV2Response<TokenMeta[]> = {
  success: true,
  data: [
    {
      address: "So11111111111111111111111111111111111111112",
      name: "Wrapped SOL",
      symbol: "SOL",
      icon: "https://example.com/sol-icon.png",
      decimals: 9,
      holder: 1000000,
      creator: "11111111111111111111111111111111",
      create_tx: "abcdef1234567890",
      created_time: 1640995200,
      metadata: {
        name: "Wrapped SOL",
        image: "https://example.com/sol-icon.png",
        symbol: "SOL",
        description: "Wrapped Solana token",
        website: "https://solana.com",
        twitter: "https://twitter.com/solana",
      },
      mint_authority: null,
      freeze_authority: null,
      supply: "1000000000000000000",
      price: 100.5,
      volume_24h: 1000000,
      market_cap: 50000000000,
      market_cap_rank: 5,
      price_change_24h: 2.5,
    },
    {
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      name: "USD Coin",
      symbol: "USDC",
      icon: "https://example.com/usdc-icon.png",
      decimals: 6,
      holder: 500000,
      creator: "11111111111111111111111111111111",
      create_tx: "fedcba0987654321",
      created_time: 1640995300,
      metadata: {
        name: "USD Coin",
        image: "https://example.com/usdc-icon.png",
        symbol: "USDC",
        description: "USD Coin stablecoin",
        website: "https://centre.io",
        twitter: "https://twitter.com/centre_io",
      },
      mint_authority: null,
      freeze_authority: null,
      supply: "500000000000000",
      price: 1.0,
      volume_24h: 500000,
      market_cap: 30000000000,
      market_cap_rank: 3,
      price_change_24h: 0.1,
    },
  ],
};

export const mockTokenMarket: ApiV2Response<TokenMarket[]> = {
  success: true,
  data: [
    {
      pool_id: "pool123456789",
      program_id: "program123456789",
      token_1: "So11111111111111111111111111111111111111112",
      token_2: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      token_account_1: "account123456789",
      token_account_2: "account987654321",
      total_trades_24h: 1000,
      total_trades_prev_24h: 950,
      total_volume_24h: 1000000,
      total_volume_prev_24h: 950000,
    },
  ],
};

export const mockTokenMarketInfo: ApiV2Response<TokenMarket> = {
  success: true,
  data: {
    pool_id: "pool123456789",
    program_id: "program123456789",
    token_1: "So11111111111111111111111111111111111111112",
    token_2: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    token_account_1: "account123456789",
    token_account_2: "account987654321",
    total_trades_24h: 1000,
    total_trades_prev_24h: 950,
    total_volume_24h: 1000000,
    total_volume_prev_24h: 950000,
  },
};

export const mockTokenTransfer: ApiV2Response<TokenTransfer[]> = {
  success: true,
  data: [
    {
      block_id: "12345678",
      trans_id: "abcdef1234567890",
      block_time: 1640995200,
      time: "2022-01-01T00:00:00.000Z",
      activity_type: "transfer",
      from_address: "11111111111111111111111111111111",
      to_address: "22222222222222222222222222222222",
      token_address: "So11111111111111111111111111111111111111112",
      token_decimals: 9,
      amount: 1000000000,
    },
  ],
};

export const mockTokenHolders = {
  success: true,
  data: {
    total: 1000000,
    items: [
      {
        address: "11111111111111111111111111111111",
        amount: 1000000000,
        decimals: 9,
        owner: "11111111111111111111111111111111",
        rank: 1,
      },
    ],
  },
};

export const mockTokenList = {
  success: true,
  data: [
    {
      address: "So11111111111111111111111111111111111111112",
      decimals: 9,
      name: "Wrapped SOL",
      symbol: "SOL",
      market_cap: 50000000000,
      price: 100.5,
      price_24h_change: 2.5,
      holder: 1000000,
      created_time: 1640995200,
    },
  ],
};

export const mockTransactionDetail = {
  success: true,
  data: {
    blockTime: 1640995200,
    slot: 12345678,
    txHash: "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    fee: 5000,
    status: "Success",
    lamport: 1000000000,
    signer: ["11111111111111111111111111111111"],
    logMessage: [],
    inputAccount: [
      {
        account: "11111111111111111111111111111111",
        signer: true,
        writable: true,
        preBalance: 2000000000,
        postBalance: 1000000000,
      },
    ],
    recentBlockhash: "blockhash123456789",
    parsedInstruction: [],
  },
};

export const mockTransactionActions = {
  success: true,
  data: [
    {
      type: "transfer",
      info: {
        source: "11111111111111111111111111111111",
        destination: "22222222222222222222222222222222",
        amount: 1000000000,
        authority: "11111111111111111111111111111111",
      },
    },
  ],
};

export const mockLastTransactions = {
  success: true,
  data: [
    {
      blockTime: 1640995200,
      slot: 12345678,
      txHash:
        "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      fee: 5000,
      status: "Success",
      lamport: 1000000000,
      signer: ["11111111111111111111111111111111"],
    },
  ],
};

// Account Mock Data
export const mockAccountDetail = {
  success: true,
  data: {
    account: "HYe4vSaEGqQKnDrxWDrk3o5H2gznv7qtij5G6NNG8WHd",
    lamports: 2000000000,
    type: "account",
    executable: false,
    owner_program: "11111111111111111111111111111111",
    rent_epoch: 361,
    is_oncurve: 1,
  },
};

export const mockAccountTransfer = {
  success: true,
  data: [
    {
      block_id: 12345678,
      trans_id: "abcdef1234567890",
      block_time: 1640995200,
      time: "2022-01-01T00:00:00.000Z",
      activity_type: "transfer",
      from_address: "HYe4vSaEGqQKnDrxWDrk3o5H2gznv7qtij5G6NNG8WHd",
      from_token_account: "from_token_account_123",
      to_address: "22222222222222222222222222222222",
      to_token_account: "to_token_account_456",
      token_address: "So11111111111111111111111111111111111111112",
      token_decimals: 9,
      amount: 1000000000,
      flow: "out",
    },
  ],
};

export const mockAccountDefiActivity = {
  success: true,
  data: [
    {
      block_id: 12345678,
      trans_id: "abcdef1234567890",
      block_time: 1640995200,
      time: "2022-01-01T00:00:00.000Z",
      activity_type: "swap",
      from_address: "HYe4vSaEGqQKnDrxWDrk3o5H2gznv7qtij5G6NNG8WHd",
      sources: ["raydium"],
      platform: ["raydium"],
      value: 1000.5,
      routers: {
        token1: "So11111111111111111111111111111111111111112",
        token1_decimals: 9,
        amount1: 1000000000,
        token2: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        token2_decimals: 6,
        amount2: 100000000,
        child_routers: [
          {
            token1: "So11111111111111111111111111111111111111112",
            token1_decimals: 9,
            amount1: "1000000000",
            token2: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            token2_decimals: 6,
            amount2: "100000000",
            program_address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
            pool_address: "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"
          }
        ]
      },
    },
  ],
};

export const mockAccountBalanceChange = {
  success: true,
  data: [
    {
      block_id: 12345678,
      block_time: 1640995200,
      time: "2022-01-01T00:00:00.000Z",
      trans_id: "abcdef1234567890",
      address: "HYe4vSaEGqQKnDrxWDrk3o5H2gznv7qtij5G6NNG8WHd",
      token_address: "So11111111111111111111111111111111111111112",
      token_decimals: 9,
      token_account: "token_account_123",
      amount: 1000000000,
      pre_balance: 2000000000,
      post_balance: 1000000000,
      change_type: "dec" as const,
      fee: 5000,
    },
  ],
};

export const mockAccountTransaction = {
  success: true,
  data: [
    {
      slot: 12345678,
      fee: 5000,
      status: "Success" as const,
      signer: "HYe4vSaEGqQKnDrxWDrk3o5H2gznv7qtij5G6NNG8WHd",
      block_time: 1640995200,
      tx_hash:
        "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      parsed_instructions: [
        {
          type: "transfer",
          program: "system",
          program_id: "11111111111111111111111111111111",
        },
      ],
      program_ids: "11111111111111111111111111111111",
      time: "2022-01-01T00:00:00.000Z",
    },
  ],
};

export const mockAccountPortfolio = {
  success: true,
  data: {
    total_value: 1500.5,
    native_balance: {
      amount: 2000000000,
      balance: 2.0,
      token_price: 100.5,
      token_decimals: 9,
      token_name: "Solana",
      token_symbol: "SOL",
      token_icon: "https://example.com/sol-icon.png",
      value: 201.0,
    },
    tokens: [
      {
        token_address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        amount: 1000000000,
        balance: 1000.0,
        token_price: 1.0,
        token_decimals: 6,
        token_name: "USD Coin",
        token_symbol: "USDC",
        token_icon: "https://example.com/usdc-icon.png",
        value: 1000.0,
      },
    ],
  },
};

export const mockAccountTokenAccount = {
  success: true,
  data: [
    {
      token_account: "token_account_123456789",
      token_address: "So11111111111111111111111111111111111111112",
      amount: 1000000000,
      token_decimals: 9,
      owner: "HYe4vSaEGqQKnDrxWDrk3o5H2gznv7qtij5G6NNG8WHd",
    },
  ],
};

export const mockAccountMetadata = {
  success: true,
  data: {
    account_address: "HYe4vSaEGqQKnDrxWDrk3o5H2gznv7qtij5G6NNG8WHd",
    account_label: "Test Account",
    account_icon: "https://example.com/account-icon.png",
    account_tags: ["verified", "exchange"],
    account_type: "wallet",
  },
};

export const mockAccountLeaderboard = {
  success: true,
  data: {
    total: 1000,
    data: [
      {
        account: "HYe4vSaEGqQKnDrxWDrk3o5H2gznv7qtij5G6NNG8WHd",
        sol_values: 1000.0,
        token_values: 5000.0,
        stake_values: 2000.0,
        total_values: 8000.0,
      },
    ],
  },
};

export const mockAccountStake = {
  success: true,
  data: [
    {
      stake_account: "stake_account_123456789",
      validator: "validator_123456789",
      amount: 32000000000,
      status: "active",
      activation_epoch: 350,
      deactivation_epoch: null,
    },
  ],
};

// Test constants
export const TEST_TOKEN_ADDRESS = "So11111111111111111111111111111111111111112";
export const TEST_TRANSACTION_SIGNATURE =
  "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";
export const TEST_ACCOUNT_ADDRESS =
  "HYe4vSaEGqQKnDrxWDrk3o5H2gznv7qtij5G6NNG8WHd";
export const TEST_API_KEY = "test-api-key-12345";