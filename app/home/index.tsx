import { authService } from "@/apis";
import ConsultantList from "@/components/ConsultantList";
import HealthServicesSwiper from "@/components/HealthServicesSwiper";
import NotificationIcon from "@/components/NotificationIcon";
import UpcomingAppointmentSection from "@/components/UpcomingAppointmentSection";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [customerProfile, setCustomerProfile] = useState<{
    id: number;
    name: string;
    avatar?: string;
  } | null>(null);

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      try {
        const res = await authService.getUserProfile();
        const profile = res.result;
        setCustomerProfile({
          id: profile.id,
          name: profile.name,
          avatar: profile.avatar,
        });
      } catch (error) {
        console.error("Failed to fetch customer profile:", error);
      }
    };

    fetchCustomerProfile();
  }, []);
  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={["#f2d9fa", "#e8b1fa", "#ffffff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-15"
      >
        {/* Header */}
        <View className="flex-row justify-between items-center px-5 mt-5">
          <View className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              source={{
                uri:
                  user?.avatar ||
                  "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
              }}
              className="w-full h-full"
            />
          </View>
          <NotificationIcon unreadCount={unreadCount} />
        </View>

        <View className="flex-row items-center justify-between px-5">
          <View className="flex-1 mr-4">
            <Text className="text-3xl font-bold text-gray-800 mb-1">
              Welcome!
            </Text>
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              {user?.name}
            </Text>
            <Text className="text-base text-gray-500 mb-3">
              Have a nice day 😊
            </Text>
            <TouchableOpacity className="bg-red-500 py-3 px-5 rounded-full flex-row items-center shadow-lg self-start">
              <Text className="text-base mr-2">🚨</Text>
              <Text className="text-white text-base font-semibold">
                Urgent Care
              </Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require("../../assets/images/nurse.png")}
            style={{ width: 200, height: 300, borderRadius: 16 }}
          />
        </View>
      </LinearGradient>

      {/* Health Services Section */}
      <View className="px-5 pt-8">
        <HealthServicesSwiper />
      </View>
      <View className="p-4">
        {customerProfile?.id ? (
          <>
            <ConsultantList customerProfileId={customerProfile.id} />
            <UpcomingAppointmentSection customerId={customerProfile.id} />
          </>
        ) : (
          <Text className="text-center text-gray-500 mt-4">Loading...</Text>
        )}
      </View>
    </ScrollView>
  );
}
