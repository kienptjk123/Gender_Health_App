import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { blogApi } from "../../apis/blog";

export default function TestScreen() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const testGetAllBlogs = async () => {
    setLoading(true);
    try {
      console.log("🧪 Testing getAll blogs...");
      const blogs = await blogApi.getAll(1, 10);
      console.log("🧪 GetAll result:", blogs);
      setResult(
        `SUCCESS: Retrieved ${blogs.length} blogs\n${JSON.stringify(
          blogs[0],
          null,
          2
        )}`
      );
    } catch (error) {
      console.error("🧪 GetAll error:", error);
      setResult(`ERROR: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetBlogById = async (id: number) => {
    setLoading(true);
    try {
      console.log("🧪 Testing getById blog...");
      const blog = await blogApi.getById(id);
      console.log("🧪 GetById result:", blog);
      setResult(
        `SUCCESS: Retrieved blog ID ${id}\n${JSON.stringify(blog, null, 2)}`
      );
    } catch (error) {
      console.error("🧪 GetById error:", error);
      setResult(`ERROR: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testApiUrl = async () => {
    setLoading(true);
    try {
      console.log("🧪 Testing direct API call...");
      const response = await fetch(
        "http://ec2-52-221-179-12.ap-southeast-1.compute.amazonaws.com/blogs/31"
      );
      const data = await response.json();
      console.log("🧪 Direct API result:", data);
      setResult(`DIRECT API CALL SUCCESS:\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error("🧪 Direct API error:", error);
      setResult(`DIRECT API CALL ERROR: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-4">API Test Screen</Text>

        <View className="space-y-4">
          <TouchableOpacity
            onPress={testGetAllBlogs}
            disabled={loading}
            className={`p-4 rounded-lg ${
              loading ? "bg-gray-300" : "bg-blue-500"
            }`}
          >
            <Text className="text-white font-bold text-center">
              {loading ? "Loading..." : "Test Get All Blogs"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => testGetBlogById(31)}
            disabled={loading}
            className={`p-4 rounded-lg ${
              loading ? "bg-gray-300" : "bg-green-500"
            }`}
          >
            <Text className="text-white font-bold text-center">
              {loading ? "Loading..." : "Test Get Blog ID 31"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={testApiUrl}
            disabled={loading}
            className={`p-4 rounded-lg ${
              loading ? "bg-gray-300" : "bg-purple-500"
            }`}
          >
            <Text className="text-white font-bold text-center">
              {loading ? "Loading..." : "Test Direct API Call"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setResult("")}
            disabled={loading}
            className={`p-4 rounded-lg ${
              loading ? "bg-gray-300" : "bg-red-500"
            }`}
          >
            <Text className="text-white font-bold text-center">
              Clear Result
            </Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View className="mt-6 p-4 bg-gray-100 rounded-lg">
            <ScrollView style={{ maxHeight: 300 }}>
              <Text className="text-sm font-mono">{result}</Text>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
