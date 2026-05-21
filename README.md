# Lesela Medical Center • Decentralized Crowdfunding Campaign

A fully decentralized crowdfunding platform built for **Lesela Medical Center** to raise medical development funds transparently. This workspace is split into a **Solidity Smart Contract backend** managed via Truffle, and a **Vite + React + TypeScript frontend** using Ethers.js (v6).

```
                 [ Web3 Browser / MetaMask ]
                            │
               React Frontend (Ethers.js v6)
                            │
       ┌────────────────────┴────────────────────┐
       ▼                                         ▼
Ganache / Local EVM Node               Sepolia / Ethereum Mainnet
(Truffle Deployment)                 (Live Crowdfund Smart Contract)
```

---

## 🏗️ Project Architecture

```
├── contracts/               # Solidity Smart Contracts
│   └── CrowdFund.sol        # Fundraising & owner withdrawal logic
├── migrations/              # Truffle deployment scripts
├── test/                    # Contract integration test suite
├── truffle-config.js        # Compiler & network settings for Truffle
└── frontend/                # Client Application
    ├── src/
    │   ├── components/      # UI components (Hero, Mission, WalletConnect, DonateModal)
    │   ├── hooks/           # useWeb3.tsx (Provider, signer, reactivity)
    │   ├── contract/        # Contract ABI and configuration (addresses)
    │   └── styles/          # Tailwind and global layout styles
```

---

## 🔒 Smart Contract Specification (`CrowdFund.sol`)

The fundraising campaign relies on `CrowdFund.sol`, a lean, secure, and gas-efficient campaign registry.

### Core Variables
*   `address public owner`: The administrator authorized to claim collected funds.
*   `uint256 public goal`: Campaign fundraising target, stored precisely in `wei`.
*   `uint256 public raisedAmount`: Cumulative sum of all valid donations (in `wei`).

### Functions & Mechanics
*   `donate() public payable`: Allows any user to send Ether to the campaign. Triggers a state update and emits `DonationReceived(address donor, uint256 amount)`.
*   `withdraw() public`: Only executable by `owner`. Requires that `raisedAmount >= goal` (all-or-nothing threshold safety) and that the contract holds a positive balance.
*   `getProgressPercentage() public view returns (uint256)`: Computes the precise percentage integer toward the funding goal.

---

## 🚀 Local Development Setup

Follow these steps to deploy the contract locally and launch the frontend development server.

### 1. Smart Contract Deployment (Truffle)

Ensure you have [Truffle](https://trufflesuite.com/) and a local Ethereum environment like [Ganache](https://trufflesuite.com/ganache/) running.

```bash
# 1. Install workspace dependencies
npm install

# 2. Compile smart contracts
npx truffle compile

# 3. Deploy to local network (make sure Ganache is running on port 7545 / 8545)
npx truffle migrate --reset

# 4. (Optional) Run tests
npx truffle test
```

### 2. Frontend Application Setup

Navigate to the `frontend/` directory to configure and run the client.

```bash
# 1. Enter the frontend workspace
cd frontend

# 2. Install dependencies
npm install

# 3. Spin up the Vite dev server
npm run dev
```

*The Vite server will launch at `http://localhost:5173/`.*

---

## 🧩 How the Web3 Integration Works

Rather than polling the chain or relying on hardcoded state, the frontend communicates reactively with the EVM via `frontend/src/hooks/useWeb3.tsx`:

*   **MetaMask Integration**: Automatically listens for account (`accountsChanged`) and network changes to maintain session stability.
*   **Decoupled State**: Uses standard Ethers.js v6 providers and signers. Converts raw wei format variables into human-readable ether quantities natively.
*   **Automatic Updates**: Listens to smart contract events (`DonationReceived`) live to update the UI progress bar and donors list in real-time as transactions settle on-chain.
