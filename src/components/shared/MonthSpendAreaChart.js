import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { Text } from '@/shared/Text';
import { area, curveMonotoneX, line } from 'd3-shape';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
const CHART_HEIGHT = 120;
const PADDING_TOP = 10;
const PADDING_BOTTOM = 6;
const daysInMonth = (month) => new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
export default function MonthSpendAreaChart({ transactions, month }) {
    const theme = useCurrentTheme();
    const accent = theme.colors.accent;
    const containerRef = useRef(null);
    const [width, setWidth] = useState(0);
    const [selectedDay, setSelectedDay] = useState(null);
    useEffect(() => {
        const el = containerRef.current;
        if (!el)
            return;
        const obs = new ResizeObserver((entries) => {
            const w = entries[0]?.contentRect.width ?? 0;
            if (w > 0)
                setWidth(w);
        });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    const { dailyTotals, maxTotal, totalDays, todayDay, hasAnyData } = useMemo(() => {
        const total = daysInMonth(month);
        const totals = new Array(total).fill(0);
        for (const tx of transactions) {
            if (tx.type !== 'expense')
                continue;
            const date = new Date(tx.createdAt);
            if (date.getFullYear() === month.getFullYear() &&
                date.getMonth() === month.getMonth()) {
                const day = date.getDate();
                totals[day - 1] += Number(tx.amount) || 0;
            }
        }
        const now = new Date();
        const isCurrentMonth = now.getFullYear() === month.getFullYear() &&
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
    const points = useMemo(() => {
        if (width === 0)
            return [];
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
        const lineGen = line().x((d) => d.x).y((d) => d.y).curve(curveMonotoneX);
        const areaGen = area()
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
    const setActiveByX = useCallback((clientX) => {
        if (!containerRef.current || width === 0 || totalDays <= 1)
            return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const cellWidth = width / totalDays;
        const ratio = Math.max(0, Math.min(1, (x - cellWidth / 2) / (width - cellWidth)));
        const dayIndex = Math.round(ratio * (totalDays - 1));
        setSelectedDay(dayIndex + 1);
        navigator.vibrate?.(10);
    }, [width, totalDays]);
    const labelDays = useMemo(() => new Set([1, 8, 15, 22, totalDays]), [totalDays]);
    const showActiveLabel = hasAnyData && activePoint && (selectedDay !== null || todayDay !== null);
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "px-2", children: showActiveLabel && (_jsxs(Text, { variant: "caption", className: "text-muted-foreground", children: ["Day ", activeDay, ": $", activePoint.amount.toFixed(2)] })) }), _jsx("div", { ref: containerRef, style: { height: CHART_HEIGHT, position: 'relative', touchAction: 'none' }, onPointerDown: (e) => { e.currentTarget.setPointerCapture(e.pointerId); setActiveByX(e.clientX); }, onPointerMove: (e) => { if (e.buttons > 0)
                    setActiveByX(e.clientX); }, children: width > 0 && (hasAnyData ? (_jsxs("svg", { width: width, height: CHART_HEIGHT, style: { display: 'block' }, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "msac-area", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0", stopColor: accent, stopOpacity: 0.25 }), _jsx("stop", { offset: "1", stopColor: accent, stopOpacity: 0 })] }) }), areaPath ? _jsx("path", { d: areaPath, fill: "url(#msac-area)" }) : null, solidPath ? (_jsx("path", { d: solidPath, stroke: accent, strokeWidth: 2, fill: "none" })) : null, dashedPath ? (_jsx("path", { d: dashedPath, stroke: accent, strokeWidth: 2, strokeDasharray: "4 4", strokeOpacity: 0.5, fill: "none" })) : null, activePoint && (_jsxs(_Fragment, { children: [_jsx("circle", { cx: activePoint.x, cy: activePoint.y, r: 10, fill: accent, fillOpacity: 0.18 }), _jsx("circle", { cx: activePoint.x, cy: activePoint.y, r: 5, fill: accent })] }))] })) : (_jsx("div", { className: "flex items-center justify-center", style: { height: CHART_HEIGHT }, children: _jsx(Text, { variant: "caption", className: "text-muted-foreground", children: "No spending recorded yet this month" }) }))) }), _jsx("div", { className: "flex flex-row justify-between mt-2", children: dailyTotals.map((_, idx) => {
                    const day = idx + 1;
                    const showLabel = labelDays.has(day);
                    const isActive = hasAnyData && day === activeDay;
                    return (_jsx("div", { className: "flex flex-row", children: showLabel ? (_jsx(Text, { variant: "caption", className: isActive ? 'text-accent' : 'text-muted-foreground', children: day })) : null }, day));
                }) }), hasDashed && (_jsx("div", { className: "mt-2 flex items-center justify-center", children: _jsx(Text, { variant: "caption", className: "text-muted-foreground", children: "Dashed = future days" }) }))] }));
}
