import { authService } from "@/apis";
import ConsultantList from "@/components/ConsultantList";
import HealthServicesSwiper from "@/components/HealthServicesSwiper";
import NotificationIcon from "@/components/NotificationIcon";
import UpcomingAppointmentSection from "@/components/UpcomingAppointmentSection";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

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
      <View
        className="rounded-b-3xl overflow-hidden pb-12"
        style={{ position: "relative" }}
      >
        <Image
          source={require("../../assets/images/pink.jpg")}
          resizeMode="cover"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 1,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        />
        {/* Top Row: Avatar and Notification */}
        <View className="flex-row justify-between items-center px-5 pt-10">
          <View className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
            <Image
              source={{
                uri:
                  user?.avatar ||
                  "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
              }}
              className="w-full h-full"
            />
          </View>
          <NotificationIcon
            unreadCount={unreadCount}
            className="w-11 h-11 rounded-full bg-white justify-center items-center shadow-sm"
          />
        </View>
        {/* Welcome Card Overlay */}
        <View
          className="mx-5 mt-6 bg-white rounded-2xl p-6 -mb-8 z-10"
          style={{
            shadowColor: "#F9A8D4", // or '#000' for a neutral shadow
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.25,
            shadowRadius: 16,
            elevation: 16, // for Android
          }}
        >
          <Text className="text-center text-gray-500 text-base font-medium mb-1">
            WELCOME BACK!
          </Text>
          <Text className="text-center text-2xl font-bold text-gray-900 mb-2">
            {user?.name || "User"}
          </Text>
          <Text className="text-center text-gray-500 mb-4">
            Unlock your health journey today!
          </Text>
        </View>
      </View>

      {/* Health Services Section */}
      <View className="px-5 pb-4 pt-4">
        <HealthServicesSwiper />
      </View>
      <View className="pb-24">
        {customerProfile?.id ? (
          <>
            <UpcomingAppointmentSection customerId={customerProfile.id} />
            <ConsultantList customerProfileId={customerProfile.id} />
          </>
        ) : (
          <Text className="text-center text-gray-500 mt-4">Loading...</Text>
        )}
      </View>
    </ScrollView>
  );
}
