import { DayPicker, DayPickerProps } from 'react-day-picker';

export default function AppCalendar(props: DayPickerProps) {
  return (
    <DayPicker
      {...props}
      classNames={{
        root: 'p-3',
        months: 'flex flex-col gap-4',
        month: 'flex flex-col gap-2',
        month_caption: 'flex items-center justify-between px-1 mb-1',
        caption_label: 'text-body font-semibold text-foreground',
        nav: 'flex items-center gap-1',
        button_previous:
          'w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent-subtle text-muted-foreground cursor-pointer border-0 bg-transparent',
        button_next:
          'w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent-subtle text-muted-foreground cursor-pointer border-0 bg-transparent',
        chevron: 'fill-muted-foreground',
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday: 'w-9 text-center text-caption font-medium text-muted-foreground py-1',
        weeks: 'flex flex-col gap-1',
        week: 'flex w-full',
        day: 'w-9 h-9 flex items-center justify-center',
        day_button:
          'w-9 h-9 flex items-center justify-center rounded-full text-body text-foreground hover:bg-accent-subtle cursor-pointer border-0 bg-transparent',
        selected:
          'bg-accent-subtle text-accent font-semibold rounded-full border border-accent [&>button]:text-accent [&>button]:font-semibold',
        today: '[&>button]:text-accent [&>button]:font-semibold',
        disabled: '[&>button]:text-muted-foreground [&>button]:opacity-40 [&>button]:cursor-not-allowed',
        outside: 'opacity-30',
      }}
    />
  );
}
