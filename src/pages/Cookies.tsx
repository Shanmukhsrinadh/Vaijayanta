import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Cookies() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose prose-lg max-w-none">
          <h1 className="text-5xl font-black text-[#800020] mb-8 tracking-tighter">Cookie Policy</h1>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">1. What Cookies Are</h2>
            <p className="text-gray-600 leading-relaxed">Cookies are small text files that are stored on your device when you visit a website. They help the website remember your preferences and improve your browsing experience.</p>
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">2. How We Use Cookies</h2>
            <p className="text-gray-600 leading-relaxed">We use cookies to understand how you interact with our website, save your preferences, and provide personalized content. We use both session cookies and persistent cookies.</p>
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">3. Managing Cookies</h2>
            <p className="text-gray-600 leading-relaxed">You can manage or disable cookies through your browser settings. However, please note that disabling certain cookies may affect the functionality of our website.</p>
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">4. Consent Explanation</h2>
            <p className="text-gray-600 leading-relaxed">By continuing to use our website, you consent to our use of cookies as described in this policy.</p>
          </section>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
