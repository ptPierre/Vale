import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Coins, Percent, Wallet, PiggyBank, ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { scrollY } = useScroll();
  
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Background */}
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-zinc-900 to-zinc-950"
          style={{
            scale: backgroundScale,
            rotate: backgroundRotate,
            opacity: backgroundOpacity,
          }}
        />

        {/* Animated geometric pattern */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(251, 146, 60, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(251, 146, 60, 0.1) 0%, transparent 50%)
            `,
            scale: backgroundScale,
          }}
        />

        {/* Animated grid lines */}
        <motion.div 
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(251, 146, 60, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(251, 146, 60, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
            transform: useTransform(scrollY, [0, 1000], ['scale(1) rotate(0deg)', 'scale(1.5) rotate(15deg)']),
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-orange-400/10 text-orange-400 ring-1 ring-inset ring-orange-400/20">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400"></span>
            </span>
            Now Live: 0% Interest Loans
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-6xl sm:text-8xl font-bold mb-6 tracking-tight"
        >
          Access  
          <span className="relative inline-block mx-5">
            <span className="relative z-10 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-transparent bg-clip-text">
              <span>0%</span>
              <span className="ml-3">Interest</span>
            </span>
            <motion.div
              className="absolute -inset-1 bg-orange-400/15 blur-lg"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.1, 1],
                borderRadius: [50]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </span>
          <br/>
          Loans Instantly
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
        >
          Access interest-free liquidity instantly using your Ethereum validators as collateral.
          No hidden fees, no compounding interest - ever.
        </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-6 items-center"
          >
            <Link 
              to="/borrowing"
              className="
                relative w-full sm:w-auto px-8 py-4
                font-medium text-white text-base
                bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600
                hover:from-orange-500 hover:via-orange-600 hover:to-orange-700
                rounded-lg
                transition-all duration-200
                hover:shadow-lg hover:shadow-orange-500/25
                flex items-center justify-center space-x-2.5
                overflow-hidden
                group
              "
            >
              <div className="absolute inset-0 w-1/2 h-full translate-x-[-150%] group-hover:translate-x-[200%] transform-gpu bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out" />
              <Wallet className="w-5 h-5 transition-transform group-active:scale-95" />
              <span className="relative">Start Borrowing</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              to="/lending"
              className="
                relative w-full sm:w-auto px-8 py-4
                font-medium text-white text-base
                bg-zinc-800/80
                hover:bg-zinc-700/80
                rounded-lg
                transition-all duration-200
                border border-zinc-700 hover:border-zinc-600
                flex items-center justify-center space-x-2.5
                backdrop-blur-sm
                group
              "
            >
              <PiggyBank className="w-5 h-5 transition-transform group-active:scale-95" />
              <span className="relative">Start Lending</span>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </motion.div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-orange-500/5 blur-3xl"
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
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-orange-400/5 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
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