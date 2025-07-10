import React, { useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

export default function PaymentWebview() {
  const { paymentUrl, orderId, amount } = useLocalSearchParams<{
    paymentUrl: string;
    orderId: string;
    amount: string;
  }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleNavigation = async (navState: any) => {
    const url = navState.url;
    console.log("🔄 [Payment WebView] Navigation to:", url);

    // Check for success URL patterns
    if (
      url.includes("/payment/success") ||
      url.includes("/payment-success") ||
      url.includes("success=true")
    ) {
      console.log("✅ [Payment WebView] Payment success detected");

      try {
        // Verify payment status with backend
        if (orderId) {
          // You could verify payment here
          // const verification = await paymentApi.verifyPayment(orderId);
          // if (verification.success) {
          Toast.show({
            type: "success",
            text1: "Payment Successful!",
            text2: "Your booking has been confirmed.",
          });
          router.replace("/payment/success" as any);
          // }
        } else {
          router.replace("/payment/success" as any);
        }
      } catch (error) {
        console.error("❌ [Payment WebView] Verification failed:", error);
        Toast.show({
          type: "error",
          text1: "Payment verification failed",
          text2: "Please contact support if money was deducted.",
        });
        router.replace("/payment/failed" as any);
      }
    }
    // Check for failure URL patterns
    else if (
      url.includes("/payment/failed") ||
      url.includes("/payment-failed") ||
      url.includes("success=false")
    ) {
      console.log("❌ [Payment WebView] Payment failure detected");
      Toast.show({
        type: "error",
        text1: "Payment Failed",
        text2: "Your payment was not processed.",
      });
      router.replace("/payment/failed" as any);
    }
    // Check for cancel URL patterns
    else if (
      url.includes("/payment/cancel") ||
      url.includes("/payment-cancel") ||
      url.includes("cancel=true")
    ) {
      console.log("⚠️ [Payment WebView] Payment cancelled");
      Toast.show({
        type: "info",
        text1: "Payment Cancelled",
        text2: "You can try again later.",
      });
      router.back();
    }
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = (error: any) => {
    console.error("❌ [Payment WebView] Error:", error);
    setError("Failed to load payment page");
    setLoading(false);
  };

  const handleGoBack = () => {
    Alert.alert(
      "Cancel Payment?",
      "Are you sure you want to cancel this payment?",
      [
        {
          text: "Continue Payment",
          style: "cancel",
        },
        {
          text: "Cancel",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]
    );
  };

  if (!paymentUrl) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="text-lg font-semibold text-gray-800 mt-4 text-center">
          Payment URL not found
        </Text>
        <Text className="text-gray-600 mt-2 text-center">
          Unable to process payment. Please try again.
        </Text>
        <TouchableOpacity
          className="mt-6 bg-blue-500 px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="text-lg font-semibold text-gray-800 mt-4 text-center">
          Payment Error
        </Text>
        <Text className="text-gray-600 mt-2 text-center">{error}</Text>
        <View className="flex-row space-x-4 mt-6">
          <TouchableOpacity
            className="bg-gray-500 px-6 py-3 rounded-lg"
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-blue-500 px-6 py-3 rounded-lg"
            onPress={() => {
              setError(null);
              setLoading(true);
            }}
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header with cancel button */}
      <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={handleGoBack}
          className="flex-row items-center space-x-2"
        >
          <Ionicons name="close-outline" size={24} color="#6b7280" />
          <Text className="text-gray-600 font-medium">Cancel</Text>
        </TouchableOpacity>

        {amount && (
          <View className="flex-row items-center space-x-2">
            <Text className="text-gray-600">Amount:</Text>
            <Text className="font-semibold text-pink-600">
              {parseInt(amount).toLocaleString("vi-VN")} VND
            </Text>
          </View>
        )}
      </View>

      {/* WebView */}
      <WebView
        source={{ uri: decodeURIComponent(paymentUrl) }}
        onNavigationStateChange={handleNavigation}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        startInLoadingState={true}
        renderLoading={() => (
          <View className="flex-1 items-center justify-center bg-white">
            <ActivityIndicator size="large" color="#f472b6" />
            <Text className="mt-4 text-gray-600">Loading payment page...</Text>
          </View>
        )}
        style={{ flex: 1 }}
        // Security settings
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        // Navigation settings
        allowsBackForwardNavigationGestures={false}
        pullToRefreshEnabled={false}
      />

      {/* Loading overlay */}
      {loading && (
        <View className="absolute inset-0 bg-white items-center justify-center">
          <ActivityIndicator size="large" color="#f472b6" />
          <Text className="mt-4 text-gray-600">Loading payment page...</Text>
        </View>
      )}
    </View>
  );
}
