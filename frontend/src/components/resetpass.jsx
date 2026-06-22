import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  const reset = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/user/reset-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            newPassword,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        navigate("/login");
      } else {
        alert(data.message || "Reset Failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-purple-600/20 blur-3xl rounded-full bottom-10 right-10"></div>

      <div className="relative w-full max-w-md bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-3xl p-8 shadow-2xl">

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔐</div>

          <h1 className="text-3xl font-bold text-white">
            Reset Password
          </h1>

          <p className="text-slate-400 mt-2">
            Create a new secure password
          </p>
        </div>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />

          <button
            onClick={reset}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] transition-all duration-300 shadow-lg"
          >
            Reset Password
          </button>

        </div>

        <div className="mt-6 text-center">
          <span
            onClick={() => navigate("/login")}
            className="text-cyan-400 hover:text-cyan-300 cursor-pointer font-medium"
          >
            ← Back to Login
          </span>
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;