import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

const properties = [
  {
    id: "visakhapatnam",
    title: "Visakhapatnam",
    image: "https://i.pinimg.com/736x/62/fe/ca/62feca9b615b4eb301797196304200c7.jpg",
    href: "/city/visakhapatnam",
  },
  {
    id: "vizianagaram",
    title: "Vizianagaram",
    image: "https://i.pinimg.com/736x/02/9c/64/029c640f16b3dea8e9cf41769d1afdd7.jpg",
    href: "/city/vizianagaram",
  },
  {
    id: "Srikakulam",
    title: "Srikakulam",
    image: "https://i.pinimg.com/736x/f8/d5/e3/f8d5e3141c75d35904afa33d95702d0c.jpg",
    href: "/city/Srikakulam",
  },
  {
    id: "Amaravati",
    title: "Amaravati",
    image: "https://i.pinimg.com/1200x/45/a6/64/45a664bb07d2ec47774115bea471a5d2.jpg",
    href: "/city/Amaravati",
    hidden: true, // Marker for our baseline desktop cutoff
  },
];

function Work() {
  const [showMore, setShowMore] = useState(false);

  return (
    <section
      id="properties"
      className="py-20 bg-[#f9f9f9]"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 980px' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold text-[#800020] mb-4">We Offer</h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked selection of premium properties across the most desirable neighborhoods.
          </p>
        </div>

        {/* Keeping your exact grid rules responsive setups */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {properties.map((property, index) => {
              
              // Determine visibility dynamically using CSS classes instead of JS array filtering
              let classes = "block";
              
              if (property.hidden && !showMore) {
                // On mobile (1 col) and desktop (3 cols), the 4th item is hidden initially.
                // On tablet (sm to lg screens - 2 cols), we force it visible to occupy the empty gap!
                classes = "hidden sm:block lg:hidden";
              }

              return (
                <Link 
                  key={property.id} 
                  href={property.href} 
                  className={classes} 
                  data-testid={`link-property-${property.id}`}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.28, delay: index * 0.04 }}
                    className="group relative h-[320px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl cursor-pointer transition-transform duration-300 md:hover:-translate-y-2"
                  >
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                    />

                    <div className="absolute inset-0 flex flex-col justify-end items-center p-6 text-center bg-gradient-to-t from-black/80 via-black/40 to-transparent md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-500 ease-in-out will-change-transform">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{property.title}</h3>

                      <span className="px-6 py-2 bg-[#e8c547] text-[#800020] rounded-full font-semibold transition-all hover:bg-[#800020] hover:text-white md:opacity-0 md:group-hover:opacity-100">
                        Explore
                      </span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Dynamic button container: Closes layout gaps and hides itself when a clean grid row is already achieved */}
        <div className={`text-center mt-12 ${showMore ? 'block' : 'sm:hidden lg:block'}`}>
          <button
            onClick={() => setShowMore((previous) => !previous)}
            className="px-8 py-3 bg-[#800020] text-white rounded-full font-semibold transition-all hover:bg-[#e8c547] hover:text-[#800020]"
            data-testid="button-toggle-properties"
          >
            {showMore ? "Show Less" : "Show More"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default memo(Work);