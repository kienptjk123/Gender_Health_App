import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { authService } from "@/apis";
import { menstrualApi } from "@/apis/menstrual.api";
import { FormData } from "@/models/MenstrualModels/cycleInput.type";

export default function CycleInput({
  onNext,
}: {
  onNext: (id: number) => void;
}) {
  const [form, setForm] = useState<FormData>({
    startDate: "",
    cycleLength: 28,
    periodLength: 5,
  });
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authService.getUserProfile();
        const profile = res.result;
        if (!profile?.id) throw new Error("Invalid profile");
        setProfileId(profile.id);
      } catch (err) {
        console.error("❌ Error loading profile:", err);
        Toast.show({
          type: "error",
          text1: "Failed to load profile",
          text2: "Please login again or check connection",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (key: keyof FormData, value: string) => {
    setForm({
      ...form,
      [key]: key === "startDate" ? value : parseInt(value) || 0,
    });
  };

  const handleDateChange = (_: any, date?: Date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const formatted = `${yyyy}-${mm}-${dd}`;
      handleChange("startDate", formatted);
    }
  };
  const handleSubmit = async () => {
    if (!profileId) {
      Toast.show({
        type: "error",
        text1: "User not found",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await menstrualApi.createMenstrualCycle({
        customer_profile_id: profileId,
        ...form,
      });

      const cycleId = response.data?.id;
      if (cycleId) {
        onNext(cycleId); // 👉 Chuyển ngay sang bước tiếp theo
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-rose-50">
        <ActivityIndicator size="large" color="#ec4899" />
        <Text className="text-gray-600 mt-2">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-rose-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6 pt-10 pb-20"
        >
          <View className="items-center mb-6 justify-center">
            <View className="w-16 h-16 bg-pink-200 rounded-full items-center justify-center shadow-md">
              <Feather name="heart" size={28} color="#ec4899" />
            </View>
            <Text className="text-2xl font-bold text-pink-500 mt-4">
              Track Your Cycle
            </Text>
            <Text className="text-base text-gray-600 text-center mt-2">
              Fill in a few quick details to help us personalize your
              experience.
            </Text>
          </View>

          <View className="bg-white rounded-xl p-5 shadow-md">
            <Text className="text-base text-gray-700 mb-1">Start Date</Text>
            <TouchableOpacity
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
              onPress={() => setShowPicker(true)}
            >
              <Text className="text-base text-gray-800">
                {form.startDate || "Select Date"}
              </Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}

            <Text className="text-base text-gray-700 mb-1">
              Average Cycle Length (days)
            </Text>
            <TextInput
              placeholder="28"
              keyboardType="numeric"
              value={String(form.cycleLength)}
              onChangeText={(v) => handleChange("cycleLength", v)}
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base"
            />

            <Text className="text-base text-gray-700 mb-1">
              Period Length (days)
            </Text>
            <TextInput
              placeholder="5"
              keyboardType="numeric"
              value={String(form.periodLength)}
              onChangeText={(v) => handleChange("periodLength", v)}
              className="border border-gray-300 rounded-xl px-4 py-3 mb-6 text-base"
            />

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submitting}
              className={`rounded-full py-4 ${
                submitting ? "bg-pink-300" : "bg-pink-500"
              }`}
            >
              <Text className="text-white text-center text-lg font-semibold">
                {submitting ? "Saving..." : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
