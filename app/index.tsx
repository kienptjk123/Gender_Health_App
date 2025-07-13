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
      title: "Gender Health Care App",
      subtitle: "Professional Gender Health Services",
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
    <>
      {currentSlide === 0 ? (
        <SafeArea
          statusBarStyle="light-content"
          backgroundColor="#fda4af"
          edges={["top", "bottom", "left", "right"]}
        >
          <LinearGradient colors={currentSlideData.gradient} className="flex-1">
            <View className="flex-1">
              <View className="flex-1">
                <View className="flex-1  px-6 pt-16">
                  <View className="flex-1 items-center justify-center">
                    <View className="w-80 h-[300px] rounded-3xl items-center justify-center mb-8 shadow-2xl">
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
                    <Text className="text-3xl font-bold text-white text-center mb-4">
                      {currentSlideData.title}
                    </Text>
                    <Text className="text-lg text-white text-center mb-2 px-4 font-medium">
                      {currentSlideData.subtitle}
                    </Text>
                    <Text className="text-base text-white text-center mb-8 px-4 opacity-90">
                      {currentSlideData.description}
                    </Text>

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
              </View>
            </View>
          </LinearGradient>
        </SafeArea>
      ) : (
        <SafeArea
          statusBarStyle="light-content"
          backgroundColor="#FFCBD7"
          edges={["top", "bottom", "left", "right"]}
        >
          <LinearGradient colors={currentSlideData.gradient} className="flex-1">
            <View className="flex-1">
              <View className="flex-1">
                <View className="flex-1">
                  <View className="flex-1 relative">
                    <View className="flex-1 items-center justify-center relative">
                      <View className="w-full h-[350px] items-center justify-center relative">
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
                      <Text className="text-xl text-gray-800 text-center mb-4 leading-6 font-bold">
                        Connect with millions of mothers
                      </Text>
                      <Text className="text-base text-gray-700 text-center mb-6 leading-6">
                        {currentSlideData.description}
                      </Text>

                      {/* Features */}
                      <View className="mb-6 space-y-3">
                        <View className="flex-row items-center justify-center mb-2">
                          <Text className="text-yellow-500 text-lg mr-2">
                            🌟
                          </Text>
                          <Text className="text-gray-800 text-center font-semibold">
                            Expert advice and support
                          </Text>
                        </View>
                        <View className="flex-row items-center justify-center mb-2">
                          <Text className="text-pink-500 text-lg mr-2">💝</Text>
                          <Text className="text-gray-800 text-center font-semibold">
                            Safe and caring community
                          </Text>
                        </View>
                        <View className="flex-row items-center justify-center">
                          <Text className="text-blue-500 text-lg mr-2">📱</Text>
                          <Text className="text-gray-800 text-center font-semibold">
                            24/7 support and resources
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row justify-center items-center mb-8">
                        <View className="w-2 h-2 bg-white rounded-full mx-1"></View>
                        <View className="w-8 h-2 bg-white/50 rounded-full mx-1"></View>
                      </View>

                      <TouchableOpacity
                        className="bg-white rounded-2xl py-4 mx-2 shadow-lg border border-gray-200"
                        onPress={handleGetStarted}
                      >
                        <Text className="text-pink-500 text-center text-lg font-bold">
                          Join Our Community
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </SafeArea>
      )}
    </>
  );
}
