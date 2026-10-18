import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useState } from 'react';

import { AnimatedSplash } from '@/features/splash/AnimatedSplash';
import { useTheme } from '@/theme';

// Keep the native splash visible until our Lottie overlay is on screen.
SplashScreen.preventAutoHideAsync();

// TODO: change the file name if your Lottie file is named differently.
const splashAnimation = require('../../assets/animations/splash-animation.json');

export default function RootLayout() {
    const { colors, isDark } = useTheme();

    const [fontsLoaded, fontError] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    });
    // If a font fails to load we continue with system fonts rather than block the app.
    const fontsReady = fontsLoaded || !!fontError;

    const [animationDone, setAnimationDone] = useState(false);
    const showSplash = !(animationDone && fontsReady);

    const handleSplashReady = useCallback(() => {
        SplashScreen.hideAsync();
    }, []);
    const handleSplashFinish = useCallback(() => setAnimationDone(true), []);

    // Keep React Navigation's backgrounds in sync with our tokens (no white flash in dark mode).
    const navigationTheme = useMemo(() => {
        const base = isDark ? DarkTheme : DefaultTheme;
        return {
            ...base,
            colors: {
                ...base.colors,
                primary: colors.primary,
                background: colors.background,
                card: colors.surface,
                text: colors.text,
                border: colors.outline,
            },
        };
    }, [isDark, colors]);

    return (
        <ThemeProvider value={navigationTheme}>
            <StatusBar style={showSplash ? 'light' : isDark ? 'light' : 'dark'} />

            {/* The app only mounts once fonts are ready, so no text renders in the wrong font. */}
            {fontsReady && (
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: colors.background },
                    }}
                />
            )}

            {/* The splash covers the app until the animation ends AND fonts are loaded. */}
            {showSplash && (
                    <AnimatedSplash
                    source={splashAnimation}
                    onReady={handleSplashReady}
                    onFinish={handleSplashFinish}
                />
            )}
        </ThemeProvider>
    );
}