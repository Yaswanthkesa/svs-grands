import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

import { ROOM_NAMES, NORMAL_RATES } from '../utils/pricing';

export const fetchRooms = async () => {
  return Object.entries(ROOM_NAMES).map(([id, name]) => {
    const config = NORMAL_RATES[id as keyof typeof NORMAL_RATES];
    return {
      id,
      type: name,
      defaultPrice: config.price12h || config.price24h,
      amenities: id.includes('NONAC') ? ['WiFi', '24/7 Water'] : ['AC', 'WiFi', '24/7 Water'],
      images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80']
    }
  });
};

export const checkAvailability = async (_checkIn: string, _checkOut: string, _type?: string) => {
  // Mock true for now
  return { available: true };
};

import type { BookingData } from '../types';

export const createBooking = async (data: BookingData) => {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firebase timeout - DB may not be initialized')), 5000)
    );

    const docRef: any = await Promise.race([
      addDoc(collection(db, 'bookings'), {
        ...data,
        createdAt: new Date().toISOString(),
        status: 'pending' // pending, confirmed, cancelled
      }),
      timeoutPromise
    ]);
    
    return {
      message: 'Booking created successfully',
      booking: { ...data, bookingId: docRef.id, status: 'pending' }
    };
  } catch (error) {
    console.error('Error adding document: ', error);
    throw new Error('Failed to create booking in Firebase');
  }
};

export const getBooking = async (id: string) => {
  const docRef = doc(db, 'bookings', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { booking: { ...docSnap.data(), bookingId: docSnap.id } };
  } else {
    throw new Error('Booking not found');
  }
};
