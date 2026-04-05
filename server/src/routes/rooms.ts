import { Router, Request, Response } from 'express';
import Room from '../models/Room';
import Booking from '../models/Booking';

const router = Router();

// GET /api/rooms - Get all room types with pricing and availability
router.get('/', async (_req: Request, res: Response) => {
  try {
    let rooms = await Room.find();

    // Seed default rooms if empty
    if (rooms.length === 0) {
      const defaultRooms: Array<{type: 'AC' | 'Non-AC'; totalCount: number; pricing: {twelveHour: number; twentyFourHour: number}; amenities: string[]; images: string[]; description: string}> = [
        {
          type: 'Non-AC',
          totalCount: 16,
          pricing: { twelveHour: 800, twentyFourHour: 1000 },
          amenities: ['Television', 'Hot Water', 'Ceiling Fan', 'Attached Bathroom', 'Clean Linens', '24x7 Availability'],
          images: [],
          description: 'Comfortable and affordable Non-AC rooms with all essential amenities. Perfect for pilgrims visiting the nearby Sri Venkateswara Swamy Temple.',
        },
        {
          type: 'AC',
          totalCount: 16,
          pricing: { twelveHour: 1200, twentyFourHour: 1500 },
          amenities: ['Air Conditioning', 'Television', 'Hot Water', 'Ceiling Fan', 'Attached Bathroom', 'Clean Linens', '24x7 Availability'],
          images: [],
          description: 'Premium air-conditioned rooms offering maximum comfort with modern amenities. Ideal for families and those seeking a relaxing stay.',
        },
      ];
      rooms = await Room.insertMany(defaultRooms) as typeof rooms;
    }

    // Calculate availability for each room type
    const today = new Date();
    const roomsWithAvailability = await Promise.all(
      rooms.map(async (room) => {
        const activeBookings = await Booking.countDocuments({
          roomType: room.type,
          status: { $in: ['pending', 'confirmed'] },
          checkIn: { $lte: today },
          checkOut: { $gte: today },
        });
        return {
          ...room.toObject(),
          availableCount: room.totalCount - activeBookings,
        };
      })
    );

    res.json(roomsWithAvailability);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/rooms/availability - Check room availability for specific dates
router.get('/availability', async (req: Request, res: Response) => {
  try {
    const { checkIn, checkOut, type } = req.query;

    if (!checkIn || !checkOut) {
      res.status(400).json({ message: 'checkIn and checkOut dates are required' });
      return;
    }

    const checkInDate = new Date(checkIn as string);
    const checkOutDate = new Date(checkOut as string);

    const query: Record<string, unknown> = {
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } },
      ],
    };
    if (type) query.roomType = type;

    const overlappingBookings = await Booking.countDocuments(query);
    const room = await Room.findOne({ type: (type as string) || 'AC' });
    const totalRooms = room ? room.totalCount : 16;

    res.json({
      type: type || 'all',
      totalRooms,
      bookedRooms: overlappingBookings,
      availableRooms: totalRooms - overlappingBookings,
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
