# ERC-20 Token dApp

## Overview
This project is a simple decentralized application (dApp) demonstrating how an ERC-20 token works on a local blockchain.

The project includes:
- **Backend:** Smart contract developed and deployed with Foundry
- **Frontend:** Minimalist web interface built with React (TypeScript)

## Features
-  **Create a Token** — Deploy your own ERC-20 contract
-  **View Token Info** — Display token name, symbol, and total supply
-  **Transfer Tokens** — Send tokens to other addresses
-  **Faucet** — Request free test tokens for local use

## Tech Stack
- **Smart Contract:** Solidity (ERC-20 standard)
- **Framework:** Foundry (Anvil local network)
- **Frontend:** React (TypeScript)
- **Wallet:** MetaMask (local network connection)

## Getting Started

### 1. Start local blockchain
```bash
anvil
```

### 2. Deploy the contract
```bash
forge create src/MyToken.sol:MyToken --private-key <PRIVATE_KEY>
forge create src/Token.sol:Token --rpc-url http://127.0.0.1:8545 --private-key <PRIVATE_KEY> --broadcast --constructor-args <Name> <Symbol> <InitialSupply>
```

### 3. Launch the frontend
```bash
npm install
npm run dev
```

Then open your browser at **http://localhost:5173/**

---

 *This project is for educational purposes to understand the basics of ERC-20 tokens and dApp architecture.*

