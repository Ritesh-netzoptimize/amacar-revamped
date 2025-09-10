import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, CheckCircle2, Mail, Lock, Eye, EyeOff, ShieldCheck, Sparkles, User, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function LoginModal({
  isOpen,
  onClose,
  onForgotPassword,
  onRegister,
  title = "Login to Your Account",
  description = "Enter your credentials to access your account",
}) {
  // UI state
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)


  const [errors, setErrors] = useState({ email: "", username: "", password: "", confirmPassword: "", otp: "", newPassword: "" })
  const [phase, setPhase] = useState("form") // form | otp | loading | success | failed | forgot | verify-otp | reset-password
  const [isLoading, setIsLoading] = useState(false)
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false)

  const navigate = useNavigate();

  const isCloseDisabled = phase === "loading" || phase === "otp" || phase === "verify-otp"

  function validate() {
    const newErrors = { email: "", username: "", password: "", confirmPassword: "", otp: "", newPassword: "" }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }
    
    // Username validation (only for register mode)
    if (isRegisterMode && !username) {
      newErrors.username = "Username is required"
    } else if (isRegisterMode && username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }
    
    // Password validation (for login/register)
    if ((isRegisterMode || !isForgotPasswordMode) && !password) {
      newErrors.password = "Password is required"
    } else if ((isRegisterMode || !isForgotPasswordMode) && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    
    // Confirm password validation (only for register mode)
    if (isRegisterMode && !confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (isRegisterMode && confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    
    // New password validation (for reset password)
    if (phase === "reset-password" && !newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (phase === "reset-password" && newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters"
    } else if (phase === "reset-password" && newPassword !== confirmPassword) {
      newErrors.newPassword = "Passwords do not match"
    }
    
    setErrors(newErrors)
    return !newErrors.email && !newErrors.username && !newErrors.password && !newErrors.confirmPassword && !newErrors.newPassword
  }

  function validateOtp() {
    const newErrors = { ...errors, otp: "" }
    if (!otp) {
      newErrors.otp = "OTP is required"
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = "OTP must be a 6-digit number"
    } else if (otp !== "123456") {
      newErrors.otp = "Invalid OTP"
    }
    setErrors(newErrors)
    return !newErrors.otp
  }

  function startAction() {
    setPhase("loading")
    setIsLoading(true)
    
    // Simulate account creation/login/reset process
    setTimeout(() => {
      setPhase("success")
      setIsLoading(false)
    }, 2000)
  }

  function handleFailedRegistration() {
    setPhase("loading")
    setIsLoading(true)
    
    // Simulate failed registration process
    setTimeout(() => {
      setPhase("failed")
      setIsLoading(false)
      toast.error("Registration failed: OTP verification required", { duration: 2000 })
    }, 2000)
  }

  function handleSubmit(e) {
    e?.preventDefault()
    if (isRegisterMode) {
      if (validate()) {
        setShowOtpModal(true)
        setPhase("otp")
        toast.success("OTP sent to your email", { duration: 2000 })
      }
    } else if (isForgotPasswordMode && phase === "forgot") {
      if (validate()) {
        setPhase("verify-otp")
        setShowOtpModal(true)
        toast.success("OTP sent to your email", { duration: 2000 })
      }
    } else if (phase === "reset-password") {
      if (validate()) {
        startAction()
      }
    } else {
      if (validate()) {
        startAction()
      }
    }
  }

  function handleOtpSubmit(e) {
    e?.preventDefault()
    if (validateOtp()) {
      setShowOtpModal(false)
      if (isRegisterMode) {
        startAction()
      } else if (isForgotPasswordMode) {
        setPhase("reset-password")
      }
    }
  }

  function handleOtpModalClose(open) {
    if (!open && !isLoading) {
      setShowOtpModal(false)
      if (isRegisterMode) {
        handleFailedRegistration()
      } else if (isForgotPasswordMode) {
        setIsForgotPasswordMode(false)
        setPhase("form")
        setErrors({ email: "", username: "", password: "", confirmPassword: "", otp: "", newPassword: "" })
        setEmail("")
        setOtp("")
      }
    }
  }

  function handleSuccessAction() {
    toast.success(phase === "reset-password" ? "Password updated successfully" : "Redirecting to dashboard", {
      duration: 2000,
    })

    setTimeout(() => {
      onClose(false)
      if (phase === "reset-password") {
        setIsForgotPasswordMode(false)
        setPhase("form")
        setErrors({ email: "", username: "", password: "", confirmPassword: "", otp: "", newPassword: "" })
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setNewPassword("")
        setOtp("")
      } else {
        console.log(`${isRegisterMode ? "Registration" : "Login"} successful - redirect to dashboard`)
        navigate("/dashboard")
      }
    }, 2000)
  }

  function handleBackToForm() {
    setPhase("form")
    setErrors({ email: "", username: "", password: "", confirmPassword: "", otp: "", newPassword: "" })
    setOtp("")
    setNewPassword("")
  }

  function handleForgotPassword() {
    setIsForgotPasswordMode(true)
    setPhase("forgot")
    setErrors({ email: "", username: "", password: "", confirmPassword: "", otp: "", newPassword: "" })
    setEmail("")
    setUsername("")
    setPassword("")
    setConfirmPassword("")
    setOtp("")
    setNewPassword("")
  }

  function handleRegister() {
    setIsRegisterMode(true)
    setErrors({ email: "", username: "", password: "", confirmPassword: "", otp: "", newPassword: "" })
    setEmail("")
    setUsername("")
    setPassword("")
    setConfirmPassword("")
    setOtp("")
    setNewPassword("")
  }

  function handleBackToLogin() {
    setIsRegisterMode(false)
    setIsForgotPasswordMode(false)
    setErrors({ email: "", username: "", password: "", confirmPassword: "", otp: "", newPassword: "" })
    setEmail("")
    setUsername("")
    setPassword("")
    setConfirmPassword("")
    setOtp("")
    setNewPassword("")
    setShowOtpModal(false)
    setPhase("form")
  }

  useEffect(() => {
    if (phase === "success") {
      handleSuccessAction()
    }
  }, [phase])

  return (
    <>
      <Dialog open={isOpen} onOpenChange={isCloseDisabled ? undefined : onClose}>
        <DialogContent
          className="sm:max-w-md rounded-2xl shadow-xl p-0 overflow-hidden bg-white"
          showCloseButton={!isCloseDisabled}
        >
          <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900">
                {isRegisterMode ? "Create Your Account" : 
                 isForgotPasswordMode && phase === "forgot" ? "Forgot Password" : 
                 isForgotPasswordMode && phase === "verify-otp" ? "Verify OTP" : 
                 isForgotPasswordMode && phase === "reset-password" ? "Reset Password" : 
                 title}
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600">
                {isRegisterMode ? "Fill in the details to register a new account" : 
                 phase === "forgot" ? "Enter your email to receive a verification OTP" : 
                 phase === "verify-otp" ? `We’ve sent a 6-digit OTP to ${email}. Please enter it below.` : 
                 phase === "reset-password" ? "Enter your new password" : 
                 description}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 pt-0 min-h-[420px]">
            <AnimatePresence mode="wait">
              {(phase === "form" || phase === "forgot" || phase === "reset-password") && (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="grid gap-5"
                >
                  {/* Email Field */}
                  {(phase === "form" || phase === "forgot") && (
                    <div className="grid gap-2">
                      <label htmlFor="email" className="text-sm font-medium text-slate-800">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <Mail className="h-4 w-4" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="user@example.com"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)]"
                        />
                      </div>
                      {errors.email && (
                        <motion.p 
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-600"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>
                  )}

                  {/* Username Field (Register Mode Only) */}
                  {isRegisterMode && phase === "form" && (
                    <div className="grid gap-2">
                      <label htmlFor="username" className="text-sm font-medium text-slate-800">
                        Username
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <User className="h-4 w-4" />
                        </div>
                        <input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Your username"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)]"
                        />
                      </div>
                      {errors.username && (
                        <motion.p 
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-600"
                        >
                          {errors.username}
                        </motion.p>
                      )}
                    </div>
                  )}

                  {/* Password Field (Login/Register Mode) */}
                  {phase === "form" && !isForgotPasswordMode && (
                    <div className="grid gap-2">
                      <label htmlFor="password" className="text-sm font-medium text-slate-800">
                        Password
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <Lock className="h-4 w-4" />
                        </div>
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-10 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <motion.p 
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-600"
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </div>
                  )}

                  {/* New Password Field (Reset Password Mode) */}
                  {phase === "reset-password" && (
                    <div className="grid gap-2">
                      <label htmlFor="newPassword" className="text-sm font-medium text-slate-800">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <Lock className="h-4 w-4" />
                        </div>
                        <input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-10 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <motion.p 
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-600"
                        >
                          {errors.newPassword}
                        </motion.p>
                      )}
                    </div>
                  )}

                  {/* Confirm Password Field (Register/Reset Password Mode) */}
                  {(isRegisterMode || phase === "reset-password") && (
                    <div className="grid gap-2">
                      <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-800">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <Lock className="h-4 w-4" />
                        </div>
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-10 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <motion.p 
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-600"
                        >
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="cursor-pointer w-full h-11 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {isRegisterMode ? "Preparing OTP..." : 
                           phase === "forgot" ? "Sending OTP..." : 
                           phase === "reset-password" ? "Updating Password..." : 
                           "Signing In..."}
                        </div>
                      ) : (
                        isRegisterMode ? "Register" : 
                        phase === "forgot" ? "Send OTP" : 
                        phase === "reset-password" ? "Update Password" : 
                        "Login"
                      )}
                    </button>
                  </div>

                  {/* Forgot Password Link (Login Mode Only) */}
                  {!isRegisterMode && phase === "form" && !isForgotPasswordMode && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="cursor-pointer text-sm text-slate-600 hover:text-slate-800 transition-colors underline underline-offset-2"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  {/* Toggle Login/Register Link */}
                  {((phase === "form" || phase === "forgot") && !isForgotPasswordMode) && (
                    <div className="text-center">
                      <p className="text-xs text-slate-600">
                        {isRegisterMode  ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                          type="button"
                          onClick={isRegisterMode ? handleBackToLogin : handleRegister}
                          className="cursor-pointer text-orange-600 hover:text-orange-700 font-medium underline underline-offset-2 transition-colors"
                        >
                          {isRegisterMode ? "Login" : "Register"}
                        </button>
                      </p>
                    </div>
                  )}

                  {/* Security Notice */}
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    <ShieldCheck className="h-4 w-4 text-slate-700" />
                    Your credentials are encrypted and secure
                  </div>
                </motion.form>
              )}

              {phase === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="grid gap-6 place-items-center text-center"
                >
                  <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 w-full">
                    <div className="flex items-center gap-3 p-4">
                      <Loader2 className="h-5 w-5 animate-spin text-slate-700" />
                      <span className="text-sm text-slate-700">
                        {isRegisterMode ? "Processing registration..." : 
                         isForgotPasswordMode && phase === "reset-password" ? "Updating password..." : 
                         "Authenticating your credentials..."}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-slate-200">
                      <motion.div
                        className="h-1 bg-slate-800"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ ease: 'easeOut', duration: 1.8 }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-slate-600">
                    Please wait while we {isRegisterMode ? "process your registration" : 
                     isForgotPasswordMode && phase === "reset-password" ? "update your password" : 
                     "verify your account"}...
                  </div>
                </motion.div>
              )}

              {phase === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="grid gap-5 mt-[4rem] place-items-center text-center"
                >
                  <motion.div 
                    className="relative" 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ type: 'spring', stiffness: 340, damping: 18 }}
                  >
                    <div className="grid place-items-center rounded-2xl border border-green-200 bg-gradient-to-b from-white to-emerald-50 p-4 shadow-sm">
                      <CheckCircle2 className="h-14 w-14 text-green-500" />
                    </div>
                    <Sparkles className="absolute -right-2 -top-2 h-4 w-4 text-amber-500" />
                  </motion.div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {isRegisterMode ? "Account Created!" : 
                       isForgotPasswordMode ? "Password Updated!" : 
                       "Welcome back!"}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {isRegisterMode ? "Your account has been successfully created." : 
                       isForgotPasswordMode ? "Your password has been successfully updated." : 
                       "You have been successfully logged in."}
                    </p>
                  </div>
                </motion.div>
              )}

              {phase === "failed" && (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="grid gap-5 mt-[4rem] place-items-center text-center"
                >
                  <motion.div 
                    className="relative" 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ type: 'spring', stiffness: 340, damping: 18 }}
                  >
                    <div className="grid place-items-center rounded-2xl border border-red-200 bg-gradient-to-b from-white to-red-50 p-4 shadow-sm">
                      <XCircle className="h-14 w-14 text-red-500" />
                    </div>
                  </motion.div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Registration Failed
                    </h3>
                    <p className="text-sm text-slate-600">
                      OTP verification is required to complete registration.
                    </p>
                  </div>
                  <button
                    onClick={handleBackToForm}
                    className="cursor-pointer w-full max-w-[200px] h-11 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-amber-600"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>

      {/* OTP Verification Modal */}
      <Dialog open={showOtpModal && (phase === "otp" || phase === "verify-otp")} onOpenChange={handleOtpModalClose}>
        <DialogContent className="sm:max-w-md rounded-2xl shadow-xl p-6 bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900">
              Verify OTP
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600">
              We’ve sent a 6-digit OTP to {email}. Please enter it below.
            </DialogDescription>
          </DialogHeader>
          <motion.form
            onSubmit={handleOtpSubmit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="grid gap-5"
          >
            <div className="grid gap-2">
              <label htmlFor="otp" className="text-sm font-medium text-slate-800">
                OTP
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)]"
              />
              {errors.otp && (
                <motion.p 
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-600"
                >
                  {errors.otp}
                </motion.p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full h-11 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying OTP...
                </div>
              ) : (
                "Verify OTP"
              )}
            </button>
          </motion.form>
        </DialogContent>
      </Dialog>
    </>
  )
}