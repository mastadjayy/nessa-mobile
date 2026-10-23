import { Stack } from 'expo-router';

import { useWarmBackgroundColor } from '@/components/ui/WarmBackground';

export default function OnboardingLayout() {
  const backgroundColor = useWarmBackgroundColor();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor },
      }}
    />
  );
}