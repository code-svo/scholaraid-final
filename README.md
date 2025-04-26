# Onchain Scholarship Portal

A decentralized portal for managing scholarships and donations using blockchain technology.

## Features

- Connect to Base Sepolia testnet
- Make donations using ETH
- Apply for scholarships
- View recent donations
- Authentication system
- User profile and achievements

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Next, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


## Learn More

To learn more about OnchainKit, see our [documentation](https://onchainkit.xyz/getting-started).

To learn more about Next.js, see the [Next.js documentation](https://nextjs.org/docs).

## Deploying the Smart Contract

To use real ETH donations on Base Sepolia testnet, you need to deploy the scholarship contract.

### Prerequisites

1. Create a `.env` file in the project root with:

```
PRIVATE_KEY=your_private_key_here
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

2. Get Base Sepolia test ETH from the faucet: [https://sepolia-faucet.base.org/](https://sepolia-faucet.base.org/)

### Deploy Contract

```bash
npx hardhat run scripts/deploy.js --network base-sepolia
```

### Update Contract Address

Once deployed, update the contract address in `app/utils/contractUtils.ts`:

```typescript
export const contractAddress = "your_deployed_contract_address";
```

## Making Donations

To make donations, you need:

1. A web3 wallet (like MetaMask or Coinbase Wallet) connected to Base Sepolia testnet
2. Base Sepolia test ETH in your wallet

The application will automatically prompt you to switch to Base Sepolia network if needed.

## Verifying Contract

After deployment, you can verify your contract on BaseScan:

```bash
npx hardhat verify --network base-sepolia YOUR_CONTRACT_ADDRESS
```
