import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";
import { SafeArea } from "@/components/SafeArea";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2000);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedDay, setSelectedDay] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => 1900 + i
  ).reverse();
  const months = [
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
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleDateConfirm = () => {
    const date = new Date(selectedYear, selectedMonth, selectedDay);
    setDateOfBirth(date);
    setShowDatePicker(false);
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
  };

  const openDatePicker = () => {
    // Set default values when opening picker
    if (dateOfBirth) {
      setSelectedYear(dateOfBirth.getFullYear());
      setSelectedMonth(dateOfBirth.getMonth());
      setSelectedDay(dateOfBirth.getDate());
    } else {
      // Default to 20 years ago
      const defaultDate = new Date();
      defaultDate.setFullYear(defaultDate.getFullYear() - 20);
      setSelectedYear(defaultDate.getFullYear());
      setSelectedMonth(defaultDate.getMonth());
      setSelectedDay(defaultDate.getDate());
    }
    setShowDatePicker(true);
  };

  const handleRegister = async () => {
    // Validate all required fields
    if (!name || !email || !password || !confirmPassword || !dateOfBirth) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all fields",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address",
      });
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Password Too Short",
        text2: "Password must be at least 6 characters long",
      });
      return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password Mismatch",
        text2: "Passwords do not match",
      });
      return;
    }

    // Validate date of birth
    if (!dateOfBirth || isNaN(dateOfBirth.getTime())) {
      Toast.show({
        type: "error",
        text1: "Invalid Date",
        text2: "Please select a valid date of birth",
      });
      return;
    }

    // Check if user is at least 13 years old
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    if (age < 13) {
      Toast.show({
        type: "error",
        text1: "Age Requirement",
        text2: "You must be at least 13 years old to register",
      });
      return;
    }

    // Check terms agreement
    if (!agreeTerms) {
      Toast.show({
        type: "error",
        text1: "Terms Required",
        text2: "Please agree to Terms & Conditions",
      });
      return;
    }

    try {
      setLoading(true);

      // Convert date to ISO format for API
      const isoDateOfBirth = dateOfBirth.toISOString();

      await register({
        name: name.trim(),
        email: email.trim(),
        password: password,
        confirm_password: confirmPassword,
        date_of_birth: isoDateOfBirth,
      });

      // Registration successful
      console.log("Registration successful");

      Toast.show({
        type: "success",
        text1: "Registration Successful! 🎉",
        text2: "Please check your email for OTP verification",
      });

      // Navigate to OTP verification after a short delay
      setTimeout(() => {
        router.push(
          `/auth/verify-mobile-otp?email=${encodeURIComponent(email.trim())}`
        );
      }, 1000);
    } catch (error: any) {
      console.error("Registration error:", error);

      let errorMessage = "Registration failed. Please try again.";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      } else if (error.statusCode === 409) {
        errorMessage = "An account with this email already exists.";
      } else if (error.statusCode >= 500) {
        errorMessage = "Server error. Please try again later.";
      }

      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeArea backgroundColor="#ffffff">
      <View className="flex-1 px-6 py-4">
        <View className="flex-row items-center mb-8 mt-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 mb-4">
            Join Lunari Today ✨
          </Text>
          <Text className="text-gray-600 text-base">
            Sign up to start tracking your cycle today
          </Text>
        </View>

        <View className="space-y-6 mb-8">
          <View>
            <Text className="text-gray-800 font-medium mb-2">Full Name</Text>
            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4">
              <Text className="text-gray-400 mr-3">👤</Text>
              <TextInput
                className="flex-1 text-gray-800"
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoComplete="name"
              />
            </View>
          </View>

          <View>
            <Text className="text-gray-800 font-medium mb-2">Email</Text>
            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4">
              <Text className="text-gray-400 mr-3">📧</Text>
              <TextInput
                className="flex-1 text-gray-800"
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          <View>
            <Text className="text-gray-800 font-medium mb-2">Password</Text>
            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4">
              <Text className="text-gray-400 mr-3">🔒</Text>
              <TextInput
                className="flex-1 text-gray-800"
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="ml-3"
              >
                <Text className="text-gray-400">👁️</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text className="text-gray-800 font-medium mb-2">
              Confirm Password
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4">
              <Text className="text-gray-400 mr-3">🔒</Text>
              <TextInput
                className="flex-1 text-gray-800"
                placeholder="Confirm your password"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
            </View>
          </View>

          <View>
            <Text className="text-gray-800 font-medium mb-2">
              Date of Birth
            </Text>
            <TouchableOpacity
              onPress={openDatePicker}
              className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4"
            >
              <Text className="text-gray-400 mr-3">📅</Text>
              <Text className="flex-1 text-gray-800">
                {dateOfBirth
                  ? dateOfBirth.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "Select your date of birth"}
              </Text>
            </TouchableOpacity>

            {/* Custom Date Picker Modal */}
            <Modal
              visible={showDatePicker}
              transparent={true}
              animationType="slide"
              onRequestClose={handleDateCancel}
            >
              <View className="flex-1 justify-center bg-black bg-opacity-50">
                <View className="bg-white mx-4 rounded-2xl p-6">
                  <Text className="text-lg font-semibold text-center mb-4">
                    Select Date of Birth
                  </Text>

                  <View className="flex-row justify-between mb-6">
                    {/* Year Selector */}
                    <View className="flex-1 mx-1">
                      <Text className="text-sm font-medium text-gray-700 mb-2">
                        Year
                      </Text>
                      <ScrollView className="max-h-32 border border-gray-300 rounded-lg">
                        {years.map((year) => (
                          <Pressable
                            key={year}
                            onPress={() => setSelectedYear(year)}
                            className={`p-2 ${
                              selectedYear === year ? "bg-pink-100" : ""
                            }`}
                          >
                            <Text
                              className={`text-center ${
                                selectedYear === year
                                  ? "text-pink-600 font-semibold"
                                  : "text-gray-700"
                              }`}
                            >
                              {year}
                            </Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>

                    {/* Month Selector */}
                    <View className="flex-1 mx-1">
                      <Text className="text-sm font-medium text-gray-700 mb-2">
                        Month
                      </Text>
                      <ScrollView className="max-h-32 border border-gray-300 rounded-lg">
                        {months.map((month, index) => (
                          <Pressable
                            key={index}
                            onPress={() => setSelectedMonth(index)}
                            className={`p-2 ${
                              selectedMonth === index ? "bg-pink-100" : ""
                            }`}
                          >
                            <Text
                              className={`text-center ${
                                selectedMonth === index
                                  ? "text-pink-600 font-semibold"
                                  : "text-gray-700"
                              }`}
                            >
                              {month}
                            </Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>

                    {/* Day Selector */}
                    <View className="flex-1 mx-1">
                      <Text className="text-sm font-medium text-gray-700 mb-2">
                        Day
                      </Text>
                      <ScrollView className="max-h-32 border border-gray-300 rounded-lg">
                        {Array.from(
                          {
                            length: getDaysInMonth(selectedYear, selectedMonth),
                          },
                          (_, i) => i + 1
                        ).map((day) => (
                          <Pressable
                            key={day}
                            onPress={() => setSelectedDay(day)}
                            className={`p-2 ${
                              selectedDay === day ? "bg-pink-100" : ""
                            }`}
                          >
                            <Text
                              className={`text-center ${
                                selectedDay === day
                                  ? "text-pink-600 font-semibold"
                                  : "text-gray-700"
                              }`}
                            >
                              {day}
                            </Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  </View>

                  <View className="flex-row justify-end">
                    <TouchableOpacity
                      onPress={handleDateCancel}
                      className="px-4 py-2 rounded-lg bg-gray-200 mr-3"
                    >
                      <Text className="text-gray-700">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleDateConfirm}
                      className="px-4 py-2 rounded-lg bg-pink-500"
                    >
                      <Text className="text-white">Confirm</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </View>

        <View className="flex-row items-start mb-8">
          <TouchableOpacity
            onPress={() => setAgreeTerms(!agreeTerms)}
            className="mr-3 mt-1"
          >
            <View
              className={`w-5 h-5 rounded ${
                agreeTerms ? "bg-pink-500" : "border-2 border-gray-300"
              } items-center justify-center`}
            >
              {agreeTerms && <Text className="text-white text-xs">✓</Text>}
            </View>
          </TouchableOpacity>
          <Text className="text-gray-600 text-sm flex-1">
            I agree to Lunari{" "}
            <Text className="text-pink-500">Terms & Conditions</Text>
          </Text>
        </View>

        <TouchableOpacity
          className={`rounded-full py-4 ${
            loading ? "bg-pink-300" : "bg-pink-500"
          }`}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Sign up
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeArea>
  );
}
