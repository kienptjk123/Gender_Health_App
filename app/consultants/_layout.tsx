import { Stack } from "expo-router";

export default function ConsultantsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="all"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
