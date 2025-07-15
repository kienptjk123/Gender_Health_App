import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import React from "react";
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TabIcon = ({
  iconName,
  iconFamily,
  name,
  focused,
  animatedValue,
}: {
  iconName: string;
  iconFamily: "Ionicons" | "MaterialIcons" | "FontAwesome5";
  name: string;
  focused: boolean;
  animatedValue: Animated.Value;
}) => {
  // Interpolate values for smooth animation
  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -2],
  });

  const iconOpacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 0.8, 1],
  });

  const backgroundScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const textScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

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
          opacity: iconOpacity,
        }}
        className="items-center"
      >
        <Animated.View
          style={{
            transform: [{ scale: backgroundScale }],
            backgroundColor: focused ? "#f472b6" : "transparent",
          }}
          className="w-10 h-10 rounded-xl items-center justify-center"
        >
          {getIconComponent()}
        </Animated.View>
        <Animated.Text
          style={{
            transform: [{ scale: textScale }],
            color: focused ? "#ec4899" : "#6b7280",
          }}
          className="text-xs font-medium"
        >
          {name}
        </Animated.Text>
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
      name: "Test",
      iconName: "flask",
      iconFamily: "FontAwesome5" as const,
      route: "/(tabs)/test",
      isActive: pathname.includes("/test"),
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
      name: "Profile",
      iconName: "person",
      iconFamily: "Ionicons" as const,
      route: "/(tabs)/profile",
      isActive: pathname.includes("/profile"),
    },
  ];

  // Animation values for each tab
  const tabAnimations = React.useRef(
    tabs.map(() => new Animated.Value(0))
  ).current;

  // Sliding indicator animation
  const slideAnimation = React.useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = React.useState(0);

  // Press feedback animations
  const pressAnimations = React.useRef(
    tabs.map(() => new Animated.Value(1))
  ).current;

  // Update animations when pathname changes
  React.useEffect(() => {
    const currentIndex = tabs.findIndex((tab) => tab.isActive);
    if (currentIndex !== -1 && currentIndex !== activeIndex) {
      const previousIndex = activeIndex;
      setActiveIndex(currentIndex);

      // Animate slide indicator with smooth spring
      Animated.spring(slideAnimation, {
        toValue: currentIndex,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();

      // Animate out previous tab
      if (previousIndex !== -1) {
        Animated.timing(tabAnimations[previousIndex], {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }

      // Animate in new tab with stagger effect
      const delay = Math.abs(currentIndex - previousIndex) * 50;
      setTimeout(() => {
        Animated.spring(tabAnimations[currentIndex], {
          toValue: 1,
          useNativeDriver: true,
          tension: 120,
          friction: 8,
        }).start();
      }, delay);
    }
  }, [pathname, activeIndex, tabs, tabAnimations, slideAnimation]);

  // Initialize animations
  React.useEffect(() => {
    const currentIndex = tabs.findIndex((tab) => tab.isActive);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
      slideAnimation.setValue(currentIndex);
      tabAnimations[currentIndex].setValue(1);
    }
  }, []);

  const handleTabPress = (route: string, index: number) => {
    // Press feedback animation
    Animated.sequence([
      Animated.timing(pressAnimations[index], {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pressAnimations[index], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate
    router.push(route as any);
  };

  // Calculate indicator position
  const tabWidth = SCREEN_WIDTH / tabs.length;
  const indicatorTranslateX = slideAnimation.interpolate({
    inputRange: tabs.map((_, index) => index),
    outputRange: tabs.map((_, index) => index * tabWidth),
  });

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
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        position: "relative",
      }}
    >
      <View style={{ flexDirection: "row", flex: 1 }}>
        {tabs.map((tab, index) => (
          <Animated.View
            key={index}
            style={{
              flex: 1,
              transform: [{ scale: pressAnimations[index] }],
            }}
          >
            <TouchableOpacity
              onPress={() => handleTabPress(tab.route, index)}
              style={{ flex: 1 }}
              activeOpacity={0.7}
            >
              <TabIcon
                iconName={tab.iconName}
                iconFamily={tab.iconFamily}
                name={tab.name}
                focused={tab.isActive}
                animatedValue={tabAnimations[index]}
              />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}
