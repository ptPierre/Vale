# Vale - Zero-Interest Lending for Tokenized Validators



Vale enables Tokenized Validator holders to access immediate liquidity through zero-interest loans while letting lenders earn staking rewards.

![Vale home page](home.jpg)!
![Vale home page](home2.jpg)

## 🌟 Overview

Vale solves the liquidity problem for staked ETH:
- Borrow against your Validator NFT without interest
- Get immediate liquidity without unstaking
- Earn staking rewards as a lender
- Protection against slashing risks

## 💡 How It Works

**For Borrowers:**
- Deposit your Validator NFT as collateral
- Borrow up to 84% of its value in USDC (e.g., 27 ETH worth for a 32 ETH NFT)
- Repay the same amount to get your NFT back

![Vale borrower page](borrow.jpg)

**For Lenders:**
- Deposit funds into the ERC4626 vault
- Receive tokens representing your pool share
- Earn a portion of staking rewards from NFTs

![Vale lender page](lend.jpg)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Python 3.8+
- Hardhat
- Metamask

### Setup

1. Configure environment variables
```bash
cp hardhat/.env.example hardhat/.env
cp python/.env.example python/.env
```

2. Frontend
```bash
cd frontend
npm install
npm run dev
```

3. Smart Contracts
```bash
cd hardhat
npm install
npx hardhat compile
```

Oracle Contract (Goerli): `0x751FcE6b427d4b27A8a8AF0269bc392242f77008`

4. Python Backend
```bash
cd python
pip install -r requirements.txt
python3 main.py
```
