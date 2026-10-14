import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Signup failed");
      }

      setMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = () => {
    setMessage("Google Authentication flow triggered...");
    setTimeout(() => {
      localStorage.setItem("token", "google_mock_jwt_token_123");
      navigate("/");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-8 font-sans text-ink-950">
      <div className="w-full max-w-md rounded-[20px] border border-line bg-white p-8 shadow-sm">
        {/* SPHERE Logo Header */}
        <div className="flex items-center gap-2.5 mb-8">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-950 text-[14px] text-white">
            ✧
          </span>
          <span className="text-[20px] font-bold tracking-tight text-ink-950">
            SPHERE
          </span>
        </div>

        <h1 className="text-[24px] font-bold tracking-tight text-ink-950 mb-2">
          Create an account
        </h1>
        <p className="text-[14px] leading-relaxed text-ink-950/55 mb-6">
          Get started with SPHERE to automate pre-sales workspace & engineering workflows.
        </p>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 p-3.5 text-[13px] font-medium text-red-600 border border-red-100">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-lg bg-emerald-50 p-3.5 text-[13px] font-medium text-emerald-700 border border-emerald-100">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-ink-950 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Ayesha Siddiqui"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[14px] text-ink-950 outline-none transition-colors focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-ink-950 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="ayesha@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[14px] text-ink-950 outline-none transition-colors focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-ink-950 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[14px] text-ink-950 outline-none transition-colors focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-ink-950 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[14px] text-ink-950 outline-none transition-colors focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <button
            type="submit"
            className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-ink-950 py-3 text-[14px] font-semibold text-white transition-transform hover:scale-[1.01]"
          >
            Create Account
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-line" />
          </div>
          <div className="relative flex justify-center text-[12px] uppercase">
            <span className="bg-white px-2 text-ink-950/40 font-medium">Or sign up with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-line bg-white py-3 text-[14px] font-semibold text-ink-950 transition-colors hover:bg-canvas"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.2v3.15C3.18 21.31 7.23 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.2C.44 8.15 0 9.89 0 12s.44 3.85 1.2 5.4l4.07-3.16z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.18 2.69 1.2 6.6l4.07 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="mt-6 text-center text-[13px] text-ink-950/60">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}