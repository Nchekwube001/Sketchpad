import { PullRefresh, usePullRefreshContext } from "@/components/PullRefresh";
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const data = [
  { id: "1", title: "Item 1", subtitle: "Pull down to refresh" },
  { id: "2", title: "Item 2", subtitle: "Swipe down from the top" },
  { id: "3", title: "Item 3", subtitle: "Release when you see the spinner" },
  { id: "4", title: "Item 4", subtitle: "Watch the smooth animation" },
  { id: "5", title: "Item 5", subtitle: "Context provides progress value" },
  { id: "6", title: "Item 6", subtitle: "Customizable threshold" },
  { id: "7", title: "Item 7", subtitle: "Spring animations included" },
  { id: "8", title: "Item 8", subtitle: "Works with FlatList props" },
];

const HEIGHT = 80;

function RefreshComponent() {
  const { refreshProgress } = usePullRefreshContext();

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: interpolate(refreshProgress.value, [0, HEIGHT], [0.5, 1.5]) },
        {
          rotateZ:
            interpolate(refreshProgress.value, [0, HEIGHT], [0, 360]) + "deg",
        },
      ],
    };
  });

  return (
    <View style={styles.refreshContainer}>
      <Animated.View style={[rStyle, styles.indicator]} />
    </View>
  );
}

function ListItem({ item }) {
  return (
    <View style={styles.item}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
    </View>
  );
}

export default function App() {
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState(data);

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      const newItem = {
        id: Date.now().toString(),
        title: `New Item ${items.length + 1}`,
        subtitle: `Added at ${new Date().toLocaleTimeString()}`,
      };
      setItems([newItem, ...items]);
      setRefreshing(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>PullRefresh Demo</Text>
      <Text style={styles.subtitle}>Pull down to add new items</Text>

      <PullRefresh
        data={items}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={(item) => item.id}
        refreshComponent={<RefreshComponent />}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        refreshViewBaseHeight={HEIGHT}
        refreshViewMaxHeight={120}
        progressThresholdToRefresh={60}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  refreshContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  indicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: "red",
  },
});
