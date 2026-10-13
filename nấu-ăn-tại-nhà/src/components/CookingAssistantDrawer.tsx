import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  HelpCircle, 
  Loader2, 
  ChefHat, 
  RotateCcw,
  CheckCircle
} from 'lucide-react';
import { CookingAssistantMessage, Recipe } from '../types.ts';
import { askCookingAssistant } from '../services/geminiService.ts';

interface CookingAssistantDrawerProps {
  recipeContext?: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_QUESTIONS = [
  'Lỡ tay nêm canh quá mặn thì chữa thế nào?',
  'Làm sao để thịt bò xào mềm không bị dai?',
  'Bí quyết giữ rau xanh mướt khi luộc hoặc xào?',
  'Chảo bị dính thức ăn thì xử lý ra sao?',
  'Không có đủ gia vị thì có thể thay bằng gì?',
];

export const CookingAssistantDrawer: React.FC<CookingAssistantDrawerProps> = ({
  recipeContext,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<CookingAssistantMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: recipeContext
        ? `Chào bạn! Mình là Trợ lý Đầu bếp đây. Bạn đang nấu hoặc chuẩn bị nấu "${recipeContext.name}". Bạn đang băn khoăn về khâu nào, cách nêm nếm hay mẹo canh lửa gì không? Mình sẵn sàng hỗ trợ nhé!`
        : 'Chào bạn! Mình là Trợ lý Đầu bếp gia đình của ứng dụng "Nấu ăn tại nhà". Bạn có câu hỏi nào về nấu nướng, cách sơ chế, cứu món ăn bị lỗi hay bí quyết nâng cao tay nghề không?',
      timestamp: 'Vừa xong',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMsg: CookingAssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Bây giờ',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const answer = await askCookingAssistant(query, recipeContext, history);

      const botMsg: CookingAssistantMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: answer,
        timestamp: 'Vừa xong',
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: CookingAssistantMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Đầu bếp đang bận tay một chút, bạn thử hỏi lại câu hỏi nhé!',
        timestamp: 'Vừa xong',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'assistant',
        text: 'Cuộc trò chuyện đã được làm mới. Bạn đang cần đầu bếp hỗ trợ điều gì?',
        timestamp: 'Vừa xong',
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-[#FAF7F2] w-full max-w-md h-full shadow-2xl flex flex-col border-l border-[#E7DECE] animate-slideLeft">
        {/* Header */}
        <div className="px-5 py-4 bg-[#292524] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#78350F] flex items-center justify-center text-[#FDE68A]">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#FAF7F2] flex items-center gap-1.5">
                Trợ lý Đầu bếp AI
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              </h2>
              <p className="text-xs text-[#A8A29E] line-clamp-1">
                {recipeContext ? `Hỗ trợ: ${recipeContext.name}` : 'Mẹo nấu nướng & kinh nghiệm tại gia'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              id="btn-reset-chat"
              className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Làm mới trò chuyện"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              id="btn-close-assistant"
              className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Recipe context banner if viewing a specific dish */}
        {recipeContext && (
          <div className="px-4 py-2 bg-[#F5EFE6] border-b border-[#E7DECE] text-xs flex items-center justify-between text-[#78350F]">
            <span className="font-semibold line-clamp-1">Đang xem: {recipeContext.name}</span>
            <span className="font-bold text-[11px] bg-white px-2 py-0.5 rounded border border-[#E7DECE]">
              {recipeContext.difficulty}
            </span>
          </div>
        )}

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => {
            const isBot = m.sender === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-7 h-7 rounded-lg bg-[#78350F] text-[#FDE68A] flex items-center justify-center shrink-0 mt-0.5">
                    <ChefHat className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                    isBot
                      ? 'bg-white text-[#292524] border border-[#E7DECE] shadow-sm'
                      : 'bg-[#78350F] text-white shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>
                  <div
                    className={`text-[10px] mt-1 text-right ${
                      isBot ? 'text-stone-400' : 'text-amber-200'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-7 h-7 rounded-lg bg-[#292524] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 justify-start items-center text-xs text-stone-500 italic pl-2">
              <div className="w-7 h-7 rounded-lg bg-[#78350F] text-[#FDE68A] flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <span>Đầu bếp đang suy nghĩ câu trả lời tốt nhất cho bạn...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-[#F5EFE6]/70 border-t border-[#E7DECE]">
          <div className="flex items-center gap-1 text-xs text-[#78716C] mb-2 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
            <span>Câu hỏi phổ biến:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-lg text-xs bg-white text-[#44403C] border border-[#E7DECE] hover:border-[#78350F] hover:text-[#78350F] whitespace-nowrap font-medium transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-3 bg-white border-t border-[#E7DECE]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="assistant-chat-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Hỏi đầu bếp bất kỳ thắc mắc nào..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E7DECE] focus:border-[#78350F] focus:ring-2 focus:ring-[#78350F]/10 text-sm outline-none text-[#292524] placeholder-stone-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              id="btn-send-assistant-msg"
              className="p-2.5 rounded-xl bg-[#78350F] hover:bg-[#92400E] text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
