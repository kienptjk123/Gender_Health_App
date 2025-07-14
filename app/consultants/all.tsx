import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { authService } from "@/apis/auth";
import { bookConsultApi } from "@/apis/bookConsult";
import ConsultantCard from "@/components/ConsultantCard";
import { Consultant } from "@/models/BookingConsultant/bookingConsult.type";

export default function AllConsultantsScreen() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [filteredConsultants, setFilteredConsultants] = useState<Consultant[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerProfileId, setCustomerProfileId] = useState<number | null>(
    null
  );
  const [filter, setFilter] = useState<"all" | "available" | "experienced">(
    "all"
  );

  const fetchConsultants = async () => {
    try {
      const res = await bookConsultApi.getConsultantWorkSchedule();
      setConsultants(res.data);
    } catch (error) {
      console.error("Error fetching consultants:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchConsultants();
    setRefreshing(false);
  };

  const initializeData = useCallback(async () => {
    setLoading(true);
    try {
      // Get user profile
      const profileRes = await authService.getUserProfile();
      const profileId = profileRes.result?.customer_profile_id;
      setCustomerProfileId(profileId);

      // Fetch consultants
      await fetchConsultants();
    } catch (error) {
      console.error("Error initializing data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterConsultants = useCallback(() => {
    let filtered = consultants;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (consultant) =>
          consultant.consultantProfile.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          consultant.consultantProfile.location
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          consultant.consultantProfile.hospital
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          consultant.consultantProfile.languages.some((lang) =>
            lang.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Category filter
    switch (filter) {
      case "available":
        filtered = filtered.filter((consultant) =>
          Object.values(consultant.schedulesByDate).some((schedules) =>
            schedules.some((schedule) => schedule.status === "AVAILABLE")
          )
        );
        break;
      case "experienced":
        filtered = filtered.filter(
          (consultant) => parseInt(consultant.consultantProfile.experience) >= 5
        );
        break;
      default:
        break;
    }

    setFilteredConsultants(filtered);
  }, [consultants, searchQuery, filter]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    filterConsultants();
  }, [filterConsultants]);

  const renderHeader = () => (
    <View>
      {/* Header */}
      <View className="relative h-40">
        <LinearGradient
          colors={["#ec4899", "#f472b6"]}
          className="w-full h-full"
        />
        <LinearGradient
          colors={[
            "transparent",
            "rgba(236, 72, 153, 0.3)",
            "rgba(244, 114, 182, 0.7)",
          ]}
          className="absolute inset-0"
        />

        {/* Header with back button overlay */}
        <View className="absolute top-12 left-0 right-0 flex-row justify-between items-center px-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/90 justify-center items-center shadow-md"
          >
            <Ionicons name="arrow-back" size={24} color="#EC4899" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">
            Find Your Consultant
          </Text>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white/90 justify-center items-center shadow-md">
            <Ionicons name="bookmark-outline" size={24} color="#EC4899" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Container */}
      <View className="bg-white rounded-t-3xl -mt-6 pt-6">
        {/* Search Bar */}
        <View className="px-4 mb-4">
          <View className="bg-gray-50 rounded-2xl flex-row items-center px-4 py-3 border border-gray-100">
            <Ionicons name="search" size={20} color="#6b7280" />
            <TextInput
              placeholder="Search by name, location, hospital..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 text-gray-700"
              placeholderTextColor="#9ca3af"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Tabs */}
        <View className="px-4 mb-4">
          <View className="flex-row space-x-2">
            {[
              { key: "all", label: "All", icon: "people" },
              {
                key: "available",
                label: "Available",
                icon: "checkmark-circle",
              },
              { key: "experienced", label: "Experienced", icon: "star" },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setFilter(tab.key as any)}
                className={`flex-row items-center px-4 py-2 rounded-full ${
                  filter === tab.key ? "bg-pink-500" : "bg-gray-100"
                }`}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={16}
                  color={filter === tab.key ? "white" : "#6b7280"}
                />
                <Text
                  className={`ml-2 font-medium ${
                    filter === tab.key ? "text-white" : "text-gray-600"
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  const renderConsultant = ({ item }: { item: Consultant }) => (
    <View className="px-4 my-2">
      <ConsultantCard
        consultant={item}
        customerProfileId={customerProfileId || 0}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View className="items-center justify-center py-20 px-4">
      <Ionicons name="search" size={80} color="#d1d5db" />
      <Text className="text-gray-500 text-xl font-semibold mt-4">
        No consultants found
      </Text>
      <Text className="text-gray-400 text-center mt-2">
        {searchQuery
          ? `No results for "${searchQuery}". Try adjusting your search.`
          : "No consultants match your current filters."}
      </Text>
      {searchQuery && (
        <TouchableOpacity
          onPress={() => setSearchQuery("")}
          className="bg-pink-500 px-6 py-3 rounded-full mt-4"
        >
          <Text className="text-white font-semibold">Clear Search</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="light-content" />
        {renderHeader()}
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ec4899" />
          <Text className="text-gray-500 mt-4">Loading consultants...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      <FlatList
        data={filteredConsultants}
        renderItem={renderConsultant}
        keyExtractor={(item) => item.consultantProfile.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#ec4899"]}
            tintColor="#ec4899"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
