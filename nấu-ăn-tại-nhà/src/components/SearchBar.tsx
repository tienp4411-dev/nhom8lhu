import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Sparkles, ArrowRight, Utensils } from 'lucide-react';
import { Recipe } from '../types';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  quickTags: string[];
  onSelectQuickTag: (tag: string) => void;
  allRecipes?: Recipe[];
  onSelectRecipe?: (recipe: Recipe) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedDifficulty,
  onDifficultyChange,
  quickTags,
  onSelectQuickTag,
  allRecipes = [],
  onSelectRecipe,
}) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpenDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick suggestions based on search query
  const matchingRecipes = React.useMemo(() => {
    if (!searchTerm.trim()) return [];
    const query = searchTerm.toLowerCase().trim();
    return allRecipes
      .filter((r) => {
        const nameMatch = r.name.toLowerCase().includes(query);
        const descMatch = r.description.toLowerCase().includes(query);
        const ingMatch = r.ingredients.some((i) => i.name.toLowerCase().includes(query));
        return nameMatch || descMatch || ingMatch;
      })
      .slice(0, 5);
  }, [searchTerm, allRecipes]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsOpenDropdown(false);

    // Smooth scroll down to recipe results list
    const recipeGridElement = document.getElementById('recipe-results-section');
    if (recipeGridElement) {
      recipeGridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectSuggestion = (recipe: Recipe) => {
    setIsOpenDropdown(false);
    if (onSelectRecipe) {
      onSelectRecipe(recipe);
    } else {
      onSearchChange(recipe.name);
    }
  };

  return (
    <div ref={containerRef} className="w-full mb-8 relative">
      {/* Search Input Box with Form for Enter key */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-[#78716C]">
          <Search className="w-5 h-5 text-[#78350F]" />
        </div>

        <input
          id="main-search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setIsOpenDropdown(true);
          }}
          onFocus={() => setIsOpenDropdown(true)}
          placeholder="Bạn muốn nấu món gì hôm nay? (Ví dụ: Bánh mì, Phở, Sườn kho...)"
          className="w-full pl-12 pr-44 sm:pr-56 py-4 rounded-2xl bg-white border-2 border-[#E7DECE] focus:border-[#78350F] focus:ring-4 focus:ring-[#78350F]/10 text-[#292524] text-base placeholder-[#A8A29E] font-medium transition-all shadow-sm outline-none"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              setIsOpenDropdown(false);
            }}
            id="btn-clear-search"
            title="Xóa tìm kiếm"
            aria-label="Xóa tìm kiếm"
            className="absolute right-36 sm:right-48 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="absolute right-2 flex items-center gap-1.5">
          <select
            id="select-difficulty-filter"
            value={selectedDifficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            className="hidden sm:block bg-[#F5EFE6] text-[#78350F] text-xs font-semibold px-2.5 py-2 rounded-xl border border-[#E7DECE] outline-none cursor-pointer hover:bg-[#EBDDC8] transition-colors"
          >
            <option value="all">Tất cả mức</option>
            <option value="Dễ">Dễ</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Nâng cao">Nâng cao</option>
          </select>

          <button
            type="submit"
            id="btn-submit-search"
            className="px-4 py-2 rounded-xl bg-[#78350F] hover:bg-[#92400E] text-white text-xs sm:text-sm font-bold flex items-center gap-1 shadow-sm transition-all hover:scale-[1.02] active:scale-95"
          >
            <span>Tìm món</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Interactive Dropdown Auto-complete Suggestions */}
      {isOpenDropdown && searchTerm.trim().length > 0 && (
        <div className="absolute z-30 left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-[#E7DECE] shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {matchingRecipes.length > 0 ? (
            <div>
              <div className="p-2.5 bg-[#FAF7F2] border-b border-[#F5EFE6] text-[11px] font-bold uppercase tracking-wider text-[#78350F] flex items-center justify-between">
                <span>Gợi ý món ăn phù hợp ({matchingRecipes.length})</span>
                <span className="text-stone-400 font-normal lowercase">Bấm để xem chi tiết hoặc nhấn Enter</span>
              </div>
              <div className="divide-y divide-[#F5EFE6] max-h-72 overflow-y-auto">
                {matchingRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => handleSelectSuggestion(recipe)}
                    className="p-3 hover:bg-[#FFFBEB] cursor-pointer transition-colors flex items-center gap-3 group"
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#292524] group-hover:text-[#78350F] truncate">
                          {recipe.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0 font-medium">
                          {recipe.categoryLabel}
                        </span>
                      </div>
                      <p className="text-xs text-[#78716C] truncate mt-0.5">
                        {recipe.flavorProfile || recipe.description}
                      </p>
                    </div>
                    <div className="text-xs text-[#78350F] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
                      <span>Xem ngay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-2.5 px-4 bg-[#F5EFE6] hover:bg-[#EBDDC8] text-xs font-bold text-[#78350F] text-center border-t border-[#E7DECE] transition-colors"
              >
                Xem tất cả kết quả tìm kiếm cho "{searchTerm}" →
              </button>
            </div>
          ) : (
            <div className="p-5 text-center text-sm text-[#78716C]">
              <Utensils className="w-6 h-6 mx-auto text-stone-300 mb-1.5" />
              <span>Không có món ăn nào khớp trực tiếp với "{searchTerm}".</span>
              <p className="text-xs text-stone-400 mt-1">
                Nhấn <strong>Enter</strong> hoặc nút <strong>Tìm món</strong> để lọc theo nguyên liệu hoặc tìm kiếm AI.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Suggested Quick Tags */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[#78716C] font-medium whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
          Tìm nhanh:
        </span>
        {quickTags.map((tag) => {
          const isActive = searchTerm.toLowerCase() === tag.toLowerCase();
          return (
            <button
              key={tag}
              type="button"
              onClick={() => {
                onSelectQuickTag(tag);
                setIsOpenDropdown(false);
              }}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors font-medium border ${
                isActive
                  ? 'bg-[#78350F] text-white border-[#78350F]'
                  : 'bg-white text-[#57534E] border-[#E7DECE] hover:border-[#B45309] hover:text-[#78350F]'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};
