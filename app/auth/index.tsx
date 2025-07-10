import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthIndex() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl font-bold">Authentication</Text>
        <Text className="text-gray-600 mt-2">Choose your authentication option</Text>
      </View>
    </SafeAreaView>
  );
}
