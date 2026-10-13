import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChefHat, 
  Sparkles, 
  Refrigerator, 
  MessageSquare, 
  Heart, 
  Utensils, 
  Search,
  BookOpen,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { CATEGORIES, INITIAL_RECIPES } from './data/recipes.ts';
import { Recipe, RecipeCategory } from './types.ts';
import { Header } from './components/Header.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { SearchBar } from './components/SearchBar.tsx';
import { CategoryBar } from './components/CategoryBar.tsx';
import { RecipeCard } from './components/RecipeCard.tsx';
import { RecipeDetail } from './components/RecipeDetail.tsx';
import { StepByStepCookingModal } from './components/StepByStepCookingModal.tsx';
import { CookingAssistantDrawer } from './components/CookingAssistantDrawer.tsx';
import { PantryCookModal } from './components/PantryCookModal.tsx';
import { FavoritesDrawer } from './components/FavoritesDrawer.tsx';

const QUICK_TAGS = [
  'Cơm chiên',
  'Phở bò',
  'Thịt heo',
  'Trứng gà',
  'Bánh mì chảo',
  'Canh sườn chua',
  'Bắp xào',
  'Bánh flan',
  'Cà phê muối',
];

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem('nau_an_tai_nha_custom_recipes');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_RECIPES];
      }
    } catch (e) {
      console.warn('Could not read saved custom recipes', e);
    }
    return INITIAL_RECIPES;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nau_an_tai_nha_favs');
      return saved ? JSON.parse(saved) : ['com-chien-duong-chau', 'banh-flan-caramel'];
    } catch (e) {
      return ['com-chien-duong-chau', 'banh-flan-caramel'];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

  // Modals and Drawers
  const [cookingModalRecipe, setCookingModalRecipe] = useState<Recipe | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [assistantRecipeContext, setAssistantRecipeContext] = useState<Recipe | undefined>(undefined);
  const [isPantryOpen, setIsPantryOpen] = useState<boolean>(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nau_an_tai_nha_favs', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not save favorites', e);
    }
  }, [favorites]);

  const toggleFavorite = (e?: React.MouseEvent, recipeId?: string) => {
    if (e) e.stopPropagation();
    if (!recipeId) return;

    setFavorites((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  const handleRecipeGenerated = (newRecipe: Recipe) => {
    setRecipes((prev) => [newRecipe, ...prev]);
    setActiveRecipe(newRecipe);

    try {
      const savedCustom = localStorage.getItem('nau_an_tai_nha_custom_recipes');
      const customList = savedCustom ? JSON.parse(savedCustom) : [];
      localStorage.setItem(
        'nau_an_tai_nha_custom_recipes',
        JSON.stringify([newRecipe, ...customList])
      );
    } catch (e) {
      console.warn('Could not save generated recipe', e);
    }
  };

  const openAssistantWithRecipe = (recipe?: Recipe) => {
    setAssistantRecipeContext(recipe);
    setIsAssistantOpen(true);
  };

  const openCookingMode = (recipe: Recipe) => {
    setCookingModalRecipe(recipe);
  };

  // Filter recipes according to Category, Search, and Difficulty
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // 1. Category filter
      if (selectedCategory !== 'all' && recipe.category !== selectedCategory) {
        return false;
      }

      // 2. Difficulty filter
      if (selectedDifficulty !== 'all' && recipe.difficulty !== selectedDifficulty) {
        return false;
      }

      // 3. Search filter (Dish name, description, and ingredients)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchName = recipe.name.toLowerCase().includes(query);
        const matchDesc = recipe.description.toLowerCase().includes(query);
        const matchMain = recipe.mainIngredients.some((ing) =>
          ing.toLowerCase().includes(query)
        );
        const matchIngredients = recipe.ingredients.some((ing) =>
          ing.name.toLowerCase().includes(query)
        );

        if (!matchName && !matchDesc && !matchMain && !matchIngredients) {
          return false;
        }
      }

      return true;
    });
  }, [recipes, selectedCategory, selectedDifficulty, searchTerm]);

  // Count by categories
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach((cat) => {
      counts[cat.id] = recipes.filter((r) => r.category === cat.id).length;
    });
    return counts;
  }, [recipes]);

  const favoriteRecipesList = useMemo(() => {
    return recipes.filter((r) => favorites.includes(r.id));
  }, [recipes, favorites]);

  // Featured recipe for hero banner
  const featuredRecipe = recipes[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#292524] selection:bg-[#78350F] selection:text-white">
      {/* Top Header */}
      <Header
        favoriteCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenPantry={() => setIsPantryOpen(true)}
        onGoHome={() => setActiveRecipe(null)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {activeRecipe ? (
          /* Detailed Recipe View */
          <RecipeDetail
            recipe={activeRecipe}
            isFavorite={favorites.includes(activeRecipe.id)}
            onToggleFavorite={(id) => toggleFavorite(undefined, id)}
            onBack={() => setActiveRecipe(null)}
            onStartCookingMode={openCookingMode}
            onOpenAssistant={openAssistantWithRecipe}
          />
        ) : (
          /* Main Dashboard / Catalog View */
          <>
            {/* 1. Hero Banner: Name "Nấu ăn tại nhà" & Appetizing Dish */}
            <HeroBanner
              recipes={recipes}
              featuredRecipe={featuredRecipe}
              onSelectRecipe={setActiveRecipe}
              onOpenPantry={() => setIsPantryOpen(true)}
            />

            {/* 2. Search Bar: "Bạn muốn nấu món gì hôm nay?" */}
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedDifficulty={selectedDifficulty}
              onDifficultyChange={setSelectedDifficulty}
              quickTags={QUICK_TAGS}
              onSelectQuickTag={(tag) => setSearchTerm(tag)}
              allRecipes={recipes}
              onSelectRecipe={(recipe) => setActiveRecipe(recipe)}
            />

            {/* 3. Category Bar: 6 requested groups */}
            <CategoryBar
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categoryCounts={categoryCounts}
            />

            {/* 4. Recipe Grid */}
            <div id="recipe-results-section" className="mb-6 flex items-center justify-between scroll-mt-6">
              <div>
                <h3 className="font-display text-xl font-bold text-[#292524]">
                  {selectedCategory === 'all'
                    ? 'Tất cả món ăn'
                    : CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                </h3>
                <p className="text-xs text-[#78716C] mt-0.5">
                  Hiển thị {filteredRecipes.length} món ăn thơm ngon phù hợp
                </p>
              </div>

              {(selectedCategory !== 'all' || searchTerm || selectedDifficulty !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchTerm('');
                    setSelectedDifficulty('all');
                  }}
                  className="text-xs font-semibold text-[#78350F] hover:underline"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>

            {filteredRecipes.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-[#E7DECE] p-8 max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-[#F5EFE6] text-[#78350F] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7" />
                </div>
                <h4 className="font-display text-lg font-bold text-[#292524] mb-2">
                  Không tìm thấy món ăn phù hợp
                </h4>
                <p className="text-xs text-[#78716C] leading-relaxed mb-6">
                  Bạn có thể thử tìm kiếm bằng từ khóa khác hoặc dùng tính năng "Tủ lạnh có gì" để Đầu bếp AI sáng tạo công thức riêng cho bạn nhé!
                </p>
                <button
                  onClick={() => setIsPantryOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#78350F] text-white font-bold text-xs shadow-md hover:bg-[#92400E] transition-colors"
                >
                  Sáng tạo món từ nguyên liệu của bạn
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={favorites.includes(recipe.id)}
                    onToggleFavorite={(e, id) => toggleFavorite(e, id)}
                    onSelectRecipe={setActiveRecipe}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Action Button for Chef Assistant */}
      <button
        onClick={() => openAssistantWithRecipe(activeRecipe || undefined)}
        id="btn-floating-assistant"
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-2xl bg-[#78350F] hover:bg-[#92400E] text-white font-bold text-xs flex items-center gap-2 shadow-2xl shadow-[#78350F]/40 border-2 border-[#FDE68A]/40 transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
        title="Hỏi Trợ lý Đầu bếp AI"
      >
        <ChefHat className="w-5 h-5 text-[#FDE68A]" />
        <span className="hidden sm:inline">Trợ lý Đầu bếp</span>
        <span className="inline-flex w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>

      {/* Modals and Drawers */}
      {cookingModalRecipe && (
        <StepByStepCookingModal
          recipe={cookingModalRecipe}
          onClose={() => setCookingModalRecipe(null)}
          onOpenAssistant={openAssistantWithRecipe}
        />
      )}

      <CookingAssistantDrawer
        recipeContext={assistantRecipeContext}
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      <PantryCookModal
        isOpen={isPantryOpen}
        onClose={() => setIsPantryOpen(false)}
        recipes={recipes}
        onSelectRecipe={setActiveRecipe}
        onRecipeGenerated={handleRecipeGenerated}
      />

      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favoriteRecipesList}
        onSelectRecipe={setActiveRecipe}
        onRemoveFavorite={(id) => toggleFavorite(undefined, id)}
      />

      {/* Footer */}
      <footer className="bg-[#292524] text-[#A8A29E] border-t border-stone-800 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#78350F] text-white flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-[#FDE68A]" />
              </div>
              <div>
                <span className="font-display text-lg font-bold text-[#FAF7F2]">
                  Nấu ăn tại nhà
                </span>
                <p className="text-xs text-stone-400">
                  Ẩm thực gia đình Việt • Gần gũi, thơm ngon & dễ làm
                </p>
              </div>
            </div>

            {/* Team Credits as requested */}
            <div className="text-center md:text-right">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#78350F]/60 text-[#FDE68A] border border-[#B45309]/50 mb-1.5">
                Nhóm 8 thực hiện
              </span>
              <p className="text-xs font-medium text-stone-300">
                Thành viên: Thiên Vy • Đài Trang • Kim Trang • Phụng Tiên
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
            <p>© 2026 Nấu ăn tại nhà. Tận hưởng niềm vui vào bếp mỗi ngày.</p>
            <div className="flex items-center gap-4">
              <span>Món cơm</span>
              <span>•</span>
              <span>Món nước</span>
              <span>•</span>
              <span>Món ăn nhẹ</span>
              <span>•</span>
              <span>Món ăn sáng</span>
              <span>•</span>
              <span>Món tráng miệng</span>
              <span>•</span>
              <span>Đồ uống</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
