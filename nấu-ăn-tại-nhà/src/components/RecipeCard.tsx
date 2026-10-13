import React from 'react';
import { Clock, Flame, Heart, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Recipe } from '../types.ts';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, recipeId: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  matchScore?: { matched: number; total: number; percentage: number };
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite,
  onToggleFavorite,
  onSelectRecipe,
  matchScore,
}) => {
  const getDifficultyBadge = (level: string) => {
    switch (level) {
      case 'Dễ':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Trung bình':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Nâng cao':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-50 text-stone-800 border-stone-200';
    }
  };

  return (
    <div
      id={`recipe-card-${recipe.id}`}
      onClick={() => onSelectRecipe(recipe)}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E7DECE] hover:border-[#78350F]/50 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      {/* Dish Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
        <img
          src={recipe.image}
          alt={recipe.name}
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=80';
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#292524]/85 text-[#FDFBF7] backdrop-blur-md border border-white/20">
          {recipe.categoryLabel}
        </span>

        {/* Favorite Button */}
        <button
          id={`btn-fav-${recipe.id}`}
          onClick={(e) => onToggleFavorite(e, recipe.id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md backdrop-blur-sm transition-transform active:scale-90"
          title={isFavorite ? 'Bỏ lưu yêu thích' : 'Lưu vào yêu thích'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-stone-500'
            }`}
          />
        </button>

        {/* Match score badge if pantry search is active */}
        {matchScore && matchScore.matched > 0 && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600/95 text-white backdrop-blur-sm border border-emerald-400 flex items-center gap-1 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Có {matchScore.matched}/{matchScore.total} nguyên liệu ({matchScore.percentage}%)</span>
          </div>
        )}

        {/* AI badge if generated */}
        {recipe.isAiGenerated && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#78350F]/90 text-[#FDE68A] backdrop-blur-sm border border-[#FDE68A]/50 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>AI Sáng tạo</span>
          </div>
        )}
      </div>

      {/* Dish Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {recipe.origin && (
            <div className="text-[11px] font-medium text-[#B45309] mb-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]"></span>
              <span>{recipe.origin}</span>
            </div>
          )}
          <h3 className="font-display text-lg font-bold text-[#292524] group-hover:text-[#78350F] transition-colors line-clamp-1 mb-1.5">
            {recipe.name}
          </h3>

          <p className="text-xs text-[#78716C] line-clamp-2 leading-relaxed mb-2.5">
            {recipe.description}
          </p>

          {recipe.flavorProfile && (
            <div className="mb-3 px-2 py-1 bg-[#FAF7F2] rounded-lg border border-[#F5EFE6] text-[11px] text-[#57534E] line-clamp-1 italic">
              <span className="font-semibold text-[#78350F] not-italic">Vị: </span>
              {recipe.flavorProfile}
            </div>
          )}
        </div>

        {/* Meta details: Time, Difficulty, Ingredients count */}
        <div className="pt-3 border-t border-[#F5EFE6] flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            {/* Time */}
            <span className="flex items-center gap-1 font-semibold text-[#44403C]">
              <Clock className="w-3.5 h-3.5 text-[#B45309]" />
              {recipe.totalTime}
            </span>

            {/* Difficulty */}
            <span
              className={`px-2 py-0.5 rounded-md font-semibold border text-[11px] ${getDifficultyBadge(
                recipe.difficulty
              )}`}
            >
              {recipe.difficulty}
            </span>
          </div>

          <span className="text-[#78350F] font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
            Xem cách làm
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
