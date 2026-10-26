import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, ShieldCheck, Truck, Globe, 
  Lock, Plus, Edit, Trash2, X, ChevronRight, Menu, CheckCircle, Smartphone, DollarSign, Languages
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';

// Demo Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyForLuckyMoonGlobal2026",
  authDomain: "luckymoon-global.firebaseapp.com",
  projectId: "luckymoon-global",
  storageBucket: "luckymoon-global.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const EXCHANGE_RATE = 310; // 1 USD = 310 LKR (Approx rate)

const TRANSLATIONS = {
  ta: {
    storeTitle: "LuckyMoon Global",
    subtitle: "இலங்கை & உலகளாவிய ஷாப்பிங் மையம்",
    searchPlaceholder: "பொருட்களைத் தேடுங்கள் (உதாரணம்: Tea, Mixer, Shirt)...",
    allCategories: "அனைத்துப் பிரிவுகள்",
    cartTitle: "உங்கள் ஷாப்பிங் கார்ட்",
    emptyCart: "உங்கள் கார்ட் காலியாக உள்ளது",
    checkout: "ஆர்டர் செய்ய",
    total: "மொத்தம்",
    directWhatsapp: "WhatsApp மூலம் ஆர்டர் செய்ய",
    quickOrder: "WhatsApp ஆர்டர்",
    viewDetails: "விவரங்களைப் பார்க்க",
    adminLogin: "நிர்வாகி புகுபதிகை (Admin Login)",
    adminPasscode: "அட்மின் கடவுச்சொல்லை உள்ளிடவும்",
    submit: "உள்நுழை",
    cancel: "ரத்து செய்",
    addProduct: "புதிய பொருளைச் சேர்க்க",
    titleLabel: "பொருளின் பெயர்",
    categoryLabel: "பிரிவு (Category)",
    priceLKR: "விலை (LKR)",
    priceUSD: "விலை (USD)",
    imageURL: "படத்தின் URL",
    descriptionLabel: "விவரம்",
    stockLabel: "இருப்பு எண்ணிக்கை (Stock)",
    save: "சேமிக்கவும்",
    delete: "நீக்கு",
    edit: "திருத்து",
    deliveryType: "விநியோக வகை (Delivery Destination)",
    domestic: "இலங்கை (Sri Lanka)",
    international: "வெளிநாடு (Worldwide Shipping)",
    fullName: "முழு பெயர்",
    phone: "தொலைபேசி எண்",
    address: "முகவரி",
    district: "மாவட்டம் / நகரம்",
    country: "நாடு (Country)",
    postalCode: "அஞ்சல் குறியீடு (Postal Code)",
    placeOrder: "Cash on Delivery - ஆர்டரை உறுதிசெய்",
    orderSuccess: "உங்கள் ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டது!",
    thankYou: "நாங்கள் விரைவில் உங்களைத் தொடர்புகொள்வோம்.",
    currency: "நாணயம்",
    whatsappNumber: "94771234567" // உங்கள் வாட்ஸ்அப் எண்
  },
  en: {
    storeTitle: "LuckyMoon Global",
    subtitle: "Sri Lanka & Worldwide Shopping Hub",
    searchPlaceholder: "Search products (e.g., Tea, Air Fryer, Shirt)...",
    allCategories: "All Categories",
    cartTitle: "Your Shopping Cart",
    emptyCart: "Your cart is empty",
    checkout: "Checkout Now",
    total: "Total",
    directWhatsapp: "Direct Order on WhatsApp",
    quickOrder: "WhatsApp Order",
    viewDetails: "View Details",
    adminLogin: "Admin Login",
    adminPasscode: "Enter Admin Passcode",
    submit: "Login",
    cancel: "Cancel",
    addProduct: "Add New Product",
    titleLabel: "Product Name",
    categoryLabel: "Category",
    priceLKR: "Price (LKR)",
    priceUSD: "Price (USD)",
    imageURL: "Image URL",
    descriptionLabel: "Description",
    stockLabel: "Stock Quantity",
    save: "Save Product",
    delete: "Delete",
    edit: "Edit",
    deliveryType: "Delivery Destination",
    domestic: "Sri Lanka",
    international: "Worldwide Shipping",
    fullName: "Full Name",
    phone: "Phone Number",
    address: "Delivery Address",
    district: "District / City",
    country: "Country",
    postalCode: "Postal Code",
    placeOrder: "Confirm Cash on Delivery Order",
    orderSuccess: "Your Order Has Been Placed!",
    thankYou: "We will contact you shortly to confirm delivery.",
    currency: "Currency",
    whatsappNumber: "94771234567"
  },
  si: {
    storeTitle: "LuckyMoon Global",
    subtitle: "ශ්‍රී ලංකා සහ ලොව පුරා සාප්පු සවාරි මධ්‍යස්ථානය",
    searchPlaceholder: "භාණ්ඩ සොයන්න (උදා: තේ, මික්සර්, කමිස)...",
    allCategories: "සියලුම වර්ග",
    cartTitle: "ඔබගේ සාප්පු කරත්තය",
    emptyCart: "ඔබගේ කරත්තය හිස්ය",
    checkout: "ඇණවුම් කරන්න",
    total: "එකතුව",
    directWhatsapp: "WhatsApp හරහා ඇණවුම් කරන්න",
    quickOrder: "WhatsApp ඇණවුම",
    viewDetails: "විස්තර බලන්න",
    adminLogin: "පරිපාලක පිවිසුම (Admin)",
    adminPasscode: "මුරපදය ඇතුළත් කරන්න",
    submit: "ඇතුළු වන්න",
    cancel: "අවලංගු කරන්න",
    addProduct: "නව භාණ්ඩයක් එකතු කරන්න",
    titleLabel: "භාණ්ඩයේ නම",
    categoryLabel: "වර්ගය",
    priceLKR: "මිල (LKR)",
    priceUSD: "මිල (USD)",
    imageURL: "ඡායාරූප URL",
    descriptionLabel: "විස්තරය",
    stockLabel: "තොග ප්‍රමාණය",
    save: "සුරකින්න",
    delete: "මකා දමන්න",
    edit: "සංස්කරණය",
    deliveryType: "බෙදා හැරීමේ ප්‍රදේශය",
    domestic: "ශ්‍රී ලංකාව තුළ",
    international: "ලොව පුරා (Worldwide)",
    fullName: "සම්පූර්ණ නම",
    phone: "දුරකථන අංකය",
    address: "ලිපිනය",
    district: "දිස්ත්‍රික්කය / නගරය",
    country: "රට (Country)",
    postalCode: "තැපැල් කේතය",
    placeOrder: "ඇණවුම තහවුරු කරන්න (COD)",
    orderSuccess: "ඔබගේ ඇණවුම සාර්ථකයි!",
    thankYou: "අපි ළඟදීම ඔබව සම්බන්ධ කර ගනිමු.",
    currency: "මුදල් වර්ගය",
    whatsappNumber: "94771234567"
  }
};

const INITIAL_PRODUCTS = [
  {
    id: '1',
    title: 'Pure Ceylon BOPF Premium Black Tea (500g)',
    category: 'Ceylon Tea & Spices',
    priceLKR: 1850,
    priceUSD: 6.00,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
    description: 'Freshly packed single-origin premium Ceylon tea from Sri Lankan highlands.',
    stock: 45
  },
  {
    id: '2',
    title: 'Heavy Duty Commercial Mixer Grinder 750W',
    category: 'Home & Kitchen',
    priceLKR: 16500,
    priceUSD: 53.00,
    image: 'https://images.unsplash.com/photo-1585237672814-8f85a8118bf6?auto=format&fit=crop&q=80&w=600',
    description: '3 Stainless steel jars, perfect for Sri Lankan spice grinding and smoothies.',
    stock: 12
  },
  {
    id: '3',
    title: 'Handcrafted Elephant Wooden Carving (10 inch)',
    category: 'Handicrafts & Souvenirs',
    priceLKR: 4500,
    priceUSD: 14.50,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600',
    description: 'Traditional Sri Lankan handcrafted ebony-finish wooden elephant display piece.',
    stock: 8
  },
  {
    id: '4',
    title: 'Smart Touch Air Fryer 4.5L',
    category: 'Home & Kitchen',
    priceLKR: 24900,
    priceUSD: 80.00,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600',
    description: 'Oil-free healthy cooking with LED digital touch controls.',
    stock: 15
  }
];

export default function App() {
  const [lang, setLang] = useState('ta');
  const [currency, setCurrency] = useState('LKR');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState('store'); 
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [selectedProductModal, setSelectedProductModal] = useState(null);

  // Form states
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [deliveryType, setDeliveryType] = useState('domestic');
  const [customerDetails, setCustomerDetails] = useState({
    name: '', phone: '', address: '', district: '', country: 'Sri Lanka', postalCode: ''
  });

  // Admin New Product state
  const [productForm, setProductForm] = useState({
    id: '', title: '', category: 'Home & Kitchen', priceLKR: '', priceUSD: '', image: '', description: '', stock: 10
  });

  const t = TRANSLATIONS[lang];

  const categories = [
    'All',
    'Home & Kitchen',
    'Ceylon Tea & Spices',
    'Electronics & Gadgets',
    'Fashion & Apparel',
    'Handicrafts & Souvenirs',
    'Beauty & Wellness',
    'Mobiles & Accessories'
  ];

  const formatPrice = (priceLKR, priceUSD) => {
    if (currency === 'USD') {
      const usdVal = priceUSD || (priceLKR / EXCHANGE_RATE).toFixed(2);
      return `$ ${usdVal}`;
    }
    return `Rs. ${Number(priceLKR).toLocaleString()}`;
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const cartTotal = cart.reduce((sum, item) => {
    const val = currency === 'USD' ? (item.priceUSD || (item.priceLKR / EXCHANGE_RATE)) : item.priceLKR;
    return sum + (val * item.qty);
  }, 0);

  const handleAdminAuth = (e) => {
    e.preventDefault();
    if (adminPasswordInput === 'admin123') {
      setIsAdminAuthenticated(true);
      setShowAdminLoginModal(false);
      setView('admin');
      setAdminPasswordInput('');
    } else {
      alert('தவறான கடவுச்சொல்! (Incorrect Passcode)');
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (productForm.id) {
      setProducts(products.map(p => p.id === productForm.id ? { ...productForm, priceLKR: Number(productForm.priceLKR), priceUSD: Number(productForm.priceUSD) } : p));
    } else {
      const newP = {
        ...productForm,
        id: Date.now().toString(),
        priceLKR: Number(productForm.priceLKR),
        priceUSD: Number(productForm.priceUSD) || Number((productForm.priceLKR / EXCHANGE_RATE).toFixed(2))
      };
      setProducts([newP, ...products]);
    }
    setProductForm({ id: '', title: '', category: 'Home & Kitchen', priceLKR: '', priceUSD: '', image: '', description: '', stock: 10 });
  };

  const sendWhatsAppOrder = (item = null) => {
    let message = `*NEW ORDER - LuckyMoon Global*\n\n`;
    if (item) {
      const priceText = formatPrice(item.priceLKR, item.priceUSD);
      message += `📦 *Product:* ${item.title}\n💰 *Price:* ${priceText}\n\n`;
    } else {
      message += `🛒 *Cart Items:*\n`;
      cart.forEach((i, idx) => {
        message += `${idx + 1}. ${i.title} x ${i.qty} = ${formatPrice(i.priceLKR * i.qty, i.priceUSD * i.qty)}\n`;
      });
      message += `\n💵 *Total Amount:* ${currency === 'USD' ? '$' : 'Rs.'} ${cartTotal.toLocaleString()}\n\n`;
    }
    
    if (customerDetails.name) {
      message += `👤 *Customer:* ${customerDetails.name}\n📞 *Phone:* ${customerDetails.phone}\n📍 *Address:* ${customerDetails.address}, ${customerDetails.district || customerDetails.country}\n`;
    }

    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${t.whatsappNumber}?text=${encodedMsg}`, '_blank');
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Notification Bar */}
      <div className="bg-slate-900 text-amber-400 px-4 py-1.5 text-xs flex justify-between items-center border-b border-amber-500/30">
        <div className="flex items-center space-x-2">
          <Truck className="w-3.5 h-3.5" />
          <span>Islandwide Delivery & Worldwide Shipping Available!</span>
        </div>
        
        {/* Controls: Language & Currency */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-slate-800 text-amber-300 text-xs rounded px-1.5 py-0.5 border border-amber-500/40 focus:outline-none"
            >
              <option value="LKR">LKR (Rs.)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="bg-slate-800 text-amber-300 text-xs rounded px-1.5 py-0.5 border border-amber-500/40 focus:outline-none"
            >
              <option value="ta">தமிழ்</option>
              <option value="en">English</option>
              <option value="si">සිංහල</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView('store')}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-900 font-bold text-xl shadow-lg">
              LM
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-amber-400">{t.storeTitle}</h1>
              <p className="text-xs text-slate-400">{t.subtitle}</p>
            </div>
          </div>

          {/* Cart Icon */}
          <div className="flex items-center space-x-4">
            {view === 'admin' ? (
              <button 
                onClick={() => setView('store')} 
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-3 py-1.5 rounded-lg text-xs"
              >
                Storefront
              </button>
            ) : (
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full border border-slate-700 transition"
              >
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cart.reduce((a, b) => a + b.qty, 0)}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {view === 'store' && (
          <div className="max-w-7xl mx-auto px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 text-white text-sm rounded-lg pl-9 pr-4 py-2 border border-slate-700 focus:outline-none focus:border-amber-400 placeholder-slate-400"
              />
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      {view === 'store' ? (
        <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
          {/* eBay Style Category Strip */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-4 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat 
                    ? 'bg-amber-500 text-slate-900 shadow-md' 
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat === 'All' ? t.allCategories : cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-2 right-2 bg-slate-900/80 text-amber-400 text-[10px] font-medium px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm line-clamp-2">{product.title}</h3>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">{product.description}</p>
                  </div>

                  <div className="mt-4">
                    <div className="text-lg font-bold text-slate-900">
                      {formatPrice(product.priceLKR, product.priceUSD)}
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center space-x-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>

                      <button
                        onClick={() => sendWhatsAppOrder(product)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center space-x-1"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : (
        /* Hidden Admin Panel */
        <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
            <button 
              onClick={() => setView('store')}
              className="text-slate-600 hover:text-slate-900 text-sm font-semibold"
            >
              Back to Store
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add / Edit Form */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-fit">
              <h3 className="text-base font-bold text-slate-900 mb-4">{t.addProduct}</h3>
              <form onSubmit={handleSaveProduct} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">{t.titleLabel}</label>
                  <input 
                    type="text" required 
                    value={productForm.title} 
                    onChange={e => setProductForm({...productForm, title: e.target.value})}
                    className="w-full border rounded p-2 text-sm mt-1 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">{t.categoryLabel}</label>
                  <select 
                    value={productForm.category}
                    onChange={e => setProductForm({...productForm, category: e.target.value})}
                    className="w-full border rounded p-2 text-sm mt-1 focus:outline-none focus:border-amber-500"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">{t.priceLKR}</label>
                    <input 
                      type="number" required 
                      value={productForm.priceLKR} 
                      onChange={e => setProductForm({...productForm, priceLKR: e.target.value})}
                      className="w-full border rounded p-2 text-sm mt-1 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">{t.priceUSD}</label>
                    <input 
                      type="number" step="0.01"
                      value={productForm.priceUSD} 
                      onChange={e => setProductForm({...productForm, priceUSD: e.target.value})}
                      className="w-full border rounded p-2 text-sm mt-1 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">{t.imageURL}</label>
                  <input 
                    type="url" required 
                    value={productForm.image} 
                    onChange={e => setProductForm({...productForm, image: e.target.value})}
                    className="w-full border rounded p-2 text-sm mt-1 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">{t.descriptionLabel}</label>
                  <textarea 
                    rows="2" required 
                    value={productForm.description} 
                    onChange={e => setProductForm({...productForm, description: e.target.value})}
                    className="w-full border rounded p-2 text-sm mt-1 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-slate-900 text-amber-400 font-bold py-2 rounded-lg text-sm mt-2 hover:bg-slate-800"
                >
                  {t.save}
                </button>
              </form>
            </div>

            {/* Existing Product List */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Manage Products</h3>
              <div className="space-y-3">
                {products.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                    <div className="flex items-center space-x-3">
                      <img src={p.image} alt="" className="w-12 h-12 object-cover rounded" />
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900">{p.title}</h4>
                        <p className="text-xs text-slate-500">{p.category} - Rs. {p.priceLKR} / ${p.priceUSD}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setProductForm(p)} 
                        className="p-1.5 text-slate-600 hover:text-amber-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setProducts(products.filter(item => item.id !== p.id))} 
                        className="p-1.5 text-slate-600 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Shopping Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex justify-end">
          <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <h2 className="font-bold text-amber-400">{t.cartTitle}</h2>
              <button onClick={() => setIsCartOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-slate-500 py-10">{t.emptyCart}</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center space-x-3 border-b pb-3">
                    <img src={item.image} alt="" className="w-14 h-14 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-xs text-slate-800">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{formatPrice(item.priceLKR, item.priceUSD)} x {item.qty}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => setCart(cart.map(i => i.id === item.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))}
                        className="px-2 py-1 bg-slate-100 rounded text-xs"
                      >-</button>
                      <span className="text-xs font-bold px-1">{item.qty}</span>
                      <button 
                        onClick={() => setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))}
                        className="px-2 py-1 bg-slate-100 rounded text-xs"
                      >+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t bg-slate-50 space-y-3">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{t.total}:</span>
                  <span>{currency === 'USD' ? '$' : 'Rs.'} {cartTotal.toLocaleString()}</span>
                </div>
                
                <button 
                  onClick={() => sendWhatsAppOrder()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center space-x-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{t.directWhatsapp}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer & Secret Admin Lock Icon */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <p className="font-semibold text-amber-400">LuckyMoon Global © 2026</p>
            <p className="mt-1 text-[11px] text-slate-500">Sri Lanka Domestic & International eCommerce Marketplace</p>
          </div>

          {/* Secret Admin Passcode Modal Trigger */}
          <button 
            onClick={() => setShowAdminLoginModal(true)}
            className="p-2 text-slate-700 hover:text-amber-400 transition"
            title="Admin Portal"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* Secret Admin Passcode Modal */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl">
            <h3 className="font-bold text-slate-900 text-base mb-2">{t.adminLogin}</h3>
            <p className="text-xs text-slate-500 mb-4">{t.adminPasscode}</p>
            <form onSubmit={handleAdminAuth} className="space-y-3">
              <input 
                type="password" required 
                placeholder="Passcode (Default: admin123)"
                value={adminPasswordInput}
                onChange={e => setAdminPasswordInput(e.target.value)}
                className="w-full border rounded p-2 text-sm focus:outline-none focus:border-amber-500"
              />
              <div className="flex space-x-2">
                <button 
                  type="button" 
                  onClick={() => setShowAdminLoginModal(false)}
                  className="w-1/2 bg-slate-100 text-slate-700 py-2 rounded text-xs font-semibold"
                >
                  {t.cancel}
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 bg-slate-900 text-amber-400 py-2 rounded text-xs font-bold"
                >
                  {t.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
