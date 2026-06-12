import { createElement, memo, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { TextReveal } from "../components/TextReveal";
import { useSmoothScroll } from "../hooks/use-smooth-scroll";

const snappySpring = { type: "spring" as const, stiffness: 90, damping: 18, mass: 1 };

function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [isSplineReady, setIsSplineReady] = useState(false);
  const [supportsWebGL, setSupportsWebGL] = useState(true);
  const { scrollToSection } = useSmoothScroll();

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const webgl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    setSupportsWebGL(Boolean(webgl));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) setHasEnteredView(true);
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!supportsWebGL || !hasEnteredView || typeof window === "undefined") return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    let isActive = true;
    let idleHandle: number | undefined;
    let timerHandle: number | undefined;

    const loadSpline = async () => {
      await import("@splinetool/viewer");
      if (isActive) setIsSplineReady(true);
    };

    const w = window as typeof window & {
      requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (w.requestIdleCallback) {
      idleHandle = w.requestIdleCallback(() => void loadSpline(), { timeout: 1500 });
    } else {
      timerHandle = window.setTimeout(() => void loadSpline(), 250);
    }

    return () => {
      isActive = false;
      if (typeof idleHandle === "number" && w.cancelIdleCallback) w.cancelIdleCallback(idleHandle);
      if (typeof timerHandle === "number") window.clearTimeout(timerHandle);
    };
  }, [hasEnteredView, supportsWebGL]);

  const showSpline = supportsWebGL && isSplineReady && isVisible;

  return (
    <section
      ref={sectionRef}
      className="relative h-[100dvh] flex items-center overflow-hidden bg-[#4C4C4C] pt-16 md:pt-20 select-none"
    >
      {/* Background layer */}
      <div className="absolute inset-0 z-0 pointer-events-none transform-gpu">
        {showSpline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="w-full h-full hidden md:block"
          >
            {createElement("spline-viewer", {
              url: "https://prod.spline.design/vkfVHlrnySLu-MjD/scene.splinecode",
              className:
                "absolute top-1/2 right-[-28%] translate-y-[-50%] scale-[1.2] origin-center-right w-full h-full",
            })}
          </motion.div>
        )}
        {/* Static image fallback: always on mobile, shown on desktop until Spline loads */}
        {!showSpline && (
          <div className="absolute inset-0 bg-[url('https://shanmukhsrinadh.github.io/Vizvilla/imgs/Herobg.png')] bg-cover bg-center opacity-70 md:opacity-55" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Foreground content */}
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={snappySpring}
          className="max-w-[600px] text-white flex flex-col gap-4 transform-gpu"
        >
          <h1 className="text-[clamp(1.8rem,4vw+0.5rem,3.5rem)] font-bold leading-[1.2]">
            <TextReveal>Premium Properties in</TextReveal>
            <span className="text-[#e8c547] block">
              <TextReveal delay={0.1}>Andhra Pradesh</TextReveal>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-[clamp(1rem,2vw+0.3rem,1.4rem)]"
          >
            Discover the best residential and commercial properties.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mt-4"
          >
            <span className="text-sm opacity-80">In association with</span>
            <img
              src="https://bbgindia.com/assets/images/logo/5.png"
              alt="BBG Logo"
              className="h-[clamp(30px,5vw,45px)] opacity-90"
              fetchPriority="high"
              decoding="async"
            />
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4 mt-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ...snappySpring }}
          >
            <motion.a
              href="#properties"
              onClick={(e) => scrollToSection(e, "/#properties")}
              whileHover={shouldReduceMotion ? undefined : { y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-[#e8c547] text-[#800020] rounded-full text-lg font-bold shadow-xl shadow-black/10 w-full sm:w-auto text-center cursor-pointer"
            >
              Explore Properties
            </motion.a>

            <motion.a
              href="#contact"
              onClick={(e) => scrollToSection(e, "/#contact")}
              whileHover={shouldReduceMotion ? undefined : { y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-white/10 border border-white/15 text-white rounded-full text-lg font-bold hover:bg-white/20 w-full sm:w-auto text-center cursor-pointer"
            >
              Contact Us
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
          >
            <span className="text-white text-sm mb-2 opacity-70 tracking-wide">Scroll Down</span>
            <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center items-start p-1">
              <motion.div
                className="w-1.5 h-1.5 bg-white rounded-full"
                animate={shouldReduceMotion ? undefined : { y: [0, 12, 0] }}
                transition={
                  shouldReduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                }
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default memo(Hero);
