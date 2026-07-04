import React, { useState } from "react";
import { Question } from "../questions";
import { 
  ArrowLeft, 
  ArrowRight, 
  Bookmark, 
  BookOpen, 
  Check, 
  Eye, 
  EyeOff, 
  HelpCircle, 
  Sparkles 
} from "lucide-react";

interface StudyModeProps {
  questionsList: Question[];
  isBookmarked: (id: number) => boolean;
  onToggleBookmark: (id: number) => void;
  onExit: () => void;
}

export const StudyMode: React.FC<StudyModeProps> = ({
  questionsList,
  isBookmarked,
  onToggleBookmark,
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("الكل");

  // Get unique topics for filtration
  const topics = ["الكل", ...Array.from(new Set(questionsList.map(q => q.topic)))];

  // Filter questions
  const filteredQuestions = activeFilter === "الكل" 
    ? questionsList 
    : questionsList.filter(q => q.topic === activeFilter);

  // Ensure index is within boundaries
  const safeIndex = currentIndex >= filteredQuestions.length ? 0 : currentIndex;
  const currentQuestion = filteredQuestions[safeIndex];
  const totalQuestions = filteredQuestions.length;

  const handleNext = () => {
    setShowAnswer(false);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  };

  const handlePrev = () => {
    setShowAnswer(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(totalQuestions - 1);
    }
  };

  const optionLabels = ["أ", "ب", "ج", "د"];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-right">
      {/* Topic Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold text-slate-500 ml-2">تصفية حسب الموضوع:</span>
        <div className="flex flex-wrap gap-1.5">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setActiveFilter(topic);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                (topic === "الكل" && activeFilter === "الكل") || topic === activeFilter
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Main Flashcard Container */}
      {currentQuestion ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 md:p-8 space-y-6 relative">
          {/* Card Top Info */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full">
                البطاقة {currentIndex + 1} من {totalQuestions}
              </span>
              <span className="text-xs font-bold text-slate-400">
                {currentQuestion.topic}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleBookmark(currentQuestion.id)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isBookmarked(currentQuestion.id)
                    ? "bg-amber-50 text-amber-500 border-amber-200"
                    : "bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600"
                }`}
                title="حفظ السؤال للمراجعة لاحقاً"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card Question Body */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs text-blue-700 font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              <HelpCircle className="w-3.5 h-3.5" />
              سؤال للمذاكرة النشطة
            </div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options Display */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt, optIdx) => {
              const isCorrect = optIdx === currentQuestion.correctIndex;
              
              let optStyle = "border-slate-200 bg-slate-50 text-slate-700";
              let labelStyle = "bg-slate-200 text-slate-600 border border-slate-300";

              if (showAnswer) {
                if (isCorrect) {
                  optStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold scale-[1.01] shadow-sm";
                  labelStyle = "bg-emerald-500 border-emerald-600 text-white";
                } else {
                  optStyle = "border-slate-200 bg-slate-50/50 text-slate-400 opacity-60";
                }
              }

              return (
                <div
                  key={optIdx}
                  className={`w-full p-4 rounded-xl border-2 text-sm text-right flex items-center gap-3 transition-all duration-300 ${optStyle}`}
                >
                  <span className={`w-8 h-8 rounded-full text-xs flex items-center justify-center font-bold shrink-0 transition-colors ${labelStyle}`}>
                    {optionLabels[optIdx]}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                  {showAnswer && isCorrect && (
                    <span className="mr-auto text-emerald-600 bg-emerald-100/50 p-1 rounded-full">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Solution & Explanation Block */}
          {showAnswer ? (
            <div className="bg-blue-50/80 border border-blue-100 p-5 rounded-2xl space-y-3 animate-fade-in">
              <div className="flex items-center gap-1.5 text-sm font-extrabold text-blue-800">
                <Sparkles className="w-4 h-4 text-blue-600" />
                الحل الصحيح والتوجيه العلمي:
              </div>
              <p className="text-slate-800 font-bold text-sm">
                الإجابة الصحيحة هي: ({optionLabels[currentQuestion.correctIndex]}) - {currentQuestion.options[currentQuestion.correctIndex]}
              </p>
              <div className="text-slate-700 text-xs md:text-sm leading-relaxed border-t border-blue-200/50 pt-2.5">
                <span className="font-bold text-blue-700 block mb-1">شرح مفصل من المحاضرات:</span>
                {currentQuestion.explanation}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full py-4.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl text-sm font-extrabold shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
            >
              <Eye className="w-4 h-4" />
              كشف الإجابة الصحيحة والتوضيح العلمي
            </button>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={handlePrev}
              className="px-5 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" />
              السابق
            </button>

            <button
              onClick={onExit}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              الخروج للدراسة اللاحقة
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              التالي
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
          لا توجد أسئلة تطابق موضوع التصفية الحالي.
        </div>
      )}
    </div>
  );

  // Simple inner state and logic integration helpers
  function setActiveTopic(topic: string) {
    setActiveFilter(topic);
  }
};
