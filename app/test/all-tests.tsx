import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { testPackageApi } from "../../apis";
import { TestDetail, TestPackageItem, TypeOfTest } from "../../models";

export default function AllTestsPage() {
  const nav = useNavigation();
  console.log("Navigation object:", nav);
  const router = useRouter();
  const [testPackages, setTestPackages] = useState<TestPackageItem[]>([]);
  const [typeOfTests, setTypeOfTests] = useState<TypeOfTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});

  const packages = [
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
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [packagesResponse, typesResponse] = await Promise.all([
        testPackageApi.getAllTestPackages(),
        testPackageApi.getTypeOfTests(),
      ]);

      setTestPackages(packagesResponse.data || []);
      setTypeOfTests(typesResponse.data || []);

      // Initialize expanded sections
      const initialExpanded: { [key: string]: boolean } = {};
      typesResponse.data?.forEach((typeOfTest, index) => {
        initialExpanded[typeOfTest.name] = index === 0; // Expand first section only
      });
      setExpandedSections(initialExpanded);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPackageColor = (packageName: string) => {
    const pkg = packages.find(
      (p) =>
        packageName.toLowerCase().includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().includes(packageName.toLowerCase())
    );
    return pkg?.colors || packages[0].colors;
  };

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const isTestInPackage = (
    testId: number,
    packageItem: TestPackageItem
  ): boolean => {
    return packageItem.tests.some((test) => test.id === testId);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading all tests...</Text>
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
              onPress={() => router.back()}
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
            <View
              key={typeOfTest.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* Category Header */}
              <TouchableOpacity
                onPress={() => toggleSection(typeOfTest.name)}
                className="w-full px-6 py-4 bg-pink-400 flex-row items-center justify-between"
              >
                <View className="flex-1">
                  <Text className="text-white font-bold text-lg">
                    {typeOfTest.name}
                  </Text>
                  <Text className="text-pink-100 text-sm">
                    ({typeOfTest.tests?.length || 0} tests)
                  </Text>
                </View>
                <Text
                  className={`text-white text-xl transform transition-transform ${
                    expandedSections[typeOfTest.name] ? "rotate-180" : ""
                  }`}
                >
                  <AntDesign name="arrowdown" size={24} color="#fff" />
                </Text>
              </TouchableOpacity>

              {expandedSections[typeOfTest.name] && typeOfTest.tests && (
                <View className="divide-y divide-gray-100">
                  {typeOfTest.tests.map((test: TestDetail) => (
                    <View key={test.id} className="p-4">
                      <View className="flex-row items-start justify-between mb-3">
                        <View className="flex-1">
                          <Text className="font-semibold text-pink-400">
                            {test.name}
                          </Text>
                          <Text className="text-pink-300 text-sm mt-1 leading-relaxed">
                            {test.description}
                          </Text>
                        </View>
                      </View>

                      {/* Package Indicators */}
                      <View className="flex-row items-center gap-2 mt-3">
                        <Text className="text-xs text-pink-300 font-medium">
                          Available in:
                        </Text>
                        <View className="flex-row gap-1">
                          {testPackages.map((pkg) => {
                            const pkgColors = getPackageColor(pkg.name);
                            return (
                              <View
                                key={pkg.id}
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  isTestInPackage(test.id, pkg)
                                    ? ""
                                    : "bg-gray-200"
                                }`}
                                style={
                                  isTestInPackage(test.id, pkg)
                                    ? { backgroundColor: pkgColors[0] }
                                    : {}
                                }
                              >
                                {isTestInPackage(test.id, pkg) && (
                                  <Text className="text-white text-xs">✓</Text>
                                )}
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Bottom spacing */}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
