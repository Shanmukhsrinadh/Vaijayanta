import { useCallback, useEffect } from 'react';
import { useLocation } from 'wouter';

interface UseSmoothScrollOptions {
  enableInitialHashSync?: boolean;
}

export function useSmoothScroll(options?: UseSmoothScrollOptions) {
  const [location] = useLocation();

  useEffect(() => {
    if (options?.enableInitialHashSync) {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.slice(1);
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [location, options?.enableInitialHashSync]);

  const scrollToSection = useCallback(
    (e: React.MouseEvent, href: string) => {
      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;

      const pathPart = href.substring(0, hashIndex);
      const hash = href.substring(hashIndex + 1);
      const currentPath = window.location.pathname;

      if (pathPart === '' || pathPart === '/' || currentPath === pathPart) {
        e.preventDefault();
        const el = document.getElementById(hash);
        if (el) {
          const yOffset = -80;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    },
    []
  );

  return { scrollToSection };
}
