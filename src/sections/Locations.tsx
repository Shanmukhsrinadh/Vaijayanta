import { memo, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { MapPin } from 'lucide-react';

const stableSpring = { type: "spring", stiffness: 100, damping: 20 };

const CITIES = [
  {
    id: 'visakhapatnam',
    name: 'Visakhapatnam',
    tagline: 'Upcoming Bhogapuram International Airport & IT corridors',
    badge: '🏆 Top Destination',
    highlights: ['Bhogapuram Zone', 'IT Corridor', 'Coastal Projects'],
  },
  {
    id: 'vizianagaram',
    name: 'Vizianagaram',
    tagline: 'Rich heritage city with high appreciation potential near NH16',
    badge: '📈 High Growth',
    highlights: ['NH-5 & NH-43', 'Near Airport', 'Emerging Hub'],
  },
  {
    id: 'srikakulam',
    name: 'Srikakulam',
    tagline: 'Coastal land opportunities and beach-side investment',
    badge: '🏖️ Coastal Gem',
    highlights: ['Beach Land', 'NH-16 Frontage', 'Growth Corridor'],
  },
  {
    id: 'amaravati',
    name: 'Amaravati',
    tagline: 'Capital city of Andhra Pradesh — strong future appreciation',
    badge: '🏛️ Capital City',
    highlights: ['Capital Region', 'IT Hub', 'Airport Proximity'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 15 },
  visible: { opacity: 1, x: 0, transition: stableSpring },
};

function Locations() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15, margin: '240px 0px' });

  // Track active city on hover to swap out the bottom informational card dynamically
  const [activeCity, setActiveCity] = useState(CITIES[0]);

  return (
    <section
      id="locations"
      className="py-24 bg-white overflow-hidden"
      ref={containerRef}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 760px' }}
    >
      <div className="container mx-auto px-6">

        {/* Header Section from Design System */}
        <div className="mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#800020]/10 rounded-full px-4 py-2 text-[#800020] text-xs font-bold uppercase tracking-widest mb-4">
            <MapPin size={12} /> Our Presence
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#800020] tracking-tight">
            Explore by City
          </h2>
        </div>

        {/* Core Split Layout Container */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">

          {/* LEFT COLUMN: Map View Frame */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.45 }}
            className="w-full lg:w-2/3 h-[500px] sm:h-[600px] rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 bg-gray-50 transform-gpu"
          >
            {isInView ? (
              <iframe
                title="We are spread across"
                aria-label="Map"
                src="https://datawrapper.dwcdn.net/NpwLf/3/"
                scrolling="no"
                frameBorder="0"
                loading="lazy"
                className="w-full h-full border-none"
              />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,_rgba(232,197,71,0.24),_transparent_30%),linear-gradient(135deg,_rgba(128,0,32,0.08),_rgba(255,255,255,0.95))]" />
            )}
          </motion.div>

          {/* RIGHT COLUMN: Interactive Control Panel */}
          <div className="w-full lg:w-1/3 h-[500px] sm:h-[600px]">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="bg-[#800020] p-8 sm:p-10 rounded-[2.5rem] shadow-xl text-white h-full flex flex-col justify-between transform-gpu"
            >
              <div>
                <h4 className="text-2xl sm:text-3xl font-bold mb-6 border-b border-white/10 pb-4">
                  Key Areas
                </h4>

                <ul className="space-y-4 sm:space-y-5 overflow-y-auto pr-2 custom-scrollbar">
                  {CITIES.map((city) => (
                    <motion.li
                      key={city.id}
                      variants={itemVariants}
                      onMouseEnter={() => setActiveCity(city)}
                    >
                      <Link
                        href={`/city/${city.id}`}
                        className="flex items-center justify-between cursor-pointer group py-1"
                        data-testid={`link-location-${city.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeCity.id === city.id ? 'bg-[#e8c547] scale-125 shadow-lg shadow-[#e8c547]/50' : 'bg-white/40 group-hover:bg-white'
                            }`} />
                          <span className={`text-xl sm:text-2xl font-medium tracking-tight transition-colors duration-200 ${activeCity.id === city.id ? 'text-[#e8c547]' : 'text-white/80 group-hover:text-white'
                            }`}>
                            {city.name}
                          </span>
                        </div>

                        {/* Dynamic mini-badge visibility next to items */}
                        <div className="w-[56px] flex justify-end">
                          {activeCity.id === city.id && (
                            <motion.span
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-[10px] bg-white/10 border border-white/20 px-2 py-0.5 rounded-md text-[#e8c547] font-medium"
                            >
                              Active
                            </motion.span>
                          )}
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* CONTEXT WIDGET: Updates data fluidly based on active city context */}
              <div className="mt-6 min-h-[140px] flex flex-col justify-between p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col h-full justify-between gap-3"
                  >
                    <div>
                      <div className="text-[10px] font-bold text-[#e8c547] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        {activeCity.badge}
                      </div>
                      <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-light line-clamp-2">
                        {activeCity.tagline}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {activeCity.highlights.map((h) => (
                        <span key={h} className="text-[9px] font-bold bg-white/10 text-white/90 px-2 py-0.5 rounded-md tracking-wide border border-white/5 whitespace-nowrap">
                          {h}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default memo(Locations);