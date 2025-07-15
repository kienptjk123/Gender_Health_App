import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useRef } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 0;
const HORIZONTAL_PADDING = 0;
const cardWidth = (width / 1.6 - HORIZONTAL_PADDING - CARD_MARGIN) / 2;

interface HealthService {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  backgroundColor: string;
  gradientColors: string[];
  onPress: () => void;
}

const healthServices: HealthService[] = [
  {
    id: "1",
    title: "Cycle\nTracking",
    icon: "calendar",
    iconColor: "#FFFFFF",
    backgroundColor: "#F59E0B",
    gradientColors: ["#FCD34D", "#F59E0B", "#D97706"],
    onPress: () => {
      router.push("/(tabs)/menstrualCycle");
    },
  },
  {
    id: "2",
    title: "Health\nTest",
    icon: "medical",
    iconColor: "#FFFFFF",
    backgroundColor: "#EF4444",
    gradientColors: ["#F87171", "#EF4444", "#DC2626"],
    onPress: () => {
      router.push("/(tabs)/test");
    },
  },
  {
    id: "3",
    title: "Find\nConsultant",
    icon: "people",
    iconColor: "#FFFFFF",
    backgroundColor: "#06B6D4",
    gradientColors: ["#67E8F9", "#06B6D4", "#0891B2"],
    onPress: () => {
      router.push("/consultants/all");
    },
  },
  {
    id: "4",
    title: "AI Chat",
    icon: "chatbubble-ellipses",
    iconColor: "#FFFFFF",
    backgroundColor: "#3B82F6",
    gradientColors: ["#60A5FA", "#3B82F6", "#1D4ED8"],
    onPress: () => {
      router.push("/(tabs)/chatbot");
    },
  },
  {
    id: "5",
    title: "Blog",
    icon: "newspaper",
    iconColor: "#FFFFFF",
    backgroundColor: "#10B981",
    gradientColors: ["#34D399", "#10B981", "#059669"],
    onPress: () => {
      router.push("/(tabs)/blog");
    },
  },
  {
    id: "6",
    title: "Forum",
    icon: "people-circle",
    iconColor: "#FFFFFF",
    backgroundColor: "#8B5CF6",
    gradientColors: ["#A78BFA", "#8B5CF6", "#7C3AED"],
    onPress: () => {
      router.push("/(tabs)/forum");
    },
  },
];

const HealthServicesSwiper = React.memo(() => {
  const flatListRef = useRef<FlatList<HealthService>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: false,
      })(event);
    },
    [scrollX]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: HealthService; index: number }) => {
      const inputRange = [
        (index - 1) * cardWidth - cardWidth / 2,
        index * cardWidth - cardWidth / 2,
        (index + 1) * cardWidth - cardWidth / 2,
      ];

      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.7, 1.2, 0.7],
        extrapolate: "clamp",
      });

      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.6, 1, 0.6],
        extrapolate: "clamp",
      });

      const translateY = scrollX.interpolate({
        inputRange,
        outputRange: [8, -8, 8],
        extrapolate: "clamp",
      });

      const rotateY = scrollX.interpolate({
        inputRange,
        outputRange: ["-15deg", "0deg", "15deg"],
        extrapolate: "clamp",
      });

      return (
        <Animated.View
          style={[
            {
              transform: [{ scale }, { translateY }, { rotateY }],
              opacity,
            },
          ]}
        >
          <TouchableOpacity
            onPress={item.onPress}
            className="bg-white rounded-xl p-0"
            style={{ width: cardWidth }}
            activeOpacity={0.7}
          >
            <View
              className="p-3 items-center justify-between"
              style={{ minHeight: 140 }}
            >
              <LinearGradient
                colors={item.gradientColors as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-18 h-18 rounded-2xl items-center justify-center mb-4"
                style={{
                  width: 72,
                  height: 72,
                  shadowColor: "#000",
                  shadowOpacity: 0.15,
                  borderRadius: 12, // 2xl in Tailwind is usually 24px
                  overflow: "hidden",
                }}
              >
                <View
                  className="w-16 h-16 rounded-xl items-center justify-center"
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                  }}
                >
                  <Ionicons name={item.icon} size={36} color={item.iconColor} />
                </View>
              </LinearGradient>

              <Text
                className="text-base font-semibold text-gray-900 text-center"
                style={{
                  lineHeight: 20,
                  letterSpacing: -0.3,
                  textShadowColor: "rgba(0, 0, 0, 0.05)",
                  textShadowRadius: 1,
                }}
              >
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [scrollX]
  );

  const renderSeparator = useCallback(
    () => <View style={{ width: CARD_MARGIN }} />,
    []
  );

  return (
    <View>
      <View className="flex-row justify-between items-start mb-5">
        <View>
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Health Services
          </Text>
          <Text className="text-sm text-gray-600 mt-1">
            Comprehensive health care
          </Text>
        </View>
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={healthServices}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: onScroll }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: HORIZONTAL_PADDING }}
        ItemSeparatorComponent={renderSeparator}
        renderItem={renderItem}
        decelerationRate="fast"
        snapToInterval={cardWidth}
        snapToAlignment="start"
      />
    </View>
  );
});

HealthServicesSwiper.displayName = "HealthServicesSwiper";

export default HealthServicesSwiper;
