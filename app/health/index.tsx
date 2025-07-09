import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HealthTab() {
  const healthCategories = [
    {
      title: "Symptoms",
      icon: "🩺",
      items: ["Headache", "Cramps", "Bloating", "Fatigue"],
      color: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      title: "Medications",
      icon: "💊",
      items: ["Birth Control", "Pain Relief", "Vitamins", "Supplements"],
      color: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Activities",
      icon: "🏃‍♀️",
      items: ["Exercise", "Yoga", "Walking", "Swimming"],
      color: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Wellness",
      icon: "🧘‍♀️",
      items: ["Meditation", "Sleep", "Hydration", "Self-care"],
      color: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  const todayLogs = [
    { type: "symptom", name: "Mild Cramps", time: "2:30 PM", severity: "Low" },
    {
      type: "medication",
      name: "Birth Control Pill",
      time: "8:00 AM",
      taken: true,
    },
    {
      type: "activity",
      name: "Morning Yoga",
      time: "7:00 AM",
      duration: "30 min",
    },
    {
      type: "wellness",
      name: "Meditation",
      time: "9:00 PM",
      duration: "15 min",
    },
  ];

  const getLogIcon = (type: string) => {
    switch (type) {
      case "symptom":
        return "🩺";
      case "medication":
        return "💊";
      case "activity":
        return "🏃‍♀️";
      case "wellness":
        return "🧘‍♀️";
      default:
        return "📝";
    }
  };

  return (
    <ScrollView className="flex-1 px-6 py-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-800">
          Health Tracking
        </Text>
        <TouchableOpacity className="w-10 h-10 bg-pink-100 rounded-full items-center justify-center">
          <Text className="text-pink-500 font-bold">+</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Add Categories */}
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Quick Add
      </Text>
      <View className="flex-row flex-wrap justify-between mb-6">
        {healthCategories.map((category, index) => (
          <TouchableOpacity
            key={index}
            className={`w-[48%] ${category.color} rounded-xl p-4 mb-3`}
          >
            <Text className="text-2xl mb-2">{category.icon}</Text>
            <Text className={`font-semibold ${category.textColor} mb-1`}>
              {category.title}
            </Text>
            <Text className="text-gray-600 text-xs">
              Tap to log {category.title.toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Today's Logs */}
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Today&apos;s Logs
      </Text>
      <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        {todayLogs.length > 0 ? (
          <View className="space-y-3">
            {todayLogs.map((log, index) => (
              <View
                key={index}
                className="flex-row items-center justify-between py-2"
              >
                <View className="flex-row items-center flex-1">
                  <Text className="text-xl mr-3">{getLogIcon(log.type)}</Text>
                  <View className="flex-1">
                    <Text className="font-medium text-gray-800">
                      {log.name}
                    </Text>
                    <Text className="text-gray-600 text-sm">{log.time}</Text>
                  </View>
                </View>
                <View className="items-end">
                  {log.type === "symptom" && (
                    <Text className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
                      {(log as any).severity}
                    </Text>
                  )}
                  {log.type === "medication" && (
                    <Text className="text-xs text-green-500">
                      {(log as any).taken ? "✓ Taken" : "Missed"}
                    </Text>
                  )}
                  {(log.type === "activity" || log.type === "wellness") && (
                    <Text className="text-xs text-gray-500">
                      {(log as any).duration}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="items-center py-8">
            <Text className="text-4xl mb-2">📝</Text>
            <Text className="text-gray-600">No logs for today</Text>
            <Text className="text-gray-500 text-sm">
              Start tracking your health!
            </Text>
          </View>
        )}
      </View>

      {/* Health Insights */}
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Health Insights
      </Text>
      <View className="space-y-3 mb-6">
        <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-2">
            <Text className="text-xl mr-2">💧</Text>
            <Text className="font-semibold text-gray-800">Hydration</Text>
          </View>
          <Text className="text-gray-600 text-sm mb-3">
            You&apos;ve had 6/8 glasses of water today
          </Text>
          <View className="bg-gray-200 rounded-full h-2">
            <View
              className="bg-blue-400 rounded-full h-2"
              style={{ width: "75%" }}
            />
          </View>
        </View>

        <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-2">
            <Text className="text-xl mr-2">😴</Text>
            <Text className="font-semibold text-gray-800">Sleep Quality</Text>
          </View>
          <Text className="text-gray-600 text-sm mb-3">
            Average 7.5 hours this week
          </Text>
          <View className="flex-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <Text key={star} className="text-yellow-400 text-lg">
                {star <= 4 ? "⭐" : "☆"}
              </Text>
            ))}
          </View>
        </View>

        <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-2">
            <Text className="text-xl mr-2">🏃‍♀️</Text>
            <Text className="font-semibold text-gray-800">Activity Level</Text>
          </View>
          <Text className="text-gray-600 text-sm mb-3">
            3 workouts this week - Keep it up!
          </Text>
          <View className="bg-gray-200 rounded-full h-2">
            <View
              className="bg-green-400 rounded-full h-2"
              style={{ width: "60%" }}
            />
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <Text className="font-semibold text-gray-800 mb-3">Quick Actions</Text>
        <View className="space-y-2">
          <TouchableOpacity className="bg-pink-50 rounded-lg p-3 flex-row items-center justify-between">
            <Text className="text-pink-600 font-medium">
              Set Medication Reminder
            </Text>
            <Text className="text-pink-600">⏰</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-blue-50 rounded-lg p-3 flex-row items-center justify-between">
            <Text className="text-blue-600 font-medium">
              View Health Report
            </Text>
            <Text className="text-blue-600">📊</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-green-50 rounded-lg p-3 flex-row items-center justify-between">
            <Text className="text-green-600 font-medium">
              Share with Doctor
            </Text>
            <Text className="text-green-600">👩‍⚕️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
