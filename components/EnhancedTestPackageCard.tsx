import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { EnhancedTestPackage, TypeOfTest } from "../models/testPackage";

interface EnhancedTestPackageCardProps {
  testPackage: EnhancedTestPackage;
  relatedTests: TypeOfTest[];
  onPress: (packageId: number) => void;
}

export const EnhancedTestPackageCard: React.FC<
  EnhancedTestPackageCardProps
> = ({ testPackage, relatedTests, onPress }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Format price in VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VND";
  };

  // Get test count
  const testCount = testPackage.tests.length;

  return (
    <View className="mx-4 mb-4">
      {/* Main Package Card */}
      <TouchableOpacity
        className={`p-6 rounded-2xl shadow-lg border-2 ${testPackage.bgColor} ${testPackage.checkColor}`}
        onPress={() => onPress(testPackage.id)}
      >
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              {testPackage.icon && (
                <Text className="text-2xl mr-3">
                  {String(testPackage.icon)}
                </Text>
              )}
              <View>
                <Text
                  className={`text-xl font-bold ${testPackage.checkColor?.replace(
                    "border-",
                    "text-"
                  )}`}
                >
                  {String(testPackage.name || "")}
                </Text>
                <Text className="text-sm text-gray-500 font-medium">
                  {testCount} Indicators
                </Text>
              </View>
            </View>
          </View>
          <View className="items-end">
            <Text
              className={`text-2xl font-bold ${testPackage.checkColor?.replace(
                "border-",
                "text-"
              )}`}
            >
              {formatPrice(testPackage.price)}
            </Text>
            <TouchableOpacity
              className={`mt-2 px-4 py-2 rounded-full ${testPackage.checkColor
                ?.replace("border-", "bg-")
                .replace("text-", "bg-")}`}
              onPress={() => onPress(testPackage.id)}
            >
              <Text className="text-white font-semibold text-sm">Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-gray-600 text-base mb-4 leading-relaxed">
          {String(testPackage.description || "")}
        </Text>

        {/* Toggle Details Button */}
        <TouchableOpacity
          className="bg-gray-100 py-2 px-4 rounded-lg"
          onPress={() => setShowDetails(!showDetails)}
        >
          <Text className="text-gray-700 text-center font-medium">
            {showDetails ? "▲ Hide Details" : "▼ Show Test Details"}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Expandable Test Details */}
      {showDetails && (
        <View className="bg-gray-800 rounded-b-2xl p-4 -mt-2">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white font-bold text-lg">
              {testPackage.name} ({testCount} Indicators)
            </Text>
            <TouchableOpacity onPress={() => setShowDetails(false)}>
              <Text className="text-gray-400 text-2xl">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Individual Tests */}
          {testPackage.tests.map((test, index) => (
            <View key={test.id} className="mb-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-white font-medium flex-1">
                  {String(test.name || "")}
                </Text>
                <View className="flex-row space-x-2">
                  {/* Package indicators - show which packages include this test */}
                  <View className="w-4 h-4 bg-green-500 rounded-full" />
                  <View className="w-4 h-4 bg-blue-500 rounded-full" />
                  <View className="w-4 h-4 bg-orange-500 rounded-full" />
                  <View className="w-4 h-4 bg-purple-500 rounded-full" />
                </View>
              </View>
              {test.description && (
                <Text className="text-gray-300 text-sm mt-1">
                  {String(test.description)}
                </Text>
              )}
            </View>
          ))}

          {/* Related Test Types */}
          {relatedTests.length > 0 && (
            <View className="mt-4 pt-4 border-t border-gray-600">
              <Text className="text-white font-medium mb-2">
                Related Test Panels:
              </Text>
              {relatedTests.map((typeOfTest) => (
                <View key={typeOfTest.id} className="mb-2">
                  <Text className="text-blue-300 font-medium">
                    {String(typeOfTest.name || "")}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    {String(typeOfTest.description || "")}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Book Button */}
          <TouchableOpacity
            className="bg-orange-500 py-3 rounded-lg mt-4"
            onPress={() => onPress(testPackage.id)}
          >
            <Text className="text-white text-center font-bold">Book Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
