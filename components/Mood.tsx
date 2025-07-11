import { menstrualApi } from "@/apis/menstrual.api";
import { MoodData, MoodProps } from "@/models";
import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const moodOptions = [
  { value: "Happy", iconLabel: "Happy", icon: "😄" },
  { value: "Sad", iconLabel: "Sad", icon: "😢" },
  { value: "Irritated", iconLabel: "Irritated", icon: "😠" },
  { value: "Calm", iconLabel: "Calm", icon: "😌" },
  { value: "Anxious", iconLabel: "Anxious", icon: "😰" },
  { value: "Engergetic", iconLabel: "Engergetic", icon: "😚" },
];
const Mood: React.FC<MoodProps> = ({ menstrualCycleId, onNext, onSkipAll }) => {
  const [selectedMood, setSelectedMood] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = async (data: any) => {
    if (!selectedMood || !menstrualCycleId) return;

    const payload: MoodData = {
      menstrual_cycle_id: menstrualCycleId,
      moodType: selectedMood,
      description: data.description,
    };

    try {
      setIsSubmitting(true);
      await menstrualApi.createMood(payload);
      onNext?.();
    } catch (error) {
      // giữ lại màn hình nếu lỗi
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Header */}
        <View className="bg-yellow-500 p-5 rounded-2xl shadow-md mb-6 flex-row items-center space-x-4">
          <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
            <Ionicons name="happy" size={24} color="#fff" />
          </View>
          <View>
            <Text className="text-white text-lg font-semibold">
              Mood Tracker
            </Text>
            <Text className="text-yellow-100 text-sm">
              How are you feeling today?
            </Text>
          </View>
        </View>

        {/* Mood selection */}
        <Text className="text-gray-700 font-medium mb-2">Select Mood</Text>
        <View className="flex-row flex-wrap gap-3 mb-4">
          {moodOptions.map(({ value, icon, iconLabel }) => {
            const isSelected = value === selectedMood;
            return (
              <TouchableOpacity
                key={value}
                onPress={() => setSelectedMood(value)}
                className={clsx(
                  "w-[30%] h-16 rounded-xl items-center justify-center border-2",
                  isSelected
                    ? "bg-yellow-500 border-transparent"
                    : "bg-gray-50 border-gray-200"
                )}
              >
                <Text className="text-2xl">{icon}</Text>
                <Text
                  className={clsx(
                    "text-xs mt-1",
                    isSelected ? "text-white" : "text-gray-800"
                  )}
                >
                  {iconLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Description */}
        <Text className="text-gray-700 font-medium mb-1">Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              multiline
              numberOfLines={3}
              value={value}
              onChangeText={onChange}
              placeholder="Write more about your mood..."
              className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 text-sm mb-6"
            />
          )}
        />

        {/* Buttons */}
        <View className="flex-row gap-4 justify-center">
          <TouchableOpacity
            onPress={onSkipAll}
            className="flex-1 bg-gray-100 py-3 rounded-xl items-center"
            disabled={isSubmitting}
          >
            <Ionicons name="play-forward" size={20} color="#555" />
            <Text className="text-gray-700 text-sm mt-1">Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting || !selectedMood}
            className={clsx(
              "flex-1 py-3 rounded-xl items-center",
              selectedMood ? "bg-yellow-500" : "bg-gray-300",
              isSubmitting && "opacity-60"
            )}
          >
            {isSubmitting ? (
              <Ionicons name="reload" size={20} color="white" />
            ) : (
              <>
                <Text className="text-white text-sm font-medium">Save</Text>
                <Ionicons name="happy" size={16} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Mood;
