import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '../context/Web3Context';
import { Info, Trophy, TrendingUp, Wallet, ArrowRight, Sparkles } from 'lucide-react';

export const BorrowingPage: React.FC = () => {
  const { address } = useWeb3();
  const [tokenId, setTokenId] = useState('');
  const [requestedAmount, setRequestedAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const mockValidatorInfo = {
    value: 32000,
    apr: 4.8,
    lastReward: 15.4
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!tokenId) {
      setError('Please enter a Validator NFT Token ID');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5001/validator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          validator_id: tokenId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit validator');
      }

      const data = await response.json();
      alert(data.message);
      setTokenId('');
      setRequestedAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
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
                  Validator NFT Token ID
                </label>
                <input
                  type="number"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800/50 rounded-lg border border-orange-500/20 focus:border-orange-500/50 focus:outline-none transition-colors [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter your vNFT token ID"
                  disabled={isSubmitting}
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Loan Amount (USDC)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-800/50 rounded-lg border border-orange-500/20 focus:border-orange-500/50 focus:outline-none transition-colors [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Max amount: 3072 USDC"
                    disabled={isSubmitting}
                  />
                  <div className="absolute right-3 top-3 text-gray-400 group">
                    <Info className="w-5 h-5 cursor-help" />
                    <motion.div
                      className="absolute right-0 bottom-full mb-2 w-48 p-2 text-xs bg-zinc-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-orange-500/20"
                      initial={{ y: 5 }}
                      animate={{ y: 0 }}
                    >
                      Based on your validator's performance and historical rewards
                    </motion.div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Maximum loan amount based on your validator's performance: 3072 USDC
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
                  {isSubmitting ? 'Processing...' : 'Get Interest-Free Loan'}
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