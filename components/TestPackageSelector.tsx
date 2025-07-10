import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { TestPackageItem, TypeOfTest, TestDetail } from "../models/testPackage";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TestPackageSelectorProps {
  testPackages: TestPackageItem[];
  typeOfTests: TypeOfTest[];
  onBookPackage: (packageId: number) => void;
}

const getPackageColors = (index: number) => {
  const colors = [
    { bg: "bg-green-500", text: "text-white", name: "Basic" },
    { bg: "bg-blue-500", text: "text-white", name: "Advanced" },
    { bg: "bg-orange-500", text: "text-white", name: "Premium" },
    { bg: "bg-purple-500", text: "text-white", name: "Pre-marriage" },
  ];
  return colors[index % colors.length];
};

// Check if a test is included in a package
const isTestInPackage = (
  test: TestDetail,
  packageTests: TestDetail[]
): boolean => {
  return packageTests.some(
    (pkgTest) =>
      pkgTest.code === test.code ||
      pkgTest.name === test.name ||
      pkgTest.id === test.id
  );
};

export const TestPackageSelector: React.FC<TestPackageSelectorProps> = ({
  testPackages,
  typeOfTests,
  onBookPackage,
}) => {
  const [expandedPanels, setExpandedPanels] = useState<{
    [key: number]: boolean;
  }>({});
  const [expandedTests, setExpandedTests] = useState<{
    [key: string]: boolean;
  }>({});

  // Toggle panel expansion with animation
  const togglePanel = (panelId: number) => {
    // Configure smooth animation for panel expansion
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY,
      },
    });

    setExpandedPanels((prev) => ({
      ...prev,
      [panelId]: !prev[panelId],
    }));
  };

  // Toggle individual test details with animation
  const toggleTestDetail = (testKey: string) => {
    // Configure smooth animation for test details
    LayoutAnimation.configureNext({
      duration: 250,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.8,
      },
    });

    setExpandedTests((prev) => ({
      ...prev,
      [testKey]: !prev[testKey],
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const premiumPackage = testPackages.reduce((prev, current) =>
    prev.price > current.price ? prev : current
  );

  const basicPackage = testPackages.find((pkg) =>
    pkg.name.toLowerCase().includes("basic")
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {basicPackage && (
        <View className="mx-4 mb-4 mt-4">
          <View className="bg-green-500 rounded-2xl p-6 relative overflow-hidden">
            {/* Affordable Badge */}
            <View className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full">
              <Text className="text-green-500 text-xs font-bold">
                AFFORDABLE
              </Text>
            </View>

            <View className="flex-row justify-between items-start mt-8">
              <View className="flex-1">
                <Text className="text-white text-2xl font-bold">
                  {basicPackage.name}
                </Text>
                <Text className="text-green-100 text-sm mt-1">
                  {basicPackage.tests.length} Essential Indicators
                </Text>
                <Text className="text-white text-3xl font-bold mt-2">
                  {formatPrice(basicPackage.price)} VND
                </Text>
              </View>

              <TouchableOpacity
                className="bg-white/20 px-6 py-3 rounded-xl"
                onPress={() => onBookPackage(basicPackage.id)}
              >
                <Text className="text-white font-semibold">Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      <View className="mx-4 mb-4">
        <View className="flex-row gap-3 space-x-3">
          {testPackages
            .filter(
              (pkg) =>
                pkg.id !== premiumPackage?.id && pkg.id !== basicPackage?.id
            )
            .map((pkg, index) => {
              const colors = getPackageColors(index);
              return (
                <TouchableOpacity
                  key={pkg.id}
                  className={`flex-1 ${
                    pkg.name === "Advanced"
                      ? "bg-blue-500"
                      : pkg.name === "Premium"
                      ? "bg-orange-500"
                      : "bg-purple-500"
                  } rounded-2xl p-4`}
                  onPress={() => onBookPackage(pkg.id)}
                >
                  <Text className={`text-white text-lg font-bold text-center`}>
                    {pkg.name}
                  </Text>
                  <Text
                    className={`${colors.text.replace(
                      "text-",
                      "text-"
                    )}/80 text-sm text-center mt-1`}
                  >
                    {pkg.tests.length} Indicators
                  </Text>
                  <Text
                    className={`text-white text-xl font-bold text-center mt-2`}
                  >
                    {formatPrice(pkg.price)} VND
                  </Text>

                  <TouchableOpacity
                    className="bg-white/20 py-2 rounded-lg mt-3"
                    onPress={() => onBookPackage(pkg.id)}
                  >
                    <Text className={`text-white text-center font-semibold`}>
                      Book
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
        </View>
      </View>

      {premiumPackage && (
        <View className="mx-4 mb-4">
          <View className="bg-purple-500 rounded-2xl p-6 relative overflow-hidden">
            {/* Popular Badge */}
            <View className="absolute top-4 left-4 bg-yellow-400 px-3 py-1 rounded-full">
              <Text className="text-black text-xs font-bold">POPULAR</Text>
            </View>

            <View className="flex-row justify-between items-start mt-8">
              <View className="flex-1">
                <Text className="text-white text-2xl font-bold">
                  {premiumPackage.name}
                </Text>
                <Text className="text-blue-100 text-sm mt-1">
                  {premiumPackage.tests.length} Indicators
                </Text>
                <Text className="text-white text-3xl font-bold mt-2">
                  {formatPrice(premiumPackage.price)} VND
                </Text>
              </View>

              <TouchableOpacity
                className="bg-white/20 px-6 py-3 rounded-xl"
                onPress={() => onBookPackage(premiumPackage.id)}
              >
                <Text className="text-white font-semibold">Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {typeOfTests.map((typeOfTest) => (
        <View key={typeOfTest.id} className="mx-4 mb-4">
          {/* Panel Header */}
          <TouchableOpacity
            className="bg-gray-800 rounded-t-2xl px-6 py-4 flex-row justify-between items-center active:bg-gray-700 transition-colors duration-200"
            onPress={() => togglePanel(typeOfTest.id)}
          >
            <View className="flex-1">
              <Text className="text-white font-bold text-lg">
                {typeOfTest.name}
              </Text>
              <Text className="text-gray-300 text-sm">
                ({typeOfTest.tests.length} Indicators)
              </Text>
            </View>
            <View className="transform rotate-0 transition-transform duration-300">
              <Text className="text-white text-xl">
                {expandedPanels[typeOfTest.id] ? "▼" : "▶"}
              </Text>
            </View>
          </TouchableOpacity>

          {expandedPanels[typeOfTest.id] && (
            <View className="bg-white overflow-hidden mt-2">
              {typeOfTest.tests.map((test, testIndex) => {
                const testKey = `${typeOfTest.id}-${test.id}`;
                const isTestExpanded = expandedTests[testKey];
                return (
                  <View
                    key={test.id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <TouchableOpacity
                      className="px-6 py-4 flex-row justify-between items-center active:bg-gray-50 transition-colors duration-150"
                      onPress={() => toggleTestDetail(testKey)}
                    >
                      <View className="flex-1 flex-row items-center">
                        <Text className="text-gray-800 font-medium flex-1">
                          {test.name}
                        </Text>

                        <View className="mr-3 transition-transform duration-200">
                          <Text className="text-gray-400 text-xs">
                            {isTestExpanded ? "▼ Details" : "▶ Details"}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row space-x-2">
                        {testPackages.map((pkg, pkgIndex) => {
                          const colors = getPackageColors(pkgIndex);
                          const isIncluded = isTestInPackage(test, pkg.tests);

                          return (
                            <View
                              key={pkg.id}
                              className={`w-6 h-6 rounded-full ${
                                isIncluded
                                  ? colors.bg
                                  : "border-2 border-gray-300 bg-white"
                              } items-center justify-center`}
                            >
                              {isIncluded && (
                                <Text className="text-white text-xs font-bold">
                                  ✓
                                </Text>
                              )}
                            </View>
                          );
                        })}
                      </View>
                    </TouchableOpacity>

                    {isTestExpanded && test.description && (
                      <View className="px-6 pb-4 bg-gray-50 border-t border-gray-200 animate-fade-in">
                        <View className="pt-3 transform transition-all duration-300 ease-out">
                          <Text className="text-gray-500 text-xs font-medium mb-2">
                            DESCRIPTION
                          </Text>
                          <Text className="text-gray-600 text-sm leading-relaxed">
                            {test.description}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};
