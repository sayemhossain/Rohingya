import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  caption: string;
  imageUrl: string;
  category: 'Camps' | 'Education' | 'Health' | 'Community' | 'General';
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    category: {
      type: String,
      enum: ['Camps', 'Education', 'Health', 'Community', 'General'],
      default: 'General',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Gallery = mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);

export default Gallery;
