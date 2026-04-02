import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  category: 'Education' | 'Health' | 'Protection' | 'Community' | 'General' | 'Agriculture' | 'WaSH' | 'Nutrition' | 'DRR' | 'Climate Change';
  author: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      enum: ['Education', 'Health', 'Protection', 'Community', 'General', 'Agriculture', 'WaSH', 'Nutrition', 'DRR', 'Climate Change'],
      default: 'General',
    },
    author: {
      type: String,
      trim: true,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const News = mongoose.models.News || mongoose.model<INews>('News', NewsSchema);

export default News;
