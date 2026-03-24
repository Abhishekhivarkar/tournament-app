import { useState } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      toast.success("Login successful 🎮");

      setTimeout(() => {
        data.role === "admin"
          ? (window.location.href = "/admin/dashboard")
          : (window.location.href = "/dashboard");
      }, 800);

    } catch {
      toast.error("Server error. Try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0f19] via-[#0e1324] to-[#020617] text-white">
      <div className="w-full max-w-md bg-[#0f172a]/80 backdrop-blur-xl border border-blue-900/40 rounded-2xl shadow-2xl p-8">

        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-400 tracking-wide">
            BattleNex
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Competitive Gaming Platform
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              placeholder="Enter Your Email"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#020617] border border-blue-900/40 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#020617] border border-blue-900/40 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <a href="/forgot-password" className="text-sm text-blue-400 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold shadow-lg disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Section */}
        <div className="mt-6 text-center text-sm text-gray-400 space-y-2">
          <p>
            New Player?{" "}
            <a href="/register/user" className="text-blue-400 hover:underline">
              Register as User
            </a>
          </p>

          <p>
            Tournament Admin?{" "}
            <a href="/register/admin" className="text-cyan-400 hover:underline">
              Register as Admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}