import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { testPackageApi } from "../../apis";
import { TestPackageItem } from "../../models";

export default function PackageDetailsPage() {
  const router = useRouter();
  const { packageId } = useLocalSearchParams<{ packageId: string }>();
  const [packageData, setPackageData] = useState<TestPackageItem | null>(null);
  const [loading, setLoading] = useState(true);

  const packages = [
    {
      name: "Basic",
      colors: ["#2dd4bf", "#0891b2"],
      badge: "AFFORDABLE",
      badgeColor: "bg-teal-100 text-teal-800",
    },
    {
      name: "Premium",
      colors: ["#3b82f6", "#1d4ed8"],
      badge: "POPULAR",
      badgeColor: "bg-yellow-100 text-yellow-800",
    },
    {
      name: "Advanced",
      colors: ["#fb923c", "#ea580c"],
      badge: "RECOMMENDED",
      badgeColor: "bg-orange-100 text-orange-800",
    },
    {
      name: "Pre-marital",
      colors: ["#8b5cf6", "#6d28d9"],
      badge: "COMPREHENSIVE",
      badgeColor: "bg-purple-100 text-purple-800",
    },
  ];

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setLoading(true);
        const response = await testPackageApi.getTestPackageDetail(
          parseInt(packageId!)
        );
        setPackageData(response.data);
      } catch (error) {
        console.error("Error fetching package details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (packageId) {
      fetchPackageDetails();
    }
  }, [packageId]);

  const getPackageStyle = (packageName: string) => {
    const pkg = packages.find(
      (p) =>
        packageName.toLowerCase().includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().includes(packageName.toLowerCase())
    );
    return pkg || packages[0];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const handleBookNow = () => {
    router.push(`/test/booking?packageId=${packageId}`);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-pink-50 justify-center items-center pt-12">
        <ActivityIndicator size="large" color="#EC4899" />
        <Text className="mt-4 text-pink-400">Loading package details...</Text>
      </View>
    );
  }

  if (!packageData) {
    return (
      <View className="flex-1 bg-pink-50 justify-center items-center px-6 pt-12">
        <Text className="text-pink-400 text-center text-lg">
          Package not found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-pink-400 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const packageStyle = getPackageStyle(packageData.name);

  return (
    <View className="flex-1 bg-pink-50 pt-9">
      <View className="bg-white shadow-sm py-4">
        <View className="px-6">
          <View className="flex-row items-center justify-center gap-3">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-pink-100 justify-center items-center shadow-md"
            >
              <Ionicons name="arrow-back" size={24} color="#EC4899" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-xl font-bold text-pink-400">
                Package Details
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        <LinearGradient
          colors={packageStyle.colors as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="relative rounded-2xl p-6 shadow-lg overflow-hidden mb-6"
        >
          <View className="absolute inset-0 opacity-10">
            <View className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full" />
            <View className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full" />
          </View>

          <View className="absolute top-4 left-4">
            <View
              className={`${packageStyle.badgeColor} px-3 py-1 rounded-full`}
            >
              <Text className="text-xs font-bold">{packageStyle.badge}</Text>
            </View>
          </View>

          <View className="relative mt-8">
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                <Text className="text-white text-3xl font-bold">
                  {packageData.name}
                </Text>
                <Text className="text-white/80 text-lg mt-1">
                  {packageData.tests?.length || 0} Indicators
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-white text-3xl font-bold">
                  {formatPrice(packageData.price)}
                </Text>
                <Text className="text-white/80 text-lg">VND</Text>
              </View>
            </View>

            <View className="flex-row gap-3 mt-2">
              <TouchableOpacity
                onPress={() => router.push("/test/all-tests" as any)}
                className="flex-1 bg-white/20 backdrop-blur-sm py-3 px-4 rounded-xl items-center flex-row justify-center gap-2"
              >
                <Text className="text-white text-lg">ⓘ</Text>
                <Text className="text-white font-semibold">View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleBookNow}
                className="flex-1 bg-white py-3 px-4 rounded-xl items-center justify-center"
              >
                <Text className="text-gray-800 font-semibold">Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Package Information
          </Text>

          <View className="space-y-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Package Name:</Text>
              <Text className="font-semibold text-gray-900">
                {packageData.name}
              </Text>
            </View>

            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-gray-600">Price:</Text>
              <Text className="font-semibold text-gray-900">
                {formatPrice(packageData.price)} VND
              </Text>
            </View>

            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-gray-600">Number of Tests:</Text>
              <Text className="font-semibold text-gray-900">
                {packageData.tests?.length || 0} tests
              </Text>
            </View>

            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-gray-600">Status:</Text>
              <View className="px-3 py-1 rounded-full bg-green-100">
                <Text className="text-xs font-semibold text-green-800">
                  Available
                </Text>
              </View>
            </View>
          </View>
        </View>

        {packageData.tests && packageData.tests.length > 0 && (
          <View className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Tests Included ({packageData.tests.length})
            </Text>
            <View className="space-y-3">
              {packageData.tests.map((test, index) => (
                <View
                  key={test.id || index}
                  className="flex-row items-start gap-3 py-2"
                >
                  <LinearGradient
                    colors={packageStyle.colors as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ borderRadius: 50 }}
                    className="w-3 h-3 mt-1"
                  />
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900">
                      {test.name}
                    </Text>
                    {test.description && (
                      <Text className="text-gray-600 text-sm mt-1">
                        {test.description}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View className="h-10" />
      </ScrollView>

      <View className="bg-white border-t border-gray-200 p-6">
        <TouchableOpacity onPress={handleBookNow}>
          <LinearGradient
            colors={packageStyle.colors as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 12 }}
            className="w-full py-4 shadow-sm"
          >
            <Text className="text-white text-center font-bold text-lg">
              Book This Package
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
