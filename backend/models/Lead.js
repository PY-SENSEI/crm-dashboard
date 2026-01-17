import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: [
      "new",
      "contacted",
      "qualified",
      "proposal",
      "negotiation",
      "converted",
      "lost",
    ],
    default: "new",
  },
  source: {
    type: String,
    enum: [
      "website",
      "referral",
      "social_media",
      "email_campaign",
      "event",
      "other",
    ],
    default: "website",
  },
  value: {
    type: Number,
    default: 0,
    min: 0,
  },
  notes: {
    type: String,
    trim: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  lastContacted: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

leadSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

leadSchema.index({ name: "text", email: "text", company: "text" });
leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });

export default mongoose.model("Lead", leadSchema);
