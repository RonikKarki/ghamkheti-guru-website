import mongoose, { Schema, Document, Model } from "mongoose";

export type ServicesSection = "banner" | "services" | "process" | "cta_banner";

export interface IServicesContent extends Document {
  section:    ServicesSection;
  isActive:   boolean;
  title?:     string;
  subtitle?:  string;
  body?:      string;
  items:      mongoose.Types.Array<Record<string, unknown>>;
  updatedBy?: string;
  createdAt:  Date;
  updatedAt:  Date;
}

const ServicesContentSchema = new Schema<IServicesContent>(
  {
    section: {
      type:     String,
      required: true,
      unique:   true,
      enum:     ["banner", "services", "process", "cta_banner"],
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

const ServicesContent: Model<IServicesContent> =
  mongoose.models.ServicesContent ??
  mongoose.model<IServicesContent>("ServicesContent", ServicesContentSchema);

export default ServicesContent;
