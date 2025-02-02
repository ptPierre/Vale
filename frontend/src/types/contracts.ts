import { ethers, BaseContract } from 'ethers';

export interface LendingPool extends BaseContract {
  borrow(tokenId: ethers.BigNumberish, borrower: string): Promise<ethers.ContractTransactionResponse>;
  estimateGas: {
    borrow(tokenId: ethers.BigNumberish, borrower: string): Promise<bigint>;
  };
  // Add other contract functions as needed
}

export interface ValeToken extends BaseContract {
  approve(to: string, tokenId: ethers.BigNumberish): Promise<ethers.ContractTransactionResponse>;
  getApproved(tokenId: ethers.BigNumberish): Promise<string>;
  ownerOf(tokenId: ethers.BigNumberish): Promise<string>;
  estimateGas: {
    approve(to: string, tokenId: ethers.BigNumberish): Promise<bigint>;
  };
} 