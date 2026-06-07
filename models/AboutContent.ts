import mongoose, { Schema, Document, Model } from "mongoose";

export type AboutSection =
  | "banner"
  | "intro"
  | "mission_vision"
  | "values"
  | "leadership"
  | "timeline"
  | "board";

export interface IAboutContent extends Document {
  section:    AboutSection;
  isActive:   boolean;
  title?:     string;
  subtitle?:  string;
  body?:      string;
  items:      mongoose.Types.Array<Record<string, unknown>>;
  updatedBy?: string;
  createdAt:  Date;
  updatedAt:  Date;
}

const AboutContentSchema = new Schema<IAboutContent>(
  {
    section: {
      type:     String,
      required: true,
      unique:   true,
      enum:     ["banner", "intro", "mission_vision", "values", "leadership", "timeline", "board"],
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


const AboutContent: Model<IAboutContent> =
  mongoose.models.AboutContent ??
  mongoose.model<IAboutContent>("AboutContent", AboutContentSchema);

export default AboutContent;
