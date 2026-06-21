const express = require("express");
const router = express.Router();

const {
  handleCreateCustomURL,
  handleDeleteURL,
  handleGenerateQRCode,
  handleGenerateShortURL,
  handleGetAnalytics,
  handleGetMyURLs,
  handleUpdateURL,
  handleRedirectURL,
  handleDisableURL,
  handleAccessProtectedURL
} = require("../controller/url");

const {
  restrictToLoggedInUserOnly,
} = require("../middleware/auth");

// ================== PROTECTED ROUTES ==================

// Create Short URL
router.post(
  "/",
  restrictToLoggedInUserOnly,
  handleGenerateShortURL
);

// Create Custom Alias URL
router.post(
  "/custom",
  restrictToLoggedInUserOnly,
  handleCreateCustomURL
);

// Get Logged In User URLs
router.get(
  "/my-urls",
  restrictToLoggedInUserOnly,
  handleGetMyURLs
);

// Get Analytics
router.get(
  "/analytics/:shortId",
  restrictToLoggedInUserOnly,
  handleGetAnalytics
);

// Generate QR Code
router.get(
  "/qr/:shortId",
  restrictToLoggedInUserOnly,
  handleGenerateQRCode
);

// Update URL
router.put(
  "/:id",
  restrictToLoggedInUserOnly,
  handleUpdateURL
);

// Disable URL
router.patch(
  "/disable/:id",
  restrictToLoggedInUserOnly,
  handleDisableURL
);

// Delete URL
router.delete(
  "/:id",
  restrictToLoggedInUserOnly,
  handleDeleteURL
);
router.post(
  "/access/:shortId",
  restrictToLoggedInUserOnly, // optional but recommended
  handleAccessProtectedURL
);
// ================== PUBLIC ROUTE ==================

// Redirect Short URL
router.get(
  "/:shortId",
  handleRedirectURL
);

module.exports = router;