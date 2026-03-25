export default function CheckEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0f19] via-[#0e1324] to-[#020617] text-white px-4">

      <div className="w-full max-w-md bg-[#0f172a]/80 backdrop-blur-xl border border-blue-900/40 rounded-2xl shadow-2xl p-8 text-center">

        <h2 className="text-3xl font-bold text-blue-400 mb-4">
          Check Your Email
        </h2>

        <p className="text-gray-300 leading-relaxed">
          Please check your mailbox.  
          We have sent you a password reset link to your email address.
        </p>

        <p className="text-gray-400 text-sm mt-4">
          If you don’t see the email, please check your spam folder.
        </p>

        <a
          href="/login"
          className="inline-block mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold"
        >
          Back to Login
        </a>

      </div>

    </div>
  );
}