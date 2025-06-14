import { SolscanAPI } from './src';

import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.API_KEY || "";

const solscan = new SolscanAPI(API_KEY);

async function getChainInfo() {
  try {
    const result = await solscan.public.chainInfo();
    console.log("Chain Info:", result);
  } catch (error) {
    console.error("Error getting chain info:", error);
  }
}

async function getTokenDefiActivities(address: string) {
  try {
    const result = await solscan.token.defiActivities(address);
    console.log("Token Defi Activities:", result);
  } catch (error) {
    console.error("Error getting token defi activities:", error);
  }
}

// Example: Get account details
async function getAccountDetails(address: string) {
  try {
    const result = await solscan.account.detail(address);
    console.log("Account Details:", result);
  } catch (error) {
    console.error("Error getting account details:", error);
  }
}

// Example: Get token metadata
async function getTokenMetadata(address: string) {
  try {
    const result = await solscan.token.meta(address);
    console.log("Token Metadata:", result);
  } catch (error) {
    console.error("Error getting token metadata:", error);
  }
}

// Example: Get NFT news
async function getNFTNews() {
  try {
    const result = await solscan.nft.news();
    console.log("NFT News:", result);
  } catch (error) {
    console.error("Error getting NFT news:", error);
  }
}

// Example: Get transaction details
async function getTransactionDetails(txSignature: string) {
  try {
    const result = await solscan.transaction.detail(txSignature);
    console.log("Transaction Details:", result);
  } catch (error) {
    console.error("Error getting transaction details:", error);
  }
}

// Example: Get token list
async function getTokenList() {
  try {
    const result = await solscan.token.top();
    console.log("Token List:", result);
  } catch (error) {
    console.error("Error getting token list:", error);
  }
}

// Example: Get balance change activities
async function getBalanceChangeActivities(address: string) {
  try {
    const result = await solscan.account.balanceChangeActivities(address);
    console.log("Balance Change Activities:", result);
  } catch (error) {
    console.error("Error getting balance change activities:", error);
  }
}

// Example: Get account transfers
async function getAccountTransfers(address: string) {
  try {
    const result = await solscan.account.transfer(address);
    console.log("Account Transfers:", result);
  } catch (error) {
    console.error("Error getting account transfers:", error);
  }
}

async function main() {
  await getChainInfo();

  console.log("--------------------------------");

  await getAccountDetails("HYe4vSaEGqQKnDrxWDrk3o5H2gznv7qtij5G6NNG8WHd");

  console.log("--------------------------------");

  await getTokenDefiActivities("6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN");

  console.log("--------------------------------");

  await getTokenMetadata("6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN");

  console.log("--------------------------------");

  await getTokenList();

  console.log("--------------------------------");

  await getBalanceChangeActivities(
    "HYe4vSaEGqQKnDrxWDrk3o5H2gznv7qtij5G6NNG8WHd"
  );

  console.log("--------------------------------");

  await getAccountTransfers("HYe4vSaEGqQKnDrxWDrk3o5H2gznv7qtij5G6NNG8WHd");

  console.log("--------------------------------");

  await getTransactionDetails(
    "5h9pTb6uA8SjciEQHiQrsTCcSLXFzK1cFdBXXzfMeXpQPmCArWTVCd4RHFGsNRY8po2t4iaLT8msq31dbJX2zfMw"
  );
}

main().then(() => {
  console.log("--- Done ---");
}); 