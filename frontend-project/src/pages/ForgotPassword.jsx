import { useState } from "react";
import { Link } from "react-router-dom";
import { Wrench, Mail, ArrowLeft, Key, Eye, EyeOff, ShieldCheck, CheckCircle } from "lucide-react";
import API from "../api/axios";
import Button from "../component/Button";
import Input from "../component/Input";
import { useToast } from "../component/Toast";

export default function ForgotPassword() {
  const toast = useToast();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({ answer1: "", answer2: "" });
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPw, setShowPw] = useState(false);

  const handleGetQuestions = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Enter your email address."); return; }
    setLoading(true);
    try {
      const { data } = await API.post("/users/get-security-questions", { email });
      setQuestions(data);
      setStep("questions");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to find account.";
      setError(msg);
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAnswers = async (e) => {
    e.preventDefault();
    setError("");
    if (!answers.answer1.trim() || !answers.answer2.trim()) {
      setError("Please answer both security questions.");
      return;
    }
    setStep("reset");
  };

  const validatePassword = () => {
    const errors = {};
    if (!form.password) errors.password = "Password is required.";
    else if (form.password.length < 8) errors.password = "Must be at least 8 characters.";
    else if (!/[A-Z]/.test(form.password)) errors.password = "Must contain an uppercase letter.";
    else if (!/[a-z]/.test(form.password)) errors.password = "Must contain a lowercase letter.";
    else if (!/[0-9]/.test(form.password)) errors.password = "Must contain a number.";
    else if (!/[!@#$%^&*(),.?":{}|<>_-]/.test(form.password)) errors.password = "Must contain a special character.";
    if (!form.confirmPassword) errors.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) errors.confirmPassword = "Passwords do not match.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (!validatePassword()) return;
    setLoading(true);
    try {
      await API.post("/users/verify-and-reset-password", {
        email,
        answer1: answers.answer1,
        answer2: answers.answer2,
        password: form.password,
      });
      toast("Password reset successfully! Please sign in.", "success");
      setTimeout(() => window.location.href = "/login", 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to reset password.";
      setError(msg);
      toast(msg, "error");
      if (msg.toLowerCase().includes("answer")) {
        setStep("questions");
        setFieldErrors({});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-blue-700 items-center justify-center p-12 lg:p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="relative z-10 text-center max-w-md">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-8">
            <Wrench size={44} className="text-white" />
          </div>
          {step === "email" && (
            <>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Forgot Password?</h2>
              <p className="text-blue-100 leading-relaxed">Enter your email to verify your identity with security questions.</p>
            </>
          )}
          {step === "questions" && (
            <>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Verify Identity</h2>
              <p className="text-blue-100 leading-relaxed">Answer your security questions to reset your password.</p>
            </>
          )}
          {step === "reset" && (
            <>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">New Password</h2>
              <p className="text-blue-100 leading-relaxed">Create a strong password for your account.</p>
            </>
          )}
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-12 justify-center">
            <div className="">
              <Wrench size={40} className="text-blue-700" />
            </div>
            <span className="text-xl font-bold text-brand-text tracking-tight">SIMS</span>
          </div>

          <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-sm">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step !== "email" ? "bg-emerald-500 text-white" : "bg-brand-primary text-white"}`}>
                {step !== "email" ? <CheckCircle size={14} /> : "1"}
              </div>
              <div className="h-px flex-1 bg-slate-200" />
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === "reset" ? "bg-emerald-500 text-white" : step === "questions" ? "bg-brand-primary text-white" : "bg-slate-200 text-slate-400"}`}>
                {step === "reset" ? <CheckCircle size={14} /> : "2"}
              </div>
              <div className="h-px flex-1 bg-slate-200" />
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === "reset" ? "bg-brand-primary text-white" : "bg-slate-200 text-slate-400"}`}>3</div>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

            {/* Step 1: Email */}
            {step === "email" && (
              <form onSubmit={handleGetQuestions} noValidate>
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-brand-text tracking-tight mb-2">Find Account</h1>
                  <p className="text-sm text-brand-muted">Enter your registered email to continue.</p>
                </div>
                <Input label="Email Address" name="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="you@example.com" required />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying...</> : <><Mail size={18} />Continue</>}
                </Button>
              </form>
            )}

            {/* Step 2: Security Questions */}
            {step === "questions" && questions && (
              <form onSubmit={handleVerifyAnswers} noValidate>
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={18} className="text-brand-primary" />
                    <h1 className="text-lg font-bold text-brand-text tracking-tight">Security Questions</h1>
                  </div>
                  <p className="text-sm text-brand-muted">Answer both questions to verify your identity.</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-brand-muted mb-2">Question 1</label>
                  <p className="text-sm text-brand-text mb-3 p-3 bg-slate-50 rounded-xl border border-slate-100">{questions.question1}</p>
                  <input name="answer1" type="text" value={answers.answer1} onChange={(e) => setAnswers({ ...answers, answer1: e.target.value })} placeholder="Your answer"
                    className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl text-sm text-brand-text placeholder-slate-400 transition-all duration-200 focus:outline-none focus:border-brand-primary focus:ring-[3px] focus:ring-blue-500/15 hover:border-slate-300" />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-brand-muted mb-2">Question 2</label>
                  <p className="text-sm text-brand-text mb-3 p-3 bg-slate-50 rounded-xl border border-slate-100">{questions.question2}</p>
                  <input name="answer2" type="text" value={answers.answer2} onChange={(e) => setAnswers({ ...answers, answer2: e.target.value })} placeholder="Your answer"
                    className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl text-sm text-brand-text placeholder-slate-400 transition-all duration-200 focus:outline-none focus:border-brand-primary focus:ring-[3px] focus:ring-blue-500/15 hover:border-slate-300" />
                </div>

                <Button type="submit" className="w-full">Continue</Button>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === "reset" && (
              <form onSubmit={handleResetPassword} noValidate>
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-brand-text tracking-tight mb-2">Reset Password</h1>
                  <p className="text-sm text-brand-muted">Create a new password for your account.</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-brand-muted mb-2">New Password</label>
                  <div className="relative">
                    <input name="password" type={showPw ? "text" : "password"} value={form.password} onChange={(e) => { setForm({ ...form, password: e.target.value }); setFieldErrors({}); }} placeholder="Create a strong password"
                      className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl text-sm text-brand-text placeholder-slate-400 transition-all duration-200 focus:outline-none focus:border-brand-primary focus:ring-[3px] focus:ring-blue-500/15 hover:border-slate-300 pr-10" required />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-muted cursor-pointer" aria-label={showPw ? "Hide password" : "Show password"}>
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {fieldErrors.password && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.password}</p>}
                  <p className="text-xs text-brand-muted mt-2">Min 8 chars, upper, lower, number & special char</p>
                </div>

                <Input label="Confirm New Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setFieldErrors({}); }} placeholder="Repeat your password" required error={fieldErrors.confirmPassword} />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Resetting...</> : <><Key size={18} />Reset Password</>}
                </Button>
              </form>
            )}

            <p className="text-center mt-8">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-brand-primary font-semibold hover:text-brand-hover transition-colors">
                <ArrowLeft size={16} />Back to Sign In
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">&copy; {new Date().getFullYear()} SIMS — SmartPark Inventory</p>
        </div>
      </div>
    </div>
  );
}
