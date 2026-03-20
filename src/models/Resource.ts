import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  fileUrl: string;
  fileType: 'PDF' | 'XLSX' | 'DOC' | 'PPT';
  category: 'Reports' | 'Data Sheets' | 'Guidelines' | 'Publications';
  fileSize: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileType: {
      type: String,
      enum: ['PDF', 'XLSX', 'DOC', 'PPT'],
      default: 'PDF',
    },
    category: {
      type: String,
      enum: ['Reports', 'Data Sheets', 'Guidelines', 'Publications'],
      default: 'Reports',
    },
    fileSize: {
      type: String,
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

const Resource = mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);

export default Resource;
