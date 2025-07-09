import { Stack } from 'expo-router';

export default function AnalysisLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
