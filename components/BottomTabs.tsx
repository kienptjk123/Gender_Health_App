import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import React from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabIcon = ({
  iconName,
  iconFamily,
  name,
  focused,
}: {
  iconName: string;
  iconFamily: "Ionicons" | "MaterialIcons" | "FontAwesome5";
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

  const getIconComponent = () => {
    const iconProps = {
      name: iconName as any,
      size: 20,
      color: focused ? "#ffffff" : "#6b7280",
    };

    switch (iconFamily) {
      case "Ionicons":
        return <Ionicons {...iconProps} />;
      case "MaterialIcons":
        return <MaterialIcons {...iconProps} />;
      case "FontAwesome5":
        return <FontAwesome5 {...iconProps} />;
      default:
        return <Ionicons {...iconProps} />;
    }
  };

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
          {getIconComponent()}
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
      iconName: "home",
      iconFamily: "Ionicons" as const,
      route: "/",
      isActive: pathname === "/" || pathname.includes("/(tabs)"),
    },
    {
      name: "Cycle",
      iconName: "flower",
      iconFamily: "Ionicons" as const,
      route: "/(tabs)/menstrualCycle",
      isActive: pathname.includes("/menstrualCycle"),
    },
    {
      name: "Blog",
      iconName: "library",
      iconFamily: "Ionicons" as const,
      route: "/(tabs)/blog",
      isActive: pathname.includes("/blog"),
    },
    {
      name: "Forum",
      iconName: "forum",
      iconFamily: "MaterialIcons" as const,
      route: "/(tabs)/forum",
      isActive: pathname.includes("/forum"),
    },
    {
      name: "Test",
      iconName: "flask",
      iconFamily: "FontAwesome5" as const,
      route: "/(tabs)/test",
      isActive: pathname.includes("/test"),
    },
    {
      name: "Profile",
      iconName: "person",
      iconFamily: "Ionicons" as const,
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
          <TabIcon
            iconName={tab.iconName}
            iconFamily={tab.iconFamily}
            name={tab.name}
            focused={tab.isActive}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
