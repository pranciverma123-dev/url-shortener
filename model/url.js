const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    redirectURL: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    clicks: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    password: {
      type: String,
      default: null,
    },

    qrCode: {
      type: String,
      default: null,
    },

    tags: [
      {
        type: String,
      },
    ],

   visitHistory: [
  {
    timestamp: {
      type: Date,
      default: Date.now,
    },

    ip: String,

    browser: String,

    os: String,

    device: String,

    country: String,

    city: String,
  },
],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Url", urlSchema);
