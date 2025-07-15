import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function VnpayWebview() {
  const { paymentUrl } = useLocalSearchParams<{ paymentUrl: string }>();
  const router = useRouter();

  const handleNavigation = (navState: any) => {
    const url = navState.url;

    const urlParams = new URLSearchParams(url.split("?")[1] || "");
    const responseCode = urlParams.get("vnp_ResponseCode");
    if (
      url.includes("https://genderhealth.io.vn/payment/success") ||
      responseCode === "00"
    ) {
      router.replace("/payment/success");
    } else if (
      url.includes("https://genderhealth.io.vn/payment/failed") ||
      (responseCode && responseCode !== "00")
    ) {
      router.replace("/payment/failed");
    }
  };

  if (!paymentUrl) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: decodeURIComponent(paymentUrl) }}
      onNavigationStateChange={handleNavigation}
      startInLoadingState
      renderLoading={() => (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f472b6" />
        </View>
      )}
    />
  );
}
