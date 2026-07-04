import { useState, useEffect } from "react";
import { questions, Question } from "./questions";
import { DashboardStats } from "./components/DashboardStats";
import { QuizCard } from "./components/QuizCard";
import { StudyMode } from "./components/StudyMode";
import { QuestionExplorer } from "./components/QuestionExplorer";
import { 
  LayoutDashboard, 
  PlayCircle, 
  GraduationCap, 
  BookOpen, 
  Sliders, 
  Flame, 
  Info,
  Sparkles,
  Search,
  Settings,
  HelpCircle,
  ShieldCheck
} from "lucide-react";

interface QuizHistoryItem {
  date: string;
  score: number;
  questionsCount: number;
  correctAnswersCount: number;
}

export default function App() {
  // Tabs: 'dashboard' | 'quiz' | 'study' | 'explorer'
  const [activeTab, setActiveTab] = useState<"dashboard" | "quiz" | "study" | "explorer">("dashboard");
  
  // Quiz Configurations
  const [selectedTopic, setSelectedTopic] = useState<string>("الكل");
  const [selectedQuestionCount, setSelectedTopicCount] = useState<number>(10);
  const [feedbackStyle, setFeedbackStyle] = useState<"instant" | "exam">("instant");
  
  // Game Play State
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);

  // Persistence States
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);

  // Load persistence data on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("df_mcq_bookmarks");
    if (savedBookmarks) {
      try {
        setBookmarkedIds(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error("Error parsing bookmarks", e);
      }
    }

    const savedHistory = localStorage.getItem("df_mcq_history");
    if (savedHistory) {
      try {
        setQuizHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error parsing history", e);
      }
    }
  }, []);

  // Save Bookmarks
  const toggleBookmark = (id: number) => {
    const updated = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter(bId => bId !== id)
      : [...bookmarkedIds, id];
    
    setBookmarkedIds(updated);
    localStorage.setItem("df_mcq_bookmarks", JSON.stringify(updated));
  };

  const isBookmarked = (id: number) => bookmarkedIds.includes(id);

  // Reset Progress History
  const resetHistory = () => {
    if (window.confirm("هل أنت متأكد من تصفير وحذف جميع نتائجك المسجلة؟")) {
      setQuizHistory([]);
      setBookmarkedIds([]);
      localStorage.removeItem("df_mcq_history");
      localStorage.removeItem("df_mcq_bookmarks");
    }
  };

  // Start active quiz setup
  const startQuiz = () => {
    // Filter questions by topic
    const topicFiltered = selectedTopic === "الكل"
      ? questions
      : questions.filter(q => q.topic === selectedTopic);

    // Shuffle and pick requested count
    const shuffled = [...topicFiltered].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(selectedQuestionCount, shuffled.length));

    setActiveQuestions(selected);
    setIsQuizActive(true);
    setActiveTab("quiz");
  };

  // Complete Quiz Handle
  const handleFinishQuiz = (score: number, questionsCount: number, correctAnswersCount: number) => {
    const newItem: QuizHistoryItem = {
      date: new Date().toISOString(),
      score,
      questionsCount,
      correctAnswersCount
    };
    const updatedHistory = [...quizHistory, newItem];
    setQuizHistory(updatedHistory);
    localStorage.setItem("df_mcq_history", JSON.stringify(updatedHistory));
  };

  // Global Statistics calculations
  const completedQuizzesCount = quizHistory.length;
  const highScore = quizHistory.length > 0 
    ? Math.max(...quizHistory.map(h => h.score)) 
    : 0;
  const averageScore = quizHistory.length > 0
    ? Math.round(quizHistory.reduce((sum, h) => sum + h.score, 0) / quizHistory.length)
    : 0;
  const totalQuestionsAnswered = quizHistory.reduce((sum, h) => sum + h.questionsCount, 0);
  const correctAnswersCount = quizHistory.reduce((sum, h) => sum + h.correctAnswersCount, 0);

  // Available topics for filtering
  const uniqueTopics = ["الكل", ...Array.from(new Set(questions.map(q => q.topic)))];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-12 antialiased">
      {/* Premium Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-sm flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold block">منصة الاختبارات الذكية</span>
              <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">
                الأسس المفاهيمية للإدارة المالية الرقمية
              </h1>
            </div>
          </div>

          {/* Desktop tabs menu */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => { setActiveTab("dashboard"); setIsQuizActive(false); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "dashboard"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              لوحة التحكم
            </button>
            <button
              onClick={() => { setActiveTab("study"); setIsQuizActive(false); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "study"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              الدراسة بالبطاقات
            </button>
            <button
              onClick={() => { setActiveTab("explorer"); setIsQuizActive(false); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "explorer"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              مستعرض الأسئلة
            </button>
          </nav>

          <div className="text-xs bg-slate-50 font-bold px-3 py-1.5 rounded-xl text-slate-700 border border-slate-200">
            150 سؤال مبرمج
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-6 w-full space-y-8">
        
        {/* Main Quiz playing panel (overrides normal tab components) */}
        {isQuizActive && activeTab === "quiz" ? (
          <QuizCard
            questionsList={activeQuestions}
            feedbackStyle={feedbackStyle}
            onFinishQuiz={handleFinishQuiz}
            onExit={() => { setIsQuizActive(false); setActiveTab("dashboard"); }}
            isBookmarked={isBookmarked}
            onToggleBookmark={toggleBookmark}
          />
        ) : (
          <>
            {/* Dashboard Tab view */}
            {activeTab === "dashboard" && (
              <div className="space-y-8 animate-fade-in">
                <DashboardStats
                  completedQuizzesCount={completedQuizzesCount}
                  averageScore={averageScore}
                  highScore={highScore}
                  totalQuestionsAnswered={totalQuestionsAnswered}
                  correctAnswersCount={correctAnswersCount}
                  bookmarkedCount={bookmarkedIds.length}
                  activeTopic={selectedTopic}
                  onSelectTopic={setSelectedTopic}
                  onResetHistory={resetHistory}
                  quizHistory={quizHistory}
                />

                {/* Study & Start Quiz Configuration Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Setup Quiz Card */}
                  <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md flex flex-col justify-between space-y-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                        <PlayCircle className="w-3.5 h-3.5" />
                        تهيئة اختبارك التفاعلي
                      </div>
                      <h2 className="text-xl font-extrabold text-slate-800">ابدأ اختبار مخصص الآن</h2>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        خصص خيارات اختبارك لتناسب رغبتك. اختر المواضيع التي تريد مراجعتها، عدد الأسئلة، وطريقة تقديم الأجوبة.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Param 1: Topic */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 block">الفصل / الموضوع:</label>
                        <select
                          value={selectedTopic}
                          onChange={(e) => setSelectedTopic(e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white text-right cursor-pointer"
                        >
                          {uniqueTopics.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      {/* Param 2: Question Count */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 block">عدد الأسئلة:</label>
                        <select
                          value={selectedQuestionCount}
                          onChange={(e) => setSelectedTopicCount(Number(e.target.value))}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white text-right cursor-pointer"
                        >
                          <option value={10}>10 أسئلة سريعة</option>
                          <option value={20}>20 سؤال متوسط</option>
                          <option value={50}>50 سؤال مكثف</option>
                          <option value={100}>100 سؤال شامل</option>
                          <option value={150}>جميع الـ 150 سؤال</option>
                        </select>
                      </div>

                      {/* Param 3: Feedback Style */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 block">طريقة عرض النتيجة:</label>
                        <select
                          value={feedbackStyle}
                          onChange={(e) => setFeedbackStyle(e.target.value as "instant" | "exam")}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white text-right cursor-pointer"
                        >
                          <option value="instant">فوري (توضيح بعد كل سؤال)</option>
                          <option value="exam">امتحان (النتيجة في النهاية)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={startQuiz}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl text-sm font-extrabold shadow-lg shadow-blue-600/15 cursor-pointer transform hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                    >
                      <Flame className="w-4 h-4 animate-bounce" />
                      ابدأ الاختبار المخصص الآن
                    </button>
                  </div>

                  {/* Scientific Source Info Card */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white border border-slate-800 shadow-md flex flex-col justify-between space-y-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-blue-300">
                        <Info className="w-3 h-3" />
                        المصدر العلمي
                      </div>
                      <h3 className="font-extrabold text-lg text-white">المرجع الأكاديمي</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        تم استنباط هذه الأسئلة الـ 150 وصياغتها بدقة من محاضرات مادة **"الأسس المفاهيمية للإدارة المالية الرقمية"** لدراسة وتحليل ومراجعة تحديات التحول الرقمي المالي في الدول والحكومات.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0" />
                        أنظمة FMIS & ERP الحكومية
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0" />
                        الموازنة والتحليل المالي الإلكتروني
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0" />
                        أبعاد الحوكمة الرقمية ومكافحة الفساد
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-400 font-medium">
                      برمجة وصياغة ممتازة ومثالية لأفضل جودة تعليمية.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Study Cards view */}
            {activeTab === "study" && (
              <div className="animate-fade-in space-y-4">
                <div className="space-y-1 text-right mb-4">
                  <h2 className="text-xl md:text-2xl font-black text-slate-800">الدراسة التفاعلية بالبطاقات الذكية</h2>
                  <p className="text-xs text-slate-500">
                    أفضل وسيلة للمذاكرة والحفظ الفعال للمحاضرات العلمية. تصفح الأسئلة واكشف الإجابة عندما تكون مستعداً.
                  </p>
                </div>
                <StudyMode
                  questionsList={questions}
                  isBookmarked={isBookmarked}
                  onToggleBookmark={toggleBookmark}
                  onExit={() => setActiveTab("dashboard")}
                />
              </div>
            )}

            {/* Question Explorer view */}
            {activeTab === "explorer" && (
              <div className="animate-fade-in">
                <QuestionExplorer
                  questionsList={questions}
                  isBookmarked={isBookmarked}
                  onToggleBookmark={toggleBookmark}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer Nav for smaller screens */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 flex items-center justify-around py-3 px-2 shadow-lg">
        <button
          onClick={() => { setActiveTab("dashboard"); setIsQuizActive(false); }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === "dashboard" ? "text-sky-600" : "text-slate-400"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          لوحة التحكم
        </button>
        <button
          onClick={() => { setActiveTab("study"); setIsQuizActive(false); }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === "study" ? "text-sky-600" : "text-slate-400"
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          البطاقات
        </button>
        <button
          onClick={() => { setActiveTab("explorer"); setIsQuizActive(false); }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === "explorer" ? "text-sky-600" : "text-slate-400"
          }`}
        >
          <BookOpen className="w-5 h-5" />
          المستعرض
        </button>
      </footer>
    </div>
  );
}
