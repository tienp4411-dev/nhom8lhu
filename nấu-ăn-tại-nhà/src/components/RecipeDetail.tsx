import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Flame, 
  Heart, 
  Users, 
  Check, 
  ChefHat, 
  MessageSquare, 
  Lightbulb, 
  Play,
  Share2,
  Sparkles,
  Info
} from 'lucide-react';
import { Recipe } from '../types.ts';

interface RecipeDetailProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (recipeId: string) => void;
  onBack: () => void;
  onStartCookingMode: (recipe: Recipe) => void;
  onOpenAssistant: (recipe: Recipe) => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  isFavorite,
  onToggleFavorite,
  onBack,
  onStartCookingMode,
  onOpenAssistant,
}) => {
  const [servings, setServings] = useState<number>(recipe.defaultServings || 2);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleIngredientCheck = (name: string) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleShare = () => {
    const text = `Cùng nấu "${recipe.name}" tại nhà nhé! Thời gian: ${recipe.totalTime}, Độ khó: ${recipe.difficulty}.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Calculate scaled ingredient amount
  const scaleAmount = (amountPerServing: number) => {
    const total = amountPerServing * servings;
    return Number.isInteger(total) ? total : total.toFixed(1);
  };

  const allIngredientsChecked = recipe.ingredients.length > 0 && 
    recipe.ingredients.every(i => checkedIngredients[i.name]);

  return (
    <div className="max-w-4xl mx-auto pb-16 animate-fadeIn">
      {/* Top Navigation Back bar */}
      <div className="flex items-center justify-between py-4 mb-4">
        <button
          id="btn-back-to-list"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-[#292524] border border-[#E7DECE] hover:bg-[#F5EFE6] font-semibold text-sm transition-colors cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách món</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            id="btn-share-recipe"
            className="p-2.5 rounded-xl bg-white border border-[#E7DECE] hover:bg-[#F5EFE6] text-[#44403C] transition-colors"
            title="Chia sẻ công thức"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            id="btn-detail-fav"
            onClick={() => onToggleFavorite(recipe.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
              isFavorite
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-white text-[#44403C] border-[#E7DECE] hover:bg-[#F5EFE6]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
            <span>{isFavorite ? 'Đã lưu' : 'Lưu món'}</span>
          </button>
        </div>
      </div>

      {copied && (
        <div className="mb-4 p-2.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 text-center animate-pulse">
          Đã sao chép tóm tắt công thức món ăn vào bộ nhớ tạm!
        </div>
      )}

      {/* Main Recipe Card */}
      <div className="bg-white rounded-3xl overflow-hidden border border-[#E7DECE] shadow-lg mb-8">
        {/* Large Hero Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100">
          <img
            src={recipe.image}
            alt={recipe.name}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=80';
            }}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#78350F] text-white border border-[#B45309]/50 shadow-sm">
              {recipe.categoryLabel}
            </span>
            {recipe.isAiGenerated && (
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#B45309] text-[#FDE68A] border border-[#FDE68A]/50 flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" />
                Công thức AI
              </span>
            )}
          </div>

          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
            {recipe.origin && (
              <span className="inline-block px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#FDE68A] mb-2 shadow-sm">
                📍 {recipe.origin}
              </span>
            )}
            <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#FAF7F2] tracking-tight mb-2 drop-shadow-md">
              {recipe.name}
            </h1>
            <p className="text-sm sm:text-base text-[#E7E5E4] max-w-2xl line-clamp-2 leading-relaxed drop-shadow">
              {recipe.description}
            </p>
          </div>
        </div>

        {/* Recipe Quick Meta Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#F5EFE6] border-b border-[#F5EFE6] bg-[#FAF7F2] text-center">
          <div className="p-3.5 sm:p-4">
            <div className="flex items-center justify-center gap-1 text-xs text-[#78716C] mb-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#78350F]" />
              <span>Tổng thời gian</span>
            </div>
            <span className="font-bold text-sm sm:text-base text-[#292524]">{recipe.totalTime}</span>
          </div>

          <div className="p-3.5 sm:p-4">
            <div className="flex items-center justify-center gap-1 text-xs text-[#78716C] mb-1 font-medium">
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              <span>Mức độ khó</span>
            </div>
            <span className="font-bold text-sm sm:text-base text-[#292524]">{recipe.difficulty}</span>
          </div>

          <div className="p-3.5 sm:p-4">
            <div className="flex items-center justify-center gap-1 text-xs text-[#78716C] mb-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Sơ chế / Nấu</span>
            </div>
            <span className="font-bold text-sm sm:text-base text-[#292524]">
              {recipe.prepTimeMinutes}p / {recipe.cookTimeMinutes}p
            </span>
          </div>

          <div className="p-3.5 sm:p-4">
            <div className="flex items-center justify-center gap-1 text-xs text-[#78716C] mb-1 font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Năng lượng</span>
            </div>
            <span className="font-bold text-sm sm:text-base text-[#292524]">
              {recipe.caloriesPerServing ? `~${recipe.caloriesPerServing} kcal` : 'Cân đối'}
            </span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="p-4 sm:p-6 bg-white flex flex-wrap gap-3 items-center justify-between border-b border-[#F5EFE6]">
          <div className="flex items-center gap-2">
            <button
              id="btn-start-cooking-mode"
              onClick={() => onStartCookingMode(recipe)}
              className="px-5 py-3 rounded-xl bg-[#78350F] hover:bg-[#92400E] text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-[#78350F]/20 transition-all cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Bắt đầu nấu từng bước</span>
            </button>

            <button
              id="btn-ask-chef-assistant"
              onClick={() => onOpenAssistant(recipe)}
              className="px-4 py-3 rounded-xl bg-[#F5EFE6] hover:bg-[#EBDDC8] text-[#78350F] font-semibold text-sm flex items-center gap-2 border border-[#E7DECE] transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#B45309]" />
              <span>Hỏi Trợ lý Đầu bếp</span>
            </button>
          </div>

          {/* Servings Adjuster */}
          <div className="flex items-center gap-2 bg-[#FDFBF7] px-3 py-1.5 rounded-xl border border-[#E7DECE]">
            <span className="text-xs font-semibold text-[#78716C] flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#78350F]" />
              Khẩu phần:
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 4, 6].map(num => (
                <button
                  key={num}
                  id={`btn-serving-${num}`}
                  onClick={() => setServings(num)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    servings === num
                      ? 'bg-[#78350F] text-white'
                      : 'bg-white text-[#57534E] hover:bg-[#F5EFE6]'
                  }`}
                >
                  {num}
                </button>
              ))}
              <span className="text-xs font-medium text-[#78716C] ml-1">người</span>
            </div>
          </div>
        </div>

        {/* Content Body: Ingredients & Steps */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Dish Essence & Authentic Flavor Description */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7DECE] flex flex-col md:flex-row gap-4 items-start shadow-xs">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase tracking-wider font-bold text-[#78350F]">
                  Mô tả chuẩn vị & Nguồn gốc món ăn
                </span>
                {recipe.origin && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] font-semibold border border-[#FDE68A]">
                    {recipe.origin}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#44403C] leading-relaxed">
                {recipe.description}
              </p>
            </div>
            {recipe.flavorProfile && (
              <div className="md:w-80 w-full p-3.5 bg-white rounded-xl border border-[#E7DECE] text-xs space-y-1 shrink-0 shadow-xs">
                <span className="font-bold text-[#78350F] flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  Đặc trưng hương vị:
                </span>
                <p className="text-[#57534E] leading-relaxed italic">
                  "{recipe.flavorProfile}"
                </p>
              </div>
            )}
          </div>

          {/* 1. Ingredients Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#92400E] flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h2 className="font-display text-xl font-bold text-[#292524]">
                  Nguyên liệu cần chuẩn bị ({servings} người ăn)
                </h2>
              </div>
              <span className="text-xs text-[#78716C] hidden sm:block">
                (Bấm tick để đánh dấu nguyên liệu bạn đã có)
              </span>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {recipe.ingredients.map((ing, idx) => {
                const isChecked = !!checkedIngredients[ing.name];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleIngredientCheck(ing.name)}
                    className={`p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer select-none ${
                      isChecked
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : 'bg-[#FDFBF7] border-[#E7DECE] hover:border-[#D4A373] text-[#292524]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 border transition-colors ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-[#A8A29E] bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 text-sm">
                      <div className="flex items-baseline justify-between">
                        <span className={`font-semibold ${isChecked ? 'line-through opacity-70' : ''}`}>
                          {ing.name}
                        </span>
                        <span className="font-bold text-[#78350F] ml-2 whitespace-nowrap">
                          {scaleAmount(ing.amountPerServing)} {ing.unit}
                        </span>
                      </div>
                      {ing.note && (
                        <p className="text-xs text-[#78716C] mt-0.5">{ing.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Seasonings list */}
            {recipe.seasonings && recipe.seasonings.length > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-[#F5EFE6]/60 border border-[#E7DECE]">
                <span className="text-xs font-bold text-[#78350F] uppercase tracking-wider block mb-2">
                  Gia vị có sẵn trong bếp:
                </span>
                <div className="flex flex-wrap gap-2">
                  {recipe.seasonings.map((spice, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-[#E7DECE] text-[#44403C]"
                    >
                      • {spice}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Cooking Steps Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#92400E] flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h2 className="font-display text-xl font-bold text-[#292524]">
                Các bước thực hiện chi tiết
              </h2>
            </div>

            <div className="space-y-6">
              {recipe.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="relative pl-6 sm:pl-8 border-l-2 border-[#D4A373] pb-2 last:border-l-0"
                >
                  {/* Step number marker */}
                  <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-[#78350F] text-white flex items-center justify-center font-bold text-sm shadow-sm border-2 border-white">
                    {step.stepNumber}
                  </div>

                  <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#E7DECE]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-base text-[#292524]">
                        {step.title}
                      </h3>
                      {step.timerMinutes && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                          <Clock className="w-3 h-3" />
                          Hẹn giờ: {step.timerMinutes} phút
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-[#44403C] leading-relaxed mb-3">
                      {step.content}
                    </p>

                    {step.tip && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span><strong>Mẹo canh:</strong> {step.tip}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Chef Gold Tips Box */}
          {recipe.chefTips && recipe.chefTips.length > 0 && (
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#78350F]/5 via-[#B45309]/10 to-amber-50/50 border-2 border-[#B45309]/20">
              <div className="flex items-center gap-2 mb-3 text-[#78350F]">
                <ChefHat className="w-5 h-5 text-[#B45309]" />
                <h3 className="font-display font-bold text-base text-[#292524]">
                  Bí quyết từ đầu bếp tại nhà
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-[#44403C]">
                {recipe.chefTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#B45309] font-bold mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4. Nutrition Note */}
          {recipe.nutritionNote && (
            <div className="flex items-center gap-2 text-xs text-[#78716C] bg-white p-3 rounded-xl border border-[#E7DECE]">
              <Info className="w-4 h-4 text-[#78350F] shrink-0" />
              <span><strong>Giá trị dinh dưỡng:</strong> {recipe.nutritionNote}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
