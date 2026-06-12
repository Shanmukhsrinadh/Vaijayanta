import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose prose-lg max-w-none">
          <h1 className="text-5xl font-black text-[#800020] mb-8 tracking-tighter">Terms of Use</h1>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">Welcome to VisakhaProperties. By accessing or using our website, you agree to comply with and be bound by these Terms of Use. If you do not agree, please do not use our services.</p>
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">2. Use of Website</h2>
            <p className="text-gray-600 leading-relaxed">You agree to use this website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website.</p>
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">3. Property Information Disclaimer</h2>
            <div className="bg-amber-50 border-l-4 border-[#e8c547] p-6 rounded-r-2xl mb-6">
              <p className="text-[#800020] font-bold italic">"All property details, prices, and availability are subject to change without prior notice. Images are for illustrative purposes only."</p>
            </div>
            <p className="text-gray-600 leading-relaxed">While we strive to provide accurate and up-to-date information, VisakhaProperties does not warrant the completeness or accuracy of any information on this site.</p>
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">4. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">VisakhaProperties shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.</p>
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">5. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">These terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Andhra Pradesh.</p>
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">6. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed">If you have any questions about these Terms, please contact us at support@visakhaproperties.com.</p>
          </section>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
