import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Logout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:8000/user/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (res.ok) {
        navigate("/");
      } else {
        alert("Logout Failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">

      {/* Background Effects */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-red-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/20 blur-3xl rounded-full"></div>

      <div className="relative w-full max-w-md bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-3xl p-8 shadow-2xl">

        <div className="text-center">

          <div className="text-6xl mb-4">
            🚪
          </div>

          <h1 className="text-4xl font-bold mb-3">
            Logout
          </h1>

          <p className="text-slate-400 mb-8">
            Are you sure you want to logout from your account?
          </p>

          <div className="space-y-4">

            <button
              onClick={logout}
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-pink-600 hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50"
            >
              {loading ? "Logging Out..." : "🚪 Logout"}
            </button>

            <button
              onClick={() => navigate("/dash")}
              className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition border border-slate-700"
            >
              ← Back to Dashboard
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Logout;