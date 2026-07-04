import React, { useState } from "react";
import { Question } from "../questions";
import { 
  ArrowLeft, 
  ArrowRight, 
  Bookmark, 
  Check, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  Star, 
  Trophy, 
  X, 
  XCircle 
} from "lucide-react";

interface QuizCardProps {
  questionsList: Question[];
  feedbackStyle: "instant" | "exam";
  onFinishQuiz: (score: number, questionsCount: number, correctAnswersCount: number) => void;
  onExit: () => void;
  isBookmarked: (id: number) => boolean;
  onToggleBookmark: (id: number) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  questionsList,
  feedbackStyle,
  onFinishQuiz,
  onExit,
  isBookmarked,
  onToggleBookmark
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answersState, setAnswersState] = useState<{ [key: number]: number }>({}); // questionId -> chosenOptionIndex
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [quizEnded, setQuizFinished] = useState(false);

  const currentQuestion = questionsList[currentIndex];
  const totalQuestions = questionsList.length;

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered && feedbackStyle === "instant") return;
    setSelectedOption(optionIndex);
    
    // In non-instant mode, we just record the choice and let the user click "Next"
    if (feedbackStyle === "exam") {
      setAnswersState(prev => ({
        ...prev,
        [currentQuestion.id]: optionIndex
      }));
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    
    setIsAnswered(true);
    setAnswersState(prev => ({
      ...prev,
      [currentQuestion.id]: selectedOption
    }));

    if (selectedOption === currentQuestion.correctIndex) {
      setCorrectAnswersCount(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      // Reset state for next question
      const nextQuestion = questionsList[currentIndex + 1];
      const previousSelection = answersState[nextQuestion.id];
      if (previousSelection !== undefined) {
        setSelectedOption(previousSelection);
        setIsAnswered(true);
      } else {
        setSelectedOption(null);
        setIsAnswered(false);
      }
    } else {
      // Calculate final score
      let correct = 0;
      questionsList.forEach(q => {
        if (answersState[q.id] === q.correctIndex) {
          correct++;
        }
      });
      const finalScore = Math.round((correct / totalQuestions) * 100);
      onFinishQuiz(finalScore, totalQuestions, correct);
      setQuizFinished(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      const prevQuestion = questionsList[currentIndex - 1];
      setSelectedOption(answersState[prevQuestion.id] ?? null);
      setIsAnswered(true);
    }
  };

  // Option letters (أ, ب, ج, د)
  const optionLetters = ["أ", "ب", "ج", "د"];

  // Score description based on success rate
  const getScoreFeedback = (percentage: number) => {
    if (percentage >= 85) return { text: "أداء مالي متميز! أنت على استعداد تام لتطبيق حوكمة مالية حقيقية.", color: "text-emerald-600" };
    if (percentage >= 65) return { text: "أداء جيد جداً! لقد استوعبت المفاهيم الأساسية للمالية الرقمية بشكل سليم.", color: "text-sky-600" };
    if (percentage >= 50) return { text: "لقد اجتزت الاختبار بنجاح، ولكن ينصح بمراجعة الفصول الصعبة لتعزيز فهمك.", color: "text-amber-600" };
    return { text: "ننصحك بمراجعة المادة وقراءة البطاقات الدراسية ثم المحاولة مرة أخرى لرفع كفاءتك المالية.", color: "text-rose-600" };
  };

  const percentageScore = Math.round((correctAnswersCount / totalQuestions) * 100);

  if (quizEnded) {
    const feedback = getScoreFeedback(percentageScore);
    return (
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-xl max-w-3xl mx-auto space-y-8 animate-fade-in text-right">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-amber-50 text-amber-500 rounded-full mb-2">
            <Trophy className="w-12 h-12" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">اكتمل الاختبار بنجاح!</h2>
          <p className={`text-base font-semibold ${feedback.color}`}>{feedback.text}</p>
        </div>

        {/* Big Score Sphere */}
        <div className="flex justify-center">
          <div className="relative w-44 h-44 rounded-full bg-slate-50 border-4 border-slate-200 flex flex-col justify-center items-center shadow-inner">
            <span className="text-4xl font-black text-slate-800">{percentageScore}%</span>
            <span className="text-xs text-slate-400 font-bold mt-1">نسبة الإجابة الصحيحة</span>
            <div className="absolute -bottom-1 bg-blue-50 text-blue-800 text-xs px-3 py-1 rounded-full font-extrabold border border-blue-200">
              {correctAnswersCount} من {totalQuestions} صحيحة
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onExit}
            className="px-6 py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-md transition-all duration-200 cursor-pointer text-center"
          >
            العودة إلى لوحة التحكم
          </button>
        </div>

        {/* Detailed Question Review */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            مراجعة تفصيلية للإجابات
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            راجع الأسئلة التي أجبت عليها وتأمل التوضيحات العلمية لترسيخ المفاهيم المذكورة في المحاضرات.
          </p>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {questionsList.map((q, idx) => {
              const chosen = answersState[q.id];
              const isCorrect = chosen === q.correctIndex;

              return (
                <div 
                  key={q.id} 
                  className={`p-5 rounded-2xl border text-sm space-y-3 ${
                    isCorrect 
                      ? "bg-emerald-50/30 border-emerald-100" 
                      : "bg-rose-50/30 border-rose-100"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                      سؤال {idx + 1}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      {isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      {isCorrect ? "صحيحة" : "خاطئة"}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-800 text-base leading-relaxed">{q.question}</h4>

                  {/* Render the 4 options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {q.options.map((opt, optIdx) => {
                      const isOptionCorrect = optIdx === q.correctIndex;
                      const isOptionChosen = optIdx === chosen;
                      
                      let style = "bg-white border-slate-200 text-slate-600";
                      if (isOptionCorrect) style = "bg-emerald-100 border-emerald-300 text-emerald-800 font-medium";
                      else if (isOptionChosen) style = "bg-rose-100 border-rose-300 text-rose-800 font-medium";

                      return (
                        <div key={optIdx} className={`px-4 py-2.5 rounded-xl border text-xs flex items-center gap-2 ${style}`}>
                          <span className="font-bold bg-slate-900/5 px-1.5 py-0.5 rounded text-[10px]">
                            {optionLetters[optIdx]}
                          </span>
                          {opt}
                        </div>
                      );
                    })}
                  </div>

                  {/* Show explanation always */}
                  <div className="bg-white/60 p-3.5 rounded-xl border border-slate-200 mt-2 text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-blue-700 block mb-1">التوضيح العلمي:</span>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 items-start text-right">
      {/* Sidebar Question Navigator */}
      <aside className="w-full lg:w-72 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm shrink-0 flex flex-col gap-5">
        <div className="space-y-2">
          <p className="text-sm font-bold text-slate-800">التقدم الإجمالي</p>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(Object.keys(answersState).length / totalQuestions) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 text-right">
            تمت الإجابة على {Object.keys(answersState).length} من أصل {totalQuestions}
          </p>
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">خريطة الأسئلة</p>
          <div className="grid grid-cols-5 gap-2 max-h-[220px] overflow-y-auto pr-1">
            {questionsList.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnsweredQ = answersState[q.id] !== undefined;

              let mapStyle = "bg-white text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-slate-600";
              if (isCurrent) {
                mapStyle = "bg-blue-600 text-white border-blue-700 font-bold shadow-sm shadow-blue-600/10";
              } else if (isAnsweredQ) {
                mapStyle = "bg-blue-50 text-blue-700 border-blue-200 font-semibold hover:bg-blue-100/60";
              }

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    const previousSelection = answersState[q.id];
                    if (previousSelection !== undefined) {
                      setSelectedOption(previousSelection);
                      setIsAnswered(true);
                    } else {
                      setSelectedOption(null);
                      setIsAnswered(false);
                    }
                  }}
                  className={`aspect-square flex items-center justify-center text-xs font-bold rounded-xl border transition-all cursor-pointer ${mapStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Question Column */}
      <div className="flex-1 w-full space-y-6">
        {/* Top action bar */}
        <div className="flex items-center justify-between bg-white px-5 py-4 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={onExit}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            إنهاء والعودة
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">
              السؤال {currentIndex + 1} من {totalQuestions}
            </span>
            <span className="text-[10px] px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-bold border border-blue-100">
              {currentQuestion.topic}
            </span>
          </div>

          <button
            onClick={() => onToggleBookmark(currentQuestion.id)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isBookmarked(currentQuestion.id)
                ? "bg-amber-50 text-amber-500 border-amber-200"
                : "bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600"
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Line */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Main Question Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          {/* Question Head */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs text-blue-700 font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              <HelpCircle className="w-3.5 h-3.5" />
              اختبار مفاهيمي
            </div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options Stack */}
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrectIndex = optIdx === currentQuestion.correctIndex;
              
              let btnStyle = "border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-400 text-slate-700 shadow-xs";
              let indicatorStyle = "border-slate-300 text-slate-400";

              if (feedbackStyle === "instant" && isAnswered) {
                if (isCorrectIndex) {
                  btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold shadow-sm";
                  indicatorStyle = "bg-emerald-500 border-emerald-600 text-white";
                } else if (isSelected) {
                  btnStyle = "border-rose-500 bg-rose-50 text-rose-900 font-semibold shadow-sm";
                  indicatorStyle = "bg-rose-500 border-rose-600 text-white";
                } else {
                  btnStyle = "border-slate-200 bg-slate-50/50 text-slate-400 opacity-60";
                }
              } else {
                if (isSelected) {
                  btnStyle = "border-blue-500 bg-blue-50 text-blue-950 font-semibold ring-2 ring-blue-100";
                  indicatorStyle = "bg-blue-600 border-blue-700 text-white";
                }
              }

              return (
                <button
                  key={optIdx}
                  disabled={feedbackStyle === "instant" && isAnswered}
                  onClick={() => handleOptionSelect(optIdx)}
                  className={`w-full p-4.5 rounded-2xl border-2 text-sm text-right flex items-center gap-4 transition-all duration-150 cursor-pointer ${btnStyle}`}
                >
                  <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold shrink-0 transition-colors ${indicatorStyle}`}>
                    {optionLetters[optIdx]}
                  </span>
                  <span className="leading-relaxed flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation Alert for instant feedback */}
          {feedbackStyle === "instant" && isAnswered && (
            <div className="bg-blue-50/80 border border-blue-100 p-4.5 rounded-2xl space-y-2 text-sm leading-relaxed animate-fade-in">
              <span className="font-extrabold text-blue-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                توضيح علمي من المحاضرات:
              </span>
              <p className="text-slate-700 text-xs md:text-sm">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Button Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 gap-4">
            {/* Previous (Only active in Exam mode or after instant answer is confirmed) */}
            <button
              onClick={handlePrevQuestion}
              disabled={currentIndex === 0}
              className={`px-5 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
              }`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
              السابق
            </button>

            {/* Action button */}
            {feedbackStyle === "instant" && !isAnswered ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  selectedOption === null ? "cursor-not-allowed" : ""
                }`}
              >
                تحقق من الإجابة
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={selectedOption === null && feedbackStyle === "exam"}
                className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedOption === null && feedbackStyle === "exam" ? "cursor-not-allowed" : ""
                }`}
              >
                {currentIndex === totalQuestions - 1 ? "رؤية النتيجة" : "السؤال التالي"}
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
