import { MapPin, Phone } from 'lucide-react';
import { Link } from 'wouter';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-12 pb-6 border-t border-[#e8c547]/30">
      <div className="container mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <h3 className="text-2xl font-black tracking-tight">
              Visakha<span className="text-[#e8c547]">Properties</span>
            </h3>
            <p className="text-gray-400 text-sm">Premium real estate services in Visakhapatnam since 2010.</p>
            <div className="space-y-1 text-sm text-gray-400">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-[#e8c547]" />
                Visakhapatnam, Andhra Pradesh
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-[#e8c547]" />
                +91 9949 482463 / +91 9346641689
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              {[FaFacebook, FaInstagram, FaLinkedin, FaYoutube].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#e8c547] hover:text-[#800020] transition">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#e8c547] mb-3">Locations</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Bhogapuram</li>
              <li>Kothavalasa</li>
              <li>Anandapuram</li>
              <li>Amaravati</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#e8c547] mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-[#e8c547]">Home</Link></li>
              <li><Link href="/#properties" className="text-gray-400 hover:text-[#e8c547]">Properties</Link></li>
              <li><Link href="/#locations" className="text-gray-400 hover:text-[#e8c547]">Locations</Link></li>
              <li><Link href="/#contact" className="text-gray-400 hover:text-[#e8c547]">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#e8c547] mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="text-gray-400 hover:text-[#e8c547]">Terms</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-[#e8c547]">Privacy</Link></li>
              <li><Link href="/cookies" className="text-gray-400 hover:text-[#e8c547]">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-4 border-t border-white/10 text-center space-y-1">
          <p className="text-gray-500 text-xs">© 2026 <span className="text-white">VisakhaProperties</span></p>
          <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold">
            Designed by{" "}
            <a href="https://shanmukhportfolio.vercel.app/" target="_blank" rel="noopener noreferrer"
              className="text-[#e8c547]/60 hover:text-[#e8c547] transition">
              Shanmukh Srinadh
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
