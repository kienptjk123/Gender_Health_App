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
  const { paymentUrl, amount } = useLocalSearchParams<{
    paymentUrl: string;
    orderId: string;
    amount: string;
  }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to safely parse URL parameters
  const parseUrlParams = (url: string) => {
    try {
      const urlParts = url.split("?");
      if (urlParts.length < 2) return new URLSearchParams();
      return new URLSearchParams(urlParts[1]);
    } catch (error) {
      console.error(
        "❌ [Payment WebView] Error parsing URL parameters:",
        error
      );
      return new URLSearchParams();
    }
  };

  const handleNavigation = async (navState: any) => {
    const url = navState.url;
    console.log("🔄 [Payment WebView] Navigation to:", url);

    // Parse URL parameters to check VNPay response
    const urlParams = parseUrlParams(url);
    const vnpResponseCode = urlParams.get("vnp_ResponseCode");
    const vnpTransactionStatus = urlParams.get("vnp_TransactionStatus");
    const vnpAmount = urlParams.get("vnp_Amount");
    const vnpOrderInfo = urlParams.get("vnp_OrderInfo");

    console.log("🔍 [Payment WebView] VNPay Response Code:", vnpResponseCode);
    console.log(
      "🔍 [Payment WebView] VNPay Transaction Status:",
      vnpTransactionStatus
    );
    console.log("🔍 [Payment WebView] VNPay Amount:", vnpAmount);
    console.log("🔍 [Payment WebView] VNPay Order Info:", vnpOrderInfo);

    // Check for VNPay success (response code 00 and transaction status 00)
    if (
      (vnpResponseCode === "00" && vnpTransactionStatus === "00") ||
      url.includes("/payment/success") ||
      url.includes("/payment-success") ||
      url.includes("success=true") ||
      url.includes("vnp_ResponseCode=00")
    ) {
      console.log("✅ [Payment WebView] Payment success detected");
      try {
        Toast.show({
          type: "success",
          text1: "Payment Successful! 🎉",
          text2: "Your payment has been processed successfully.",
          position: "top",
          visibilityTime: 3000,
        });

        // Navigate to success page
        setTimeout(() => {
          router.replace("/payment/success" as any);
        }, 1500);
      } catch (error) {
        console.error("❌ [Payment WebView] Success navigation error:", error);
        Toast.show({
          type: "error",
          text1: "Payment verification failed",
          text2: "Please contact support if money was deducted.",
        });
        router.replace("/payment/failed" as any);
      }
    }
    // Check for VNPay failure
    else if (
      (vnpResponseCode && vnpResponseCode !== "00") ||
      (vnpTransactionStatus && vnpTransactionStatus !== "00") ||
      url.includes("/payment/failed") ||
      url.includes("/payment-failed") ||
      url.includes("success=false")
    ) {
      console.log("❌ [Payment WebView] Payment failure detected");
      console.log("❌ [Payment WebView] Response Code:", vnpResponseCode);
      console.log(
        "❌ [Payment WebView] Transaction Status:",
        vnpTransactionStatus
      );

      Toast.show({
        type: "error",
        text1: "Payment Failed",
        text2: "Your payment was not processed successfully.",
        position: "top",
        visibilityTime: 4000,
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
        position: "top",
        visibilityTime: 3000,
      });
      router.back();
    }
    // Check if we're on the return URL (even if it has network error)
    else if (url.includes("/payment/vnpay/return")) {
      console.log(
        "🔄 [Payment WebView] On VNPay return URL, checking parameters..."
      );
      // This will be handled by the parameter checking above
    }
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = (error: any) => {
    console.error("❌ [Payment WebView] Error:", error);

    // Check if this is a network error on the return URL
    const nativeEvent = error.nativeEvent;
    if (nativeEvent && nativeEvent.url) {
      const errorUrl = nativeEvent.url;
      console.log("🔍 [Payment WebView] Error URL:", errorUrl);

      // If error is on VNPay return URL, check the parameters
      if (errorUrl.includes("/payment/vnpay/return")) {
        console.log(
          "🔄 [Payment WebView] Network error on return URL, checking parameters..."
        );

        try {
          const urlParams = parseUrlParams(errorUrl);
          const vnpResponseCode = urlParams.get("vnp_ResponseCode");
          const vnpTransactionStatus = urlParams.get("vnp_TransactionStatus");

          console.log(
            "🔍 [Payment WebView] Error URL Response Code:",
            vnpResponseCode
          );
          console.log(
            "🔍 [Payment WebView] Error URL Transaction Status:",
            vnpTransactionStatus
          );

          // Check if payment was actually successful despite network error
          if (vnpResponseCode === "00" && vnpTransactionStatus === "00") {
            console.log(
              "✅ [Payment WebView] Payment was successful despite network error"
            );
            Toast.show({
              type: "success",
              text1: "Payment Successful! 🎉",
              text2: "Your payment has been processed successfully.",
              position: "top",
              visibilityTime: 3000,
            });

            setTimeout(() => {
              router.replace("/payment/success" as any);
            }, 1500);
            return;
          } else if (vnpResponseCode && vnpResponseCode !== "00") {
            console.log(
              "❌ [Payment WebView] Payment failed with response code:",
              vnpResponseCode
            );
            Toast.show({
              type: "error",
              text1: "Payment Failed",
              text2: "Your payment was not processed successfully.",
              position: "top",
              visibilityTime: 4000,
            });
            router.replace("/payment/failed" as any);
            return;
          }
        } catch (parseError) {
          console.error(
            "❌ [Payment WebView] Error parsing URL parameters:",
            parseError
          );
        }
      }
    }

    // Default error handling
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

      <Toast />
    </View>
  );
}
