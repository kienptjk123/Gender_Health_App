import { authService } from "@/apis";
import { appointmentApi } from "@/apis/appointment.api";
import { Appointment } from "@/models/appointment.type";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AppointmentHistoryScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchAppointments = async () => {
    try {
      const customerProfile = await authService.getUserProfile();
      const res = await appointmentApi.getAppointmentsByCustomerId(
        customerProfile.result?.customer_profile_id
      );
      setAppointments(res);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELED":
        return "bg-red-100 text-red-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "COMPLETED":
        return "✅";
      case "CANCELED":
        return "❌";
      case "scheduled":
        return "📅";
      case "IN_PROGRESS":
        return "🔄";
      default:
        return "📋";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderAppointmentCard = (appointment: Appointment) => (
    <View
      key={appointment.id}
      className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
    >
      {/* Header with consultant info */}
      <View className="flex-row items-center mb-3">
        <View className="w-12 h-12 bg-pink-100 rounded-full items-center justify-center mr-3">
          {appointment.consultantProfile.avatar ? (
            <Image
              source={{ uri: appointment.consultantProfile.avatar }}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <Text className="text-xl">👩‍⚕️</Text>
          )}
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-gray-800 text-base">
            Dr. {appointment.consultantProfile.name}
          </Text>
          <Text className="text-gray-600 text-sm">
            {appointment.consultantProfile.location}
          </Text>
        </View>
        <View className="items-end">
          <View
            className={`px-2 py-1 rounded-full ${getStatusColor(
              appointment.status
            )}`}
          >
            <Text className="text-xs font-medium">
              {getStatusIcon(appointment.status)} {appointment.status}
            </Text>
          </View>
        </View>
      </View>

      {/* Appointment details */}
      <View className="space-y-2">
        <View className="flex-row items-center">
          <Text className="text-gray-600 text-sm mr-2">📅</Text>
          <Text className="text-gray-700 text-sm">
            Scheduled: {formatDate(appointment.scheduledAt)}
          </Text>
        </View>

        {appointment.startedAt && (
          <View className="flex-row items-center">
            <Text className="text-gray-600 text-sm mr-2">🕐</Text>
            <Text className="text-gray-700 text-sm">
              Started: {formatDate(appointment.startedAt)}
            </Text>
          </View>
        )}

        {appointment.endedAt && (
          <View className="flex-row items-center">
            <Text className="text-gray-600 text-sm mr-2">🏁</Text>
            <Text className="text-gray-700 text-sm">
              Ended: {formatDate(appointment.endedAt)}
            </Text>
          </View>
        )}

        {appointment.meetingPlatform && (
          <View className="flex-row items-center">
            <Text className="text-gray-600 text-sm mr-2">💻</Text>
            <Text className="text-gray-700 text-sm">
              Platform: {appointment.meetingPlatform}
            </Text>
          </View>
        )}
      </View>

      {/* Notes section */}
      {(appointment.consultantNote || appointment.customerNote) && (
        <View className="mt-3 pt-3 border-t border-gray-100">
          {appointment.consultantNote && (
            <View className="mb-2">
              <Text className="font-medium text-gray-700 text-sm mb-1">
                Consultant Notes:
              </Text>
              <Text className="text-gray-600 text-sm">
                {appointment.consultantNote}
              </Text>
            </View>
          )}
          {appointment.customerNote && (
            <View>
              <Text className="font-medium text-gray-700 text-sm mb-1">
                Your Notes:
              </Text>
              <Text className="text-gray-600 text-sm">
                {appointment.customerNote}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Rating and feedback */}
      {appointment.rating && (
        <View className="mt-3 pt-3 border-t border-gray-100">
          <View className="flex-row items-center mb-1">
            <Text className="text-gray-700 text-sm mr-2">Rating:</Text>
            <View className="flex-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <Text
                  key={star}
                  className={`text-sm ${
                    star <= appointment.rating!
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                >
                  ⭐
                </Text>
              ))}
            </View>
          </View>
          {appointment.feedback && (
            <Text className="text-gray-600 text-sm">
              {appointment.feedback}
            </Text>
          )}
        </View>
      )}

      {/* Meeting link for scheduled appointments */}
      {appointment.status.toLowerCase() === "scheduled" &&
        appointment.meetingLink && (
          <TouchableOpacity className="mt-3 bg-pink-500 rounded-lg p-3">
            <Text className="text-white text-center font-medium">
              Join Meeting
            </Text>
          </TouchableOpacity>
        )}
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#ec4899" />
        <Text className="text-gray-600 mt-4">Loading appointments...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 p-2 -ml-2"
          >
            <Text className="text-xl">←</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">
            Appointment History
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Summary */}
        <View className="my-6">
          <View className="flex-row justify-between">
            <View className="flex-1 bg-white rounded-xl p-4 mr-2 items-center">
              <Text className="text-2xl font-bold text-pink-500">
                {appointments.length}
              </Text>
              <Text className="text-gray-600 text-sm text-center">
                Total Appointments
              </Text>
            </View>
            <View className="flex-1 bg-white rounded-xl p-4 mx-1 items-center">
              <Text className="text-2xl font-bold text-green-500">
                {
                  appointments.filter(
                    (a) => a.status.toLowerCase() === "completed"
                  ).length
                }
              </Text>
              <Text className="text-gray-600 text-sm text-center">
                Completed
              </Text>
            </View>
            <View className="flex-1 bg-white rounded-xl p-4 ml-2 items-center">
              <Text className="text-2xl font-bold text-blue-500">
                {
                  appointments.filter(
                    (a) => a.status.toLowerCase() === "scheduled"
                  ).length
                }
              </Text>
              <Text className="text-gray-600 text-sm text-center">
                Upcoming
              </Text>
            </View>
          </View>
        </View>

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-6xl mb-4">📅</Text>
            <Text className="text-xl font-semibold text-gray-800 mb-2">
              No Appointments Yet
            </Text>
            <Text className="text-gray-600 text-center px-8 mb-6">
              You haven&apos;t booked any appointments. Start your health
              journey by booking a consultation with our experts.
            </Text>
            <TouchableOpacity
              className="bg-pink-500 px-6 py-3 rounded-full"
              onPress={() => router.push("/consultants/all" as any)}
            >
              <Text className="text-white font-medium">Book Consultation</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="pb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Your Appointments ({appointments.length})
            </Text>
            {appointments
              .sort(
                (a, b) =>
                  new Date(b.scheduledAt).getTime() -
                  new Date(a.scheduledAt).getTime()
              )
              .map(renderAppointmentCard)}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
