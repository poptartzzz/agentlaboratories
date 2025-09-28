# Agent Laboratories BSC to Solana Migration

## Overview
This document outlines the migration of Agent Laboratories from Binance Smart Chain (BSC) to Solana blockchain integration.

## Changes Made

### 1. Dependencies Updated
**Removed:**
- `ethers` - Ethereum/BSC Web3 library

**Added:**
- `@solana/web3.js` - Core Solana Web3 functionality
- `@solana/wallet-adapter-base` - Wallet adapter base functionality
- `@solana/wallet-adapter-react` - React wallet adapter
- `@solana/wallet-adapter-react-ui` - React UI components for wallet connection
- `@solana/wallet-adapter-wallets` - Support for multiple Solana wallets
- `@solana/spl-token` - SPL token program interactions

### 2. Core Utilities Migration

#### `src/utils/tokenUtils.ts`
**Before (BSC/Ethereum):**
- Used ethers.js for blockchain interaction
- Connected to BSC network via MetaMask
- ERC20 token standard (SXA token)
- BSC RPC endpoints

**After (Solana):**
- Uses @solana/web3.js for blockchain interaction
- Connects to Solana mainnet-beta cluster
- SPL token standard (AGL token)
- Jupiter API for token pricing
- Phantom wallet integration

**Key Functions Updated:**
- `getSXAPrice()` → `getAGLPrice()` - Now uses Jupiter API
- `calculateRequiredSXA()` → `calculateRequiredAGL()` - Updated for AGL token
- `handleTokenPayment()` - Complete rewrite for Solana transaction flow

#### `src/utils/etherscan.ts` → Solana Blockchain Explorer
**Before:**
- Etherscan API integration
- ERC20 contract analysis
- Ethereum transaction history

**After:**
- Direct Solana RPC calls
- SPL token mint information
- Solana transaction signatures
- Token supply and metadata lookup

**New Functions:**
- `getTokenInfo(mintAddress)` - Get SPL token information
- `getTokenHolders(mintAddress)` - Token holder analysis (requires indexing service)
- `getTokenTransactions(mintAddress)` - Recent transaction history

### 3. Frontend Components

#### `src/components/Header.tsx`
**Wallet Integration Changes:**
- **Before**: MetaMask + BSC network switching
- **After**: Phantom wallet connection

**Balance Display:**
- **Before**: Single AGL (ERC20) balance
- **After**: Dual display - SOL balance + AGL (SPL) balance

**Connection Flow:**
- Removed BSC network switching logic
- Added Phantom wallet detection
- Updated error handling for Solana-specific errors
- Added automatic connection check on component mount

#### `src/types/window.d.ts`
**Added Solana Wallet Types:**
- `window.solana` interface for Phantom wallet
- Phantom-specific methods and properties
- Maintained backward compatibility with `window.ethereum`

### 4. Token Configuration

#### New Token Setup
```typescript
// Replace with actual Agent Laboratories token mint address
const AGL_TOKEN_MINT = new PublicKey('YOUR_SOLANA_TOKEN_MINT_ADDRESS_HERE');
```

**Network Configuration:**
- **RPC Endpoint**: Solana mainnet-beta via `clusterApiUrl()`
- **Token Program**: SPL Token Program
- **Price API**: Jupiter aggregator for Solana token prices

### 5. Transaction Flow Changes

#### Payment Processing
**BSC Flow (Old):**
1. Connect MetaMask
2. Switch to BSC network
3. Check ERC20 token balance
4. Execute ERC20 transfer
5. Wait for BSC confirmation

**Solana Flow (New):**
1. Connect Phantom wallet
2. Get associated token accounts
3. Check SPL token balance
4. Create SPL token transfer instruction
5. Send and confirm Solana transaction

### 6. Error Handling Updates

**New Solana Error Types:**
- Connection rejection (code 4001)
- Insufficient SOL for fees
- Missing token accounts
- Transaction confirmation failures

## Required Manual Updates

### 1. Token Mint Address
Update the placeholder token mint address in:
- `src/utils/tokenUtils.ts`
- `src/components/Header.tsx`

```typescript
// Replace this placeholder with actual AGL token mint address
const AGL_TOKEN_MINT = new PublicKey('YOUR_SOLANA_TOKEN_MINT_ADDRESS_HERE');
```

### 2. Price API Configuration
The Jupiter price API endpoint may need adjustment based on actual token mint address:
```typescript
const response = await fetch(`https://price.jup.ag/v4/price?ids=${AGL_TOKEN_MINT.toString()}`);
```

### 3. RPC Endpoint (Optional)
For production, consider using a dedicated RPC provider:
```typescript
// Option 1: Use a dedicated RPC (recommended for production)
const connection = new Connection('https://your-rpc-endpoint.com', 'confirmed');

// Option 2: Current setup (public RPC)
const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
```

## Testing Checklist

- [ ] Phantom wallet connection
- [ ] SOL balance display
- [ ] AGL token balance display (if token account exists)
- [ ] Token payment processing
- [ ] Transaction confirmation
- [ ] Error handling for various scenarios
- [ ] Wallet disconnection
- [ ] Network switching (if using custom RPC)

## Benefits of Solana Migration

1. **Lower Transaction Fees**: Solana transactions cost fractions of a penny vs BSC gas fees
2. **Faster Finality**: Sub-second transaction confirmation vs BSC's ~3 seconds
3. **Better UX**: No network switching required, cleaner wallet integration
4. **Native Token Support**: SPL tokens are first-class citizens on Solana
5. **Growing Ecosystem**: Access to Solana's rapidly expanding DeFi ecosystem

## Potential Issues & Solutions

### Issue: "No AGL token account found"
**Solution**: Users need to create an associated token account first, or the app should handle account creation.

### Issue: Insufficient SOL for fees
**Solution**: Ensure users have at least 0.001 SOL for transaction fees.

### Issue: Token price not found
**Solution**: Implement fallback pricing or manual price configuration.

## Next Steps

1. Deploy AGL token on Solana
2. Update token mint addresses in code
3. Test on Solana devnet first
4. Configure production RPC endpoint
5. Update documentation and user guides
6. Consider implementing wallet adapter for multiple Solana wallets

---
*Migration completed: Supporting Solana blockchain with Phantom wallet integration*


