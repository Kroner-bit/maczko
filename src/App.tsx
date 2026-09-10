import React, { useEffect, Suspense, Component, type ReactNode, type ErrorInfo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Portfolio from './components/Portfolio';
import FacebookPosts from './components/FacebookPosts';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingContactButton from './components/FloatingContactButton';
import { LanguageProvider } from './LanguageContext';

// Lazy-loaded routes — these chunks are only downloaded when the user navigates to them.
// This removes Admin (75KB), Swiper, Login, MaltaServices, CallbackPage, and ProjectDetail
// from the critical initial bundle.
const Login = React.lazy(() => import('./components/Login'));
const Admin = React.lazy(() => import('./components/Admin'));
const MaltaServices = React.lazy(() => import('./components/MaltaServices'));
const ProjectDetail = React.lazy(() => import('./components/ProjectDetail'));
const CallbackPage = React.lazy(() => import('./components/CallbackPage'));

// Lightweight loading fallback for lazy-loaded routes
function RouteLoadingFallback() {
  return (
    <div className="min-h-screen bg-light flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Top-level error boundary to prevent the entire app from crashing
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-light flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-dark mb-2">Hiba történt</h2>
            <p className="text-dark/60 mb-6">Sajnáljuk, váratlan hiba lépett fel. Kérjük, frissítse az oldalt.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-dark transition-colors"
            >
              Oldal frissítése
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [hash]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <About />
        <Contact />
        <FacebookPosts />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-light text-dark selection:bg-primary selection:text-white">
            <Suspense fallback={<RouteLoadingFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/visszahivas" element={<CallbackPage />} />
                <Route path="/malta-services" element={<MaltaServices />} />
                <Route path="/project/:slug" element={<ProjectDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
            <FloatingContactButton />
          </div>
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
