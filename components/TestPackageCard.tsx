import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TestPackageItem } from "../models/testPackage";

interface TestPackageCardProps {
  testPackage: TestPackageItem;
  onPress: (packageId: string) => void;
}

export const TestPackageCard: React.FC<TestPackageCardProps> = ({
  testPackage,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className={`mx-4 mb-4 p-6 rounded-2xl shadow-lg border-2 ${
        testPackage.bgColor || "bg-white"
      } ${testPackage.checkColor || "border-gray-200"}`}
      onPress={() => onPress(testPackage.id)}
    >
      <View className="flex-row items-start justify-between mb-4">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            {testPackage.icon && (
              <Text className="text-2xl mr-3">{String(testPackage.icon)}</Text>
            )}
            <Text
              className={`text-xl font-bold ${
                testPackage.checkColor || "text-gray-800"
              }`}
            >
              {String(testPackage.name || "")}
            </Text>
          </View>
          {testPackage.category && (
            <View className="mb-2">
              <Text className="text-sm text-gray-500 font-medium">
                {String(testPackage.category || "")}
              </Text>
            </View>
          )}
        </View>
        <View className="items-end">
          <Text
            className={`text-2xl font-bold ${
              testPackage.checkColor || "text-gray-800"
            }`}
          >
            ${String(testPackage.price || 0)}
          </Text>
        </View>
      </View>

      <Text className="text-gray-600 text-base mb-4 leading-relaxed">
        {String(testPackage.description || "")}
      </Text>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center space-x-4">
          {testPackage.duration && (
            <View className="flex-row items-center">
              <Text className="text-gray-500 text-sm">
                ⏱️ {String(testPackage.duration || "")}
              </Text>
            </View>
          )}
          {testPackage.questions && (
            <View className="flex-row items-center">
              <Text className="text-gray-500 text-sm">
                ❓ {String(testPackage.questions || 0)} questions
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          className={`px-6 py-2 rounded-full ${
            testPackage.checkColor
              ?.replace("border-", "bg-")
              .replace("text-", "bg-") || "bg-blue-500"
          }`}
          onPress={() => onPress(testPackage.id)}
        >
          <Text className="text-white font-semibold">Book Now</Text>
        </TouchableOpacity>
      </View>

      {testPackage.tests && testPackage.tests.length > 0 && (
        <View className="mt-4 pt-4 border-t border-gray-200">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Includes tests:
          </Text>
          <View className="flex-row flex-wrap">
            {testPackage.tests.map((test, index) => (
              <View
                key={index}
                className="bg-gray-100 rounded-lg px-3 py-1 mr-2 mb-2"
              >
                <Text className="text-xs text-gray-600">
                  {String(test || "")}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};
