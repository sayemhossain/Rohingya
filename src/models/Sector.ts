import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISectorStat {
  label: string;
  value: string;
  icon: string;
}

export interface ISectorProgram {
  title: string;
  description: string;
}

export interface IGalleryImage {
  url: string;
  caption?: string;
}

export interface ISector extends Document {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  icon: string;
  // Uploaded SVG/PNG icon URL — takes priority over the react-icons `icon` name.
  iconImage: string;
  image: string;
  // Optional image shown beside the long description on the programme page.
  descriptionImage: string;
  stats: ISectorStat[];
  programs: ISectorProgram[];
  gallery: IGalleryImage[];
  // Ordered list of assigned sub-programmes (references the SubProgramme pool).
  subProgrammes: Types.ObjectId[];
  achievements: string[];
  order: number;
  showOnHomepage: boolean;
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
    iconImage: {
      type: String,
    },
    image: {
      type: String,
    },
    descriptionImage: {
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
    gallery: [
      {
        url: { type: String },
        caption: { type: String },
      },
    ],
    subProgrammes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'SubProgramme',
      },
    ],
    achievements: [{ type: String }],
    order: {
      type: Number,
      default: 0,
    },
    showOnHomepage: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    // Stored in the "programmes" collection (the feature was rebranded from
    // "Sectors" to "Our Programmes"; the model symbol stays Sector internally).
    collection: 'programmes',
  }
);

const Sector = mongoose.models.Sector || mongoose.model<ISector>('Sector', SectorSchema);

export default Sector;
