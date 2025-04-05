# Solscan API TypeScript Client

A TypeScript client library for Solscan API. This library provides a convenient way to interact with both public and pro endpoints of the Solscan API.

**DISCLAIMER: This is an unofficial library and is not affiliated with, maintained, authorized, endorsed, or sponsored by Solscan or any of its affiliates. This is an independent tool created to help developers interact with the Solscan API.**

## Installation

```bash
npm install solscan-js
```

## Features

- TypeScript support with proper typing
- Support for all Solscan API endpoints (public and pro)
- Clean, Promise-based API
- Lazy initialization of API modules
- Helper utilities for building query parameters

## API Key

To use the Solscan Pro API endpoints, you need to obtain an API key from Solscan. You can sign up and get your API key at [Solscan](https://docs.solscan.io/).

## Basic Usage

```typescript
import { SolscanAPI } from 'solscan-js';

// Initialize with your API key
const solscan = new SolscanAPI('YOUR_API_KEY');

// Public API - Chain info
solscan.publicApi.chainInfo()
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

## API Sections

The library is organized into different sections that match the Solscan API structure:

### Public API

```typescript
// Get chain information
solscan.publicApi.chainInfo()
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### Account API

```typescript
// Get account details
solscan.apiV2.account.detail('ADDRESS')
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Get account token accounts
solscan.apiV2.account.tokenAccounts('ADDRESS', 'token', { hideZero: true })
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Get defi activities
solscan.apiV2.account.defiActivities('ADDRESS', {
  page: 1,
  pageSize: 20,
  sortBy: 'block_time',
  sortOrder: 'desc'
})
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### Token API

```typescript
// Get token metadata
solscan.apiV2.token.meta('TOKEN_ADDRESS')
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Get trending tokens
solscan.apiV2.token.trending(10)
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Get token price
solscan.apiV2.token.tokenPrice('TOKEN_ADDRESS')
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### NFT API

```typescript
// Get NFT news
solscan.apiV2.nft.news()
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Get NFT collections
solscan.apiV2.nft.collectionLists({ range: 7 })
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Get collection items
solscan.apiV2.nft.collectionItems('COLLECTION_ID')
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### Transaction API

```typescript
// Get transaction details
solscan.apiV2.transaction.detail('TX_SIGNATURE')
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Get latest transactions
solscan.apiV2.transaction.last({ limit: 20 })
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### Block API

```typescript
// Get latest blocks
solscan.apiV2.block.last(50)
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Get block details
solscan.apiV2.block.detail(BLOCK_NUMBER)
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### Monitoring API

```typescript
// Get API usage information
solscan.apiV2.monitoring.usage()
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

## Advanced Usage

### Using with async/await

```typescript
async function getAccountInfo(address: string) {
  try {
    const accountDetail = await solscan.apiV2.account.detail(address);
    const tokenAccounts = await solscan.apiV2.account.tokenAccounts(address, 'token');
    
    return {
      account: accountDetail,
      tokens: tokenAccounts
    };
  } catch (error) {
    console.error('Error fetching account info:', error);
    throw error;
  }
}
```

### Direct class usage

You can also use the API classes directly if you prefer:

```typescript
import { TokenAPI } from 'solscan-js';

const tokenApi = new TokenAPI('YOUR_API_KEY');
tokenApi.meta('TOKEN_ADDRESS')
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

## Error Handling

All API methods return promises that will reject with an error if the API request fails. We recommend using try/catch blocks or promise error handlers to handle these cases.

```typescript
try {
  const result = await solscan.apiV2.account.detail('ADDRESS');
  // Process result
} catch (error) {
  // Handle error
  console.error('API request failed:', error);
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Disclaimer

This library is not affiliated with, maintained, authorized, endorsed, or sponsored by Solscan or any of its affiliates. All product and company names are the registered trademarks of their original owners. The use of any trade name or trademark is for identification and reference purposes only and does not imply any association with the trademark holder. 