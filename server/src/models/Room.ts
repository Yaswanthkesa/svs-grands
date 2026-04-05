import mongoose, { Document, Schema } from 'mongoose';

export interface IRoom extends Document {
  type: 'AC' | 'Non-AC';
  totalCount: number;
  pricing: {
    twelveHour: number;
    twentyFourHour: number;
  };
  amenities: string[];
  images: string[];
  description: string;
}

const RoomSchema = new Schema<IRoom>({
  type: {
    type: String,
    enum: ['AC', 'Non-AC'],
    required: true,
  },
  totalCount: {
    type: Number,
    required: true,
    default: 16,
  },
  pricing: {
    twelveHour: { type: Number, required: true },
    twentyFourHour: { type: Number, required: true },
  },
  amenities: [{ type: String }],
  images: [{ type: String }],
  description: { type: String, default: '' },
});

export default mongoose.model<IRoom>('Room', RoomSchema);
