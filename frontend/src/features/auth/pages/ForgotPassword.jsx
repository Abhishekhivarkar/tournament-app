import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
export default function ForgotPassword() {

  const { handleForgotPassword } = useAuth();
const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {

      const data = await handleForgotPassword({ email });

if (!data || data.error) {
  toast.error(data?.message || "Failed to send reset link");
  return;
}

navigate("/check-email");

      toast.success("Reset link sent to your email 📧");

    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0f19] via-[#0e1324] to-[#020617] text-white px-4">

      <div className="w-full max-w-md bg-[#0f172a]/80 backdrop-blur-xl border border-blue-900/40 rounded-2xl shadow-2xl p-8">

        <h2 className="text-3xl font-bold text-blue-400 text-center mb-2">
          Forgot Password
        </h2>

        <p className="text-gray-400 text-center mb-6">
          Enter your email to receive reset link
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-[#020617] border border-blue-900/40 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        <p className="text-sm text-gray-400 text-center mt-5">
          Remember password?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>

      </div>

    </div>
  );
}