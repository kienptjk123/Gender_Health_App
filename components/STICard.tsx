import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import dayjs from "dayjs";
import StepItem from "./StepItem";
import MedicalReportModal from "./MedicalReportModal";

const steps = [
  {
    label: "PSC Visit",
    icon: "walk-outline",
    description: "Visit Patient Service Center",
  },
  {
    label: "Sample Collection",
    icon: "flask-outline",
    description: "Sample collected for testing",
  },
  {
    label: "Report Generation",
    icon: "document-text-outline",
    description: "Test report generated",
  },
  {
    label: "Results Available",
    icon: "checkmark-done-outline",
    description: "Results ready for viewing",
  },
];

const getCardBg = (status: string) => {
  switch (status) {
    case "WAITING_FOR_PSC_VISIT":
      return "bg-yellow-50";
    case "REPORT_READY":
      return "bg-blue-50";
    case "RESULT_AVAILABLE":
      return "bg-green-50";
    default:
      return "bg-gray-50";
  }
};

const getCurrentStepIndex = (item: any) => {
  if (!item.pscVisited) return 0;
  if (!item.collectedDate) return 1;
  if (!item.reportDate) return 2;
  if (!item.resultAvailable) return 3;
  return -1; // tất cả đã completed
};

export default function StiCard({ item }: { item: any }) {
  const [showMedicalReport, setShowMedicalReport] = useState(false);

  if (!item) return null;

  const currentStepIndex = getCurrentStepIndex(item);

  return (
    <View
      className={clsx(
        "relative rounded-xl p-4 border mb-4",
        getCardBg(item.status)
      )}
    >
      {/* Badge status */}
      <View className="absolute top-4 right-4">
        <Text
          className={clsx(
            "text-xs font-medium px-3 py-1 rounded-full text-white",
            item.status === "WAITING_FOR_PSC_VISIT"
              ? "bg-yellow-500"
              : item.status === "REPORT_READY"
              ? "bg-blue-500"
              : item.status === "RESULT_AVAILABLE"
              ? "bg-green-500"
              : "bg-gray-500"
          )}
        >
          {item.status
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (c: string) => c.toUpperCase())}
        </Text>
      </View>

      {/* Header */}
      <Text className="font-bold text-lg mb-2">{item.name}</Text>
      <Text className="text-xs text-gray-500 mb-2">
        Ordered by: {item.orderItem?.order?.customerProfile?.name} on{" "}
        {dayjs(item.createdAt).format("ddd, MMM D, HH:mm")}
      </Text>

      {/* Progress Line */}
      <View className="mt-6 px-2">
        <View className="absolute top-5 left-6 right-6 h-0.5 bg-gray-200" />
        <View
          className="absolute top-5 left-6 h-0.5 bg-pink-500"
          style={{
            width:
              currentStepIndex === -1
                ? "100%"
                : `${((currentStepIndex + 1) / steps.length) * 100}%`,
          }}
        />
        <View className="flex-row justify-between items-start">
          {steps.map((s, i) => (
            <StepItem
              key={i}
              index={i}
              currentStepIndex={currentStepIndex}
              icon={s.icon}
              label={s.label}
              description={s.description}
              time={
                i === 0
                  ? item.pscVisited &&
                    dayjs(item.pscVisited).format("ddd, MMM D, HH:mm")
                  : i === 1
                  ? item.collectedDate &&
                    dayjs(item.collectedDate).format("ddd, MMM D, HH:mm")
                  : i === 2
                  ? item.reportDate &&
                    dayjs(item.reportDate).format("ddd, MMM D, HH:mm")
                  : i === 3
                  ? item.resultAvailable &&
                    dayjs(item.resultAvailable).format("ddd, MMM D, HH:mm")
                  : undefined
              }
            />
          ))}
        </View>
      </View>

      {/* View Result Button */}
      {item.status === "RESULT_AVAILABLE" && (
        <View className="mt-4 pt-4 border-t border-gray-200">
          <TouchableOpacity
            className="bg-pink-500 py-3 px-4 rounded-lg flex-row items-center justify-center"
            onPress={() => setShowMedicalReport(true)}
          >
            <Ionicons name="document-text" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">View Result</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Medical Report Modal */}
      <MedicalReportModal
        visible={showMedicalReport}
        onClose={() => setShowMedicalReport(false)}
        stiTrackingId={item.id}
        patientName={item.orderItem?.order?.customerProfile?.name || "Patient"}
        testName={item.name}
        resultDate={item.resultAvailable}
      />
    </View>
  );
}
