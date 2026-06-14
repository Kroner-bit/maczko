import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Portfolio from './components/Portfolio';
import FacebookPosts from './components/FacebookPosts';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './components/Login';
import Admin from './components/Admin';
import MaltaServices from './components/MaltaServices';
import ProjectDetail from './components/ProjectDetail';
import FloatingContactButton from './components/FloatingContactButton';
import { useAnalytics } from './hooks/useAnalytics';
import { LanguageProvider } from './LanguageContext';

function AnalyticsTracker() {
  useAnalytics();
  return null;
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
        <About />
        <Portfolio />
        <FacebookPosts />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-light text-dark selection:bg-primary selection:text-white">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/malta-services" element={<MaltaServices />} />
            <Route path="/project/:slug" element={<ProjectDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <FloatingContactButton />
          <AnalyticsTracker />
        </div>
      </Router>
    </LanguageProvider>
  );
}
