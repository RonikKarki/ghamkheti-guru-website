import mongoose, { Schema, Document, Model } from "mongoose";

export type BannerPage =
  | "about"
  | "projects"
  | "blog"
  | "media"
  | "contact"
  | "investor_relations"
  | "services"
  | "team"
  | "gallery";

export interface IPageBannerContent extends Document {
  page:       BannerPage;
  imageUrl?:  string;
  imageAlt?:  string;
  isActive:   boolean;
  updatedBy?: string;
  createdAt:  Date;
  updatedAt:  Date;
}

const PageBannerContentSchema = new Schema<IPageBannerContent>(
  {
    page: {
      type:     String,
      required: true,
      unique:   true,
      enum: ["about","projects","blog","media","contact","investor_relations","services","team","gallery"],
    },
    imageUrl:  { type: String, trim: true },
    imageAlt:  { type: String, trim: true },
    isActive:  { type: Boolean, default: true },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

const PageBannerContent: Model<IPageBannerContent> =
  mongoose.models.PageBannerContent ??
  mongoose.model<IPageBannerContent>("PageBannerContent", PageBannerContentSchema);

export default PageBannerContent;
