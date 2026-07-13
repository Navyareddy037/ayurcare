import React, { useState } from 'react';
import { 
  Heart, Sparkles, CheckCircle2, ShoppingBag, Info, 
  HelpCircle, ArrowRight, Star, RefreshCw, MessageSquare
} from 'lucide-react';

interface ProductItem {
  name: string;
  category: 'Medicines' | 'Hair Care' | 'Skin Care' | 'Immunity' | 'Pain Relief';
  price: string;
  rating: number;
  ingredients: string[];
  usage: string;
  benefits: string[];
  image: string;
}

const PRODUCTS_REGISTRY: ProductItem[] = [
  {
    name: 'Kaya Kalp Ashwagandha Churna',
    category: 'Medicines',
    price: '₹299',
    rating: 5,
    ingredients: ['100% Organic Withania Somnifera root powder'],
    usage: 'Take 1/2 tsp with warm milk or water before sleep.',
    benefits: ['Lowers cortisol stress levels', 'Calms the nervous system', 'Increases cellular stamina'],
    image: 'https://images.unsplash.com/photo-1611070973770-b1a60c2661f8?auto=format&fit=crop&q=80&w=250&h=250'
  },
  {
    name: 'Pure Triphala Tablets',
    category: 'Medicines',
    price: '₹349',
    rating: 4.8,
    ingredients: ['Amalaki (Amla)', 'Bibhitaki', 'Haritaki'],
    usage: 'Consuming 1-2 tablets with warm water before bed.',
    benefits: ['Gently cleanses digestive tracts', 'Aids natural bowel movements', 'Rich in natural Vitamin C antioxidants'],
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=250&h=250'
  },
  {
    name: 'Bhringraj Scalp Rejuvenation Oil',
    category: 'Hair Care',
    price: '₹420',
    rating: 4.9,
    ingredients: ['Bhringraj extract', 'Coconut oil', 'Sesame oil base', 'Amla'],
    usage: 'Massage warm oil into scalp; leave for 2 hours before washing.',
    benefits: ['Prevents premature graying of hair strands', 'Promotes new hair root growth', 'Eliminates dandruff and cools scalp'],
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=250&h=250'
  },
  {
    name: 'Kumkumadi Radiance Face Serum',
    category: 'Skin Care',
    price: '₹899',
    rating: 5,
    ingredients: ['Kesar (Saffron)', 'Sandalwood', 'Manjistha', 'Licorice extract'],
    usage: 'Apply 3-4 drops on clean face at night; massage gently.',
    benefits: ['Evens skin tone and clears dark spots', 'Restores natural golden glow', 'Moisturizes deep epidermal layers'],
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=250&h=250'
  },
  {
    name: 'Prana Chyawanprash (Immunity Boost)',
    category: 'Immunity',
    price: '₹399',
    rating: 4.9,
    ingredients: ['Fresh Amla pulp', 'Dashmula roots', 'Saffron', 'Pure Forest Honey'],
    usage: 'Take 1 spoonful daily in the morning, followed by warm milk.',
    benefits: ['Defends against seasonal cough and cold', 'Strengthens respiratory linings', 'Invigorates general metabolic vitality'],
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=250&h=250'
  },
  {
    name: 'Orthopedic Sandhi Joint Oil',
    category: 'Pain Relief',
    price: '₹360',
    rating: 4.8,
    ingredients: ['Mahanarayan oil', 'Vishagarbha oil', 'Nilgiri oil', 'Camphor'],
    usage: 'Apply warm oil over affected joints; massage gently; cover warmly.',
    benefits: ['Reduces stiff joints swelling and aches', 'Restores fluid range of motion', 'Provides cooling, deep muscular relief'],
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=250&h=250'
  }
];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [enquireProduct, setEnquireProduct] = useState<string | null>(null);
  const [enquireSuccess, setEnquireSuccess] = useState(false);

  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS_REGISTRY 
    : PRODUCTS_REGISTRY.filter(p => p.category === activeCategory);

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnquireSuccess(true);
    setTimeout(() => {
      setEnquireProduct(null);
      setEnquireSuccess(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] pb-20 font-sans">
      
      {/* Hero Banner Header */}
      <div className="bg-emerald-950 text-white py-16 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900 text-emerald-350 text-xs font-bold uppercase tracking-wider">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Kaya Kalp Herbal Pharmacy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">Organic Ayurvedic Formulations</h1>
        <p className="text-xs text-emerald-250 max-w-xl mx-auto font-medium">
          GMP-certified herbal supplements, medicated oils, and beauty serums formulated by senior Vaidyas.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2.5 justify-center border-b border-stone-200 pb-6 text-xs font-bold">
          {['All', 'Medicines', 'Hair Care', 'Skin Care', 'Immunity', 'Pain Relief'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4.5 py-2 rounded-xl transition-all ${
                activeCategory === cat 
                  ? 'bg-ayur-primary text-white shadow shadow-emerald-950/15' 
                  : 'bg-white border border-stone-200 text-stone-605 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Enquiry form overlay */}
        {enquireProduct && (
          <div className="p-6 rounded-3xl bg-amber-50/60 border border-amber-250 space-y-4 max-w-lg mx-auto text-xs animate-float">
            <div className="flex justify-between items-center border-b border-amber-200 pb-2">
              <span className="font-extrabold text-amber-800">Enquire / Order: {enquireProduct}</span>
              <button onClick={() => setEnquireProduct(null)} className="text-stone-400 hover:text-stone-600 font-bold">Close</button>
            </div>
            
            {enquireSuccess ? (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-ayur-primary font-bold text-center">
                Order request received! Our medical desk will contact you via WhatsApp shortly.
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="Your Name" required className="p-2 border border-stone-200 bg-white rounded-lg" />
                <input type="tel" placeholder="Mobile Number" required className="p-2 border border-stone-200 bg-white rounded-lg" />
                <input type="number" placeholder="Quantity Needed" required className="p-2 border border-stone-200 bg-white rounded-lg col-span-1" />
                <button type="submit" className="py-2 bg-ayur-primary text-white font-bold rounded-lg hover:bg-ayur-secondary col-span-2">
                  Submit Order Enquiry
                </button>
              </form>
            )}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((p, idx) => (
            <div key={idx} className="bg-white border border-stone-200/80 rounded-[32px] overflow-hidden shadow-sm hover:border-emerald-350 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              
              <div>
                {/* Product Image placeholder */}
                <div className="h-48 w-full bg-stone-50 overflow-hidden relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-3 left-3 bg-emerald-950 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                    {p.category}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Name and Rating */}
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-stone-900 leading-snug">{p.name}</h4>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-black text-amber-500 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-500" />
                        {p.rating}
                      </span>
                      <span className="text-[10px] text-stone-400 font-bold">({p.rating === 5 ? '90' : '45'} reviews)</span>
                    </div>
                  </div>

                  {/* Details tabs style content */}
                  <div className="space-y-2 border-t border-stone-100 pt-3 text-[11px] text-stone-605">
                    <div>
                      <strong>Ingredients:</strong> <span className="text-stone-500 font-medium">{p.ingredients.join(', ')}</span>
                    </div>
                    <div>
                      <strong>Usage:</strong> <span className="text-stone-500 font-medium">{p.usage}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <strong>Benefits:</strong>
                      <ul className="space-y-1 pl-2">
                        {p.benefits.map((b, i) => (
                          <li key={i} className="flex items-center gap-1.5 font-medium text-stone-500">
                            <span className="w-1 h-1 rounded-full bg-emerald-600 shrink-0"></span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price and Action */}
              <div className="p-5 border-t border-stone-100 flex justify-between items-center bg-stone-50/50">
                <span className="text-sm font-black text-stone-900">{p.price}</span>
                <button
                  onClick={() => setEnquireProduct(p.name)}
                  className="px-3.5 py-1.5 bg-ayur-primary text-white text-[11px] font-black rounded-lg hover:bg-ayur-secondary transition-all"
                >
                  Order Form
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
