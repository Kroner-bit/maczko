import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { LanguageProvider } from './LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-light text-dark selection:bg-primary selection:text-white">
        <Navbar />
        <main>
          <Hero />
          <Services />
          <About />
          <Portfolio />
          <Contact />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
