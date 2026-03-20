import mongoose, { Schema, Document } from 'mongoose';

export interface ISectorStat {
  label: string;
  value: string;
  icon: string;
}

export interface ISectorProgram {
  title: string;
  description: string;
}

export interface ISector extends Document {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  icon: string;
  image: string;
  stats: ISectorStat[];
  programs: ISectorProgram[];
  achievements: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SectorSchema = new Schema<ISector>(
  {
    name: {
      type: String,
      required: [true, 'Sector name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    longDescription: {
      type: String,
    },
    icon: {
      type: String,
    },
    image: {
      type: String,
    },
    stats: [
      {
        label: { type: String },
        value: { type: String },
        icon: { type: String },
      },
    ],
    programs: [
      {
        title: { type: String },
        description: { type: String },
      },
    ],
    achievements: [{ type: String }],
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Sector = mongoose.models.Sector || mongoose.model<ISector>('Sector', SectorSchema);

export default Sector;
