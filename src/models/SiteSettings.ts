import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  key: string;
  value: unknown;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: {
      type: String,
      required: [true, 'Key is required'],
      unique: true,
      trim: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: [true, 'Value is required'],
    },
  },
  {
    timestamps: true,
  }
);

const SiteSettings = mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
