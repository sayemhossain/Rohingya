import mongoose, { Schema, Document } from 'mongoose';

export interface ISubProgrammeStat {
  label: string;
  value: string;
  icon: string;
}

export interface ISubProgrammeGalleryImage {
  url: string;
  caption?: string;
}

export interface ISubProgramme extends Document {
  // A sub-programme is a standalone, reusable item. Programmes (Sectors) pick
  // which sub-programmes to include via their own `subProgrammes` list, so a
  // sub-programme can be assigned to one or more programmes.
  name: string;
  slug: string; // globally unique — used in /programmes/[parent]/[slug]
  description: string;
  longDescription: string;
  icon: string;
  // Uploaded SVG/PNG icon URL — takes priority over the react-icons `icon` name.
  iconImage: string;
  image: string;
  stats: ISubProgrammeStat[];
  gallery: ISubProgrammeGalleryImage[];
  achievements: string[];
  order: number;
  published: boolean;
  // When false, the sub-programme still appears on its programme page/pills
  // but is hidden from the navbar flyout.
  showInNavbar: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubProgrammeSchema = new Schema<ISubProgramme>(
  {
    name: {
      type: String,
      required: [true, 'Sub-programme name is required'],
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
    longDescription: { type: String },
    icon: { type: String },
    iconImage: { type: String },
    image: { type: String },
    stats: [
      {
        label: { type: String },
        value: { type: String },
        icon: { type: String },
      },
    ],
    gallery: [
      {
        url: { type: String },
        caption: { type: String },
      },
    ],
    achievements: [{ type: String }],
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    showInNavbar: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: 'subprogrammes',
  }
);

const SubProgramme =
  mongoose.models.SubProgramme ||
  mongoose.model<ISubProgramme>('SubProgramme', SubProgrammeSchema);

export default SubProgramme;
