import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type GalleryCategory =
  | "hydropower"
  | "solar"
  | "agriculture"
  | "corporate"
  | "community"
  | "events";

export type FileType = "image" | "video";

export interface IGallery extends Document {
  title:         string;
  alt:           string;
  category:      GalleryCategory;
  fileType:      FileType;
  fileUrl:       string;
  thumbnailUrl?: string;
  dimensions?: {
    width:  number;
    height: number;
  };
  fileSize?:    number;   // bytes
  isFeatured:   boolean;
  project?:     Types.ObjectId;  // ref → Project
  order:        number;
  takenAt?:     Date;
  createdAt:    Date;
  updatedAt:    Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title:    { type: String, required: true, trim: true, maxlength: 250 },
    alt:      { type: String, default: "", maxlength: 250 },
    category: {
      type:  String,
      required: true,
      enum:  ["hydropower", "solar", "agriculture", "corporate", "community", "events"],
      index: true,
    },
    fileType: { type: String, enum: ["image", "video"], default: "image" },
    fileUrl:  { type: String, required: true },
    thumbnailUrl: { type: String },
    dimensions: {
      width:  { type: Number },
      height: { type: Number },
    },
    fileSize:   { type: Number },
    isFeatured: { type: Boolean, default: false, index: true },
    project:    { type: Schema.Types.ObjectId, ref: "Project" },
    order:      { type: Number, default: 0 },
    takenAt:    { type: Date },
  },
  { timestamps: true }
);

GallerySchema.index({ category: 1, order: 1 });
GallerySchema.index({ isFeatured: 1, category: 1 });
GallerySchema.index({ project: 1 });

const Gallery: Model<IGallery> =
  mongoose.models.Gallery ?? mongoose.model<IGallery>("Gallery", GallerySchema);

export default Gallery;
