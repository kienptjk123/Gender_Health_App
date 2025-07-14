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
        toValue: focused ? -1 : 0,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();
  }, [focused, scale, translateY]);

  const getIconComponent = () => {
    const iconProps = {
      name: iconName as any,
      size: 18,
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
          className={`w-8 h-8 rounded-xl items-center justify-center ${
            focused ? "bg-pink-400" : "bg-transparent"
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
      name: "Chatbot",
      iconName: "chatbubbles",
      iconFamily: "Ionicons" as const,
      route: "/(tabs)/chatbot",
      isActive: pathname.includes("/chatbot"),
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
        borderTopWidth: 0.5,
        borderTopColor: "#eeeaea",
        height: 50 + Math.max(insets.bottom, 3),
        paddingBottom: Math.max(insets.bottom, 3),
        paddingTop: 3,
        paddingHorizontal: 16,
        flexDirection: "row",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
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
