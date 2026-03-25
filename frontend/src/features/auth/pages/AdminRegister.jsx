import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth.js";

export default function AdminRegister() {

  const { handleRegisterAdmin } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    secretKey: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const data = await handleRegisterAdmin(form);

if (!data || data.error) {
  toast.error(data?.message || "Admin registration failed");
  return;
}

toast.success("Admin registered successfully 👑");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);

    } catch (err) {

      toast.error("Server error");

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#0e1324] to-[#0b0f19] text-white px-4">

      <div className="w-full max-w-md bg-[#0f172a]/80 backdrop-blur-xl border border-red-900/40 rounded-2xl shadow-2xl p-8">

        <h2 className="text-3xl font-bold text-red-400 text-center mb-2">
          Admin Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {["name", "email", "phoneNumber", "password", "secretKey"].map((field) => (
            <input
              key={field}
              type={field === "password" ? "password" : "text"}
              name={field}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={form[field]}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#020617] border border-red-900/40 focus:ring-2 focus:ring-red-500 outline-none"
            />
          ))}

          <button
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 font-semibold disabled:opacity-60"
          >
            {loading ? "Creating Admin..." : "Register Admin"}
          </button>

        </form>

        <p className="text-sm text-gray-400 text-center mt-5">
          Already admin?{" "}
          <a href="/login" className="text-red-400 hover:underline">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}