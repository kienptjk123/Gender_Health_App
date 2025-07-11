import { useEffect, useState } from "react";
import { Animated, View } from "react-native";
import Svg, { Circle, Defs, G, RadialGradient, Stop } from "react-native-svg";

interface ChartDay {
  day: number;
  color: string;
  isCurrent: boolean;
}

interface CycleChartProps {
  chartData: ChartDay[];
  size?: number;
  strokeWidth?: number;
  showLabels?: boolean;
  showCenter?: boolean;
  animated?: boolean;
}

export default function CycleChart({
  chartData,
  size = 280,
  strokeWidth = 16,
  showLabels = true,
  showCenter = true,
  animated = true,
}: CycleChartProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [animationValue] = useState(new Animated.Value(0));

  const radius = (size - strokeWidth * 2) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const totalDays = chartData.length;

  useEffect(() => {
    if (animated) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }).start();
    }
  }, [animated, animationValue]);

  const getArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(" ");
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const getCurrentDay = () => {
    return chartData.find((day) => day.isCurrent);
  };

  const currentDay = getCurrentDay();

  return (
    <View className="items-center justify-center my-4 ">
      {/* Main Chart */}
      <Svg height={size} width={size}>
        <Defs>
          <RadialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#f8fafc" stopOpacity="1" />
            <Stop offset="100%" stopColor="#e2e8f0" stopOpacity="1" />
          </RadialGradient>
        </Defs>

        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Chart segments */}
        <G rotation="-90" origin={`${center}, ${center}`}>
          {chartData.map((item, index) => {
            const segmentAngle = 360 / totalDays;
            const startAngle = index * segmentAngle;
            const endAngle = (index + 1) * segmentAngle;
            const offset = circumference * (index / totalDays);

            const isSelected = selectedDay === item.day;
            const isCurrentDay = item.isCurrent;

            let strokeColor = item.color;
            let currentStrokeWidth = strokeWidth;

            if (isCurrentDay) {
              strokeColor = item.color;
              currentStrokeWidth = strokeWidth + 4;
            } else if (isSelected) {
              currentStrokeWidth = strokeWidth + 2;
            }

            return (
              <Circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                stroke={strokeColor}
                strokeWidth={currentStrokeWidth}
                strokeDasharray={`${
                  circumference / totalDays
                }, ${circumference}`}
                strokeDashoffset={-offset}
                fill="none"
                opacity={isSelected || isCurrentDay ? 1 : 0.8}
                strokeLinecap="round"
              />
            );
          })}
        </G>

        {/* Current day indicator */}
        {currentDay && (
          <G rotation="-90" origin={`${center}, ${center}`}>
            <Circle
              cx={center + radius}
              cy={center}
              r={6}
              fill="#ffffff"
              stroke={currentDay.color}
              strokeWidth={3}
              transform={`rotate(${
                (chartData.findIndex((d) => d.isCurrent) * 360) / totalDays
              }, ${center}, ${center})`}
            />
          </G>
        )}

        {/* Center circle */}
        {showCenter && (
          <Circle
            cx={center}
            cy={center}
            r={radius - strokeWidth - 10}
            fill="url(#centerGradient)"
            stroke="#e2e8f0"
            strokeWidth={2}
          />
        )}
      </Svg>
    </View>
  );
}
