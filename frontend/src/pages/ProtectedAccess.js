import { useState } from "react";

function ProtectedAccess() {
  const [shortId, setShortId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const accessURL = async () => {
    try {
      if (!shortId || !password) {
        alert("ShortId and Password required");
        return;
      }

      setLoading(true);

      const res = await fetch(
        `https://url-shortener-kl3i.onrender.com/url/access/${shortId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "URL not found");
      }

      if (data.redirectURL) {
        window.open(data.redirectURL, "_blank");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">

      {/* Background Blur */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full"></div>

      <div className="relative w-full max-w-xl bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-3xl p-8 shadow-2xl">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="text-6xl mb-4">
            
          </div>

          <h1 className="text-4xl font-bold">
            Protected URL Access
          </h1>

          <p className="text-slate-400 mt-3">
            Access password-protected short links securely.
          </p>

        </div>

        {/* Form */}
        <div className="space-y-5">

          <input
            type="text"
            placeholder="Enter Short ID"
            value={shortId}
            onChange={(e) => setShortId(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 px-5 py-4 rounded-xl outline-none focus:border-cyan-500 transition"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 px-5 py-4 rounded-xl outline-none focus:border-cyan-500 transition"
          />

          <button
            onClick={accessURL}
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50"
          >
            {loading
              ? "Opening Protected URL..."
              : " Open Protected URL"}
          </button>

        </div>

        {/* Info Card */}
        <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">

          <h3 className="font-semibold text-cyan-400 mb-2">
            Security Feature
          </h3>

          <p className="text-slate-300 text-sm">
            Only users with the correct password can access
            this shortened URL. All access attempts can be
            tracked through analytics.
          </p>

        </div>

      </div>
    </div>
  );
}

export default ProtectedAccess;