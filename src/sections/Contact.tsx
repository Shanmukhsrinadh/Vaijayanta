import { memo, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
import emailjs from '@emailjs/browser';

function Contact() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    emailjs.init("Es-1PqvKO3CYG1B8g");
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const form = formRef.current;
    if (!form) return;

    const getFieldValue = (fieldName: string) => {
      const field = form.elements.namedItem(fieldName) as HTMLInputElement | HTMLTextAreaElement | null;
      return field?.value.trim() || "";
    };

    const userName = getFieldValue('name');
    const userEmail = getFieldValue('email');
    const userPhone = getFieldValue('phone');
    const userMessage = getFieldValue('message');

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
    } catch (error) {
      console.error("Email verification failed:", error);
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
      } catch (error) {
        console.error("Phone verification failed:", error);
        setLoading(false);
        return setErrorMessage("⚠️ Could not verify phone number. Please try again later.");
      }
    }

    try {
      await emailjs.send(
        "service_589hpgk",
        "template_jpkit3m",
        {
          from_name: userName,
          from_email: userEmail,
          phone: userPhone || "Not provided",
          message: userMessage,
        }
      );

      await emailjs.send(
        "service_589hpgk",
        "template_m54vnzo",
        {
          from_name: userName,
          from_email: userEmail,
        }
      );

      setSuccessMessage("✅ Message sent successfully!");
      form.reset();
      window.setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("EmailJS send failed:", error);
      setErrorMessage("⚠️ Failed to send your message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 relative overflow-hidden bg-[#FEFDFE]"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 940px' }}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 text-black">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h2>
          <p className="text-lg opacity-70">
            Get in touch with our real estate experts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="text-black space-y-8">
            <div>
              <h3 className="text-3xl font-bold mb-4">Visakha Properties</h3>
              <p className="text-lg opacity-70 leading-relaxed max-w-md">
                Connecting you with the most premium real estate opportunities in Andhra Pradesh.
                Our experts are ready to guide your investment.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#e8c547] rounded-full flex items-center justify-center text-[#800020]">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Address</h4>
                  <p className="opacity-70 text-sm">
                    123 Beach Road, Visakhapatnam, AP 530002
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#e8c547] rounded-full flex items-center justify-center text-[#800020]">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Phone</h4>
                  <p className="opacity-70 text-sm">
                    +91 9949482463 / +91 9346641689
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#e8c547] rounded-full flex items-center justify-center text-[#800020]">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Email</h4>
                  <p className="opacity-70 text-sm">
                    srisimhapromoters@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl"
          >
            <h4 className="text-2xl font-bold text-[#800020] mb-8">
              Send a Message
            </h4>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 text-black">
              <input
                type="text"
                name="name"
                placeholder="Your Name *"
                data-testid="input-contact-name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#800020] outline-none transition-all"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email *"
                data-testid="input-contact-email"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#800020] outline-none transition-all"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Your Phone"
                data-testid="input-contact-phone"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#800020] outline-none transition-all"
              />

              <textarea
                name="message"
                placeholder="Your Message *"
                rows={4}
                data-testid="input-contact-message"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#800020] outline-none transition-all resize-none"
              />

              {errorMessage && (
                <p className="text-red-500 text-sm" data-testid="text-contact-error">{errorMessage}</p>
              )}

              {successMessage && (
                <p className="text-green-600 text-sm" data-testid="text-contact-success">{successMessage}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#800020] text-white rounded-lg font-bold hover:bg-[#e8c547] hover:text-[#800020] transition-all shadow-lg"
                data-testid="button-contact-submit"
              >
                {loading ? "Verifying & Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default memo(Contact);