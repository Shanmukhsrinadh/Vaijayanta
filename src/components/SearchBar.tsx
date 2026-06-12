import { memo, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Search, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import projectsData from "../data/projects.json";
import landsData from "../data/lands.json";

type SearchItem = {
  id: string;
  title: string;
  shortTagline?: string;
  cityName: string;
  locationName: string;
  type: 'project' | 'land';
  searchText: string;
};

const getAllItems = (): SearchItem[] => {
  const items: SearchItem[] = [];

  Object.values(projectsData as Record<string, any>).forEach((city: any) => {
    Object.entries(city.locations || {}).forEach(([locationName, locationData]: [string, any]) => {
      Object.values(locationData.projects || {}).forEach((project: any) => {
        items.push({
          ...project,
          cityName: city.cityName,
          locationName,
          type: 'project',
          searchText: `${project.title} ${project.shortTagline} ${city.cityName} ${locationName}`.toLowerCase(),
        });
      });
    });
  });

  (landsData as any[]).forEach((land: any) => {
    items.push({
      ...land,
      title: land.name,
      cityName: land.city,
      locationName: land.location,
      type: 'land',
      searchText: `${land.name} ${land.shortTagline} ${land.city} ${land.location}`.toLowerCase(),
    });
  });

  return items;
};

const allItems = getAllItems();

function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const [, setLocation] = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, { passive: true });
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = useMemo(() => {
    if (!deferredQuery) return [];
    return allItems.filter((item) => item.searchText.includes(deferredQuery)).slice(0, 5);
  }, [deferredQuery]);

  const handleSelect = (item: SearchItem) => {
    setLocation(`/city/${item.cityName.toLowerCase()}?project=${item.id}`);
    setIsOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && results.length > 0) handleSelect(results[0]);
  };

  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight || !text) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase()
        ? <span key={`${part}-${i}`} className="text-[#800020] font-bold">{part}</span>
        : part
    );
  };

  return (
    <div className="relative w-full max-w-sm" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search properties..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-red-500 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
        />
      </div>
      <AnimatePresence>
        {isOpen && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.14 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-80 overflow-y-auto"
          >
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 flex flex-col gap-1 group"
                  >
                    <div className="font-bold text-gray-900 group-hover:text-[#800020] transition-colors truncate">
                      {highlightMatch(item.title, deferredQuery)}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 gap-2">
                      <span className="flex items-center gap-1 shrink-0">
                        <MapPin size={12} />
                        {item.locationName}, {item.cityName}
                      </span>
                      <span className="inline-block w-1 h-1 rounded-full bg-gray-300 shrink-0"></span>
                      <span className="truncate">{item.shortTagline}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                No properties found matching "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(SearchBar);
