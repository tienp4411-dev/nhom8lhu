import React from 'react';
import { ChefHat, Heart, Sparkles, Refrigerator } from 'lucide-react';

interface HeaderProps {
  favoriteCount: number;
  onOpenFavorites: () => void;
  onOpenPantry: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  favoriteCount,
  onOpenFavorites,
  onOpenPantry,
  onGoHome,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E7DECE] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand & Team Info */}
        <div 
          onClick={onGoHome}
          id="app-brand-logo"
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-[#78350F] text-white flex items-center justify-center shadow-sm group-hover:bg-[#92400E] transition-colors">
            <ChefHat className="w-6 h-6 text-[#FDE68A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#292524]">
                Nấu ăn tại nhà
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                Nhóm 8
              </span>
            </div>
            <p className="text-xs text-[#78716C] font-medium hidden sm:block">
              Thiên Vy • Đài Trang • Kim Trang • Phụng Tiên
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenPantry}
            id="btn-open-pantry"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-[#F5EFE6] text-[#78350F] hover:bg-[#EBDDC8] border border-[#E7DECE] transition-colors"
            title="Tìm món theo nguyên liệu có sẵn"
          >
            <Refrigerator className="w-4 h-4 text-[#B45309]" />
            <span className="hidden md:inline">Tủ lạnh có gì?</span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#78350F] text-[10px] text-white font-bold">
              AI
            </span>
          </button>

          <button
            onClick={onOpenFavorites}
            id="btn-open-favorites"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-[#292524] text-white hover:bg-[#1C1917] transition-colors shadow-sm"
          >
            <Heart className={`w-4 h-4 ${favoriteCount > 0 ? 'fill-red-500 text-red-500' : 'text-stone-300'}`} />
            <span className="hidden sm:inline">Món yêu thích</span>
            {favoriteCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-xs font-bold bg-[#B45309] text-white">
                {favoriteCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
