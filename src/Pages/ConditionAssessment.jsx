import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, User, Mail, Phone, MapPin, Landmark, Building } from "lucide-react";
import AuctionSelectionModal from "@/components/ui/auction-selection-modal";
import { useDispatch, useSelector } from "react-redux";
import LoginModal from "@/components/ui/LoginModal";
import { setLoginRedirect } from "@/redux/slices/userSlice";

export default function ConditionAssessment() {
  const sections = useMemo(
    () => [
      {
        questions: [
          {
            key: "cosmetic",
            label: "Cosmetic condition?",
            emoji: "🎨",
            options: ["Excellent", "Good", "Fair", "Poor"],
            positive: ["Excellent", "Good"],
            needsDetails: ["Fair", "Poor"],
          },
          {
            key: "smoked",
            label: "Smoked in?",
            emoji: "🚭",
            options: ["No", "Yes"],
            positive: ["No"],
            needsDetails: ["Yes"],
          },
        ],
      },
      {
        questions: [
          {
            key: "title",
            label: "Title status?",
            emoji: "📜",
            options: ["Clean", "Salvage", "Rebuilt"],
            positive: ["Clean"],
            needsDetails: ["Salvage", "Rebuilt"],
          },
          {
            key: "accident",
            label: "Accident history?",
            emoji: "🚧",
            options: ["None", "Minor", "Major"],
            positive: ["None"],
            needsDetails: ["Minor", "Major"],
          },
        ],
      },
      {
        questions: [
          {
            key: "features",
            label: "Notable features?",
            emoji: "⭐",
            options: ["Navigation", "Leather", "Sunroof", "Alloy Wheels", "Premium Audio", "Safety+"],
            positive: [],
            needsDetails: [],
            isMultiSelect: true,
          },
          {
            key: "modifications",
            label: "Modifications?",
            emoji: "🛠️",
            options: ["No", "Yes"],
            positive: ["No"],
            needsDetails: ["Yes"],
          },
        ],
      },
      {
        questions: [
          {
            key: "warning",
            label: "Warning lights?",
            emoji: "⚠️",
            options: ["No", "Yes"],
            positive: ["No"],
            needsDetails: ["Yes"],
          },
          {
            key: "tread",
            label: "Tread condition?",
            emoji: "🛞",
            options: ["New", "Good", "Fair", "Replace"],
            positive: ["New", "Good"],
            needsDetails: ["Fair", "Replace"],
          },
        ],
      },
    ],
    []
  );

  const [answers, setAnswers] = useState(() => {
    const initial = {};
    sections.forEach((section) =>
      section.questions.forEach((q) => {
        if (q.positive.length > 0) {
          initial[q.key] = q.positive[0];
        } else if (q.isMultiSelect) {
          initial[q.key] = [];
        }
      })
    );
    return initial;
  });

  const [confirmedAnswers, setConfirmedAnswers] = useState({});
  const [details, setDetails] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [showValidation, setShowValidation] = useState(false);
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const dispatch = useDispatch();
  const [finalData, setFinalData] = useState([]);
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    zipcode: "",
    state: "",
    city: "",
  });
  const [userErrors, setUserErrors] = useState({});

  const { userExists } = useSelector(state => state.user);

  const formVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
  };

  const totalSections = sections.length;
  const answeredQuestions = Object.keys(confirmedAnswers).length;
  const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);

  const currentQuestions = sections[currentSection].questions;

  useEffect(() => {
    if (showValidation) {
      const timer = setTimeout(() => {
        setShowValidation(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showValidation]);

  const handleLoginClick = (e) => {
    e.preventDefault();
    dispatch(setLoginRedirect(null));
    setLoginModalOpen(true);
  };

  function getFinalSubmissionData() {
    return sections.flatMap((section) =>
      section.questions.map((q) => ({
        key: q.key,
        label: q.label,
        answer: confirmedAnswers[q.key] || answers[q.key] || null,
        details: details[q.key] || null,
      }))
    );
  }

  const handleForgotPassword = () => {
    console.log("Open forgot password modal");
  };

  const handleRegister = () => {
    console.log("Open register modal");
  };

  function selectAnswer(key, value, isMultiSelect = false) {
    if (isMultiSelect) {
      setAnswers((prev) => {
        const current = prev[key] || [];
        const newValue = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [key]: newValue };
      });
      setConfirmedAnswers((prev) => ({ ...prev, [key]: answers[key] || [] }));
    } else {
      setAnswers((prev) => ({ ...prev, [key]: value }));
      const question = currentQuestions.find((q) => q.key === key);
      if (!question.positive.includes(value) || confirmedAnswers[key]) {
        setConfirmedAnswers((prev) => ({ ...prev, [key]: value }));
      }
      if (!question.needsDetails.includes(value)) {
        setDetails((prev) => {
          const newDetails = { ...prev };
          delete newDetails[key];
          return newDetails;
        });
      }
    }
    setShowValidation(false);
  }

  function setQuestionDetails(key, value) {
    setDetails((prev) => ({ ...prev, [key]: value }));
  }

  function nextSection() {
    const unanswered = currentQuestions.some((q) => !answers[q.key] || (q.isMultiSelect && answers[q.key].length === 0));
    if (unanswered) {
      setShowValidation(true);
      return;
    }
    currentQuestions.forEach((q) => {
      setConfirmedAnswers((prev) => ({ ...prev, [q.key]: answers[q.key] }));
    });
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
      setShowValidation(false);
    }
  }

  function prevSection() {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setShowValidation(false);
    }
  }

  function handleContinue() {
    const unanswered = currentQuestions.some((q) => !answers[q.key] || (q.isMultiSelect && answers[q.key].length === 0));
    if (unanswered) {
      setShowValidation(true);
      return;
    }
    currentQuestions.forEach((q) => {
      setConfirmedAnswers((prev) => ({ ...prev, [q.key]: answers[q.key] }));
    });
    setShowValidation(false);
    setShowUserForm(true);
  }

  function renderQuestion(question, questionIndex) {
    const selected = answers[question.key];
    const needsDetails = question.isMultiSelect
      ? question.needsDetails.length > 0 && selected?.length > 0
      : selected && question.needsDetails.includes(selected);

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
        </div>

        <div className={`grid ${question.isMultiSelect ? "grid-cols-1 gap-2" : "grid-cols-2 gap-3 md:grid-cols-3"} mb-4`}>
          {question.options.map((opt) => {
            const isSelected = question.isMultiSelect
              ? selected?.includes(opt)
              : selected === opt;
            return (
              <button
                key={opt}
                onClick={() => selectAnswer(question.key, opt, question.isMultiSelect)}
                className={`cursor-pointer group rounded-xl border p-3 text-sm font-medium transition hover:scale-[1.01] ${
                  isSelected
                    ? "border-orange-400 bg-orange-50 text-orange-800"
                    : "border-slate-200 bg-white text-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <CheckCircle2 className="h-4 w-4 text-orange-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-300" />
                  )}
                  <span>{opt}</span>
                </div>
              </button>
            );
          })}
        </div>

        {needsDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
          >
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Additional details:
            </label>
            <textarea
              value={details[question.key] || ""}
              onChange={(e) => setQuestionDetails(question.key, e.target.value)}
              placeholder="Describe specific details..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f6851f]/20 focus:border-[#f6851f] resize-none"
              rows={3}
            />
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 pt-20 md:pt-24">
      <div className="mx-auto max-w-6xl px-6 py-8 md:py-12">
        <h1 className="mb-6 text-center text-3xl md:text-4xl font-bold text-slate-900">
          Vehicle Condition Assessment
        </h1>

        {showValidation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6 rounded-xl border border-red-400 bg-red-50 p-4 text-sm text-red-800 shadow-sm"
          >
            Please answer all questions in this step before proceeding.
          </motion.div>
        )}

        <div className="mb-6 w-1/3 flex items-center gap-3">
          <div className="text-xs font-medium text-slate-600">Step {currentSection + 1} of {totalSections}</div>
          <div className="flex items-center gap-1 flex-1 max-w-[150px]">
            {sections.map((_, index) => (
              <motion.div
                key={index}
                className="h-2 rounded-full bg-slate-200"
                initial={{ width: 0 }}
                animate={{
                  width: index === currentSection ? "40%" : index < currentSection ? "25%" : "15%",
                  backgroundColor: index <= currentSection ? "#f6851f" : "#e2e8f0",
                }}
                transition={{ duration: 0.4 }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {!showUserForm && (
              <motion.div initial="hidden" animate="visible" exit="exit" variants={formVariants}>
                <div className="space-y-6">{currentQuestions.map((question, index) => renderQuestion(question, index))}</div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    onClick={prevSection}
                    disabled={currentSection === 0}
                    className={`cursor-pointer inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium shadow-sm transition hover:scale-[1.01] ${
                      currentSection === 0
                        ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>

                  <div className="text-sm text-slate-600">
                    Step {currentSection + 1} of {totalSections}
                  </div>

                  {currentSection < totalSections - 1 ? (
                    <button
                      onClick={nextSection}
                      className="cursor-pointer inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f6851f] to-[#e63946] px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.01]"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleContinue}
                      className="cursor-pointer inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#f6851f] to-[#e63946] px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.01]"
                    >
                      Continue
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {showUserForm && (
              <motion.div initial="hidden" animate="visible" exit="exit" variants={formVariants} className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-slate-900">Your Details</h2>
                  <p className="text-sm text-slate-600">Provide contact and address information to proceed.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-800">Full Name</label>
                    <div className="relative">
                      <User className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        value={user.fullName}
                        onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                        placeholder="Enter full name"
                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-sm outline-none transition-shadow ${userErrors.fullName ? "border-red-300" : "border-slate-200 focus:shadow-[0_0_0_4px_rgba(246,133,31,0.18)]"}`}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-800">Email Address</label>
                    <div className="relative">
                      <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        placeholder="name@example.com"
                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-sm outline-none transition-shadow ${userErrors.email ? "border-red-300" : "border-slate-200 focus:shadow-[0_0_0_4px_rgba(246,133,31,0.18)]"}`}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-800">Phone Number</label>
                    <div className="relative">
                      <Phone className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        value={user.phone}
                        onChange={(e) => setUser({ ...user, phone: e.target.value.replace(/[^0-9+\-\s]/g, "") })}
                        placeholder="+1 555 123 4567"
                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-sm outline-none transition-shadow ${userErrors.phone ? "border-red-300" : "border-slate-200 focus:shadow-[0_0_0_4px_rgba(246,133,31,0.18)]"}`}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-800">Zipcode</label>
                    <div className="relative">
                      <MapPin className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        value={user.zipcode}
                        onChange={(e) => setUser({ ...user, zipcode: e.target.value.replace(/[^0-9]/g, "").slice(0, 10) })}
                        placeholder="94016"
                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-sm outline-none transition-shadow ${userErrors.zipcode ? "border-red-300" : "border-slate-200 focus:shadow-[0_0_0_4px_rgba(246,133,31,0.18)]"}`}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-800">State</label>
                    <div className="relative">
                      <Landmark className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        value={user.state}
                        onChange={(e) => setUser({ ...user, state: e.target.value })}
                        placeholder="State"
                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-sm outline-none transition-shadow ${userErrors.state ? "border-red-300" : "border-slate-200 focus:shadow-[0_0_0_4px_rgba(246,133,31,0.18)]"}`}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-800">City</label>
                    <div className="relative">
                      <Building className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        value={user.city}
                        onChange={(e) => setUser({ ...user, city: e.target.value })}
                        placeholder="City"
                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-sm outline-none transition-shadow ${userErrors.city ? "border-red-300" : "border-slate-200 focus:shadow-[0_0_0_4px_rgba(246,133,31,0.18)]"}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setShowUserForm(false)}
                    className="cursor-pointer inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:scale-[1.01]"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>

                  {/* {
                    userExists ?
                    <button
                    onClick={() => {
                      const errs = {};
                      if (!user.fullName) errs.fullName = true;
                      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) errs.email = true;
                      if (!user.phone || user.phone.replace(/\D/g, "").length < 7) errs.phone = true;
                      if (!user.zipcode) errs.zipcode = true;
                      if (!user.state) errs.state = true;
                      if (!user.city) errs.city = true;
                      setUserErrors(errs);
                      if (Object.keys(errs).length === 0) {
                        setShowAuctionModal(true);
                      }
                    }}
                    className="cursor-pointer inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#f6851f] to-[#e63946] px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.01]"
                  >
                    Submit
                  </button> :
                    <a className="btn-login" href="#" onClick={handleLoginClick}>
                    Login to continue
                  </a> 
                  } */}
                  <button
                    onClick={() => {
                      const errs = {};
                      if (!user.fullName) errs.fullName = true;
                      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) errs.email = true;
                      if (!user.phone || user.phone.replace(/\D/g, "").length < 7) errs.phone = true;
                      if (!user.zipcode) errs.zipcode = true;
                      if (!user.state) errs.state = true;
                      if (!user.city) errs.city = true;
                      setUserErrors(errs);
                      const data = getFinalSubmissionData();
                      setFinalData(data)
                      if (Object.keys(errs).length === 0) {
                        setShowAuctionModal(true);
                      }
                    }}
                    className="cursor-pointer inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#f6851f] to-[#e63946] px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.01]"
                  >
                    Submit
                  </button> 
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900">Your Answers</p>
                  <span className="text-xs text-slate-600">
                    {answeredQuestions}/{totalQuestions}
                  </span>
                </div>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {sections.flatMap((section) =>
                    section.questions.map((q) => (
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
                              confirmedAnswers[q.key] ? "text-orange-700" : "text-slate-500"
                            }`}
                          >
                            {q.isMultiSelect
                              ? confirmedAnswers[q.key]?.join(", ") || answers[q.key]?.join(", ") || "—"
                              : confirmedAnswers[q.key] || answers[q.key] || "—"}
                          </span>
                        </div>

                        {details[q.key] && (
                          <div className="mt-2 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded break-words">
                            {details[q.key].substring(0, 60)}...
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuctionSelectionModal 
        isOpen={showAuctionModal} 
        onClose={setShowAuctionModal} 
        conditionData={finalData}
      />

      {/* Login Modal */}
      <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onForgotPassword={handleForgotPassword}
          onRegister={handleRegister}
        />
    </div>
  );
}