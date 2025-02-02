import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '../context/Web3Context';
import { Trophy, TrendingUp, Wallet, ArrowRight, Sparkles } from 'lucide-react';
import { ethers } from 'ethers';
import { LendingPool, ValeToken } from '../types/contracts';
import LendingPoolABI from '../abi/LendingPool.json';
import ValeTokenABI from '../abi/ValeToken.json';

export const BorrowingPage: React.FC = () => {
  const { address, signer } = useWeb3();
  const [tokenId, setTokenId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const mockValidatorInfo = {
    value: 32000,
    apr: 4.8,
    lastReward: 15.4
  };

  const LENDING_POOL_ADDRESS = '0x073df4e587eaAEf558bB7A90045C8A52De8B6C44';
  const VALE_TOKEN_ADDRESS = '0x09F29dF4Eca03aAaf199c7AAfe4c4DE3B062d334'; // Add the correct ValeToken address

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!tokenId) {
      setError('Please enter a Validator ID');
      return;
    }

    const validatorId = BigInt(tokenId);
    if (validatorId < 0n) {
      setError('Please enter a valid Validator ID number');
      return;
    }

    if (!signer || !address) {
      setError('Please connect your wallet');
      return;
    }

    setIsSubmitting(true);

    try {
      // First approve the LendingPool to use the NFT
      const valeToken = new ethers.Contract(
        VALE_TOKEN_ADDRESS,
        ValeTokenABI.abi,
        signer
      ) as unknown as ValeToken;

      // Check if you own the token
      try {
        const ownerOf = await valeToken.ownerOf(validatorId);
        console.log('Token owner:', ownerOf);
        console.log('Current address:', address);

        if (ownerOf.toLowerCase() !== address.toLowerCase()) {
          throw new Error('You do not own this validator NFT');
        }
      } catch (err) {
        console.error('Token ownership check error:', err);
        throw new Error('This validator NFT does not exist or you do not own it');
      }

      // Check approval with error handling
      try {
        console.log('Checking approval for token:', validatorId);
        const approvedAddress = await valeToken.getApproved(validatorId);
        console.log('Approved address:', approvedAddress);
        console.log('LendingPool address:', LENDING_POOL_ADDRESS);
        
        if (approvedAddress.toLowerCase() !== LENDING_POOL_ADDRESS.toLowerCase()) {
          console.log('Approving LendingPool to handle token...');
          
          const approveTx = await valeToken.approve(
            LENDING_POOL_ADDRESS,
            validatorId
          );
          
          console.log('Approval transaction sent:', approveTx.hash);
          const approveReceipt = await approveTx.wait();
          console.log('Approval transaction receipt:', approveReceipt);
          
          if (approveReceipt?.status === 0) {
            throw new Error('Approval transaction failed');
          }
          
          console.log('Approval successful');
        } else {
          console.log('Token already approved');
        }
      } catch (approvalErr: unknown) {
        console.error('Approval error:', approvalErr);
        const errorMessage = approvalErr instanceof Error 
          ? approvalErr.message 
          : 'Unknown error';
        throw new Error('Failed to approve token transfer: ' + errorMessage);
      }

      // Now proceed with borrowing
      const lendingPool = new ethers.Contract(
        LENDING_POOL_ADDRESS,
        LendingPoolABI.abi,
        signer
      ) as unknown as LendingPool;

      console.log('Attempting to borrow with:');
      console.log('- Validator ID:', validatorId);
      console.log('- Borrower address:', address);
      console.log('- LendingPool address:', LENDING_POOL_ADDRESS);

      const tx = await lendingPool.borrow(
        validatorId,
        address
      );

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);

      if (receipt?.status === 0) {
        throw new Error('Transaction failed');
      }

      console.log('Transaction confirmed');
      setTokenId('');
      alert('Successfully borrowed!');
    } catch (err: unknown) {
      console.error('Detailed error:', err);
      let errorMessage = 'Unknown error';
      if (typeof err === 'object' && err !== null) {
        if ('error' in err && typeof err.error === 'object' && err.error !== null) {
          errorMessage = (err.error as any).data?.message || (err.error as any).message || errorMessage;
        } else if ('message' in err) {
          errorMessage = (err as Error).message;
        }
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-2xl bg-zinc-900/50 border border-orange-500/10 backdrop-blur-sm"
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text">
              Connect Your Wallet
            </h2>
            <p className="text-gray-400 text-lg">
              Please connect your wallet to unlock interest-free borrowing.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-zinc-900 to-zinc-950">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-zinc-900/50 border border-orange-500/10 p-8 backdrop-blur-sm relative overflow-hidden"
        >
          {/* Floating background elements */}
          <motion.div
            className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-orange-500/5 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <div className="relative z-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text">
                Zero Interest Loans
              </h2>
              <p className="text-gray-400 text-lg">
                Deposit your validator NFT to access instant loans based on your staking rewards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-zinc-800/50 p-4 rounded-xl border border-orange-500/10 hover:border-orange-500/30 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-orange-400/20 to-orange-600/20">
                    <Wallet className="w-5 h-5 text-orange-400" />
                  </div>
                  <span className="text-gray-300">Validator Value</span>
                </div>
                <div className="text-2xl font-bold">{mockValidatorInfo.value.toLocaleString()} USDC</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-zinc-800/50 p-4 rounded-xl border border-orange-500/10 hover:border-orange-500/30 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-orange-400/20 to-orange-600/20">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                  </div>
                  <span className="text-gray-300">Current APR</span>
                </div>
                <div className="text-2xl font-bold text-orange-400">{mockValidatorInfo.apr}%</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-zinc-800/50 p-4 rounded-xl border border-orange-500/10 hover:border-orange-500/30 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-orange-400/20 to-orange-600/20">
                    <Trophy className="w-5 h-5 text-orange-400" />
                  </div>
                  <span className="text-gray-300">Last Reward</span>
                </div>
                <div className="text-2xl font-bold">{mockValidatorInfo.lastReward} USDC</div>
              </motion.div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Validator ID
                </label>
                <input
                  type="number"
                  value={tokenId}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow positive numbers
                    if (!value || Number(value) >= 0) {
                      setTokenId(value);
                    }
                  }}
                  className="w-full px-4 py-3 bg-zinc-800/50 rounded-lg border border-orange-500/20 focus:border-orange-500/50 focus:outline-none transition-colors [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter your Validator ID"
                  disabled={isSubmitting}
                  min="0"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Example: 123 (numeric Validator ID)
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 text-sm text-red-400 bg-red-900/30 rounded-lg border border-red-400/20"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="w-full px-6 py-3 rounded-lg font-medium text-white 
                         bg-gradient-to-r from-orange-400 to-orange-600
                         hover:shadow-lg hover:shadow-orange-500/25 
                         transition-all duration-300
                         relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 w-1/2 h-full translate-x-[-150%] group-hover:translate-x-[200%] transform-gpu bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out" />
                <span className="relative flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {isSubmitting ? 'Processing...' : 'Get Maximum Loan'}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};