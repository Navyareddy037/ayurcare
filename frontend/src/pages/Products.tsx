import React, { useState } from 'react';
import { 
  Heart, Sparkles, CheckCircle2, ShoppingBag, Info, 
  HelpCircle, ArrowRight, Star, RefreshCw, MessageSquare, Plus, Minus, CreditCard, Check
} from 'lucide-react';

interface ProductItem {
  name: string;
  category: 'Medicines' | 'Hair Care' | 'Skin Care' | 'Immunity' | 'Pain Relief';
  price: number; // changed to number for calculations
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
    price: 299,
    rating: 5,
    ingredients: ['100% Organic Withania Somnifera root powder'],
    usage: 'Take 1/2 tsp with warm milk or water before sleep.',
    benefits: ['Lowers cortisol stress levels', 'Calms the nervous system', 'Increases cellular stamina'],
    image: 'https://images.unsplash.com/photo-1611070973770-b1a60c2661f8?auto=format&fit=crop&q=80&w=250&h=250'
  },
  {
    name: 'Pure Triphala Tablets',
    category: 'Medicines',
    price: 349,
    rating: 4.8,
    ingredients: ['Amalaki (Amla)', 'Bibhitaki', 'Haritaki'],
    usage: 'Consuming 1-2 tablets with warm water before bed.',
    benefits: ['Gently cleanses digestive tracts', 'Aids natural bowel movements', 'Rich in natural Vitamin C antioxidants'],
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=250&h=250'
  },
  {
    name: 'Bhringraj Scalp Rejuvenation Oil',
    category: 'Hair Care',
    price: 420,
    rating: 4.9,
    ingredients: ['Bhringraj extract', 'Coconut oil', 'Sesame oil base', 'Amla'],
    usage: 'Massage warm oil into scalp; leave for 2 hours before washing.',
    benefits: ['Prevents premature graying of hair strands', 'Promotes new hair root growth', 'Eliminates dandruff and cools scalp'],
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=250&h=250'
  },
  {
    name: 'Kumkumadi Radiance Face Serum',
    category: 'Skin Care',
    price: 899,
    rating: 5,
    ingredients: ['Kesar (Saffron)', 'Sandalwood', 'Manjistha', 'Licorice extract'],
    usage: 'Apply 3-4 drops on clean face at night; massage gently.',
    benefits: ['Evens skin tone and clears dark spots', 'Restores natural golden glow', 'Moisturizes deep epidermal layers'],
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=250&h=250'
  },
  {
    name: 'Prana Chyawanprash (Immunity Boost)',
    category: 'Immunity',
    price: 399,
    rating: 4.9,
    ingredients: ['Fresh Amla pulp', 'Dashmula roots', 'Saffron', 'Pure Forest Honey'],
    usage: 'Take 1 spoonful daily in the morning, followed by warm milk.',
    benefits: ['Defends against seasonal cough and cold', 'Strengthens respiratory linings', 'Invigorates general metabolic vitality'],
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=250&h=250'
  },
  {
    name: 'Orthopedic Sandhi Joint Oil',
    category: 'Pain Relief',
    price: 360,
    rating: 4.8,
    ingredients: ['Mahanarayan oil', 'Vishagarbha oil', 'Nilgiri oil', 'Camphor'],
    usage: 'Apply warm oil over affected joints; massage gently; cover warmly.',
    benefits: ['Reduces stiff joints swelling and aches', 'Restores fluid range of motion', 'Provides cooling, deep muscular relief'],
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=250&h=250'
  }
];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Checkout Modal states
  const [checkoutProduct, setCheckoutProduct] = useState<ProductItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS_REGISTRY 
    : PRODUCTS_REGISTRY.filter(p => p.category === activeCategory);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !shippingAddress || !pincode) return;

    setPlacingOrder(true);
    setTimeout(() => {
      setPlacingOrder(false);
      setOrderPlaced(true);
    }, 1200);
  };

  const resetCheckout = () => {
    setCheckoutProduct(null);
    setQuantity(1);
    setCustomerName('');
    setCustomerPhone('');
    setShippingAddress('');
    setPincode('');
    setPaymentMode('UPI');
    setOrderPlaced(false);
  };

  const getSubtotal = () => {
    if (!checkoutProduct) return 0;
    return checkoutProduct.price * quantity;
  };

  const getShippingCost = () => {
    const sub = getSubtotal();
    return sub >= 500 ? 0 : 50;
  };

  const getTotal = () => {
    return getSubtotal() + getShippingCost();
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] pb-20 font-sans">
      
      {/* Hero Header */}
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

        {/* Premium Checkout Modal */}
        {checkoutProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-[32px] border border-stone-200 shadow-xl max-w-2xl w-full p-6 relative overflow-hidden flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto">
              
              <button 
                onClick={resetCheckout}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 font-extrabold text-sm border border-stone-200 p-1 px-2.5 rounded-lg"
              >
                ✕
              </button>

              {orderPlaced ? (
                <div className="w-full py-10 flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-ayur-primary border border-emerald-200 flex items-center justify-center">
                    <Check className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-black text-stone-900">Order Placed Successfully!</h3>
                    <p className="text-xs text-stone-550 max-w-xs mx-auto">
                      Your order for **{quantity}x {checkoutProduct.name}** has been recorded under Order ID: **KK-{(Math.random()*100000).toFixed(0)}**.
                    </p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-150 text-[10.5px] text-stone-500 font-medium">
                    We will send shipping coordinates to **{customerPhone}** via WhatsApp.
                  </div>
                  <button 
                    onClick={resetCheckout}
                    className="px-5 py-2.5 bg-ayur-primary text-white text-xs font-bold rounded-xl hover:bg-ayur-secondary"
                  >
                    Return to Pharmacy
                  </button>
                </div>
              ) : (
                <>
                  {/* Left Column: Product Summary & pricing */}
                  <div className="w-full md:w-1/2 space-y-5">
                    <div className="space-y-3">
                      <div className="h-40 w-full rounded-2xl overflow-hidden bg-stone-50">
                        <img src={checkoutProduct.image} alt={checkoutProduct.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-[9px] bg-emerald-950 text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          {checkoutProduct.category}
                        </span>
                        <h4 className="font-extrabold text-sm text-stone-905 mt-1.5 leading-snug">{checkoutProduct.name}</h4>
                        <span className="text-xs font-black text-stone-850 block mt-1">₹{checkoutProduct.price} / unit</span>
                      </div>
                    </div>

                    <div className="border-t border-stone-100 pt-4 space-y-3.5 text-xs">
                      {/* Quantity adjustment */}
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-stone-600">Select Quantity</span>
                        <div className="flex items-center gap-2 border border-stone-250 rounded-lg p-0.5">
                          <button 
                            type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="p-1 hover:bg-stone-50 text-stone-500"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center font-black">{quantity}</span>
                          <button 
                            type="button" onClick={() => setQuantity(q => q + 1)}
                            className="p-1 hover:bg-stone-50 text-stone-500"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Pricing breakdowns */}
                      <div className="space-y-1 bg-stone-50 p-3 rounded-xl border border-stone-150">
                        <div className="flex justify-between text-stone-550">
                          <span>Subtotal</span>
                          <span>₹{getSubtotal()}</span>
                        </div>
                        <div className="flex justify-between text-stone-550">
                          <span>Shipping Cost</span>
                          <span>{getShippingCost() === 0 ? 'FREE' : `₹${getShippingCost()}`}</span>
                        </div>
                        <div className="flex justify-between font-black text-stone-900 border-t border-stone-200/50 pt-1.5 mt-1.5">
                          <span>Total Amount</span>
                          <span>₹{getTotal()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Checkout Shipping Form */}
                  <form onSubmit={handleCheckoutSubmit} className="w-full md:w-1/2 space-y-4 text-xs">
                    <h3 className="font-extrabold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-100 pb-2">
                      <CreditCard className="w-4 h-4 text-ayur-primary" />
                      Shipping Details
                    </h3>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="font-bold text-stone-550 block">Receiver's Name</label>
                        <input 
                          type="text" required placeholder="Full Name" value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full p-2 border border-stone-200 bg-white rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-stone-550 block">Mobile Number (WhatsApp Support)</label>
                        <input 
                          type="tel" required placeholder="e.g. +91 9827000000" value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full p-2 border border-stone-200 bg-white rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-stone-550 block">Shipping Address</label>
                        <textarea 
                          required rows={2} placeholder="Complete Street Address, City" value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          className="w-full p-2 border border-stone-200 bg-white rounded-lg text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-stone-550 block">Pincode</label>
                        <input 
                          type="text" required maxLength={6} placeholder="452001" value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full p-2 border border-stone-200 bg-white rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-stone-550 block">Payment Mode</label>
                        <select 
                          value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}
                          className="w-full p-2 border border-stone-200 bg-white rounded-lg text-stone-605"
                        >
                          <option>UPI / NetBanking</option>
                          <option>Cash on Delivery (COD)</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      type="submit" disabled={placingOrder}
                      className="w-full py-2.5 bg-ayur-primary hover:bg-ayur-secondary text-white font-extrabold rounded-xl shadow-sm transition-all"
                    >
                      {placingOrder ? 'Processing Order secure gateway...' : `Place Order (₹${getTotal()})`}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((p, idx) => (
            <div key={idx} className="bg-white border border-stone-200/80 rounded-[32px] overflow-hidden shadow-sm hover:border-emerald-350 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              
              <div>
                <div className="h-48 w-full bg-stone-50 overflow-hidden relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-3 left-3 bg-emerald-950 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                    {p.category}
                  </span>
                </div>

                <div className="p-5 space-y-4">
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

                  <div className="space-y-2 border-t border-stone-105 pt-3 text-[11px] text-stone-605">
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

              <div className="p-5 border-t border-stone-100 flex justify-between items-center bg-stone-50/50">
                <span className="text-sm font-black text-stone-900">₹{p.price}</span>
                <button
                  onClick={() => setCheckoutProduct(p)}
                  className="px-3.5 py-1.5 bg-ayur-primary text-white text-[11px] font-black rounded-lg hover:bg-ayur-secondary transition-all"
                >
                  Buy Now
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
