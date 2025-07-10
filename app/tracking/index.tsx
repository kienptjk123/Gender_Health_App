import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrackingIndex() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl font-bold">Period Tracking</Text>
        <Text className="text-gray-600 mt-2">Track your menstrual cycle</Text>
      </View>
    </SafeAreaView>
  );
}
