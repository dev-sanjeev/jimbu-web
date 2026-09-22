import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { Transaction } from '@/interfaces/Transaction';
import { Text } from '@/shared/Text';
import { area, curveMonotoneX, line } from 'd3-shape';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface Props {
  transactions: Transaction[];
  month: Date;
}

const CHART_HEIGHT = 120;
const PADDING_TOP = 10;
const PADDING_BOTTOM = 6;

interface ChartPoint {
  x: number;
  y: number;
  day: number;
  amount: number;
}

const daysInMonth = (month: Date) =>
  new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

export default function MonthSpendAreaChart({ transactions, month }: Props) {
  const theme = useCurrentTheme();
  const accent = theme.colors.accent;

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      if (w > 0) setWidth(w);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { dailyTotals, maxTotal, totalDays, todayDay, hasAnyData } =
    useMemo(() => {
      const total = daysInMonth(month);
      const totals = new Array<number>(total).fill(0);

      for (const tx of transactions) {
        if (tx.type !== 'expense') continue;
        const date = new Date(tx.createdAt);
        if (
          date.getFullYear() === month.getFullYear() &&
          date.getMonth() === month.getMonth()
        ) {
          const day = date.getDate();
          totals[day - 1] += Number(tx.amount) || 0;
        }
      }

      const now = new Date();
      const isCurrentMonth =
        now.getFullYear() === month.getFullYear() &&
        now.getMonth() === month.getMonth();

      const sum = totals.reduce((a, b) => a + b, 0);

      return {
        dailyTotals: totals,
        maxTotal: Math.max(...totals, 1),
        totalDays: total,
        todayDay: isCurrentMonth ? now.getDate() : null,
        hasAnyData: sum > 0,
      };
    }, [transactions, month]);

  const activeDay = selectedDay ?? todayDay ?? totalDays;

  const points = useMemo<ChartPoint[]>(() => {
    if (width === 0) return [];
    const innerHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
    return dailyTotals.map((amount, i) => {
      const x = ((i + 0.5) / totalDays) * width;
      const y = PADDING_TOP + (1 - amount / maxTotal) * innerHeight;
      return { x, y, day: i + 1, amount };
    });
  }, [dailyTotals, maxTotal, totalDays, width]);

  const { solidPath, dashedPath, areaPath, hasDashed } = useMemo(() => {
    if (points.length === 0) {
      return { solidPath: '', dashedPath: '', areaPath: '', hasDashed: false };
    }

    const lineGen = line<ChartPoint>().x((d) => d.x).y((d) => d.y).curve(curveMonotoneX);
    const areaGen = area<ChartPoint>()
      .x((d) => d.x)
      .y0(CHART_HEIGHT - PADDING_BOTTOM)
      .y1((d) => d.y)
      .curve(curveMonotoneX);

    if (todayDay === null) {
      return {
        solidPath: lineGen(points) ?? '',
        dashedPath: '',
        areaPath: areaGen(points) ?? '',
        hasDashed: false,
      };
    }

    const todayIdx = Math.min(todayDay - 1, points.length - 1);
    const solidPts = points.slice(0, todayIdx + 1);
    const todayY = points[todayIdx].y;
    const dashedPts = points.slice(todayIdx).map((p) => ({ ...p, y: todayY }));

    return {
      solidPath: lineGen(solidPts) ?? '',
      dashedPath: dashedPts.length > 1 ? (lineGen(dashedPts) ?? '') : '',
      areaPath: areaGen(solidPts) ?? '',
      hasDashed: dashedPts.length > 1,
    };
  }, [points, todayDay]);

  const activePoint = points[activeDay - 1];

  const setActiveByX = useCallback(
    (clientX: number) => {
      if (!containerRef.current || width === 0 || totalDays <= 1) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const cellWidth = width / totalDays;
      const ratio = Math.max(0, Math.min(1, (x - cellWidth / 2) / (width - cellWidth)));
      const dayIndex = Math.round(ratio * (totalDays - 1));
      setSelectedDay(dayIndex + 1);
      navigator.vibrate?.(10);
    },
    [width, totalDays],
  );

  const labelDays = useMemo(() => new Set<number>([1, 8, 15, 22, totalDays]), [totalDays]);
  const showActiveLabel = hasAnyData && activePoint && (selectedDay !== null || todayDay !== null);

  return (
    <>
      <div className="px-2">
        {showActiveLabel && (
          <Text variant="caption" className="text-muted-foreground">
            Day {activeDay}: ${activePoint.amount.toFixed(2)}
          </Text>
        )}
      </div>

      <div
        ref={containerRef}
        style={{ height: CHART_HEIGHT, position: 'relative', touchAction: 'none' }}
        onPointerDown={(e) => { (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId); setActiveByX(e.clientX); }}
        onPointerMove={(e) => { if (e.buttons > 0) setActiveByX(e.clientX); }}
      >
        {width > 0 && (
          hasAnyData ? (
            <svg width={width} height={CHART_HEIGHT} style={{ display: 'block' }}>
              <defs>
                <linearGradient id="msac-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={accent} stopOpacity={0.25} />
                  <stop offset="1" stopColor={accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              {areaPath ? <path d={areaPath} fill="url(#msac-area)" /> : null}
              {solidPath ? (
                <path d={solidPath} stroke={accent} strokeWidth={2} fill="none" />
              ) : null}
              {dashedPath ? (
                <path d={dashedPath} stroke={accent} strokeWidth={2} strokeDasharray="4 4" strokeOpacity={0.5} fill="none" />
              ) : null}
              {activePoint && (
                <>
                  <circle cx={activePoint.x} cy={activePoint.y} r={10} fill={accent} fillOpacity={0.18} />
                  <circle cx={activePoint.x} cy={activePoint.y} r={5} fill={accent} />
                </>
              )}
            </svg>
          ) : (
            <div className="flex items-center justify-center" style={{ height: CHART_HEIGHT }}>
              <Text variant="caption" className="text-muted-foreground">
                No spending recorded yet this month
              </Text>
            </div>
          )
        )}
      </div>

      <div className="flex flex-row justify-between mt-2">
        {dailyTotals.map((_, idx) => {
          const day = idx + 1;
          const showLabel = labelDays.has(day);
          const isActive = hasAnyData && day === activeDay;
          return (
            <div key={day} className="flex flex-row">
              {showLabel ? (
                <Text variant="caption" className={isActive ? 'text-accent' : 'text-muted-foreground'}>
                  {day}
                </Text>
              ) : null}
            </div>
          );
        })}
      </div>

      {hasDashed && (
        <div className="mt-2 flex items-center justify-center">
          <Text variant="caption" className="text-muted-foreground">
            Dashed = future days
          </Text>
        </div>
      )}
    </>
  );
}
