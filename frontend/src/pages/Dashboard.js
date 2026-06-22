// import { Link } from "react-router-dom";

// function Dashboard() {
//   return (
//     <div className="container">
//       <h1>URL Shortener Dashboard 🚀</h1>

//       <div className="card">
//         <Link to="/create">➕ Create URL</Link>
//       </div>
      
//         <div className="card">
//         <Link to="/update">update</Link>
//       </div>
//       <div className="card">
//         <Link to="/delete">delete url</Link>
//       </div>
//       <div className="card">
//         <Link to="/disable">disable url</Link>
//       </div>
//       <div className="card">
//         <Link to="/protected">ProtectedAccess</Link>
//       </div>
//       <div className="card">
//         <Link to="/logout">Logout</Link>
//       </div>
//         <div className="card">
//         <Link to="/qr/:shortId">Short Url</Link>
//       </div>
//       <div className="card">
//         <Link to="/alias">create custom Alias</Link>
//       </div>
//       <div className="card">
//         <Link to="/analytics/:shortId">Analytics</Link>
//       </div>

//       <div className="card">
//         <Link to="/myurls">📋 My URLs</Link>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
// import { Link } from "react-router-dom";

// function Dashboard() {
//   const menuItems = [
//     { title: "Create URL", icon: "➕", path: "/create" },
//     { title: "Update URL", icon: "✏️", path: "/update" },
//     { title: "Delete URL", icon: "🗑️", path: "/delete" },
//     { title: "Disable URL", icon: "⛔", path: "/disable" },
//     { title: "Protected Access", icon: "🔒", path: "/protected" },
//     { title: "QR Code", icon: "📱", path: "/qr/:shortId" },
//     { title: "Custom Alias", icon: "✨", path: "/alias" },
//     { title: "Analytics", icon: "📊", path: "/analytics/:shortId" },
//     { title: "My URLs", icon: "🔗", path: "/myurls" },
//     { title: "Logout", icon: "🚪", path: "/logout" },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">
//       {/* Header */}
//       <div className="border-b border-slate-800">
//         <div className="max-w-7xl mx-auto px-8 py-6">
//           <h1 className="text-4xl font-bold">
//             URL Shortener Dashboard 🚀
//           </h1>
//           <p className="text-slate-400 mt-2">
//             Manage your links, analytics, QR codes and custom aliases.
//           </p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-8 py-8">
        
//         {/* Stats Cards */}
//         <div className="grid md:grid-cols-4 gap-6 mb-10">
//           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
//             <h3 className="text-slate-400">Total Links</h3>
//             <p className="text-3xl font-bold mt-2">24</p>
//           </div>

//           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
//             <h3 className="text-slate-400">Total Clicks</h3>
//             <p className="text-3xl font-bold mt-2 text-blue-400">1.2K</p>
//           </div>

//           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
//             <h3 className="text-slate-400">Active URLs</h3>
//             <p className="text-3xl font-bold mt-2 text-green-400">18</p>
//           </div>

//           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
//             <h3 className="text-slate-400">QR Generated</h3>
//             <p className="text-3xl font-bold mt-2 text-purple-400">10</p>
//           </div>
//         </div>

//         {/* Feature Cards */}
//         <h2 className="text-2xl font-semibold mb-5">
//           Quick Actions
//         </h2>

//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {menuItems.map((item, index) => (
//             <Link
//               key={index}
//               to={item.path}
//               className="
//                 group
//                 bg-slate-900
//                 border border-slate-800
//                 rounded-2xl
//                 p-6
//                 hover:border-blue-500
//                 hover:-translate-y-2
//                 transition-all
//                 duration-300
//                 shadow-lg
//               "
//             >
//               <div className="text-4xl mb-4">
//                 {item.icon}
//               </div>

//               <h3 className="text-xl font-semibold group-hover:text-blue-400">
//                 {item.title}
//               </h3>

//               <p className="text-slate-400 mt-2">
//                 Open {item.title} section
//               </p>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import { Link } from "react-router-dom";

function Dashboard() {
  const menuItems = [
    { title: "Create URL", icon: "", path: "/create" },
    { title: "Update URL", icon: "", path: "/update" },
    { title: "Delete URL", icon: "", path: "/delete" },
    { title: "Disable URL", icon: "", path: "/disable" },
    { title: "Protected Access", icon: "", path: "/protected" },
    { title: "QR Code", icon: "", path: "/qr/test" },
    { title: "Custom Alias", icon: "", path: "/alias" },
    { title: "Analytics", icon: "", path: "/analytics/test" },
    { title: "My URLs", icon: "", path: "/myurls" },
    { title: "Logout", icon: "", path: "/logout" },
  ];

  const stats = [
    {
      title: "Total URLs",
      value: "24",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Clicks",
      value: "1.2K",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Active URLs",
      value: "18",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "QR Generated",
      value: "10",
      color: "from-orange-500 to-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 mb-10">

          <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h1 className="text-5xl font-bold mb-4">
              URL Shortener Dashboard
            </h1>

            <p className="text-slate-300 text-lg">
              Manage your links, analytics, QR codes and custom aliases.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/create"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-semibold"
              >
                Create URL
              </Link>

              <Link
                to="/myurls"
                className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition"
              >
                My URLs
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((card, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:scale-105 transition-all duration-300"
            >
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-r ${card.color}`}></div>

              <div className="relative z-10">
                <p className="text-slate-400">{card.title}</p>
                <h2 className="text-4xl font-bold mt-2">{card.value}</h2>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-3xl font-bold mb-6">Quick Actions</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                bg-white/5
                backdrop-blur-xl
                border
                border-white/10
                p-6
                hover:scale-105
                hover:border-blue-500/40
                transition-all
                duration-300
              "
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transition"></div>

              <div className="relative z-10">
                <h3 className="text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="text-slate-400 mt-2">
                  Open {item.title} section
                </p>
              </div>
            </Link>
          ))}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;