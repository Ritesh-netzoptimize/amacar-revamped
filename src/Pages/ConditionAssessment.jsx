import { toast } from "react-hot-toast";
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, User, Mail, Phone, MapPin, Landmark, Building } from "lucide-react";
import AuctionSelectionModal from "@/components/ui/auction-selection-modal";
import { useDispatch, useSelector } from "react-redux";
import LoginModal from "@/components/ui/LoginModal";
import { setLoginRedirect } from "@/redux/slices/userSlice"; // Adjust import path
import { updateQuestion, resetQuestions } from "@/redux/slices/carDetailsAndQuestionsSlice"; // Adjust import path

export default function ConditionAssessment() {
  const dispatch = useDispatch();
  const { questions, vehicleDetails, stateZip, stateVin, location } = useSelector((state) => state.carDetailsAndQuestions);
  const userState = useSelector((state) => state.user.user);

  // Initialize questions if invalid

  useEffect(() => {
    if (!questions || questions.length !== 8) {
      console.warn("Resetting questions due to invalid state");
      dispatch(resetQuestions());
    }
  }, [dispatch, questions]);

  // Group questions into sections for rendering
  const sections = useMemo(() => {
    if (!questions || questions.length < 8) {
      console.error("Questions array is incomplete:", questions);
      return [];
    }
    return [
      { questions: questions.slice(0, 2) }, // Cosmetic, Smoked
      { questions: questions.slice(2, 4) }, // Title, Accident
      { questions: questions.slice(4, 6) }, // Features, Modifications
      { questions: questions.slice(6, 8) }, // Warning, Tread
    ];
  }, [questions]);

  const [currentSection, setCurrentSection] = useState(0);
  const [showValidation, setShowValidation] = useState(false);
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    zipcode: "",
    state: "",
    city: "",
  });
  const [userErrors, setUserErrors] = useState({});

  const userExists = useSelector((state) => state?.user?.user);

  const formVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
  };

  const totalSections = sections.length;
  const answeredQuestions = questions ? questions.filter((q) => q.answer || (q.isMultiSelect && Array.isArray(q.answer) && q.answer.length > 0)).length : 0;
  const totalQuestions = questions ? questions.length : 0;
  const currentQuestions = sections[currentSection]?.questions || [];

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
    return questions ? questions.map((q) => ({
      key: q.key,
      label: q.label,
      answer: q.answer || null,
      details: q.details || null,
    })) : [];
  }

  // Simple function to open auction modal
  function handleSubmitToAuction() {
    // Check if vehicle details exist
    if (!vehicleDetails || Object.keys(vehicleDetails).length === 0) {
      toast.error("Vehicle details are required. Please complete the VIN lookup first.");
      return;
    }

    // Open auction selection modal
    setShowAuctionModal(true);
  }


  const handleForgotPassword = () => {
    // console.log("Open forgot password modal");
  };

  const handleRegister = () => {
    // console.log("Open register modal");
  };

  function selectAnswer(key, value, isMultiSelect = false) {
    let newAnswer;
    if (isMultiSelect) {
      const currentAnswer = questions.find((q) => q.key === key)?.answer || [];
      newAnswer = Array.isArray(currentAnswer)
        ? currentAnswer.includes(value)
          ? currentAnswer.filter((v) => v !== value)
          : [...currentAnswer, value]
        : [value];
    } else {
      newAnswer = value;
    }

    dispatch(updateQuestion({ key, answer: newAnswer }));
    setShowValidation(false);
  }

  function setQuestionDetails(key, value) {
    dispatch(updateQuestion({ key, details: value }));
  }

  function nextSection() {
    const unanswered = currentQuestions.some(
      (q) => !q.answer || (q.isMultiSelect && (!Array.isArray(q.answer) || q.answer.length === 0))
    );
    if (unanswered) {
      setShowValidation(true);
      return;
    }
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
    const unanswered = currentQuestions.some(
      (q) => !q.answer || (q.isMultiSelect && (!Array.isArray(q.answer) || q.answer.length === 0))
    );
    if (unanswered) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    setShowUserForm(true);
  }

  function renderQuestion(question, questionIndex) {
    // console.log(question)
    const selected = question.answer;
    // console.log(question.answer)
    
    // Fixed: Added defensive checks for needsDetails
    const needsDetails = question.isMultiSelect
      ? (question.needsDetails && Array.isArray(question.needsDetails) && question.needsDetails.length > 0 && Array.isArray(selected) && selected.length > 0)
      : selected && question.needsDetails && Array.isArray(question.needsDetails) && question.needsDetails.includes(selected);

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
            <span className="mr-2">{question.emoji || '❓'}</span>
            {question.label}
          </h3>
        </div>

        <div className={`grid ${question.isMultiSelect ? "grid-cols-1 gap-2" : "grid-cols-2 gap-3 md:grid-cols-3"} mb-4`}>
          {(question.options || []).map((opt) => {
            const isSelected = question.isMultiSelect
              ? Array.isArray(selected) && selected.includes(opt)
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
              value={question.details || ""}
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

  // Show loading or error if questions are not ready
  if (!questions || questions.length === 0) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 pt-20 md:pt-24">
        <div className="mx-auto max-w-6xl px-6 py-8 md:py-12 text-center">
          <h1 className="mb-6 text-center text-3xl md:text-4xl font-bold text-slate-900">
            Loading Assessment...
          </h1>
        </div>
      </div>
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
                  <p className="text-sm text-slate-600">
                    {userState?.display_name ? "Verify your information below." : "Provide contact and address information to proceed."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-800 flex items-center gap-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className={`h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                        userState?.display_name ? "text-orange-500" : "text-slate-400"
                      }`} />
                      <input
                        value={user.fullName || userState?.display_name || ""}
                        onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                        placeholder="Enter full name"
                        disabled={!!userState?.display_name}
                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-sm outline-none transition-shadow ${
                          userState?.display_name 
                            ? "bg-green-50 border-orange-200 text-orange-800 cursor-not-allowed" 
                            : userErrors.fullName 
                              ? "border-red-300" 
                              : "border-slate-200 focus:shadow-[0_0_0_4px_rgba(246,133,31,0.18)]"
                        }`}
                      />
                      {userState?.display_name && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-800 flex items-center gap-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className={`h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                        userState?.email ? "text-orange-500" : "text-slate-400"
                      }`} />
                      <input
                        value={user.email || userState?.email || ""}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        placeholder="name@example.com"
                        disabled={!!userState?.email}
                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-sm outline-none transition-shadow ${
                          userState?.email 
                            ? "bg-orange-50 border-orange-200 text-orange-800 cursor-not-allowed" 
                            : userErrors.email 
                              ? "border-red-300" 
                              : "border-slate-200 focus:shadow-[0_0_0_4px_rgba(246,133,31,0.18)]"
                        }`}
                      />
                      {userState?.email && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-800 flex items-center gap-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className={`h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                        userState?.meta?.phone ? "text-orange-500" : "text-slate-400"
                      }`} />
                      <input
                        value={user.phone || userState?.meta?.phone || ""}
                        onChange={(e) => setUser({ ...user, phone: e.target.value.replace(/[^0-9+\-\s]/g, "") })}
                        placeholder="+1 555 123 4567"
                        disabled={!!userState?.meta?.phone}
                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-sm outline-none transition-shadow ${
                          userState?.meta?.phone 
                            ? "bg-orange-50 border-orange-200 text-orange-800 cursor-not-allowed" 
                            : userErrors.phone 
                              ? "border-red-300" 
                              : "border-slate-200 focus:shadow-[0_0_0_4px_rgba(246,133,31,0.18)]"
                        }`}
                      />
                      {userState?.meta?.phone && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-800 flex items-center gap-2">
                      Zipcode
                    </label>
                    <div className="relative">
                      <MapPin className={`h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                        userState?.zipcode ? "text-orange-500" : "text-slate-400"
                      }`} />
                      <input
                        value={user.zipcode || stateZip || ""}
                        onChange={(e) => setUser({ ...user, zipcode: e.target.value.replace(/[^0-9]/g, "").slice(0, 10) })}
                        placeholder="94016"
                        disabled={!!stateZip}
                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-sm outline-none transition-shadow ${
                          stateZip
                            ? "bg-orange-50 border-orange-200 text-orange-800 cursor-not-allowed" 
                            : userErrors.zipcode 
                              ? "border-red-300" 
                              : "border-slate-200 focus:shadow-[0_0_0_4px_rgba(246,133,31,0.18)]"
                        }`}
                      />
                      {stateZip && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-800 flex items-center gap-2">
                      State
                    </label>
                    <div className="relative">
                      <Landmark className={`h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                        location.state ? "text-orange-500" : "text-slate-400"
                      }`} />
                      <input
                        value={user.state || location.state || ""}
                        onChange={(e) => setUser({ ...user, state: e.target.value })}
                        placeholder="State"
                        disabled={!!location.state}
                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-sm outline-none transition-shadow ${
                          location.state 
                            ? "bg-orange-50 border-orange-200 text-orange-800 cursor-not-allowed" 
                            : userErrors.state 
                              ? "border-red-300" 
                              : "border-slate-200 focus:shadow-[0_0_0_4px_rgba(246,133,31,0.18)]"
                        }`}
                      />
                      {location.state && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-800 flex items-center gap-2">
                      City
                    </label>
                    <div className="relative">
                      <Building className={`h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                        location.city ? "text-orange-500" : "text-slate-400"
                      }`} />
                      <input
                        value={user.city || location.city || ""}
                        onChange={(e) => setUser({ ...user, city: e.target.value })}
                        placeholder="City"
                        disabled={!!location.city}
                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-sm outline-none transition-shadow ${
                          location.city 
                            ? "bg-orange-50 border-orange-200 text-orange-800 cursor-not-allowed" 
                            : userErrors.city 
                              ? "border-red-300" 
                              : "border-slate-200 focus:shadow-[0_0_0_4px_rgba(246,133,31,0.18)]"
                        }`}
                      />
                      {location.city && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                        </div>
                      )}
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

                  {/* Vehicle details missing warning */}
                  {(!vehicleDetails || Object.keys(vehicleDetails).length === 0) && (
                    <div className="flex-1 mx-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 mb-2">
                        <strong>Vehicle details required:</strong> Please complete the VIN lookup first to get an instant cash offer.
                      </p>
                      <button
                        onClick={() => setShowAuctionModal(true)}
                        className="text-sm text-yellow-700 underline hover:text-yellow-900"
                      >
                        Start VIN Lookup →
                      </button>
                    </div>
                  )}

                  {userExists ? (
                    <button
                      onClick={() => {
                        const finalUserData = {
                          fullName: user.fullName || userState?.display_name || "",
                          email: user.email || userState?.email || "",
                          phone: user.phone || userState?.meta?.phone || "",
                          zipcode: user.zipcode || stateZip || "",
                          state: user.state || location.state || "",
                          city: user.city || location.city || "",
                        };

                        const errs = {};
                        if (!finalUserData.fullName) errs.fullName = true;
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(finalUserData.email)) errs.email = true;
                        if (!finalUserData.phone || finalUserData.phone.replace(/\D/g, "").length < 7) errs.phone = true;
                        if (!finalUserData.zipcode) errs.zipcode = true;
                        if (!finalUserData.state) errs.state = true;
                        if (!finalUserData.city) errs.city = true;

                        setUserErrors(errs);
                        const data = getFinalSubmissionData();

                        if (Object.keys(errs).length === 0) {
                          handleSubmitToAuction();
                        }
                      }}
                      disabled={!vehicleDetails || Object.keys(vehicleDetails).length === 0}
                      className={`cursor-pointer inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#f6851f] to-[#e63946] px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.01] ${
                        !vehicleDetails || Object.keys(vehicleDetails).length === 0
                          ? 'opacity-50 cursor-not-allowed' 
                          : ''
                      }`}
                    >
                      {(!vehicleDetails || Object.keys(vehicleDetails).length === 0) ? (
                        'VIN Required'
                      ) : (
                        'Check instant offer'
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleLoginClick}
                      className="cursor-pointer inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#f6851f] to-[#e63946] px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.01]"
                    >
                      Login
                    </button>
                  )}
                  
                  {/* Success display for offer */}
                  {/* {offerStatus === 'succeeded' && offer.offerAmount && (
                    <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-green-800">Instant Cash Offer Received!</h3>
                      </div>
                      <p className="text-2xl font-bold text-green-700 mb-2">${offer.offerAmount}</p>
                      <p className="text-sm text-green-600 mb-3">
                        {offer.carSummary?.make} {offer.carSummary?.model} {offer.carSummary?.modelyear}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowAuctionModal(true)}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => dispatch(clearOffer())}
                          className="px-4 py-2 border border-green-300 text-green-700 text-sm font-medium rounded-lg hover:bg-green-50"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )} */}

                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-4 ">
            <div className="sticky top-6 space-y-6">
              {/* Vehicle Information Card */}
              <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-900">Vehicle Information</h3>
                    <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                  </div>
                  
                  {/* VIN Badge */}
                  <div className="mb-4">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#f6851f] to-[#e63946] text-white text-sm font-semibold">
                      VIN- {vehicleDetails?.vin || "JTHBL46FX75021954"}
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Vehicle</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {vehicleDetails?.modelyear || "2007"} {vehicleDetails?.make || "LEXUS"} {vehicleDetails?.model || "LS"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Type</span>
                      <span className="text-sm font-semibold text-[#f6851f]">
                        {vehicleDetails?.bodytype || "SEDAN"} {vehicleDetails?.doors || "4D"} {vehicleDetails?.model || "LS460"} {vehicleDetails?.engineconfiguration || "4.6L"} {vehicleDetails?.fueltype || "V8"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Image Placeholder */}
                <div className="relative mb-3">
                  <div className="w-full h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <span className="text-xl font-bold text-[#f6851f]">amacar</span>
                        <div className="ml-1 w-5 h-5 border-2 border-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                      <p className="text-xs font-medium text-slate-600">No Image Available</p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Mileage:</span>
                    <span className="font-medium">{vehicleDetails?.mileage ? Number(vehicleDetails.mileage).toLocaleString() + ' km' : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium">{location?.city || 'N/A'}, {location?.state || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Your Answers Card */}
              <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900">Your Answers</p>
                  <span className="text-xs text-slate-600">
                    {answeredQuestions}/{totalQuestions}
                  </span>
                </div>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {questions.map((q) => (
                    <div
                      key={q.key}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 flex flex-col"
                    >
                      <div className=" flex items-center justify-between text-sm gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span>{q.emoji || '❓'}</span>
                          <span className="truncate min-w-0">{q.label}</span>
                        </div>
                        <span
                          className={`text-xs font-medium whitespace-nowrap ${
                            q.answer ? "text-orange-700" : "text-slate-500"
                          }`}
                        >
                          {q.isMultiSelect
                            ? Array.isArray(q.answer) && q.answer.length > 0
                              ? q.answer.join(", ")
                              : "—"
                            : q.answer || "—"}
                        </span>
                      </div>

                      {q.details && (
                        <div className="mt-2 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded break-words">
                          {q.details.substring(0, 60)}...
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

      <AuctionSelectionModal 
        isOpen={showAuctionModal} 
        onClose={() => setShowAuctionModal(false)} 
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onForgotPassword={handleForgotPassword}
        onRegister={handleRegister}
      />
    </div>
  );
}