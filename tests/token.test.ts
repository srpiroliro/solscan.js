import { TokenAPI } from "../src/apiV2/tokenApi";
import { makeGetRequest } from "../src/utils";
import {
  mockTokenMeta,
  mockTokenMarket,
  mockTokenTransfer,
  mockTokenHolders,
  mockTokenList,
  TEST_TOKEN_ADDRESS,
  TEST_API_KEY,
} from "./mocks/apiMocks";
import {
  validateApiV2Response,
  validateSingleResponse,
  validateArrayResponse,
} from "./mocks/validators/baseValidators";
import {
  validateTokenMeta,
  validateTokenMarket,
  validateTokenTransfer,
  validateTokenHolders,
  validateTokenList,
} from "./mocks/validators/tokenValidators";

// Mock the utils module
jest.mock("../src/utils", () => ({
  makeGetRequest: jest.fn(),
  appendArrayParams: jest.requireActual("../src/utils").appendArrayParams,
  appendQueryParam: jest.requireActual("../src/utils").appendQueryParam,
}));

const mockMakeGetRequest = makeGetRequest as jest.MockedFunction<
  typeof makeGetRequest
>;

describe("TokenAPI", () => {
  let tokenApi: TokenAPI;

  beforeEach(() => {
    tokenApi = new TokenAPI(TEST_API_KEY);
    mockMakeGetRequest.mockClear();
  });

  describe("constructor", () => {
    it("should initialize with correct base URL and headers", () => {
      expect(tokenApi).toBeInstanceOf(TokenAPI);
      // Access protected properties for testing
      expect((tokenApi as any).url).toBe("https://pro-api.solscan.io/v2.0/");
      expect((tokenApi as any).headers).toEqual({ token: TEST_API_KEY });
      expect((tokenApi as any).urlModule).toBe(
        "https://pro-api.solscan.io/v2.0/token/"
      );
    });
  });

  describe("meta", () => {
    it("should fetch token metadata successfully", async () => {
      mockMakeGetRequest.mockResolvedValue(mockTokenMeta);

      const result = await tokenApi.meta(TEST_TOKEN_ADDRESS);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/token/meta?address=${TEST_TOKEN_ADDRESS}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockTokenMeta);
    });

    it("should handle API errors", async () => {
      const errorResponse = {
        success: false,
        data: [],
        errors: [{ code: 404, message: "Token not found" }],
      };
      mockMakeGetRequest.mockResolvedValue(errorResponse);

      const result = await tokenApi.meta(TEST_TOKEN_ADDRESS);

      expect(result).toEqual(errorResponse);
    });
  });

  describe("metaMulti", () => {
    it("should fetch multiple token metadata successfully", async () => {
      const addresses = [
        TEST_TOKEN_ADDRESS,
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      ];
      mockMakeGetRequest.mockResolvedValue(mockTokenMeta);

      const result = await tokenApi.metaMulti(addresses);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/token/meta?address=${addresses.join(
          ","
        )}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockTokenMeta);
    });
  });

  describe("markets", () => {
    it("should fetch token markets successfully", async () => {
      const tokens = [TEST_TOKEN_ADDRESS];
      mockMakeGetRequest.mockResolvedValue(mockTokenMarket);

      const result = await tokenApi.markets(tokens);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/token/markets?token[]=${TEST_TOKEN_ADDRESS}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockTokenMarket);
    });

    it("should handle multiple tokens", async () => {
      const tokens = [
        TEST_TOKEN_ADDRESS,
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      ];
      mockMakeGetRequest.mockResolvedValue(mockTokenMarket);

      await tokenApi.markets(tokens);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        expect.stringContaining(`token[]=${tokens[0]}`),
        { token: TEST_API_KEY }
      );
      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        expect.stringContaining(`token[]=${tokens[1]}`),
        { token: TEST_API_KEY }
      );
    });

    it("should handle options parameters", async () => {
      const tokens = [TEST_TOKEN_ADDRESS];
      const options = {
        sortBy: "volume",
        program: ["program1", "program2"],
        page: 1,
        pageSize: 20,
      };
      mockMakeGetRequest.mockResolvedValue(mockTokenMarket);

      await tokenApi.markets(tokens, options);

      const expectedUrl = expect.stringContaining("sort_by=volume");
      expect(mockMakeGetRequest).toHaveBeenCalledWith(expectedUrl, {
        token: TEST_API_KEY,
      });
    });

    it("should throw error when no tokens provided", async () => {
      await expect(tokenApi.markets([])).rejects.toThrow(
        "Token pair addresses are required"
      );
    });
  });

  describe("marketInfo", () => {
    it("should fetch token market info successfully", async () => {
      mockMakeGetRequest.mockResolvedValue(mockTokenMarket);

      const result = await tokenApi.marketInfo(TEST_TOKEN_ADDRESS);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/token/market/info?address=${TEST_TOKEN_ADDRESS}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockTokenMarket);
    });
  });

  describe("transfer", () => {
    it("should fetch token transfers successfully", async () => {
      mockMakeGetRequest.mockResolvedValue(mockTokenTransfer);

      const result = await tokenApi.transfer(TEST_TOKEN_ADDRESS);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/token/transfer?address=${TEST_TOKEN_ADDRESS}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockTokenTransfer);
    });

    it("should handle transfer options", async () => {
      const options = {
        activityType: ["transfer", "mint"],
        tokenAccount: "account123",
        from: "from123",
        to: "to123",
        token: "token123",
        amount: [1000, 2000],
        excludeAmountZero: true,
        flow: "in",
        blockTime: [1640995200, 1640995300],
        sortBy: "block_time",
        sortOrder: "desc",
      };
      mockMakeGetRequest.mockResolvedValue(mockTokenTransfer);

      await tokenApi.transfer(TEST_TOKEN_ADDRESS, options);

      const expectedUrl = expect.stringContaining("exclude_amount_zero=true");
      expect(mockMakeGetRequest).toHaveBeenCalledWith(expectedUrl, {
        token: TEST_API_KEY,
      });
    });
  });

  describe("defiActivities", () => {
    it("should fetch defi activities successfully", async () => {
      const mockDefiActivities = { success: true, data: [] };
      mockMakeGetRequest.mockResolvedValue(mockDefiActivities);

      const result = await tokenApi.defiActivities(TEST_TOKEN_ADDRESS);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/token/defi/activities?address=${TEST_TOKEN_ADDRESS}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockDefiActivities);
    });

    it("should handle defi activities options", async () => {
      const options = {
        activityType: ["swap", "liquidity"],
        from: "from123",
        platform: ["raydium", "orca"],
        source: ["source1"],
        token: "token123",
        blockTime: [1640995200],
        page: 1,
        pageSize: 20 as const,
        sortBy: "block_time" as const,
        sortOrder: "desc" as const,
      };
      const mockDefiActivities = { success: true, data: [] };
      mockMakeGetRequest.mockResolvedValue(mockDefiActivities);

      await tokenApi.defiActivities(TEST_TOKEN_ADDRESS, options);

      const expectedUrl = expect.stringContaining("page=1");
      expect(mockMakeGetRequest).toHaveBeenCalledWith(expectedUrl, {
        token: TEST_API_KEY,
      });
    });
  });

  describe("list", () => {
    it("should fetch token list successfully", async () => {
      mockMakeGetRequest.mockResolvedValue(mockTokenList);

      const result = await tokenApi.list();

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        "https://pro-api.solscan.io/v2.0/token/list?page=1",
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockTokenList);
    });

    it("should handle list options", async () => {
      const options = {
        page: 2,
        pageSize: 30 as const,
        sortBy: "market_cap" as const,
        sortOrder: "desc" as const,
      };
      mockMakeGetRequest.mockResolvedValue(mockTokenList);

      await tokenApi.list(options);

      const expectedUrl = expect.stringContaining("page=2");
      expect(mockMakeGetRequest).toHaveBeenCalledWith(expectedUrl, {
        token: TEST_API_KEY,
      });
    });
  });

  describe("marketVolume", () => {
    it("should fetch market volume successfully", async () => {
      const mockVolume = { success: true, data: [] };
      mockMakeGetRequest.mockResolvedValue(mockVolume);

      const result = await tokenApi.marketVolume(TEST_TOKEN_ADDRESS);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/token/market/volume?address=${TEST_TOKEN_ADDRESS}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockVolume);
    });

    it("should handle time options", async () => {
      const options = { time: [1640995200, 1640995300] };
      const mockVolume = { success: true, data: [] };
      mockMakeGetRequest.mockResolvedValue(mockVolume);

      await tokenApi.marketVolume(TEST_TOKEN_ADDRESS, options);

      const expectedUrl = expect.stringContaining("time[]=1640995200");
      expect(mockMakeGetRequest).toHaveBeenCalledWith(expectedUrl, {
        token: TEST_API_KEY,
      });
    });
  });

  describe("trending", () => {
    it("should fetch trending tokens successfully", async () => {
      mockMakeGetRequest.mockResolvedValue(mockTokenList);

      const result = await tokenApi.trending();

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        "https://pro-api.solscan.io/v2.0/token/trending?limit=10",
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockTokenList);
    });

    it("should handle custom limit", async () => {
      mockMakeGetRequest.mockResolvedValue(mockTokenList);

      await tokenApi.trending(20);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        "https://pro-api.solscan.io/v2.0/token/trending?limit=20",
        { token: TEST_API_KEY }
      );
    });
  });

  describe("tokenPrice", () => {
    it("should fetch token price successfully", async () => {
      const mockPrice = { success: true, data: [] };
      mockMakeGetRequest.mockResolvedValue(mockPrice);

      const result = await tokenApi.tokenPrice(TEST_TOKEN_ADDRESS);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/token/price?address=${TEST_TOKEN_ADDRESS}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockPrice);
    });

    it("should handle time options", async () => {
      const options = { time: [1640995200, 1640995300] };
      const mockPrice = { success: true, data: [] };
      mockMakeGetRequest.mockResolvedValue(mockPrice);

      await tokenApi.tokenPrice(TEST_TOKEN_ADDRESS, options);

      const expectedUrl = expect.stringContaining("time[]=1640995200");
      expect(mockMakeGetRequest).toHaveBeenCalledWith(expectedUrl, {
        token: TEST_API_KEY,
      });
    });
  });

  describe("holders", () => {
    it("should fetch token holders successfully", async () => {
      // Create a mock that matches the expected structure
      const mockHoldersResponse = {
        success: true,
        data: { total: 1000000, items: [] },
      };
      mockMakeGetRequest.mockResolvedValue(mockHoldersResponse);

      const result = await tokenApi.holders(TEST_TOKEN_ADDRESS);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/token/holders?address=${TEST_TOKEN_ADDRESS}&page=1`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockHoldersResponse);
    });

    it("should handle holders options", async () => {
      const options = {
        page: 2,
        pageSize: 20 as const,
        fromAmount: 1000,
        toAmount: 10000,
      };
      const mockHoldersResponse = {
        success: true,
        data: { total: 1000000, items: [] },
      };
      mockMakeGetRequest.mockResolvedValue(mockHoldersResponse);

      await tokenApi.holders(TEST_TOKEN_ADDRESS, options);

      const expectedUrl = expect.stringContaining("page=2");
      expect(mockMakeGetRequest).toHaveBeenCalledWith(expectedUrl, {
        token: TEST_API_KEY,
      });
    });
  });

  describe("top", () => {
    it("should fetch top tokens successfully", async () => {
      const mockTop = { success: true, data: { total: 100, items: [] } };
      mockMakeGetRequest.mockResolvedValue(mockTop);

      const result = await tokenApi.top();

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        "https://pro-api.solscan.io/v2.0/token/top",
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockTop);
    });
  });

  describe("error handling", () => {
    it("should handle network errors", async () => {
      const networkError = new Error("Network error");
      mockMakeGetRequest.mockRejectedValue(networkError);

      await expect(tokenApi.meta(TEST_TOKEN_ADDRESS)).rejects.toThrow(
        "Network error"
      );
    });

    it("should handle API rate limiting", async () => {
      const rateLimitError = {
        success: false,
        data: [],
        errors: [{ code: 429, message: "Rate limit exceeded" }],
      };
      mockMakeGetRequest.mockResolvedValue(rateLimitError);

      const result = await tokenApi.meta(TEST_TOKEN_ADDRESS);

      expect(result).toEqual(rateLimitError);
    });
  });

  describe("response validation", () => {
    it("should validate token metadata response structure", async () => {
      mockMakeGetRequest.mockResolvedValue(mockTokenMeta);

      const result = await tokenApi.meta(TEST_TOKEN_ADDRESS);

      expect(validateApiV2Response(result)).toBe(true);
      expect(validateSingleResponse(result, validateTokenMeta)).toBe(true);

      // Validate specific fields exist and have correct types
      expect(result.data[0]).toHaveProperty("address");
      expect(result.data[0]).toHaveProperty("symbol");
      expect(result.data[0]).toHaveProperty("name");
      expect(result.data[0]).toHaveProperty("decimals");
      expect(typeof result.data[0].decimals).toBe("number");
    });

    it("should validate token market response structure", async () => {
      mockMakeGetRequest.mockResolvedValue(mockTokenMarket);

      const result = await tokenApi.markets([TEST_TOKEN_ADDRESS]);

      expect(validateApiV2Response(result)).toBe(true);
      expect(validateArrayResponse(result, validateTokenMarket)).toBe(true);

      // Validate specific fields
      if (result.data.length > 0) {
        expect(result.data[0]).toHaveProperty("pool_id");
        expect(result.data[0]).toHaveProperty("total_volume_24h");
        expect(typeof result.data[0].total_volume_24h).toBe("number");
      }
    });

    it("should validate token transfer response structure", async () => {
      mockMakeGetRequest.mockResolvedValue(mockTokenTransfer);

      const result = await tokenApi.transfer(TEST_TOKEN_ADDRESS);

      expect(validateApiV2Response(result)).toBe(true);
      expect(validateArrayResponse(result, validateTokenTransfer)).toBe(true);

      // Validate specific fields
      if (result.data.length > 0) {
        expect(result.data[0]).toHaveProperty("block_id");
        expect(result.data[0]).toHaveProperty("trans_id");
        expect(result.data[0]).toHaveProperty("amount");
        expect(typeof result.data[0].amount).toBe("number");
      }
    });

    it("should handle malformed responses gracefully", async () => {
      const malformedResponse = {
        success: true,
        data: "not an array", // This should be an array
      };
      mockMakeGetRequest.mockResolvedValue(malformedResponse);

      const result = await tokenApi.meta(TEST_TOKEN_ADDRESS);

      expect(validateApiV2Response(result)).toBe(false);
      expect(validateSingleResponse(result, validateTokenMeta)).toBe(false);
    });

    it("should handle responses with missing required fields", async () => {
      const incompleteResponse = {
        success: true,
        data: [
          {
            address: TEST_TOKEN_ADDRESS,
            symbol: "TEST",
            // Missing required fields like 'name', 'decimals', etc.
          },
        ],
      };
      mockMakeGetRequest.mockResolvedValue(incompleteResponse);

      const result = await tokenApi.meta(TEST_TOKEN_ADDRESS);

      expect(validateApiV2Response(result)).toBe(true);
      expect(validateSingleResponse(result, validateTokenMeta)).toBe(false);
    });

    it("should handle responses with incorrect field types", async () => {
      const wrongTypeResponse = {
        success: true,
        data: [
          {
            address: TEST_TOKEN_ADDRESS,
            symbol: "TEST",
            name: "Test Token",
            decimals: "9", // Should be number, not string
            supply: "1000000",
            icon: null,
            website: null,
            twitter: null,
          },
        ],
      };
      mockMakeGetRequest.mockResolvedValue(wrongTypeResponse);

      const result = await tokenApi.meta(TEST_TOKEN_ADDRESS);

      expect(validateApiV2Response(result)).toBe(true);
      expect(validateSingleResponse(result, validateTokenMeta)).toBe(false);
    });
  });
});
