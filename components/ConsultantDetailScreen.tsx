import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Consultant } from "@/models/BookingConsultant/bookingConsult.type";
import BookingConfirmation from "./BookingConfirmation";

interface ConsultantDetailScreenProps {
  consultant: Consultant;
  customerProfileId: number;
  onBack: () => void;
}

export default function ConsultantDetailScreen({
  consultant,
  customerProfileId,
  onBack,
}: ConsultantDetailScreenProps) {
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);

  const handleBookingSuccess = () => {
    // Refresh the schedules by refetching or updating the state
    // For now, we'll just close the modal and let the parent component handle refresh
    setShowBookingConfirmation(false);
  };

  const getAvailableSlots = () => {
    let total = 0;
    Object.values(consultant.schedulesByDate).forEach((schedules) => {
      total += schedules.filter((s) => s.status === "AVAILABLE").length;
    });
    return total;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
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

          {/* Header with back button overlay */}
          <View className="absolute top-12 left-0 right-0 flex-row justify-between items-center px-4">
            <TouchableOpacity
              onPress={onBack}
              className="w-10 h-10 rounded-full bg-white/90 justify-center items-center shadow-md"
            >
              <Ionicons name="arrow-back" size={24} color="#EC4899" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-white/90 justify-center items-center shadow-md">
              <Ionicons name="bookmark-outline" size={24} color="#EC4899" />
            </TouchableOpacity>
          </View>

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
            <View className="bg-gray-50 p-4 rounded-xl">
              <Text className="text-gray-700 text-center font-medium">
                {getAvailableSlots()} available slots
              </Text>
              <Text className="text-gray-500 text-center text-sm mt-1">
                Click &quot;Book Now&quot; to choose your preferred time slot
              </Text>
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

      {/* Book Now Button */}
      {getAvailableSlots() > 0 && (
        <View className="bg-white px-4 py-3 border-t border-gray-100">
          <TouchableOpacity
            onPress={() => setShowBookingConfirmation(true)}
            className="bg-pink-500 py-4 rounded-2xl flex-row items-center justify-center"
            activeOpacity={0.8}
          >
            <Ionicons name="calendar" size={20} color="white" />
            <Text className="text-white text-lg font-semibold ml-2">
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Booking Confirmation Modal */}
      <BookingConfirmation
        visible={showBookingConfirmation}
        onClose={() => setShowBookingConfirmation(false)}
        consultant={consultant}
        customerProfileId={customerProfileId}
        onBookingSuccess={handleBookingSuccess}
        schedulesByDate={consultant.schedulesByDate}
      />
    </SafeAreaView>
  );
}
