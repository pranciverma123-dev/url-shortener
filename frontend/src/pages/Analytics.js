// import { useState } from "react";

// function Analytics() {
//   const [shortId, setShortId] = useState("");
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const getAnalytics = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch(
//         `http://localhost:8000/url/analytics/${shortId}`,
//         {
//           credentials: "include",
//         }
//       );

//       const result = await res.json();

//       if (!res.ok) {
//         alert(result.message);
//         return;
//       }

//       setData(result);
//     } catch (err) {
//       console.log(err);
//       alert("Failed to fetch analytics");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <div className="card">
//         <h2>📊 URL Analytics</h2>

//         <input
//           type="text"
//           placeholder="Enter Short ID"
//           value={shortId}
//           onChange={(e) => setShortId(e.target.value)}
//         />

//         <button onClick={getAnalytics}>
//           {loading ? "Loading..." : "Get Analytics"}
//         </button>

//         {data && (
//           <>
//             <div className="stats-grid">
//               <div className="stat-box">
//                 <h3>{data.totalClicks}</h3>
//                 <p>Total Clicks</p>
//               </div>

//               <div className="stat-box">
//                 <h3>{Object.keys(data.browserStats || {})[0] || "-"}</h3>
//                 <p>Browser</p>
//               </div>

//               <div className="stat-box">
//                 <h3>{Object.keys(data.osStats || {})[0] || "-"}</h3>
//                 <p>Operating System</p>
//               </div>

//               <div className="stat-box">
//                 <h3>{Object.keys(data.countryStats || {})[0] || "-"}</h3>
//                 <p>Country</p>
//               </div>
//             </div>

//             <div className="card">
//               <h3>🌐 Browser Stats</h3>
//               <pre>{JSON.stringify(data.browserStats, null, 2)}</pre>
//             </div>

//             <div className="card">
//               <h3>💻 Device Stats</h3>
//               <pre>{JSON.stringify(data.deviceStats, null, 2)}</pre>
//             </div>

//             <div className="card">
//               <h3>🖥️ OS Stats</h3>
//               <pre>{JSON.stringify(data.osStats, null, 2)}</pre>
//             </div>

//             <div className="card">
//               <h3>🌍 Country Stats</h3>
//               <pre>{JSON.stringify(data.countryStats, null, 2)}</pre>
//             </div>

//             <div className="card">
//               <h3>🏙️ City Stats</h3>
//               <pre>{JSON.stringify(data.cityStats, null, 2)}</pre>
//             </div>

//             <div className="card">
//               <h3>📜 Visit History</h3>

//               {data.analytics?.map((visit, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     borderBottom: "1px solid #ddd",
//                     padding: "10px",
//                     marginBottom: "10px",
//                   }}
//                 >
//                   <p><b>Time:</b> {new Date(visit.timestamp).toLocaleString()}</p>
//                   <p><b>Browser:</b> {visit.browser}</p>
//                   <p><b>OS:</b> {visit.os}</p>
//                   <p><b>Device:</b> {visit.device}</p>
//                   <p><b>Country:</b> {visit.country}</p>
//                   <p><b>City:</b> {visit.city}</p>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Analytics;
import { useState } from "react";

function Analytics() {
  const [shortId, setShortId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAnalytics = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8000/url/analytics/${shortId}`,
        {
          credentials: "include",
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }

      setData(result);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8">
      
      {/* Background Blur */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/20 blur-3xl rounded-full"></div>

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-3xl p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">
            📊 URL Analytics Dashboard
          </h1>

          <p className="text-slate-400">
            Track clicks, devices, browsers and user locations.
          </p>

          <div className="flex flex-col md:flex-row gap-4 mt-6">

            <input
              type="text"
              placeholder="Enter Short ID"
              value={shortId}
              onChange={(e) => setShortId(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl outline-none focus:border-blue-500"
            />

            <button
              onClick={getAnalytics}
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold hover:scale-105 transition-all duration-300"
            >
              {loading ? "Loading..." : "Get Analytics"}
            </button>

          </div>
        </div>

        {data && (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-slate-400">Total Clicks</p>
                <h2 className="text-4xl font-bold text-blue-400 mt-2">
                  {data.totalClicks}
                </h2>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-slate-400">Top Browser</p>
                <h2 className="text-xl font-semibold mt-2">
                  {Object.keys(data.browserStats || {})[0] || "-"}
                </h2>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-slate-400">Top OS</p>
                <h2 className="text-xl font-semibold mt-2">
                  {Object.keys(data.osStats || {})[0] || "-"}
                </h2>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-slate-400">Top Country</p>
                <h2 className="text-xl font-semibold mt-2">
                  {Object.keys(data.countryStats || {})[0] || "-"}
                </h2>
              </div>

            </div>

            {/* Analytics Cards */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">

              {/* Browser Stats */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-2xl font-semibold mb-4">
                  🌐 Browser Stats
                </h3>

                {Object.entries(data.browserStats || {}).map(
                  ([browser, count]) => (
                    <div
                      key={browser}
                      className="flex justify-between py-3 border-b border-slate-800"
                    >
                      <span>{browser}</span>
                      <span>{count}</span>
                    </div>
                  )
                )}
              </div>

              {/* Device Stats */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-2xl font-semibold mb-4">
                  💻 Device Stats
                </h3>

                {Object.entries(data.deviceStats || {}).map(
                  ([device, count]) => (
                    <div
                      key={device}
                      className="flex justify-between py-3 border-b border-slate-800"
                    >
                      <span>{device}</span>
                      <span>{count}</span>
                    </div>
                  )
                )}
              </div>

              {/* OS Stats */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-2xl font-semibold mb-4">
                  🖥️ OS Statistics
                </h3>

                {Object.entries(data.osStats || {}).map(
                  ([os, count]) => (
                    <div
                      key={os}
                      className="flex justify-between py-3 border-b border-slate-800"
                    >
                      <span>{os}</span>
                      <span>{count}</span>
                    </div>
                  )
                )}
              </div>

              {/* Country Stats */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-2xl font-semibold mb-4">
                  🌍 Country Statistics
                </h3>

                {Object.entries(data.countryStats || {}).map(
                  ([country, count]) => (
                    <div
                      key={country}
                      className="flex justify-between py-3 border-b border-slate-800"
                    >
                      <span>{country}</span>
                      <span>{count}</span>
                    </div>
                  )
                )}
              </div>

            </div>

            {/* City Stats */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
              <h3 className="text-2xl font-semibold mb-4">
                🏙️ City Statistics
              </h3>

              {Object.entries(data.cityStats || {}).map(
                ([city, count]) => (
                  <div
                    key={city}
                    className="flex justify-between py-3 border-b border-slate-800"
                  >
                    <span>{city}</span>
                    <span>{count}</span>
                  </div>
                )
              )}
            </div>

            {/* Visit History */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <h3 className="text-2xl font-semibold mb-6">
                📜 Visit History
              </h3>

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>
                    <tr className="border-b border-slate-700 text-left">
                      <th className="p-3">Time</th>
                      <th className="p-3">Browser</th>
                      <th className="p-3">OS</th>
                      <th className="p-3">Device</th>
                      <th className="p-3">Country</th>
                      <th className="p-3">City</th>
                    </tr>
                  </thead>

                  <tbody>

                    {data.analytics?.map((visit, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-800 hover:bg-slate-800 transition"
                      >
                        <td className="p-3">
                          {new Date(
                            visit.timestamp
                          ).toLocaleString()}
                        </td>

                        <td className="p-3">{visit.browser}</td>

                        <td className="p-3">{visit.os}</td>

                        <td className="p-3">{visit.device}</td>

                        <td className="p-3">{visit.country}</td>

                        <td className="p-3">{visit.city}</td>
                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;