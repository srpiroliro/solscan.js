import { TransactionAPI } from "../src/apiV2/transactionApi";
import { makeGetRequest } from "../src/utils";
import {
  mockTransactionDetail,
  mockTransactionActions,
  mockLastTransactions,
  TEST_TRANSACTION_SIGNATURE,
  TEST_API_KEY,
} from "./mocks/apiMocks";
import {
  validateApiV2Response,
  validateTransactionResponse,
} from "./mocks/validators";

// Mock the utils module
jest.mock("../src/utils", () => ({
  makeGetRequest: jest.fn(),
  appendQueryParam: jest.requireActual("../src/utils").appendQueryParam,
}));

const mockMakeGetRequest = makeGetRequest as jest.MockedFunction<
  typeof makeGetRequest
>;

describe("TransactionAPI", () => {
  let transactionApi: TransactionAPI;

  beforeEach(() => {
    transactionApi = new TransactionAPI(TEST_API_KEY);
    mockMakeGetRequest.mockClear();
  });

  describe("constructor", () => {
    it("should initialize with correct base URL and headers", () => {
      expect(transactionApi).toBeInstanceOf(TransactionAPI);
      // Access protected properties for testing
      expect((transactionApi as any).url).toBe(
        "https://pro-api.solscan.io/v2.0/"
      );
      expect((transactionApi as any).headers).toEqual({ token: TEST_API_KEY });
      expect((transactionApi as any).urlModule).toBe(
        "https://pro-api.solscan.io/v2.0/transaction/"
      );
    });
  });

  describe("last", () => {
    it("should fetch latest transactions with default filter", async () => {
      mockMakeGetRequest.mockResolvedValue(mockLastTransactions);

      const result = await transactionApi.last();

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        "https://pro-api.solscan.io/v2.0/transaction/last?filter=exceptVote",
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockLastTransactions);
    });

    it("should fetch latest transactions with custom filter", async () => {
      mockMakeGetRequest.mockResolvedValue(mockLastTransactions);

      const result = await transactionApi.last({ filter: "all" });

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        "https://pro-api.solscan.io/v2.0/transaction/last?filter=all",
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockLastTransactions);
    });

    it("should fetch latest transactions with limit", async () => {
      mockMakeGetRequest.mockResolvedValue(mockLastTransactions);

      const result = await transactionApi.last({ limit: 50 });

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        expect.stringContaining("limit=50"),
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockLastTransactions);
    });

    it("should fetch latest transactions with both filter and limit", async () => {
      mockMakeGetRequest.mockResolvedValue(mockLastTransactions);

      const result = await transactionApi.last({ filter: "vote", limit: 25 });

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        expect.stringContaining("filter=vote"),
        { token: TEST_API_KEY }
      );
      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        expect.stringContaining("limit=25"),
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockLastTransactions);
    });

    it("should handle empty options object", async () => {
      mockMakeGetRequest.mockResolvedValue(mockLastTransactions);

      const result = await transactionApi.last({});

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        "https://pro-api.solscan.io/v2.0/transaction/last?filter=exceptVote",
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockLastTransactions);
    });
  });

  describe("detail", () => {
    it("should fetch transaction details successfully", async () => {
      mockMakeGetRequest.mockResolvedValue(mockTransactionDetail);

      const result = await transactionApi.detail(TEST_TRANSACTION_SIGNATURE);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/transaction/detail?tx=${TEST_TRANSACTION_SIGNATURE}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockTransactionDetail);
    });

    it("should handle transaction not found", async () => {
      const notFoundResponse = {
        success: false,
        data: null,
        errors: [{ code: 404, message: "Transaction not found" }],
      };
      mockMakeGetRequest.mockResolvedValue(notFoundResponse);

      const result = await transactionApi.detail("invalid_signature");

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        "https://pro-api.solscan.io/v2.0/transaction/detail?tx=invalid_signature",
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(notFoundResponse);
    });

    it("should handle empty transaction signature", async () => {
      mockMakeGetRequest.mockResolvedValue(mockTransactionDetail);

      const result = await transactionApi.detail("");

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        "https://pro-api.solscan.io/v2.0/transaction/detail?tx=",
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockTransactionDetail);
    });
  });

  describe("actions", () => {
    it("should fetch transaction actions successfully", async () => {
      mockMakeGetRequest.mockResolvedValue(mockTransactionActions);

      const result = await transactionApi.actions(TEST_TRANSACTION_SIGNATURE);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/transaction/actions?tx=${TEST_TRANSACTION_SIGNATURE}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(mockTransactionActions);
    });

    it("should handle transaction with no actions", async () => {
      const noActionsResponse = {
        success: true,
        data: [],
      };
      mockMakeGetRequest.mockResolvedValue(noActionsResponse);

      const result = await transactionApi.actions(TEST_TRANSACTION_SIGNATURE);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/transaction/actions?tx=${TEST_TRANSACTION_SIGNATURE}`,
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(noActionsResponse);
    });

    it("should handle invalid transaction signature", async () => {
      const errorResponse = {
        success: false,
        data: null,
        errors: [{ code: 400, message: "Invalid transaction signature" }],
      };
      mockMakeGetRequest.mockResolvedValue(errorResponse);

      const result = await transactionApi.actions("invalid_signature");

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        "https://pro-api.solscan.io/v2.0/transaction/actions?tx=invalid_signature",
        { token: TEST_API_KEY }
      );
      expect(result).toEqual(errorResponse);
    });
  });

  describe("error handling", () => {
    it("should handle network errors", async () => {
      const networkError = new Error("Network connection failed");
      mockMakeGetRequest.mockRejectedValue(networkError);

      await expect(
        transactionApi.detail(TEST_TRANSACTION_SIGNATURE)
      ).rejects.toThrow("Network connection failed");
    });

    it("should handle timeout errors", async () => {
      const timeoutError = new Error("Request timeout");
      mockMakeGetRequest.mockRejectedValue(timeoutError);

      await expect(
        transactionApi.actions(TEST_TRANSACTION_SIGNATURE)
      ).rejects.toThrow("Request timeout");
    });

    it("should handle API rate limiting", async () => {
      const rateLimitResponse = {
        success: false,
        data: null,
        errors: [{ code: 429, message: "Too many requests" }],
      };
      mockMakeGetRequest.mockResolvedValue(rateLimitResponse);

      const result = await transactionApi.last();

      expect(result).toEqual(rateLimitResponse);
    });

    it("should handle server errors", async () => {
      const serverErrorResponse = {
        success: false,
        data: null,
        errors: [{ code: 500, message: "Internal server error" }],
      };
      mockMakeGetRequest.mockResolvedValue(serverErrorResponse);

      const result = await transactionApi.detail(TEST_TRANSACTION_SIGNATURE);

      expect(result).toEqual(serverErrorResponse);
    });
  });

  describe("URL construction", () => {
    it("should construct correct URLs for all methods", async () => {
      mockMakeGetRequest.mockResolvedValue({ success: true, data: [] });

      // Test last method URL
      await transactionApi.last();
      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        expect.stringContaining("/transaction/last"),
        expect.any(Object)
      );

      // Test detail method URL
      await transactionApi.detail(TEST_TRANSACTION_SIGNATURE);
      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        expect.stringContaining("/transaction/detail"),
        expect.any(Object)
      );

      // Test actions method URL
      await transactionApi.actions(TEST_TRANSACTION_SIGNATURE);
      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        expect.stringContaining("/transaction/actions"),
        expect.any(Object)
      );
    });

    it("should properly encode transaction signatures in URLs", async () => {
      mockMakeGetRequest.mockResolvedValue({ success: true, data: [] });

      const specialCharSignature = "tx+with/special=chars&more";

      await transactionApi.detail(specialCharSignature);

      expect(mockMakeGetRequest).toHaveBeenCalledWith(
        `https://pro-api.solscan.io/v2.0/transaction/detail?tx=${specialCharSignature}`,
        { token: TEST_API_KEY }
      );
    });
  });

  describe("authentication", () => {
    it("should include API key in headers for all requests", async () => {
      mockMakeGetRequest.mockResolvedValue({ success: true, data: [] });

      await transactionApi.last();
      await transactionApi.detail(TEST_TRANSACTION_SIGNATURE);
      await transactionApi.actions(TEST_TRANSACTION_SIGNATURE);

      // Verify all calls included the correct headers
      expect(mockMakeGetRequest).toHaveBeenCalledTimes(3);
      mockMakeGetRequest.mock.calls.forEach((call) => {
        expect(call[1]).toEqual({ token: TEST_API_KEY });
      });
    });
  });

  describe("response validation", () => {
    it("should validate transaction detail response structure", async () => {
      mockMakeGetRequest.mockResolvedValue(mockTransactionDetail);

      const result = await transactionApi.detail(TEST_TRANSACTION_SIGNATURE);

      expect(validateApiV2Response(result)).toBe(true);
      expect(validateTransactionResponse(result.data)).toBe(true);

      // Validate specific fields exist (since TransactionAPI returns 'any')
      expect(result.data).toHaveProperty("blockTime");
      expect(result.data).toHaveProperty("slot");
      expect(result.data).toHaveProperty("txHash");
      expect(typeof result.data.blockTime).toBe("number");
      expect(typeof result.data.slot).toBe("number");
    });

    it("should validate transaction actions response structure", async () => {
      mockMakeGetRequest.mockResolvedValue(mockTransactionActions);

      const result = await transactionApi.actions(TEST_TRANSACTION_SIGNATURE);

      expect(validateApiV2Response(result)).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);

      // Validate array elements if present
      if (result.data.length > 0) {
        expect(validateTransactionResponse(result.data[0])).toBe(true);
        expect(result.data[0]).toHaveProperty("type");
        expect(result.data[0]).toHaveProperty("info");
      }
    });

    it("should validate last transactions response structure", async () => {
      mockMakeGetRequest.mockResolvedValue(mockLastTransactions);

      const result = await transactionApi.last();

      expect(validateApiV2Response(result)).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);

      // Validate array elements if present
      if (result.data.length > 0) {
        expect(validateTransactionResponse(result.data[0])).toBe(true);
        expect(result.data[0]).toHaveProperty("blockTime");
        expect(result.data[0]).toHaveProperty("slot");
        expect(result.data[0]).toHaveProperty("txHash");
      }
    });

    it("should handle malformed transaction responses gracefully", async () => {
      const malformedResponse = {
        success: true,
        data: "not an object", // This should be an object or array
      };
      mockMakeGetRequest.mockResolvedValue(malformedResponse);

      const result = await transactionApi.detail(TEST_TRANSACTION_SIGNATURE);

      expect(validateApiV2Response(result)).toBe(true); // Structure is valid
      expect(validateTransactionResponse(result.data)).toBe(false); // Data is not valid
    });

    it("should handle null transaction data", async () => {
      const nullResponse = {
        success: true,
        data: null,
      };
      mockMakeGetRequest.mockResolvedValue(nullResponse);

      const result = await transactionApi.detail("nonexistent_signature");

      expect(validateApiV2Response(result)).toBe(false); // data should be array, not null
      expect(validateTransactionResponse(result.data)).toBe(false);
    });

    it("should handle empty transaction arrays", async () => {
      const emptyResponse = {
        success: true,
        data: [],
      };
      mockMakeGetRequest.mockResolvedValue(emptyResponse);

      const result = await transactionApi.last();

      expect(validateApiV2Response(result)).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBe(0);
    });
  });
});
