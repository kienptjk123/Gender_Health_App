import { Stack } from "expo-router";

export default function PaymentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="webview"
        options={{
          title: "Payment",
          headerShown: true,
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="success"
        options={{
          title: "Payment Success",
          headerShown: true,
          headerBackTitle: "Home",
        }}
      />
      <Stack.Screen
        name="failed"
        options={{
          title: "Payment Failed",
          headerShown: true,
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
