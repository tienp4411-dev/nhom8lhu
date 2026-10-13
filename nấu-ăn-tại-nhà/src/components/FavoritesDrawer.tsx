import React from 'react';
import { X, Heart, Clock, Flame, ChevronRight, Trash2 } from 'lucide-react';
import { Recipe } from '../types.ts';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onRemoveFavorite: (recipeId: string) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectRecipe,
  onRemoveFavorite,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-[#FAF7F2] w-full max-w-md h-full shadow-2xl flex flex-col border-l border-[#E7DECE] animate-slideLeft">
        {/* Header */}
        <div className="px-5 py-4 bg-[#292524] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-900/50 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#FAF7F2]">
                Món ăn yêu thích ({favorites.length})
              </h2>
              <p className="text-xs text-[#A8A29E]">Các món bạn đã lưu để nấu lại</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of saved dishes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favorites.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <Heart className="w-12 h-12 mb-3 stroke-[1.5] text-stone-300" />
              <p className="text-sm font-semibold text-stone-600">Chưa có món yêu thích nào</p>
              <p className="text-xs text-stone-400 mt-1 max-w-xs">
                Hãy nhấn vào biểu tượng trái tim ở các món ăn ngon để lưu vào danh sách nấu của bạn nhé!
              </p>
            </div>
          ) : (
            favorites.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-2xl p-3 border border-[#E7DECE] hover:border-[#78350F] transition-all flex items-center gap-3 group shadow-sm"
              >
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=80';
                  }}
                  onClick={() => {
                    onSelectRecipe(recipe);
                    onClose();
                  }}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 cursor-pointer group-hover:scale-105 transition-transform"
                />

                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => {
                    onSelectRecipe(recipe);
                    onClose();
                  }}
                >
                  <span className="text-[10px] font-bold text-[#78350F] uppercase tracking-wider block mb-0.5">
                    {recipe.categoryLabel}
                  </span>
                  <h4 className="text-xs font-bold text-[#292524] group-hover:text-[#78350F] truncate transition-colors">
                    {recipe.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-[#78716C] mt-1">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3 text-[#B45309]" />
                      {recipe.totalTime}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-stone-700">{recipe.difficulty}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onRemoveFavorite(recipe.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Bỏ khỏi yêu thích"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onSelectRecipe(recipe);
                      onClose();
                    }}
                    className="p-2 text-stone-400 group-hover:text-[#78350F] rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
