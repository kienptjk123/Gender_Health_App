import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

import { bookConsultApi } from "@/apis/bookConsult.api";
import ConsultantDetailScreen from "@/components/ConsultantDetailScreen";
import { useAuth } from "@/contexts/AuthContext";
import { Consultant } from "@/models/BookingConsultant/bookingConsult.type";

export default function ConsultantDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsultantDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get consultants with schedules
        const response = await bookConsultApi.getConsultantWorkSchedule();
        const consultantData = response.data.find(
          (c: Consultant) => c.consultantProfile.id.toString() === id
        );

        if (!consultantData) {
          setError("Consultant not found");
          return;
        }

        setConsultant(consultantData);
      } catch (err: any) {
        console.error("Error fetching consultant details:", err);
        setError("Failed to load consultant details");
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to load consultant details",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchConsultantDetails();
    }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#ec4899" />
        <Text className="text-gray-600 mt-4">
          Loading consultant details...
        </Text>
      </View>
    );
  }

  if (error || !consultant) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-6">
        <Text className="text-red-600 text-lg font-semibold mb-2">
          {error || "Consultant not found"}
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          We couldn&apos;t load the consultant details. Please try again.
        </Text>
        <TouchableOpacity
          onPress={handleBack}
          className="bg-pink-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get customer profile ID from user info
  const customerProfileId = user?.customer_profile_id || 0;

  return (
    <ConsultantDetailScreen
      consultant={consultant}
      customerProfileId={customerProfileId}
      onBack={handleBack}
    />
  );
}
