import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import {
  Consultant,
  Schedule,
} from "@/models/BookingConsultant/bookingConsult.type";

export default function ConsultantCard({
  consultant,
}: {
  consultant: Consultant;
  customerProfileId: number;
}) {
  const [schedulesByDate, setSchedulesByDate] = useState<
    Record<string, Schedule[]>
  >(consultant.schedulesByDate);

  useEffect(() => {
    setSchedulesByDate(consultant.schedulesByDate);
  }, [consultant]);

  const getAvailableSlots = () => {
    let total = 0;
    Object.values(schedulesByDate).forEach((schedules) => {
      total += schedules.filter((s) => s.status === "AVAILABLE").length;
    });
    return total;
  };

  return (
    <View className="bg-white rounded-2xl shadow-lg mx-2 mb-4 overflow-hidden">
      {/* Header Card */}
      <LinearGradient colors={["#fdf2f8", "#ffffff"]} className="p-5">
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/consultants/[id]",
              params: { id: consultant.consultantProfile.id.toString() },
            })
          }
          activeOpacity={0.8}
        >
          <View className="flex-row items-center">
            {/* Avatar with online indicator */}
            <View className="relative">
              <Image
                source={{ uri: consultant.consultantProfile.avatar }}
                className="w-16 h-16 rounded-2xl"
                style={{ backgroundColor: "#f3f4f6" }}
              />
              <View className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white" />
            </View>

            {/* Consultant Info */}
            <View className="flex-1 ml-4">
              <Text className="text-xl font-bold text-gray-800">
                {consultant.consultantProfile.name}
              </Text>
              <View className="flex-row items-center mt-1">
                <Ionicons name="location" size={14} color="#6b7280" />
                <Text className="text-gray-500 text-sm ml-1">
                  {consultant.consultantProfile.location}
                </Text>
              </View>
              <View className="flex-row items-center mt-1">
                <Ionicons name="medical" size={14} color="#ec4899" />
                <Text className="text-pink-600 text-sm ml-1 font-medium">
                  {consultant.consultantProfile.experience} years exp.
                </Text>
              </View>
            </View>

            <View className="bg-green-100 px-3 py-1 rounded-full mb-2">
              <Text className="text-green-700 text-xs font-semibold">
                {getAvailableSlots()} slots
              </Text>
            </View>
          </View>

          {/* Quick info badges */}
          <View className="flex-row mt-4 space-x-2">
            <View className="flex-row flex-wrap mt-2">
              {consultant.consultantProfile.specialties?.map((spec, idx) => (
                <View
                  key={spec.id || idx}
                  className="bg-purple-100 px-2 py-1 rounded-full mr-2 mb-2"
                >
                  <Text className="text-purple-700 text-xs font-medium">
                    {spec.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
