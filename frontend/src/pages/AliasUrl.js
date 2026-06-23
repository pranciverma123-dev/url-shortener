import { useState } from "react";

function AliasUrl() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleCreate = async () => {
    try {
      setLoading(true);
      setError("");
      setResult("");

      const res = await fetch(
        "https://url-shortener-kl3i.onrender.com/url/custom",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ url, alias }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setResult(data.shortId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(
      `https://url-shortener-kl3i.onrender.com/${result}`
    );
    alert("Link Copied!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">

      <div className="absolute w-96 h-96 bg-blue-600/20 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-purple-600/20 blur-3xl rounded-full bottom-10 right-10"></div>

      <div className="relative w-full max-w-2xl bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-3xl p-8 shadow-2xl">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">
            Create Custom Alias
          </h1>

          <p className="text-slate-400 mt-3">
            Create memorable and branded short URLs
          </p>
        </div>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Enter Long URL (https://...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 px-4 py-4 rounded-xl outline-none focus:border-blue-500 transition"
          />

          <input
            type="text"
            placeholder="Custom Alias (e.g. pranci-link)"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 px-4 py-4 rounded-xl outline-none focus:border-purple-500 transition"
          />

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Custom URL"}
          </button>

        </div>

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-2xl p-5">

            <h3 className="text-green-400 font-semibold mb-3">
              URL Created Successfully
            </h3>

            <a
              href={`https://url-shortener-kl3i.onrender.com/${result}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 break-all hover:underline"
            >
              https://url-shortener-kl3i.onrender.com/{result}
            </a>

            <button
              onClick={copyLink}
              className="mt-4 w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 transition"
            >
              Copy Link
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

export default AliasUrl;
