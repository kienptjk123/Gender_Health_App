import { Stack } from "expo-router";

export default function TestLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="package-details" />
      <Stack.Screen name="all-tests" />
      <Stack.Screen name="booking" />
    </Stack>
  );
}
