import { CookingStep, Ingredient, Recipe, RecipeCategory } from '../types.ts';

export async function suggestRecipeWithAI(
  ingredients: string[],
  category?: RecipeCategory,
  extraNote?: string
): Promise<Recipe> {
  try {
    const res = await fetch('/api/gemini/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients, category, extraNote }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.name && data.steps) {
        return {
          ...data,
          id: `ai-${Date.now()}`,
          isAiGenerated: true,
          image: getFallbackImageForCategory(data.category || category || 'rice'),
        };
      }
    }
  } catch (error) {
    console.warn('API call failed, using smart recipe generator:', error);
  }

  // Smart culinary fallback generator tailored to Vietnamese cuisine
  return generateSmartFallbackRecipe(ingredients, category);
}

export async function askCookingAssistant(
  question: string,
  recipeContext?: Recipe,
  chatHistory?: { role: string; text: string }[]
): Promise<string> {
  try {
    const res = await fetch('/api/gemini/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, recipeContext, chatHistory }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.answer) {
        return data.answer;
      }
    }
  } catch (error) {
    console.warn('Assistant API call failed, using intelligent assistant engine:', error);
  }

  // Fallback intelligent culinary advisor
  return generateSmartAssistantAnswer(question, recipeContext);
}

function getFallbackImageForCategory(cat: string): string {
  switch (cat) {
    case 'soup':
      return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=80';
    case 'snack':
      return 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=80';
    case 'breakfast':
      return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80';
    case 'dessert':
      return 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=1000&q=80';
    case 'drink':
      return 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=80';
    case 'rice':
    default:
      return 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=80';
  }
}

function generateSmartFallbackRecipe(ingredients: string[], category?: RecipeCategory): Recipe {
  const ingList = ingredients.map(i => i.toLowerCase());
  const hasEgg = ingList.some(i => i.includes('trứng'));
  const hasTomato = ingList.some(i => i.includes('cà chua'));
  const hasPork = ingList.some(i => i.includes('thịt heo') || i.includes('thịt'));
  const hasRice = ingList.some(i => i.includes('cơm') || i.includes('gạo'));
  const hasTofu = ingList.some(i => i.includes('đậu hũ') || i.includes('đậu phụ'));
  const hasNoodles = ingList.some(i => i.includes('mì') || i.includes('bún'));

  let name = 'Món xào gia đình ngập hương vị';
  let desc = 'Món ăn gia đình giản dị nhưng đậm đà, chế biến nhanh từ nguyên liệu có sẵn trong tủ lạnh.';
  let chosenCategory: RecipeCategory = category || 'rice';
  let categoryLabel = 'Món cơm';
  let steps: CookingStep[] = [];
  let ingObjects: Ingredient[] = [];

  if (hasEgg && hasTomato) {
    name = 'Trứng sốt cà chua hành hoa thơm nức';
    desc = 'Vị chua ngọt thanh mát của sốt cà chua quyện cùng trứng xốp mềm béo ngậy, chan cơm trắng thì cực kỳ đưa miệng.';
    chosenCategory = 'rice';
    categoryLabel = 'Món cơm';
    ingObjects = [
      { name: 'Trứng gà/vịt', amountPerServing: 2, unit: 'quả', note: 'Đánh tan cùng chút hạt nêm' },
      { name: 'Cà chua chín đỏ', amountPerServing: 1.5, unit: 'quả', note: 'Bổ múi cau' },
      { name: 'Hành hoa & hành tím', amountPerServing: 15, unit: 'g', note: 'Thái nhỏ' },
    ];
    steps = [
      {
        stepNumber: 1,
        title: 'Đánh trứng & Xào xốp',
        content: 'Đập trứng vào tô, thêm chút nước mắm và tiêu đánh đều. Cho dầu vào chảo đun nóng, đổ trứng vào đảo nhanh tay đến khi trứng vừa đông xốp thì trút ra đĩa.',
        timerMinutes: 2,
        tip: 'Không xào trứng quá kỹ sẽ bị khô cứng.',
      },
      {
        stepNumber: 2,
        title: 'Nấu sốt cà chua',
        content: 'Phi thơm hành tím, cho cà chua vào đảo cùng 1 thìa nước mắm và 1 thìa đường. Dằm nhẹ cho cà chua nhuyễn sánh thành sốt đỏ đẹp mắt.',
        timerMinutes: 4,
      },
      {
        stepNumber: 3,
        title: 'Hòa quyện & Rắc hành lá',
        content: 'Trút phần trứng xốp vào chảo sốt cà chua, đảo nhẹ tay 1 phút cho ngấm sốt. Tắt bếp, rắc hành hoa thái nhỏ và tiêu thơm rồi dọn ra đĩa.',
        timerMinutes: 1,
      },
    ];
  } else if (hasTofu && hasTomato) {
    name = 'Đậu hũ sốt cà chua ngọt đậm đà';
    desc = 'Miếng đậu hũ vàng giòn bên ngoài, mềm béo bên trong, thấm đẫm lớp sốt cà chua đỏ óng ả.';
    chosenCategory = 'rice';
    categoryLabel = 'Món cơm';
    ingObjects = [
      { name: 'Đậu hũ miếng', amountPerServing: 150, unit: 'g', note: 'Cắt khối vuông vừa ăn' },
      { name: 'Cà chua', amountPerServing: 2, unit: 'quả', note: 'Băm nhuyễn lấy sốt' },
      { name: 'Hành hoa & tỏi', amountPerServing: 15, unit: 'g' },
    ];
    steps = [
      {
        stepNumber: 1,
        title: 'Rán vàng đậu hũ',
        content: 'Chiên đậu hũ trong chảo dầu nóng đến khi các mặt vàng giòn rụm rồi vớt ra để ráo dầu.',
        timerMinutes: 5,
      },
      {
        stepNumber: 2,
        title: 'Làm sốt cà chua',
        content: 'Phi thơm tỏi, cho cà chua băm vào xào nhuyễn cùng 2 thìa mắm, 1 thìa đường và 2 thìa nước sôi.',
        timerMinutes: 4,
      },
      {
        stepNumber: 3,
        title: 'Rim đậu hũ ngấm sốt',
        content: 'Thả đậu hũ rán vào chảo sốt, đậy vung hạ lửa nhỏ rim trong 5 phút cho sốt ngấm vào từng thớ đậu. Rắc hành lá thái khúc rồi tắt bếp.',
        timerMinutes: 5,
      },
    ];
  } else if (hasRice && (hasEgg || hasPork)) {
    name = 'Cơm chiên kim bảo trứng thịt thơm lừng';
    desc = 'Tận dụng cơm nguội có sẵn biến tấu thành đĩa cơm chiên giòn thơm nức mũi, hạt cơm bóng bẩy bắt mắt.';
    chosenCategory = 'rice';
    categoryLabel = 'Món cơm';
    ingObjects = [
      { name: 'Cơm nguội', amountPerServing: 150, unit: 'g', note: 'Bóp tơi' },
      { name: 'Trứng gà', amountPerServing: 1, unit: 'quả' },
      { name: 'Thịt băm hoặc xúc xích', amountPerServing: 50, unit: 'g' },
      { name: 'Hành tỏi băm', amountPerServing: 15, unit: 'g' },
    ];
    steps = [
      {
        stepNumber: 1,
        title: 'Ướp cơm vàng',
        content: 'Bóp cơm nguội với 1 lòng đỏ trứng gà và chút hạt nêm để hạt cơm có màu vàng óng.',
      },
      {
        stepNumber: 2,
        title: 'Xào thịt săn thơm',
        content: 'Phi thơm hành tỏi băm, cho thịt băm vào xào săn với chút tiêu và nước mắm.',
        timerMinutes: 3,
      },
      {
        stepNumber: 3,
        title: 'Chiên cơm giòn tơi',
        content: 'Cho cơm vào chảo đảo liên tục trên lửa lớn 5 phút cho hạt cơm se mặt, cho thịt vào trộn đều, rắc hành lá và tiêu thơm.',
        timerMinutes: 5,
      },
    ];
  } else {
    name = `Món ngon gia đình từ ${ingredients.slice(0, 3).join(' & ')}`;
    desc = `Sự kết hợp hài hòa giữa các nguyên liệu sẵn có: ${ingredients.join(', ')}, được nêm nếm theo phong vị Việt Nam truyền thống.`;
    chosenCategory = category || 'rice';
    categoryLabel = 'Món cơm';
    ingObjects = ingredients.map(ing => ({
      name: ing,
      amountPerServing: 100,
      unit: 'g',
      note: 'Sơ chế sạch sẽ',
    }));
    steps = [
      {
        stepNumber: 1,
        title: 'Sơ chế & Tẩm ướp',
        content: `Rửa sạch các nguyên liệu (${ingredients.join(', ')}). Cắt miếng vừa ăn, ướp cùng chút hành tỏi băm, 1 thìa nước mắm và tiêu trong 10 phút.`,
        timerMinutes: 10,
      },
      {
        stepNumber: 2,
        title: 'Chế biến nhiệt',
        content: 'Đặt chảo lên bếp, phi thơm hành tỏi. Cho phần nguyên liệu đạm vào đảo săn trước, sau đó cho tiếp rau củ vào đảo chín tới trên lửa vừa.',
        timerMinutes: 7,
      },
      {
        stepNumber: 3,
        title: 'Nêm nếm & Hoàn tất',
        content: 'Nêm gia vị vừa khẩu vị gia đình (nước mắm, hạt nêm, tiêu thơm). Tắt bếp, dọn ra đĩa và thưởng thức khi còn nóng.',
        timerMinutes: 2,
      },
    ];
  }

  return {
    id: `smart-${Date.now()}`,
    name,
    category: chosenCategory,
    categoryLabel,
    image: getFallbackImageForCategory(chosenCategory),
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    totalTime: '25 phút',
    difficulty: 'Dễ',
    defaultServings: 2,
    caloriesPerServing: 360,
    description: desc,
    mainIngredients: ingredients,
    ingredients: ingObjects,
    seasonings: ['Nước mắm ngon', 'Hạt nêm', 'Hạt tiêu đen', 'Dầu ăn'],
    steps,
    chefTips: [
      'Nêm gia vị theo từng lớp: ướp một phần lúc sơ chế và hoàn thiện lúc cuối để món ăn đậm đà từ bên trong.',
      'Canh lửa vừa phải giúp nguyên liệu chín đều mà không bị mất nước ngọt tự nhiên.',
    ],
    nutritionNote: 'Cung cấp năng lượng cân đối, giàu dưỡng chất thiết yếu cho cơ thể.',
    isAiGenerated: true,
  };
}

function generateSmartAssistantAnswer(question: string, recipe?: Recipe): string {
  const q = question.toLowerCase();

  if (q.includes('mặn') || q.includes('quá mặn')) {
    return 'Cách chữa món ăn bị mặn nhanh nhất:\n1. Với món canh/nước: Thả vài lát khoai tây sống hoặc cà chua vào đun 5 phút (khoai tây hút muối rất tốt), hoặc thêm một chút nước sôi và 1 thìa đường phèn.\n2. Với món kho/xào: Vắt vài giọt chanh tươi hoặc thêm cà chua băm, đậu hũ để cân bằng vị mà không làm mất mùi thơm.';
  }

  if (q.includes('dai') || q.includes('thịt dai')) {
    return 'Để thịt không bị dai:\n- Thịt bò: Nhớ thái ngang thớ thật mỏng, xào trên lửa cực lớn trong 1-2 phút là tắt bếp ngay.\n- Ướp cùng một chút dầu ăn hoặc lòng trắng trứng hoặc vài giọt nước cốt thơm/chanh trước khi nấu 15 phút sẽ giúp thớ thịt mềm tan!';
  }

  if (q.includes('dính chảo') || q.includes('cháy')) {
    return 'Bí quyết chống dính khi chiên xào:\n- Hãy làm chảo thật nóng trước, sau đó mới cho dầu vào láng đều khắp mặt chảo (nguyên tắc chảo nóng dầu nguội).\n- Để nguyên liệu ráo nước hoàn toàn trước khi thả vào chảo để tránh bắn dầu và chống dính tuyệt đối.';
  }

  if (q.includes('rau') && (q.includes('xanh') || q.includes('thâm'))) {
    return 'Để giữ rau xào hoặc luộc xanh mướt:\n- Luộc: Cho một nhúm muối tinh vào nước sôi già, mở vung khi luộc, vớt ra ngâm ngay vào âu nước đá lạnh 2 phút.\n- Xào: Luộc sơ qua 30 giây rồi xào lửa lớn đảo nhanh tay!';
  }

  if (q.includes('thay thế') || q.includes('không có')) {
    return `Nếu bạn thiếu một nguyên liệu nào đó trong món ${recipe?.name || 'này'}:\n- Không có nước mắm: Dùng xì dầu (nước tương) kèm chút muối.\n- Không có dấm/sấu: Dùng chanh, me, cà chua hoặc khế chua.\n- Không có dầu hào: Pha xì dầu + chút đường hoặc mật ong để tạo độ sánh ngọt!`;
  }

  return `Đầu bếp chia sẻ kinh nghiệm cho bạn về "${recipe?.name || 'món ăn này'}":\n- Hãy nhớ nêm nếm gia vị lúc nguyên liệu vừa chín tới để hương thơm không bị bay hơi.\n- Canh chuẩn thời gian và nhiệt độ sẽ giúp món ăn giữ được trọn vẹn màu sắc tươi sáng và vị ngọt tự nhiên!`;
}
