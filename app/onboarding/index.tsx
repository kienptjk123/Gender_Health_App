import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingIndex() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl font-bold">Welcome</Text>
        <Text className="text-gray-600 mt-2">Get started with your health journey</Text>
      </View>
    </SafeAreaView>
  );
}
