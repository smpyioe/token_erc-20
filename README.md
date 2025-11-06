# ERC-20 Token Factory dApp

##  Overview
This is a **training project** built to learn and practice blockchain development with **Foundry** and **React**. It's a decentralized application (dApp) that allows users to create and manage their own ERC-20 tokens on a local blockchain.

>  **Note:** This is a learning project — it's not production-ready and may contain imperfections. The goal is to understand the fundamentals of smart contract development and dApp architecture.

##  Features
-  **Token Factory** — Deploy multiple ERC-20 tokens from a single factory contract
-  **Token Dashboard** — View all your deployed tokens in a table
-  **Balance Checker** — Check token balance for any address
-  **Transfer Tokens** — Send tokens to other addresses
-  **Faucet** — Mint free tokens for testing purposes
-  **Multiple Wallet Options** — Connect via MetaMask or private key

##  Tech Stack
- **Smart Contracts:** Solidity (ERC-20 standard + Factory pattern)
- **Development Framework:** Foundry (Forge, Anvil)
- **Frontend:** React + TypeScript + Vite
- **Web3 Library:** ethers.js v6
- **Styling:** Tailwind CSS
- **Local Blockchain:** Anvil (part of Foundry)

## Project Structure
```
erc_20_token/
├── backend/
│   ├── src/
│   │   ├── Token.sol           # ERC-20 token contract
│   │   └── TokenFactory.sol    # Factory to deploy tokens
│   ├── foundry.toml
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── App.tsx             # Main React component
│   │   ├── artifacts/          # Compiled contract ABIs
│   │   └── ...
│   ├── package.json
│   └── ...
└── README.md
```

##  Getting Started

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed
- [Node.js](https://nodejs.org/) (v16+) and npm/yarn
- [MetaMask](https://metamask.io/) browser extension (optional)

### 1 Start Local Blockchain (Anvil)
Open a terminal and run:
```bash
anvil
```
This will start a local Ethereum node at `http://127.0.0.1:8545` with 10 pre-funded accounts.

>  **Tip:** Keep this terminal open while developing. Anvil will display account addresses and private keys you can use for testing.

### 2 Deploy the Token Factory Contract
Open a new terminal in the `backend` folder and run:
```bash
cd backend
forge create src/TokenFactory.sol:TokenFactory \
  --rpc-url http://127.0.0.1:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast
```

**Important:** Copy the `Deployed to:` address from the output. You'll need to update this address in the frontend.

Example output:
```
Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3  ← Copy this!
Transaction hash: 0x...
```

### 3 Update Factory Address in Frontend
Open `frontend/src/App.tsx` and update the factory address (line ~11):
```typescript
const contractTokenFacotryAddress = "0xYOUR_DEPLOYED_ADDRESS_HERE";
```

### 4 Copy Contract ABIs to Frontend
Run the automated script to copy the compiled ABIs:
```bash
# From the frontend folder
cd frontend
node script/copyArtifacts.js
```

This script will automatically copy `Token.json` and `TokenFactory.json` from the backend build output to `frontend/src/artifacts/`.

### 5 Install Frontend Dependencies and Launch
```bash
cd frontend
npm install
npm run dev
```

Open your browser at **http://localhost:5173/**

## Connecting Your Wallet

### Option 1: MetaMask (Recommended)
1. Click **"Connect Metamask"**
2. Add the local network to MetaMask:
   - **Network Name:** Anvil Local
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** ETH
3. Import one of the Anvil accounts using its private key (displayed in the Anvil terminal)

### Option 2: Private Key
1. Click **"Connect Private Key"**
2. Paste one of the private keys from the Anvil terminal output
3. Example key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

## How to Use

### Creating a Token
1. Connect your wallet
2. Fill in the token details:
   - **Name:** e.g., "My Token"
   - **Symbol:** e.g., "MTK"
   - **Supply:** e.g., 1000 (will be multiplied by 10^18)
3. Click **"Deploy Token"**
4. Wait for the transaction confirmation
5. Your token will appear in the table below

### Managing Tokens
Once deployed, you can interact with each token:

- **Balance Of** — Check how many tokens any address holds
- **Transfer** — Send tokens to another address
- **Faucet** — Mint new tokens to your wallet (for testing)

##  Testing with Cast (Optional)

You can also interact with the contracts via command line:

```bash
# Create a token via factory
cast send 0xFACTORY_ADDRESS \
  "createToken(string,string,uint256)" "TestToken" "TST" 1000 \
  --rpc-url http://127.0.0.1:8545 \
  --private-key YOUR_PRIVATE_KEY

# Get your tokens
cast call 0xFACTORY_ADDRESS \
  "getMyTokens()" \
  --rpc-url http://127.0.0.1:8545 \
  --from YOUR_ADDRESS
```


##  Learning Resources
- [Foundry Book](https://book.getfoundry.sh/)
- [OpenZeppelin ERC-20](https://docs.openzeppelin.com/contracts/4.x/erc20)
- [ethers.js Documentation](https://docs.ethers.org/v6/)
- [Solidity by Example](https://solidity-by-example.org/)

##  What I Learned
- Smart contract development with Solidity
- Factory pattern for deploying multiple contracts
- Testing with Foundry and Anvil
- Frontend integration with ethers.js
- Wallet connection (MetaMask + private key)
- Transaction handling and receipt parsing

##  Disclaimer
This project is for **educational purposes only**. It's not audited and should **never be used in production** or on mainnet. Always conduct thorough security audits before deploying smart contracts with real value.

##  License
MIT License - Feel free to use this project for learning purposes.

