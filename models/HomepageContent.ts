import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * CMS model for editable homepage sections.
 * Each document is keyed by `section` (unique) so the admin panel can
 * fetch/update a section by name rather than by _id.
 *
 * `items` is a flexible Mixed array — each section defines its own shape
 * (e.g. stat cards, pillar cards, feature bullets).
 */

export type HomepageSection =
  | "hero"
  | "hero_images"
  | "company_overview"
  | "stats"
  | "hydropower"
  | "solar"
  | "agriculture"
  | "chairman_message"
  | "sustainability"
  | "news_preview"
  | "investor_cta";

export interface ICta {
  label: string;
  href:  string;
}

export interface IHomepageContent extends Document {
  section:     HomepageSection;
  isActive:    boolean;
  title?:      string;
  subtitle?:   string;
  badge?:      string;
  body?:       string;
  items:       mongoose.Types.Array<Record<string, unknown>>;
  primaryCta?: ICta;
  secondaryCta?: ICta;
  updatedBy?:  string;
  createdAt:   Date;
  updatedAt:   Date;
}

const CtaSchema = new Schema<ICta>(
  { label: { type: String }, href: { type: String } },
  { _id: false }
);

const HomepageContentSchema = new Schema<IHomepageContent>(
  {
    section: {
      type:   String,
      required: true,
      unique: true,
      enum:   [
        "hero", "hero_images", "company_overview", "stats", "hydropower",
        "solar", "agriculture", "chairman_message",
        "sustainability", "news_preview", "investor_cta",
      ],
    },
    isActive:     { type: Boolean, default: true },
    title:        { type: String, trim: true },
    subtitle:     { type: String, trim: true },
    badge:        { type: String, trim: true },
    body:         { type: String },
    items:        { type: [Schema.Types.Mixed], default: [] },
    primaryCta:   { type: CtaSchema },
    secondaryCta: { type: CtaSchema },
    updatedBy:    { type: String },
  },
  { timestamps: true }
);

HomepageContentSchema.index({ section: 1 });
HomepageContentSchema.index({ isActive: 1 });

const HomepageContent: Model<IHomepageContent> =
  mongoose.models.HomepageContent ??
  mongoose.model<IHomepageContent>("HomepageContent", HomepageContentSchema);

export default HomepageContent;
