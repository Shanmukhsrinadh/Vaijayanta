import { memo, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "919550563283";
const PROMPTS = [
  "Looking for something specific?",
  "Chat with our expert to get the latest info on trending projects.",
  "Need help finding the right plot or project in Andhra Pradesh?",
  "Ask us about current offers, site visits, and fast-moving inventory.",
  "Want the best options in Visakhapatnam, Vizianagaram, Srikakulam, or Amaravathi?",
  "Message us for fresh updates on premium residential and commercial opportunities.",
];

const getRandomDelay = () => 120000 + Math.floor(Math.random() * 180000);

function WhatsAppFloatingChat() {
  const shouldReduceMotion = useReducedMotion();
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [activeMessage, setActiveMessage] = useState(PROMPTS[0]);
  const [isHiddenInModal, setIsHiddenInModal] = useState(false);
  const timeoutRefs = useRef<number[]>([]);

  useEffect(() => {
    const syncModalVisibility = () => {
      const shouldHide = document.body.style.overflow === "hidden";
      setIsHiddenInModal(shouldHide);
      if (shouldHide) setIsBubbleVisible(false);
    };
    syncModalVisibility();
    const observer = new MutationObserver(syncModalVisibility);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style", "class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const clearAllTimers = () => {
      timeoutRefs.current.forEach((timer) => window.clearTimeout(timer));
      timeoutRefs.current = [];
    };
    const schedulePrompt = (delay: number) => {
      const timer = window.setTimeout(() => {
        const nextMessage = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
        setActiveMessage(nextMessage);
        setIsBubbleVisible(true);
        const hideTimer = window.setTimeout(() => {
          setIsBubbleVisible(false);
          schedulePrompt(getRandomDelay());
        }, 9000);
        timeoutRefs.current.push(hideTimer);
      }, delay);
      timeoutRefs.current.push(timer);
    };
    schedulePrompt(8000);
    return clearAllTimers;
  }, []);

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hi, I am looking for more details about your real estate projects.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  if (isHiddenInModal) return null;

  return (
    <div className="fixed bottom-4 right-3 z-[120] sm:bottom-5 sm:right-5">
      <AnimatePresence>
        {isBubbleVisible && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: shouldReduceMotion ? 0.15 : 0.28, ease: "easeOut" }}
            className="mb-2 ml-auto w-[min(280px,calc(100vw-1.5rem))] rounded-[1.4rem] border border-[#e8c547]/30 bg-white/95 p-3 text-[#800020] shadow-[0_16px_42px_rgba(0,0,0,0.16)] backdrop-blur-md"
          >
            <div className="flex items-start gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-lg">
                <FaWhatsapp className="h-[18px] w-[18px]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#800020]/55">WhatsApp support</p>
                <p className="mt-1 text-[13px] font-semibold leading-5 text-[#800020]">{activeMessage}</p>
                <button type="button" onClick={openWhatsApp}
                  className="mt-2.5 inline-flex items-center rounded-full bg-[#800020] px-3.5 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-[#5f0018]">
                  Chat with us
                </button>
              </div>
              <button type="button" onClick={() => setIsBubbleVisible(false)}
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#800020]/65 transition-colors hover:bg-[#800020]/5 hover:text-[#800020]"
                aria-label="Dismiss WhatsApp message">
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        onClick={openWhatsApp}
        className="group ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_42px_rgba(37,211,102,0.38)] ring-4 ring-white/75 transition-transform hover:scale-105"
        animate={shouldReduceMotion ? undefined : { y: [0, -4, 0] }}
        transition={shouldReduceMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Open WhatsApp chat"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-20 blur-sm transition-opacity group-hover:opacity-35" />
        <FaWhatsapp className="relative h-7 w-7" />
      </motion.button>
    </div>
  );
}

export default memo(WhatsAppFloatingChat);
