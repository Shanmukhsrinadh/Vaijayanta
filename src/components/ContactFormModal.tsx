import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactFormModal({ isOpen, onClose }: ContactFormModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    emailjs.init("Es-1PqvKO3CYG1B8g");
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const form = formRef.current;
    if (!form) return;

    const userName = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const userEmail = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const userPhone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim();
    const userMessage = (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!userName || !userEmail || !userMessage) {
      return setErrorMessage("⚠️ Please fill all required fields (Name, Email, and Message).");
    }
    if (!emailPattern.test(userEmail)) {
      return setErrorMessage("❌ Invalid email format. Please check your email address.");
    }
    if (userPhone && !phonePattern.test(userPhone)) {
      return setErrorMessage("❌ Invalid phone number. Please enter a 10-digit number.");
    }

    setLoading(true);

    try {
      const mailboxAPI = "f4fc95e2df9dda3405535446c83c86a0";
      const verifyResponse = await fetch(
        `https://apilayer.net/api/check?access_key=${mailboxAPI}&email=${userEmail}`
      );
      const data = await verifyResponse.json();
      if (!data.format_valid || !data.smtp_check) {
        setLoading(false);
        return setErrorMessage("❌ The provided email address does not exist or cannot receive messages.");
      }
    } catch {
      setLoading(false);
      return setErrorMessage("⚠️ Could not verify email address. Please try again later.");
    }

    if (userPhone) {
      try {
        const numVerifyAPI = "78c95356705a74edf974f3061a696550";
        const phoneResponse = await fetch(
          `https://apilayer.net/api/validate?access_key=${numVerifyAPI}&number=${userPhone}&country_code=IN&format=1`
        );
        const phoneData = await phoneResponse.json();
        if (!phoneData.valid) {
          setLoading(false);
          return setErrorMessage("❌ The provided phone number is invalid or does not exist.");
        }
      } catch {
        setLoading(false);
        return setErrorMessage("⚠️ Could not verify phone number. Please try again later.");
      }
    }

    try {
      await emailjs.send("service_589hpgk", "template_jpkit3m", {
        from_name: userName,
        from_email: userEmail,
        phone: userPhone || "Not provided",
        message: userMessage,
      });
      await emailjs.send("service_589hpgk", "template_m54vnzo", {
        from_name: userName,
        from_email: userEmail,
      });
      setSuccessMessage("✅ Message sent successfully!");
      form.reset();
      setTimeout(() => { setSuccessMessage(""); onClose(); }, 2000);
    } catch {
      setErrorMessage("⚠️ Failed to send your message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[110]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md max-h-[90vh] overflow-y-auto z-[111]"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-[#800020] mb-6">Get Expert Advice</h3>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 text-black">
              <input type="text" name="name" placeholder="Your Name *"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#800020] outline-none transition-all" />
              <input type="email" name="email" placeholder="Your Email *"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#800020] outline-none transition-all" />
              <input type="tel" name="phone" placeholder="Your Phone"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#800020] outline-none transition-all" />
              <textarea name="message" placeholder="Your Message *" rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#800020] outline-none transition-all resize-none" />
              {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
              {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-[#800020] text-white rounded-lg font-bold hover:bg-[#e8c547] hover:text-[#800020] transition-all shadow-lg disabled:opacity-50">
                {loading ? "Verifying & Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
