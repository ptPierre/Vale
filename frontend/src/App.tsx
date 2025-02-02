import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { LendingPage } from './pages/LendingPage';
import { BorrowingPage } from './pages/BorrowingPage';
import ErrorPage from './pages/ErrorPage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Web3Provider>
      <Router>
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/lending" element={<LendingPage />} />
                <Route path="/borrowing" element={<BorrowingPage />} />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </Router>
    </Web3Provider>
  );
}

export default App;