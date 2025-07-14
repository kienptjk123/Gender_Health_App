import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";

export default function StepItem({
  index,
  currentStepIndex,
  icon,
  label,
  description,
  time,
}: any) {
  const isFullyCompleted = currentStepIndex === -1; // trạng thái cuối: RESULT_AVAILABLE
  const isCompleted = index < currentStepIndex || isFullyCompleted;
  const isCurrent = index === currentStepIndex && !isFullyCompleted;

  return (
    <View className="flex-1 items-center px-1" style={{ minHeight: 190 }}>
      <View
        className={clsx(
          "w-10 h-10 rounded-full items-center justify-center",
          isCompleted
            ? "bg-pink-500"
            : isCurrent
            ? "border border-pink-500 bg-white"
            : "bg-gray-200"
        )}
      >
        <Ionicons
          name={icon}
          size={20}
          color={isCompleted ? "white" : isCurrent ? "#ec4899" : "#9ca3af"}
        />
      </View>

      <View className="mt-2 items-center" style={{ minHeight: 130 }}>
        <Text
          className={clsx(
            "text-sm font-semibold text-center min-h-[60px]",
            isCompleted
              ? "text-pink-600"
              : isCurrent
              ? "text-pink-600"
              : "text-gray-400"
          )}
        >
          {label}
        </Text>
        <Text className="text-xs text-gray-400 text-center min-h-[80px] px-1">
          {description}
        </Text>

        <View className="mt-1 mb-1 min-h-[24px]">
          {isCompleted && !isCurrent && (
            <View className="flex-row items-center justify-center">
              <Ionicons name="checkmark-circle" size={14} color="#ec4899" />
              <Text className="ml-1 text-xs text-pink-600">Completed</Text>
            </View>
          )}
          {isCurrent && (
            <View className="flex-row items-center justify-center">
              <Ionicons name="hourglass" size={14} color="#3b82f6" />
              <Text className="ml-1 text-xs text-blue-500">Current</Text>
            </View>
          )}
        </View>

        <Text className="text-[11px] text-gray-400 text-center">
          {time || "\u00A0"}
        </Text>
      </View>
    </View>
  );
}
