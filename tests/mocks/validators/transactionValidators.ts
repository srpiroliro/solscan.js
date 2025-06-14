// Transaction validators (TransactionAPI returns 'any' type)
export function validateTransactionResponse(data: any): boolean {
  return typeof data === "object" && data !== null;
}
