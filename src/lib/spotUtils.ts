import { SpotCategoryGroup } from '../types';

export interface SpotCategoryMeta {
  group: SpotCategoryGroup;
  iconName: string;
  emoji: string;
  colorName: string;
  badgeClass: string;
  bgClass: string;
  lightBgClass: string;
  borderClass: string;
  textClass: string;
  hexColor: string;
}

export const SPOT_CATEGORY_CONFIGS: Record<SpotCategoryGroup, SpotCategoryMeta> = {
  'Food & Beverage': {
    group: 'Food & Beverage',
    iconName: 'Utensils',
    emoji: '🍕',
    colorName: 'Amber / Food',
    badgeClass: 'bg-amber-500 text-slate-950 font-black',
    bgClass: 'bg-amber-500',
    lightBgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-400',
    textClass: 'text-amber-800',
    hexColor: '#f59e0b'
  },
  'Artisanal & Crafts': {
    group: 'Artisanal & Crafts',
    iconName: 'Palette',
    emoji: '🎨',
    colorName: 'Emerald / Crafts',
    badgeClass: 'bg-emerald-500 text-slate-950 font-black',
    bgClass: 'bg-emerald-500',
    lightBgClass: 'bg-emerald-50/90',
    borderClass: 'border-emerald-400',
    textClass: 'text-emerald-800',
    hexColor: '#10b981'
  },
  'Apparel & Vintage': {
    group: 'Apparel & Vintage',
    iconName: 'Shirt',
    emoji: '👗',
    colorName: 'Indigo / Fashion',
    badgeClass: 'bg-indigo-500 text-white font-black',
    bgClass: 'bg-indigo-500',
    lightBgClass: 'bg-indigo-50/90',
    borderClass: 'border-indigo-400',
    textClass: 'text-indigo-800',
    hexColor: '#6366f1'
  },
  'Beauty & Wellness': {
    group: 'Beauty & Wellness',
    iconName: 'Sparkles',
    emoji: '💅',
    colorName: 'Rose / Wellness',
    badgeClass: 'bg-rose-500 text-white font-black',
    bgClass: 'bg-rose-500',
    lightBgClass: 'bg-rose-50/90',
    borderClass: 'border-rose-400',
    textClass: 'text-rose-800',
    hexColor: '#ec4899'
  },
  'General Retail': {
    group: 'General Retail',
    iconName: 'ShoppingBag',
    emoji: '🛍️',
    colorName: 'Blue / Retail',
    badgeClass: 'bg-blue-500 text-white font-black',
    bgClass: 'bg-blue-500',
    lightBgClass: 'bg-blue-50/90',
    borderClass: 'border-blue-400',
    textClass: 'text-blue-800',
    hexColor: '#3b82f6'
  }
};

export const getSpotCategoryConfig = (group?: SpotCategoryGroup): SpotCategoryMeta => {
  if (group && SPOT_CATEGORY_CONFIGS[group]) {
    return SPOT_CATEGORY_CONFIGS[group];
  }
  return SPOT_CATEGORY_CONFIGS['General Retail'];
};
