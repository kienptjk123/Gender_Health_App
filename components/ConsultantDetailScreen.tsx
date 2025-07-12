import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Consultant,
  Schedule,
} from "@/models/BookingConsultant/bookingConsult.type";
import BookingConfirmation from "./BookingConfirmation";

interface ConsultantDetailScreenProps {
  consultant: Consultant;
  customerProfileId: number;
  onBack?: () => void;
}

export default function ConsultantDetailScreen({
  consultant,
  customerProfileId,
  onBack,
}: ConsultantDetailScreenProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [schedulesByDate, setSchedulesByDate] = useState(
    consultant.schedulesByDate
  );
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );

  const handleBooking = (scheduleId: number) => {
    // Find the schedule object
    const schedule = Object.values(schedulesByDate)
      .flat()
      .find((s) => s.id === scheduleId);

    if (schedule) {
      setSelectedSchedule(schedule);
      setShowBookingConfirmation(true);
    }
  };

  const handleBookingSuccess = () => {
    // Update local state to reflect the booking
    if (selectedSchedule) {
      const updated = { ...schedulesByDate };
      for (const date in updated) {
        updated[date] = updated[date].map((s) =>
          s.id === selectedSchedule.id ? { ...s, status: "BOOKED" } : s
        );
      }
      setSchedulesByDate(updated);
    }
  };

  const getAvailableSlots = () => {
    let total = 0;
    Object.values(schedulesByDate).forEach((schedules) => {
      total += schedules.filter((s) => s.status === "AVAILABLE").length;
    });
    return total;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatShortDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white shadow-sm">
        <TouchableOpacity
          onPress={onBack || (() => router.back())}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">
          Consultant Details
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Cover Photo & Profile */}
        <View className="relative">
          <Image
            source={{ uri: consultant.consultantProfile.coverPhoto }}
            className="w-full h-48"
            style={{ backgroundColor: "#f3f4f6" }}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            className="absolute bottom-0 left-0 right-0 h-24"
          />

          {/* Profile Avatar */}
          <View className="absolute -bottom-12 left-6">
            <View className="relative">
              <Image
                source={{ uri: consultant.consultantProfile.avatar }}
                className="w-24 h-24 rounded-2xl border-4 border-white"
                style={{ backgroundColor: "#f3f4f6" }}
              />
              <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white" />
            </View>
          </View>
        </View>

        {/* Basic Info */}
        <View className="bg-white mt-14 mx-4 rounded-2xl p-6 shadow-sm">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800">
                {consultant.consultantProfile.name}
              </Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="location" size={16} color="#6b7280" />
                <Text className="text-gray-600 ml-1">
                  {consultant.consultantProfile.location}
                </Text>
              </View>
              <View className="flex-row items-center mt-1">
                <Ionicons name="business" size={16} color="#6b7280" />
                <Text className="text-gray-600 ml-1">
                  {consultant.consultantProfile.hospital || "Private Practice"}
                </Text>
              </View>
            </View>
            <View className="bg-green-100 px-3 py-2 rounded-full">
              <Text className="text-green-700 text-sm font-semibold">
                {getAvailableSlots()} slots
              </Text>
            </View>
          </View>

          {/* Rating & Experience */}
          <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <View className="bg-pink-100 px-3 py-1 rounded-full">
              <Text className="text-pink-700 text-sm font-medium">
                {consultant.consultantProfile.experience} years exp.
              </Text>
            </View>
          </View>
        </View>
        {/* Specialties */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Specialties
          </Text>
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
        {/* About */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            About
          </Text>
          <Text className="text-gray-600 leading-6">
            {consultant.consultantProfile.bio ||
              consultant.consultantProfile.description}
          </Text>
        </View>

        {/* Professional Details */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Professional Details
          </Text>

          <View className="space-y-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                <Ionicons name="school" size={20} color="#3b82f6" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-gray-800 font-medium">Education</Text>
                <Text className="text-gray-600">
                  {consultant.consultantProfile.degree}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center">
                <Ionicons name="time" size={20} color="#8b5cf6" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-gray-800 font-medium">Response Time</Text>
                <Text className="text-gray-600">
                  {consultant.consultantProfile.responseTime}
                </Text>
              </View>
            </View>

            {consultant.consultantProfile.website && (
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                  <Ionicons name="globe" size={20} color="#10b981" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-gray-800 font-medium">Website</Text>
                  <Text className="text-blue-600">
                    {consultant.consultantProfile.website}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Languages */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Languages
          </Text>
          <View className="flex-row flex-wrap">
            {consultant.consultantProfile.languages.map((language, index) => (
              <View
                key={index}
                className="bg-blue-100 px-3 py-2 rounded-full mr-2 mb-2"
              >
                <Text className="text-blue-700 text-sm font-medium">
                  {language}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Available Schedules */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Available Schedules
          </Text>

          {getAvailableSlots() > 0 ? (
            <View>
              {/* Date Selection */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4"
              >
                <View className="flex-row space-x-3">
                  {Object.keys(schedulesByDate).map((date) => {
                    const hasAvailable = schedulesByDate[date].some(
                      (s) => s.status === "AVAILABLE"
                    );
                    if (!hasAvailable) return null;

                    return (
                      <TouchableOpacity
                        key={date}
                        onPress={() =>
                          setSelectedDate(selectedDate === date ? null : date)
                        }
                        className={`px-4 py-3 rounded-xl min-w-24 items-center ${
                          selectedDate === date ? "bg-pink-500" : "bg-gray-100"
                        }`}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            selectedDate === date
                              ? "text-white"
                              : "text-gray-700"
                          }`}
                        >
                          {formatShortDate(date)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              {/* Time Slots */}
              {selectedDate ? (
                <View>
                  <Text className="text-base font-medium text-gray-800 mb-3">
                    {formatDate(selectedDate)}
                  </Text>
                  <View className="space-y-2">
                    {schedulesByDate[selectedDate]
                      .filter((s) => s.status === "AVAILABLE")
                      .map((schedule) => (
                        <TouchableOpacity
                          key={schedule.id}
                          onPress={() => handleBooking(schedule.id)}
                          className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex-row justify-between items-center"
                          activeOpacity={0.7}
                        >
                          <View className="flex-1">
                            <Text className="font-medium text-gray-800">
                              {schedule.title}
                            </Text>
                            <Text className="text-gray-600 text-sm mt-1">
                              {schedule.startTime} - {schedule.endTime}
                            </Text>
                            {schedule.description && (
                              <Text className="text-gray-500 text-sm mt-1">
                                {schedule.description}
                              </Text>
                            )}
                          </View>
                          <View className="bg-pink-500 px-4 py-2 rounded-xl">
                            <Text className="text-white text-sm font-medium">
                              Book
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                  </View>
                </View>
              ) : (
                <View className="bg-gray-50 p-4 rounded-xl">
                  <Text className="text-gray-600 text-center">
                    Select a date to view available time slots
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View className="bg-gray-50 p-6 rounded-xl">
              <Text className="text-gray-600 text-center">
                No available slots at the moment
              </Text>
              <Text className="text-gray-500 text-center text-sm mt-1">
                Please check back later or contact the consultant directly
              </Text>
            </View>
          )}
        </View>

        {/* Bottom padding for safe area */}
        <View className="h-6" />
      </ScrollView>

      {/* Booking Confirmation Modal */}
      {selectedSchedule && (
        <BookingConfirmation
          visible={showBookingConfirmation}
          onClose={() => setShowBookingConfirmation(false)}
          consultant={consultant}
          schedule={selectedSchedule}
          customerProfileId={customerProfileId}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </SafeAreaView>
  );
}
