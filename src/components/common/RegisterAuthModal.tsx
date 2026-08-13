import React, { useState, useEffect } from 'react';
import { UserRole, RegisteredUser } from '../../types';
import { 
  X, 
  Check, 
  Store, 
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
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Role, 2: Credentials, 3: Interests, 4: Success
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
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

  useEffect(() => {
    if (isOpen) {
      setSelectedRole(initialRole);
      setStep(1);
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

  const handleFinishRegistration = () => {
    const newUser: RegisteredUser = {
      id: `usr-${Date.now()}`,
      role: selectedRole,
      fullName: fullName || (selectedRole === 'vendor' ? 'Sarah Jenkins' : 'David Miller'),
      email: email || 'vendor@plazr.co.za',
      phone: phone || '+27 82 555 1234',
      businessOrOrgName: businessOrOrgName || (selectedRole === 'vendor' ? 'Bella\'s Vintage & Bakes' : 'Cape Town Artisanal Markets'),
      categoryOrVenue: categoryOrVenue,
      city: city,
      interests: selectedInterests,
      registeredAt: new Date().toISOString()
    };

    onRegisterComplete(newUser);
    setStep(4);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden"
      onClick={onClose}
    >
      <div 
        className="relative flex flex-col w-full max-w-xl bg-white text-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header Progress Bar */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                P
              </span>
              <h2 className="text-lg font-black tracking-tight">Plazr SA — Registration & Onboarding</h2>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Step {step} of 3: {
                step === 1 ? 'Choose Account Type' :
                step === 2 ? 'Credentials & Profile' :
                step === 3 ? 'Filter Your Interests' : 'Welcome Aboard!'
              }
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Pills */}
        <div className="bg-slate-100 px-6 py-2.5 flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-200">
          <div className={`flex items-center space-x-1.5 ${step >= 1 ? 'text-emerald-700 font-black' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>1</span>
            <span>Role</span>
          </div>
          <div className="h-0.5 w-8 bg-slate-300" />
          <div className={`flex items-center space-x-1.5 ${step >= 2 ? 'text-emerald-700 font-black' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>2</span>
            <span>Account Details</span>
          </div>
          <div className="h-0.5 w-8 bg-slate-300" />
          <div className={`flex items-center space-x-1.5 ${step >= 3 ? 'text-emerald-700 font-black' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>3</span>
            <span>Interests</span>
          </div>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">

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
                    placeholder={selectedRole === 'planner' ? 'e.g. Neighbourgoods Market SA' : 'e.g. Bella\'s Vintage & Bakes'}
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
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
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
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs flex items-center space-x-2 shadow-lg transition-all hover:opacity-95"
                >
                  <span>Complete Registration</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REGISTRATION SUCCESS CONFIRMATION */}
          {step === 4 && (
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Welcome to Plazr SA</h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Registered as <strong>{businessOrOrgName || 'User'}</strong> ({selectedRole === 'planner' ? 'Event Organiser' : 'Market Vendor'})
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Selected Interest Preferences</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedInterests.map(i => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-[11px] border border-emerald-200 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>{i}</span>
                    </span>
                  ))}
                </div>
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
