import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  bookingId: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  roomType: 'AC' | 'Non-AC';
  checkIn: Date;
  checkOut: Date;
  duration: '12hr' | '24hr';
  numberOfGuests: number;
  totalAmount: number;
  specialRequests: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  bookingId: {
    type: String,
    required: true,
    unique: true,
  },
  guestName: { type: String, required: true },
  guestPhone: { type: String, required: true },
  guestEmail: { type: String, default: '' },
  roomType: {
    type: String,
    enum: ['AC', 'Non-AC'],
    required: true,
  },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  duration: {
    type: String,
    enum: ['12hr', '24hr'],
    required: true,
  },
  numberOfGuests: { type: Number, required: true, default: 1 },
  totalAmount: { type: Number, required: true },
  specialRequests: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
