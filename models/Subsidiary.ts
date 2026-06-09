import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubsidiaryGalleryItem { url: string; alt: string }
export interface ISubsidiaryActivity    { title: string; description: string; order: number }
export interface ISubsidiaryProduct     { name: string; description: string; image?: string; order: number }

export interface ISubsidiary extends Document {
  slug:              string;
  name:              string;
  industry:          string;
  shortDescription:  string;
  description:       string;
  location:          string;
  ownership:         string;
  establishedYear?:  number;
  logoImage?:        string;
  bannerImage?:      string;
  gallery:           ISubsidiaryGalleryItem[];
  activities:        ISubsidiaryActivity[];
  products:          ISubsidiaryProduct[];
  contact: {
    phone?:   string;
    email?:   string;
    website?: string;
  };
  isActive:          boolean;
  isFeatured:        boolean;
  order:             number;
  seoTitle?:         string;
  seoDescription?:   string;
  ogImage?:          string;
  createdAt:         Date;
  updatedAt:         Date;
}

const GallerySchema  = new Schema<ISubsidiaryGalleryItem>({ url: String, alt: { type: String, default: "" } }, { _id: false });
const ActivitySchema = new Schema<ISubsidiaryActivity>({ title: String, description: { type: String, default: "" }, order: { type: Number, default: 0 } }, { _id: false });
const ProductSchema  = new Schema<ISubsidiaryProduct>({ name: String, description: { type: String, default: "" }, image: String, order: { type: Number, default: 0 } }, { _id: false });

const SubsidiarySchema = new Schema<ISubsidiary>(
  {
    slug:             { type: String, required: true, unique: true, lowercase: true, trim: true },
    name:             { type: String, required: true, trim: true },
    industry:         { type: String, required: true },
    shortDescription: { type: String, default: "", maxlength: 300 },
    description:      { type: String, default: "", maxlength: 3000 },
    location:         { type: String, default: "" },
    ownership:        { type: String, default: "" },
    establishedYear:  { type: Number },
    logoImage:        { type: String },
    bannerImage:      { type: String },
    gallery:          { type: [GallerySchema],  default: [] },
    activities:       { type: [ActivitySchema], default: [] },
    products:         { type: [ProductSchema],  default: [] },
    contact: {
      phone:   String,
      email:   String,
      website: String,
    },
    isActive:         { type: Boolean, default: true, index: true },
    isFeatured:       { type: Boolean, default: false },
    order:            { type: Number,  default: 0 },
    seoTitle:         { type: String,  maxlength: 70 },
    seoDescription:   { type: String,  maxlength: 160 },
    ogImage:          { type: String },
  },
  { timestamps: true }
);

SubsidiarySchema.index({ isActive: 1, order: 1 });
SubsidiarySchema.index({ slug: 1 });

const Subsidiary: Model<ISubsidiary> =
  mongoose.models.Subsidiary ?? mongoose.model<ISubsidiary>("Subsidiary", SubsidiarySchema);

export default Subsidiary;
