// import { useState } from "react";

// export default function QRCodeSection() {
//   const [shortId, setShortId] = useState("");
//   const [qr, setQr] = useState("");

//   const generateQR = async () => {
//     const res = await fetch(
//       `http://localhost:8000/url/qr/${shortId}`,
//       {
//         credentials: "include",
//       }
//     );

//     const data = await res.json();

//     if (res.ok) {
//       setQr(data.qrCode);
//     } else {
//       alert(data.message);
//     }
//   };

//   return (
//     <div className="card">
//       <h2>Generate QR Code</h2>

//       <input
//         placeholder="Enter Short ID"
//         onChange={(e) => setShortId(e.target.value)}
//       />

//       <button onClick={generateQR}>
//         Generate QR
//       </button>

//       {qr && (
//         <img
//           src={qr}
//           alt="QR Code"
//           width="200"
//         />
//       )}
//     </div>
//   );
// }
import { useState } from "react";

export default function QRCodeSection() {
  const [shortId, setShortId] = useState("");
  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(false);

  const generateQR = async () => {
    try {
      if (!shortId) {
        alert("Enter Short ID");
        return;
      }

      setLoading(true);

      const res = await fetch(
        `http://localhost:8000/url/qr/${shortId}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setQr(data.qrCode);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to generate QR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-blue-500/20 blur-3xl rounded-full -top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-purple-500/20 blur-3xl rounded-full -bottom-20 -right-20"></div>

      <div className="relative w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">

        <h2 className="text-3xl font-bold text-white text-center mb-2">
          📱 Generate QR Code
        </h2>

        <p className="text-slate-400 text-center mb-6">
          Create QR for your shortened URL
        </p>

        <input
          type="text"
          placeholder="Enter Short ID"
          value={shortId}
          onChange={(e) => setShortId(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition"
        />

        <button
          onClick={generateQR}
          disabled={loading}
          className="w-full mt-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate QR"}
        </button>

        {qr && (
          <div className="mt-8 flex flex-col items-center">
            <div className="bg-white p-4 rounded-2xl shadow-xl">
              <img
                src={qr}
                alt="QR Code"
                className="w-56 h-56"
              />
            </div>

            <p className="mt-4 text-green-400 font-medium">
              ✅ QR Generated Successfully
            </p>
          </div>
        )}

      </div>
    </div>
  );
}