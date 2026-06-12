import { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Map, Building2, Trees, Landmark } from 'lucide-react';

const services = [
  { icon: Map, title: 'Premium Plots', description: 'Own strategically located premium plots with clear titles and excellent connectivity, perfect for building your dream home or securing a high-return investment.' },
  { icon: Building2, title: 'Luxury Flats', description: 'Experience modern living in thoughtfully designed luxury flats featuring world-class amenities, prime locations, and superior construction quality.' },
  { icon: Trees, title: 'Farm Lands', description: 'Invest in serene and fertile farm lands ideal for agriculture, weekend retreats, or long-term appreciation in rapidly developing regions.' },
  { icon: Landmark, title: 'Commercial Spaces', description: 'Premium commercial properties tailored for offices, retail stores, and businesses in high-growth zones with excellent infrastructure.' }
];

const stableSpring = { type: "spring", stiffness: 100, damping: 20 };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: stableSpring }
};

function Services() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1, margin: '180px 0px' });

  return (
    <section
      id="services"
      className="py-32 relative overflow-hidden bg-gray-50/50"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 920px' }}
    >
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-50/50 to-transparent -z-10 pointer-events-none" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={stableSpring}
          className="text-center mb-20 transform-gpu"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-gray-900">Our Services</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6 rounded-full" />
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover premium real estate opportunities designed to match your lifestyle and investment goals.
          </p>
        </motion.div>

        <motion.div
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transform-gpu"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 150, damping: 22 }}
              className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-red-800 rounded-xl flex items-center justify-center text-white mb-6 shadow-sm">
                  <service.icon size={26} />
                </div>
                <h3 className="text-xl font-bold mb-4 font-display text-gray-900">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default memo(Services);