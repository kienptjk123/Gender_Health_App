import { stiApi } from "@/apis/sti.api";
import StisTrackingSection from "@/components/STI/StisTrackingSection";
import { useAuth } from "@/contexts/AuthContext";
import { Data } from "@/models/STI/sti.type";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function STITrackingScreen() {
  const [stiData, setStiData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useAuth();
  const router = useRouter();

  const fetchSTIData = useCallback(async () => {
    try {
      if (user?.customer_profile_id) {
        const res = await stiApi.getStiByCustomerProfileId(
          user.customer_profile_id
        );
        const sorted = res.data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setStiData(sorted);
      }
    } catch (error) {
      console.error("Error fetching STI data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.customer_profile_id]);

  useEffect(() => {
    fetchSTIData();
  }, [fetchSTIData]);

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);
    fetchSTIData();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#ec4899" />
        <Text className="text-gray-600 mt-4">Loading STI tracking data...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 p-2 -ml-2"
          >
            <Text className="text-xl">←</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">STI Tracking</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Summary */}
        <View className="px-6 my-6">
          <View className="flex-row justify-between">
            <View className="flex-1 bg-white rounded-xl p-4 mr-2 items-center">
              <Text className="text-2xl font-bold text-pink-500">
                {stiData.length}
              </Text>
              <Text className="text-gray-600 text-sm text-center">
                Total Tests
              </Text>
            </View>
            <View className="flex-1 bg-white rounded-xl p-4 mx-1 items-center">
              <Text className="text-2xl font-bold text-green-500">
                {
                  stiData.filter((item) => item.status === "RESULT_AVAILABLE")
                    .length
                }
              </Text>
              <Text className="text-gray-600 text-sm text-center">
                Completed
              </Text>
            </View>
            <View className="flex-1 bg-white rounded-xl p-4 ml-2 items-center">
              <Text className="text-2xl font-bold text-blue-500">
                {
                  stiData.filter((item) => item.status === "REPORT_READY")
                    .length
                }
              </Text>
              <Text className="text-gray-600 text-sm text-center">
                Reports Ready
              </Text>
            </View>
          </View>
        </View>

        {/* STI Tracking Content */}
        {stiData.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20 px-6">
            <Text className="text-6xl mb-4">🧪</Text>
            <Text className="text-xl font-semibold text-gray-800 mb-2 text-center">
              No STI Tests Yet
            </Text>
            <Text className="text-gray-600 text-center px-8 mb-6">
              You haven&apos;t ordered any STI tests yet. Start monitoring your
              health by ordering a test package.
            </Text>
            <TouchableOpacity
              className="bg-pink-500 px-6 py-3 rounded-full"
              onPress={() => router.push("/test" as any)}
            >
              <Text className="text-white font-medium">Order Test Package</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="px-6 pb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Your STI Test Progress ({stiData.length})
            </Text>

            {/* Use the existing STI Tracking Component */}
            {user?.customer_profile_id && (
              <StisTrackingSection
                customerProfileId={user.customer_profile_id}
                refreshTrigger={refreshTrigger}
              />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
