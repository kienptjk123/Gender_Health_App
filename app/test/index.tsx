import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { testPackageApi } from "../../apis";
import { TestPackageItem, TypeOfTest } from "../../models";
import { TestPackageSelector } from "../../components/TestPackageSelector";

export default function TestTab() {
  const router = useRouter();
  const [testPackages, setTestPackages] = useState<TestPackageItem[]>([]);
  const [typeOfTests, setTypeOfTests] = useState<TypeOfTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log("🚀 [APP] Component mounted, fetching test packages...");
    fetchTestPackages();
  }, []);

  const fetchTestPackages = async (isRefresh = false) => {
    console.log(
      `🔄 [APP] ${isRefresh ? "Refreshing" : "Loading"} test packages...`
    );

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [packagesResponse, typesResponse] = await Promise.all([
        testPackageApi.getAllTestPackages(),
        testPackageApi.getTypeOfTests(),
      ]);

      console.log("✅ [APP] API responses received:", {
        packages: packagesResponse.data?.length || 0,
        types: typesResponse.data?.length || 0,
      });

      setTestPackages(packagesResponse.data || []);
      setTypeOfTests(typesResponse.data || []);

      Toast.show({
        type: "success",
        text1: "Data Loaded Successfully! ✅",
        text2: `${packagesResponse.data?.length || 0} packages, ${
          typesResponse.data?.length || 0
        } test types`,
      });
    } catch (error: any) {
      console.error("❌ [APP] API call failed:", error);
      Toast.show({
        type: "error",
        text1: "Failed to Load Data ❌",
        text2: "Using fallback data for now",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleBookTest = (packageId: number) => {
    console.log("📅 [APP] Booking test package:", packageId);
    Toast.show({
      type: "info",
      text1: "Redirecting to booking...",
      text2: `Package ${packageId}`,
    });

    // Navigate to booking page
    router.push({
      pathname: "/test/booking",
      params: { packageId: String(packageId) },
    });
  };

  const onRefresh = () => {
    fetchTestPackages(true);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#f472b6" />
        <Text className="mt-4 text-gray-600 text-lg">
          Loading test packages...
        </Text>
        <Text className="mt-2 text-gray-500 text-sm">Connecting to API...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <TestPackageSelector
        testPackages={testPackages}
        typeOfTests={typeOfTests}
        onBookPackage={handleBookTest}
      />

      <Toast />
    </ScrollView>
  );
}
