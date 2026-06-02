import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Wrench, Eye, EyeOff } from "lucide-react";
import API from "../api/axios";
import Button from "../component/Button";
import Input from "../component/Input";
import { useToast } from "../component/Toast";

export default function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name])
      setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Full name is required.";
    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "Enter a valid email address.";
    if (!form.password) errors.password = "Password is required.";
    else if (form.password.length < 8)
      errors.password = "Password must be at least 8 characters.";
    else if (!/[A-Z]/.test(form.password))
      errors.password = "Password must contain an uppercase letter.";
    else if (!/[a-z]/.test(form.password))
      errors.password = "Password must contain a lowercase letter.";
    else if (!/[0-9]/.test(form.password))
      errors.password = "Password must contain a number.";
    else if (!/[!@#$%^&*(),.?":{}|<>_-]/.test(form.password))
      errors.password = "Password must contain a special character.";
    if (!form.confirmPassword)
      errors.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword)
      errors.confirmPassword = "Passwords do not match.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await API.post("/users/register", {
        Name: form.name,
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast("Account created! Now set up your security questions.", "success");
      navigate("/setup-security");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed.";
      setError(msg);
      toast(msg, "error");
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
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Join SIMS Today</h2>
          <p className="text-blue-100 leading-relaxed mb-10">Create your account and start managing SmartPark's spare parts inventory like a pro.</p>
          <div className="space-y-4 text-left max-w-xs mx-auto">
            {["Track stock in & out movements", "Generate detailed reports", "Get low stock alerts instantly"].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-blue-100">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>
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
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-brand-text tracking-tight mb-2">Create Account</h1>
              <p className="text-sm text-brand-muted">Fill in the details to get started.</p>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <Input label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required error={fieldErrors.name} />
              <Input label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required error={fieldErrors.email} />

              <div className="mb-6">
                <label className="block text-sm font-semibold text-brand-muted mb-2">Password</label>
                <div className="relative">
                  <input name="password" type={showPw ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="Create a strong password"
                    className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl text-sm text-brand-text placeholder-slate-400 transition-all duration-200 focus:outline-none focus:border-brand-primary focus:ring-[3px] focus:ring-blue-500/15 hover:border-slate-300 pr-10" required />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-muted cursor-pointer" aria-label={showPw ? "Hide password" : "Show password"}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.password}</p>}
                <p className="text-xs text-brand-muted mt-2">Min 8 chars, upper, lower, number & special char</p>
              </div>

              <Input label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat your password" required error={fieldErrors.confirmPassword} />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
                ) : (
                  <><UserPlus size={18} />Create Account</>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-brand-muted mt-8">
              Already have an account?{" "}
              <Link to="/login" className="text-brand-primary font-semibold hover:text-brand-hover transition-colors">Sign In</Link>
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">&copy; {new Date().getFullYear()} SIMS — SmartPark Inventory</p>
        </div>
      </div>
    </div>
  );
}
