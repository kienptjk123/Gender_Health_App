import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  InteractionManager,
} from "react-native";
import { testPackageApi } from "../../apis";
import { TestPackageItem, TypeOfTest } from "../../models";
import TestSection from "../../components/TestSection";

export default function AllTestsPage() {
  const router = useRouter();
  
  // Debug router context
  useEffect(() => {
    console.log("=== Router Context Debug ===");
    console.log("Router available:", !!router);
    console.log("Router back function:", typeof router?.back);
    console.log("Router push function:", typeof router?.push);
  }, [router]);

  const [testPackages, setTestPackages] = useState<TestPackageItem[]>([]);
  const [typeOfTests, setTypeOfTests] = useState<TypeOfTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});

  // Debounce timer for toggle function
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

  const packages = useMemo(
    () => [
      {
        name: "Basic",
        colors: ["#2dd4bf", "#0891b2"],
        badge: "AFFORDABLE",
        badgeColor: "bg-teal-100 text-teal-800",
      },
      {
        name: "Advanced",
        colors: ["#fb923c", "#ea580c"],
        badge: "RECOMMENDED",
        badgeColor: "bg-orange-100 text-orange-800",
      },
      {
        name: "Premium",
        colors: ["#3b82f6", "#1d4ed8"],
        badge: "POPULAR",
        badgeColor: "bg-yellow-100 text-yellow-800",
      },
      {
        name: "Pre-marital",
        colors: ["#8b5cf6", "#6d28d9"],
        badge: "COMPREHENSIVE",
        badgeColor: "bg-purple-100 text-purple-800",
      },
    ],
    []
  );

  useEffect(() => {
    fetchData();
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const fetchData = async () => {
    try {
      console.log("=== Fetching Test Data ===");
      setLoading(true);
      const [packagesResponse, typesResponse] = await Promise.all([
        testPackageApi.getAllTestPackages(),
        testPackageApi.getTypeOfTests(),
      ]);

      console.log("Packages response:", packagesResponse?.data?.length || 0);
      console.log("Types response:", typesResponse?.data?.length || 0);

      setTestPackages(packagesResponse.data || []);
      setTypeOfTests(typesResponse.data || []);

      // Initialize expanded sections
      const initialExpanded: { [key: string]: boolean } = {};
      typesResponse.data?.forEach((typeOfTest, index) => {
        initialExpanded[typeOfTest.name] = index === 0; // Expand first section only
      });
      console.log("Initial expanded sections:", initialExpanded);
      setExpandedSections(initialExpanded);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      console.log("=== Data Fetch Complete ===");
      setLoading(false);
    }
  };

  const getPackageColor = useCallback(
    (packageName: string) => {
      const pkg = packages.find(
        (p) =>
          packageName.toLowerCase().includes(p.name.toLowerCase()) ||
          p.name.toLowerCase().includes(packageName.toLowerCase())
      );
      return pkg?.colors || packages[0].colors;
    },
    [packages]
  );

  // Memoized package-test mapping for performance
  const testPackageMap = useMemo(() => {
    const map: Record<number, Set<number>> = {};
    testPackages.forEach((pkg) => {
      map[pkg.id] = new Set(pkg.tests.map((test) => test.id));
    });
    return map;
  }, [testPackages]);

  // Memoized package colors mapping
  const packageColorMap = useMemo(() => {
    const map: Record<number, string> = {};
    testPackages.forEach((pkg) => {
      const color = getPackageColor(pkg.name)[0];
      map[pkg.id] = color;
    });
    return map;
  }, [testPackages, getPackageColor]);

  const toggleSection = useCallback((sectionName: string) => {
    console.log("=== Toggle Section Debug ===");
    console.log("Toggling section:", sectionName);
    console.log("Available typeOfTests:", typeOfTests?.length || 0);
    console.log("Available testPackages:", testPackages?.length || 0);
    console.log("Current expanded sections:", expandedSections);
    console.log("Router available:", !!router);
    
    // Prevent toggle if data not ready
    if (!typeOfTests.length || !testPackages.length) {
      console.warn("Data not ready, skipping toggle");
      return;
    }

    // Clear previous debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Debounce the toggle operation
    const timer = setTimeout(() => {
      try {
        // Use InteractionManager to prevent UI blocking
        InteractionManager.runAfterInteractions(() => {
          console.log("Executing toggle for:", sectionName);
          setExpandedSections((prev) => {
            const newState = {
              ...prev,
              [sectionName]: !prev[sectionName],
            };
            console.log("New expanded state:", newState);
            return newState;
          });
        });
      } catch (error) {
        console.error("Toggle section error:", error);
      }
    }, 100) as unknown as number; // 100ms debounce

    setDebounceTimer(timer);
  }, [typeOfTests, testPackages, expandedSections, router, debounceTimer]);

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading all tests...</Text>
      </View>
    );
  }

  // Prevent render if data not loaded yet
  if (!testPackages.length || !typeOfTests.length) {
    return (
      <View className="flex-1 bg-pink-50 justify-center items-center">
        <View className="bg-white p-8 rounded-3xl shadow-sm">
          <Text className="text-pink-400 text-lg font-semibold text-center">
            No test data available
          </Text>
          <Text className="text-pink-300 text-sm text-center mt-2">
            Please check your connection and try again
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-pink-50">
      {/* Header */}
      <View className="bg-white shadow-sm pt-12 pb-4">
        <View className="px-6">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => {
                console.log("=== Back Button Pressed ===");
                console.log("Router available:", !!router);
                try {
                  router.back();
                } catch (error) {
                  console.error("Back navigation error:", error);
                }
              }}
              className="w-10 h-10 rounded-full bg-pink-100 justify-center items-center shadow-md"
            >
              <Ionicons name="arrow-back" size={24} color="#EC4899" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-xl font-bold text-pink-400">
                Test Details
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Package Legend */}
        <View className="bg-white mx-6 my-4 p-4 rounded-xl shadow-sm">
          <Text className="font-semibold text-pink-400 mb-3">Packages</Text>
          <View className="flex-row flex-wrap gap-4">
            {packages.map((pkg) => (
              <View key={pkg.name} className="flex-row items-center gap-2">
                <View
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: pkg.colors[0] }}
                />
                <Text className="text-sm font-medium text-pink-300">
                  {pkg.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Test Categories */}
        <View className="px-6 space-y-4 flex flex-col gap-2">
          {typeOfTests.map((typeOfTest) => (
            <TestSection
              key={typeOfTest.id}
              typeOfTest={typeOfTest}
              isExpanded={expandedSections[typeOfTest.name] || false}
              onToggle={() => toggleSection(typeOfTest.name)}
              testPackages={testPackages}
              testPackageMap={testPackageMap}
              packageColorMap={packageColorMap}
            />
          ))}
        </View>

        {/* Bottom spacing */}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
