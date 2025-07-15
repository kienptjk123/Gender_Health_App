import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { appointmentApi } from "@/apis/appointment";
import { Appointment } from "@/models/appointment";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { router } from "expo-router";

export default function UpcomingAppointmentSection({
  customerId,
}: {
  customerId: number;
}) {
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    appointmentApi.getAppointmentsByCustomerId(customerId).then((data) => {
      const upcoming = data.find((item) => item.status === "WAITING_FOR_START");
      if (upcoming?.endedAt) {
        if (
          new Date(upcoming.endedAt) < new Date(Date.now() + 7 * 60 * 60 * 1000)
        ) {
          return;
        }
      }
      setAppointment(upcoming || null);
    });
  }, [customerId]);

  if (!appointment) return null;

  dayjs.extend(utc);

  const dateStr = dayjs.utc(appointment.scheduleAt).format("ddd, D MMM YYYY");
  const timeStr = `${dayjs.utc(appointment.startedAt).format("HH:mm")} - ${dayjs
    .utc(appointment.endedAt)
    .format("HH:mm")}`;

  return (
    <View className="px-5 pb-4">
      {/* Section Header */}
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-2xl font-bold text-gray-800">My Appointment</Text>
        {/* See All button (no handler yet) */}
        <TouchableOpacity
          onPress={() => router.push("/appoinmentHistory" as any)}
          className="flex-row items-center bg-pink-100 px-3 py-2 rounded-full"
          activeOpacity={0.7}
        >
          <Text className="text-pink-600 font-semibold text-sm mr-1">
            See All
          </Text>
          <Ionicons name="arrow-forward" size={14} color="#ec4899" />
        </TouchableOpacity>
      </View>

      {/* Appointment Card */}
      <View className="bg-white rounded-2xl p-5 flex-row items-center shadow-sm">
        <View className="w-1 h-20 bg-violet-500 rounded-sm mr-4" />
        <View className="flex-1">
          <Text className="text-gray-400 text-sm mb-2">Appointment date</Text>
          <View className="flex-row items-center mb-4">
            <Ionicons name="time-outline" size={16} color="#6b7280" />
            <Text className="text-gray-600 text-sm font-medium ml-2">
              {dateStr} • {timeStr}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Image
              source={{ uri: appointment.consultantProfile.avatar }}
              className="w-10 h-10 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800 mb-1">
                Dr. {appointment.consultantProfile.name}
              </Text>
              <Text className="text-sm text-gray-500">
                {appointment.consultantProfile.bio}
              </Text>
            </View>
            <View className="w-3 h-3 rounded-full bg-green-500 ml-2" />
          </View>
        </View>
        {/* More options button (no handler yet) */}
        <TouchableOpacity className="p-2">
          <Ionicons name="ellipsis-vertical" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
