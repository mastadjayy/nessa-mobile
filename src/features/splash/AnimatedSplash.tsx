import LottieView from "lottie-react-native";
import { type ComponentProps, useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { palette } from "@/theme";

type Props = {
    /** The Lottie JSON, e.g. require("@/assets/animations/splash-animation.json") */
    source: ComponentProps<typeof LottieView>['source'];
    /** Called once the animation has played to the end (or the safety timeout hits). */
    onFinish: () => void;
    /** Called when the overlay is first laid out: the moment to hide the native splash. */
    onReady?: () => void;
    /** Should match the splash background set in app.json to avoid a color flash. */
    backgroundColor?: string;
    /** Safety net: never keep the user on the splash longer than this. */
    maxDurationMs?: number;
};

export function AnimatedSplash({
    source,
    onFinish,
    onReady,
    backgroundColor = palette.orange,
    maxDurationMs = 5000,
}: Props) {
    useEffect(() => {
        const timer = setTimeout(onFinish, maxDurationMs);
        return () => clearTimeout(timer);
    }, [onFinish, maxDurationMs]);
 
    return (
        <View
            style={[StyleSheet.absoluteFill, styles.container, { backgroundColor }]}
            onLayout={onReady}
            accessibilityLabel="Nessa is loading"
        >
            <LottieView
                source={source}
                autoPlay
                loop={false}
                resizeMode="contain"
                onAnimationFinish={(isCancelled) => {
                    if (!isCancelled) onFinish();
                }}
                style={styles.animation}
            />
        </View>
    );
}
 
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    animation: {
        width: '200%',
        maxWidth: 360,
        aspectRatio: 1,
    },
});