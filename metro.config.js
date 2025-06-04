const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Fix TurboModule issues
config.resolver.platforms = ["ios", "android", "native", "web"];
config.transformer.unstable_allowRequireContext = true;

module.exports = withNativeWind(config, { input: "./global.css" });
