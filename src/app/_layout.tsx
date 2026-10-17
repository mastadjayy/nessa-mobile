import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import LottieView from "lottie-react-native";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
    const [appIsReady, setAppIsReady] = useState(false);
    const [animationFinished, setAnimationFinished] = useState(false);

    useEffect(() => {
        async function prepareSystem() {
            try {
                // Place real app checks here if needed (Fonts, auth states, etc.)
                await new Promise((resolve) => setTimeout(resolve, 3010));
            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        }
        prepareSystem();
    }, []);

    const handleAnimationLoaded = async () => {
        // Hide the static native splash screen ONLY when Lottie is ready to play
        await SplashScreen.hideAsync().catch(() => {});
    };

    // Keep showing Lottie until the app is ready AND the animation completes
    if (!appIsReady || !animationFinished) {
        return (
            <View style={styles.container}>
                <LottieView
                    source={require('@/assets/images/splash-animation.json')}
                    autoPlay
                    loop={false}
                    onAnimationLoaded={handleAnimationLoaded}
                    onAnimationFinish={() => setAnimationFinished(true)}
                    style={styles.animation}
                    resizeMode="contain"
                />
            </View>
        );
    }

    // Animation is done! Mount Expo Router's Stack Navigation seamlessly
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
        </Stack>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // Must match the backgroundColor in app.json!
        backgroundColor: "#f28500",
        justifyContent: "center",
        alignItems: "center",
    },
    animation: {
        width: "100%",
        height: "100%",
    },
})