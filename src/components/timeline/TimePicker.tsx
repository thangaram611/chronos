import { memo, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { WheelPicker } from '@/components/ui/wheel-picker';

interface TimePickerProps {
  /** Selected time in hours (0-23) and minutes (0-59) */
  value: { hours: number; minutes: number };
  /** Handler when time changes */
  onChange: (value: { hours: number; minutes: number }) => void;
  /** Minute step (default: 15) */
  minuteStep?: number;
  /** Additional class name */
  className?: string;
}

/**
 * TimePicker component
 * iOS-style wheel picker for selecting time
 */
export const TimePicker = memo(function TimePicker({
  value,
  onChange,
  minuteStep = 15,
  className,
}: TimePickerProps) {
  // Convert 24-hour to 12-hour format
  const hours12 = value.hours === 0 ? 12 : value.hours > 12 ? value.hours - 12 : value.hours;
  const period = value.hours >= 12 ? 'PM' : 'AM';

  // Generate options
  const hourOptions = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
  }, []);

  const minuteOptions = useMemo(() => {
    const options: number[] = [];
    for (let i = 0; i < 60; i += minuteStep) {
      options.push(i);
    }
    return options;
  }, [minuteStep]);

  const periodOptions = useMemo((): ('AM' | 'PM')[] => ['AM', 'PM'], []);

  /**
   * Handle hour change
   */
  const handleHourChange = useCallback(
    (newHour12: number) => {
      let newHour24 = newHour12;

      if (period === 'AM') {
        newHour24 = newHour12 === 12 ? 0 : newHour12;
      } else {
        newHour24 = newHour12 === 12 ? 12 : newHour12 + 12;
      }

      onChange({ hours: newHour24, minutes: value.minutes });
    },
    [period, value.minutes, onChange]
  );

  /**
   * Handle minute change
   */
  const handleMinuteChange = useCallback(
    (newMinutes: number) => {
      onChange({ hours: value.hours, minutes: newMinutes });
    },
    [value.hours, onChange]
  );

  /**
   * Handle period (AM/PM) change
   */
  const handlePeriodChange = useCallback(
    (newPeriod: 'AM' | 'PM') => {
      let newHour24 = value.hours;

      if (newPeriod === 'AM' && value.hours >= 12) {
        newHour24 = value.hours - 12;
      } else if (newPeriod === 'PM' && value.hours < 12) {
        newHour24 = value.hours + 12;
      }

      onChange({ hours: newHour24, minutes: value.minutes });
    },
    [value.hours, value.minutes, onChange]
  );

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-1',
        className
      )}
    >
      {/* Hour picker */}
      <WheelPicker
        options={hourOptions}
        value={hours12}
        onChange={handleHourChange}
        renderOption={(hour, isSelected) => (
          <span className={cn('text-lg', isSelected && 'font-bold')}>
            {hour}
          </span>
        )}
        getOptionKey={(hour) => hour.toString()}
        className="w-16"
        ariaLabel="Hour"
      />

      {/* Separator */}
      <span className="text-2xl font-bold text-muted-foreground">:</span>

      {/* Minute picker */}
      <WheelPicker
        options={minuteOptions}
        value={value.minutes}
        onChange={handleMinuteChange}
        renderOption={(minute, isSelected) => (
          <span className={cn('text-lg', isSelected && 'font-bold')}>
            {minute.toString().padStart(2, '0')}
          </span>
        )}
        getOptionKey={(minute) => minute.toString()}
        className="w-16"
        ariaLabel="Minute"
      />

      {/* AM/PM picker */}
      <WheelPicker
        options={periodOptions}
        value={period}
        onChange={handlePeriodChange}
        renderOption={(p, isSelected) => (
          <span className={cn('text-base', isSelected && 'font-bold')}>
            {p}
          </span>
        )}
        getOptionKey={(p) => p}
        className="w-14"
        ariaLabel="AM or PM"
      />
    </div>
  );
});

/**
 * Compact time display
 */
export const TimeDisplay = memo(function TimeDisplay({
  value,
  className,
}: {
  value: { hours: number; minutes: number };
  className?: string;
}) {
  const hours12 = value.hours === 0 ? 12 : value.hours > 12 ? value.hours - 12 : value.hours;
  const period = value.hours >= 12 ? 'PM' : 'AM';
  const formattedMinutes = value.minutes.toString().padStart(2, '0');

  return (
    <span className={cn('font-medium', className)}>
      {hours12}:{formattedMinutes} {period}
    </span>
  );
});

export default TimePicker;
