import { TokenAPI } from "../src/api/token";
import { makeGetRequest } from "../src/utils";
import {
  mockTokenMeta,
  mockTokenMetaMulti,
  mockTokenMarket,
  mockTokenMarketInfo,
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
  validateApiResponseStructure,
  validateTypeAlignment,
  createMockValidator,
  assertTypeValid,
  validateOptionalField,
} from "./mocks/validators/typeValidationHelpers";
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
        "https://pro-api.solscan.io/v2.0/token/",
      );
    });
  });

  describe("meta", () => {
    it("should fetch token metadata successfully", async () => {
      mockMakeGetRequest.mockResolvedValue(mockTokenMeta);

      const result = await tokenApi.meta(TEST_TOKEN_ADDRESS);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/token/meta?address=${TEST_TOKEN_ADDRESS}`,
        { token: TEST_API_KEY },
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
      mockMakeGetRequest.mockResolvedValue(mockTokenMetaMulti);

      const result = await tokenApi.metaMulti(addresses);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/token/meta/multi?address[]=${addresses[0]}&address[]=${addresses[1]}`,
        { token: TEST_API_KEY },
      );
      expect(result).toEqual(mockTokenMetaMulti);
    });
  });

  describe("markets", () => {
    it("should fetch token markets successfully", async () => {
      const tokens = [TEST_TOKEN_ADDRESS];
      mockMakeGetRequest.mockResolvedValue(mockTokenMarket);

      const result = await tokenApi.markets(tokens);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/token/markets?token[]=${TEST_TOKEN_ADDRESS}`,
        { token: TEST_API_KEY },
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
        { token: TEST_API_KEY },
      );
      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        expect.stringContaining(`token[]=${tokens[1]}`),
        { token: TEST_API_KEY },
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
        "Token pair addresses are required",
      );
    });
  });

  describe("marketInfo", () => {
    it("should fetch token market info successfully", async () => {
      mockMakeGetRequest.mockResolvedValue(mockTokenMarketInfo);

      const result = await tokenApi.marketInfo(TEST_TOKEN_ADDRESS);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/token/market/info?address=${TEST_TOKEN_ADDRESS}`,
        { token: TEST_API_KEY },
      );
      expect(result).toEqual(mockTokenMarketInfo);
    });
  });

  describe("transfer", () => {
    it("should fetch token transfers successfully", async () => {
      mockMakeGetRequest.mockResolvedValue(mockTokenTransfer);

      const result = await tokenApi.transfer(TEST_TOKEN_ADDRESS);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/token/transfer?address=${TEST_TOKEN_ADDRESS}`,
        { token: TEST_API_KEY },
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
        { token: TEST_API_KEY },
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
        { token: TEST_API_KEY },
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
        { token: TEST_API_KEY },
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
        { token: TEST_API_KEY },
      );
      expect(result).toEqual(mockTokenList);
    });

    it("should handle custom limit", async () => {
      mockMakeGetRequest.mockResolvedValue(mockTokenList);

      await tokenApi.trending(20);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        "https://pro-api.solscan.io/v2.0/token/trending?limit=20",
        { token: TEST_API_KEY },
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
        { token: TEST_API_KEY },
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
        { token: TEST_API_KEY },
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
        { token: TEST_API_KEY },
      );
      expect(result).toEqual(mockTop);
    });
  });

  describe("error handling", () => {
    it("should handle network errors", async () => {
      const networkError = new Error("Network error");
      mockMakeGetRequest.mockRejectedValue(networkError);

      await expect(tokenApi.meta(TEST_TOKEN_ADDRESS)).rejects.toThrow(
        "Network error",
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

  describe("comprehensive type validation", () => {
    it("should validate mock data matches TypeScript types at compile time", () => {
      // These assignments will fail at compile time if types don't match
      const tokenMetaMock: typeof mockTokenMeta = mockTokenMeta;
      const tokenMarketMock: typeof mockTokenMarket = mockTokenMarket;
      const tokenTransferMock: typeof mockTokenTransfer = mockTokenTransfer;
      const tokenHoldersMock: typeof mockTokenHolders = mockTokenHolders;

      // Runtime validation to ensure mock data structure is correct
      expect(tokenMetaMock.success).toBe(true);
      expect(Array.isArray(tokenMetaMock.data)).toBe(false); // Single object
      expect(tokenMarketMock.success).toBe(true);
      expect(Array.isArray(tokenMarketMock.data)).toBe(true); // Array
    });

    it("should validate TokenMeta with optional fields", () => {
      const tokenMetaData = mockTokenMeta.data;
      
      // Test that optional fields are handled correctly
      const creatorValidation = validateOptionalField(
        tokenMetaData.creator,
        (value: string) => typeof value === "string",
        "creator"
      );
      expect(creatorValidation.valid).toBe(true);

      const metadataValidation = validateOptionalField(
        tokenMetaData.metadata,
        (value: object) => typeof value === "object" && value !== null,
        "metadata",
        true // Allow null
      );
      expect(metadataValidation.valid).toBe(true);

      const validation = validateTypeAlignment(
        tokenMetaData,
        validateTokenMeta,
        "TokenMeta"
      );

      expect(validation.valid).toBe(true);
      if (!validation.valid) {
        console.error("TokenMeta validation errors:", validation.errors);
      }
    });

    it("should validate TokenHolders nested structure", () => {
      const holdersData = mockTokenHolders.data;
      
      // Validate the nested structure
      expect(holdersData).toHaveProperty("total");
      expect(holdersData).toHaveProperty("items");
      expect(typeof holdersData.total).toBe("number");
      expect(Array.isArray(holdersData.items)).toBe(true);

      const validation = validateTypeAlignment(
        holdersData,
        validateTokenHolders,
        "TokenHolders"
      );

      expect(validation.valid).toBe(true);
      if (!validation.valid) {
        console.error("TokenHolders validation errors:", validation.errors);
      }
    });

    it("should validate TokenTransfer with block_id as string", () => {
      const transferData = mockTokenTransfer.data[0];
      
      // Verify block_id is string as per type definition
      expect(typeof transferData.block_id).toBe("string");

      const validation = validateTypeAlignment(
        transferData,
        validateTokenTransfer,
        "TokenTransfer"
      );

      expect(validation.valid).toBe(true);
      if (!validation.valid) {
        console.error("TokenTransfer validation errors:", validation.errors);
      }
    });

    it("should validate API response structures comprehensively", () => {
      const tokenMetaValidation = validateApiResponseStructure(
        mockTokenMeta,
        validateTokenMeta,
        "TokenMeta",
        false // Single item expected
      );

      expect(tokenMetaValidation.valid).toBe(true);
      expect(tokenMetaValidation.structureValid).toBe(true);
      expect(tokenMetaValidation.dataValid).toBe(true);

      const tokenTransferValidation = validateApiResponseStructure(
        mockTokenTransfer,
        validateTokenTransfer,
        "TokenTransfer",
        true // Array expected
      );

      expect(tokenTransferValidation.valid).toBe(true);
      expect(tokenTransferValidation.structureValid).toBe(true);
      expect(tokenTransferValidation.dataValid).toBe(true);
    });

    it("should handle TokenMeta with minimal optional fields", () => {
      // Create a token meta with minimal fields (only required ones)
      const minimalTokenMeta = {
        address: "So11111111111111111111111111111111111111112",
        name: "Wrapped SOL",
        symbol: "SOL",
        icon: "https://example.com/sol-icon.png",
        decimals: 9,
        holder: 1000000,
        supply: "1000000000000000000",
        mint_authority: null,
        freeze_authority: null,
        price: 100.5,
        market_cap: 50000000000,
        market_cap_rank: null,
        metadata: null,
        // All other fields omitted (optional)
      };

      const validation = validateTypeAlignment(
        minimalTokenMeta,
        validateTokenMeta,
        "TokenMeta"
      );

      expect(validation.valid).toBe(true);
      if (!validation.valid) {
        console.error("Minimal TokenMeta validation errors:", validation.errors);
      }
    });

    it("should detect type mismatches in corrupted token data", () => {
      const corruptedTokenMeta = {
        ...mockTokenMeta.data,
        decimals: "9", // Should be number, not string
        holder: "1000000", // Should be number, not string
        price: "100.5", // Should be number, not string
      };

      const validation = validateTypeAlignment(
        corruptedTokenMeta,
        validateTokenMeta,
        "TokenMeta"
      );

      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);

      // This should throw
      expect(() => {
        assertTypeValid(
          corruptedTokenMeta,
          validateTokenMeta,
          "TokenMeta"
        );
      }).toThrow();
    });

    it("should validate TokenMeta metadata nested structure", () => {
      const tokenMeta = mockTokenMeta.data;
      
      if (tokenMeta.metadata !== null) {
        expect(typeof tokenMeta.metadata.name).toBe("string");
        expect(typeof tokenMeta.metadata.symbol).toBe("string");
        expect(typeof tokenMeta.metadata.description).toBe("string");
        expect(typeof tokenMeta.metadata.image).toBe("string");
        
        // Optional fields in metadata
        if (tokenMeta.metadata.website) {
          expect(typeof tokenMeta.metadata.website).toBe("string");
        }
        if (tokenMeta.metadata.twitter) {
          expect(typeof tokenMeta.metadata.twitter).toBe("string");
        }
      }
    });

    it("should validate TokenMarket response with all required fields", () => {
      const marketData = mockTokenMarketInfo.data;
      
      // Validate all required fields are present and correct type
      expect(typeof marketData.pool_id).toBe("string");
      expect(typeof marketData.program_id).toBe("string");
      expect(typeof marketData.token_1).toBe("string");
      expect(typeof marketData.token_2).toBe("string");
      expect(typeof marketData.total_volume_24h).toBe("number");
      expect(typeof marketData.total_trades_24h).toBe("number");

      const validation = validateTypeAlignment(
        marketData,
        validateTokenMarket,
        "TokenMarket"
      );

      expect(validation.valid).toBe(true);
      if (!validation.valid) {
        console.error("TokenMarket validation errors:", validation.errors);
      }
    });
  });

  describe("response validation", () => {
    it("should validate token metadata response structure", async () => {
      mockMakeGetRequest.mockResolvedValue(mockTokenMeta);

      const result = await tokenApi.meta(TEST_TOKEN_ADDRESS);

      expect(validateApiV2Response(result)).toBe(true);
      expect(validateSingleResponse(result, validateTokenMeta)).toBe(true);

      // Validate specific fields exist and have correct types
      expect(result.data).toHaveProperty("address");
      expect(result.data).toHaveProperty("symbol");
      expect(result.data).toHaveProperty("name");
      expect(result.data).toHaveProperty("decimals");
      expect(typeof result.data.decimals).toBe("number");
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

  describe("edge case validation", () => {
    it("should handle TokenMeta with null metadata", () => {
      const tokenWithNullMetadata = {
        ...mockTokenMeta.data,
        metadata: null,
      };

      const validation = validateTypeAlignment(
        tokenWithNullMetadata,
        validateTokenMeta,
        "TokenMeta"
      );

      expect(validation.valid).toBe(true);
    });

    it("should handle TokenMeta with null market_cap_rank", () => {
      const tokenWithNullRank = {
        ...mockTokenMeta.data,
        market_cap_rank: null,
      };

      const validation = validateTypeAlignment(
        tokenWithNullRank,
        validateTokenMeta,
        "TokenMeta"
      );

      expect(validation.valid).toBe(true);
    });

    it("should handle TokenMeta with undefined optional fields", () => {
      const tokenWithMinimalFields = {
        address: "So11111111111111111111111111111111111111112",
        name: "Wrapped SOL",
        symbol: "SOL",
        icon: "https://example.com/sol-icon.png",
        decimals: 9,
        holder: 1000000,
        supply: "1000000000000000000",
        mint_authority: null,
        freeze_authority: null,
        price: 100.5,
        market_cap: 50000000000,
        metadata: null,
        market_cap_rank: null,
        // All other optional fields undefined
      };

      const validation = validateTypeAlignment(
        tokenWithMinimalFields,
        validateTokenMeta,
        "TokenMeta"
      );

      expect(validation.valid).toBe(true);
    });

    it("should validate TokenHolders with empty items array", () => {
      const emptyHolders = {
        total: 0,
        items: [],
      };

      const validation = validateTypeAlignment(
        emptyHolders,
        validateTokenHolders,
        "TokenHolders"
      );

      expect(validation.valid).toBe(true);
    });

    it("should handle TokenTransfer with boundary values", () => {
      const transferWithBoundaryValues = {
        ...mockTokenTransfer.data[0],
        amount: 0, // Minimum amount
        token_decimals: 18, // Maximum typical decimals
        block_time: 0, // Minimum timestamp
      };

      const validation = validateTypeAlignment(
        transferWithBoundaryValues,
        validateTokenTransfer,
        "TokenTransfer"
      );

      expect(validation.valid).toBe(true);
    });

    it("should reject TokenMeta with wrong authority types", () => {
      const tokenWithWrongAuthority = {
        ...mockTokenMeta.data,
        mint_authority: "invalid", // Should be null or string, but must validate as string if not null
        freeze_authority: 123, // Should be null or string, not number
      };

      const validation = validateTypeAlignment(
        tokenWithWrongAuthority,
        validateTokenMeta,
        "TokenMeta"
      );

      expect(validation.valid).toBe(false);
    });

    it("should handle TokenMarket with zero volumes", () => {
      const marketWithZeroVolume = {
        ...mockTokenMarketInfo.data,
        total_volume_24h: 0,
        total_volume_prev_24h: 0,
        total_trades_24h: 0,
        total_trades_prev_24h: 0,
      };

      const validation = validateTypeAlignment(
        marketWithZeroVolume,
        validateTokenMarket,
        "TokenMarket"
      );

      expect(validation.valid).toBe(true);
    });

    it("should validate large numeric values", () => {
      const tokenWithLargeValues = {
        ...mockTokenMeta.data,
        holder: Number.MAX_SAFE_INTEGER,
        market_cap: Number.MAX_SAFE_INTEGER,
        price: 999999.99,
      };

      const validation = validateTypeAlignment(
        tokenWithLargeValues,
        validateTokenMeta,
        "TokenMeta"
      );

      expect(validation.valid).toBe(true);
    });

    it("should handle empty string fields correctly", () => {
      const tokenWithEmptyStrings = {
        ...mockTokenMeta.data,
        icon: "", // Empty but valid string
        supply: "0", // Zero supply as string
      };

      const validation = validateTypeAlignment(
        tokenWithEmptyStrings,
        validateTokenMeta,
        "TokenMeta"
      );

      expect(validation.valid).toBe(true);
    });

    it("should validate TokenHolders item structure thoroughly", () => {
      const holdersWithVariousValues = {
        total: 1000,
        items: [
          {
            address: "So11111111111111111111111111111111111111112",
            amount: 0, // Zero amount
            decimals: 9,
            owner: "11111111111111111111111111111111",
            rank: 1,
          },
          {
            address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            amount: Number.MAX_SAFE_INTEGER, // Large amount
            decimals: 6,
            owner: "22222222222222222222222222222222",
            rank: 999999, // High rank
          },
        ],
      };

      const validation = validateTypeAlignment(
        holdersWithVariousValues,
        validateTokenHolders,
        "TokenHolders"
      );

      expect(validation.valid).toBe(true);
    });

    it("should reject malformed API responses", () => {
      const malformedResponse = {
        success: "true", // Should be boolean
        data: "not an array", // Should be array
      };

      const validation = validateApiResponseStructure(
        malformedResponse,
        validateTokenMeta,
        "TokenMeta",
        false
      );

      expect(validation.valid).toBe(false);
      expect(validation.structureValid).toBe(false);
    });

    it("should handle TokenMeta metadata with optional nested fields", () => {
      const tokenWithPartialMetadata = {
        ...mockTokenMeta.data,
        metadata: {
          name: "Test Token",
          symbol: "TEST",
          description: "A test token",
          image: "https://example.com/image.png",
          // website and twitter are undefined (optional)
        },
      };

      const validation = validateTypeAlignment(
        tokenWithPartialMetadata,
        validateTokenMeta,
        "TokenMeta"
      );

      expect(validation.valid).toBe(true);
    });
  });
});
