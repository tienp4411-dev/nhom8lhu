export type RecipeCategory = 
  | 'rice'
  | 'soup'
  | 'snack'
  | 'breakfast'
  | 'dessert'
  | 'drink';

export interface Ingredient {
  name: string;
  amountPerServing: number;
  unit: string;
  note?: string;
}

export interface CookingStep {
  stepNumber: number;
  title: string;
  content: string;
  timerMinutes?: number;
  tip?: string;
}

export interface Recipe {
  id: string;
  name: string;
  category: RecipeCategory;
  categoryLabel: string;
  image: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTime: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Nâng cao';
  defaultServings: number;
  caloriesPerServing?: number;
  description: string;
  origin?: string;
  flavorProfile?: string;
  mainIngredients: string[];
  ingredients: Ingredient[];
  seasonings: string[];
  steps: CookingStep[];
  chefTips: string[];
  nutritionNote?: string;
  isAiGenerated?: boolean;
}

export interface CategoryInfo {
  id: RecipeCategory;
  name: string;
  shortDesc: string;
  icon: string;
}

export interface PantryIngredient {
  id: string;
  name: string;
  category: 'protein' | 'veggie' | 'carb' | 'spice';
  icon?: string;
}

export interface CookingAssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
