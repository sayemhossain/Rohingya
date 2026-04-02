import mongoose, { Schema, Document } from 'mongoose';

export interface ITimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface IValue {
  icon: string;
  title: string;
  description: string;
}

export interface IAboutContent extends Document {
  heroTitle: string;
  heroSubtitle: string;
  missionLabel: string;
  missionTitle: string;
  missionBody: string;
  missionImage: string;
  timeline: ITimelineEvent[];
  timelineLabel: string;
  timelineTitle: string;
  timelineSubtitle: string;
  values: IValue[];
  valuesLabel: string;
  valuesTitle: string;
  valuesSubtitle: string;
  createdAt: Date;
  updatedAt: Date;
}

const AboutContentSchema = new Schema<IAboutContent>(
  {
    heroTitle: { type: String, default: 'About AROHI' },
    heroSubtitle: { type: String, default: '' },
    missionLabel: { type: String, default: 'Our Mission' },
    missionTitle: { type: String, default: '' },
    missionBody: { type: String, default: '' },
    missionImage: { type: String, default: '' },
    timeline: [
      {
        year: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    timelineLabel: { type: String, default: 'Our Journey' },
    timelineTitle: { type: String, default: 'History of AROHI' },
    timelineSubtitle: { type: String, default: '' },
    values: [
      {
        icon: { type: String, default: 'HiHeart' },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    valuesLabel: { type: String, default: 'What Drives Us' },
    valuesTitle: { type: String, default: 'Our Values' },
    valuesSubtitle: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

const AboutContent =
  mongoose.models.AboutContent ||
  mongoose.model<IAboutContent>('AboutContent', AboutContentSchema);

export default AboutContent;
