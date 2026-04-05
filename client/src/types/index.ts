export interface RoomType {
  _id: string;
  type: 'AC' | 'Non-AC';
  totalCount: number;
  pricing: {
    twelveHour: number;
    twentyFourHour: number;
  };
  amenities: string[];
  images: string[];
  description: string;
  availableCount: number;
}

export interface BookingData {
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  numberOfGuests: number;
  totalAmount: number;
  specialRequests: string;
}

export interface BookingResponse {
  message: string;
  booking: {
    bookingId: string;
    guestName: string;
    guestPhone: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
    duration: string;
    totalAmount: number;
    status: string;
  };
  whatsappUrl?: string;
}

export interface Attraction {
  name: string;
  distance: string;
  travelTime: string;
  description: string;
  icon: string;
}
