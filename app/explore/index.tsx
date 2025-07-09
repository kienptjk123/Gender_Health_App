import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ExploreTab() {
  const exploreCategories = [
    {
      title: "Articles",
      icon: "📰",
      description: "Read health articles and tips",
      color: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Community",
      icon: "👥",
      description: "Connect with other women",
      color: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Experts",
      icon: "👩‍⚕️",
      description: "Ask health professionals",
      color: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Resources",
      icon: "📚",
      description: "Educational resources",
      color: "bg-pink-50",
      textColor: "text-pink-600",
    },
  ];

  const featuredArticles = [
    {
      title: "Understanding Your Menstrual Cycle",
      category: "Education",
      readTime: "5 min",
      image: "🩸",
    },
    {
      title: "Managing Period Pain Naturally",
      category: "Health Tips",
      readTime: "3 min",
      image: "🌿",
    },
    {
      title: "Fertility Awareness Methods",
      category: "Family Planning",
      readTime: "7 min",
      image: "🤱",
    },
  ];

  return (
    <ScrollView className="flex-1 px-6 py-4">
      {/* Header */}
      <Text className="text-2xl font-bold text-gray-800 mb-6">Explore</Text>

      {/* Categories */}
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Categories
      </Text>
      <View className="flex-row flex-wrap justify-between mb-6">
        {exploreCategories.map((category, index) => (
          <TouchableOpacity
            key={index}
            className={`w-[48%] ${category.color} rounded-xl p-4 mb-3`}
          >
            <Text className="text-3xl mb-2">{category.icon}</Text>
            <Text className={`font-semibold ${category.textColor} mb-1`}>
              {category.title}
            </Text>
            <Text className="text-gray-600 text-xs">
              {category.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Featured Articles */}
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Featured Articles
      </Text>
      <View className="space-y-3 mb-6">
        {featuredArticles.map((article, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <View className="flex-row items-center mb-3">
              <Text className="text-2xl mr-3">{article.image}</Text>
              <View className="flex-1">
                <Text className="font-medium text-gray-800 mb-1">
                  {article.title}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-xs text-pink-500 bg-pink-50 px-2 py-1 rounded mr-2">
                    {article.category}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {article.readTime} read
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <Text className="font-semibold text-gray-800 mb-3">Quick Actions</Text>
        <View className="space-y-2">
          <TouchableOpacity className="bg-pink-50 rounded-lg p-3 flex-row items-center justify-between">
            <Text className="text-pink-600 font-medium">Ask a Question</Text>
            <Text className="text-pink-600">❓</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-blue-50 rounded-lg p-3 flex-row items-center justify-between">
            <Text className="text-blue-600 font-medium">Join Community</Text>
            <Text className="text-blue-600">👥</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-green-50 rounded-lg p-3 flex-row items-center justify-between">
            <Text className="text-green-600 font-medium">
              Book Consultation
            </Text>
            <Text className="text-green-600">📅</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
