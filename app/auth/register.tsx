import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeArea } from "@/components/SafeArea";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  // Helper function to format date input
  const handleDateChange = (text: string) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    
    // Add dashes automatically
    let formatted = cleaned;
    if (cleaned.length >= 4) {
      formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    }
    if (cleaned.length >= 6) {
      formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`;
    }
    
    setDateOfBirth(formatted);
  };

  const handleRegister = async () => {
    // Validate all required fields
    if (!name || !email || !password || !confirmPassword || !dateOfBirth) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // Validate date of birth
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) {
      Alert.alert("Error", "Please enter a valid date of birth (YYYY-MM-DD)");
      return;
    }

    // Check if user is at least 13 years old
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13) {
      Alert.alert("Error", "You must be at least 13 years old to register");
      return;
    }

    // Check terms agreement
    if (!agreeTerms) {
      Alert.alert("Error", "Please agree to Terms & Conditions");
      return;
    }

    try {
      setLoading(true);

      // Convert date to ISO format for API
      const isoDateOfBirth = new Date(dateOfBirth).toISOString();

      await register({
        name: name.trim(),
        email: email.trim(),
        password: password,
        confirm_password: confirmPassword,
        date_of_birth: isoDateOfBirth,
      });

      // Registration successful - redirect to login
      console.log("Registration successful");
      
      Alert.alert(
        "Registration Successful! 🎉", 
        "Your account has been created successfully. Please login to continue.",
        [
          {
            text: "Go to Login",
            onPress: () => router.replace("/auth/login" as any)
          }
        ]
      );
      
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

      Alert.alert("Registration Failed", errorMessage);
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
            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4">
              <Text className="text-gray-400 mr-3">📅</Text>
              <TextInput
                className="flex-1 text-gray-800"
                placeholder="YYYY-MM-DD (e.g., 1995-03-28)"
                placeholderTextColor="#9CA3AF"
                value={dateOfBirth}
                onChangeText={handleDateChange}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
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
