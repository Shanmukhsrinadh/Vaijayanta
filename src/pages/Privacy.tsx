import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose prose-lg max-w-none">
          <h1 className="text-5xl font-black text-[#800020] mb-8 tracking-tighter">Privacy Policy</h1>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed">We collect information that you provide directly to us through contact forms, phone calls, and emails. This may include your name, email address, phone number, and property preferences.</p>
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">2. How We Use Information</h2>
            <p className="text-gray-600 leading-relaxed">We use the information we collect to respond to your inquiries, provide property updates, and improve our services. We do not sell your personal information to third parties.</p>
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">3. Data Protection Statement</h2>
            <p className="text-gray-600 leading-relaxed">We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or destruction.</p>
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">4. Cookie Usage</h2>
            <p className="text-gray-600 leading-relaxed">We use cookies to enhance your browsing experience and analyze website traffic. For more details, please refer to our Cookie Policy.</p>
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">5. User Rights</h2>
            <p className="text-gray-600 leading-relaxed">You have the right to access, correct, or delete your personal data. To exercise these rights, please contact us using the details provided below.</p>
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">6. Contact Details</h2>
            <p className="text-gray-600 leading-relaxed">For any privacy-related concerns, reach out to us at privacy@visakhaproperties.com.</p>
          </section>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
