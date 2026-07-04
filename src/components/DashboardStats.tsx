import React from "react";
import { 
  Award, 
  Brain, 
  CheckCircle2, 
  BookOpen, 
  RotateCcw,
  Sparkles,
  TrendingUp,
  History,
  Bookmark
} from "lucide-react";

interface DashboardStatsProps {
  completedQuizzesCount: number;
  averageScore: number;
  highScore: number;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  bookmarkedCount: number;
  activeTopic: string;
  onSelectTopic: (topic: string) => void;
  onResetHistory: () => void;
  quizHistory: any[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  completedQuizzesCount,
  averageScore,
  highScore,
  totalQuestionsAnswered,
  correctAnswersCount,
  bookmarkedCount,
  onResetHistory,
  quizHistory
}) => {
  const successRate = totalQuestionsAnswered > 0 
    ? Math.round((correctAnswersCount / totalQuestionsAnswered) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              المنصة التفاعلية المتقدمة
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              الأسس المفاهيمية للإدارة المالية الرقمية
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed">
              ادرس واستعد لاختبارك من خلال 150 سؤال وجواب شاملة تلخص كامل المادة العلمية. تتبع تقدمك، تدرب، واختبر مستواك لحظة بلحظة.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10">
            <div className="bg-amber-400 p-3 rounded-xl text-slate-900 shadow-md">
              <Award className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs text-blue-200">أعلى درجة محققة</div>
              <div className="text-2xl font-black text-amber-300">{highScore}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-medium">الاختبارات المنجزة</span>
            <span className="text-2xl font-bold text-slate-800">{completedQuizzesCount}</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-medium">نسبة الإجابة الصحيحة</span>
            <span className="text-2xl font-bold text-emerald-600">{successRate}%</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-medium">متوسط الدرجات</span>
            <span className="text-2xl font-bold text-indigo-600">{averageScore}%</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-medium">الأسئلة المحفوظة</span>
            <span className="text-2xl font-bold text-slate-800">{bookmarkedCount}</span>
          </div>
        </div>
      </div>

      {/* Main Stats Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 text-lg">منحنى الأداء المالي</h3>
              <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                نشط
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              يتم قياس كفاءتك الإدارية استناداً إلى دقة إجاباتك على الأسئلة الـ 150 التي تغطي المادة العلمية.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
                <span>تغطية مادة الامتحان</span>
                <span>{totalQuestionsAnswered} من أصل 150 سؤال</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.round(Math.min((totalQuestionsAnswered / 150) * 100, 100))}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
                <span>معدل النجاح الإجمالي</span>
                <span className="text-emerald-600">{successRate}% دقة إجابات</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${successRate}%` }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* History & Reset Box */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            سجل الاختبارات الأخيرة
          </h3>
          
          <div className="flex-1 overflow-y-auto max-h-[160px] space-y-3 mb-4 pr-1">
            {quizHistory.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                لا توجد اختبارات مسجلة حتى الآن. ابدأ اختباراً لترى نتيجتك هنا!
              </div>
            ) : (
              quizHistory.slice(-4).reverse().map((hist, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs">
                    <p className="font-bold text-slate-700">اختبار {hist.questionsCount} أسئلة</p>
                    <p className="text-slate-400 text-[10px]">{new Date(hist.date).toLocaleDateString("ar-EG")}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                      hist.score >= 80 ? "bg-emerald-50 text-emerald-600" :
                      hist.score >= 50 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                    }`}>
                      {hist.score}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {quizHistory.length > 0 && (
            <button
              onClick={onResetHistory}
              className="w-full flex items-center justify-center gap-2 text-xs text-rose-500 hover:text-white hover:bg-rose-500 border border-rose-100 bg-rose-50/50 py-2.5 rounded-xl font-semibold transition-all duration-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              تصفير سجل التقدم والإحصائيات
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
