import { stiApi } from "@/apis/sti.api";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import StiCard from "./STICard";

export default function StisTrackingSection({
  customerProfileId,
  refreshTrigger,
}: {
  customerProfileId: number;
  refreshTrigger: number;
}) {
  const [data, setData] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    stiApi.getStiByCustomerProfileId(customerProfileId).then((res) => {
      const sorted = res.data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setData(sorted);
    });
  }, [customerProfileId, refreshTrigger]);

  if (!data.length) return null;

  const displayData = showAll ? data : data.slice(0, 1);

  return (
    <View className="px-4 mt-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold">STI Test Progress</Text>
        {data.length > 1 && (
          <TouchableOpacity onPress={() => setShowAll(!showAll)}>
            <Text className="text-sm text-pink-600 font-medium">
              {showAll ? "Show less" : "See all"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {displayData.map((item, index) =>
        item ? <StiCard key={index} item={item} /> : null
      )}
    </View>
  );
}
