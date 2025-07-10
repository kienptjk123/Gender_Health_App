import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";

export default function TestTab() {
  const [completedTests, setCompletedTests] = useState<string[]>([]);

  const handleCompleteTest = (testId: string) => {
    setCompletedTests((prev) => [...prev, testId]);
  };

  const testPackages = [
    {
      id: "fertility-assessment",
      title: "Fertility Assessment",
      description:
        "Comprehensive fertility evaluation and personalized insights",
      icon: "🌸",
      duration: "15 min",
      questions: 25,
      color: "bg-pink-50",
      borderColor: "border-pink-200",
      textColor: "text-pink-600",
      buttonColor: "bg-pink-500",
      category: "Fertility",
    },
    {
      id: "period-health",
      title: "Period Health Check",
      description:
        "Analyze your menstrual cycle patterns and health indicators",
      icon: "🩸",
      duration: "10 min",
      questions: 20,
      color: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-600",
      buttonColor: "bg-red-500",
      category: "Menstrual Health",
    },
    {
      id: "mood-tracker",
      title: "Mood & Hormone Balance",
      description: "Track your emotional patterns and hormonal changes",
      icon: "😊",
      duration: "12 min",
      questions: 18,
      color: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-600",
      buttonColor: "bg-yellow-500",
      category: "Mental Health",
    },
    {
      id: "lifestyle-assessment",
      title: "Lifestyle Assessment",
      description: "Evaluate your daily habits and their impact on health",
      icon: "🏃‍♀️",
      duration: "20 min",
      questions: 30,
      color: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-600",
      buttonColor: "bg-green-500",
      category: "Lifestyle",
    },
    {
      id: "nutrition-check",
      title: "Nutrition Check",
      description: "Analyze your dietary patterns and nutritional needs",
      icon: "🥗",
      duration: "8 min",
      questions: 15,
      color: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-600",
      buttonColor: "bg-emerald-500",
      category: "Nutrition",
    },
    {
      id: "sleep-quality",
      title: "Sleep Quality Test",
      description: "Assess your sleep patterns and quality",
      icon: "🌙",
      duration: "6 min",
      questions: 12,
      color: "bg-indigo-50",
      borderColor: "border-indigo-200",
      textColor: "text-indigo-600",
      buttonColor: "bg-indigo-500",
      category: "Sleep",
    },
  ];

  const categories = [
    "All",
    "Fertility",
    "Menstrual Health",
    "Mental Health",
    "Lifestyle",
    "Nutrition",
    "Sleep",
  ];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTests =
    activeCategory === "All"
      ? testPackages
      : testPackages.filter((test) => test.category === activeCategory);

  return (
    <ScrollView className="flex-1 px-6 py-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-800">Health Tests</Text>
        <TouchableOpacity className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
          <Text className="text-blue-500 font-bold">📊</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Overview */}
      <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-3">
          Your Progress
        </Text>
        <View className="flex-row justify-between items-center">
          <View className="items-center">
            <Text className="text-2xl font-bold text-blue-500">
              {completedTests.length}
            </Text>
            <Text className="text-gray-600 text-sm">Completed</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-orange-500">
              {testPackages.length - completedTests.length}
            </Text>
            <Text className="text-gray-600 text-sm">Remaining</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-green-500">
              {Math.round((completedTests.length / testPackages.length) * 100)}%
            </Text>
            <Text className="text-gray-600 text-sm">Progress</Text>
          </View>
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-6"
      >
        <View className="flex-row space-x-3">
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full ${
                activeCategory === category ? "bg-blue-500" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  activeCategory === category ? "text-white" : "text-gray-700"
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Test Packages */}
      <View className="space-y-4">
        {filteredTests.map((test) => {
          const isCompleted = completedTests.includes(test.id);

          return (
            <View
              key={test.id}
              className={`${test.color} rounded-xl p-4 border ${
                test.borderColor
              } ${isCompleted ? "opacity-75" : ""}`}
            >
              <View className="flex-row items-start">
                <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-4">
                  <Text className="text-2xl">{test.icon}</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="font-bold text-gray-800 flex-1">
                      {test.title}
                    </Text>
                    {isCompleted && (
                      <View className="bg-green-500 rounded-full w-6 h-6 items-center justify-center">
                        <Text className="text-white text-xs">✓</Text>
                      </View>
                    )}
                  </View>
                  <Text
                    className="text-gray-600 text-sm mb-3"
                    numberOfLines={2}
                  >
                    {test.description}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Text className={`text-xs ${test.textColor} mr-4`}>
                        ⏱️ {test.duration}
                      </Text>
                      <Text className={`text-xs ${test.textColor}`}>
                        ❓ {test.questions} questions
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleCompleteTest(test.id)}
                      disabled={isCompleted}
                      className={`${
                        isCompleted ? "bg-gray-400" : test.buttonColor
                      } px-4 py-2 rounded-full`}
                    >
                      <Text className="text-white text-sm font-medium">
                        {isCompleted ? "Completed" : "Start Test"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Recommendations */}
      <Text className="text-lg font-semibold text-gray-800 mb-4 mt-6">
        Recommended for You
      </Text>
      <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <View className="flex-row items-center mb-3">
          <Text className="text-2xl mr-3">🎯</Text>
          <Text className="font-semibold text-gray-800 flex-1">
            Personalized Health Insights
          </Text>
        </View>
        <Text className="text-gray-600 text-sm mb-4">
          Based on your profile, we recommend starting with the Fertility
          Assessment and Period Health Check for the most comprehensive
          insights.
        </Text>
        <TouchableOpacity className="bg-purple-500 rounded-lg p-3 items-center">
          <Text className="text-white font-medium">Get My Recommendations</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
