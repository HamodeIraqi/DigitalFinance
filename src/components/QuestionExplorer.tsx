import React, { useState } from "react";
import { Question } from "../questions";
import { 
  Bookmark, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  HelpCircle, 
  Star,
  CheckCircle,
  BookOpen
} from "lucide-react";

interface QuestionExplorerProps {
  questionsList: Question[];
  isBookmarked: (id: number) => boolean;
  onToggleBookmark: (id: number) => void;
}

export const QuestionExplorer: React.FC<QuestionExplorerProps> = ({
  questionsList,
  isBookmarked,
  onToggleBookmark
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState("الكل");
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);

  // Get unique topics for filtering
  const topics = ["الكل", ...Array.from(new Set(questionsList.map(q => q.topic)))];

  // Filter based on search query, active topic, and bookmarks
  const filteredQuestions = questionsList.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.options.some(opt => opt.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          q.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = activeTopic === "الكل" || q.topic === activeTopic;
    const matchesBookmark = !showBookmarksOnly || isBookmarked(q.id);

    return matchesSearch && matchesTopic && matchesBookmark;
  });

  const toggleExpand = (id: number) => {
    if (expandedQuestionId === id) {
      setExpandedQuestionId(null);
    } else {
      setExpandedQuestionId(id);
    }
  };

  const optionLetters = ["أ", "ب", "ج", "د"];

  return (
    <div className="space-y-6 text-right">
      {/* Filtering Actions Panel */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          مستعرض وقاموس الأسئلة الشامل
        </h3>
        
        <p className="text-xs text-slate-500 leading-relaxed">
          ابحث في جميع الأسئلة المئة، تصفح الإجابات الصحيحة، واقرأ الشروحات العلمية التفصيلية لتعزيز معلوماتك المالية بشكل سريع.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث عن سؤال، خيار إجابة، أو كلمة مفتاحية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all text-right"
            />
          </div>

          {/* Toggle Bookmarks */}
          <button
            onClick={() => setShowBookmarksOnly(prev => !prev)}
            className={`px-4 py-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              showBookmarksOnly 
                ? "bg-amber-50 border-amber-200 text-amber-700 shadow-xs" 
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Star className={`w-4 h-4 ${showBookmarksOnly ? "fill-amber-500 text-amber-500" : ""}`} />
            {showBookmarksOnly ? "عرض جميع الأسئلة" : "عرض المحفوظة فقط"}
          </button>
        </div>

        {/* Topic filter pill buttons */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          {topics.map(topic => (
            <button
              key={topic}
              onClick={() => setActiveTopic(topic)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                topic === activeTopic 
                  ? "bg-blue-600 text-white shadow-xs" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Count Info */}
      <div className="text-xs font-bold text-slate-400">
        تم العثور على {filteredQuestions.length} سؤال مطابق للمواصفات
      </div>

      {/* Questions Stack */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200">
            لا توجد أسئلة تطابق معايير البحث والفلترة المحددة.
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedQuestionId === q.id;
            const bookmarked = isBookmarked(q.id);

            return (
              <div 
                key={q.id} 
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded ? "border-blue-200 shadow-sm" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Question Header (Always visible) */}
                <div 
                  onClick={() => toggleExpand(q.id)}
                  className="p-4 md:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md shrink-0 border border-slate-200">
                      س {q.id}
                    </span>
                    <div className="space-y-1 text-right">
                      <h4 className="font-bold text-slate-800 text-sm md:text-base leading-relaxed">
                        {q.question}
                      </h4>
                      <div className="flex gap-2">
                        <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          {q.topic}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid expanding
                        onToggleBookmark(q.id);
                      }}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        bookmarked 
                          ? "bg-amber-50 text-amber-500 border-amber-100" 
                          : "bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600"
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/30 space-y-4 animate-fade-in text-sm">
                    {/* Render Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correctIndex;
                        
                        return (
                          <div 
                            key={optIdx} 
                            className={`p-3.5 rounded-xl border-2 text-xs flex items-center gap-3 ${
                              isCorrect 
                                ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold" 
                                : "bg-white border-slate-200 text-slate-600"
                            }`}
                          >
                            <span className={`w-6 h-6 text-[10px] rounded-md font-bold flex items-center justify-center shrink-0 ${
                              isCorrect ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500 border border-slate-200"
                            }`}>
                              {optionLetters[optIdx]}
                            </span>
                            <span className="leading-relaxed">{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Scientific Explanation */}
                    <div className="bg-blue-50/80 border border-blue-100 p-4 rounded-xl space-y-1.5 text-xs text-slate-700 leading-relaxed">
                      <span className="font-extrabold text-blue-800 block">
                        التوضيح العلمي من المستند العلمي:
                      </span>
                      <p>{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
