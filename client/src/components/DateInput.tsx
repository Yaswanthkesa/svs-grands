import { useRef } from 'react';
import { formatDate } from '../utils/formatDate';

interface DateInputProps {
  value: string;            // yyyy-mm-dd (internal)
  onChange: (val: string) => void;
  min?: string;
  max?: string;
  required?: boolean;
  className?: string;
  label?: string;
}

/**
 * Premium date input that always displays "Thu, Apr 16, 2026" format
 * regardless of browser locale. Clicking opens the native calendar picker.
 */
export default function DateInput({ value, onChange, min, max, required, className, label }: DateInputProps) {
  const dateRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    if (dateRef.current) {
      dateRef.current.showPicker?.();
      dateRef.current.focus();
    }
  };

  return (
    <div className={`date-input-wrapper ${className || ''}`} onClick={openPicker}>
      <span className={`date-input-display ${!value ? 'placeholder' : ''}`}>
        {value ? formatDate(value) : (label || 'Select Date')}
      </span>
      {/* Hidden native date input for calendar popup */}
      <input
        ref={dateRef}
        type="date"
        className="date-input-native"
        value={value}
        min={min}
        max={max}
        required={required}
        onChange={e => onChange(e.target.value)}
        tabIndex={-1}
      />
      <svg className="date-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    </div>
  );
}
