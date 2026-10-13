import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Lightbulb, 
  MessageSquare, 
  ChefHat,
  BellRing
} from 'lucide-react';
import { Recipe } from '../types.ts';

interface StepByStepCookingModalProps {
  recipe: Recipe;
  onClose: () => void;
  onOpenAssistant: (recipe: Recipe) => void;
}

export const StepByStepCookingModal: React.FC<StepByStepCookingModalProps> = ({
  recipe,
  onClose,
  onOpenAssistant,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const totalSteps = recipe.steps.length;
  const currentStep = recipe.steps[currentStepIndex];

  // Countdown timer state for the current step
  const initialMinutes = currentStep?.timerMinutes || 0;
  const [timeLeft, setTimeLeft] = useState<number>(initialMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerFinished, setTimerFinished] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  // Reset timer when step changes
  useEffect(() => {
    const mins = recipe.steps[currentStepIndex]?.timerMinutes || 0;
    setTimeLeft(mins * 60);
    setIsTimerRunning(false);
    setTimerFinished(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [currentStepIndex, recipe.steps]);

  // Handle timer tick
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            setTimerFinished(true);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn('Audio feedback error', e);
    }
  };

  const toggleTimer = () => {
    if (timeLeft <= 0) {
      const mins = currentStep?.timerMinutes || 3;
      setTimeLeft(mins * 60);
      setTimerFinished(false);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerFinished(false);
    const mins = currentStep?.timerMinutes || 0;
    setTimeLeft(mins * 60);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercentage = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-3xl border-2 border-[#78350F]/20 shadow-2xl overflow-hidden flex flex-col my-auto animate-fadeIn">
        {/* Header bar */}
        <div className="px-5 py-4 bg-[#292524] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#78350F] flex items-center justify-center text-white font-bold text-xs">
              <ChefHat className="w-4 h-4 text-[#FDE68A]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#FAF7F2] line-clamp-1">
                Chế độ nấu: {recipe.name}
              </h2>
              <span className="text-xs text-[#A8A29E]">
                Bước {currentStepIndex + 1} / {totalSteps} ({progressPercentage}%)
              </span>
            </div>
          </div>

          <button
            id="btn-close-cooking-mode"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#E7DECE] h-1.5">
          <div
            className="bg-[#78350F] h-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Main Step Content Area */}
        <div className="p-6 sm:p-8 flex-1">
          <div className="inline-block px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] font-bold text-xs border border-[#FDE68A] mb-3">
            BƯỚC {currentStep.stepNumber} TRÊN {totalSteps}
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#292524] mb-4">
            {currentStep.title}
          </h3>

          <p className="text-[#44403C] text-base sm:text-lg leading-relaxed mb-6 font-medium">
            {currentStep.content}
          </p>

          {/* Step Tip if available */}
          {currentStep.tip && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-sm text-amber-900 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">Mẹo vàng từ đầu bếp:</strong>
                <span>{currentStep.tip}</span>
              </div>
            </div>
          )}

          {/* Interactive Cooking Timer (if step has timer or generic helper) */}
          {(currentStep.timerMinutes || initialMinutes > 0) && (
            <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
              timerFinished 
                ? 'bg-rose-50 border-rose-400' 
                : isTimerRunning 
                ? 'bg-white border-[#78350F] shadow-md' 
                : 'bg-white border-[#E7DECE]'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${isTimerRunning ? 'text-[#78350F] animate-spin' : 'text-[#78716C]'}`} />
                  <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
                    Bộ hẹn giờ bước nấu
                  </span>
                </div>
                {timerFinished && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 animate-bounce">
                    <BellRing className="w-3.5 h-3.5" />
                    Đã hết giờ!
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="font-display text-4xl sm:text-5xl font-extrabold text-[#292524] tracking-wider">
                  {formatTimer(timeLeft)}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTimer}
                    id="btn-toggle-timer"
                    className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm ${
                      isTimerRunning
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-[#78350F] text-white hover:bg-[#92400E]'
                    }`}
                  >
                    {isTimerRunning ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Tạm dừng
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        {timeLeft <= 0 ? 'Hẹn lại' : 'Bắt đầu'}
                      </>
                    )}
                  </button>

                  <button
                    onClick={resetTimer}
                    id="btn-reset-timer"
                    className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                    title="Đặt lại hẹn giờ"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E7DECE] flex items-center justify-between gap-3">
          <button
            onClick={() => onOpenAssistant(recipe)}
            id="btn-step-ask-assistant"
            className="px-3.5 py-2 rounded-xl bg-[#F5EFE6] text-[#78350F] hover:bg-[#EBDDC8] border border-[#E7DECE] text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#B45309]" />
            <span>Hỏi mẹo cho bước này</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
              disabled={currentStepIndex === 0}
              id="btn-step-prev"
              className="px-4 py-2.5 rounded-xl bg-white border border-[#E7DECE] hover:bg-[#FAF7F2] text-[#44403C] font-semibold text-sm disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Trước</span>
            </button>

            {currentStepIndex < totalSteps - 1 ? (
              <button
                onClick={() => setCurrentStepIndex(prev => Math.min(totalSteps - 1, prev + 1))}
                id="btn-step-next"
                className="px-5 py-2.5 rounded-xl bg-[#78350F] hover:bg-[#92400E] text-white font-bold text-sm flex items-center gap-1 shadow-sm transition-all active:scale-95"
              >
                <span>Bước tiếp</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                id="btn-step-finish"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-1 shadow-sm transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Hoàn tất món ăn!</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
