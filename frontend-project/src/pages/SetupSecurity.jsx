import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Wrench } from "lucide-react";
import API from "../api/axios";
import Button from "../component/Button";
import Input from "../component/Input";
import { useToast } from "../component/Toast";

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What city were you born in?",
  "What was the name of your elementary school?",
  "What is your favorite book?",
  "What is the name of your best childhood friend?",
  "What was the make of your first car?",
  "What is your favorite food?",
];

export default function SetupSecurity() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ q1: "", a1: "", q2: "", a2: "" });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
  };

  const availableQ2 = SECURITY_QUESTIONS.filter((q) => q !== form.q1);

  const validate = () => {
    const errors = {};
    if (!form.q1) errors.q1 = "Select a question.";
    if (!form.a1.trim()) errors.a1 = "Answer is required.";
    if (!form.q2) errors.q2 = "Select a question.";
    if (form.q1 && form.q2 && form.q1 === form.q2) errors.q2 = "Must be different from question 1.";
    if (!form.a2.trim()) errors.a2 = "Answer is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await API.put("/users/questions", {
        questions: [
          { question: form.q1, answer: form.a1 },
          { question: form.q2, answer: form.a2 },
        ],
      });
      toast("Security questions saved!", "success");
      navigate("/dashboard");
    } catch (err) {
      toast(err.response?.data?.message || "Failed to save security questions.", "error");
    } finally {
      setLoading(false);
    }
  };

  const renderSelect = (name, value, placeholder, options, error) => (
    <div className="mb-6">
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl text-sm text-brand-text transition-all duration-200 focus:outline-none focus:border-brand-primary focus:ring-[3px] focus:ring-blue-500/15 hover:border-slate-300"
      >
        <option value="">{placeholder}</option>
        {options.map((q) => (
          <option key={q} value={q}>{q}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="">
              <Wrench size={40} className="text-blue-700" />
            </div>
            <span className="text-xl font-bold text-brand-text tracking-tight">SIMS</span>
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck size={22} className="text-brand-primary" />
            <h1 className="text-xl font-bold text-brand-text tracking-tight">Set Up Security Questions</h1>
          </div>
          <p className="text-sm text-brand-muted mb-6 leading-relaxed">
            Choose 2 security questions and answers. You'll need these to reset your password if you ever forget it.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label className="block text-sm font-semibold text-brand-muted mb-2">Question 1</label>
            {renderSelect("q1", form.q1, "Select a security question", SECURITY_QUESTIONS, fieldErrors.q1)}

            <Input label="Answer 1" name="a1" value={form.a1} onChange={handleChange} placeholder="Your answer" required error={fieldErrors.a1} />

            <label className="block text-sm font-semibold text-brand-muted mb-2">Question 2</label>
            {renderSelect("q2", form.q2, "Select a different question", availableQ2, fieldErrors.q2)}

            <Input label="Answer 2" name="a2" value={form.a2} onChange={handleChange} placeholder="Your answer" required error={fieldErrors.a2} />

            <div className="flex gap-4 mt-8">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Saving..." : "Save & Continue"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate("/dashboard")}>
                Skip
              </Button>
            </div>
            <p className="text-xs text-brand-muted text-center mt-4">You can also set these later from your profile.</p>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">&copy; {new Date().getFullYear()} SIMS — SmartPark Inventory</p>
      </div>
    </div>
  );
}
