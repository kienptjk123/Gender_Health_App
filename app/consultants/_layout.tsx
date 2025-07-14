import { Stack } from "expo-router";

export default function ConsultantsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="all" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
