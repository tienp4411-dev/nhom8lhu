import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import dotenv from 'dotenv';
import {GoogleGenAI} from '@google/genai';

dotenv.config();

function geminiServerPlugin(): Plugin {
  return {
    name: 'gemini-server-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method === 'POST' && req.url?.startsWith('/api/gemini/')) {
          let body = '';
          req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on('end', async () => {
            try {
              const data = body ? JSON.parse(body) : {};
              const apiKey = process.env.GEMINI_API_KEY;

              if (!apiKey) {
                res.statusCode = 503;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'GEMINI_API_KEY is not configured.' }));
                return;
              }

              const ai = new GoogleGenAI({
                apiKey,
                httpOptions: {
                  headers: {
                    'User-Agent': 'aistudio-build',
                  },
                },
              });

              if (req.url === '/api/gemini/suggest') {
                const { ingredients, category, extraNote } = data;
                const prompt = `Bạn là chuyên gia ẩm thực và đầu bếp Việt Nam giàu kinh nghiệm của ứng dụng "Nấu ăn tại nhà".
Người dùng có các nguyên liệu sau trong nhà: ${(ingredients || []).join(', ')}.
${category ? `Yêu cầu danh mục: ${category}.` : ''}
${extraNote ? `Ghi chú thêm: ${extraNote}.` : ''}

Hãy gợi ý 1 công thức món ăn ngon, sáng tạo nhưng dễ làm, chuẩn vị gia đình Việt Nam tận dụng tối đa các nguyên liệu trên.
Hãy trả về JSON theo đúng định dạng sau (chỉ trả về JSON thuần túy không dùng markdown tick):
{
  "name": "Tên món ăn",
  "category": "rice",
  "categoryLabel": "Món cơm",
  "prepTimeMinutes": 15,
  "cookTimeMinutes": 20,
  "totalTime": "35 phút",
  "difficulty": "Dễ",
  "defaultServings": 2,
  "caloriesPerServing": 420,
  "description": "Mô tả hương vị món ăn ngắn gọn, thơm ngon kích thích vị giác",
  "mainIngredients": ["nguyên liệu 1", "nguyên liệu 2"],
  "ingredients": [
    { "name": "Tên nguyên liệu", "amountPerServing": 100, "unit": "g", "note": "ghi chú sơ chế" }
  ],
  "seasonings": ["Nước mắm", "Hạt nêm", "Tiêu xay"],
  "steps": [
    { "stepNumber": 1, "title": "Sơ chế nguyên liệu", "content": "Chi tiết cách làm bước 1", "timerMinutes": 5, "tip": "Mẹo sơ chế" },
    { "stepNumber": 2, "title": "Nấu và nêm nếm", "content": "Chi tiết cách nấu bước 2", "timerMinutes": 10, "tip": "Mẹo canh lửa" },
    { "stepNumber": 3, "title": "Hoàn thành và trình bày", "content": "Rắc tiêu hành lá và dọn ra đĩa", "timerMinutes": 2 }
  ],
  "chefTips": [
    "Bí quyết đầu bếp 1",
    "Bí quyết đầu bếp 2"
  ],
  "nutritionNote": "Giá trị dinh dưỡng món ăn"
}`;

                const response = await ai.models.generateContent({
                  model: 'gemini-3.8-flash',
                  contents: prompt,
                  config: {
                    responseMimeType: 'application/json',
                  },
                });

                res.setHeader('Content-Type', 'application/json');
                res.end(response.text || '{}');
                return;
              }

              if (req.url === '/api/gemini/assistant') {
                const { question, recipeContext, chatHistory } = data;
                const prompt = `Bạn là Trợ lý Đầu bếp thông minh của ứng dụng "Nấu ăn tại nhà".
Món ăn người dùng đang xem hoặc đang nấu: "${recipeContext?.name || 'Món ăn gia đình'}"
Chi tiết món: ${recipeContext?.description || ''}
Nguyên liệu: ${(recipeContext?.ingredients || []).map((i: any) => i.name).join(', ')}

Lịch sử trò chuyện: ${chatHistory ? JSON.stringify(chatHistory.slice(-3)) : 'Không có'}
Câu hỏi của người dùng: "${question}"

Hãy trả lời nhiệt tình, thân thiện, ngắn gọn, súc tích (khoảng 2-4 câu hoặc 2-3 gạch đầu dòng), cung cấp mẹo thực tế xử lý ngay trong bếp. Xưng hô là "Đầu bếp" hoặc "Mình" và gọi người dùng là "bạn".`;

                const response = await ai.models.generateContent({
                  model: 'gemini-3.8-flash',
                  contents: prompt,
                });

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ answer: response.text || '' }));
                return;
              }

              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Endpoint not found' }));
            } catch (err: any) {
              console.error('Gemini API error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err?.message || 'Lỗi xử lý AI' }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
