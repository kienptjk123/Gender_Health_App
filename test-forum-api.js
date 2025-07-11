// Simple test to verify forum API is working
const axios = require("axios");

const API_BASE_URL =
  "http://ec2-52-221-179-12.ap-southeast-1.compute.amazonaws.com";

async function testForumAPI() {
  try {
    console.log("🔄 Testing Forum API...");

    // Test questions endpoint
    const response = await axios.get(`${API_BASE_URL}/questions`);
    console.log("✅ API Response Status:", response.status);
    console.log("📝 Response structure:", {
      hasData: !!response.data,
      hasMessage: !!response.data?.message,
      hasNestedData: !!response.data?.data,
      dataType: typeof response.data?.data,
      isArray: Array.isArray(response.data?.data),
      count: response.data?.data?.length || 0,
    });

    if (response.data?.data && response.data.data.length > 0) {
      console.log("📋 Sample question structure:", {
        keys: Object.keys(response.data.data[0]),
        hasCustomerProfile: !!response.data.data[0].customerProfile,
        hasCount: !!response.data.data[0]._count,
        customerProfileKeys: response.data.data[0].customerProfile
          ? Object.keys(response.data.data[0].customerProfile)
          : null,
      });
    }
  } catch (error) {
    console.error("❌ API Test Failed:", error.message);
    if (error.response) {
      console.error(
        "📊 Error response:",
        error.response.status,
        error.response.data
      );
    }
  }
}

testForumAPI();
