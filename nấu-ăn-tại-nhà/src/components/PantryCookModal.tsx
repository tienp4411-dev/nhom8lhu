import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Sparkles, 
  Check, 
  Refrigerator, 
  ChefHat, 
  Loader2, 
  Utensils,
  ArrowRight,
  Flame
} from 'lucide-react';
import { COMMON_PANTRY_INGREDIENTS } from '../data/recipes.ts';
import { PantryIngredient, Recipe, RecipeCategory } from '../types.ts';
import { suggestRecipeWithAI } from '../services/geminiService.ts';

interface PantryCookModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onRecipeGenerated: (recipe: Recipe) => void;
}

export const PantryCookModal: React.FC<PantryCookModalProps> = ({
  isOpen,
  onClose,
  recipes,
  onSelectRecipe,
  onRecipeGenerated,
}) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    'Trứng gà/vịt',
    'Cơm nguội / Gạo',
    'Cà chua',
  ]);
  const [customInput, setCustomInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategoryPref, setSelectedCategoryPref] = useState<RecipeCategory | 'any'>('any');

  if (!isOpen) return null;

  const toggleIngredient = (name: string) => {
    setSelectedIngredients(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !selectedIngredients.includes(trimmed)) {
      setSelectedIngredients(prev => [...prev, trimmed]);
      setCustomInput('');
    }
  };

  const clearAll = () => {
    setSelectedIngredients([]);
  };

  // Calculate matching recipes in the local database
  const matchingResults = recipes.map(recipe => {
    const recipeIngs = recipe.mainIngredients.map(i => i.toLowerCase());
    let matchedCount = 0;

    selectedIngredients.forEach(userIng => {
      const u = userIng.toLowerCase();
      if (recipeIngs.some(r => r.includes(u) || u.includes(r))) {
        matchedCount++;
      }
    });

    const percentage = recipeIngs.length > 0 
      ? Math.round((matchedCount / recipeIngs.length) * 100) 
      : 0;

    return {
      recipe,
      matchedCount,
      totalCount: recipeIngs.length,
      percentage,
    };
  })
  .filter(item => item.matchedCount > 0)
  .sort((a, b) => b.percentage - a.percentage);

  // Generate new recipe using AI
  const handleGenerateWithAI = async () => {
    if (selectedIngredients.length === 0) return;
    setIsGenerating(true);

    try {
      const category = selectedCategoryPref === 'any' ? undefined : selectedCategoryPref;
      const newRecipe = await suggestRecipeWithAI(selectedIngredients, category);
      onRecipeGenerated(newRecipe);
      onClose();
    } catch (e) {
      console.error('Error generating AI recipe:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const getCategoryTitle = (cat: string) => {
    switch (cat) {
      case 'protein':
        return 'Thịt, Cá, Trứng & Đậu';
      case 'carb':
        return 'Cơm, Mì & Tinh bột';
      case 'veggie':
        return 'Rau củ quả tươi';
      case 'spice':
        return 'Sữa & Khác';
      default:
        return 'Nguyên liệu';
    }
  };

  const groupedIngredients: Record<string, PantryIngredient[]> = {
    protein: COMMON_PANTRY_INGREDIENTS.filter(i => i.category === 'protein'),
    carb: COMMON_PANTRY_INGREDIENTS.filter(i => i.category === 'carb'),
    veggie: COMMON_PANTRY_INGREDIENTS.filter(i => i.category === 'veggie'),
    spice: COMMON_PANTRY_INGREDIENTS.filter(i => i.category === 'spice'),
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FAF7F2] w-full max-w-3xl rounded-3xl border-2 border-[#78350F]/20 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-5 bg-[#292524] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#78350F] text-[#FDE68A] flex items-center justify-center">
              <Refrigerator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#FAF7F2]">
                Gian bếp & Tủ lạnh của bạn có gì?
              </h2>
              <p className="text-xs text-[#A8A29E]">
                Chọn các nguyên liệu đang có sẵn, ứng dụng sẽ tìm món và gợi ý công thức ngay!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            id="btn-close-pantry"
            className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Ingredients Bar */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#E7DECE]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
              Nguyên liệu đã chọn ({selectedIngredients.length}):
            </span>
            {selectedIngredients.length > 0 && (
              <button
                onClick={clearAll}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 min-h-[42px] p-2 rounded-xl bg-[#FAF7F2] border border-[#E7DECE]">
            {selectedIngredients.length === 0 ? (
              <span className="text-xs text-stone-400 italic self-center pl-1">
                Chưa chọn nguyên liệu nào. Bấm vào các nguyên liệu bên dưới hoặc gõ thêm...
              </span>
            ) : (
              selectedIngredients.map((ing) => (
                <span
                  key={ing}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#78350F] text-white shadow-sm"
                >
                  {ing}
                  <button
                    onClick={() => toggleIngredient(ing)}
                    className="hover:text-red-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Add custom input */}
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
              placeholder="Gõ thêm nguyên liệu khác (vd: xúc xích, nấm kim châm, sườn...)..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#E7DECE] focus:border-[#78350F] text-xs font-medium text-[#292524] outline-none"
            />
            <button
              onClick={handleAddCustom}
              id="btn-add-custom-ingredient"
              className="px-3.5 py-2 rounded-xl bg-[#F5EFE6] text-[#78350F] hover:bg-[#EBDDC8] border border-[#E7DECE] font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm</span>
            </button>
          </div>
        </div>

        {/* Scrollable Ingredient Pickers & Matched List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Grouped Ingredients */}
          <div>
            <h3 className="text-xs font-bold text-[#78716C] uppercase tracking-wider mb-3">
              Chọn nhanh các nguyên liệu thông dụng:
            </h3>

            <div className="space-y-4">
              {Object.entries(groupedIngredients).map(([key, items]) => (
                <div key={key}>
                  <h4 className="text-xs font-bold text-[#78350F] mb-2">
                    {getCategoryTitle(key)}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {items.map((ing) => {
                      const isSelected = selectedIngredients.includes(ing.name);
                      return (
                        <button
                          key={ing.id}
                          onClick={() => toggleIngredient(ing.name)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                            isSelected
                              ? 'bg-[#78350F] text-white border-[#78350F] shadow-sm'
                              : 'bg-white text-[#44403C] border-[#E7DECE] hover:border-[#B45309] hover:bg-[#FAF7F2]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          <span>{ing.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Matched Dishes Section */}
          <div className="pt-4 border-t border-[#E7DECE]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base font-bold text-[#292524] flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-[#78350F]" />
                Món ăn nấu được ngay ({matchingResults.length} món)
              </h3>
              <span className="text-xs text-[#78716C]">
                Sắp xếp theo độ khớp nguyên liệu
              </span>
            </div>

            {matchingResults.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-[#E7DECE] text-stone-500 text-xs">
                Chọn thêm nguyên liệu để xem các món ăn phù hợp có trong thực đơn, hoặc dùng tính năng Sáng tạo AI bên dưới nhé!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchingResults.slice(0, 6).map(({ recipe, matchedCount, totalCount, percentage }) => (
                  <div
                    key={recipe.id}
                    onClick={() => {
                      onSelectRecipe(recipe);
                      onClose();
                    }}
                    className="p-3 bg-white rounded-2xl border border-[#E7DECE] hover:border-[#78350F] hover:shadow-md transition-all flex items-center gap-3 cursor-pointer group"
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#292524] group-hover:text-[#78350F] transition-colors truncate">
                        {recipe.name}
                      </h4>
                      <p className="text-[11px] text-[#78716C] truncate mt-0.5">
                        {recipe.totalTime} • {recipe.difficulty}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <span>Khớp {matchedCount}/{totalCount} nguyên liệu ({percentage}%)</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#78350F] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Recipe Generator Footer */}
        <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#E7DECE] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-[#78716C] whitespace-nowrap">
              Ưu tiên danh mục:
            </span>
            <select
              value={selectedCategoryPref}
              onChange={(e) => setSelectedCategoryPref(e.target.value as any)}
              className="bg-white text-xs font-semibold text-[#292524] px-2.5 py-2 rounded-xl border border-[#E7DECE] outline-none cursor-pointer flex-1 sm:flex-initial"
            >
              <option value="any">Tự do sáng tạo</option>
              <option value="rice">Món cơm</option>
              <option value="soup">Món nước</option>
              <option value="snack">Món ăn nhẹ</option>
              <option value="breakfast">Món ăn sáng</option>
              <option value="dessert">Món tráng miệng</option>
              <option value="drink">Đồ uống</option>
            </select>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#E7DECE] hover:bg-stone-100 text-xs font-semibold text-[#57534E] transition-colors"
            >
              Đóng
            </button>

            <button
              onClick={handleGenerateWithAI}
              disabled={selectedIngredients.length === 0 || isGenerating}
              id="btn-generate-ai-recipe"
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#78350F] hover:bg-[#92400E] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#78350F]/20 disabled:opacity-50 disabled:pointer-events-none transition-all active:scale-95"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#FDE68A]" />
                  <span>Đầu bếp AI đang sáng tạo công thức...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#FDE68A]" />
                  <span>Sáng tạo công thức mới với AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
