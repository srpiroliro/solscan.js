import { AccountAPI } from "../src/apiV2/accountApi";
import { makeGetRequest } from "../src/utils";
import {
  mockAccountDetail,
  mockAccountTransfer,
  mockAccountDefiActivity,
  mockAccountBalanceChange,
  mockAccountTransaction,
  mockAccountPortfolio,
  mockAccountTokenAccount,
  mockAccountMetadata,
  mockAccountLeaderboard,
  mockAccountStake,
  TEST_ACCOUNT_ADDRESS,
  TEST_API_KEY,
} from "./mocks/apiMocks";
import {
  validateApiV2Response,
  validateSingleResponse,
  validateArrayResponse,
} from "./mocks/validators/baseValidators";
import {
  validateAccountDetail,
  validateAccountTransfer,
  validateAccountDefiActivity,
  validateAccountBalanceChange,
  validateAccountTransaction,
  validateAccountPortfolio,
  validateAccountTokenAccount,
  validateAccountMetadata,
  validateAccountStake,
} from "./mocks/validators/accountValidators";

// Mock the utils module
jest.mock("../src/utils", () => ({
  makeGetRequest: jest.fn(),
  appendArrayParams: jest.requireActual("../src/utils").appendArrayParams,
  appendQueryParam: jest.requireActual("../src/utils").appendQueryParam,
}));

const mockMakeGetRequest = makeGetRequest as jest.MockedFunction<
  typeof makeGetRequest
>;

describe("AccountAPI", () => {
  let accountApi: AccountAPI;

  beforeEach(() => {
    accountApi = new AccountAPI(TEST_API_KEY);
    mockMakeGetRequest.mockClear();
  });

  describe("constructor", () => {
    it("should initialize with correct base URL and headers", () => {
      expect(accountApi).toBeInstanceOf(AccountAPI);
      expect((accountApi as any).url).toBe("https://pro-api.solscan.io/v2.0/");
      expect((accountApi as any).headers).toEqual({ token: TEST_API_KEY });
      expect((accountApi as any).urlModule).toBe(
        "https://pro-api.solscan.io/v2.0/account/"
      );
    });
  });

  describe("detail", () => {
    it("should fetch account details successfully", async () => {
      mockMakeGetRequest.mockResolvedValue(mockAccountDetail);

      const result = await accountApi.detail(TEST_ACCOUNT_ADDRESS);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/account/detail?address=${TEST_ACCOUNT_ADDRESS}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockAccountDetail);
    });

    it("should handle account not found", async () => {
      const notFoundResponse = {
        success: false,
        data: [],
        errors: [{ code: 404, message: "Account not found" }],
      };
      mockMakeGetRequest.mockResolvedValue(notFoundResponse);

      const result = await accountApi.detail("invalid_address");

      expect(result).toEqual(notFoundResponse);
    });
  });

  describe("defiActivities", () => {
    it("should fetch defi activities successfully", async () => {
      mockMakeGetRequest.mockResolvedValue(mockAccountDefiActivity);

      const result = await accountApi.defiActivities(TEST_ACCOUNT_ADDRESS);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/account/defi/activities?address=${TEST_ACCOUNT_ADDRESS}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockAccountDefiActivity);
    });

    it("should handle defi activities options", async () => {
      const options = {
        activityType: ["ACTIVITY_TOKEN_SWAP" as any],
        from: "from_address_123",
        platform: ["raydium", "orca"],
        source: ["source1"],
        token: "token_address_123",
        blockTime: [1640995200, 1640995300],
        page: 1,
        pageSize: 20 as const,
        sortBy: "block_time" as const,
        sortOrder: "desc" as const,
      };
      mockMakeGetRequest.mockResolvedValue(mockAccountDefiActivity);

      await accountApi.defiActivities(TEST_ACCOUNT_ADDRESS, options);

      const expectedUrl = expect.stringContaining("page=1");
      expect(mockMakeGetRequest).toHaveBeenCalledWith(expectedUrl, {
        token: TEST_API_KEY,
      });
    });
  });

  describe("transfer", () => {
    it("should fetch transfer data successfully", async () => {
      mockMakeGetRequest.mockResolvedValue(mockAccountTransfer);

      const result = await accountApi.transfer(TEST_ACCOUNT_ADDRESS);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/account/transfer?address=${TEST_ACCOUNT_ADDRESS}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockAccountTransfer);
    });

    it("should handle transfer options", async () => {
      const options = {
        activityType: ["ACTIVITY_SPL_TRANSFER" as any],
        tokenAccount: "token_account_123",
        from: "from_address_123",
        to: "to_address_123",
        token: "token_address_123",
        amount: [1000, 2000],
        excludeAmountZero: true,
        flow: "in" as const,
        blockTime: [1640995200, 1640995300],
        page: 1,
        pageSize: 30 as const,
        sortBy: "block_time" as const,
        sortOrder: "asc" as const,
      };
      mockMakeGetRequest.mockResolvedValue(mockAccountTransfer);

      await accountApi.transfer(TEST_ACCOUNT_ADDRESS, options);

      const expectedUrl = expect.stringContaining("exclude_amount_zero=true");
      expect(mockMakeGetRequest).toHaveBeenCalledWith(expectedUrl, {
        token: TEST_API_KEY,
      });
    });
  });

  describe("tokenAccounts", () => {
    it("should fetch token accounts successfully", async () => {
      mockMakeGetRequest.mockResolvedValue(mockAccountTokenAccount);

      const result = await accountApi.tokenAccounts(
        TEST_ACCOUNT_ADDRESS,
        "token"
      );

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/account/token-accounts?address=${TEST_ACCOUNT_ADDRESS}&type=token`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockAccountTokenAccount);
    });

    it("should handle NFT token accounts", async () => {
      mockMakeGetRequest.mockResolvedValue(mockAccountTokenAccount);

      await accountApi.tokenAccounts(TEST_ACCOUNT_ADDRESS, "nft");

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        expect.stringContaining("type=nft"),
        { token: TEST_API_KEY }
      );
    });

    it("should handle token accounts options", async () => {
      const options = {
        hideZero: true,
        page: 2,
        pageSize: 20 as const,
      };
      mockMakeGetRequest.mockResolvedValue(mockAccountTokenAccount);

      await accountApi.tokenAccounts(TEST_ACCOUNT_ADDRESS, "token", options);

      const expectedUrl = expect.stringContaining("hide_zero=true");
      expect(mockMakeGetRequest).toHaveBeenCalledWith(expectedUrl, {
        token: TEST_API_KEY,
      });
    });
  });

  describe("balanceChangeActivities", () => {
    it("should fetch balance change activities successfully", async () => {
      mockMakeGetRequest.mockResolvedValue(mockAccountBalanceChange);

      const result = await accountApi.balanceChangeActivities(
        TEST_ACCOUNT_ADDRESS
      );

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/account/balance_change?address=${TEST_ACCOUNT_ADDRESS}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockAccountBalanceChange);
    });

    it("should handle balance change activities options", async () => {
      const options = {
        token: "token_address_123",
        removeSpam: true,
        amount: [1000, 2000],
        flow: "in",
        blockTime: [1640995200, 1640995300],
        page: 1,
        pageSize: 40 as const,
        sortBy: "block_time" as const,
        sortOrder: "desc" as const,
      };
      mockMakeGetRequest.mockResolvedValue(mockAccountBalanceChange);

      await accountApi.balanceChangeActivities(TEST_ACCOUNT_ADDRESS, options);

      const expectedUrl = expect.stringContaining("remove_spam=true");
      expect(mockMakeGetRequest).toHaveBeenCalledWith(expectedUrl, {
        token: TEST_API_KEY,
      });
    });
  });

  describe("transactions", () => {
    it("should fetch transactions successfully", async () => {
      mockMakeGetRequest.mockResolvedValue(mockAccountTransaction);

      const result = await accountApi.transactions(TEST_ACCOUNT_ADDRESS);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/account/transactions?address=${TEST_ACCOUNT_ADDRESS}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockAccountTransaction);
    });

    it("should handle transactions options", async () => {
      const options = {
        before: "before_signature_123",
        limit: 20 as const,
      };
      mockMakeGetRequest.mockResolvedValue(mockAccountTransaction);

      await accountApi.transactions(TEST_ACCOUNT_ADDRESS, options);

      const expectedUrl = expect.stringContaining(
        "before=before_signature_123"
      );
      expect(mockMakeGetRequest).toHaveBeenCalledWith(expectedUrl, {
        token: TEST_API_KEY,
      });
    });
  });

  describe("stake", () => {
    it("should fetch stake accounts successfully", async () => {
      mockMakeGetRequest.mockResolvedValue(mockAccountStake);

      const result = await accountApi.stake(TEST_ACCOUNT_ADDRESS);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/account/stake?address=${TEST_ACCOUNT_ADDRESS}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockAccountStake);
    });

    it("should handle stake options", async () => {
      const options = {
        page: 2,
        pageSize: 50,
      };
      mockMakeGetRequest.mockResolvedValue(mockAccountStake);

      await accountApi.stake(TEST_ACCOUNT_ADDRESS, options);

      const expectedUrl = expect.stringContaining("page=2");
      expect(mockMakeGetRequest).toHaveBeenCalledWith(expectedUrl, {
        token: TEST_API_KEY,
      });
    });
  });

  describe("rewardsExport", () => {
    it("should export rewards successfully", async () => {
      const mockRewardsExport = { success: true, data: [] };
      mockMakeGetRequest.mockResolvedValue(mockRewardsExport);

      const timeFrom = 1640995200;
      const timeTo = 1641081600;
      const result = await accountApi.rewardsExport(
        TEST_ACCOUNT_ADDRESS,
        timeFrom,
        timeTo
      );

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/account/reward/export?address=${TEST_ACCOUNT_ADDRESS}&time_from=${timeFrom}&time_to=${timeTo}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockRewardsExport);
    });
  });

  describe("transferExport", () => {
    it("should export transfers successfully", async () => {
      const mockTransferExport = { success: true, data: [] };
      mockMakeGetRequest.mockResolvedValue(mockTransferExport);

      const result = await accountApi.transferExport(TEST_ACCOUNT_ADDRESS);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/account/transfer/export?address=${TEST_ACCOUNT_ADDRESS}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockTransferExport);
    });

    it("should handle transfer export options", async () => {
      const options = {
        activityType: ["transfer", "mint"],
        tokenAccount: "token_account_123",
        from: "from_address_123",
        to: "to_address_123",
        token: "token_address_123",
        amount: [1000, 2000],
        excludeAmountZero: true,
        flow: "out",
        blockTime: [1640995200, 1640995300],
      };
      const mockTransferExport = { success: true, data: [] };
      mockMakeGetRequest.mockResolvedValue(mockTransferExport);

      await accountApi.transferExport(TEST_ACCOUNT_ADDRESS, options);

      const expectedUrl = expect.stringContaining("exclude_amount_zero=true");
      expect(mockMakeGetRequest).toHaveBeenCalledWith(expectedUrl, {
        token: TEST_API_KEY,
      });
    });
  });

  describe("portfolio", () => {
    it("should fetch portfolio successfully", async () => {
      mockMakeGetRequest.mockResolvedValue(mockAccountPortfolio);

      const result = await accountApi.portfolio(TEST_ACCOUNT_ADDRESS);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/account/portfolio?address=${TEST_ACCOUNT_ADDRESS}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockAccountPortfolio);
    });
  });

  describe("metadata", () => {
    it("should fetch metadata successfully", async () => {
      mockMakeGetRequest.mockResolvedValue(mockAccountMetadata);

      const result = await accountApi.metadata(TEST_ACCOUNT_ADDRESS);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/account/metadata?address=${TEST_ACCOUNT_ADDRESS}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockAccountMetadata);
    });
  });

  describe("leaderboard", () => {
    it("should fetch leaderboard successfully", async () => {
      mockMakeGetRequest.mockResolvedValue(mockAccountLeaderboard);

      const options = {
        sortBy: "total_values" as const,
        sortOrder: "desc" as const,
        page: 1,
        pageSize: 20 as const,
      };

      const result = await accountApi.leaderboard(options);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        expect.stringContaining("sort_by=total_values"),
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockAccountLeaderboard);
    });

    it("should handle minimal leaderboard options", async () => {
      mockMakeGetRequest.mockResolvedValue(mockAccountLeaderboard);

      const options = {};

      await accountApi.leaderboard(options);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        "https://pro-api.solscan.io/v2.0/account/leaderboard",
        { token: TEST_API_KEY }
      );
    });
  });

  describe("error handling", () => {
    it("should handle network errors", async () => {
      const networkError = new Error("Network connection failed");
      mockMakeGetRequest.mockRejectedValue(networkError);

      await expect(accountApi.detail(TEST_ACCOUNT_ADDRESS)).rejects.toThrow(
        "Network connection failed"
      );
    });

    it("should handle API rate limiting", async () => {
      const rateLimitResponse = {
        success: false,
        data: [],
        errors: [{ code: 429, message: "Too many requests" }],
      };
      mockMakeGetRequest.mockResolvedValue(rateLimitResponse);

      const result = await accountApi.detail(TEST_ACCOUNT_ADDRESS);

      expect(result).toEqual(rateLimitResponse);
    });
  });

  describe("authentication", () => {
    it("should include API key in headers for all requests", async () => {
      mockMakeGetRequest.mockResolvedValue({ success: true, data: [] });

      await accountApi.detail(TEST_ACCOUNT_ADDRESS);
      await accountApi.defiActivities(TEST_ACCOUNT_ADDRESS);
      await accountApi.transfer(TEST_ACCOUNT_ADDRESS);
      await accountApi.portfolio(TEST_ACCOUNT_ADDRESS);
      await accountApi.leaderboard({});

      expect(mockMakeGetRequest).toHaveBeenCalledTimes(5);
      mockMakeGetRequest.mock.calls.forEach((call) => {
        expect(call[1]).toEqual({ token: TEST_API_KEY });
      });
    });
  });

  describe("response validation", () => {
    it("should validate account detail response structure", async () => {
      mockMakeGetRequest.mockResolvedValue(mockAccountDetail);

      const result = await accountApi.detail(TEST_ACCOUNT_ADDRESS);

      expect(validateApiV2Response(result)).toBe(true);
      expect(validateSingleResponse(result, validateAccountDetail)).toBe(true);

      // Validate specific fields exist and have correct types
      expect(result.data[0]).toHaveProperty("account");
      expect(result.data[0]).toHaveProperty("lamports");
      expect(result.data[0]).toHaveProperty("executable");
      expect(typeof (result.data[0] as any).lamports).toBe("number");
      expect(typeof (result.data[0] as any).executable).toBe("boolean");
    });

    it("should validate account transfer response structure", async () => {
      mockMakeGetRequest.mockResolvedValue(mockAccountTransfer);

      const result = await accountApi.transfer(TEST_ACCOUNT_ADDRESS);

      expect(validateApiV2Response(result)).toBe(true);
      expect(validateArrayResponse(result, validateAccountTransfer)).toBe(true);

      // Validate specific fields
      if (result.data.length > 0) {
        expect(result.data[0]).toHaveProperty("block_id");
        expect(result.data[0]).toHaveProperty("trans_id");
        expect(result.data[0]).toHaveProperty("amount");
        expect(typeof (result.data[0] as any).amount).toBe("number");
      }
    });

    it("should validate account defi activity response structure", async () => {
      mockMakeGetRequest.mockResolvedValue(mockAccountDefiActivity);

      const result = await accountApi.defiActivities(TEST_ACCOUNT_ADDRESS);

      expect(validateApiV2Response(result)).toBe(true);
      expect(validateArrayResponse(result, validateAccountDefiActivity)).toBe(
        true
      );

      // Validate specific fields
      if (result.data.length > 0) {
        expect(result.data[0]).toHaveProperty("block_id");
        expect(result.data[0]).toHaveProperty("activity_type");
        expect(result.data[0]).toHaveProperty("sources");
        expect(typeof (result.data[0] as any).block_id).toBe("number");
      }
    });

    it("should validate account balance change response structure", async () => {
      mockMakeGetRequest.mockResolvedValue(mockAccountBalanceChange);

      const result = await accountApi.balanceChangeActivities(
        TEST_ACCOUNT_ADDRESS
      );

      expect(validateApiV2Response(result)).toBe(true);
      expect(validateArrayResponse(result, validateAccountBalanceChange)).toBe(
        true
      );

      // Validate specific fields
      if (result.data.length > 0) {
        expect(result.data[0]).toHaveProperty("pre_balance");
        expect(result.data[0]).toHaveProperty("post_balance");
        expect(result.data[0]).toHaveProperty("change_type");
        expect(typeof (result.data[0] as any).pre_balance).toBe("number");
        expect(["inc", "dec"]).toContain((result.data[0] as any).change_type);
      }
    });

    it("should validate account portfolio response structure", async () => {
      mockMakeGetRequest.mockResolvedValue(mockAccountPortfolio);

      const result = await accountApi.portfolio(TEST_ACCOUNT_ADDRESS);

      expect(validateApiV2Response(result)).toBe(true);
      expect(validateSingleResponse(result, validateAccountPortfolio)).toBe(
        true
      );

      // Validate specific fields
      expect(result.data[0]).toHaveProperty("total_value");
      expect(result.data[0]).toHaveProperty("native_token");
      expect(result.data[0]).toHaveProperty("tokens");
      expect(typeof (result.data[0] as any).total_value).toBe("number");
      expect(Array.isArray((result.data[0] as any).tokens)).toBe(true);
    });

    it("should handle malformed account responses gracefully", async () => {
      const malformedResponse = {
        success: true,
        data: "not an array", // This should be an array
      };
      mockMakeGetRequest.mockResolvedValue(malformedResponse);

      const result = await accountApi.detail(TEST_ACCOUNT_ADDRESS);

      expect(validateApiV2Response(result)).toBe(false);
      expect(validateSingleResponse(result, validateAccountDetail)).toBe(false);
    });

    it("should handle responses with missing required fields", async () => {
      const incompleteResponse = {
        success: true,
        data: [
          {
            account: TEST_ACCOUNT_ADDRESS,
            // Missing required fields like 'lamports', 'type', etc.
          },
        ],
      };
      mockMakeGetRequest.mockResolvedValue(incompleteResponse);

      const result = await accountApi.detail(TEST_ACCOUNT_ADDRESS);

      expect(validateApiV2Response(result)).toBe(true);
      expect(validateSingleResponse(result, validateAccountDetail)).toBe(false);
    });

    it("should handle responses with incorrect field types", async () => {
      const wrongTypeResponse = {
        success: true,
        data: [
          {
            account: TEST_ACCOUNT_ADDRESS,
            lamports: "2000000000", // Should be number, not string
            type: "account",
            executable: "false", // Should be boolean, not string
            owner_program: "11111111111111111111111111111111",
            rent_epoch: 361,
            is_oncurve: 1,
          },
        ],
      };
      mockMakeGetRequest.mockResolvedValue(wrongTypeResponse);

      const result = await accountApi.detail(TEST_ACCOUNT_ADDRESS);

      expect(validateApiV2Response(result)).toBe(true);
      expect(validateSingleResponse(result, validateAccountDetail)).toBe(false);
    });

    // Additional comprehensive validator tests
    it("should validate AccountTransfer with all required fields", async () => {
      const validTransfer = {
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
      };

      expect(validateAccountTransfer(validTransfer)).toBe(true);

      // Test with missing from_token_account
      const invalidTransfer = { ...validTransfer };
      delete (invalidTransfer as any).from_token_account;
      expect(validateAccountTransfer(invalidTransfer)).toBe(false);

      // Test with missing to_token_account
      const invalidTransfer2 = { ...validTransfer };
      delete (invalidTransfer2 as any).to_token_account;
      expect(validateAccountTransfer(invalidTransfer2)).toBe(false);

      // Test with missing token_decimals
      const invalidTransfer3 = { ...validTransfer };
      delete (invalidTransfer3 as any).token_decimals;
      expect(validateAccountTransfer(invalidTransfer3)).toBe(false);
    });

    it("should validate AccountBalanceChange with all required fields", async () => {
      const validBalanceChange = {
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
      };

      expect(validateAccountBalanceChange(validBalanceChange)).toBe(true);

      // Test with missing token_decimals
      const invalidBalanceChange = { ...validBalanceChange };
      delete (invalidBalanceChange as any).token_decimals;
      expect(validateAccountBalanceChange(invalidBalanceChange)).toBe(false);

      // Test with missing token_account
      const invalidBalanceChange2 = { ...validBalanceChange };
      delete (invalidBalanceChange2 as any).token_account;
      expect(validateAccountBalanceChange(invalidBalanceChange2)).toBe(false);

      // Test with invalid change_type
      const invalidBalanceChange3 = {
        ...validBalanceChange,
        change_type: "invalid",
      };
      expect(validateAccountBalanceChange(invalidBalanceChange3)).toBe(false);
    });

    it("should validate AccountDefiActivity with complex nested structure", async () => {
      const validDefiActivity = {
        block_id: 12345678,
        trans_id: "abcdef1234567890",
        block_time: 1640995200,
        time: "2022-01-01T00:00:00.000Z",
        activity_type: "swap",
        from_address: "HYe4vSaEGqQKnDrxWDrk3o5H2gznv7qtij5G6NNG8WHd",
        to_address: "22222222222222222222222222222222",
        sources: {
          platform: "raydium",
          routers: [
            {
              token1: "So11111111111111111111111111111111111111112",
              token1_decimals: 9,
              amount1: "1000000000",
              token2: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
              token2_decimals: 6,
              amount2: "100000000",
            },
          ],
          child_routers: [],
        },
      };

      expect(validateAccountDefiActivity(validDefiActivity)).toBe(true);

      // Test with invalid router structure
      const invalidDefiActivity = {
        ...validDefiActivity,
        sources: {
          ...validDefiActivity.sources,
          routers: [
            {
              token1: "So11111111111111111111111111111111111111112",
              // Missing token1_decimals
              amount1: "1000000000",
              token2: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
              token2_decimals: 6,
              amount2: "100000000",
            },
          ],
        },
      };

      expect(validateAccountDefiActivity(invalidDefiActivity)).toBe(false);
    });

    it("should validate AccountPortfolio with Token structure", async () => {
      const validPortfolio = {
        total_value: 1500.5,
        native_token: {
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
      };

      expect(validateAccountPortfolio(validPortfolio)).toBe(true);

      // Test with invalid token structure (missing required field)
      const invalidPortfolio = {
        ...validPortfolio,
        tokens: [
          {
            token_address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            amount: 1000000000,
            balance: 1000.0,
            token_price: 1.0,
            // Missing token_decimals
            token_name: "USD Coin",
            token_symbol: "USDC",
            token_icon: "https://example.com/usdc-icon.png",
            value: 1000.0,
          },
        ],
      };

      expect(validateAccountPortfolio(invalidPortfolio)).toBe(false);
    });

    it("should validate AccountStake with all required fields", async () => {
      const validStake = {
        stake_account: "stake_account_123456789",
        validator: "validator_123456789",
        amount: 32000000000,
        status: "active",
        activation_epoch: 350,
        deactivation_epoch: null,
      };

      expect(validateAccountStake(validStake)).toBe(true);

      // Test with deactivation_epoch as number
      const validStakeWithDeactivation = {
        ...validStake,
        deactivation_epoch: 400,
      };
      expect(validateAccountStake(validStakeWithDeactivation)).toBe(true);

      // Test with missing required field
      const invalidStake = { ...validStake };
      delete (invalidStake as any).validator;
      expect(validateAccountStake(invalidStake)).toBe(false);

      // Test with wrong type for deactivation_epoch
      const invalidStake2 = {
        ...validStake,
        deactivation_epoch: "invalid",
      };
      expect(validateAccountStake(invalidStake2)).toBe(false);
    });
  });
});
