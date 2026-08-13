import React, { useState, useEffect } from 'react';
import { UserRole, RegisteredUser } from '../../types';
import { registerUser, loginUser } from '../../lib/db';
import { 
  X, 
  Check, 
  Calendar, 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Tag, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Building2,
  ShoppingBag,
  Flame,
  Shirt,
  Cookie,
  Coffee,
  Gem,
  Palette,
  Leaf,
  Moon,
  Eye,
  EyeOff,
  Loader2,
  Database,
  ShieldCheck,
  Sparkles as SparkleIcon
} from 'lucide-react';

interface RegisterAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterComplete: (user: RegisteredUser) => void;
  initialRole?: UserRole;
}

export const INTEREST_OPTIONS = [
  { id: 'baked_goods', label: 'Baked Goods & Pastries', tag: '#BakedGoods', icon: Cookie, color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'vintage_clothes', label: 'Vintage Clothes & Thrift', tag: '#VintageClothes', icon: Shirt, color: 'bg-purple-100 text-purple-900 border-purple-300' },
  { id: 'artisanal_food', label: 'Artisanal Gourmet Food', tag: '#ArtisanalFood', icon: Flame, color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'specialty_coffee', label: 'Specialty Coffee & Beverages', tag: '#CoffeeAndDrinks', icon: Coffee, color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
  { id: 'jewellery', label: 'Handcrafted Jewellery', tag: '#Jewellery', icon: Gem, color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { id: 'crafts', label: 'Local Art & Crafts', tag: '#Crafts', icon: Palette, color: 'bg-blue-100 text-blue-900 border-blue-300' },
  { id: 'vegan', label: 'Vegan & Plant-Based', tag: '#Vegan', icon: Leaf, color: 'bg-green-100 text-green-900 border-green-300' },
  { id: 'halal', label: 'Halal Certified Delights', tag: '#Halal', icon: Moon, color: 'bg-teal-100 text-teal-900 border-teal-300' },
  { id: 'beauty_wellness', label: 'Beauty, Soaps & Wellness', tag: '#BeautyWellness', icon: SparkleIcon, color: 'bg-pink-100 text-pink-900 border-pink-300' },
  { id: 'home_decor', label: 'Home Decor & Ceramics', tag: '#HomeDecor', icon: Building2, color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
];

export const RegisterAuthModal: React.FC<RegisterAuthModalProps> = ({
  isOpen,
  onClose,
  onRegisterComplete,
  initialRole = 'vendor'
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Role, 2: Credentials, 3: Interests, 4: Success
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [businessOrOrgName, setBusinessOrOrgName] = useState('');
  const [categoryOrVenue, setCategoryOrVenue] = useState('Artisanal Food & Bakes');
  const [city, setCity] = useState('Cape Town & Winelands');

  // Interests Selection
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Baked Goods & Pastries',
    'Vintage Clothes & Thrift',
    'Artisanal Gourmet Food'
  ]);

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedRole(initialRole);
      setStep(1);
      setFormError('');
    }
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  const toggleInterest = (interestLabel: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestLabel)
        ? prev.filter(i => i !== interestLabel)
        : [...prev, interestLabel]
    );
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim() || !businessOrOrgName.trim()) {
      setFormError('Please complete all required fields.');
      return;
    }
    setFormError('');
    setStep(3); // Proceed to Interests step
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setFormError('Please enter your email and password.');
      return;
    }
    setFormError('');
    setIsSubmitting(true);

    try {
      // Authenticate with Neon DB
      const user = await loginUser(email, password);
      onRegisterComplete(user);
      setStep(4);
    } catch (err: any) {
      console.warn('Neon DB login error:', err.message);
      setFormError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishRegistration = async () => {
    setFormError('');
    setIsSubmitting(true);

    try {
      // Register with Neon DB
      const user = await registerUser({
        fullName: fullName || (selectedRole === 'vendor' ? 'Sarah Jenkins' : 'David Miller'),
        email: email || 'vendor@plazr.co.za',
        password: password || 'password123',
        role: selectedRole,
        businessOrOrgName: businessOrOrgName || (selectedRole === 'vendor' ? "Bella's Vintage & Bakes" : 'Cape Town Artisanal Markets'),
        categoryOrVenue,
        city,
        phone: phone || '+27 82 555 1234',
        interests: selectedInterests
      });

      onRegisterComplete(user);
      setStep(4);
    } catch (err: any) {
      console.warn('Neon DB registration error:', err.message);
      setFormError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden"
      onClick={onClose}
    >
      <div 
        className="relative flex flex-col w-full max-w-xl bg-white text-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                P
              </span>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <span>Plazr SA</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Database className="w-2.5 h-2.5" />
                  <span>Neon Connected</span>
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {authMode === 'login' ? 'Welcome back! Sign in to your account' : `Step ${step} of 3: ${
                step === 1 ? 'Choose Account Type' :
                step === 2 ? 'Credentials & Profile' :
                step === 3 ? 'Filter Your Interests' : 'Welcome Aboard!'
              }`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Login / Create Account */}
        <div className="bg-slate-100 px-6 py-2 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center bg-slate-200/80 p-1 rounded-xl w-full max-w-xs text-xs font-bold">
            <button
              onClick={() => { setAuthMode('register'); setFormError(''); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                authMode === 'register' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => { setAuthMode('login'); setFormError(''); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                authMode === 'login' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
          </div>

          {authMode === 'register' && step < 4 && (
            <div className="hidden sm:flex items-center space-x-2 text-[11px] font-extrabold text-slate-500">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-300'}`}>1</span>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-300'}`}>2</span>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-300'}`}>3</span>
            </div>
          )}
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">

          {/* SIGN IN FORM MODE */}
          {authMode === 'login' && step !== 4 && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center space-y-1 pb-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Sign In to Plazr</h3>
                <p className="text-xs text-slate-500 font-medium">Enter your registered email and password to access your dashboard</p>
              </div>

              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center space-x-2">
                  <X className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Super Admin Quick Access Panel */}
              <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 space-y-2">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="flex items-center gap-1.5 text-purple-900">
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    <span>Super Admin Instant Sign-In</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => { setEmail('mraaziqp@gmail.com'); setPassword('admin123'); }}
                    className="px-3 py-1.5 rounded-xl bg-purple-950 text-white text-[11px] font-extrabold hover:bg-purple-900 transition-colors shadow-xs flex items-center gap-1"
                  >
                    <span>⚡ mraaziqp@gmail.com</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmail('raziashade4@gmail.com'); setPassword('admin123'); }}
                    className="px-3 py-1.5 rounded-xl bg-purple-950 text-white text-[11px] font-extrabold hover:bg-purple-900 transition-colors shadow-xs flex items-center gap-1"
                  >
                    <span>⚡ raziashade4@gmail.com</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah@artisanalbakes.co.za"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Password *</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Authenticating with Neon DB...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setFormError(''); }}
                    className="text-emerald-700 font-extrabold hover:underline"
                  >
                    Create a free account
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* CREATE ACCOUNT MODE */}
          {authMode === 'register' && (
            <>
              {/* STEP 1: ROLE SELECTION */}
              {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right duration-200">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">How will you be using Plazr?</h3>
                    <p className="text-xs text-slate-500 font-medium">Select your primary role to customize your market workflow & dashboard</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Event Organiser Option */}
                    <button
                      onClick={() => setSelectedRole('planner')}
                      className={`p-5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between space-y-4 relative ${
                        selectedRole === 'planner'
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {selectedRole === 'planner' && (
                        <span className="absolute top-3 right-3 bg-emerald-600 text-white p-1 rounded-full">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-black uppercase text-indigo-700 tracking-wider">Event Host</span>
                        <h4 className="text-base font-extrabold text-slate-900">Event Organiser</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          Host street markets & festivals. Review vendor applications, issue stall invoices & assign floorplan spots.
                        </p>
                      </div>
                    </button>

                    {/* Market Vendor Option */}
                    <button
                      onClick={() => setSelectedRole('vendor')}
                      className={`p-5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between space-y-4 relative ${
                        selectedRole === 'vendor'
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {selectedRole === 'vendor' && (
                        <span className="absolute top-3 right-3 bg-emerald-600 text-white p-1 rounded-full">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-black uppercase text-amber-800 tracking-wider">Merchant / Creator</span>
                        <h4 className="text-base font-extrabold text-slate-900">Market Vendor</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          Sell baked goods, vintage clothes, artisanal food or crafts. Apply for top market stalls & manage compliance docs.
                        </p>
                      </div>
                    </button>

                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md transition-all"
                    >
                      <span>Continue as {selectedRole === 'planner' ? 'Event Organiser' : 'Market Vendor'}</span>
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: ROLE-SPECIFIC CREDENTIALS FORM */}
              {step === 2 && (
                <form onSubmit={handleNextStep2} className="space-y-4 animate-in slide-in-from-right duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        {selectedRole === 'planner' ? 'Organiser Credentials' : 'Vendor Profile Setup'}
                      </h3>
                      <p className="text-xs text-slate-500">Provide your credentials and details for market operations</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                      {selectedRole === 'planner' ? (
                        <>
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Organiser</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                          <span>Vendor</span>
                        </>
                      )}
                    </span>
                  </div>

                  {formError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>Full Name / Contact Person *</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sarah Jenkins"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>Email Address *</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. sarah@artisanalbakes.co.za"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Business / Org Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>{selectedRole === 'planner' ? 'Event Series / Org Name *' : 'Brand / Business Name *'}</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={selectedRole === 'planner' ? 'e.g. Neighbourgoods Market SA' : "e.g. Bella's Vintage & Bakes"}
                        value={businessOrOrgName}
                        onChange={(e) => setBusinessOrOrgName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* WhatsApp Phone Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>WhatsApp Contact Number</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +27 82 555 1234"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Category or Primary Venue */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                        <Tag className="w-3.5 h-3.5 text-slate-500" />
                        <span>{selectedRole === 'planner' ? 'Primary Event Venue / Address' : 'Primary Goods Category'}</span>
                      </label>
                      {selectedRole === 'planner' ? (
                        <input
                          type="text"
                          placeholder="e.g. The Old Biscuit Mill, Woodstock"
                          value={categoryOrVenue}
                          onChange={(e) => setCategoryOrVenue(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      ) : (
                        <select
                          value={categoryOrVenue}
                          onChange={(e) => setCategoryOrVenue(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        >
                          <option value="Artisanal Food & Bakes">Baked Goods & Artisanal Food</option>
                          <option value="Vintage Fashion & Thrift">Vintage Clothes & Apparel</option>
                          <option value="Handcrafted Jewellery">Handcrafted Jewellery</option>
                          <option value="Specialty Coffee & Beverages">Specialty Coffee & Drinks</option>
                          <option value="Local Art & Crafts">Local Art & Woodwork Crafts</option>
                          <option value="Beauty & Organic Soaps">Beauty, Soaps & Wellness</option>
                        </select>
                      )}
                    </div>

                    {/* Region / City */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>South African Region</span>
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      >
                        <option value="Cape Town & Winelands">Cape Town & Winelands</option>
                        <option value="Johannesburg & Sandton">Johannesburg & Sandton</option>
                        <option value="Durban & Coast">Durban & Coast</option>
                        <option value="Pretoria & Tshwane">Pretoria & Tshwane</option>
                        <option value="Garden Route & Knysna">Garden Route & Knysna</option>
                      </select>
                    </div>

                    {/* Password */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Secure Password *</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center space-x-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center space-x-2 shadow-md transition-all"
                    >
                      <span>Next: Select Interests</span>
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: INTEREST SELECTION (FILTER PREFERENCES) */}
              {step === 3 && (
                <div className="space-y-5 animate-in slide-in-from-right duration-200">
                  <div className="text-center space-y-1">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 border border-amber-300 text-xs font-black">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Personalize Your Plazr Feed</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">What items or markets are you interested in?</h3>
                    <p className="text-xs text-slate-500 font-medium">Select tags below (e.g., baked goods, vintage clothes) to filter events and applicant matches</p>
                  </div>

                  {formError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                    {INTEREST_OPTIONS.map((item) => {
                      const isSelected = selectedInterests.includes(item.label);
                      const IconComp = item.icon;

                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleInterest(item.label)}
                          className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between space-x-2 ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <div className={`p-2 rounded-xl shrink-0 ${item.color}`}>
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <p className="text-xs font-extrabold text-slate-900 truncate">{item.label}</p>
                              <span className="text-[10px] text-slate-400 font-bold">{item.tag}</span>
                            </div>
                          </div>

                          <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs transition-colors ${
                            isSelected ? 'bg-emerald-600 text-white' : 'border border-slate-300 text-transparent'
                          }`}>
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-between">
                    <span>Selected Interests: <strong>{selectedInterests.length} Categories</strong></span>
                    <span className="text-emerald-700 font-bold text-[11px]">Auto-applies feed filters</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center space-x-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      onClick={handleFinishRegistration}
                      disabled={isSubmitting}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs flex items-center space-x-2 shadow-lg transition-all hover:opacity-95 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Connecting to Neon...</span>
                        </>
                      ) : (
                        <>
                          <span>Complete Registration</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 4 && (
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Welcome to Plazr SA</h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Signed in as <strong>{businessOrOrgName || fullName || email}</strong> ({selectedRole === 'planner' ? 'Event Organiser' : 'Market Vendor'})
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-left space-y-2">
                <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Neon Database Connected & Synced</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">Your credentials and role settings have been secured in your Neon PostgreSQL database.</p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <span>Launch Tailored Dashboard</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
