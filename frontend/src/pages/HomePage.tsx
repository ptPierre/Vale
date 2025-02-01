import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Coins, Percent, Wallet, PiggyBank } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { scrollY } = useScroll();
  
  // Effets de transformation basés sur le scroll
  const backgroundScale = useTransform(scrollY, [0, 1000], [1, 1.5]);
  const backgroundRotate = useTransform(scrollY, [0, 1000], [0, 45]);
  const backgroundOpacity = useTransform(scrollY, [0, 300], [0.8, 0]);

  const features = [
    {
      icon: <Percent className="w-8 h-8 text-orange-400" />,
      title: 'Earn Interest on USDC',
      description: 'Lend your USDC and earn competitive interest rates in the DeFi ecosystem',
    },
    {
      icon: <Shield className="w-8 h-8 text-orange-400" />,
      title: 'Zero Interest Loans',
      description: 'Access interest-free loans using your tokenized validators as collateral',
    },
    {
      icon: <Coins className="w-8 h-8 text-orange-400" />,
      title: 'Validator Collateral',
      description: 'Use your tokenized Ethereum validators as secure collateral for borrowing',
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background dynamique */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-orange-950/30"
          style={{
            scale: backgroundScale,
            rotate: backgroundRotate,
            opacity: backgroundOpacity,
          }}
        />

        {/* Motif géométrique animé */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(251, 146, 60, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(251, 146, 60, 0.1) 0%, transparent 50%)
            `,
            scale: backgroundScale,
          }}
        />

        {/* Lignes animées */}
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 95%, rgba(251, 146, 60, 0.1) 95%),
              linear-gradient(-45deg, transparent 95%, rgba(251, 146, 60, 0.1) 95%)
            `,
            backgroundSize: '60px 60px',
            opacity: useTransform(scrollY, [0, 300], [0.3, 0]),
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="text-orange-400 font-semibold text-lg">UNLOCK THE POWER OF YOUR VALIDATORS</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl sm:text-7xl font-bold mb-6 tracking-tight"
          >
            Access
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text"> 0% Interest</span>
            <br />
            Loans Today
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Leverage your tokenized Ethereum validators for interest-free borrowing, or provide liquidity to earn competitive yields
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex justify-center gap-6"
          >
            <Link 
              to="/borrowing"
              className="
                relative px-8 py-3
                font-medium text-white text-sm
                bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600
                hover:from-orange-500 hover:via-orange-600 hover:to-orange-700
                rounded-lg
                transition-all duration-200
                hover:shadow-lg hover:shadow-orange-500/25
                flex items-center space-x-2.5
                overflow-hidden
                group
              "
            >
              <div className="absolute inset-0 w-1/2 h-full translate-x-[-150%] group-hover:translate-x-[200%] transform-gpu bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out" />
              <Wallet className="w-4 h-4 transition-transform group-active:scale-95" />
              <span className="relative">Start Borrowing</span>
            </Link>
            <Link 
              to="/lending"
              className="
                relative px-8 py-3
                font-medium text-white text-sm
                bg-zinc-800
                hover:bg-zinc-700
                rounded-lg
                transition-all duration-200
                border border-zinc-700 hover:border-zinc-600
                flex items-center space-x-2.5
                overflow-hidden
                group
              "
            >
              <div className="absolute inset-0 w-1/2 h-full translate-x-[-150%] group-hover:translate-x-[200%] transform-gpu bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out" />
              <PiggyBank className="w-4 h-4 transition-transform group-active:scale-95" />
              <span className="relative">Start Lending</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-zinc-900/50" id="learn-more">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose Vale?</h2>
            <p className="text-gray-400">
              The perfect platform for USDC lending and zero-interest borrowing with validator collateral
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="p-6 rounded-2xl bg-zinc-800/50 border border-orange-500/10 hover:border-orange-500/30 transition-colors"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;