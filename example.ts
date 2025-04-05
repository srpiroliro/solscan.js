import { SolscanAPI } from './src';

// Replace with your actual API key
const API_KEY = 'YOUR_API_KEY';

// Initialize the Solscan API client
const solscan = new SolscanAPI(API_KEY);

// Example: Get chain information using the public API
async function getChainInfo() {
  try {
    const result = await solscan.publicApi.chainInfo();
    console.log('Chain Info:', result);
  } catch (error) {
    console.error('Error getting chain info:', error);
  }
}

// Example: Get account details
async function getAccountDetails(address: string) {
  try {
    const result = await solscan.apiV2.account.detail(address);
    console.log('Account Details:', result);
  } catch (error) {
    console.error('Error getting account details:', error);
  }
}

// Example: Get token metadata
async function getTokenMetadata(address: string) {
  try {
    const result = await solscan.apiV2.token.meta(address);
    console.log('Token Metadata:', result);
  } catch (error) {
    console.error('Error getting token metadata:', error);
  }
}

// Example: Get NFT news
async function getNFTNews() {
  try {
    const result = await solscan.apiV2.nft.news();
    console.log('NFT News:', result);
  } catch (error) {
    console.error('Error getting NFT news:', error);
  }
}

// Example: Get transaction details
async function getTransactionDetails(txSignature: string) {
  try {
    const result = await solscan.apiV2.transaction.detail(txSignature);
    console.log('Transaction Details:', result);
  } catch (error) {
    console.error('Error getting transaction details:', error);
  }
}

// Execute examples (uncomment to run)
// getChainInfo();
// getAccountDetails('YOUR_SOLANA_ADDRESS');
// getTokenMetadata('YOUR_TOKEN_ADDRESS');
// getNFTNews();
// getTransactionDetails('YOUR_TRANSACTION_SIGNATURE'); 