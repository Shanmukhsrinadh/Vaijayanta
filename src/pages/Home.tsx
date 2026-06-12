import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../sections/Hero';
import Work from '../sections/Work';
import Locations from '../sections/Locations';
import Services from '../sections/Services';
import About from '../sections/About';
import Contact from '../sections/Contact';
import { useSmoothScroll } from '../hooks/use-smooth-scroll';

export default function Home() {
  useSmoothScroll({ enableInitialHashSync: true });

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Work />
        <Locations />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
