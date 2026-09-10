const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// The workspace also contains the Next.js app. Its `.next` output is rebuilt
// and removed while developing, so Metro must never watch that directory.
const existingBlockList = config.resolver.blockList;
const webNextOutput = String.raw`[\\/]apps[\\/]web[\\/]\.next[\\/].*`;
config.resolver.blockList = existingBlockList
  ? new RegExp(`(?:${existingBlockList.source})|${webNextOutput}`, existingBlockList.flags)
  : new RegExp(webNextOutput);

module.exports = withNativeWind(config, { input: "./global.css" });
