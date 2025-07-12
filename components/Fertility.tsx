import { menstrualApi } from "@/apis/menstrual.api";
import { FertilityData, FertilityProps } from "@/models";
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

const mucusOptions = ["Dry", "Sticky", "Creamy", "Eggwhite"];

const Fertility: React.FC<FertilityProps> = ({
  menstrualCycleId,
  onNext,
  onSkipAll,
}) => {
  const [selectedMucus, setSelectedMucus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      temperature: "",
      weight: "",
      description: "",
    },
  });

  const onSubmit = async (data: any) => {
    if (!menstrualCycleId) return;

    const payload: FertilityData = {
      menstrual_cycle_id: menstrualCycleId,
      temperature: parseFloat(data.temperature),
      weight: parseFloat(data.weight),
      description: data.description,
      cervicalMucus: selectedMucus,
    };

    try {
      setIsSubmitting(true);
      await menstrualApi.createFertility(payload);
      onNext?.();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Header */}
        <View className="bg-rose-500 p-5 rounded-2xl shadow-md mb-6 flex-row items-center space-x-4">
          <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4">
            <Ionicons name="water" size={20} color="#fff" />
          </View>
          <View>
            <Text className="text-white text-lg font-semibold">
              Fertility Tracking
            </Text>
            <Text className="text-rose-100 text-sm">
              Record temperature, mucus & notes
            </Text>
          </View>
        </View>

        {/* Temperature */}
        <Text className="text-gray-700 font-medium mb-1">Temperature (°C)</Text>
        <Controller
          control={control}
          name="temperature"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              placeholder="e.g. 36.5"
              className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 mb-4"
            />
          )}
        />

        {/* Weight */}
        <Text className="text-gray-700 font-medium mb-1">Weight (kg)</Text>
        <Controller
          control={control}
          name="weight"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              placeholder="e.g. 52"
              className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 mb-4"
            />
          )}
        />

        {/* Cervical Mucus */}
        <Text className="text-gray-700 font-medium mb-2">Cervical Mucus</Text>
        <View className="flex-row flex-wrap justify-center gap-3 mb-4">
          {mucusOptions.map((mucus) => {
            const isSelected = selectedMucus === mucus;
            return (
              <TouchableOpacity
                key={mucus}
                onPress={() => setSelectedMucus(mucus)}
                className={clsx(
                  "px-4 py-2 rounded-full border",
                  isSelected
                    ? "bg-rose-500 border-transparent"
                    : "bg-gray-50 border-gray-300"
                )}
              >
                <Text
                  className={clsx(
                    "text-sm",
                    isSelected ? "text-white" : "text-gray-700"
                  )}
                >
                  {mucus}
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
              placeholder="Add any extra notes..."
              className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 text-sm mb-6"
            />
          )}
        />

        {/* Action Buttons */}
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
            disabled={isSubmitting}
            className={clsx(
              "flex-1 py-3 rounded-xl items-center",
              "bg-rose-500",
              isSubmitting && "opacity-60"
            )}
          >
            {isSubmitting ? (
              <Ionicons name="reload" size={20} color="white" />
            ) : (
              <>
                <Text className="text-white text-sm font-medium">Save</Text>
                <Ionicons name="water" size={16} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Fertility;
