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
import { bookConsultApi } from "@/apis/bookConsult.api";
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
      <LinearGradient
        colors={["#ec4899", "#f472b6"]}
        className="px-4 pt-4 pb-6"
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>

          <Text className="text-white text-xl font-bold">All Consultants</Text>

          <View className="w-10 h-10" />
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View className="px-4 -mt-6 mb-4">
        <View className="bg-white rounded-2xl shadow-lg flex-row items-center px-4 py-3">
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
            { key: "available", label: "Available", icon: "checkmark-circle" },
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

      {/* Results Count */}
      <View className="px-4 mb-2">
        <Text className="text-gray-600 text-sm">
          {filteredConsultants.length} consultant
          {filteredConsultants.length !== 1 ? "s" : ""} found
        </Text>
      </View>
    </View>
  );

  const renderConsultant = ({ item }: { item: Consultant }) => (
    <View className="px-4 mb-2">
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
