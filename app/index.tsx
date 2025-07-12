import { router } from "expo-router";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { SafeArea } from "@/components/SafeArea";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function WelcomeScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 0,
      title: "Hello Care",
      subtitle: "Professional Healthcare Services",
      description: "Your trusted partner in health and wellness journey.",
      gradient: ["#fda4af", "#f9a8d4"] as const,
    },
    {
      id: 1,
      title: "Meet our moms!",
      subtitle: "Community Support",
      description:
        "Meet some of the millions of people who used Gender Health App to support them on their paths to parenthood.",
      gradient: ["#FFCBD7", "#FFCBD7"] as const,
    },
  ];

  const handleGetStarted = () => {
    if (currentSlide === 0) {
      setCurrentSlide(1);
    } else {
      router.push("/auth/login");
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <SafeArea
      statusBarStyle="light-content"
      edges={["top", "bottom", "left", "right"]}
    >
      <LinearGradient colors={currentSlideData.gradient} className="flex-1">
        <View className="flex-1">
          {/* Main content */}
          <View className="flex-1">
            {currentSlide === 0 ? (
              // First slide - Doctor with pink theme
              <View className="flex-1  px-6 pt-16">
                <View className="flex-1 items-center justify-center">
                  <View className="w-80 h-[300px] rounded-3xl items-center justify-center mb-8 shadow-2xl">
                    {/* Doctor image */}
                    <View className="w-full h-full bg-white rounded-2xl items-center justify-center shadow-lg overflow-hidden">
                      <Image
                        source={require("@/assets/images/1.png")}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>
                  </View>
                </View>

                <View className="pb-8">
                  <Text className="text-4xl font-bold text-white text-center mb-4">
                    {currentSlideData.title}
                  </Text>
                  <Text className="text-lg text-white text-center mb-2 px-4 font-medium">
                    {currentSlideData.subtitle}
                  </Text>
                  <Text className="text-base text-white text-center mb-8 px-4 opacity-90">
                    {currentSlideData.description}
                  </Text>

                  {/* Dots indicator */}
                  <View className="flex-row justify-center items-center mb-8">
                    <View className="w-8 h-2 bg-white rounded-full mx-1"></View>
                    <View className="w-2 h-2 bg-white/50 rounded-full mx-1"></View>
                  </View>

                  <TouchableOpacity
                    className="bg-white rounded-2xl py-4 mx-6 shadow-lg"
                    onPress={handleGetStarted}
                  >
                    <Text className="text-pink-500 text-center text-lg font-semibold">
                      Get Started
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View className="flex-1">
                <View className="flex-1 relative">
                  {/* Title */}
                  <View className="px-6 pt-16 mb-4">
                    <Text className="text-4xl font-bold text-black mb-2">
                      Meet
                    </Text>
                    <Text className="text-4xl font-bold text-black mb-4">
                      our moms!
                    </Text>
                    <Text className="text-lg text-gray-700 text-center mb-4 font-medium">
                      Join Our Community
                    </Text>
                  </View>

                  <View className="flex-1 items-center justify-center relative">
                    {/* Main mom and baby */}
                    <View className="w-full h-[400px] items-center justify-center relative">
                      <View className="w-full h-full overflow-hidden">
                        <Image
                          source={require("@/assets/images/7.png")}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      </View>
                    </View>
                  </View>

                  {/* Description and button */}
                  <View className="pb-8 px-6">
                    <Text className="text-xl text-black text-center mb-4 leading-6 font-semibold">
                      Connect with millions of mothers
                    </Text>
                    <Text className="text-base text-gray-700 text-center mb-8 leading-6">
                      {currentSlideData.description}
                    </Text>

                    {/* Features */}
                    <View className="mb-6">
                      <View className="flex-row items-center justify-center">
                        <Text className="text-pink-500 text-lg mr-2">🌸</Text>
                        <Text className="text-gray-700 text-center">
                          Expert advice and support
                        </Text>
                      </View>
                    </View>

                    {/* Dots indicator */}
                    <View className="flex-row justify-center items-center mb-8">
                      <View className="w-2 h-2 bg-gray-400 rounded-full mx-1"></View>
                      <View className="w-8 h-2 bg-pink-400 rounded-full mx-1"></View>
                    </View>

                    <TouchableOpacity
                      className="bg-[#fda4af] rounded-2xl py-4 mx-2 shadow-lg"
                      onPress={handleGetStarted}
                    >
                      <Text className="text-white text-center text-lg font-semibold">
                        Join Our Community
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </SafeArea>
  );
}
