import { menstrualApi } from "@/apis/menstrual.api";
import { MedicationData, MedicationProps } from "@/models";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
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

const Medication: React.FC<MedicationProps> = ({
  menstrualCycleId,
  onNext,
  onSkipAll,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "",
      startDate: "",
      endDate: "",
      notes: "",
    },
  });

  const onSubmit = async (data: any) => {
    if (!menstrualCycleId) return;
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (start > end) {
      alert("Start date cannot be after end date");
    }
    const payload: MedicationData = {
      menstrual_cycle_id: menstrualCycleId,
      name: data.name,
      dosage: data.dosage,
      frequency: data.frequency,
      startDate: data.startDate,
      endDate: data.endDate,
      notes: data.notes,
    };

    try {
      setIsSubmitting(true);
      await menstrualApi.createMedication(payload);
      onNext?.();
    } catch (error) {
      // giữ lại màn hình nếu lỗi
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (
    type: "startDate" | "endDate",
    _: any,
    date?: Date
  ) => {
    if (!date) return;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const formatted = `${yyyy}-${mm}-${dd}`;
    if (type === "startDate") {
      setShowStartPicker(false);
      setValue("startDate", formatted);
    } else {
      setShowEndPicker(false);
      setValue("endDate", formatted);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Header */}
        <View className="bg-purple-500 p-5 rounded-2xl shadow-md mb-6 flex-row items-center space-x-4">
          <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4">
            <Ionicons name="medkit" size={24} color="#fff" />
          </View>
          <View>
            <Text className="text-white text-lg font-semibold">
              Medication Tracking
            </Text>
            <Text className="text-purple-100 text-sm">
              Log medication details below
            </Text>
          </View>
        </View>

        {/* Name */}
        <Text className="text-gray-700 font-medium mb-1">Medication Name</Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="e.g. Paracetamol"
              className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 mb-4"
            />
          )}
        />

        {/* Dosage */}
        <Text className="text-gray-700 font-medium mb-1">Dosage</Text>
        <Controller
          control={control}
          name="dosage"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="e.g. 500mg"
              className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 mb-4"
            />
          )}
        />

        {/* Frequency */}
        <Text className="text-gray-700 font-medium mb-1">Frequency</Text>
        <Controller
          control={control}
          name="frequency"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="e.g. Twice a day"
              className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 mb-4"
            />
          )}
        />

        {/* Start Date */}
        <Text className="text-gray-700 font-medium mb-1">Start Date</Text>
        <TouchableOpacity
          className="flex-row items-center border border-gray-300 bg-gray-100 rounded-xl px-4 py-3 mb-4"
          onPress={() => setShowStartPicker(true)}
        >
          <Text className=" text-base text-gray-800">
            {watch("startDate") || "Select Date"}
          </Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(e, d) => handleDateChange("startDate", e, d)}
            maximumDate={new Date()}
          />
        )}

        {/* End Date */}
        <Text className="text-gray-700 font-medium mb-1">End Date</Text>
        <TouchableOpacity
          className="flex-row items-center border border-gray-300 bg-gray-100 rounded-xl px-4 py-3 mb-4"
          onPress={() => setShowEndPicker(true)}
        >
          <Text className=" text-base text-gray-800">
            {watch("endDate") || "Select Date"}
          </Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(e, d) => handleDateChange("endDate", e, d)}
            maximumDate={new Date()}
          />
        )}

        {/* Notes */}
        <Text className="text-gray-700 font-medium mb-1">Notes</Text>
        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, value } }) => (
            <TextInput
              multiline
              numberOfLines={3}
              value={value}
              onChangeText={onChange}
              placeholder="Optional note..."
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
            disabled={isSubmitting}
            className={clsx(
              "flex-1 py-3 rounded-xl items-center",
              "bg-purple-500",
              isSubmitting && "opacity-60"
            )}
          >
            {isSubmitting ? (
              <Ionicons name="reload" size={20} color="white" />
            ) : (
              <>
                <Text className="text-white text-sm font-medium">Save</Text>
                <Ionicons name="medkit" size={16} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Medication;
