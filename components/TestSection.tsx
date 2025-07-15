import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { TestDetail, TestPackageItem } from "../models";

interface TestSectionProps {
  typeOfTest: {
    id: number;
    name: string;
    tests?: TestDetail[];
  };
  isExpanded: boolean;
  onToggle: () => void;
  testPackages: TestPackageItem[];
  testPackageMap: Record<number, Set<number>>;
  packageColorMap: Record<number, string>;
}

const TestSection = memo(
  ({
    typeOfTest,
    isExpanded,
    onToggle,
    testPackages,
    testPackageMap,
    packageColorMap,
  }: TestSectionProps) => {
    const isTestInPackage = (testId: number, packageId: number): boolean => {
      return testPackageMap[packageId]?.has(testId) || false;
    };

    return (
      <View className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Category Header */}
        <TouchableOpacity
          onPress={onToggle}
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
              isExpanded ? "rotate-180" : ""
            }`}
          >
            <AntDesign name="arrowdown" size={24} color="#fff" />
          </Text>
        </TouchableOpacity>

        {isExpanded && typeOfTest.tests && (
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
                      const isIncluded = isTestInPackage(test.id, pkg.id);
                      const color = packageColorMap[pkg.id];
                      return (
                        <View
                          key={pkg.id}
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            !isIncluded ? "bg-gray-200" : ""
                          }`}
                          style={isIncluded ? { backgroundColor: color } : {}}
                        >
                          {isIncluded && (
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
    );
  }
);

TestSection.displayName = "TestSection";

export default TestSection;
