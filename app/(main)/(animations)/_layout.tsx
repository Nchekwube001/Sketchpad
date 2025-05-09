import { Stack } from "expo-router";

export default function AnimationLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="activitylist"
        options={{
          headerShown: true,
        }}
      />
    </Stack>
  );
}
