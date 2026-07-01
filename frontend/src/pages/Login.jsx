import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");

  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*]/.test(pwd)) strength++;

    if (strength <= 1) return { level: "Weak", color: "bg-red-500", text: "text-red-400" };
    if (strength <= 2) return { level: "Fair", color: "bg-orange-500", text: "text-orange-400" };
    if (strength <= 3) return { level: "Medium", color: "bg-yellow-500", text: "text-yellow-400" };
    if (strength <= 4) return { level: "Strong", color: "bg-green-500", text: "text-green-400" };
    return { level: "Very Strong", color: "bg-emerald-500", text: "text-emerald-400" };
  };

  const getStoredUsers = () => {
    try {
      return JSON.parse(localStorage.getItem("burnoutUsers") || "{}") || {};
    } catch {
      return {};
    }
  };

  const saveStoredUsers = (users) => {
    localStorage.setItem("burnoutUsers", JSON.stringify(users));
  };

  const signIn = (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      alert("Please enter both email and password.");
      return;
    }

    const users = getStoredUsers();
    const stored = users[email.trim().toLowerCase()];

    if (!stored || stored.password !== password) {
      alert("Email or password is incorrect.");
      return;
    }

    localStorage.setItem("burnoutUser", stored.name);
    navigate("/home");
  };

  const register = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      alert("Please complete all fields to register.");
      return;
    }

    const strengthCheck = calculatePasswordStrength(password);
    if (strengthCheck.level === "Weak") {
      alert("Password is too weak. Please use at least 8 characters with a mix of uppercase, lowercase, numbers, and symbols.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();

    if (users[normalizedEmail]) {
      alert("An account with that email already exists. Please sign in.");
      return;
    }

    users[normalizedEmail] = {
      name: name.trim(),
      password,
    };
    saveStoredUsers(users);

    localStorage.setItem("burnoutUser", name.trim());
    navigate("/home");
  };

  const resetPassword = (e) => {
    e.preventDefault();

    if (!email.trim() || !newPassword) {
      alert("Please enter your email and a new password.");
      return;
    }

    if (newPassword !== resetConfirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();

    if (!users[normalizedEmail]) {
      alert("No account found with that email.");
      return;
    }

    users[normalizedEmail].password = newPassword;
    saveStoredUsers(users);

    alert("Password updated. Please sign in with your new password.");
    switchMode("signin");
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setNewPassword("");
    setResetConfirmPassword("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white">
      <div className="absolute left-10 top-20 h-44 w-44 animate-pulse rounded-full bg-blue-400/30 blur-3xl"></div>
      <div className="absolute bottom-16 right-10 h-60 w-60 animate-pulse rounded-full bg-purple-400/30 blur-3xl"></div>
      <div className="absolute right-1/3 top-10 h-32 w-32 animate-bounce rounded-full bg-cyan-300/10 blur-2xl"></div>

      <div className="relative flex min-h-screen items-center justify-center px-5 py-8">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl md:grid-cols-2">
          <div className="hidden flex-col justify-center bg-white/10 p-10 md:flex">
            <p className="mb-3 text-sm font-semibold text-blue-200">
              Psychology + Artificial Intelligence
            </p>

            <h1 className="text-5xl font-bold leading-tight">
              Track burnout before it controls you.
            </h1>

            <p className="mt-5 text-blue-100">
              Understand stress patterns, identify burnout reasons, and receive practical recovery steps.
            </p>

            <div className="mt-10 rounded-3xl border border-white/10 bg-white/10 p-5">
              <p className="text-5xl">🧠</p>
              <p className="mt-3 text-sm text-blue-100">
                Early awareness creates better self-care.
              </p>
            </div>
          </div>

          <div className="p-7 md:p-10">
            <div className="flex items-center gap-4 rounded-full border border-white/20 bg-slate-950/60 p-1">
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold transition ${
                  mode === "signin"
                    ? "bg-white text-indigo-950 shadow-lg"
                    : "text-blue-100 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold transition ${
                  mode === "register"
                    ? "bg-white text-indigo-950 shadow-lg"
                    : "text-blue-100 hover:text-white"
                }`}
              >
                Register
              </button>
            </div>

            <h2 className="mt-8 text-3xl font-bold">
              {mode === "signin"
                ? "Welcome back"
                : mode === "register"
                ? "Create an account"
                : "Reset your password"}
            </h2>
            <p className="mt-2 text-sm text-blue-100">
              {mode === "signin"
                ? "Sign in to continue your personalized burnout check-in."
                : mode === "register"
                ? "Register to save your progress and get quicker access next time."
                : "Enter your email and a new password to reset your account."}
            </p>

            <form onSubmit={mode === "signin" ? signIn : mode === "register" ? register : resetPassword} className="mt-8 space-y-5">
              {mode === "register" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-blue-100">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-blue-200 focus:border-blue-300"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-blue-100">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-blue-200 focus:border-blue-300"
                />
              </div>

              {mode !== "forgot" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-blue-100">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-blue-200 focus:border-blue-300"
                  />
                  {mode === "register" && password && (
                    <div className="mt-2">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-blue-100">Password Strength:</span>
                        <span className={`font-semibold ${calculatePasswordStrength(password).text}`}>
                          {calculatePasswordStrength(password).level}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
                        <div
                          className={`h-full transition-all duration-300 ${calculatePasswordStrength(password).color}`}
                          style={{
                            width: `${(([1, 2, 3, 4, 5].indexOf(Math.min(
                              (password.length >= 8 ? 1 : 0) +
                              (password.length >= 12 ? 1 : 0) +
                              (/[a-z]/.test(password) && /[A-Z]/.test(password) ? 1 : 0) +
                              (/\d/.test(password) ? 1 : 0) +
                              (/[!@#$%^&*]/.test(password) ? 1 : 0),
                              5
                            )) + 1) / 5) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <p className="mt-1 text-xs text-blue-200">
                        {calculatePasswordStrength(password).level === "Weak" && "Use 8+ characters with uppercase, lowercase, numbers, and symbols"}
                        {calculatePasswordStrength(password).level === "Fair" && "Add more character variety for better security"}
                        {calculatePasswordStrength(password).level === "Medium" && "Good! Add special characters for extra security"}
                        {calculatePasswordStrength(password).level === "Strong" && "Strong password! Well done"}
                        {calculatePasswordStrength(password).level === "Very Strong" && "Excellent password strength!"}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {mode === "register" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-blue-100">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-blue-200 focus:border-blue-300"
                  />
                </div>
              )}

              {mode === "forgot" && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-blue-100">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-blue-200 focus:border-blue-300"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-blue-100">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={resetConfirmPassword}
                      onChange={(e) => setResetConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-blue-200 focus:border-blue-300"
                    />
                  </div>
                </>
              )}

              {mode === "signin" && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    className="text-sm text-blue-200 underline-offset-2 hover:text-white"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {mode === "forgot" && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => switchMode("signin")}
                    className="text-sm text-blue-200 underline-offset-2 hover:text-white"
                  >
                    Back to sign in
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-2xl bg-white px-5 py-3 font-bold text-indigo-950 transition hover:scale-[1.02]"
              >
                {mode === "signin"
                  ? "Sign In"
                  : mode === "register"
                  ? "Register"
                  : "Reset Password"}
              </button>
            </form>

            <p className="mt-6 text-xs text-blue-100">
              This app is for awareness and academic use only. It is not a clinical diagnosis tool.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
