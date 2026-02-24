import { useState } from 'react';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { CustomCursor } from './components/layout/CustomCursor';
import { Navbar } from './components/layout/Navbar';
import { Preloader } from './components/layout/Preloader';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Marquee } from './components/sections/Marquee';
import { Work } from './components/sections/Work';
import { Footer } from './components/sections/Footer';

function App() {
  useSmoothScroll();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      <CustomCursor />

      <main className={`relative bg-background text-primary ${isLoading ? 'h-screen overflow-hidden' : ''}`}>
        {!isLoading && <Navbar />}
        <Hero />
        <About />
        <Marquee />
        <Work />
      </main>

      {!isLoading && <Footer />}
    </>
  );
}

export default App;
