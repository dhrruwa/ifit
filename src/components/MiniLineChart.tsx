import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line as SvgLine, Polyline, Text as SvgText } from 'react-native-svg';

import { colors } from '@/theme';

export interface ChartPoint {
  value: number;
  label: string;
}

/**
 * Lightweight line chart built directly on react-native-svg (no native
 * gradient dependency). Renders nothing for < 2 points.
 */
export function MiniLineChart({
  data,
  height = 150,
  color = colors.accent,
  suffix = '',
}: {
  data: ChartPoint[];
  height?: number;
  color?: string;
  suffix?: string;
}) {
  const [w, setW] = useState(0);

  if (data.length < 2) return null;

  const padL = 36;
  const padR = 12;
  const padT = 12;
  const padB = 22;

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const innerW = Math.max(0, w - padL - padR);
  const innerH = height - padT - padB;

  const xFor = (i: number) =>
    padL + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const yFor = (v: number) => padT + innerH - ((v - min) / range) * innerH;

  const points = data.map((d, i) => `${xFor(i)},${yFor(d.value)}`).join(' ');
  const midIdx = Math.floor((data.length - 1) / 2);

  return (
    <View style={{ height }} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      {w > 0 && (
        <Svg width={w} height={height}>
          {/* baseline */}
          <SvgLine
            x1={padL}
            y1={padT + innerH}
            x2={w - padR}
            y2={padT + innerH}
            stroke={colors.border}
            strokeWidth={1}
          />
          {/* y-axis min / max labels */}
          <SvgText x={padL - 6} y={padT + 4} fill={colors.textFaint} fontSize={10} textAnchor="end">
            {Math.round(max)}
            {suffix}
          </SvgText>
          <SvgText
            x={padL - 6}
            y={padT + innerH + 3}
            fill={colors.textFaint}
            fontSize={10}
            textAnchor="end">
            {Math.round(min)}
            {suffix}
          </SvgText>
          {/* the line */}
          <Polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* data points */}
          {data.map((d, i) => (
            <Circle key={i} cx={xFor(i)} cy={yFor(d.value)} r={3} fill={color} />
          ))}
          {/* x-axis labels: first, middle, last */}
          {data.map((d, i) =>
            i === 0 || i === data.length - 1 || i === midIdx ? (
              <SvgText
                key={`l${i}`}
                x={xFor(i)}
                y={height - 6}
                fill={colors.textFaint}
                fontSize={9}
                textAnchor="middle">
                {d.label}
              </SvgText>
            ) : null
          )}
        </Svg>
      )}
    </View>
  );
}
