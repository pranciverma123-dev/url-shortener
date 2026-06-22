// import { useState } from "react";

// function DisableURL() {
//   const [id, setId] = useState("");

//   const disableURL = async () => {
//     const res = await fetch(
//       `http://localhost:8000/url/disable/${id}`,
//       {
//         method: "PATCH",
//         credentials: "include",
//       }
//     );

//     const data = await res.json();

//     if (res.ok) {
//       alert("Link Disabled");
//     } else {
//       alert(data.message);
//     }
//   };

//   return (
//     <div className="card">
//       <h2>Disable URL</h2>

//       <input
//         placeholder="URL ID"
//         onChange={(e) => setId(e.target.value)}
//       />

//       <button onClick={disableURL}>
//         Disable URL
//       </button>
//     </div>
//   );
// }

// export default DisableURL;
import { useState } from "react";

function DisableURL() {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);

  const disableURL = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8000/url/disable/${id}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("✅ Link Disabled Successfully");
        setId("");
      } else {
        alert(data.message);
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
      <div className="absolute top-10 left-10 w-96 h-96 bg-yellow-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/20 blur-3xl rounded-full"></div>

      <div className="relative w-full max-w-xl bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-3xl p-8 shadow-2xl">

        <div className="text-center mb-8">

          <div className="text-6xl mb-3">
            ⛔
          </div>

          <h1 className="text-4xl font-bold">
            Disable URL
          </h1>

          <p className="text-slate-400 mt-3">
            Temporarily disable a shortened URL without deleting it.
          </p>

        </div>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Enter URL ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 px-5 py-4 rounded-xl outline-none focus:border-yellow-500 transition"
          />

          <button
            onClick={disableURL}
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-yellow-500 to-orange-600 hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50"
          >
            {loading ? "Disabling..." : "⛔ Disable URL"}
          </button>

        </div>

        <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-300 text-sm">
            ⚠️ Disabled URLs won't redirect users until re-enabled.
          </p>
        </div>

      </div>
    </div>
  );
}

export default DisableURL;