import React, { useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  category: 'Clinic' | 'Doctors' | 'Panchakarma' | 'Treatments' | 'Herbal Medicines' | 'Consultation' | 'Pharmacy' | 'Wellness' | 'Events';
  image: string;
  desc: string;
}

const GALLERY_DATA: GalleryItem[] = [
  {
    id: 1,
    title: 'Consultation Suite',
    category: 'Clinic',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600&h=400',
    desc: 'Modern, peaceful consulting chambers designed for patient comfort and confidential pulse diagnosis.'
  },
  {
    id: 2,
    title: 'Panchakarma Shala',
    category: 'Panchakarma',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600&h=400',
    desc: 'Traditional wooden droni tables used for Ayurvedic medicated oil massages and steam detox procedures.'
  },
  {
    id: 3,
    title: 'Dr. Anjali Nair in Consultation',
    category: 'Doctors',
    image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=600&h=400',
    desc: 'Certified Vaidya performing personalized Prakriti analysis and diagnosing metabolic conditions.'
  },
  {
    id: 4,
    title: 'Shirodhara Treatment Flow',
    category: 'Treatments',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600&h=400',
    desc: 'Precise pouring of warm medicated herbal oil on the forehead to relieve stress, insomnia, and migraines.'
  },
  {
    id: 5,
    title: 'Herbal Pharmacy Inventory',
    category: 'Pharmacy',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600&h=400',
    desc: 'GMP-certified organic wellness formulas, oils, and powdered herbal complexes ready for prescription.'
  },
  {
    id: 6,
    title: 'Ayurvedic Herb Ingredients',
    category: 'Herbal Medicines',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600&h=400',
    desc: 'Freshly harvested wild ashwagandha, amla, and neem leaves prepared according to classical methods.'
  },
  {
    id: 7,
    title: 'Yoga and Meditation Session',
    category: 'Wellness',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600&h=400',
    desc: 'Daily therapeutic yoga classes guiding patients towards breathing balance and stress reduction.'
  },
  {
    id: 8,
    title: 'National Ayurveda Seminar 2026',
    category: 'Events',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600&h=400',
    desc: 'Hosting academic panels with global experts discussing integrations in modern medicine.'
  },
  {
    id: 9,
    title: 'Pulse Analysis (Nadi Pariksha)',
    category: 'Consultation',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600&h=400',
    desc: 'Determining physical body doshas (Vata, Pitta, Kapha) and identifying root organ sluggishness.'
  }
];

const CATEGORIES = ['All', 'Clinic', 'Doctors', 'Panchakarma', 'Treatments', 'Herbal Medicines', 'Consultation', 'Pharmacy', 'Wellness', 'Events'] as const;

export default function Gallery() {
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);

  const filteredItems = GALLERY_DATA.filter(item => 
    selectedCat === 'All' || item.category === selectedCat
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setZoomScale(1);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    setZoomScale(1);
  };

  const showPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    setZoomScale(1);
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] pb-24 font-sans selection:bg-emerald-100 selection:text-emerald-950">
      
      {/* Header Banner */}
      <div className="bg-emerald-950 text-white py-16 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-900 text-emerald-350 text-xs font-bold uppercase tracking-wider">
          <Camera className="w-3.5 h-3.5 text-ayur-accent" />
          <span>Visual Showcase</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Kaya Kalp Wellness Gallery</h1>
        <p className="text-xs sm:text-sm text-emerald-250 max-w-xl mx-auto font-medium leading-relaxed">
          Step inside our clinical sanctuaries, browse botanical pharmacies, and witness authentic Panchakarma detoxification procedures.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Category Filters Tab Panel */}
        <div className="flex flex-wrap gap-2 justify-center border-b border-stone-200/60 pb-6 text-xs font-bold">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl transition-all ${
                selectedCat === cat
                  ? 'bg-ayur-primary text-white shadow shadow-emerald-950/20'
                  : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Masonry-style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="bg-white border border-stone-200/80 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              {/* Image Container with Zoom */}
              <div className="h-56 w-full overflow-hidden relative bg-stone-50">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Category Badge overlay */}
                <span className="absolute top-3 left-3 bg-emerald-950 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  {item.category}
                </span>

                {/* Hover Maximize Icon overlay */}
                <div className="absolute inset-0 bg-stone-950/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="p-3 bg-white text-stone-900 rounded-full shadow-lg">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Text descriptions */}
              <div className="p-5 space-y-1">
                <h4 className="font-extrabold text-sm text-stone-900 leading-snug">{item.title}</h4>
                <p className="text-xs text-stone-505 font-medium leading-relaxed">{item.desc}</p>
              </div>

            </div>
          ))}
        </div>

        {/* If empty grid */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 bg-white border border-dashed border-stone-200 rounded-[32px] text-xs text-stone-400 font-bold">
            No visuals found in this category.
          </div>
        )}

      </div>

      {/* LIGHTBOX OVERLAY MODAL */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-stone-950/95 backdrop-blur z-50 flex flex-col justify-between p-4 select-none">
          
          {/* Top Panel Bar */}
          <div className="flex justify-between items-center text-white px-4 py-2 text-xs font-bold">
            <div className="space-y-0.5">
              <span className="text-[10px] text-emerald-450 uppercase tracking-widest font-black block">
                {filteredItems[lightboxIndex].category}
              </span>
              <h3 className="text-sm font-extrabold">{filteredItems[lightboxIndex].title}</h3>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setZoomScale(prev => Math.min(prev + 0.25, 2))}
                className="p-2 bg-stone-900/60 hover:bg-stone-900 text-stone-300 hover:text-white rounded-full"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setZoomScale(prev => Math.max(prev - 0.25, 0.75))}
                className="p-2 bg-stone-900/60 hover:bg-stone-900 text-stone-300 hover:text-white rounded-full"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button 
                onClick={closeLightbox}
                className="p-2 bg-stone-900/60 hover:bg-stone-900 text-stone-300 hover:text-white rounded-full"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Central Image and Arrows Container */}
          <div className="flex-grow flex items-center justify-between gap-4 max-w-7xl mx-auto w-full relative">
            
            {/* Prev Arrow */}
            <button 
              onClick={showPrev}
              className="p-3 bg-stone-900/40 hover:bg-stone-900/80 text-white rounded-full transition-all shrink-0 z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Image viewport */}
            <div className="flex-grow h-full flex items-center justify-center overflow-hidden p-4">
              <img 
                src={filteredItems[lightboxIndex].image} 
                alt={filteredItems[lightboxIndex].title} 
                className="max-w-full max-h-[75vh] object-contain rounded-lg transition-transform duration-305 shadow-2xl"
                style={{ transform: `scale(${zoomScale})` }}
              />
            </div>

            {/* Next Arrow */}
            <button 
              onClick={showNext}
              className="p-3 bg-stone-900/40 hover:bg-stone-900/80 text-white rounded-full transition-all shrink-0 z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

          {/* Bottom descriptions */}
          <div className="text-center text-stone-400 text-xs py-4 max-w-xl mx-auto font-medium leading-relaxed">
            <p className="text-stone-300 mb-1">{filteredItems[lightboxIndex].desc}</p>
            <span>Image {lightboxIndex + 1} of {filteredItems.length}</span>
          </div>

        </div>
      )}

    </div>
  );
}
