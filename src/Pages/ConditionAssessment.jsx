import React, { useMemo, useState, useEffect } from "react";
import Header from "@/components/Header/Header";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import AuctionSelectionModal from "@/components/ui/auction-selection-modal";

export default function ConditionAssessment() {
  const questions = useMemo(
    () => [
      {
        key: "modified",
        label: "Has your vehicle been modified?",
        emoji: "🛠️",
        options: ["Yes", "No"],
        positive: ["No"],
        needsDetails: ["Yes"],
      },
      {
        key: "accident",
        label: "Has your vehicle ever been in an accident?",
        emoji: "🚧",
        options: ["Yes", "No"],
        positive: ["No"],
        needsDetails: ["Yes"],
      },
      {
        key: "service",
        label: "How complete is your service history?",
        emoji: "🧾",
        options: ["Complete", "Mostly complete", "Partial", "None"],
        positive: ["Complete", "Mostly complete"],
        needsDetails: ["Partial", "None"],
      },
      {
        key: "tires",
        label: "What is the condition of your tires?",
        emoji: "🛞",
        options: ["Excellent", "Good", "Fair", "Poor"],
        positive: ["Excellent", "Good"],
        needsDetails: ["Fair", "Poor"],
      },
      {
        key: "paint",
        label: "How would you rate your paint condition?",
        emoji: "🎨",
        options: ["Excellent", "Good", "Fair", "Poor"],
        positive: ["Excellent", "Good"],
        needsDetails: ["Fair", "Poor"],
      },
      {
        key: "interior",
        label: "What is the condition of your interior?",
        emoji: "🪑",
        options: ["Excellent", "Good", "Fair", "Poor"],
        positive: ["Excellent", "Good"],
        needsDetails: ["Fair", "Poor"],
      },
      {
        key: "mechanical",
        label: "Are there any current mechanical issues?",
        emoji: "⚙️",
        options: ["Yes", "No"],
        positive: ["No"],
        needsDetails: ["Yes"],
      },
      {
        key: "smoked",
        label: "Has the vehicle been smoked in?",
        emoji: "🚭",
        options: ["Yes", "No"],
        positive: ["No"],
        needsDetails: ["Yes"],
      },
      {
        key: "pets",
        label: "Have pets regularly been in the vehicle?",
        emoji: "🐕",
        options: ["Yes", "No"],
        positive: ["No"],
        needsDetails: ["Yes"],
      },
      {
        key: "rust",
        label: "Is there any visible rust on the vehicle?",
        emoji: "🦠",
        options: ["Yes", "No"],
        positive: ["No"],
        needsDetails: ["Yes"],
      },
      {
        key: "flood",
        label: "Has the vehicle ever been in a flood or water damage?",
        emoji: "🌊",
        options: ["Yes", "No"],
        positive: ["No"],
        needsDetails: ["Yes"],
      },
    ],
    []
  );

  const [answers, setAnswers] = useState({});
  const [details, setDetails] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [showValidation, setShowValidation] = useState(false);
  const [showAuctionModal, setShowAuctionModal] = useState(false);

  const questionsPerPage = 2;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const total = questions.length;
  const answered = Object.keys(answers).length;
  const percent = Math.round((answered / total) * 100);

  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  // Auto-hide validation message after 3 seconds
  useEffect(() => {
    if (showValidation) {
      const timer = setTimeout(() => {
        setShowValidation(false);
      }, 3000);
      return () => clearTimeout(timer); // Cleanup on unmount or state change
    }
  }, [showValidation]);

  function selectAnswer(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setShowValidation(false); // Clear validation when user answers

    // Clear details if the answer doesn't need details
    const question = questions.find((q) => q.key === key);
    if (!question.needsDetails.includes(value)) {
      setDetails((prev) => {
        const newDetails = { ...prev };
        delete newDetails[key];
        return newDetails;
      });
    }
  }

  function setQuestionDetails(key, value) {
    setDetails((prev) => ({ ...prev, [key]: value }));
  }

  function nextPage() {
    // Check if all questions on the current page are answered
    const unanswered = currentQuestions.some((q) => !answers[q.key]);
    if (unanswered) {
      setShowValidation(true);
      return;
    }
    if (currentPage < totalPages -1) {
      setCurrentPage(currentPage + 1);
      setShowValidation(false); // Clear validation on successful navigation
    }
  }

  function prevPage() {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setShowValidation(false); // Clear validation when going back
    }
  }

  function renderQuestion(question, questionIndex) {
    const selected = answers[question.key];
    const needsDetails = selected && question.needsDetails.includes(selected);

    return (
      <motion.div
        key={question.key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: questionIndex * 0.1 }}
        className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl"
      >
        <div className="mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">
            <span className="mr-2">{question.emoji}</span>
            {question.label}
          </h3>
          <p className="text-xs text-slate-600">
            Tap an option below. Color indicates impact on valuation.
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 mb-4">
          {question.options.map((opt) => {
            const isPositive = question.positive.includes(opt);
            const isSelected = selected === opt;
            return (
              <button
                key={opt}
                onClick={() => selectAnswer(question.key, opt)}
                className={`group rounded-xl border p-3 text-sm font-medium transition hover:scale-[1.01] ${
                  isSelected
                    ? isPositive
                      ? "border-green-400 bg-green-50 text-green-800"
                      : "border-red-400 bg-rose-50 text-rose-800"
                    : "border-slate-200 bg-white text-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <CheckCircle2
                      className={`h-4 w-4 ${
                        isPositive ? "text-green-600" : "text-rose-600"
                      }`}
                    />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-300" />
                  )}
                  <span>{opt}</span>
                </div>
                <p
                  className={`mt-1 text-xs ${
                    isPositive ? "text-green-600" : "text-rose-600"
                  } opacity-80`}
                >
                  {isPositive ? "+ Likely adds value" : "- May reduce value"}
                </p>
              </button>
            );
          })}
        </div>

        {/* Details input for negative impact answers */}
        {needsDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
          >
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Please provide additional details:
            </label>
            <textarea
              value={details[question.key] || ""}
              onChange={(e) => setQuestionDetails(question.key, e.target.value)}
              placeholder="Describe the specific details..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f6851f]/20 focus:border-[#f6851f] resize-none"
              rows={3}
            />
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <>
      <Header />
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 pt-20 md:pt-24">
        <div className="mx-auto max-w-7xl px-6 py-8 md:py-12">
          <h1 className="mb-6 text-center text-3xl md:text-4xl font-bold text-slate-900">
            Condition Assessment
          </h1>

          {/* Validation Message */}
          {showValidation && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-6 rounded-xl border border-red-400 bg-red-50 p-4 text-sm text-red-800 shadow-sm"
            >
              All questions are mandatory. Please answer all questions on this page before proceeding.
            </motion.div>
          )}

          {/* Progress tracker */}
          <div className="mb-6 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-xl backdrop-blur-xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-slate-700">
                <span className="font-semibold">{answered} of {total}</span> questions answered —{" "}
                <span className="font-semibold">{percent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 md:max-w-sm">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-[#f6851f] to-[#e63946]"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: questions */}
            <div className="lg:col-span-8">
              <div className="space-y-6">{currentQuestions.map((question, index) => renderQuestion(question, index))}</div>

              {/* Navigation buttons */}
              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium shadow-sm transition hover:scale-[1.01] ${
                    currentPage === 0
                      ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                <div className="text-sm text-slate-600">
                  Page {currentPage + 1} of {totalPages}
                </div>

                {currentPage < totalPages - 1 ? (
                  <button
                    onClick={nextPage}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f6851f] to-[#e63946] px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.01]"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAuctionModal(true)}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#f6851f] to-[#e63946] px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.01]"
                  >
                    Submit Assessment
                  </button>
                )}
              </div>
            </div>

            {/* Right: summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-6">
                <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">Your answers</p>
                    <span className="text-xs text-slate-600">
                      {answered}/{total}
                    </span>
                  </div>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {questions.map((q) => (
                        <div
                        key={q.key}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 flex flex-col"
                        >
                        <div className="flex items-center justify-between text-sm gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                            <span>{q.emoji}</span>
                            <span className="truncate min-w-0">{q.label}</span>
                            </div>
                            <span
                            className={`text-xs font-medium whitespace-nowrap ${
                                q.positive.includes(answers[q.key])
                                ? "text-green-700"
                                : answers[q.key]
                                ? "text-rose-700"
                                : "text-slate-500"
                            }`}
                            >
                            {answers[q.key] || "—"}
                            </span>
                        </div>

                        {details[q.key] && (
                            <div className="mt-2 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded break-words">
                            {details[q.key].substring(0, 60)}...
                            </div>
                        )}
                        </div>
                    ))}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auction Selection Modal */}
      <AuctionSelectionModal 
        isOpen={showAuctionModal} 
        onClose={setShowAuctionModal} 
      />
    </>
  );
}