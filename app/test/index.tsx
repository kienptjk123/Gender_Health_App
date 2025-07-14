import { testPackageApi } from "@/apis";
import { TestPackageItem } from "@/models/testPackage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TestPackagesScreen() {
  const router = useRouter();
  const [testPackages, setTestPackages] = useState<TestPackageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestPackages = async () => {
      try {
        setLoading(true);
        const response = await testPackageApi.getAllTestPackages();
        if (response.data) {
          setTestPackages(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch test packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestPackages();
  }, []);

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

  const handleViewDetails = (packageItem: TestPackageItem) => {
    router.push(`/test/package-details?packageId=${packageItem.id}`);
  };
  const handleBookNow = (packageItem: TestPackageItem) => {
    router.push(`/test/booking?packageId=${packageItem.id}`);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Loading test packages...</Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-2xl font-bold text-pink-400">
            STI Testing Packages
          </Text>
        </View>
        <Text className="text-pink-300 text-base">
          Choose the right package for your needs
        </Text>
      </View>

      <View className="flex-1 px-6">
        <View className="space-y-6 flex flex-col gap-3">
          {testPackages.map((pkg) => {
            const packageStyle = getPackageStyle(pkg.name);
            return (
              <LinearGradient
                key={pkg.id}
                colors={packageStyle.colors as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="relative rounded-2xl px-6 py-3 shadow-lg overflow-hidden"
              >
                <View className="absolute inset-0 opacity-10">
                  <View className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full" />
                  <View className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full" />
                </View>

                <View className="absolute top-4 left-4">
                  <View
                    className={`${packageStyle.badgeColor} px-3 py-1 rounded-full`}
                  >
                    <Text className="text-xs font-bold">
                      {packageStyle.badge}
                    </Text>
                  </View>
                </View>

                <View className="relative mt-10">
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-1">
                      <Text className="text-white text-xl font-bold">
                        {pkg.name}
                      </Text>
                      <Text className="text-white/80 text-base mt-1">
                        {pkg.tests?.length || 0} Indicators
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-white text-2xl font-bold">
                        {formatPrice(pkg.price)}
                      </Text>
                      <Text className="text-white/80 text-lg">VND</Text>
                    </View>
                  </View>

                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={() => handleViewDetails(pkg)}
                      className="flex-1 bg-white/20 backdrop-blur-sm py-3 px-4 rounded-xl items-center flex-row justify-center gap-2"
                    >
                      <Text className="text-white text-lg">ⓘ</Text>
                      <Text className="text-white font-semibold">
                        View Details
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleBookNow(pkg)}
                      className="flex-1 bg-white py-3 px-4 rounded-xl items-center justify-center"
                    >
                      <Text className="text-gray-800 font-semibold">
                        Book Now
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            );
          })}
        </View>

        {/* Bottom spacing */}
        <View className="h-6" />
      </View>
    </ScrollView>
  );
}
