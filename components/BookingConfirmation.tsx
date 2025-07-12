import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { bookConsultApi } from "@/apis/bookConsult.api";
import {
  Consultant,
  Schedule,
} from "@/models/BookingConsultant/bookingConsult.type";

interface BookingConfirmationProps {
  visible: boolean;
  onClose: () => void;
  consultant: Consultant;
  schedule: Schedule;
  customerProfileId: number;
  onBookingSuccess?: () => void;
}

const APPOINTMENT_TYPES = [{ id: "online", label: "Online", icon: "videocam" }];

export default function BookingConfirmation({
  visible,
  onClose,
  consultant,
  schedule,
  customerProfileId,
  onBookingSuccess,
}: BookingConfirmationProps) {
  const [selectedReason] = useState("Menstrual Issues");
  const [appointmentType, setAppointmentType] = useState("online");
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "2-digit" });
    const time = schedule.startTime;

    return { day, month, time };
  };

  const handleBookNow = async () => {
    try {
      console.log(
        "Booking appointment for:",
        schedule.id,
        "by user:",
        customerProfileId
      );
      setIsLoading(true);

      await bookConsultApi.bookSchedule(schedule.id, customerProfileId);

      Toast.show({
        type: "success",
        text1: "Booking Confirmed! 🎉",
        text2: "Your appointment has been scheduled successfully",
      });

      onBookingSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Booking error:", error);
      Toast.show({
        type: "error",
        text1: "Booking Failed",
        text2: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { day, month, time } = formatDate(schedule.date);

  // Calculate fees (these would typically come from your backend)

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
          <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-800">
            Book Appointment
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Date & Time Selection */}
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Select Date & Time
            </Text>

            <View className="flex-row items-center space-x-4">
              {/* Day */}
              <View className="items-center">
                <Text className="text-sm text-gray-600 mb-2">Day</Text>
                <View className="w-16 h-16 bg-gray-100 rounded-2xl items-center justify-center">
                  <Text className="text-2xl font-bold text-gray-800">
                    {day}
                  </Text>
                </View>
              </View>

              {/* Month */}
              <View className="items-center">
                <Text className="text-sm text-gray-600 mb-2">Month</Text>
                <View className="w-16 h-16 bg-pink-500 rounded-2xl items-center justify-center">
                  <Text className="text-xl font-bold text-white">{month}</Text>
                </View>
              </View>

              {/* Time */}
              <View className="items-center">
                <Text className="text-sm text-gray-600 mb-2">Time</Text>
                <View className="bg-gray-100 px-4 py-3 rounded-2xl">
                  <Text className="text-lg font-semibold text-gray-800">
                    {time}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Reason to Visit */}
          <View className="mt-8">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Reason To Visit
            </Text>

            <View className="flex-row items-center justify-between bg-gray-50 p-4 rounded-2xl">
              <Text className="text-gray-700 font-medium">
                {selectedReason}
              </Text>
              <TouchableOpacity>
                <View className="w-8 h-8 bg-pink-500 rounded-full items-center justify-center">
                  <Ionicons name="chevron-down" size={16} color="white" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Appointment Type */}
          <View className="mt-8">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Appointment Type
            </Text>

            <View className="flex-row space-x-4">
              {APPOINTMENT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setAppointmentType(type.id)}
                  className={`flex-1 p-4 rounded-2xl border-2 ${
                    appointmentType === type.id
                      ? "bg-pink-50 border-pink-500"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <View className="items-center">
                    <Ionicons
                      name={type.icon as any}
                      size={24}
                      color={
                        appointmentType === type.id ? "#ec4899" : "#6b7280"
                      }
                    />
                    <Text
                      className={`mt-2 font-medium ${
                        appointmentType === type.id
                          ? "text-pink-700"
                          : "text-gray-700"
                      }`}
                    >
                      {type.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Cost Breakdown */}
          <View className="mt-8 bg-gray-50 rounded-2xl p-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-700">Doctor Fee</Text>
              <Text className="text-gray-800 font-semibold">FREE</Text>
            </View>

            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-700">Platform fee</Text>
              <Text className="text-gray-800 font-semibold">FREE</Text>
            </View>

            <View className="border-t border-gray-200 pt-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-semibold text-gray-800">
                  Total Cost
                </Text>
                <Text className="text-xl font-bold text-gray-800">0$</Text>
              </View>
            </View>
          </View>

          {/* Consultant Info */}
          <View className="mt-6 bg-pink-50 rounded-2xl p-4">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-pink-500 rounded-full items-center justify-center">
                <Ionicons name="person" size={24} color="white" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-pink-800 font-semibold">
                  Dr. {consultant.consultantProfile.name}
                </Text>
                <Text className="text-pink-600 text-sm">
                  {consultant.consultantProfile.experience} years experience
                </Text>
              </View>
              <View className="bg-green-100 px-2 py-1 rounded-full">
                <Text className="text-green-700 text-xs font-medium">
                  Available
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Book Now Button */}
        <View className="p-6 border-t border-gray-100">
          <TouchableOpacity
            onPress={handleBookNow}
            disabled={isLoading}
            className={`py-4 rounded-2xl ${
              isLoading ? "bg-pink-400" : "bg-pink-500"
            }`}
          >
            <Text className="text-white text-center text-lg font-semibold">
              {isLoading ? "Booking..." : "Book Now"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
