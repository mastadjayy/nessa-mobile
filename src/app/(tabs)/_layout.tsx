import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

import { useWarmBackgroundColor } from '@/components/ui/WarmBackground';
import { useTheme } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

function tabIcon(filled: IconName, outline: IconName) {
  return function TabIcon({ color, focused, size }: { color: ColorValue; focused: boolean; size: number }) {
    return <Ionicons name={focused ? filled : outline} size={size} color={color} />;
  };
}

export default function TabsLayout() {
  const { colors, typography } = useTheme();
  const background = useWarmBackgroundColor();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // primaryDeep keeps the active label readable (5.1:1) on light backgrounds.
        tabBarActiveTintColor: colors.primaryDeep,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontFamily: typography.label.fontFamily, fontSize: 12 },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.outline },
        sceneStyle: { backgroundColor: background },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: tabIcon('home', 'home-outline') }} />
      <Tabs.Screen
        name="practice"
        options={{ title: 'Practice', tabBarIcon: tabIcon('albums', 'albums-outline') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: tabIcon('person', 'person-outline') }}
      />
    </Tabs>
  );
}