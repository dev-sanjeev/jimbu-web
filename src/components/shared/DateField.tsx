import { useRef, useState } from 'react';
import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
import { Calendar, ChevronDown } from 'lucide-react';
import AppCalendar from './AppCalendar';

interface Props {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
  error?: string;
}

// Approximate rendered height of the calendar popover in px
const CALENDAR_HEIGHT = 320;

const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export default function DateField({
  label,
  value,
  onChange,
  maximumDate,
  minimumDate,
  error,
}: Props) {
  const [open, setOpen] = useState(false);
  const [flipUp, setFlipUp] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const icon = useIconColors();

  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setFlipUp(spaceBelow < CALENDAR_HEIGHT + 16);
    }
    setOpen((o) => !o);
  };

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setOpen(false);
    }
  };

  const disabledMatchers = [
    ...(maximumDate ? [{ after: maximumDate }] : []),
    ...(minimumDate ? [{ before: minimumDate }] : []),
  ];

  return (
    <div className="flex flex-col gap-2">
      <Text variant="label" className="font-semibold text-foreground">
        {label}
      </Text>

      <div ref={wrapperRef} className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={handleOpen}
          className="flex flex-row items-center h-input px-4 gap-3 rounded-lg bg-card border border-subtle-border cursor-pointer w-full text-left"
        >
          <Calendar size={18} color={icon.muted} />
          <Text variant="body" className="flex-1 text-foreground">
            {formatDate(value)}
          </Text>
          <ChevronDown size={16} color={icon.subtle} />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div
              className={`absolute left-0 z-50 bg-card border border-subtle-border rounded-xl shadow-card overflow-hidden ${
                flipUp ? 'bottom-full mb-2' : 'top-full mt-2'
              }`}
            >
              <AppCalendar
                mode="single"
                selected={value}
                onSelect={handleSelect}
                disabled={disabledMatchers.length ? disabledMatchers : undefined}
                defaultMonth={value}
              />
            </div>
          </>
        )}
      </div>

      {error ? (
        <Text variant="caption" className="text-destructive pl-1">
          {error}
        </Text>
      ) : null}
    </div>
  );
}
