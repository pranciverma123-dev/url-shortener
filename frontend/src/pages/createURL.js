// import { useState } from "react";

// function CreateURL() {
//   const [url, setUrl] = useState("");
//   const [shortUrl, setShortUrl] = useState("");

//   const create = async () => {
//     const res = await fetch("http://localhost:8000/url", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({ url }),
//     });

//     const data = await res.json();
//     setShortUrl(data.shortId);
//   };

//   return (
//     <div className="container">
//       <h2>Create Short URL</h2>

//       <input
//         placeholder="Enter URL"
//         onChange={(e) => setUrl(e.target.value)}
//       />

//       <button onClick={create}>Generate</button>

//       {shortUrl && (
//         <div className="card">
//           Short URL: http://localhost:8000/url/{shortUrl}
//         </div>
//       )}
//     </div>
//   );
// }

// export default CreateURL;
import { useState } from "react";

function CreateURL() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const create = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create URL");
        return;
      }

      setShortUrl(data.shortId);
    } catch (err) {
      console.log(err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(
      `http://localhost:8000/url/${shortUrl}`
    );

    alert("Link Copied Successfully 🚀");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">

      {/* Background Effects */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/20 blur-3xl rounded-full"></div>

      <div className="relative w-full max-w-3xl bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-3xl p-8 shadow-2xl">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">
            🔗 Create Short URL
          </h1>

          <p className="text-slate-400 mt-3">
            Convert long URLs into short, shareable links instantly.
          </p>
        </div>

        {/* Input Section */}
        <div className="space-y-5">

          <input
            type="text"
            placeholder="Paste your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 px-5 py-4 rounded-xl outline-none focus:border-blue-500 transition"
          />

          <button
            onClick={create}
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50"
          >
            {loading ? "Generating..." : "🚀 Generate Short URL"}
          </button>

        </div>

        {/* Success Card */}
        {shortUrl && (
          <div className="mt-8 bg-green-500/10 border border-green-500/30 rounded-2xl p-6">

            <h3 className="text-green-400 font-semibold text-xl mb-4">
              ✅ URL Generated Successfully
            </h3>

            <div className="bg-slate-800 rounded-xl p-4 break-all text-blue-400">
              http://localhost:8000/url/{shortUrl}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-5">

              <button
                onClick={copyLink}
                className="py-3 rounded-xl bg-green-600 hover:bg-green-700 transition"
              >
                📋 Copy Link
              </button>

              <a
                href={`http://localhost:8000/url/${shortUrl}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
              >
                🔗 Open Link
              </a>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default CreateURL;