import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Wrench, Eye, EyeOff } from "lucide-react";
import API from "../api/axios";
import Button from "../component/Button";
import Input from "../component/Input";
import { useToast } from "../component/Toast";

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
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
    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "Enter a valid email address.";
    if (!form.password) errors.password = "Password is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await API.post("/users/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
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
          <div className="flex items-center justify-center mx-auto mb-8">
            <Wrench size={44} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-blue-100 leading-relaxed">
            SIMS — SmartPark Inventory Management. Track, manage, and optimize
            your spare parts.
          </p>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              Real-time
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              Secure
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              24/7
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-12 justify-center">
            <div className="">
              <Wrench size={40} className="text-blue-700" />
            </div>
            <span className="text-xl font-bold text-brand-text tracking-tight">
              SIMS
            </span>
          </div>

          <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-brand-text tracking-tight mb-2">
                Sign In
              </h1>
              <p className="text-sm text-brand-muted">
                Enter your credentials to access your account.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                error={fieldErrors.email}
              />

              <div className="mb-6">
                <label className="block text-sm font-semibold text-brand-muted mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl text-sm text-brand-text placeholder-slate-400 transition-all duration-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-blue-500/20 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-muted cursor-pointer"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div className="flex justify-end -mt-4 mb-5">
                <Link to="/forgot-password" className="text-xs text-brand-muted hover:text-brand-primary transition-colors font-medium">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-brand-muted mt-8">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-brand-primary font-semibold hover:text-brand-hover transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            &copy; {new Date().getFullYear()} SIMS — SmartPark Inventory
          </p>
        </div>
      </div>
    </div>
  );
}
