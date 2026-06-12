import { memo, useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { Menu, X, Search } from 'lucide-react';
import SearchBar from './SearchBar';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPath, navigate] = useLocation();

  const navLinks = useMemo(
    () => [
      { name: 'Home', href: '/', sectionId: '' },
      { name: 'Properties', href: '/#properties', sectionId: 'properties' },
      { name: 'Locations', href: '/#locations', sectionId: 'locations' },
      { name: 'Contact', href: '/#contact', sectionId: 'contact' },
    ],
    []
  );

  const openSearch = useCallback(() => { setIsSearchOpen(true); setIsOpen(false); }, []);
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  const scrollToSection = useCallback((sectionId: string) => {
    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      e.preventDefault();
      setIsOpen(false);

      const isOnHome = currentPath === '/';

      if (isOnHome) {
        scrollToSection(sectionId);
      } else {
        navigate('/');
        setTimeout(() => scrollToSection(sectionId), 350);
      }
    },
    [currentPath, navigate, scrollToSection]
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white shadow-md py-3 md:py-4">
      <div className="container mx-auto px-6 flex items-center justify-between flex-wrap md:flex-nowrap gap-y-3 relative">
        <div className={`flex items-center justify-between w-full md:w-auto ${isSearchOpen ? 'hidden md:flex' : 'flex'}`}>
          <Link href="/" className="flex items-center">
            <img
              src="https://i.ibb.co/rfs2G8QC/Trail-logo.png"
              alt="Visakha Properties"
              className="h-10 md:h-14 w-auto object-contain max-w-[200px] md:max-w-[300px]"
              loading="eager"
              decoding="async"
            />
          </Link>
          <div className="flex items-center gap-2 md:hidden ml-auto">
            <button className="text-gray-800 p-2" onClick={openSearch} aria-label="Open search">
              <Search size={24} />
            </button>
            <button className="text-gray-800 p-2" onClick={toggleMenu} aria-label={isOpen ? 'Close menu' : 'Open menu'}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="flex items-center w-full md:hidden gap-2">
            <div className="flex-1"><SearchBar /></div>
            <button className="text-gray-800 p-2" onClick={closeSearch} aria-label="Close search">
              <X size={28} />
            </button>
          </div>
        )}

        <div className="hidden md:flex items-center space-x-8">
          <div className="flex items-center space-x-8 mr-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.sectionId)}
                className="text-sm font-bold uppercase tracking-widest text-gray-800 hover:text-[#e8c547] transition-colors whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
          </div>
          <SearchBar />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-2xl md:hidden p-6 flex flex-col space-y-6 max-h-[85vh] overflow-y-auto"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xl font-black text-[#800020] uppercase tracking-widest"
                onClick={(e) => handleNavClick(e, link.sectionId)}
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default memo(Navbar);
