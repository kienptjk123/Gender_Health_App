// src/components/BookingConsult/ConsultantList.tsx
import { Consultant } from "@/models/BookingConsultant/bookingConsult.type";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { bookConsultApi } from "@/apis/bookConsult.api";
import { Ionicons } from "@expo/vector-icons";
import ConsultantCard from "./ConsultantCard";

interface Props {
  customerProfileId: number;
}

export default function ConsultantList({ customerProfileId }: Props) {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultants = async () => {
      setLoading(true);
      try {
        const res = await bookConsultApi.getConsultantWorkSchedule();
        setConsultants(res.data);
      } catch (error) {
        console.error("Error fetching consultants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  if (loading) {
    return (
      <Text className="text-center text-gray-500 mt-4">
        Loading consultants...
      </Text>
    );
  }

  if (consultants.length === 0) {
    return (
      <View className="items-center justify-center mt-10 px-4">
        <Ionicons name="sad-outline" size={48} color="#9ca3af" />
        <Text className="text-gray-500 mt-2 text-base font-medium">
          No consultants available
        </Text>
        <Text className="text-gray-400 mt-1 text-sm text-center">
          Please check back later. New slots might be available soon!
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-4 px-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-gray-800 mb-5">
          Best Consultants
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/consultants/all")}
          className="flex-row items-center bg-pink-100 px-3 py-2 rounded-full"
          activeOpacity={0.7}
        >
          <Text className="text-pink-600 font-semibold text-sm mr-1">
            See All
          </Text>
          <Ionicons name="arrow-forward" size={14} color="#ec4899" />
        </TouchableOpacity>
      </View>
      {consultants.slice(0, 2).map((consultant) => (
        <ConsultantCard
          key={consultant.consultantProfile.id}
          consultant={consultant}
          customerProfileId={customerProfileId}
        />
      ))}
    </View>
  );
}
