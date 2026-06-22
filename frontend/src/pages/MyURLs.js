import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyURLs() {
  const [urls, setUrls] = useState([]);
  const [filteredUrls, setFilteredUrls] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/url/my-urls", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUrls(data);
          setFilteredUrls(data);
        } else {
          setUrls([]);
          setFilteredUrls([]);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Server Error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = urls.filter(
      (u) =>
        u.shortId?.toLowerCase().includes(search.toLowerCase()) ||
        u.redirectURL?.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredUrls(filtered);
  }, [search, urls]);

  const copyLink = (shortId) => {
    navigator.clipboard.writeText(
      `http://localhost:8000/${shortId}`
    );

    alert("Link Copied 🚀");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-3xl">
        Loading URLs...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8">

      {/* Background */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/20 blur-3xl rounded-full"></div>

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-3xl p-8 mb-8">

          <h1 className="text-4xl font-bold mb-2">
            🔗 My URLs
          </h1>

          <p className="text-slate-400">
            Manage and monitor all your shortened links.
          </p>

          <input
            type="text"
            placeholder="Search URL or Short ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-6 w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl outline-none focus:border-blue-500"
          />

        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">Total URLs</p>
            <h2 className="text-4xl font-bold text-blue-400">
              {urls.length}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">Active Links</p>
            <h2 className="text-4xl font-bold text-green-400">
              {
                urls.filter((u) => u.isActive !== false)
                  .length
              }
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">Disabled Links</p>
            <h2 className="text-4xl font-bold text-red-400">
              {
                urls.filter((u) => u.isActive === false)
                  .length
              }
            </h2>
          </div>

        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="bg-slate-800 text-left">

                  <th className="p-4">Short ID</th>
                  <th className="p-4">Original URL</th>
                  <th className="p-4">Clicks</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>

                </tr>
              </thead>

              <tbody>

                {filteredUrls.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center p-10 text-slate-400"
                    >
                      No URLs Found
                    </td>
                  </tr>
                ) : (
                  filteredUrls.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-slate-800 hover:bg-slate-800 transition"
                    >
                      <td className="p-4 font-semibold text-blue-400">
                        {u.shortId}
                      </td>

                      <td className="p-4 max-w-sm truncate">
                        {u.redirectURL}
                      </td>

                      <td className="p-4">
                        {u.clicks || 0}
                      </td>

                      <td className="p-4">
                        {u.isActive !== false ? (
                          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400">
                            Disabled
                          </span>
                        )}
                      </td>

                      <td className="p-4">

                        <div className="flex flex-wrap gap-2">

                          <button
                            onClick={() =>
                              copyLink(u.shortId)
                            }
                            className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
                          >
                            Copy
                          </button>

                          <Link
                            to={`/analytics/${u.shortId}`}
                            className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700"
                          >
                            Analytics
                          </Link>

                          <Link
                            to={`/qr/${u.shortId}`}
                            className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700"
                          >
                            QR
                          </Link>

                        </div>

                      </td>
                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </div>
  );
}

export default MyURLs;