// import { useState } from "react";

// function UpdateURL() {
//   const [id, setId] = useState("");
//   const [redirectURL, setRedirectURL] = useState("");
//   const [loading, setLoading] = useState(false);

//   const updateURL = async () => {
//     try {
//       if (!id || !redirectURL) {
//         alert("ID aur URL dono required hai");
//         return;
//       }

//       setLoading(true);

//       const res = await fetch(`http://localhost:8000/url/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({ redirectURL }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Server error");
//       }

//       alert("URL Updated Successfully");
//     } catch (err) {
//       console.error(err);
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="card">
//       <h2>Update URL</h2>

//       <input
//         placeholder="Enter URL ID (shortId)"
//         value={id}
//         onChange={(e) => setId(e.target.value)}
//       />

//       <input
//         placeholder="Enter new Redirect URL"
//         value={redirectURL}
//         onChange={(e) => setRedirectURL(e.target.value)}
//       />

//       <button onClick={updateURL} disabled={loading}>
//         {loading ? "Updating..." : "Update URL"}
//       </button>
//     </div>
//   );
// }

// export default UpdateURL;

import { useState } from "react";

function UpdateURL() {
  const [id, setId] = useState("");
  const [redirectURL, setRedirectURL] = useState("");
  const [loading, setLoading] = useState(false);

  const updateURL = async () => {
    try {
      if (!id || !redirectURL) {
        alert("Short ID aur URL dono required hain");
        return;
      }

      setLoading(true);

      const res = await fetch(`https://url-shortener-kl3i.onrender.com/url/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ redirectURL }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Server Error");
      }

      alert("URL Updated Successfully");

      setId("");
      setRedirectURL("");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Glow */}
      <div className="absolute w-96 h-96 bg-blue-500/20 blur-3xl rounded-full -top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-purple-500/20 blur-3xl rounded-full -bottom-20 -right-20"></div>

      <div className="relative w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">

        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Update URL
        </h2>

        <p className="text-center text-slate-400 mb-6">
          Change destination of your short link
        </p>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Enter Short ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition"
          />

          <input
            type="text"
            placeholder="Enter New Redirect URL"
            value={redirectURL}
            onChange={(e) => setRedirectURL(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition"
          />

          <button
            onClick={updateURL}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update URL"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default UpdateURL;