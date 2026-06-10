import mongoose, { Schema, Document, Model } from "mongoose";

export type ContactSection = "page_header" | "intro" | "offices" | "map";

export interface IContactContent extends Document {
  section:    ContactSection;
  isActive:   boolean;
  title?:     string;
  subtitle?:  string;
  body?:      string;
  items:      mongoose.Types.Array<Record<string, unknown>>;
  updatedBy?: string;
  createdAt:  Date;
  updatedAt:  Date;
}

const ContactContentSchema = new Schema<IContactContent>(
  {
    section: {
      type:     String,
      required: true,
      unique:   true,
      enum:     ["page_header", "intro", "offices", "map"],
    },
    isActive:  { type: Boolean, default: true },
    title:     { type: String, trim: true },
    subtitle:  { type: String, trim: true },
    body:      { type: String },
    items:     { type: [Schema.Types.Mixed], default: [] },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

const ContactContent: Model<IContactContent> =
  mongoose.models.ContactContent ??
  mongoose.model<IContactContent>("ContactContent", ContactContentSchema);

export default ContactContent;
