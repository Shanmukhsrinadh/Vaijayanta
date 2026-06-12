import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRoute } from 'wouter';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import projectsData from '../data/projects.json';
import landsData from '../data/lands.json';
import { useSmoothScroll } from '../hooks/use-smooth-scroll';
import { getAppPath, resolveAssetPath } from '@/lib/appPath';
import emailjs from '@emailjs/browser';
import { FaWhatsapp } from "react-icons/fa";
import { 
  X, MapPin, Search, ChevronLeft, ChevronRight, 
  Info, Layout, TrendingUp, Link as LinkIcon, 
  Maximize2, Phone, MessageSquare, Download,
  CheckCircle2, AlertCircle, ShieldCheck, Zap,
  Building2, LandPlot, Filter
} from 'lucide-react';

export default function CityDetails() {
  useSmoothScroll();
  const [, params] = useRoute('/city/:cityId');
  const cityId = params?.cityId;
  const cityKey = useMemo(
    () => Object.keys(projectsData as Record<string, unknown>).find((key) => key.toLowerCase() === cityId?.toLowerCase()),
    [cityId]
  );

  useEffect(() => {
    emailjs.init("Es-1PqvKO3CYG1B8g");
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [cityId]);

  const cityData = cityKey ? (projectsData as any)[cityKey] : null;

  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'lands'>('projects');
  const [showMap, setShowMap] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const shouldReduceMotion = useReducedMotion();

  // Auto-open project if specified in URL query params
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const projectId = searchParams.get('project');

    if (projectId && cityData) {
      // Find the project in the city data
      let foundProject = null;
      let foundLocation = null;

      // Search in projects
      Object.entries(cityData.locations || {}).forEach(([locName, locData]: [string, any]) => {
        Object.values(locData.projects || {}).forEach((proj: any) => {
          if (proj.id === projectId) {
            foundProject = { ...proj, type: 'project' };
            foundLocation = locName;
          }
        });
      });

      if (foundProject && foundLocation) {
        setActiveTab('projects');
        setActiveLocation(foundLocation);
        setSelectedProject(foundProject);
        setMainImageIndex(0);
        return;
      }

      // If not in projects, search in lands
      const foundLand = (landsData as any[]).find(l => l.id === projectId);
      if (foundLand) {
        setActiveTab('lands');
        setActiveLocation(foundLand.location);
        setSelectedProject({ ...foundLand, type: 'land' });
        setMainImageIndex(0);
      }
    }
  }, [cityId, cityData]);

  const cityProjectLocations = useMemo(
    () => (cityData ? Object.keys(cityData.locations || {}) : []),
    [cityData]
  );

  const cityLands = useMemo(() => {
    if (!cityData?.cityName) return [];
    return (landsData as any[]).filter(
      (land) => land.city.toLowerCase() === cityData.cityName.toLowerCase()
    );
  }, [cityData]);

  const filteredLands = useMemo(() => {
    if (!activeLocation) return [];
    return cityLands.filter(
      (land) => land.location.toLowerCase() === activeLocation.toLowerCase()
    );
  }, [activeLocation, cityLands]);

  const locations = useMemo(() => {
    if (activeTab === 'projects') {
      return cityProjectLocations;
    }

    return Array.from(new Set(cityLands.map((land) => land.location)));
  }, [activeTab, cityProjectLocations, cityLands]);

  const activeProjects = useMemo(() => {
    if (!activeLocation || activeTab !== 'projects') return [];
    return Object.values((cityData?.locations as Record<string, any>)?.[activeLocation]?.projects || {});
  }, [activeLocation, activeTab, cityData]);

  const isProjectMediaMatch = useCallback((project: any, path?: string | null) => {
    if (!project || !path) return false;
    return true;
  }, []);

  const getProjectImagePath = useCallback((project: any) => {
    if (!isProjectMediaMatch(project, project?.heroImage)) {
      return '';
    }

    return resolveAssetPath(project.heroImage);
  }, [isProjectMediaMatch]);

  const currentGallery = useMemo(() => {
    if (!selectedProject) return [];

    return [selectedProject.heroImage, ...(selectedProject.gallery || [])]
      .filter((image) => isProjectMediaMatch(selectedProject, image))
      .map((image) => resolveAssetPath(image))
      .filter((image, index, array) => Boolean(image) && array.indexOf(image) === index);
  }, [selectedProject, isProjectMediaMatch]);

  useEffect(() => {
    setShowMap(false);

    if (!selectedProject) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    let timeoutId: number | undefined;
    let idleId: number | undefined;

    const preloadGallery = () => {
      currentGallery.slice(0, 2).forEach((src: string) => {
        const image = new Image();
        image.decoding = 'async';
        image.loading = 'eager';
        image.src = src;
      });
    };

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(preloadGallery, { timeout: 900 });
    } else {
      timeoutId = window.setTimeout(preloadGallery, 180);
    }

    return () => {
      if (typeof idleId === 'number' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      if (typeof timeoutId === 'number') {
        window.clearTimeout(timeoutId);
      }
      document.body.style.overflow = '';
    };
  }, [selectedProject, currentGallery]);

  const locationHasProjects = useCallback(
    (location: string) => Boolean(
      cityData?.locations?.[location]?.projects &&
      Object.keys(cityData.locations[location].projects || {}).length > 0
    ),
    [cityData]
  );

  const locationHasLands = useCallback(
    (location: string) => cityLands.some(
      (land) => land.location.toLowerCase() === location.toLowerCase()
    ),
    [cityLands]
  );

  const getLocationThumbnail = useCallback((location: string) => {
    if (activeTab === 'projects') {
      return resolveAssetPath(cityData?.locations?.[location]?.thumbnail);
    }

    const landInLocation = cityLands.find(
      (land) => land.location.toLowerCase() === location.toLowerCase()
    );

    return resolveAssetPath(landInLocation?.heroImage || cityData?.heroImage || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200');
  }, [activeTab, cityData, cityLands]);

  const getLocationAbout = useCallback((location: string) => {
    if (activeTab === 'projects') {
      return cityData?.locations?.[location]?.about || `Premium ${activeTab} in ${location}`;
    }

    const landTypes = cityLands
      .filter((land) => land.location.toLowerCase() === location.toLowerCase())
      .map((land) => land.name)
      .join(', ');

    return `Open lands available in ${location}: ${landTypes}. Perfect for investment and development.`;
  }, [activeTab, cityData, cityLands]);

  const scrollToLocationContent = useCallback(() => {
    window.setTimeout(() => {
      const locationSection = document.getElementById('location-content');
      if (locationSection) {
        const yOffset = -100;
        const y = locationSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
      }
    }, 100);
  }, [shouldReduceMotion]);

  if (!cityData) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-2xl sm:text-4xl font-bold text-[#800020] mb-4">City Not Found</h1>
        <a href={getAppPath("/")} className="inline-block px-6 sm:px-8 py-3 bg-[#800020] text-white rounded-full font-bold text-sm sm:text-base">Go Home</a>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      {/* City Hero */}
      <section 
        className="h-[50vh] sm:h-[60vh] md:h-[65vh] flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${resolveAssetPath(cityData.heroImage)}')` }}
      >
        <div className="text-center text-white z-10 px-4 sm:px-6 max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-3 sm:mb-6 tracking-tight"
          >
            {cityData.cityName}
          </motion.h1>
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl opacity-90 max-w-2xl sm:max-w-3xl mx-auto font-light leading-relaxed px-2">
            Discover the future of living in the most prestigious neighborhoods of {cityData.cityName}.
          </p>
        </div>
      </section>

      {/* City Map + Key Highlights */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
            {/* Map */}
            <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-white">
              <div className="relative w-full h-[350px] sm:h-[420px] lg:h-[460px] overflow-hidden">
                <div className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white pl-[15px]">
                  <iframe 
                    src={cityData.mapUrl}
                    className="w-full border-0"
                    height="500"
                    scrolling="no"
                    loading="lazy"
                    title={`${cityData.cityName} Map`}
                  />
                </div>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="bg-white p-8 sm:p-10 lg:p-12 rounded-3xl shadow-xl border border-gray-100 flex flex-col h-[350px] sm:h-[420px] lg:h-[460px]">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#800020] mb-6 flex-shrink-0">
                Key Highlights
              </h3>

              <ul className="space-y-5 overflow-y-auto pr-2">
                {cityData.keyHighlights?.map((item: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-700 text-sm sm:text-base leading-relaxed"
                  >
                    <span className="mt-1 w-2 h-2 bg-[#e8c547] rounded-full flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Toggle between Projects and Lands - Now BEFORE location selection */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-2xl inline-flex">
            <button
              onClick={() => {
                setActiveTab('projects');
                setActiveLocation(null); // Reset location when switching tabs
              }}
              className={`px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center gap-2 ${
                activeTab === 'projects'
                  ? 'bg-[#800020] text-white'
                  : 'text-gray-600 hover:text-[#800020]'
              }`}
            >
              <Building2 size={20} />
              <span>Projects</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('lands');
                setActiveLocation(null); // Reset location when switching tabs
              }}
              className={`px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center gap-2 ${
                activeTab === 'lands'
                  ? 'bg-[#800020] text-white'
                  : 'text-gray-600 hover:text-[#800020]'
              }`}
            >
              <LandPlot size={20} />
              <span>Open Lands</span>
            </button>
          </div>
        </div>

        {/* Select Location Grid */}
        {locations.length > 0 ? (
          <section className="mb-16 sm:mb-24 md:mb-32">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#800020] mb-2 sm:mb-4">
                {activeTab === 'projects' ? 'Select Location for Projects' : 'Select Location for Lands'}
              </h2>
              <p className="text-sm sm:text-base text-gray-500">
                {activeTab === 'projects' 
                  ? 'Choose a location to explore our premium projects' 
                  : 'Choose a location to explore available open lands'}
              </p>
            </div>

            <div className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto pb-6 sm:pb-8 md:pb-12 snap-x no-scrollbar px-2 sm:px-4">
              {locations.map((locName) => {
                const locationName = locName as string;
                const hasContent = activeTab === 'projects' 
                  ? locationHasProjects(locationName)
                  : locationHasLands(locationName);

                return (
                  <motion.div 
                    key={locationName}
                    whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                    onClick={() => {
                      if (hasContent) {
                        setActiveLocation(locationName);
                        scrollToLocationContent();
                      }
                    }}
                    className={`min-w-[200px] sm:min-w-[240px] md:min-w-[280px] w-[200px] sm:w-[240px] md:w-[280px] h-[260px] sm:h-[300px] md:h-[340px] rounded-2xl sm:rounded-3xl md:rounded-[2rem] overflow-hidden shadow-lg snap-start transition-all relative flex-shrink-0 ${
                      hasContent ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                    } ${
                      activeLocation === locationName ? 'ring-4 sm:ring-8 ring-[#e8c547]/50' : ''
                    }`}
                  >
                    <img
                      src={cityData.locations?.[locationName]?.thumbnail}
                      alt={locationName}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                      <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/80 backdrop-blur-md">
                        {activeTab === 'projects' ? 'Projects' : 'Open Lands'}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white/80 backdrop-blur-md">
                        {activeTab === 'projects' ? <Building2 size={18} /> : <LandPlot size={18} />}
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                      <span className="text-base sm:text-lg md:text-xl font-bold text-white block">{locationName}</span>
                      <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-[#f5d57d]">{cityData.cityName}</span>
                      {!hasContent && (
                        <span className="text-xs text-white/70 mt-2 block">
                          No {activeTab} available
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ) : (
          <div className="text-center py-20">
            {activeTab === 'projects' ? (
              <>
                <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-500 mb-2">No Projects Available</h3>
                <p className="text-gray-400">There are no projects in {cityData.cityName} at the moment.</p>
              </>
            ) : (
              <>
                <LandPlot size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-500 mb-2">No Lands Available</h3>
                <p className="text-gray-400">There are no open lands in {cityData.cityName} at the moment.</p>
              </>
            )}
          </div>
        )}

        {/* Location Content */}
        <AnimatePresence mode="wait">
          {activeLocation && (
            <motion.section 
              id="location-content"
              key={activeLocation}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 50 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 50 }}
              className="space-y-8 sm:space-y-10 md:space-y-12"
            >
              {/* Location Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 bg-[#800020] p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl md:rounded-[2rem] text-white">
                <div className="w-full md:w-auto">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-2 sm:mb-4">{activeLocation}</h2>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 font-light max-w-2xl">
                    {getLocationAbout(activeLocation)}
                  </p>
                </div>
                <button onClick={() => setActiveLocation(null)} className="w-full md:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-white/20 text-sm sm:text-base">
                  Close Section
                </button>
              </div>

              {/* Content based on active tab */}
              {activeTab === 'projects' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                  {activeProjects.map((project: any) => (
                    <motion.div 
                      key={project.id}
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                      onClick={() => {
                        setSelectedProject({ ...project, type: 'project' });
                        setMainImageIndex(0);
                      }}
                      className="bg-white rounded-2xl sm:rounded-3xl md:rounded-[2rem] overflow-hidden shadow-lg cursor-pointer border border-gray-100 h-full flex flex-col"
                    >
                      <div className="h-48 sm:h-56 md:h-64 relative">
                        <img src={resolveAssetPath(project.heroImage)} alt={project.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#e8c547] text-[#800020] px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-lg">
                          {project.pricing?.priceBadge || 'Featured'}
                        </div>
                      </div>
                      <div className="p-4 sm:p-6 md:p-8 flex-grow flex flex-col justify-between">
                        <div>
                          <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-[#800020] mb-1 sm:mb-2">{project.title}</h4>
                          <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4">{project.shortTagline}</p>
                          <div className="text-base sm:text-lg md:text-xl text-[#800020] font-bold">{project.pricing?.basePrice} <span className="text-xs sm:text-sm font-normal text-gray-400">Onwards</span></div>
                        </div>
                        <button className="mt-4 sm:mt-6 md:mt-8 w-full py-3 sm:py-4 rounded-lg sm:rounded-xl bg-[#800020] text-white text-sm sm:text-base font-bold">Explore Now</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'lands' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                  {filteredLands.length > 0 ? (
                    filteredLands.map((land) => (
                      <motion.div 
                        key={land.id}
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                        onClick={() => {
                          setSelectedProject({ ...land, type: 'land' });
                          setMainImageIndex(0);
                        }}
                        className="bg-white rounded-2xl sm:rounded-3xl md:rounded-[2rem] overflow-hidden shadow-lg cursor-pointer border border-gray-100 h-full flex flex-col"
                      >
                        <div className="h-48 sm:h-56 md:h-64 relative">
                          <img src={resolveAssetPath(land.heroImage)} alt={land.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#e8c547] text-[#800020] px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-lg">
                            {land.pricing?.priceBadge}
                          </div>
                          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-[#800020] px-3 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-2 border border-[#800020]/10">
                            <LandPlot size={14} /> Private Land
                          </div>
                        </div>
                        <div className="p-4 sm:p-6 md:p-8 flex-grow flex flex-col justify-between">
                          <div>
                            <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-[#800020] mb-1 sm:mb-2">{land.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4 line-clamp-2">{land.shortTagline}</p>
                            <div className="text-base sm:text-lg md:text-xl text-[#800020] font-bold">{land.price}</div>
                          </div>
                          <button className="mt-4 sm:mt-6 md:mt-8 w-full py-3 sm:py-4 rounded-lg sm:rounded-xl bg-[#800020] text-white text-sm sm:text-base font-bold">View Land Details</button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <LandPlot size={48} className="mx-auto text-gray-300 mb-4" />
                      <h3 className="text-xl font-bold text-gray-500 mb-2">No Lands Available</h3>
                      <p className="text-gray-400">There are no open lands in {activeLocation} at the moment.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Project Details Modal - Fully Responsive with Key Highlights */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />

            {/* Modal - Responsive sizing */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.98, opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.98, opacity: 0, y: 20 }}
              transition={{ duration: shouldReduceMotion ? 0.15 : 0.22 }}
              className="bg-white w-full sm:w-[95%] md:w-[90%] lg:w-full max-w-7xl h-[92vh] sm:h-[90vh] md:h-[95vh] rounded-t-3xl sm:rounded-2xl md:rounded-[2.5rem] overflow-hidden relative z-10 flex flex-col shadow-2xl"
            >

              {/* Close Button - Responsive positioning */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-50">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 transition"
                >
                  <X size={16} className="sm:w-[18px] sm:h-[18px] md:w-[22px] md:h-[22px]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain">

                {/* ================= HERO - Responsive ================= */}
                <section className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[60vh] flex items-end">
                  <img
                    src={currentGallery[mainImageIndex] || resolveAssetPath(selectedProject.heroImage)}
                    alt={selectedProject.title || selectedProject.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12 w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6 md:gap-8">
                    <div className="max-w-2xl lg:max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
                        <span className="bg-[#e8c547] text-[#800020] px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                          {selectedProject.pricing?.priceBadge}
                        </span>
                        <span className="text-white/80 text-xs sm:text-sm font-medium">
                          | {selectedProject.leadGen?.urgencyTag}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold text-white mb-1 sm:mb-2 md:mb-4">
                        {selectedProject.title}
                      </h2>

                      <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 font-light">
                        {selectedProject.shortTagline}
                      </p>
                    </div>

                    {/* Key Highlights - Data Wrapper */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl md:rounded-[2rem] p-4 sm:p-5 md:p-6 lg:p-8 shadow-2xl w-full sm:w-auto sm:min-w-[200px] md:min-w-[240px] lg:min-w-[280px] border-b-4 sm:border-b-8 border-[#800020]">
                      <div className="text-gray-500 uppercase text-[10px] sm:text-xs font-bold mb-0.5 sm:mb-1">
                        Starting Price
                      </div>
                      <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#800020]">
                        {selectedProject.pricing?.basePrice}*
                      </div>
                      <div className="text-[#e8c547] font-bold flex items-center gap-2 mt-2">
                        <TrendingUp size={20} className="hidden sm:block" />
                        <span className="text-xs sm:text-sm">ROI: {selectedProject.pricing?.estimatedReturn5Years} in 5 Years</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ========== KEY HIGHLIGHTS SECTION ========== */}
                <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-10">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {selectedProject.keyHighlights?.map((highlight: any, index: number) => (
                      <motion.div
                        key={index}
                        whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                        className="bg-gray-50 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl text-center border border-gray-100"
                      >
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#800020] mb-1">
                          {highlight.value}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          {highlight.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* ========== ABOUT + TRUST - Responsive ========== */}
                <div className="p-4 sm:p-5 md:p-8 lg:p-10 xl:p-12" style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 1200px' }}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-10 lg:gap-14">

                    {/* LEFT */}
                    <div className="lg:col-span-8 space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-14">

                      <section>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#800020] mb-3 sm:mb-4 md:mb-6">
                          About {selectedProject.title}
                        </h3>

                        <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-light mb-6 sm:mb-8 md:mb-10">
                          {selectedProject.description}
                        </p>

                        <h4 className="text-base sm:text-lg md:text-xl font-bold text-[#800020] mb-3 sm:mb-4 md:mb-6">
                          Project Gallery
                        </h4>

                        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                          {currentGallery.map((img: string, i: number) => (
                            <motion.div
                              key={img}
                              whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                              onClick={() => setMainImageIndex(i)}
                              className={`aspect-[4/3] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden border-2 cursor-pointer transition ${
                                mainImageIndex === i
                                  ? "border-[#e8c547] shadow-lg"
                                  : "border-transparent opacity-70 hover:opacity-100"
                              }`}
                            >
                              <img
                                src={img}
                                alt={`${selectedProject.title || selectedProject.name} ${i + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                              />
                            </motion.div>
                          ))}
                        </div>
                      </section>

                    </div>

                    {/* TRUST BOX - Only show for projects, not for lands */}
                    {selectedProject.type === 'project' && (
                      <div className="lg:col-span-4">
                        <div className="bg-[#800020] text-white p-5 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl lg:rounded-[3rem] shadow-xl lg:h-fit">
                          <h4 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3">
                            <ShieldCheck className="text-[#e8c547] w-5 h-5 sm:w-6 sm:h-6" />
                            Verified Property
                          </h4>

                          <div className="space-y-3 sm:space-y-4 md:space-y-6">
                            <div className="p-3 sm:p-4 bg-white/10 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base">
                              RERA Approved
                            </div>
                            <div className="p-3 sm:p-4 bg-white/10 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base">
                              Bank Loans Available
                            </div>

                            <div className="pt-4 sm:pt-5 md:pt-6 border-t border-white/10">
                              <h5 className="text-[10px] sm:text-xs uppercase opacity-60 mb-2 sm:mb-3 md:mb-4 font-bold">
                                Official Approvals
                              </h5>

                              <div className="flex flex-wrap gap-1 sm:gap-2">
                                {selectedProject.trustSignals?.approvals.map(
                                  (ap: string, i: number) => (
                                    <span
                                      key={i}
                                      className="bg-white/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs"
                                    >
                                      {ap}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Optional: For lands, you could show something else here if needed */}
                    {selectedProject.type === 'land' && (
                      <div className="lg:col-span-4">
                        <div className="bg-[#800020] text-white p-5 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl lg:rounded-[3rem] shadow-xl lg:h-fit">
                          <h4 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3">
                            <LandPlot className="text-[#e8c547] w-5 h-5 sm:w-6 sm:h-6" />
                            Land Details
                          </h4>

                          <div className="space-y-3 sm:space-y-4 md:space-y-6">
                            <div className="p-3 sm:p-4 bg-white/10 rounded-xl sm:rounded-2xl">
                              <div className="text-[10px] sm:text-xs opacity-70 mb-1">Plot Area</div>
                              <div className="font-bold text-sm sm:text-base">{selectedProject.plotArea || 'Contact for details'}</div>
                            </div>
                            <div className="p-3 sm:p-4 bg-white/10 rounded-xl sm:rounded-2xl">
                              <div className="text-[10px] sm:text-xs opacity-70 mb-1">Dimensions</div>
                              <div className="font-bold text-sm sm:text-base">{selectedProject.dimensions || 'Contact for details'}</div>
                            </div>

                            <div className="pt-4 sm:pt-5 md:pt-6 border-t border-white/10">
                              <h5 className="text-[10px] sm:text-xs uppercase opacity-60 mb-2 sm:mb-3 md:mb-4 font-bold">
                                Key Features
                              </h5>

                              <div className="flex flex-wrap gap-1 sm:gap-2">
                                {selectedProject.keyFeatures?.map(
                                  (feature: string, i: number) => (
                                    <span
                                      key={i}
                                      className="bg-white/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs"
                                    >
                                      {feature}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ========== FULL WIDTH SECTIONS - Responsive ========== */}
                <div className="px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 pb-12 sm:pb-16 md:pb-20 lg:pb-24 space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24" style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 1600px' }}>

                  {/* ================= WHY INVEST ================= */}
                  <section className="bg-gray-50 p-4 sm:p-6 md:p-10 lg:p-12 xl:p-16 rounded-2xl sm:rounded-3xl md:rounded-[3rem] border border-gray-100">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#800020] mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-center">
                      Why Invest Here?
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                      {selectedProject.investmentHooks?.whyInvest.map(
                        (item: string, i: number) => (
                          <motion.div
                            key={i}
                            whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                            className="bg-white p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition-all duration-300"
                          >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-14 mx-auto mb-2 sm:mb-3 md:mb-5 bg-[#e8c547]/10 rounded-full flex items-center justify-center">
                              <Zap size={16} className="sm:w-[20px] sm:h-[20px] md:w-[24px] md:h-[24px] lg:w-[26px] lg:h-[26px] text-[#e8c547]" />
                            </div>

                            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 font-medium leading-relaxed">
                              {item}
                            </p>
                          </motion.div>
                        )
                      )}
                    </div>
                  </section>

                  {/* Amenities - Responsive */}
                  <section>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#800020] mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-center">
                      Modern Amenities
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8">
                      {selectedProject.amenities?.map((item: string, i: number) => (
                        <div
                          key={i}
                          className="bg-white p-3 sm:p-4 md:p-5 lg:p-8 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition"
                        >
                          <CheckCircle2
                            size={16}
                            className="sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px] lg:w-[22px] lg:h-[22px] mx-auto text-[#800020] mb-1 sm:mb-2 md:mb-3 lg:mb-4"
                          />
                          <span className="text-xs sm:text-sm md:text-base lg:text-base font-semibold text-gray-700">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Location & Map - Responsive */}
                  <section>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#800020] mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-center">
                      Location & Connectivity
                    </h3>

                    <div className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px] rounded-xl sm:rounded-2xl md:rounded-3xl lg:rounded-[3rem] overflow-hidden border-4 sm:border-6 md:border-8 border-gray-50 shadow-xl mb-4 sm:mb-6 md:mb-8">
                      <iframe
                        src={selectedProject.locationConnectivity?.mapEmbedUrl}
                        className="w-full h-full border-0"
                        loading="lazy"
                        title="Location Map"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center">
                      {selectedProject.locationConnectivity?.distanceHighlights.map(
                        (item: any, i: number) => (
                          <div
                            key={i}
                            className="bg-[#800020]/5 px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-1.5 md:py-2 lg:py-3 rounded-full border border-[#800020]/10 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
                          >
                            <MapPin size={12} className="sm:w-[14px] sm:h-[14px] md:w-[16px] md:h-[16px] text-[#e8c547]" />
                            <span className="font-bold text-[#800020]">
                              {item.label}:
                            </span>
                            <span className="text-gray-600">
                              {item.value}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </section>

                </div>

              </div>

              {/* ========== GLOBAL CTA BAR - Responsive ========== */}
              <div className="bg-white/80 backdrop-blur-xl border-t border-gray-100 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 md:gap-6">

                <div className="hidden md:flex items-center gap-3 lg:gap-4">
                  <AlertCircle size={18} className="lg:w-[22px] lg:h-[22px] text-[#800020]" />
                  <div>
                    <div className="text-xs lg:text-sm font-bold text-[#800020]">
                      {selectedProject.leadGen?.urgencyTag}
                    </div>
                    <div className="text-[10px] lg:text-xs text-gray-500">
                      Lock current pricing before it increases
                    </div>
                  </div>
                </div>

                <div className="flex flex-col xs:flex-row items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">

                  <a
                    href={`https://wa.me/${selectedProject.leadGen?.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full xs:w-auto flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 bg-[#25D366] text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm md:text-base hover:shadow-lg transition"
                  >
                    <FaWhatsapp className="sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px] lg:w-[20px] lg:h-[20px]" />
                    <span className="hidden xs:inline">WhatsApp</span>
                    <span className="xs:hidden">Whatsapp</span>
                  </a>

                  <button
                    onClick={() => setShowEnquiryForm(true)}
                    className="w-full xs:w-auto flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-3 md:py-4 bg-[#800020] text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm md:text-base hover:bg-[#e8c547] hover:text-[#800020] transition shadow-xl"
                  >
                    {selectedProject.type === 'land' ? 'Inquire Price' : 'Book Site Visit'}
                  </button>

                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Form Overlay */}
      <AnimatePresence>
        {showEnquiryForm && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => {
                setShowEnquiryForm(false);
                setSuccessMessage("");
                setErrorMessage("");
              }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl relative z-10 max-w-lg w-full"
            >
              <button 
                onClick={() => {
                  setShowEnquiryForm(false);
                  setSuccessMessage("");
                  setErrorMessage("");
                }}
                className="absolute top-6 right-6 text-gray-400 hover:text-[#800020] transition"
              >
                <X size={24} />
              </button>

              {successMessage ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#800020] mb-2">Message Sent</h3>
                  <p className="text-gray-600">{successMessage}</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-[#800020] mb-2">Book a Site Visit</h3>
                  <p className="text-gray-500 mb-8 text-sm">
                    Inquiry for: <span className="font-bold text-[#800020]">{selectedProject?.title || selectedProject?.name}</span>
                  </p>

                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();

                      // Reset messages
                      setSuccessMessage("");
                      setErrorMessage("");
                      setLoading(true);

                      const form = e.currentTarget;
                      const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
                      const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
                      const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim();
                      const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim();

                      // Validation patterns
                      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      const phonePattern = /^[0-9]{10}$/;

                      // === Basic Validation ===
                      if (!name || !email) {
                        setLoading(false);
                        return setErrorMessage("⚠️ Please fill all required fields (Name and Email).");
                      }

                      if (!emailPattern.test(email)) {
                        setLoading(false);
                        return setErrorMessage("❌ Invalid email format. Please check your email address.");
                      }

                      if (phone && !phonePattern.test(phone)) {
                        setLoading(false);
                        return setErrorMessage("❌ Invalid phone number. Please enter a 10-digit number.");
                      }

                      // === 1️⃣ Verify Email via MailboxLayer ===
                      try {
                        const mailboxAPI = "f4fc95e2df9dda3405535446c83c86a0";

                        const verifyResponse = await fetch(
                          `https://apilayer.net/api/check?access_key=${mailboxAPI}&email=${email}`
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

                      // === 2️⃣ Verify Phone via NumVerify (if provided) ===
                      if (phone) {
                        try {
                          const numVerifyAPI = "78c95356705a74edf974f3061a696550";

                          const phoneResponse = await fetch(
                            `https://apilayer.net/api/validate?access_key=${numVerifyAPI}&number=${phone}&country_code=IN&format=1`
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

                      // === 3️⃣ Send Email via EmailJS ===
                      try {
                        await emailjs.send(
                          "service_589hpgk",
                          "template_jpkit3m",
                          {
                            from_name: name,
                            from_email: email,
                            phone: phone || "Not provided",
                            message: `Site visit request for ${selectedProject?.title || selectedProject?.name}. Additional message: ${message}`,
                          }
                        );

                        await emailjs.send(
                          "service_589hpgk",
                          "template_m54vnzo",
                          {
                            from_name: name,
                            from_email: email,
                          }
                        );

                        setSuccessMessage("✅ Site visit request sent successfully!");
                        form.reset();

                        setTimeout(() => {
                          setShowEnquiryForm(false);
                          setSuccessMessage("");
                        }, 5000);
                      } catch (err) {
                        console.error("EmailJS send failed:", err);
                        setErrorMessage("⚠️ Failed to send request. Please try again later.");
                      } finally {
                        setLoading(false);
                      }
                    }} 
                    className="space-y-4 text-black"
                  >
                    <input 
                      required 
                      name="name" 
                      type="text" 
                      placeholder="Your Name *" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#800020] outline-none transition-all" 
                    />
                    <input 
                      required 
                      name="email" 
                      type="email" 
                      placeholder="Your Email *" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#800020] outline-none transition-all" 
                    />
                    <input 
                      name="phone" 
                      type="tel" 
                      placeholder="Your Phone (10 digits)" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#800020] outline-none transition-all" 
                    />
                    <textarea 
                      name="message" 
                      placeholder="Optional Message" 
                      rows={4} 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#800020] outline-none transition-all resize-none" 
                    />

                    {errorMessage && (
                      <p className="text-red-500 text-sm">{errorMessage}</p>
                    )}

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-4 bg-[#800020] text-white rounded-lg font-bold hover:bg-[#e8c547] hover:text-[#800020] transition-all shadow-lg disabled:opacity-50"
                    >
                      {loading ? "Verifying & Sending..." : "Send Message"}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}