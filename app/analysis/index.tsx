import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AnalysisTab() {
  const { width } = Dimensions.get("window");
  // Mock data for charts
  const cycleData = [28, 30, 27, 29, 28, 31, 28];
  const moodData = [
    { day: "Mon", mood: 4 },
    { day: "Tue", mood: 5 },
    { day: "Wed", mood: 3 },
    { day: "Thu", mood: 4 },
    { day: "Fri", mood: 5 },
    { day: "Sat", mood: 4 },
    { day: "Sun", mood: 3 },
  ];

  const BarChart = ({ data, label }: { data: number[]; label: string }) => {
    const maxValue = Math.max(...data);
    const chartWidth = width - 80;
    const barWidth = chartWidth / data.length - 10;

    return (
      <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          {label}
        </Text>
        <View className="flex-row items-end justify-between h-40">
          {data.map((value, index) => {
            const height = (value / maxValue) * 120;
            return (
              <View key={index} className="items-center">
                <View
                  className="bg-pink-400 rounded-t-md"
                  style={{
                    height: height,
                    width: barWidth,
                    minHeight: 20,
                  }}
                />
                <Text className="text-xs text-gray-600 mt-2">{value}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const MoodChart = () => {
    const moodEmojis = ["😢", "😕", "😐", "😊", "😄"];

    return (
      <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Weekly Mood
        </Text>
        <View className="space-y-3">
          {moodData.map((item, index) => (
            <View key={index} className="flex-row items-center justify-between">
              <Text className="text-gray-600 font-medium w-12">{item.day}</Text>
              <View className="flex-1 mx-4">
                <View className="flex-row">
                  {[1, 2, 3, 4, 5].map((mood) => (
                    <View
                      key={mood}
                      className={`w-6 h-6 rounded-full mr-1 ${
                        mood <= item.mood ? "bg-pink-400" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </View>
              </View>
              <Text className="text-2xl">{moodEmojis[item.mood - 1]}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 px-6 py-4">
      {/* Header */}
      <Text className="text-2xl font-bold text-gray-800 mb-6">
        Health Analysis
      </Text>

      {/* Overview Cards */}
      <View className="flex-row justify-between mb-6">
        <View className="flex-1 bg-white rounded-xl p-4 mr-2 shadow-sm border border-gray-100">
          <Text className="text-2xl font-bold text-pink-500">28</Text>
          <Text className="text-gray-600 text-sm">Avg Cycle</Text>
          <Text className="text-gray-600 text-sm">Length</Text>
        </View>
        <View className="flex-1 bg-white rounded-xl p-4 mx-2 shadow-sm border border-gray-100">
          <Text className="text-2xl font-bold text-blue-500">4.2</Text>
          <Text className="text-gray-600 text-sm">Avg Mood</Text>
          <Text className="text-gray-600 text-sm">Score</Text>
        </View>
        <View className="flex-1 bg-white rounded-xl p-4 ml-2 shadow-sm border border-gray-100">
          <Text className="text-2xl font-bold text-green-500">7</Text>
          <Text className="text-gray-600 text-sm">Cycles</Text>
          <Text className="text-gray-600 text-sm">Tracked</Text>
        </View>
      </View>

      {/* Charts */}
      <BarChart data={cycleData} label="Cycle Length (Last 7 Cycles)" />
      <MoodChart />

      {/* Insights */}
      <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Insights
        </Text>
        <View className="space-y-3">
          <View className="flex-row items-start">
            <Text className="text-green-500 text-lg mr-3">✓</Text>
            <View className="flex-1">
              <Text className="font-medium text-gray-800">Regular Cycles</Text>
              <Text className="text-gray-600 text-sm">
                Your cycles are within normal range (25-35 days)
              </Text>
            </View>
          </View>

          <View className="flex-row items-start">
            <Text className="text-blue-500 text-lg mr-3">💡</Text>
            <View className="flex-1">
              <Text className="font-medium text-gray-800">Mood Patterns</Text>
              <Text className="text-gray-600 text-sm">
                Your mood tends to be higher mid-cycle
              </Text>
            </View>
          </View>

          <View className="flex-row items-start">
            <Text className="text-yellow-500 text-lg mr-3">⚠️</Text>
            <View className="flex-1">
              <Text className="font-medium text-gray-800">
                Track More Symptoms
              </Text>
              <Text className="text-gray-600 text-sm">
                Log more symptoms for better insights
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Export Options */}
      <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Export Data
        </Text>
        <View className="space-y-2">
          <TouchableOpacity className="bg-pink-50 rounded-lg p-3 flex-row items-center justify-between">
            <Text className="text-pink-600 font-medium">Export to PDF</Text>
            <Text className="text-pink-600">📄</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-green-50 rounded-lg p-3 flex-row items-center justify-between">
            <Text className="text-green-600 font-medium">
              Share with Doctor
            </Text>
            <Text className="text-green-600">📧</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
