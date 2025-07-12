import { useState } from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  onStart: () => void;
};

export default function CycleStartScreen({ onStart }: Props) {
  const [isLoading] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-pink-50 items-center justify-center px-6">
      <Image
        source={require("../../assets/images/quiz.png")}
        className="w-80 h-80 mb-6"
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold text-center text-pink-500 mb-2">
        Menstrual Cycle
      </Text>
      <Text className="text-base text-gray-600 text-center mb-8">
        Help us understand your cycle better. Answer a few quick questions so we
        can personalize your experience and support your unique rhythm.
      </Text>

      <TouchableOpacity
        className="bg-pink-500 px-6 py-3 rounded-full shadow-lg"
        onPress={onStart}
        disabled={isLoading}
      >
        <Text className="text-white text-lg font-semibold">Start now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
