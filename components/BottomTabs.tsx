import React from "react";
import { View, TouchableOpacity, Text, Animated } from "react-native";
import { router, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabIcon = ({
  icon,
  name,
  focused,
}: {
  icon: string;
  name: string;
  focused: boolean;
}) => {
  const scale = React.useRef(new Animated.Value(1)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1.1 : 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(translateY, {
        toValue: focused ? -2 : 0,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();
  }, [focused, scale, translateY]);

  return (
    <View className="items-center justify-center flex-1">
      <Animated.View
        style={{
          transform: [{ scale }, { translateY }],
        }}
        className="items-center"
      >
        <View
          className={`w-10 h-10 rounded-2xl items-center justify-center mb-1 ${
            focused ? "bg-pink-500" : "bg-transparent"
          }`}
        >
          <Text className={`text-lg ${focused ? "" : "opacity-70"}`}>
            {icon}
          </Text>
        </View>
        <Text
          className={`text-xs font-medium ${
            focused ? "text-pink-500" : "text-gray-500"
          }`}
        >
          {name}
        </Text>
      </Animated.View>
    </View>
  );
};

export default function BottomTabs() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const tabs = [
    {
      name: "Home",
      icon: "🏠",
      route: "/",
      isActive: pathname === "/" || pathname.includes("/(tabs)"),
    },
    {
      name: "Calendar",
      icon: "🗓️",
      route: "/(tabs)/calendar",
      isActive: pathname.includes("/calendar"),
    },
    {
      name: "Analysis",
      icon: "📊",
      route: "/(tabs)/analysis",
      isActive: pathname.includes("/analysis"),
    },
    {
      name: "Health",
      icon: "❤️",
      route: "/(tabs)/health",
      isActive: pathname.includes("/health"),
    },
    {
      name: "Explore",
      icon: "🔍",
      route: "/(tabs)/explore",
      isActive: pathname.includes("/explore"),
    },
    {
      name: "Profile",
      icon: "👤",
      route: "/(tabs)/profile",
      isActive: pathname.includes("/profile"),
    },
  ];

  return (
    <View
      style={{
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        height: 80 + Math.max(insets.bottom, 10),
        paddingBottom: Math.max(insets.bottom, 10),
        paddingTop: 10,
        paddingHorizontal: 16,
        flexDirection: "row",
      }}
    >
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => router.push(tab.route as any)}
          className="flex-1"
        >
          <TabIcon icon={tab.icon} name={tab.name} focused={tab.isActive} />
        </TouchableOpacity>
      ))}
    </View>
  );
}
