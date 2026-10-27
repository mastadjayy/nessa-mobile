import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

/**
 * Returns a number that changes every time the screen comes into focus.
 * Add it to the dependencies of a useMemo that reads the database, so tab screens
 * show fresh data after a lesson is finished.
 */
export function useRefreshOnFocus(): number {
  const [version, setVersion] = useState(0);
  useFocusEffect(useCallback(() => setVersion((value) => value + 1), []));
  return version;
}