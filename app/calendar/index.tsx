import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function CalendarTab() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDate = today.getDate();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const isDaySpecial = (day: number | null) => {
    if (!day) return { isPeriod: false, isFertile: false, isOvulation: false };

    // Mock data for demonstration
    const periodDays = [3, 4, 5, 6, 7]; // Period days
    const fertileDays = [12, 13, 14, 15, 16]; // Fertile window
    const ovulationDay = 14; // Ovulation day

    return {
      isPeriod: periodDays.includes(day),
      isFertile: fertileDays.includes(day),
      isOvulation: day === ovulationDay,
    };
  };

  return (
    <ScrollView className="flex-1 px-6 py-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-800">
          {monthNames[currentMonth]} {currentYear}
        </Text>
        <TouchableOpacity className="w-10 h-10 bg-pink-100 rounded-full items-center justify-center">
          <Text className="text-pink-500 font-bold">+</Text>
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View className="flex-row justify-around mb-6 bg-gray-50 rounded-xl p-4">
        <View className="items-center">
          <View className="w-4 h-4 bg-red-400 rounded-full mb-1"></View>
          <Text className="text-xs text-gray-600">Period</Text>
        </View>
        <View className="items-center">
          <View className="w-4 h-4 bg-green-400 rounded-full mb-1"></View>
          <Text className="text-xs text-gray-600">Fertile</Text>
        </View>
        <View className="items-center">
          <View className="w-4 h-4 bg-blue-400 rounded-full mb-1"></View>
          <Text className="text-xs text-gray-600">Ovulation</Text>
        </View>
      </View>

      {/* Calendar */}
      <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        {/* Days of week header */}
        <View className="flex-row justify-around mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Text
              key={day}
              className="text-gray-500 font-medium text-center w-10"
            >
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar grid */}
        <View className="flex-row flex-wrap">
          {calendarDays.map((day, index) => {
            const special = isDaySpecial(day);
            const isToday = day === currentDate;

            return (
              <TouchableOpacity
                key={index}
                className="w-10 h-10 items-center justify-center m-1"
                style={{ width: "12.5%" }}
              >
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    isToday
                      ? "bg-pink-500"
                      : special.isPeriod
                      ? "bg-red-400"
                      : special.isOvulation
                      ? "bg-blue-400"
                      : special.isFertile
                      ? "bg-green-400"
                      : "bg-transparent"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isToday ||
                      special.isPeriod ||
                      special.isFertile ||
                      special.isOvulation
                        ? "text-white"
                        : day
                        ? "text-gray-800"
                        : "text-transparent"
                    }`}
                  >
                    {day || ""}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Cycle Information */}
      <View className="mt-6 space-y-4">
        <View className="bg-pink-50 rounded-xl p-4">
          <Text className="font-semibold text-gray-800 mb-2">
            Cycle Information
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Current cycle day:</Text>
              <Text className="font-medium text-gray-800">14</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Average cycle length:</Text>
              <Text className="font-medium text-gray-800">28 days</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Next period in:</Text>
              <Text className="font-medium text-gray-800">14 days</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
