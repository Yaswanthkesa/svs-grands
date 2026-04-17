import { useState, useRef, useEffect, useCallback } from 'react';
import './DateRangePicker.css';

interface DateRangePickerProps {
  checkInDate: string;
  checkOutDate: string;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  direction?: 'down' | 'up';
  variant?: 'default' | 'compact';
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const toISO = (y: number, m: number, d: number) => 
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

const formatDisplay = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

// 0=Mon … 6=Sun
const getStartDay = (y: number, m: number) => {
  const d = new Date(y, m, 1).getDay();
  return d === 0 ? 6 : d - 1;
};

const todayISO = () => {
  const d = new Date();
  return toISO(d.getFullYear(), d.getMonth(), d.getDate());
};

export default function DateRangePicker({
  checkInDate,
  checkOutDate,
  onCheckInChange,
  onCheckOutChange,
  minDate,
  direction = 'down',
  variant = 'default',
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'checkin' | 'checkout'>('checkin');
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const today = todayISO();

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
      document.addEventListener('keydown', handleKey);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  // When opening, set view to current check-in month or today
  const handleOpen = () => {
    if (!isOpen) {
      const ref = checkInDate || today;
      const d = new Date(ref + 'T00:00:00');
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
      setStep(checkInDate && !checkOutDate ? 'checkout' : 'checkin');
    }
    setIsOpen(!isOpen);
  };

  const goToPrev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const goToNext = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleDayClick = useCallback((dateISO: string) => {
    if (step === 'checkin') {
      onCheckInChange(dateISO);
      onCheckOutChange(''); // Reset checkout
      setStep('checkout');
      // If check-in is in the second displayed month, shift the view
      const d = new Date(dateISO + 'T00:00:00');
      const m2 = viewMonth === 11 ? 0 : viewMonth + 1;
      const y2 = viewMonth === 11 ? viewYear + 1 : viewYear;
      if (d.getMonth() === m2 && d.getFullYear() === y2) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    } else {
      // Checkout
      if (dateISO <= checkInDate) {
        // User clicked before check-in — treat as new check-in
        onCheckInChange(dateISO);
        onCheckOutChange('');
        setStep('checkout');
        const d = new Date(dateISO + 'T00:00:00');
        const m2 = viewMonth === 11 ? 0 : viewMonth + 1;
        const y2 = viewMonth === 11 ? viewYear + 1 : viewYear;
        if (d.getMonth() === m2 && d.getFullYear() === y2) {
          setViewYear(d.getFullYear());
          setViewMonth(d.getMonth());
        }
        return;
      }
      onCheckOutChange(dateISO);
      setIsOpen(false);
    }
  }, [step, checkInDate, onCheckInChange, onCheckOutChange, viewMonth, viewYear]);

  // Render a single month grid
  const renderMonth = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const startDay = getStartDay(year, month);
    const cells: React.ReactNode[] = [];

    // Empty cells before first day
    for (let i = 0; i < startDay; i++) {
      cells.push(<div className="drp-day drp-day-empty" key={`e-${i}`} />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const iso = toISO(year, month, d);
      const isToday = iso === today;
      const isCheckIn = iso === checkInDate;
      const isCheckOut = iso === checkOutDate;
      const isPast = iso < (minDate || today);
      const isDisabledForCheckout = step === 'checkout' && checkInDate && iso <= checkInDate;
      const isDisabled = isPast || (step === 'checkout' && isDisabledForCheckout && !isCheckIn);

      // Range highlighting
      let isInRange = false;
      let isInHoverRange = false;
      if (checkInDate && checkOutDate && iso > checkInDate && iso < checkOutDate) {
        isInRange = true;
      }
      if (step === 'checkout' && checkInDate && !checkOutDate && hoveredDate && iso > checkInDate && iso <= hoveredDate) {
        isInHoverRange = true;
      }

      // Range edge classes
      const isRangeStart = isCheckIn && (checkOutDate || (step === 'checkout' && hoveredDate && hoveredDate > checkInDate));
      const isRangeEnd = isCheckOut || (step === 'checkout' && !checkOutDate && iso === hoveredDate && hoveredDate > checkInDate);

      const classes = [
        'drp-day',
        isToday && 'drp-day-today',
        isCheckIn && 'drp-day-checkin',
        isCheckOut && 'drp-day-checkout',
        isDisabled && 'drp-day-disabled',
        isInRange && 'drp-day-in-range',
        isInHoverRange && 'drp-day-hover-range',
        isRangeStart && 'drp-day-range-start',
        isRangeEnd && 'drp-day-range-end',
      ].filter(Boolean).join(' ');

      cells.push(
        <div
          key={d}
          className={classes}
          onClick={isDisabled && !isCheckIn ? undefined : () => handleDayClick(iso)}
          onMouseEnter={step === 'checkout' && !isDisabled ? () => setHoveredDate(iso) : undefined}
          onMouseLeave={step === 'checkout' ? () => setHoveredDate(null) : undefined}
        >
          {isToday && !isCheckIn && !isCheckOut ? (
            <span className="drp-today-badge">Today</span>
          ) : (
            <span>{d}</span>
          )}
        </div>
      );
    }

    return (
      <div className="drp-month">
        <div className="drp-month-title">{MONTHS[month]} {year}</div>
        <div className="drp-weekdays">
          {WEEKDAYS.map(w => <div key={w} className="drp-weekday">{w}</div>)}
        </div>
        <div className="drp-days-grid">{cells}</div>
      </div>
    );
  };

  const month2 = viewMonth === 11 ? 0 : viewMonth + 1;
  const year2 = viewMonth === 11 ? viewYear + 1 : viewYear;

  // Can't go before current month
  const canGoPrev = !(viewYear === new Date().getFullYear() && viewMonth === new Date().getMonth());

  return (
    <div className={`drp-wrapper drp-${variant}`} ref={wrapperRef}>
      {/* Trigger Bar */}
      <div className="drp-trigger" onClick={handleOpen}>
        <div className="drp-trigger-section">
          <svg className="drp-trigger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <div className="drp-trigger-text">
            <span className="drp-trigger-label">Check-In</span>
            <span className={`drp-trigger-date ${!checkInDate ? 'placeholder' : ''}`}>
              {checkInDate ? formatDisplay(checkInDate) : 'Select Date'}
            </span>
          </div>
        </div>
        <div className="drp-trigger-divider" />
        <div className="drp-trigger-section">
          <svg className="drp-trigger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <div className="drp-trigger-text">
            <span className="drp-trigger-label">Check-Out</span>
            <span className={`drp-trigger-date ${!checkOutDate ? 'placeholder' : ''}`}>
              {checkOutDate ? formatDisplay(checkOutDate) : 'Select Date'}
            </span>
          </div>
        </div>
      </div>

      {/* Calendar Popup */}
      {isOpen && (
        <>
          <div className="drp-backdrop" onClick={() => setIsOpen(false)} />
          <div className={`drp-popup drp-popup-${direction}`}>
            <div className="drp-step-label">
              {step === 'checkin' ? 'Select Check-In Date' : 'Select Check-Out Date'}
            </div>
            <div className="drp-calendar-container">
              <button
                className="drp-nav drp-nav-prev"
                onClick={goToPrev}
                disabled={!canGoPrev}
                type="button"
              >
                ‹
              </button>
              <div className="drp-months">
                {renderMonth(viewYear, viewMonth)}
                {renderMonth(year2, month2)}
              </div>
              <button className="drp-nav drp-nav-next" onClick={goToNext} type="button">
                ›
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
