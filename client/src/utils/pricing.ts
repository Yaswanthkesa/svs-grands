export type RoomId = 
  | 'SINGLE_AC_TV' 
  | 'SINGLE_AC_NOTV' 
  | 'SINGLE_NONAC_TV' 
  | 'SINGLE_NONAC_NOTV' 
  | 'DOUBLE_AC_GF' 
  | 'DOUBLE_AC_FF' 
  | 'DOUBLE_NONAC';

export interface PricingRule {
  price12h?: number;     // Undefined for Peak Friday fixed rate
  price24h: number;      // Serves as 'fixed24h' for Peak Friday
  extraHr: number;
  extraPerson: number;
  maxPersons: number;
  includedPersons: number;
}

export type PricingMatrix = Record<RoomId, PricingRule>;

export const NORMAL_RATES: PricingMatrix = {
  SINGLE_AC_TV: { price12h: 1100, price24h: 1600, extraHr: 100, extraPerson: 300, maxPersons: 3, includedPersons: 2 },
  SINGLE_AC_NOTV: { price12h: 1000, price24h: 1500, extraHr: 100, extraPerson: 300, maxPersons: 3, includedPersons: 2 },
  SINGLE_NONAC_TV: { price12h: 900, price24h: 1100, extraHr: 100, extraPerson: 200, maxPersons: 3, includedPersons: 2 },
  SINGLE_NONAC_NOTV: { price12h: 800, price24h: 1000, extraHr: 100, extraPerson: 200, maxPersons: 3, includedPersons: 2 },
  DOUBLE_AC_GF: { price12h: 1500, price24h: 2000, extraHr: 150, extraPerson: 300, maxPersons: 5, includedPersons: 4 },
  DOUBLE_AC_FF: { price12h: 1500, price24h: 2000, extraHr: 150, extraPerson: 300, maxPersons: 5, includedPersons: 4 },
  DOUBLE_NONAC: { price12h: 1200, price24h: 1500, extraHr: 100, extraPerson: 300, maxPersons: 5, includedPersons: 4 },
};

export const WEEKEND_RATES: PricingMatrix = {
  SINGLE_AC_TV: { price12h: 1300, price24h: 1600, extraHr: 100, extraPerson: 300, maxPersons: 3, includedPersons: 2 },
  SINGLE_AC_NOTV: { price12h: 1200, price24h: 1500, extraHr: 100, extraPerson: 300, maxPersons: 3, includedPersons: 2 },
  SINGLE_NONAC_TV: { price12h: 1000, price24h: 1200, extraHr: 100, extraPerson: 200, maxPersons: 3, includedPersons: 2 },
  SINGLE_NONAC_NOTV: { price12h: 900, price24h: 1100, extraHr: 100, extraPerson: 200, maxPersons: 3, includedPersons: 2 },
  DOUBLE_AC_GF: { price12h: 1500, price24h: 2000, extraHr: 150, extraPerson: 300, maxPersons: 5, includedPersons: 4 },
  DOUBLE_AC_FF: { price12h: 1500, price24h: 2000, extraHr: 150, extraPerson: 300, maxPersons: 5, includedPersons: 4 },
  DOUBLE_NONAC: { price12h: 1200, price24h: 1500, extraHr: 100, extraPerson: 300, maxPersons: 5, includedPersons: 4 },
};

export const PEAK_RATES: PricingMatrix = {
  // Friday strictly 24hr blocks (no 12hr rate). price24h is the fixed block rate.
  SINGLE_AC_TV: { price24h: 1600, extraHr: 100, extraPerson: 300, maxPersons: 4, includedPersons: 2 },
  SINGLE_AC_NOTV: { price24h: 1500, extraHr: 100, extraPerson: 300, maxPersons: 4, includedPersons: 2 },
  SINGLE_NONAC_TV: { price24h: 1100, extraHr: 100, extraPerson: 300, maxPersons: 4, includedPersons: 2 },
  SINGLE_NONAC_NOTV: { price24h: 1000, extraHr: 100, extraPerson: 300, maxPersons: 4, includedPersons: 2 },
  DOUBLE_AC_GF: { price24h: 2500, extraHr: 200, extraPerson: 300, maxPersons: 5, includedPersons: 4 }, // "max 5 persons"
  DOUBLE_AC_FF: { price24h: 2000, extraHr: 200, extraPerson: 300, maxPersons: 4, includedPersons: 4 },
  DOUBLE_NONAC: { price24h: 1500, extraHr: 100, extraPerson: 300, maxPersons: 4, includedPersons: 4 },
};

export const ROOM_NAMES: Record<RoomId, string> = {
  SINGLE_AC_TV: 'Single AC Room (With TV)',
  SINGLE_AC_NOTV: 'Single AC Room (Without TV)',
  SINGLE_NONAC_TV: 'Single Non-AC Room (With TV)',
  SINGLE_NONAC_NOTV: 'Single Non-AC Room (Without TV)',
  DOUBLE_AC_GF: 'Double Bed AC Room (Ground Floor)',
  DOUBLE_AC_FF: 'Double Bed AC Room (First Floor)',
  DOUBLE_NONAC: 'Double Bed Non-AC Room',
};

/**
 * Identify the rate group based on Check-in Date/Time.
 * The system considers the "hotel day" starting at 11:00 AM.
 */
export const getDayCategory = (dateBlockStart: Date): 'NORMAL' | 'PEAK' | 'WEEKEND' => {
  // We need to shift everything backward by 11 hours.
  // 10:59 AM on Thursday falls mathematically into Wednesday (NORMAL).
  // 11:00 AM on Thursday falls exactly onto the start of Thursday (PEAK starts).
  const shiftedDate = new Date(dateBlockStart.getTime() - (11 * 60 * 60 * 1000));
  const day = shiftedDate.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

  // Thursday shifted means Thursday 11:00 AM to Friday 10:59 AM -> Day 4 (Peak)
  if (day === 4) return 'PEAK';
  
  // Friday shifted means Friday 11:00 AM to Saturday 10:59 AM -> Day 5 (Weekend)
  // Saturday shifted means Saturday 11:00 AM to Sunday 10:59 AM -> Day 6 (Weekend)
  if (day === 5 || day === 6) return 'WEEKEND';

  // Everything else is NORMAL (Sun, Mon, Tue, Wed)
  return 'NORMAL';
};

/**
 * Calculates price for a single chunk of time.
 */
function calculateBlockPrice(category: 'NORMAL' | 'PEAK' | 'WEEKEND', roomId: RoomId, hours: number, guests: number): number {
  let rule = NORMAL_RATES[roomId];
  if (category === 'PEAK') rule = PEAK_RATES[roomId];
  if (category === 'WEEKEND') rule = WEEKEND_RATES[roomId];

  // Extra Person Cost (per block calculation. Wait, if they book multiple days, they pay extra person fee per day. Yes!)
  let extraPersonFee = 0;
  if (guests > rule.includedPersons) {
    extraPersonFee = (guests - rule.includedPersons) * rule.extraPerson;
  }

  // Peak logic is strictly 24h base price
  if (category === 'PEAK') {
    let base = rule.price24h;
    if (hours > 24) base += Math.ceil(hours - 24) * rule.extraHr;
    return base + extraPersonFee;
  }

  // Normal / Weekend Logic
  const has12hBase = !!rule.price12h;
  
  if (hours <= 12 && has12hBase) {
    return rule.price12h! + extraPersonFee;
  }

  // Handle hours between 12 and 24 (The Flexibility Rule)
  if (hours > 12 && hours <= 24 && has12hBase) {
    const extraHoursAmt = Math.ceil(hours - 12) * rule.extraHr;
    const computedPrice = rule.price12h! + extraHoursAmt;
    // Cap at the 24h price!
    const base = Math.min(computedPrice, rule.price24h);
    return base + extraPersonFee;
  }

  // If >24h (which shouldn't happen inside a block theoretically if we strictly slice at 24h, but just in case)
  let base = rule.price24h;
  if (hours > 24) base += Math.ceil(hours - 24) * rule.extraHr;
  return base + extraPersonFee;
}

export interface PriceCalculationResult {
  totalPrice: number;
  blocks: { category: string, hours: number, price: number }[];
  error?: string;
}

export const calculatePrice = (checkIn: Date, checkOut: Date, roomId: RoomId, guests: number): PriceCalculationResult => {
  if (checkOut <= checkIn) {
    return { totalPrice: 0, blocks: [], error: 'Check-out time must be after check-in time.' };
  }

  // Check Exceeding Maximum capacity limit
  const rule = NORMAL_RATES[roomId]; // same maxPersons broadly
  if (guests > rule.maxPersons) {
     return { totalPrice: 0, blocks: [], error: `Maximum allowed guests for this room is ${rule.maxPersons}.` };
  }

  // Slice time into 24-hour chunks starting exactly at Check-In Time
  let currentTime = checkIn.getTime();
  const endTime = checkOut.getTime();
  const blocks = [];
  let totalPrice = 0;

  // Let's protect against Friday 11AM crossing as per rules
  // "if they entered beyond 11Am on friday then they need to be prompted like you can only able to book upto 11am on friday"
  // So: if check-in is before Friday 11AM that week, but checkout is AFTER Friday 11AM that week, return error.
  // Actually, easiest way is to find out if the stay OVERLAPS the Thu 11AM -> Fri 11AM peak boundary in a specific way.
  // The rule: "if you want beyond [Fri 11am] then do another booking from friday 11am"
  // Let's implement a hard block: If checkIn is before a Friday 11AM, and checkOut is after that same Friday 11AM... reject.
  const checkInDateObj = new Date(checkIn);
  // Find the next Friday 11AM relative to check-in
  let nextFriday11AM = new Date(checkInDateObj);
  nextFriday11AM.setHours(11, 0, 0, 0);
  
  // What day is checkIn?
  const ciDay = checkInDateObj.getDay();
  // If checkIn is Fri (5), but before 11AM, next Friday 11AM is TODAY 11AM.
  // If checkIn is Fri (5) after 11AM, next Friday 11AM is next week.
  if (ciDay === 5 && checkInDateObj.getHours() < 11) {
     // nextFriday11AM is today
  } else {
     // find next friday
     const daysUntilFriday = (5 - ciDay + 7) % 7;
     // if daysUntilFriday is 0, it means it's Friday AFTER 11AM, so move to NEXT friday
     const addDays = (daysUntilFriday === 0) ? 7 : daysUntilFriday;
     nextFriday11AM.setDate(checkInDateObj.getDate() + addDays);
  }

  // If the booking crosses exactly this Friday 11AM boundary, block it!
  // Note: Only block if checkIn is strictly BEFORE nextFriday11AM and checkOut is strictly AFTER nextFriday11AM.
  if (checkIn.getTime() < nextFriday11AM.getTime() && checkOut.getTime() > nextFriday11AM.getTime()) {
      return { 
        totalPrice: 0, 
        blocks: [], 
        error: `Bookings spanning across Friday 11:00 AM must be split. Please adjust check-out to Friday 11:00 AM and create a new booking for the rest of your stay.` 
      };
  }

  while (currentTime < endTime) {
    const remainingMs = endTime - currentTime;
    const msIn24h = 24 * 60 * 60 * 1000;
    
    // Size of this block: at most 24 hours
    const blockDurationMs = Math.min(remainingMs, msIn24h);
    const blockHours = blockDurationMs / (60 * 60 * 1000);
    
    // Determine category based on the *start time* of this 24h block
    const blockStart = new Date(currentTime);
    const category = getDayCategory(blockStart);

    const price = calculateBlockPrice(category, roomId, blockHours, guests);
    blocks.push({ category, hours: blockHours, price });
    totalPrice += price;

    currentTime += blockDurationMs;
  }

  return { totalPrice, blocks };
};
