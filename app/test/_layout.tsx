import { Stack } from "expo-router";

export default function TestLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="package-details" options={{ headerShown: false }} />
      <Stack.Screen name="all-tests" options={{ headerShown: false }} />
      <Stack.Screen name="booking" options={{ headerShown: false }} />
    </Stack>
  );
}
