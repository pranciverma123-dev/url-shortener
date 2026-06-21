
const URL = require("../model/url");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const QRCode = require("qrcode");
const validator = require("validator");
const redisClient = require("../config/redis");
const UAParser = require("ua-parser-js");
const geoip = require("geoip-lite");


// ================= IP HELPER =================
const getClientIP = (req) => {
  let ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    req.ip;

  if (ip && ip.includes(",")) {
    ip = ip.split(",")[0];
  }

  ip = ip.replace("::ffff:", "");

  // localhost fallback (IMPORTANT for testing)
  // if (ip === "::1" || ip === "127.0.0.1") {
  //   return "8.8.8.8"; // fake IP for geo testing
  // }
if (ip === "::1" || ip === "127.0.0.1") {
  return "49.36.0.1";
}
  return ip;
};


// ================= Generate Short URL =================
async function handleGenerateShortURL(req, res) {
  try {
    const { url, expiresAt, password, tags } = req.body;

    if (!url || !validator.isURL(url)) {
      return res.status(400).json({ message: "Valid URL is required" });
    }

    const shortId = nanoid(8);

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newURL = await URL.create({
      shortId,
      redirectURL: url,
      createdBy: req.user.uid,
      expiresAt,
      password: hashedPassword,
      tags,
    });

    return res.status(201).json({
      shortId: newURL.shortId,
      expiresAt: newURL.expiresAt,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


// ================= Redirect URL =================
async function handleRedirectURL(req, res) {
  try {
    const { shortId } = req.params;

    const cachedURL = await redisClient.get(shortId);

    let entry = await URL.findOne({ shortId });

    if (!entry) {
      return res.status(404).json({ message: "URL Not Found" });
    }

    if (!entry.isActive) {
      return res.status(403).json({ message: "Link Disabled" });
    }

    if (entry.expiresAt && new Date() > entry.expiresAt) {
      return res.status(410).json({ message: "Link Expired" });
    }

    // Redis cache set
    if (!cachedURL) {
      const ttl = entry.expiresAt
        ? Math.floor((new Date(entry.expiresAt) - new Date()) / 1000)
        : 3600;

      await redisClient.set(shortId, entry.redirectURL, { EX: ttl });
    }

    entry.clicks += 1;

    // UA parsing
    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();

    // IP + GEO
    const ip = getClientIP(req);
    const geo = geoip.lookup(ip) || {};

    entry.visitHistory.push({
      timestamp: new Date(),
      ip,

      browser: result.browser?.name || "Chrome",
      os: result.os?.name || "Unknown OS",
      device: result.device?.type || "Desktop",

      country: geo.country || "IN",
      city: geo.city || "Lucknow",
    });

    // limit history
    if (entry.visitHistory.length > 1000) {
      entry.visitHistory.shift();
    }

    await entry.save();

    return res.redirect(entry.redirectURL);

  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
}


// ================= Analytics =================
async function handleGetAnalytics(req, res) {
  try {
    const { shortId } = req.params;

    const result = await URL.findOne({
      shortId,
      createdBy: req.user.uid,
    });

    if (!result) {
      return res.status(404).json({ message: "URL Not Found" });
    }

    const browserStats = {};
    const deviceStats = {};
    const osStats = {};
    const countryStats = {};
    const cityStats = {};

    result.visitHistory.forEach((visit) => {
      const browser = visit.browser || "Unknown";
      const device = visit.device || "Unknown";
      const os = visit.os || "Unknown";
      const country = visit.country || "Unknown";
      const city = visit.city || "Unknown";

      browserStats[browser] = (browserStats[browser] || 0) + 1;
      deviceStats[device] = (deviceStats[device] || 0) + 1;
      osStats[os] = (osStats[os] || 0) + 1;
      countryStats[country] = (countryStats[country] || 0) + 1;
      cityStats[city] = (cityStats[city] || 0) + 1;
    });

    return res.json({
      totalClicks: result.clicks || result.visitHistory.length,
      browserStats,
      deviceStats,
      osStats,
      countryStats,
      cityStats,
      analytics: result.visitHistory,
    });

  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
}


// ================= My URLs =================
async function handleGetMyURLs(req, res) {
  try {
    const urls = await URL.find({ createdBy: req.user.uid });
    return res.json(urls);
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
}
async function handleUpdateURL(req, res) {
  try {
    const { id } = req.params; // 🔥 yaha ab shortId aayega
    const { redirectURL } = req.body;

    if (!validator.isURL(redirectURL)) {
      return res.status(400).json({ message: "Invalid URL" });
    }

    const updated = await URL.findOneAndUpdate(
      { shortId: id, createdBy: req.user.uid },
      { redirectURL },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "URL not found" });
    }

    await redisClient.del(id);

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
}
async function handleDisableURL(req, res) {
  try {
    const { id } = req.params;

    const url = await URL.findOneAndUpdate(
      { shortId: id, createdBy: req.user.uid },
      { isActive: false },
      { new: true }
    );

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    await redisClient.del(id);

    return res.json({
      message: "Link Disabled",
      url,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
}
// async function handleUpdateURL(req, res) {
//   try {
//     const { id } = req.params; // 👉 this is shortId
//     const { redirectURL } = req.body;

//     if (!redirectURL || !validator.isURL(redirectURL)) {
//       return res.status(400).json({ message: "Invalid URL" });
//     }

//     const updated = await URL.findOneAndUpdate(
//       { shortId: id, createdBy: req.user.uid },
//       { redirectURL },
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ message: "URL not found" });
//     }

//     if (redisClient) {
//       await redisClient.del(updated.shortId);
//     }

//     return res.json({
//       message: "Updated successfully",
//       data: updated,
//     });

//   } catch (err) {
//     console.error("UPDATE ERROR:", err); // 👈 must
//     return res.status(500).json({ message: "Server Error", error: err.message });
//   }
// }

// ================= Update URL =================
// async function handleUpdateURL(req, res) {
//   try {
//     const { id } = req.params;
//     const { redirectURL } = req.body;

//     if (!validator.isURL(redirectURL)) {
//       return res.status(400).json({ message: "Invalid URL" });
//     }

//     const updated = await URL.findOneAndUpdate(
//       { _id: id, createdBy: req.user.uid },
//       { redirectURL },
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ message: "URL not found" });
//     }

//     await redisClient.del(updated.shortId);

//     return res.json(updated);

//   } catch (err) {
//     return res.status(500).json({ message: "Server Error" });
//   }
// }
async function handleDeleteURL(req, res) {
  try {
    const { id } = req.params;

    const deleted = await URL.findOneAndDelete({
      shortId: id,
      createdBy: req.user.uid,
    });

    if (!deleted) {
      return res.status(404).json({ message: "URL not found" });
    }

    await redisClient.del(id);

    return res.json({ message: "URL deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
}

// ================= Delete URL =================
// async function handleDeleteURL(req, res) {
//   try {
//     const deleted = await URL.findOneAndDelete({
//       _id: req.params.id,
//       createdBy: req.user.uid,
//     });

//     if (!deleted) {
//       return res.status(404).json({ message: "URL not found" });
//     }

//     await redisClient.del(deleted.shortId);

//     return res.json({ message: "URL Deleted Successfully" });

//   } catch (err) {
//     return res.status(500).json({ message: "Server Error" });
//   }
// }


// ================= Custom URL =================
async function handleCreateCustomURL(req, res) {
  try {
    const { url, alias } = req.body;

    if (!url || !alias) {
      return res.status(400).json({ message: "URL and Alias required" });
    }

    if (!validator.isURL(url)) {
      return res.status(400).json({ message: "Invalid URL" });
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(alias)) {
      return res.status(400).json({ message: "Invalid alias format" });
    }

    const exist = await URL.findOne({ shortId: alias });

    if (exist) {
      return res.status(400).json({ message: "Alias already exists" });
    }

    const newURL = await URL.create({
      shortId: alias,
      redirectURL: url,
      createdBy: req.user.uid,
    });

    return res.status(201).json(newURL);

  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
}


// ================= QR CODE =================
async function handleGenerateQRCode(req, res) {
  try {
    const { shortId } = req.params;

    const entry = await URL.findOne({
      shortId,
      createdBy: req.user.uid,
    });

    if (!entry) {
      return res.status(404).json({ message: "URL Not Found" });
    }

    const baseURL = process.env.BASE_URL || "http://localhost:8000";
    const shortURL = `${baseURL}/url/${shortId}`;

    const qrCode = await QRCode.toDataURL(shortURL);

    return res.json({
      shortURL,
      qrCode,
    });

  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
}


// ================= PROTECTED ACCESS =================
async function handleAccessProtectedURL(req, res) {
  try {
    const { shortId } = req.params;
    const { password } = req.body;

    const entry = await URL.findOne({ shortId });

    if (!entry) {
      return res.status(404).json({ message: "URL Not Found" });
    }

    if (!entry.isActive) {
      return res.status(403).json({ message: "Link disabled" });
    }

    if (entry.expiresAt && new Date() > entry.expiresAt) {
      return res.status(410).json({ message: "Link expired" });
    }

    if (!entry.password) {
      return res.json({ redirectURL: entry.redirectURL });
    }

    const isMatch = await bcrypt.compare(password, entry.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Wrong Password" });
    }

    return res.json({ redirectURL: entry.redirectURL });

  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
}


// ================= EXPORT =================
module.exports = {
  handleGenerateShortURL,
  handleRedirectURL,
  handleDisableURL,
  handleGetAnalytics,
  handleGetMyURLs,
  handleUpdateURL,
  handleDeleteURL,
  handleCreateCustomURL,
  handleGenerateQRCode,
  handleAccessProtectedURL,
};
// const URL = require("../model/url");
// const { nanoid } = require("nanoid");
// const bcrypt = require("bcrypt");
// const QRCode = require("qrcode");
// const validator = require("validator");
// const redisClient = require("../config/redis");
// const UAParser = require("ua-parser-js");
// const geoip = require("geoip-lite");

// // ================= Generate Short URL =================
// async function handleGenerateShortURL(req, res) {
//   try {
//     const { url, expiresAt, password, tags } = req.body;

//     if (!url || !validator.isURL(url)) {
//       return res.status(400).json({ message: "Valid URL is required" });
//     }

//     const shortId = nanoid(8);

//     let hashedPassword = null;
//     if (password) {
//       hashedPassword = await bcrypt.hash(password, 10);
//     }

//     const newURL = await URL.create({
//       shortId,
//       redirectURL: url,
//       createdBy: req.user.uid,
//       expiresAt,
//       password: hashedPassword,
//       tags,
//     });

//     return res.status(201).json({
//       shortId: newURL.shortId,
//       expiresAt: newURL.expiresAt,
//     });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// }

// // ================= Redirect URL =================
// async function handleRedirectURL(req, res) {
//   try {
//     const { shortId } = req.params;

//     const cachedURL = await redisClient.get(shortId);

//     if (cachedURL) {
//       const entry = await URL.findOne({ shortId });

//       if (!entry || !entry.isActive) {
//         return res.status(404).json({ message: "URL disabled or not found" });
//       }

//       return res.redirect(cachedURL);
//     }

//     const entry = await URL.findOne({ shortId });

//     if (!entry) {
//       return res.status(404).json({ message: "URL Not Found" });
//     }

//     if (!entry.isActive) {
//       return res.status(403).json({ message: "Link Disabled" });
//     }

//     if (entry.expiresAt && new Date() > entry.expiresAt) {
//       return res.status(410).json({ message: "Link Expired" });
//     }

//     const ttl = entry.expiresAt
//       ? Math.floor((new Date(entry.expiresAt) - new Date()) / 1000)
//       : 3600;

//     await redisClient.set(shortId, entry.redirectURL, { EX: ttl });

//     entry.clicks += 1;

//     const parser = new UAParser(req.headers["user-agent"]);
//     const result = parser.getResult();

//     const ip =
//       (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
//       req.socket.remoteAddress ||
//       req.ip;

//     const geo = geoip.lookup(ip);

//     entry.visitHistory.push({
//       timestamp: new Date(),
//       ip,
//       browser: result.browser.name || "Unknown",
//       os: result.os.name || "Unknown",
//       device: result.device.type || "Desktop",
//       country: geo?.country || "Unknown",
//       city: geo?.city || "Unknown",
//     });

//     if (entry.visitHistory.length > 1000) {
//       entry.visitHistory.shift();
//     }

//     await entry.save();

//     return res.redirect(entry.redirectURL);
//   } catch (err) {
//     return res.status(500).json({ message: "Server Error" });
//   }
// }

// // ================= Disable URL =================
// async function handleDisableURL(req, res) {
//   try {
//     const url = await URL.findOneAndUpdate(
//       { _id: req.params.id, createdBy: req.user.uid },
//       { isActive: false },
//       { new: true }
//     );

//     if (!url) {
//       return res.status(404).json({ message: "URL not found" });
//     }

//     await redisClient.del(url.shortId);

//     return res.json({ message: "Link Disabled", url });
//   } catch (err) {
//     return res.status(500).json({ message: "Server Error" });
//   }
// }

// // ================= Analytics =================
// async function handleGetAnalytics(req, res) {
//   try {
//     const { shortId } = req.params;

//     const result = await URL.findOne({
//       shortId,
//       createdBy: req.user.uid,
//     });

//     if (!result) {
//       return res.status(404).json({ message: "URL Not Found" });
//     }

//     const browserStats = {};
//     const deviceStats = {};
//     const osStats = {};
//     const countryStats = {};
//     const cityStats = {};

//     result.visitHistory.forEach((visit) => {
//       const browser = visit.browser || "Unknown";
//       const device = visit.device || "Unknown";
//       const os = visit.os || "Unknown";
//       const country = visit.country || "Unknown";
//       const city = visit.city || "Unknown";

//       browserStats[browser] = (browserStats[browser] || 0) + 1;
//       deviceStats[device] = (deviceStats[device] || 0) + 1;
//       osStats[os] = (osStats[os] || 0) + 1;
//       countryStats[country] = (countryStats[country] || 0) + 1;
//       cityStats[city] = (cityStats[city] || 0) + 1;
//     });

//     return res.json({
//       totalClicks: result.clicks,
//       browserStats,
//       deviceStats,
//       osStats,
//       countryStats,
//       cityStats,
//       analytics: result.visitHistory,
//     });
//   } catch (err) {
//     return res.status(500).json({ message: "Server Error" });
//   }
// }

// // ================= My URLs =================
// async function handleGetMyURLs(req, res) {
//   try {
//     const urls = await URL.find({ createdBy: req.user.uid });
//     return res.json(urls);
//   } catch (err) {
//     return res.status(500).json({ message: "Server Error" });
//   }
// }

// // ================= Update URL =================
// async function handleUpdateURL(req, res) {
//   try {
//     const { id } = req.params;
//     const { redirectURL } = req.body;

//     if (!validator.isURL(redirectURL)) {
//       return res.status(400).json({ message: "Invalid URL" });
//     }

//     const updated = await URL.findOneAndUpdate(
//       { _id: id, createdBy: req.user.uid },
//       { redirectURL },
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ message: "URL not found" });
//     }

//     await redisClient.del(updated.shortId);

//     return res.json(updated);
//   } catch (err) {
//     return res.status(500).json({ message: "Server Error" });
//   }
// }

// // ================= Delete URL =================
// async function handleDeleteURL(req, res) {
//   try {
//     const deleted = await URL.findOneAndDelete({
//       _id: req.params.id,
//       createdBy: req.user.uid,
//     });

//     if (!deleted) {
//       return res.status(404).json({ message: "URL not found" });
//     }

//     await redisClient.del(deleted.shortId);

//     return res.json({ message: "URL Deleted Successfully" });
//   } catch (err) {
//     return res.status(500).json({ message: "Server Error" });
//   }
// }

// // ================= Custom URL =================
// async function handleCreateCustomURL(req, res) {
//   try {
//     const { url, alias } = req.body;

//     if (!url || !alias) {
//       return res.status(400).json({ message: "URL and Alias required" });
//     }

//     if (!validator.isURL(url)) {
//       return res.status(400).json({ message: "Invalid URL" });
//     }

//     if (!/^[a-zA-Z0-9_-]+$/.test(alias)) {
//       return res.status(400).json({ message: "Invalid alias format" });
//     }

//     const exist = await URL.findOne({ shortId: alias });

//     if (exist) {
//       return res.status(400).json({ message: "Alias already exists" });
//     }

//     const newURL = await URL.create({
//       shortId: alias,
//       redirectURL: url,
//       createdBy: req.user.uid,
//     });

//     return res.status(201).json(newURL);
//   } catch (err) {
//     return res.status(500).json({ message: "Server Error" });
//   }
// }

// // ================= QR Code =================
// async function handleGenerateQRCode(req, res) {
//   try {
//     const { shortId } = req.params;

//     const entry = await URL.findOne({
//       shortId,
//       createdBy: req.user.uid,
//     });

//     if (!entry) {
//       return res.status(404).json({ message: "URL Not Found" });
//     }

//     const baseURL = process.env.BASE_URL;
//     const shortURL = `${baseURL}/${shortId}`;

//     const qrCode = await QRCode.toDataURL(shortURL);

//     return res.json({
//       shortURL,
//       qrCode,
//     });
//   } catch (err) {
//     return res.status(500).json({ message: "Server Error" });
//   }
// }

// // ================= Protected Access =================
// async function handleAccessProtectedURL(req, res) {
//   try {
//     const { shortId } = req.params;
//     const { password } = req.body;

//     const entry = await URL.findOne({ shortId });

//     if (!entry) {
//       return res.status(404).json({ message: "URL Not Found" });
//     }

//     if (!entry.isActive) {
//       return res.status(403).json({ message: "Link disabled" });
//     }

//     if (entry.expiresAt && new Date() > entry.expiresAt) {
//       return res.status(410).json({ message: "Link expired" });
//     }

//     if (!entry.password) {
//       return res.json({ redirectURL: entry.redirectURL });
//     }

//     const isMatch = await bcrypt.compare(password, entry.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Wrong Password" });
//     }

//     return res.json({ redirectURL: entry.redirectURL });
//   } catch (err) {
//     return res.status(500).json({ message: "Server Error" });
//   }
// }

// module.exports = {
//   handleGenerateShortURL,
//   handleRedirectURL,
//   handleDisableURL,
//   handleGetAnalytics,
//   handleGetMyURLs,
//   handleUpdateURL,
//   handleDeleteURL,
//   handleCreateCustomURL,
//   handleGenerateQRCode,
//   handleAccessProtectedURL,
// };











// const URL = require("../model/url");
// const { nanoid } = require("nanoid");
// const bcrypt = require("bcrypt");
// const QRCode = require("qrcode");
// const validator = require("validator");
// const redisClient = require("../config/redis");
// const UAParser = require("ua-parser-js");
// const geoip = require("geoip-lite");
// // ================= Generate Short URL =================

// async function handleGenerateShortURL(req, res) {
//   try {
//     const {
//       url,
//       expiresAt,
//       password,
//       tags,
//     } = req.body;

//     if (!url) {
//       return res.status(400).json({
//         message: "URL is required",
//       });
//     }

//     const shortId = nanoid(8);

//     let hashedPassword = null;

//     if (password) {
//       hashedPassword = await bcrypt.hash(
//         password,
//         10
//       );
//     }
//      if (!validator.isURL(url)) {
//   return res.status(400).json({
//     message: "Invalid URL",
//   });
// }
//     const newURL = await URL.create({
//       shortId,
//       redirectURL: url,
//       createdBy: req.user.uid,
//       expiresAt,
//       password: hashedPassword,
//       tags,
//     });

//     return res.status(201).json({
//       shortId: newURL.shortId,
//       expiresAt: newURL.expiresAt,
//     });

//   } catch (err) {
//     console.log(err);

//     return res.status(500).json({
//       message: err.message,
//     });
//   }
// }

// // ================= Redirect URL =================
// async function handleRedirectURL(req, res) {
//   try {
//     const { shortId } = req.params;

//     const cachedURL =
//       await redisClient.get(shortId);

//     if (cachedURL) {
//       return res.redirect(cachedURL);
//     }

//     const entry = await URL.findOne({
//       shortId,
//     });

//     if (!entry) {
//       return res.status(404).json({
//         message: "URL Not Found",
//       });
//     }

//     if (!entry.isActive) {
//       return res.status(403).json({
//         message: "Link Disabled",
//       });
//     }

//     if (
//       entry.expiresAt &&
//       new Date() > entry.expiresAt
//     ) {
//       return res.status(410).json({
//         message: "Link Expired",
//       });
//     }

//     await redisClient.set(
//       shortId,
//       entry.redirectURL,
//       {
//         EX: 3600,
//       }
//     );

//     entry.clicks += 1;

// const parser = new UAParser(
//   req.headers["user-agent"]
// );

// const result = parser.getResult();

// const ip =
//   req.headers["x-forwarded-for"] ||
//   req.socket.remoteAddress ||
//   req.ip;

// const geo = geoip.lookup(ip);

// entry.visitHistory.push({
//   timestamp: new Date(),

//   ip,

//   browser:
//     result.browser.name || "Unknown",

//   os:
//     result.os.name || "Unknown",

//   device:
//     result.device.type || "Desktop",

//   country:
//     geo?.country || "Unknown",

//   city:
//     geo?.city || "Unknown",
// });
//     await entry.save();

//     return res.redirect(
//       entry.redirectURL
//     );

//   } catch (err) {
//     console.log(err);

//     return res.status(500).json({
//       message: "Server Error",
//     });
//   }
// }

// // ================= Disable URL =================

// async function handleDisableURL(req, res) {
//   try {
//     const url = await URL.findOneAndUpdate(
//       {
//         _id: req.params.id,
//         createdBy: req.user.uid,
//       },
//       {
//         isActive: false,
//       },
//       {
//         new: true,
//       }
//     );

//     if (!url) {
//       return res.status(404).json({
//         message: "URL not found",
//       });
//     }

//     return res.json({
//       message: "Link Disabled",
//       url,
//     });

//   } catch (err) {
//     console.log(err);

//     return res.status(500).json({
//       message: "Server Error",
//     });
//   }
// }

// // ================= Analytics =================

// async function handleGetAnalytics(req, res) {
//   try {
//     const { shortId } = req.params;

//    const result = await URL.findOne({
//   shortId,
//   createdBy: req.user.uid,
// });

//     if (!result) {
//       return res.status(404).json({
//         message: "URL Not Found",
//       });
//     }

//  const browserStats = {};
// const deviceStats = {};
// const osStats = {};
// const countryStats = {};
// const cityStats = {};

// result.visitHistory.forEach(
//   (visit) => {

//     const browser =
//       visit.browser || "Unknown";

//     const device =
//       visit.device || "Unknown";

//     const os =
//       visit.os || "Unknown";

//     const country =
//       visit.country || "Unknown";

//     const city =
//       visit.city || "Unknown";

//     browserStats[browser] =
//       (browserStats[browser] || 0) + 1;

//     deviceStats[device] =
//       (deviceStats[device] || 0) + 1;

//     osStats[os] =
//       (osStats[os] || 0) + 1;

//     countryStats[country] =
//       (countryStats[country] || 0) + 1;

//     cityStats[city] =
//       (cityStats[city] || 0) + 1;
//   }
// );

// return res.json({
//   totalClicks: result.clicks,

//   browserStats,

//   deviceStats,

//   osStats,

//   countryStats,

//   cityStats,

//   analytics:
//     result.visitHistory,
// });

//   } catch (err) {
//     console.log(err);

//     return res.status(500).json({
//       message: "Server Error",
//     });
//   }
// }

// // ================= My URLs =================

// async function handleGetMyURLs(req, res) {
//   try {
//     const urls = await URL.find({
//       createdBy: req.user.uid,
//     });

//     return res.json(urls);

//   } catch (err) {
//     console.log(err);

//     return res.status(500).json({
//       message: "Server Error",
//     });
//   }
// }

// // ================= Update URL =================

// async function handleUpdateURL(req, res) {
//   try {
//     const { id } = req.params;
//     const { redirectURL } = req.body;

//     const updated = await URL.findOneAndUpdate(
//       {
//         _id: id,
//         createdBy: req.user.uid,
//       },
//       {
//         redirectURL,
//       },
//       {
//         new: true,
//       }
//     );
// if (!updated) {
//   return res.status(404).json({
//     message:
//       "URL not found or unauthorized",
//   });
// }

// await redisClient.del(
//   updated.shortId
// );

// return res.json(updated);

//   } catch (err) {
//     console.log(err);

//     return res.status(500).json({
//       message: "Server Error",
//     });
//   }
// }

// // ================= Delete URL =================

// async function handleDeleteURL(req, res) {
//   try {
//     const { id } = req.params;

//     const deleted =
//       await URL.findOneAndDelete({
//         _id: id,
//         createdBy: req.user.uid,
//       });

//     if (!deleted) {
//       return res.status(404).json({
//         message:
//           "URL not found or unauthorized",
//       });
//     }
//     await redisClient.del(
//   deleted.shortId
// );
//     return res.json({
//       message:
//         "URL Deleted Successfully",
//     });

//   } catch (err) {
//     console.log(err);

//     return res.status(500).json({
//       message: "Server Error",
//     });
//   }
// }

// // ================= Custom URL =================

// async function handleCreateCustomURL(
//   req,
//   res
// ) {
//   try {
//     const { url, alias } = req.body;

//     if (!url || !alias) {
//       return res.status(400).json({
//         message:
//           "URL and Alias are required",
//       });
//     }
//  if (!/^[a-zA-Z0-9_-]+$/.test(alias)) {
//       return res.status(400).json({
//         message:
//           "Alias can contain only letters, numbers, _ and -",
//       });
//     }
//     const exist = await URL.findOne({
//       shortId: alias,
//     });

//     if (exist) {
//       return res.status(400).json({
//         message:
//           "Alias already exists",
//       });
//     }
    
//     const newURL = await URL.create({
//       shortId: alias,
//       redirectURL: url,
//       createdBy: req.user.uid,
//     });

//     return res.status(201).json(
//       newURL
//     );

//   } catch (err) {
//     console.log(err);

//     return res.status(500).json({
//       message: "Server Error",
//     });
//   }
// }

// // ================= Generate QR =================

// async function handleGenerateQRCode(
//   req,
//   res
// ) {
//   try {
//     const { shortId } = req.params;
// const entry = await URL.findOne({
//   shortId,
//   createdBy: req.user.uid,
// });

//     if (!entry) {
//       return res.status(404).json({
//         message: "URL Not Found",
//       });
//     }

//     const shortURL =
//       `http://localhost:8000/url/${shortId}`;

//     const qr =
//       await QRCode.toDataURL(
//         shortURL
//       );

//     return res.json({
//       shortURL,
//       qrCode: qr,
//     });

//   } catch (err) {
//     console.log(err);

//     return res.status(500).json({
//       message: "Server Error",
//     });
//   }
// }
// async function handleAccessProtectedURL(req, res) {
//   try {
//     const { shortId } = req.params;
//     const { password } = req.body;

//     const entry = await URL.findOne({ shortId });

//     if (!entry) {
//       return res.status(404).json({
//         message: "URL Not Found",
//       });
//     }

//     if (!entry.password) {
//       return res.json({
//         redirectURL: entry.redirectURL,
//       });
//     }

//     const isMatch = await bcrypt.compare(
//       password,
//       entry.password
//     );

//     if (!isMatch) {
//       return res.status(401).json({
//         message: "Wrong Password",
//       });
//     }

//     return res.json({
//       redirectURL: entry.redirectURL,
//     });

//   } catch (err) {
//     return res.status(500).json({
//       message: "Server Error",
//     });
//   }
// }
// module.exports = {
//   handleGenerateShortURL,
//   handleRedirectURL,
//   handleDisableURL,
//   handleGetAnalytics,
//   handleGetMyURLs,
//   handleUpdateURL,
//   handleDeleteURL,
//   handleCreateCustomURL,
//   handleGenerateQRCode,
//   handleAccessProtectedURL
// };