import { stiApi } from "@/apis/sti.api";
import { ResultOfTestData } from "@/models/STI/result.type";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MedicalReportModalProps {
  visible: boolean;
  onClose: () => void;
  stiTrackingId: number;
  patientName: string;
  testName: string;
  resultDate: string;
}

export default function MedicalReportModal({
  visible,
  onClose,
  stiTrackingId,
  patientName,
  testName,
  resultDate,
}: MedicalReportModalProps) {
  const [results, setResults] = useState<ResultOfTestData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && stiTrackingId) {
      fetchResults();
    }
  }, [visible, stiTrackingId]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await stiApi.getTestResultByStiTrackingId(stiTrackingId);
      setResults(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load test results");
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = (result: string) => {
    const normalizedResult = result?.toLowerCase().trim();
    switch (normalizedResult) {
      case "positive":
        return "text-red-600 bg-red-50 border-red-200";
      case "negative":
        return "text-green-600 bg-green-50 border-green-200";
      case "normal":
        return "text-green-600 bg-green-50 border-green-200";
      case "abnormal":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200 bg-white">
          <Text className="text-xl font-bold">Medical Report</Text>
          <View className="flex-row items-center">
            <TouchableOpacity className="p-2 mr-2">
              <Ionicons name="share-outline" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1">
          {/* Report Header */}
          <View className="p-4 bg-blue-50 border-b border-blue-100">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold text-blue-900">
                STI Test Report
              </Text>
              <Text className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                ID: {stiTrackingId}
              </Text>
            </View>

            <View className="space-y-2">
              <View className="flex-row">
                <Text className="text-sm text-blue-700 font-medium w-24">
                  Patient:
                </Text>
                <Text className="text-sm text-blue-900 font-medium">
                  {patientName}
                </Text>
              </View>

              <View className="flex-row">
                <Text className="text-sm text-blue-700 font-medium w-24">
                  Test:
                </Text>
                <Text className="text-sm text-blue-900">{testName}</Text>
              </View>

              <View className="flex-row">
                <Text className="text-sm text-blue-700 font-medium w-24">
                  Date:
                </Text>
                <Text className="text-sm text-blue-900">
                  {dayjs(resultDate).format("MMM D, YYYY HH:mm")}
                </Text>
              </View>

              <View className="flex-row">
                <Text className="text-sm text-blue-700 font-medium w-24">
                  Status:
                </Text>
                <View className="bg-green-100 px-2 py-1 rounded">
                  <Text className="text-xs text-green-800 font-medium">
                    Completed
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Results Table */}
          <View className="p-4">
            <Text className="text-lg font-semibold mb-4">Test Results</Text>

            {loading ? (
              <View className="flex-1 justify-center items-center py-8">
                <ActivityIndicator size="large" color="#EC4899" />
                <Text className="text-gray-500 mt-2">Loading results...</Text>
              </View>
            ) : results.length > 0 ? (
              <View className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Table Header */}
                <View className="bg-gray-50 flex-row border-b border-gray-200">
                  <View className="flex-1 p-3 border-r border-gray-200">
                    <Text className="font-semibold text-gray-700">
                      Test Code
                    </Text>
                  </View>
                  <View className="flex-1 p-3 border-r border-gray-200">
                    <Text className="font-semibold text-gray-700">
                      Abbreviation
                    </Text>
                  </View>
                  <View className="flex-1 p-3 border-r border-gray-200">
                    <Text className="font-semibold text-gray-700">Value</Text>
                  </View>
                  <View className="flex-1 p-3">
                    <Text className="font-semibold text-gray-700">Result</Text>
                  </View>
                </View>

                {/* Table Rows */}
                {results.map((result, index) => (
                  <View
                    key={result.id}
                    className={`flex-row border-b border-gray-100 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <View className="flex-1 p-3 border-r border-gray-200">
                      <Text className="text-sm text-gray-900">
                        {result.testCode}
                      </Text>
                    </View>
                    <View className="flex-1 p-3 border-r border-gray-200">
                      <Text className="text-sm text-gray-900">
                        {result.abbreviation}
                      </Text>
                    </View>
                    <View className="flex-1 p-3 border-r border-gray-200">
                      <Text className="text-sm text-gray-900">
                        {result.value}
                      </Text>
                    </View>
                    <View className="flex-1 p-3">
                      <View
                        className={`px-2 py-1 rounded-full border ${getResultColor(
                          result.result
                        )}`}
                      >
                        <Text className="text-xs font-medium text-center">
                          {result.result || "N/A"}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="flex-1 justify-center items-center py-8">
                <Ionicons
                  name="document-text-outline"
                  size={48}
                  color="#9CA3AF"
                />
                <Text className="text-gray-500 mt-2">No results available</Text>
              </View>
            )}
          </View>

          {/* Disclaimer */}
          <View className="p-4 m-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <View className="flex-row items-start">
              <Ionicons name="warning-outline" size={20} color="#F59E0B" />
              <View className="flex-1 ml-2">
                <Text className="text-sm font-medium text-yellow-800 mb-1">
                  Important Notice
                </Text>
                <Text className="text-xs text-yellow-700">
                  These results should be reviewed with a healthcare
                  professional. Do not make medical decisions based solely on
                  these results. Consult your doctor for proper interpretation
                  and treatment recommendations.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
