import axios from 'axios';
import { ENV } from './env';

export const API_BASE_URL = ENV.API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Routes Configuration
// Centralized route definitions that mirror the backend router structure
// 
// Usage Examples:
// 
// 1. Check Balance:
//    const response = await apiClient.get<ERC20BalanceResponse>(API_ROUTES.balance.erc20, { 
//      params: { walletAddress, contractAddress } 
//    });
//
// 2. Deploy Token:
//    const response = await apiClient.post<DeployTokenResponse>(API_ROUTES.deploy.erc721, { 
//      tokenName: 'My NFT', tokenSymbol: 'MNFT' 
//    });
//
// 3. Mint Token:
//    const response = await apiClient.post<MintTokenResponse>(API_ROUTES.mint.erc1155, { 
//      contractAddress, recipientAddress, tokenId, amount 
//    });
//
// 4. Burn Token:
//    const response = await apiClient.post<BurnTokenResponse>(API_ROUTES.burn.erc20, { 
//      contractAddress, amount 
//    });
//
// 5. Dynamic route selection:
//    const tokenType: TokenType = 'erc721';
//    const route = getRoute('balance', tokenType); // Returns '/balance/erc721'
//    const response = await apiClient.get(route, { params });
//
export const API_ROUTES = {
  balance: {
    erc20: '/api/balance/erc20',
    erc721: '/api/balance/erc721',
    erc1155: '/api/balance/erc1155',
  },
  deploy: {
    erc20: '/api/deploy/erc20',
    erc721: '/api/deploy/erc721',
    erc1155: '/api/deploy/erc1155',
  },
  mint: {
    erc20: '/api/mint/erc20',
    erc721: '/api/mint/erc721',
    erc1155: '/api/mint/erc1155',
  },
  burn: {
    erc20: '/api/burn/erc20',
    erc721: '/api/burn/erc721',
    erc1155: '/api/burn/erc1155',
  },
} as const;

// Helper type to get routes for a specific token type
export type TokenType = 'erc20' | 'erc721' | 'erc1155';

// Helper function to get the route for a specific operation and token type
export const getRoute = (operation: keyof typeof API_ROUTES, tokenType: TokenType): string => {
  return API_ROUTES[operation][tokenType];
};

// API Response Types - Balance
export interface ERC20BalanceResponse {
  tokenName: string;
  tokenSymbol: string;
  address: string;
  balance: string;
}

export interface NFTItem {
  tokenURI?: string;
  tokenId: string;
  amount?: string;
  image?: string; // Add image field for fetched images
}

export interface NFTBalanceResponse {
  tokenName: string;
  tokenSymbol: string;
  nftItems?: NFTItem[];
  address: string;
  totalTokens: string;
}

// API Request/Response Types - Deploy
export interface DeployERC20Request {
  tokenName: string;
  tokenSymbol: string;
  initialSupply: string;
}

export interface DeployERC721Request {
  tokenName: string;
  tokenSymbol: string;
}

export interface DeployERC1155Request {
  tokenName: string;
  tokenSymbol: string;
}

export interface ERC20DeployResponse {
  tokenName: string;
  tokenSymbol: string;
  address: string;
  totalSupply: string;
}

export interface DeployNFTResponse {
  tokenName: string;
  tokenSymbol: string;
  address: string;
}

// API Request/Response Types - Mint
export interface MintERC20Request {
  contractAddress: string;
  to: string;
  amount: string;
}

export interface MintERC721Request {
  contractAddress: string;
  tokenURI: string;
}

export interface MintERC1155Request {
  contractAddress: string;
  to: string;
  amount: string;
  tokenURI: string;
}

export interface MintResponse {
  transactionHash: string;
  tokenId?: string;
  contractAddress?: string;
  recipient?: string;
  amount?: string;
}

// API Request/Response Types - Burn
export interface BurnERC20Request {
  contractAddress: string;
  amount: string;
}

export interface BurnERC721Request {
  contractAddress: string;
  tokenId: string;
}

export interface BurnERC1155Request {
  contractAddress: string;
  tokenId: string;
  amount: string;
}

export interface BurnResponse {
  transactionHash: string;
  tokenId?: string;
  contractAddress?: string;
  amount?: string;
}