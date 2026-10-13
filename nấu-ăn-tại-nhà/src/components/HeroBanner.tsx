import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Clock, Flame, BookOpen, Refrigerator, ChevronLeft, ChevronRight } from 'lucide-react';
import { Recipe } from '../types.ts';

interface HeroBannerProps {
  recipes?: Recipe[];
  featuredRecipe?: Recipe;
  onSelectRecipe: (recipe: Recipe) => void;
  onOpenPantry: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  recipes = [],
  featuredRecipe,
  onSelectRecipe,
  onOpenPantry,
}) => {
  // Use all recipes from the suggested catalog
  const displayRecipes = useMemo(() => {
    if (recipes && recipes.length > 0) return recipes;
    if (featuredRecipe) return [featuredRecipe];
    return [];
  }, [recipes, featuredRecipe]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto rotate every 3.5 seconds when not hovered/paused
  useEffect(() => {
    if (displayRecipes.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayRecipes.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [displayRecipes.length, isPaused]);

  const currentRecipe = displayRecipes[currentIndex] || featuredRecipe;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + displayRecipes.length) % displayRecipes.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % displayRecipes.length);
  };

  return (
    <div 
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#292524] via-[#44403C] to-[#1C1917] text-white shadow-xl border border-[#78716C]/20 mb-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle background warm pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-8 sm:py-10 lg:py-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left copy */}
        <div className="flex-1 max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#78350F]/70 border border-[#B45309]/50 text-[#FDE68A] text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>Nấu ăn chuẩn vị tại gia • Tiết kiệm & Đậm đà tình thân</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#FAF7F2] leading-tight mb-4">
            Nấu ăn tại nhà — <span className="text-[#FBBF24] italic">Mỗi bữa cơm là một niềm vui</span>
          </h1>

          <p className="text-[#D6D3D1] text-base sm:text-lg leading-relaxed mb-6">
            Dễ dàng tạo ra những món ăn tuyệt hảo ngay tại gian bếp thân quen với chính các nguyên liệu sẵn có trong tủ lạnh. Nấu ăn chưa bao giờ đơn giản và thú vị đến thế!
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <button
              id="hero-btn-pantry"
              onClick={onOpenPantry}
              className="px-5 py-3 rounded-xl bg-[#78350F] hover:bg-[#92400E] text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-[#78350F]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Refrigerator className="w-4 h-4 text-[#FDE68A]" />
              <span>Gợi ý theo nguyên liệu có sẵn</span>
            </button>

            {currentRecipe && (
              <button
                id="hero-btn-featured"
                onClick={() => onSelectRecipe(currentRecipe)}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center gap-2 backdrop-blur-sm border border-white/15 transition-all"
              >
                <BookOpen className="w-4 h-4 text-[#FDE68A]" />
                <span>Xem công thức món này</span>
              </button>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center lg:justify-start gap-6 text-xs text-[#A8A29E]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span>Dễ làm tại nhà</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span>Gia vị quen thuộc</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] inline-block" />
              <span>Trợ lý AI hướng dẫn</span>
            </div>
          </div>
        </div>

        {/* Right Appetizing Dish Visual with Carousel / Slider */}
        {currentRecipe && (
          <div 
            onClick={() => onSelectRecipe(currentRecipe)}
            id="hero-featured-card"
            className="w-full lg:w-96 group cursor-pointer select-none"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#78350F]/40 bg-[#1C1917] transition-transform duration-300 group-hover:scale-[1.02]">
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <img
                  key={currentRecipe.id}
                  src={currentRecipe.image}
                  alt={currentRecipe.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=80';
                  }}
                  className="w-full h-full object-cover object-center transition-all duration-700 animate-in fade-in zoom-in-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
                
                {/* Top Badge and Recipe Counter */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#78350F]/90 text-white backdrop-blur-md border border-[#B45309]/50 flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3 text-[#FDE68A]" />
                    <span>Gợi ý hôm nay</span>
                  </span>

                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-black/60 text-[#FDE68A] backdrop-blur-md border border-white/10">
                    {currentIndex + 1} / {displayRecipes.length}
                  </span>
                </div>

                {/* Prev / Next Carousel Controls */}
                {displayRecipes.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      title="Món trước"
                      aria-label="Món trước"
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      title="Món tiếp theo"
                      aria-label="Món tiếp theo"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Bottom Recipe Details */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-[#FDE68A] border border-amber-500/30">
                      {currentRecipe.categoryLabel}
                    </span>
                    {currentRecipe.origin && (
                      <span className="text-[11px] text-stone-300 truncate">
                        {currentRecipe.origin}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-bold text-[#FAF7F2] line-clamp-1 mb-1 group-hover:text-[#FDE68A] transition-colors">
                    {currentRecipe.name}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-[#D6D3D1]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#FBBF24]" />
                      {currentRecipe.totalTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-rose-400" />
                      {currentRecipe.difficulty}
                    </span>
                    <span className="ml-auto text-[#FDE68A] font-semibold flex items-center gap-1 group-hover:underline">
                      <span>Xem cách nấu</span>
                      <span>&rarr;</span>
                    </span>
                  </div>

                  {/* Dot Indicators */}
                  {displayRecipes.length > 1 && (
                    <div className="flex items-center justify-center gap-1.5 mt-2.5 pt-2 border-t border-white/10">
                      {displayRecipes.map((r, idx) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentIndex(idx);
                          }}
                          className={`h-1.5 rounded-full transition-all ${
                            idx === currentIndex
                              ? 'w-5 bg-[#FBBF24]'
                              : 'w-1.5 bg-white/30 hover:bg-white/60'
                          }`}
                          title={r.name}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

