import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { menstrualApi } from "@/apis/menstrual.api";
import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import { Controller, useForm } from "react-hook-form";

const mainSymptoms = [
  { value: "Fatigue", label: "Fatigue", icon: "flash" },
  { value: "Cramps", label: "Cramps", icon: "fitness" },
  { value: "Headache", label: "Headache", icon: "medkit" },
  { value: "Bloating", label: "Bloating", icon: "alert-circle" },
  { value: "Breast Tenderness", label: "Breast Tenderness", icon: "heart" },
  { value: "Mood Changes", label: "Mood Changes", icon: "happy" },
];

interface Props {
  menstrualCycleId: number;
  onNext: () => void;
  onSkipAll?: () => void;
}

export default function Symptoms({
  menstrualCycleId,
  onNext,
  onSkipAll,
}: Props) {
  const [selectedSymptom, setSelectedSymptom] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      description: "",
    },
  });

  const onSubmit = async (data: any) => {
    if (!selectedSymptom) return;

    const payload = {
      menstrual_cycle_id: menstrualCycleId,
      date: data.date,
      symptomType: selectedSymptom,
      description: data.description,
    };

    try {
      setIsSubmitting(true);
      await menstrualApi.createSymptom(payload);
      onNext();
    } catch (error) {
      console.error("❌ Error submitting symptom data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white ">
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 40 }}>
        <View className="bg-pink-500 p-5 rounded-2xl shadow-md mb-6 flex-row items-center space-x-4">
          <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4  ">
            <Ionicons name="heart" size={20} color="#fff" />
          </View>
          <View>
            <Text className="text-white text-lg font-semibold">
              Daily Symptoms
            </Text>
            <Text className="text-pink-100 text-sm">
              Track your symptoms today
            </Text>
          </View>
        </View>

        {/* Date */}
        <View className="mb-5">
          <Text className="text-gray-700 font-medium mb-1">Date</Text>
          <Controller
            control={control}
            name="date"
            rules={{ required: "Date is required" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="YYYY-MM-DD"
                className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 text-base"
              />
            )}
          />
        </View>

        {/* Symptom Buttons */}
        <Text className="text-gray-700 font-medium mb-3 text-base">
          Select Symptom
        </Text>
        <View className="flex-row flex-wrap justify-center gap-3 mb-6">
          {mainSymptoms.map(({ value, label, icon }) => {
            const isSelected = value === selectedSymptom;
            return (
              <TouchableOpacity
                key={value}
                onPress={() => setSelectedSymptom(value)}
                className={clsx(
                  "w-[30%] h-16 rounded-xl items-center justify-center border-2",
                  isSelected
                    ? "bg-pink-500 border-transparent"
                    : "bg-gray-50 border-gray-200"
                )}
              >
                <Ionicons
                  name={icon as any}
                  size={18}
                  color={isSelected ? "#fff" : "#dc007f"}
                />
                <Text
                  className={clsx(
                    "text-xs mt-1 text-center",
                    isSelected ? "text-white" : "text-gray-800"
                  )}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Description */}
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              multiline
              numberOfLines={3}
              value={value}
              onChangeText={onChange}
              placeholder="Describe your symptoms..."
              className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 text-sm mb-6"
            />
          )}
        />

        {/* Actions */}
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
            disabled={isSubmitting || !selectedSymptom}
            className={clsx(
              "flex-1 py-3 rounded-xl items-center",
              selectedSymptom ? "bg-pink-500" : "bg-gray-300",
              isSubmitting && "opacity-60"
            )}
          >
            {isSubmitting ? (
              <Ionicons name="reload" size={20} color="white" />
            ) : (
              <>
                <Text className="text-white text-sm font-medium mb-2">
                  Save Symptom
                </Text>
                <Ionicons name="heart" size={16} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
