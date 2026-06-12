import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const STATS = [
  { value: '15+', label: 'Years of Experience' },
  { value: '500+', label: 'Plots Sold' },
  { value: '4', label: 'Cities Covered' },
  { value: '100%', label: 'RERA Certified Projects' },
];

const POINTS = [
  'Trusted real estate partner in North Andhra Pradesh since 2010',
  'Specializing in RERA-approved residential & commercial plots',
  'Strong network across Visakhapatnam, Vizianagaram, Srikakulam & Amaravati',
  'Transparent pricing with zero hidden charges',
  'Dedicated support from site visit to registration',
  'Bank-loan facilitation with leading financial institutions',
];

export default function About() {
  return (
    <section className="py-20 md:py-28 bg-white overflow-x-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#800020]/10 rounded-full px-4 py-2 text-[#800020] text-xs font-bold uppercase tracking-widest mb-6">
              About Us
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#800020] tracking-tight mb-6 leading-tight">
              Your Trusted Partner in<br />
              <span className="text-gray-800">Real Estate</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              VisakhaProperties has been helping families and investors find their perfect plot in Andhra Pradesh for over 15 years. We combine deep local knowledge with transparent processes to deliver exceptional results.
            </p>
            <ul className="space-y-3">
              {POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#e8c547] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="bg-gray-50 rounded-3xl p-8 text-center border border-gray-100">
                  <div className="text-4xl font-black text-[#800020] mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Image */}
            <div className="relative rounded-3xl overflow-hidden h-64">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"
                alt="Real Estate Team"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#800020]/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <p className="text-2xl font-black">Building Futures</p>
                  <p className="text-white/80 text-sm">One Plot at a Time</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
