# 🪙 TokenHub

**TokenHub** is a full-stack Ethereum wallet application built with **Go** (backend) and **React** (frontend), enabling users to **deploy**, **mint**, **burn**, and **check balances** for **ERC20**, **ERC721**, and **ERC1155** tokens.
All operations are available via RESTful APIs and a user-friendly interface.

🚀 **Live Demo**: [token-hub-pi.vercel.app](https://token-hub-xi.vercel.app)

---

## 📦 Features

### ✅ Balance Check

* ERC20 Token Balance
* ERC721 NFT Ownership
* ERC1155 Token Balance with Quantity

### 🚀 Token Deployment

* Deploy ERC20, ERC721, and ERC1155 smart contracts directly to the blockchain

### 🛠️ Token Minting

* Mint new tokens for any deployed contract type

### 🔥 Token Burning

* Burn existing tokens from a wallet

---

## 🧱 Tech Stack

| Frontend          | Backend          | Blockchain                  | Infra / Dev Tools                               |
| ----------------- | ---------------- | --------------------------- | ----------------------------------------------- |
| React + Bootstrap | Go (Gorilla Mux) | Solidity, Sepolia           | Vercel (Frontend) <br> REST API <br> Zap Logger |

---

## 🗂️ Project Structure

```
token-hub/
├── tokenhub-frontend/     # React + Bootstrap frontend
└── tokenhub-backend/      # Go backend with smart contract interaction
```

---

## ⚙️ API Endpoints

Base Path: `/api`

### 📊 Balance

```
GET /api/balance/erc20
GET /api/balance/erc721
GET /api/balance/erc1155
```

### 🧾 Deploy

```
POST /api/deploy/erc20
POST /api/deploy/erc721
POST /api/deploy/erc1155
```

### 💎 Mint

```
POST /api/mint/erc20
POST /api/mint/erc721
POST /api/mint/erc1155
```

### 🗑️ Burn

```
POST /api/burn/erc20
POST /api/burn/erc721
POST /api/burn/erc1155
```

📄 For detailed request/response formats, refer to the [handlers and services](https://github.com/KoKhant02/token-hub/tree/main/tokenhub-backend/internal).

---

## 🧪 Run Locally

### 1. Backend (Go)

```bash
cd tokenhub-backend
go run main.go
```

Make sure to configure your `.env` with RPC URLs, private keys, etc.

### 2. Frontend (React)

```bash
cd tokenhub-frontend
npm install
npm start
```

---

## 📍 Live Deployment

Frontend is deployed via **Vercel**:
👉 [https://token-hub-pi.vercel.app](https://token-hub-pi.vercel.app)

---

## 👨‍💻 Author

**Kaung Khant Lin** – Blockchain Developer & Full-Stack Engineer
🔗 [GitHub](https://github.com/KoKhant02)

---
