# 🪙 TokenHub - Blockchain Token Management Platform

**TokenHub** is a modern, full-featured blockchain token management platform that allows users to **deploy**, **mint**, **burn**, and **check balances** for **ERC20**, **ERC721**, and **ERC1155** tokens. Built with **React**, **TypeScript**, **Tailwind CSS**, and a **Go backend**, it demonstrates clean architecture and best practices for blockchain development.

---

## 🚀 Live Demo
[https://token-hub-xi.vercel.app](https://token-hub-xi.vercel.app)

---

## 📦 Features

### 🔍 Balance Check
- Check balances for ERC20, ERC721, and ERC1155 tokens
- NFT metadata and image display
- Real-time balance fetching from Ethereum Sepolia Testnet
- Support for multiple token standards

### 🚀 Token Deployment
- Deploy ERC20, ERC721, and ERC1155 smart contracts
- Customizable token parameters (name, symbol, initial supply)
- Instant deployment confirmation
- Etherscan integration

### 🪙 Token Minting
- Mint new tokens for all standards
- Batch minting support for ERC1155
- Custom token URI for NFTs
- Real-time transaction tracking

### 🔥 Token Burning
- Burn tokens across all standards
- Manual or wallet-fetch input modes
- Balance validation before burning
- Permanent removal from circulation

---

## 🧱 Tech Stack

| Frontend          | Backend          | Blockchain                  | Tools / Infra                     |
| ----------------- | ---------------- | --------------------------- | --------------------------------- |
| React 18 + TS     | Go               | Solidity, Sepolia Testnet   | Vercel, Axios, Tailwind CSS, Sonner, Lucide React, Motion |

---

## 🗂️ Project Structure
```bash
tokenhub/
├── tokenhub-frontend/ # React + Tailwind + TypeScript frontend
│ ├── components/ # Feature & UI components
│ │ ├── ui/ # Reusable UI components
│ │ ├── BalanceCheck.tsx
│ │ ├── BurnToken.tsx
│ │ ├── DeployToken.tsx
│ │ ├── MintToken.tsx
│ │ └── Navbar.tsx
│ ├── config/ # API config, demo data, environment
│ ├── hooks/ # Custom React hooks
│ ├── utils/ # Utility functions (validation etc.)
│ ├── styles/ # Global styles
│ ├── App.tsx
│ └── main.tsx
└── tokenhub-backend/ # Go backend with smart contract interaction
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- npm or yarn
- Go (for backend)
- MetaMask or any Web3 wallet (optional)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/KoKhant02/token-hub.git
cd token-hub

```
### 2️⃣ Backend Setup
```bash
cd tokenhub-backend
go run main.go
Configure env.ts with RPC URLs, private keys, etc.
```

### 3️⃣ Frontend Setup
```bash
cd tokenhub-frontend
npm install
npm run dev
```
App will run at http://localhost:5173

### 4️⃣ Production Build
```bash
npm run build
npm run preview
```

## 🔗 API Endpoints
### Balance
```http
GET /api/balance/erc20?walletAddress=&contractAddress=
GET /api/balance/erc721?walletAddress=&contractAddress=
GET /api/balance/erc1155?walletAddress=&contractAddress=
```
### Deploy
```http
POST /api/deploy/erc20
POST /api/deploy/erc721
POST /api/deploy/erc1155
```

### Mint
```http
POST /api/mint/erc20
POST /api/mint/erc721
POST /api/mint/erc1155
```

### Burn
```http
POST /api/burn/erc20
POST /api/burn/erc721
POST /api/burn/erc1155
```
See /config/api.ts for request/response formats.
## 🧪 Testing Checklist

### Balance Check
- [ ] ERC20 balance
- [ ] ERC721 NFT display
- [ ] ERC1155 balance
- [ ] Invalid address handling

### Token Deployment
- [ ] Deploy ERC20/ERC721/ERC1155
- [ ] Verify contract on Etherscan

### Token Minting
- [ ] Mint ERC20/ERC721/ERC1155
- [ ] Batch mint ERC1155
- [ ] Check transaction hashes on Etherscan

### Token Burning
- [ ] Burn ERC20/ERC721/ERC1155
- [ ] Validate balances before burning

---

## ⚡ Performance
- Optimized bundle size with Vite
- Lazy loading components
- Minimal dependencies
- Efficient React re-renders

---

## 🌐 Network Info

**Ethereum Sepolia Testnet**  
- Chain ID: `11155111`  
- RPC URL: `https://sepolia.infura.io/v3/YOUR_INFURA_KEY`  
- Block Explorer: [Sepolia Etherscan](https://sepolia.etherscan.io)

---

## 👨‍💻 Author

**Kaung Khant Lin** – Blockchain Developer & Full-Stack Engineer  
🔗 [GitHub](https://github.com/KoKhant02)
