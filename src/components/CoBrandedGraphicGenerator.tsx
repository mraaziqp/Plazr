import React, { useRef, useEffect, useState } from 'react';
import { Download, Share2, Copy, Check, Sparkles, Palette, Edit3, Camera } from 'lucide-react';

interface CoBrandedGraphicGeneratorProps {
  vendorName: string;
  marketTitle: string;
  eventDate: string;
  locationName: string;
  spotNumber: string;
  vendorCategory: string;
  onClose?: () => void;
}

type GraphicTheme = 'emerald' | 'sunset' | 'violet' | 'royalgold' | 'slate';

interface ThemeConfig {
  id: GraphicTheme;
  name: string;
  bgGrad: [string, string, string];
  accentColor: string;
  borderColor: string;
  cardBg: string;
  highlightText: string;
  pillBg: string;
}

const THEMES: Record<GraphicTheme, ThemeConfig> = {
  emerald: {
    id: 'emerald',
    name: 'Plazr Emerald',
    bgGrad: ['#0f172a', '#1e1b4b', '#064e3b'],
    accentColor: '#10b981',
    borderColor: '#10b981',
    cardBg: 'rgba(15, 23, 42, 0.88)',
    highlightText: '#34d399',
    pillBg: '#059669',
  },
  sunset: {
    id: 'sunset',
    name: 'Cape Sunset',
    bgGrad: ['#1c1917', '#7c2d12', '#9a3412'],
    accentColor: '#f97316',
    borderColor: '#fb923c',
    cardBg: 'rgba(28, 25, 23, 0.88)',
    highlightText: '#fbbf24',
    pillBg: '#ea580c',
  },
  violet: {
    id: 'violet',
    name: 'Electric Neon',
    bgGrad: ['#09090b', '#3b0764', '#581c87'],
    accentColor: '#c084fc',
    borderColor: '#a855f7',
    cardBg: 'rgba(15, 10, 25, 0.88)',
    highlightText: '#e879f9',
    pillBg: '#9333ea',
  },
  royalgold: {
    id: 'royalgold',
    name: 'Luxury Gold',
    bgGrad: ['#0c0a09', '#451a03', '#78350f'],
    accentColor: '#f59e0b',
    borderColor: '#fbbf24',
    cardBg: 'rgba(20, 15, 10, 0.90)',
    highlightText: '#fde047',
    pillBg: '#d97706',
  },
  slate: {
    id: 'slate',
    name: 'Minimal Dark',
    bgGrad: ['#020617', '#0f172a', '#1e293b'],
    accentColor: '#38bdf8',
    borderColor: '#0284c7',
    cardBg: 'rgba(15, 23, 42, 0.90)',
    highlightText: '#7dd3fc',
    pillBg: '#0284c7',
  },
};

export const CoBrandedGraphicGenerator: React.FC<CoBrandedGraphicGeneratorProps> = ({
  vendorName,
  marketTitle,
  eventDate,
  locationName = 'The Old Biscuit Mill, Woodstock',
  spotNumber,
  vendorCategory,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<GraphicTheme>('emerald');
  const [customTagline, setCustomTagline] = useState<string>(
    vendorCategory.includes('Food')
      ? 'Serving our signature artisanal treats & gourmet bites!'
      : vendorCategory.includes('Fashion')
      ? 'Exclusive sustainable fashion & handcrafted wear!'
      : 'Handcrafted local goods & artisanal creations!'
  );
  const [socialHandle, setSocialHandle] = useState<string>(
    `@${vendorName.toLowerCase().replace(/[^a-z0-9]/g, '')}`
  );

  // Render Co-Branded Asset onto HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const theme = THEMES[selectedTheme];

    // High resolution 1080 x 1080 square for social media
    const size = 1080;
    canvas.width = size;
    canvas.height = size;

    // 1. Draw Stylish Modern Gradient Background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, theme.bgGrad[0]);
    gradient.addColorStop(0.5, theme.bgGrad[1]);
    gradient.addColorStop(1, theme.bgGrad[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Decorative geometric patterns & glowing circles
    ctx.beginPath();
    ctx.arc(size * 0.85, size * 0.15, 320, 0, Math.PI * 2);
    ctx.fillStyle = theme.accentColor + '22'; // 13% opacity hex
    ctx.fill();

    ctx.beginPath();
    ctx.arc(size * 0.15, size * 0.85, 360, 0, Math.PI * 2);
    ctx.fillStyle = theme.accentColor + '1a'; // 10% opacity hex
    ctx.fill();

    // 2. Draw Framing Card Border
    ctx.lineWidth = 14;
    ctx.strokeStyle = theme.borderColor;
    ctx.roundRect(40, 40, size - 80, size - 80, 40);
    ctx.stroke();

    // Inner subtle card background
    ctx.fillStyle = theme.cardBg;
    ctx.roundRect(60, 60, size - 120, size - 120, 32);
    ctx.fill();

    // 3. Top Header Badges
    // Left Badge: "✓ VERIFIED • VERIFIEDBIZLINK.CO.ZA"
    ctx.fillStyle = theme.pillBg;
    ctx.roundRect(100, 100, 520, 60, 16);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✓ VERIFIED • VERIFIEDBIZLINK.CO.ZA', 360, 137);

    // Plazr Logo right aligned
    ctx.fillStyle = theme.highlightText;
    ctx.font = 'extrabold 36px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('PLAZR.ZA', size - 100, 140);

    // 4. Main Announcement Headline
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 62px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText("WE'RE TRADING AT", 100, 255);

    // Market Title (Highlighted)
    ctx.fillStyle = theme.highlightText;
    ctx.font = 'bold 50px sans-serif';

    // Wrap market title if long
    const maxMarketWidth = 880;
    const words = marketTitle.split(' ');
    let line = '';
    let y = 320;
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxMarketWidth && i > 0) {
        ctx.fillText(line, 100, y);
        line = words[i] + ' ';
        y += 60;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 100, y);

    // 5. Vendor Business Highlight Box
    const vendorBoxY = y + 35;
    const vendorBoxHeight = 240;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.80)';
    ctx.roundRect(100, vendorBoxY, size - 200, vendorBoxHeight, 24);
    ctx.fill();
    ctx.strokeStyle = theme.accentColor + '88';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Vendor Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(vendorName, 130, vendorBoxY + 65);

    // Vendor Social Handle + Category
    ctx.fillStyle = theme.highlightText;
    ctx.font = '26px sans-serif';
    ctx.fillText(`${socialHandle} • ${vendorCategory}`, 130, vendorBoxY + 112);

    // Custom Tagline / Speciality
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'italic 24px sans-serif';
    
    // Wrap tagline if long
    const maxTaglineWidth = 820;
    const taglineWords = customTagline.split(' ');
    let taglineLine = '';
    let taglineY = vendorBoxY + 155;
    for (let i = 0; i < taglineWords.length; i++) {
      const testLine = taglineLine + taglineWords[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTaglineWidth && i > 0) {
        ctx.fillText(`"${taglineLine.trim()}"`, 130, taglineY);
        taglineLine = taglineWords[i] + ' ';
        taglineY += 34;
      } else {
        taglineLine = testLine;
      }
    }
    if (taglineLine) {
      ctx.fillText(`"${taglineLine.trim()}"`, 130, taglineY);
    }

    // Spot & Location Bar
    ctx.fillStyle = theme.accentColor;
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`📍 ${locationName} • STALL ZONE: ${spotNumber}`, 130, vendorBoxY + 212);

    // 6. Date & Call to Action Footer
    const footerY = vendorBoxY + vendorBoxHeight + 35;

    // Date Pill
    ctx.fillStyle = theme.pillBg;
    ctx.roundRect(100, footerY, 380, 80, 20);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🗓️ ${eventDate}`, 290, footerY + 52);

    // Social hashtag
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('#PlazrSA #SupportLocalVendors', size - 100, footerY + 50);

    setIsGenerated(true);
  }, [vendorName, marketTitle, eventDate, locationName, spotNumber, vendorCategory, selectedTheme, customTagline, socialHandle]);

  // Download Graphic as PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imageURI = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Plazr-${vendorName.replace(/\s+/g, '_')}-${eventDate}.png`;
    link.href = imageURI;
    link.click();
  };

  // Copy or Share Social Caption
  const shareCaption = `🎉 Exciting news! ${vendorName} is officially trading at ${marketTitle} on ${eventDate}! 🇿🇦\n\n${customTagline}\n\n📍 Find us at Stall Zone: ${spotNumber} (${locationName})\n\nFollow us at ${socialHandle} & book your stall via @Plazr_ZA! See you there! #SupportLocal #CapeTownMarkets #PlazrSA #PopUpStore`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(shareCaption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareMobile = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'plazr-trader.png', { type: 'image/png' })] })) {
        try {
          await navigator.share({
            files: [new File([blob], `Plazr-${vendorName.replace(/\s+/g, '_')}.png`, { type: 'image/png' })],
            title: `${vendorName} Trading at ${marketTitle}`,
            text: shareCaption,
          });
          return;
        } catch {
          // Fallback if user cancels or share fails
        }
      }
      // Fallback
      handleDownload();
      handleCopyCaption();
    }, 'image/png');
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 space-y-4 max-h-[85vh] overflow-y-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Personalized Co-Branded Social Graphic</h3>
            <p className="text-xs text-slate-400">Share your confirmed booking on Instagram, Facebook & WhatsApp</p>
          </div>
        </div>
      </div>

      {/* Theme & Customization Bar */}
      <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
            <Palette className="w-3.5 h-3.5 text-indigo-400" /> Choose Aesthetic Color Theme
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(Object.keys(THEMES) as GraphicTheme[]).map((tKey) => {
            const theme = THEMES[tKey];
            const isSelected = selectedTheme === tKey;
            return (
              <button
                key={tKey}
                onClick={() => setSelectedTheme(tKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-slate-700 text-white border-indigo-400 shadow-md ring-2 ring-indigo-500/40'
                    : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full inline-block border border-white/20"
                  style={{ backgroundColor: theme.accentColor }}
                />
                <span>{theme.name}</span>
              </button>
            );
          })}
        </div>

        {/* Customization Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
          <div>
            <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">
              Social Handle / Tag
            </label>
            <input
              type="text"
              value={socialHandle}
              onChange={(e) => setSocialHandle(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs font-medium"
              placeholder="@yourbusiness"
            />
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">
              Custom Product / Brand Tagline
            </label>
            <input
              type="text"
              value={customTagline}
              onChange={(e) => setCustomTagline(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs font-medium"
              placeholder="e.g. Serving authentic gourmet treats!"
            />
          </div>
        </div>
      </div>

      {/* Canvas Preview Container */}
      <div className="relative group max-w-md mx-auto overflow-hidden rounded-2xl border border-indigo-500/30 shadow-2xl bg-slate-950">
        <canvas
          ref={canvasRef}
          className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.01]"
        />
        {!isGenerated && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-xs text-slate-400">
            Rendering high-res personalized graphic...
          </div>
        )}
      </div>

      {/* Caption Box */}
      <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-300 uppercase text-[10px] tracking-wider flex items-center gap-1">
            <Edit3 className="w-3 h-3 text-indigo-400" /> Suggested Instagram Caption
          </span>
          <button
            onClick={handleCopyCaption}
            className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Caption'}</span>
          </button>
        </div>
        <p className="text-slate-300 italic whitespace-pre-line text-[11px] bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 font-medium">
          {shareCaption}
        </p>
      </div>

      {/* Action Triggers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <button
          onClick={handleDownload}
          className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download High-Res Graphic (PNG)</span>
        </button>

        <button
          onClick={handleShareMobile}
          className="py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-amber-300" />
          <span>Share to Instagram / WhatsApp</span>
        </button>
      </div>

    </div>
  );
};
