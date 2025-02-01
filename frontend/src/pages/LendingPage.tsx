import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '../context/Web3Context';
import { Coins, Info, Lock, TrendingUp } from 'lucide-react';

export const LendingPage: React.FC = () => {
  const { address } = useWeb3();
  const [depositAmount, setDepositAmount] = useState('');
  const MIN_DEPOSIT = 100;

  if (!address) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400">
            Please connect your wallet to start earning interest on your deposits.
          </p>
        </div>
      </div>
    );
  }

  const lendingStats = {
    apy: 5.2,
    totalDeposits: 24500,
    interestEarned: 345.50
  };

  return (
    <div className="min-h-screen pt-24 px-4 bg-gradient-to-b from-zinc-900 to-zinc-950">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-zinc-900/50 border border-orange-500/10 p-8 backdrop-blur-sm"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text">
              Earn Interest on USDC
            </h2>
            <p className="text-gray-400">
              Deposit USDC and earn competitive interest rates with 30-day minimum locked terms.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-zinc-800/50 p-4 rounded-xl border border-orange-500/10 hover:border-orange-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">APY</span>
              </div>
              <div className="text-2xl font-bold text-orange-400">{lendingStats.apy}%</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-zinc-800/50 p-4 rounded-xl border border-orange-500/10 hover:border-orange-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <Coins className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">Total Deposited</span>
              </div>
              <div className="text-2xl font-bold">{lendingStats.totalDeposits.toLocaleString()} USDC</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-zinc-800/50 p-4 rounded-xl border border-orange-500/10 hover:border-orange-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <Lock className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">Lock Period</span>
              </div>
              <div className="text-2xl font-bold">30 Days</div>
            </motion.div>
          </div>

          <form className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Deposit Amount (USDC)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800/50 rounded-lg border border-orange-500/20 focus:border-orange-500/50 focus:outline-none transition-colors"
                  placeholder={`Minimum ${MIN_DEPOSIT} USDC`}
                  min={MIN_DEPOSIT}
                />
                <div className="absolute right-3 top-3 text-gray-400 group">
                  <Info className="w-5 h-5 cursor-help" />
                  <div className="absolute right-0 bottom-full mb-2 w-48 p-2 text-xs bg-zinc-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    Funds are locked for 30 days
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Minimum deposit: {MIN_DEPOSIT} USDC - Locked for 30 days
              </p>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg font-medium text-white 
                       bg-gradient-to-r from-orange-400 to-orange-600
                       hover:shadow-lg hover:shadow-orange-500/25 
                       transition-all duration-300
                       relative overflow-hidden group"
              disabled={!depositAmount || Number(depositAmount) < MIN_DEPOSIT}
            >
              <div className="absolute inset-0 w-1/2 h-full translate-x-[-150%] group-hover:translate-x-[200%] transform-gpu bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out" />
              <span className="relative">Deposit & Start Earning</span>
            </button>

            <div className="text-center text-gray-400 text-sm">
              <p>Estimated Daily Earnings: ${((Number(depositAmount || 0) * lendingStats.apy) / 36500).toFixed(2)}</p>
              <p className="mt-1">Total after 30 days: ${(Number(depositAmount || 0) + (Number(depositAmount || 0) * lendingStats.apy * 30) / 36500).toFixed(2)}</p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};