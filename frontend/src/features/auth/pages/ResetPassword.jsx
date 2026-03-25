import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ResetPassword() {

  const { token } = useParams();
  const { handleResetPassword } = useAuth();

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {

      const data = await handleResetPassword({
        token,
        ...form
      });

      if (!data || data.error) {
        toast.error(data?.message || "Reset failed");
        return;
      }

      toast.success("Password reset successful 🔐");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

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
          Reset Password
        </h2>

        <p className="text-gray-400 text-center mb-6">
          Enter your new password
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-[#020617] border border-blue-900/40 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-[#020617] border border-blue-900/40 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

      </div>

    </div>
  );
}