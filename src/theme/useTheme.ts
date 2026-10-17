import { useColorScheme } from 'react-native';

import { darkTheme, lightTheme, type Theme } from './tokens';

/**
 * Returns the active theme, following the device's light/dark setting.
 * Later, a user preference (Light / Dark / System) from the settings store
 * can be applied here without touching any component.
 */
export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
}