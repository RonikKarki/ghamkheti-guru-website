import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFooterLink {
  label: string;
  href:  string;
}

export interface ISocialLink {
  platform: "twitter" | "linkedin" | "facebook" | "instagram" | "youtube";
  href:     string;
  enabled:  boolean;
}

export interface IFooterSettings extends Document {
  email:            string;
  phone:            string;
  address:          string;
  companyLinks:     IFooterLink[];
  sectorLinks:      IFooterLink[];
  legalLinks:       IFooterLink[];
  socialLinks:      ISocialLink[];
  newsletterEnabled: boolean;
  copyrightText:    string;
  updatedAt:        Date;
}

const LinkSchema = new Schema<IFooterLink>(
  { label: { type: String, required: true }, href: { type: String, required: true } },
  { _id: false }
);

const SocialSchema = new Schema<ISocialLink>(
  {
    platform: { type: String, required: true, enum: ["twitter", "linkedin", "facebook", "instagram", "youtube"] },
    href:     { type: String, required: true },
    enabled:  { type: Boolean, default: true },
  },
  { _id: false }
);

const FooterSettingsSchema = new Schema<IFooterSettings>(
  {
    email:             { type: String, default: "ghamkhetiguru@gmail.com" },
    phone:             { type: String, default: "+977-9851266455" },
    address:           { type: String, default: "2nd Floor, Trade Tower, Thapathali, Kathmandu 44600, Nepal" },
    companyLinks:      { type: [LinkSchema], default: [] },
    sectorLinks:       { type: [LinkSchema], default: [] },
    legalLinks:        { type: [LinkSchema], default: [] },
    socialLinks:       { type: [SocialSchema], default: [] },
    newsletterEnabled: { type: Boolean, default: true },
    copyrightText:     { type: String, default: "" },
  },
  { timestamps: true }
);

const FooterSettings: Model<IFooterSettings> =
  mongoose.models.FooterSettings ??
  mongoose.model<IFooterSettings>("FooterSettings", FooterSettingsSchema);

export default FooterSettings;
