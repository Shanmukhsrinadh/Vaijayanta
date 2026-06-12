import { memo, useMemo, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

const TextRevealComponent = ({ children, className = "", delay = 0 }: TextRevealProps) => {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  const animate = useMemo(() => {
    if (shouldReduceMotion) return { opacity: 1, y: 0 };
    return isInView ? { y: 0 } : undefined;
  }, [isInView, shouldReduceMotion]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={shouldReduceMotion ? false : { y: "100%" }}
        animate={animate}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.8,
          ease: [0.33, 1, 0.68, 1],
          delay,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export const TextReveal = memo(TextRevealComponent);
