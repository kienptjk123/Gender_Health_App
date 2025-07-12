import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { authService } from "@/apis/auth";
import { menstrualApi } from "@/apis/menstrual.api";
import { useCycle } from "@/hooks/useCycleChartData";
import { Prediction } from "@/models/MenstrualModels/summary.type";
import CycleChart from "./CycleChart";

interface SummaryProps {
  menstrualCycleId: number;
  userId: string;
  onReset: () => Promise<void>;
}

export default function SummaryScreen({ onReset }: SummaryProps) {
  const [predictionData, setPredictionData] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const profileRes = await authService.getUserProfile();
      const profileId = profileRes.result?.id;
      const res = await menstrualApi.getPrediction(profileId);
      setPredictionData(res);
    } catch (error) {
      console.error("❌ Failed to load prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  const cycle = useCycle(predictionData);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#ec4899" />
        <Text className="text-gray-500 mt-2">Loading summary...</Text>
      </SafeAreaView>
    );
  }

  if (!predictionData) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-600 text-lg">No prediction data found.</Text>
        <TouchableOpacity
          onPress={fetchPrediction}
          className="mt-4 bg-pink-500 px-4 py-2 rounded-full"
        >
          <Text className="text-white font-medium">Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-rose-50">
      <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className="text-2xl font-semibold mb-8 text-center text-rose-500">
          Your Cycle Overview
        </Text>

        <View className="items-center justify-center mb-6">
          <View className="w-64 h-64 items-center justify-center">
            {/* Chart vòng tròn */}
            <CycleChart chartData={cycle.chartData} />

            {/* Text ở giữa */}
            <View className="absolute items-center justify-center">
              <Text className="text-3xl font-bold text-pink-600">
                {getDaysLeft(predictionData.data.prediction.predictedStartDate)}{" "}
                days
              </Text>
              <Text className="text-base text-gray-500">until next period</Text>
              <Text className="text-base text-pink-500 mt-1">
                {formatDate(predictionData.data.prediction.predictedStartDate)}
              </Text>
            </View>
          </View>
        </View>
        {/* Cycle Phases Display */}
        <View className="mt-2">
          <View className="flex-row flex-wrap justify-between">
            {Object.values(cycle.phases).map((phase, idx) => (
              <View
                key={idx}
                className="w-[48%] bg-white rounded-xl p-3 mb-3 border border-gray-100"
              >
                <View className="flex-row items-center mb-1">
                  <View
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: phase.color }}
                  />
                  <Text className="text-base font-medium text-gray-800">
                    {phase.name}
                  </Text>
                </View>
                <Text className="text-sm text-gray-600">
                  {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Three Info Cards */}
        <View className="rounded-2xl overflow-hidden mt-4 mb-4">
          <GradientCard
            icon="time-outline"
            title="Next Period"
            value={`${getDaysLeft(
              predictionData.data.prediction.predictedStartDate
            )} days`}
            subtitle={formatDate(
              predictionData.data.prediction.predictedStartDate
            )}
          />
        </View>
        <View className="rounded-2xl overflow-hidden mb-4">
          <GradientCard
            icon="female"
            title="Fertility"
            value={`${predictionData.data.pregnancyAbility.pregnancyPercent}% chance`}
            subtitle={`${formatDate(
              predictionData.data.pregnancyAbility.fertileWindowStart
            )} - ${formatDate(
              predictionData.data.pregnancyAbility.fertileWindowEnd
            )}`}
          />
        </View>
        <View className="rounded-2xl overflow-hidden mb-4">
          <GradientCard
            icon="calendar"
            title="Cycle Length"
            value={`${predictionData.data.prediction.cycleLength} days`}
            subtitle="Avg based on history"
          />
        </View>

        {/* Detail Grid Boxes */}
        <View className="flex-row flex-wrap justify-between mt-4">
          <DetailCard
            title="Next Period"
            value={formatDate(
              predictionData.data.prediction.predictedStartDate
            )}
            label="Start Date"
          />
          <DetailCard
            title="End of Period"
            value={formatDate(predictionData.data.prediction.predictedEndDate)}
            label="End Date"
          />
          <DetailCard
            title="Fertile Window"
            value={formatDate(
              predictionData.data.pregnancyAbility.fertileWindowStart
            )}
            label="Window Start"
          />
          <DetailCard
            title="Fertile Window"
            value={formatDate(
              predictionData.data.pregnancyAbility.fertileWindowEnd
            )}
            label="Window End"
          />
        </View>

        {/* Reset Button */}
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Reset Cycle", "Do you want to start over?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Yes",
                onPress: async () => {
                  await onReset();
                  fetchPrediction();
                },
              },
            ])
          }
          className="mt-8 bg-red-100 rounded-full py-3 px-6 mx-auto"
        >
          <Text className="text-red-500 text-center font-semibold">
            Reset Cycle
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toDateString().slice(4); // e.g. "Jul 19 2025"
};

const getDaysLeft = (futureDateStr: string) => {
  const future = new Date(futureDateStr).getTime();
  const now = new Date().getTime();
  const diff = Math.ceil((future - now) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

function GradientCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: any;
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <LinearGradient
      colors={["#ec4899", "#f472b6"]}
      className="rounded-2xl shadow-md"
    >
      <View className="flex-row justify-between items-center p-4">
        <View className="flex-1 pr-3">
          <View className="flex-row items-center mb-1 mr-2">
            <Ionicons name={getIconByTitle(title)} size={16} color="white" />
            <Text className="text-white text-sm font-medium ml-1">{title}</Text>
          </View>

          <Text className="text-white text-2xl font-bold">{value}</Text>
          <Text className="text-white text-sm mt-0.5">{subtitle}</Text>
        </View>

        <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center">
          <Ionicons name={icon} size={30} color="white" />
        </View>
      </View>
    </LinearGradient>
  );
}

const getIconByTitle = (title: string) => {
  switch (title) {
    case "Next Period":
      return "arrow-down-circle";
    case "Fertility":
      return "accessibility";
    case "Cycle Length":
      return "calendar";
    default:
      return "ellipse";
  }
};

function DetailCard({
  title,
  value,
  label,
}: {
  title: string;
  value: string;
  label: string;
}) {
  return (
    <View className="bg-white w-[48%] mb-4 p-4 rounded-2xl shadow-sm">
      <Text className="text-pink-500 text-sm font-medium">{title}</Text>
      <Text className="text-black text-lg font-bold mt-1">{value}</Text>
      <Text className="text-gray-400 text-xs mt-1">{label}</Text>
    </View>
  );
}
