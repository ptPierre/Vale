import { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Home, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
          {/* Dynamic Background */}
          <motion.div 
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-zinc-900 to-zinc-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* Animated geometric pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(251, 146, 60, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(251, 146, 60, 0.1) 0%, transparent 50%)
              `
            }}
          />

          {/* Animated grid lines */}
          <div 
            className="absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(251, 146, 60, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(251, 146, 60, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px'
            }}
          />

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

          {/* Content */}
          <div className="relative z-10 text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-orange-400/10 text-orange-400 ring-1 ring-inset ring-orange-400/20">
                <AlertTriangle className="w-4 h-4 mr-2" />
                500 Error
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-6xl sm:text-8xl font-bold mb-6 tracking-tight"
            >
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-transparent bg-clip-text">
                  Something Went Wrong
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
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
            >
              We apologize for the inconvenience. Please try refreshing the page or return home.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link 
                to="/"
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
                  inline-flex
                "
              >
                <div className="absolute inset-0 w-1/2 h-full translate-x-[-150%] group-hover:translate-x-[200%] transform-gpu bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out" />
                <Home className="w-5 h-5 transition-transform group-active:scale-95" />
                <span className="relative">Return Home</span>
              </Link>
            </motion.div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;