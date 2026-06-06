import mongoose, { Schema, Document, Model } from "mongoose";

export type EnquiryType =
  | "general"
  | "investment"
  | "partnership"
  | "media"
  | "career"
  | "procurement"
  | "government";

export type ContactStatus = "new" | "read" | "in_progress" | "replied" | "closed";
export type ContactPriority = "low" | "normal" | "high" | "urgent";

export interface IContact extends Document {
  name:          string;
  email:         string;
  phone?:        string;
  organisation?: string;
  enquiryType:   EnquiryType;
  subject:       string;
  message:       string;
  status:        ContactStatus;
  priority:      ContactPriority;
  internalNotes: string;
  ipAddress?:    string;
  userAgent?:    string;
  createdAt:     Date;
  updatedAt:     Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name:         { type: String, required: true, trim: true, maxlength: 120 },
    email:        {
      type:      String,
      required:  true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    phone:        { type: String, trim: true, maxlength: 30 },
    organisation: { type: String, trim: true, maxlength: 200 },
    enquiryType:  {
      type:    String,
      enum:    ["general", "investment", "partnership", "media", "career", "procurement", "government"],
      default: "general",
    },
    subject:       { type: String, required: true, trim: true, maxlength: 250 },
    message:       { type: String, required: true, maxlength: 5000 },
    status:        {
      type:    String,
      enum:    ["new", "read", "in_progress", "replied", "closed"],
      default: "new",
      index:   true,
    },
    priority:      {
      type:    String,
      enum:    ["low", "normal", "high", "urgent"],
      default: "normal",
      index:   true,
    },
    internalNotes: { type: String, default: "", maxlength: 2000 },
    ipAddress:     { type: String },
    userAgent:     { type: String },
  },
  { timestamps: true }
);

ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ status: 1, priority: -1, createdAt: -1 });
ContactSchema.index({ enquiryType: 1 });

const Contact: Model<IContact> =
  mongoose.models.Contact ?? mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
