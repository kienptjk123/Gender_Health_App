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
        "Meet some of the millions of people who used MyFlo to support them on their paths to parenthood.",
      gradient: ["#fda4af", "#f9a8d4"] as const,
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
      backgroundColor="#fda4af"
      statusBarStyle="light-content"
      edges={["top", "bottom", "left", "right"]}
    >
      <LinearGradient colors={currentSlideData.gradient} className="flex-1">
        <View className="flex-1">
          {/* Main content */}
          <View className="flex-1 px-6 pt-16">
            {currentSlide === 0 ? (
              // First slide - Doctor with pink theme
              <View className="flex-1">
                <View className="flex-1 items-center justify-center">
                  <View className="w-80 h-96 bg-pink-300 rounded-3xl items-center justify-center mb-8 shadow-2xl">
                    {/* Doctor image */}
                    <View className="w-64 h-72 bg-white rounded-2xl items-center justify-center shadow-lg overflow-hidden">
                      <Image
                        source={require("@/assets/images/preview-removebg-preview.png")}
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
              // Second slide - Mom and baby with pink theme
              <View className="flex-1">
                <View className="flex-1 relative pt-8">
                  {/* Title */}
                  <View className="px-6 mb-8">
                    <Text className="text-4xl font-bold text-white mb-2">
                      Meet
                    </Text>
                    <Text className="text-4xl font-bold text-white">
                      our moms!
                    </Text>
                  </View>

                  {/* Main image area */}
                  <View className="flex-1 items-center justify-center relative px-6">
                    {/* Main mom and baby */}
                    <View className="w-72 h-80 items-center justify-center relative">
                      <View className="bg-white rounded-3xl p-4 shadow-lg overflow-hidden">
                        <Image
                          source={require("@/assets/images/Screenshot_2025-07-12_132615-removebg-preview (1).png")}
                          className="w-64 h-72"
                          resizeMode="cover"
                        />
                      </View>
                    </View>

                    {/* Floating profile circles - clean white circles */}
                    <View className="absolute top-20 left-8">
                      <View className="w-14 h-14 bg-white rounded-full border-3 border-pink-200 shadow-md"></View>
                    </View>
                    <View className="absolute top-32 right-12">
                      <View className="w-12 h-12 bg-white rounded-full border-2 border-pink-200 shadow-md"></View>
                    </View>
                    <View className="absolute bottom-40 right-8">
                      <View className="w-10 h-10 bg-white rounded-full border-2 border-pink-200 shadow-md"></View>
                    </View>
                    <View className="absolute bottom-60 left-12">
                      <View className="w-11 h-11 bg-white rounded-full border-2 border-pink-200 shadow-md"></View>
                    </View>

                    {/* Curved connecting line */}
                    <View className="absolute bottom-52 left-20">
                      <View className="flex-row">
                        <View className="w-1 h-1 bg-white/60 rounded-full mx-1"></View>
                        <View className="w-1 h-1 bg-white/60 rounded-full mx-1"></View>
                        <View className="w-1 h-1 bg-white/60 rounded-full mx-1"></View>
                      </View>
                    </View>
                  </View>

                  {/* Description and button */}
                  <View className="pb-8 px-6">
                    <Text className="text-base text-white text-center mb-8 leading-6 opacity-90">
                      {currentSlideData.description}
                    </Text>

                    {/* Dots indicator */}
                    <View className="flex-row justify-center items-center mb-8">
                      <View className="w-2 h-2 bg-white/50 rounded-full mx-1"></View>
                      <View className="w-8 h-2 bg-white rounded-full mx-1"></View>
                    </View>

                    <TouchableOpacity
                      className="bg-white rounded-2xl py-4 mx-2 shadow-lg"
                      onPress={handleGetStarted}
                    >
                      <Text className="text-pink-500 text-center text-lg font-semibold">
                        Next
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
