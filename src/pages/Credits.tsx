import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const credits = [
  { name: "Prudhvi Chowdary", source: "Pinterest", image: "https://i.pinimg.com/736x/62/fe/ca/62feca9b615b4eb301797196304200c7.jpg", link: "https://in.pinterest.com/pin/905293962593902377/" },
  { name: "Pat Rudine", source: "Pinterest", image: "https://i.pinimg.com/736x/02/9c/64/029c640f16b3dea8e9cf41769d1afdd7.jpg", link: "https://in.pinterest.com/pin/448671181641253545/" },
  { name: "B.K.Viswanadh", source: "Pinterest", image: "https://i.pinimg.com/736x/f8/d5/e3/f8d5e3141c75d35904afa33d95702d0c.jpg", link: "https://in.pinterest.com/pin/381257924691416323/" },
];

export default function Credits() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black text-[#800020] mb-4 tracking-tighter">Image Credits</h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">We value creators! Below are the images used along with proper attribution.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {credits.map((credit, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 group">
                <div className="h-64 overflow-hidden">
                  <img src={credit.image} alt={credit.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" decoding="async" />
                </div>
                <div className="p-8">
                  <p className="text-xl font-bold text-[#800020] mb-1">{credit.name}</p>
                  <p className="text-gray-500 mb-4 text-sm font-medium">Source: <span className="font-bold text-[#e8c547]">{credit.source}</span></p>
                  <a href={credit.link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center text-[#800020] font-black uppercase tracking-widest text-xs hover:text-[#e8c547] transition-colors border-b-2 border-[#800020]/10 pb-1">
                    View Source
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-20 p-10 bg-[#800020]/5 rounded-[3rem] border border-[#800020]/10 text-center">
            <p className="text-[#800020] font-medium leading-relaxed italic max-w-3xl mx-auto">
              All third-party media credits are listed to avoid copyright issues. We value the contribution of independent photographers and digital artists.
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
