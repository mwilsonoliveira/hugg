import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Hugg</Text>
      <Text className="text-gray-500 mt-2">
        Conectando pets desabrigados a novos lares.
      </Text>
    </View>
  );
}
