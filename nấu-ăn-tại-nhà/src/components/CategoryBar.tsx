import React from 'react';
import { 
  Utensils, 
  Soup, 
  SunMedium, 
  Cake, 
  Coffee, 
  Sparkles,
  Flame,
  Salad
} from 'lucide-react';
import { CategoryInfo, RecipeCategory } from '../types.ts';

interface CategoryBarProps {
  categories: CategoryInfo[];
  selectedCategory: RecipeCategory | 'all';
  onSelectCategory: (category: RecipeCategory | 'all') => void;
  categoryCounts: Record<string, number>;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'rice':
        return <Flame className="w-5 h-5" />;
      case 'soup':
        return <Soup className="w-5 h-5" />;
      case 'snack':
        return <Utensils className="w-5 h-5" />;
      case 'breakfast':
        return <SunMedium className="w-5 h-5" />;
      case 'dessert':
        return <Cake className="w-5 h-5" />;
      case 'drink':
        return <Coffee className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const totalRecipes = (Object.values(categoryCounts) as number[]).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-xl font-bold text-[#292524] tracking-tight">
          Danh mục món ăn
        </h2>
        <span className="text-xs font-semibold text-[#78716C]">
          Tổng cộng {totalRecipes} món ngon
        </span>
      </div>

      {/* Categories Grid / Scroll */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* All option */}
        <button
          id="category-tab-all"
          onClick={() => onSelectCategory('all')}
          className={`flex flex-col items-center text-center p-3.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#78350F] text-white border-[#78350F] shadow-md shadow-[#78350F]/20 scale-[1.02]'
              : 'bg-white text-[#44403C] border-[#E7DECE] hover:border-[#D4A373] hover:bg-[#FAF7F2]'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-colors ${
              selectedCategory === 'all' ? 'bg-white/20 text-[#FDE68A]' : 'bg-[#F5EFE6] text-[#78350F]'
            }`}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm leading-snug">Tất cả món</span>
          <span
            className={`text-xs mt-1 font-medium ${
              selectedCategory === 'all' ? 'text-[#FDE68A]' : 'text-[#A8A29E]'
            }`}
          >
            {totalRecipes} món
          </span>
        </button>

        {/* 6 requested categories */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              id={`category-tab-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center text-center p-3.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#78350F] text-white border-[#78350F] shadow-md shadow-[#78350F]/20 scale-[1.02]'
                  : 'bg-white text-[#44403C] border-[#E7DECE] hover:border-[#D4A373] hover:bg-[#FAF7F2]'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-colors ${
                  isSelected ? 'bg-white/20 text-[#FDE68A]' : 'bg-[#F5EFE6] text-[#78350F]'
                }`}
              >
                {getCategoryIcon(cat.id)}
              </div>
              <span className="font-bold text-sm leading-snug">{cat.name}</span>
              <span
                className={`text-xs mt-1 font-medium ${
                  isSelected ? 'text-[#FDE68A]' : 'text-[#A8A29E]'
                }`}
              >
                {count} món
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
