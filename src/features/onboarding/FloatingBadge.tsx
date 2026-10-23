import { useEffect } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
    Easing,
    cancelAnimation,
    useAnimatedStyle,
    useReducedMotion,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
 
import { useTheme } from '@/theme';
 
type Props = {
    word: string;
    /** Small secondary text, e.g. the language name. */
    caption?: string;
    dotColor?: string;
    /** Absolute position inside the stage (top/left/right in %). */
    style?: StyleProp<ViewStyle>;
    /** Start delay in ms, so badges do not move in sync. */
    delay?: number;
    /** How far the badge travels up, in dp. */
    amplitude?: number;
    /** One way trip duration in ms. */
    duration?: number;
};

export function FloatingBadge({
    word,
    caption,
    dotColor,
    style,
    delay = 0,
    amplitude = 6,
    duration = 2400,
}: Props) {
    const { colors, spacing, radius, typography, elevation } = useTheme();
    const reduceMotion = useReducedMotion();
    const offset = useSharedValue(0);
 
    useEffect(() => {
        if (reduceMotion) {
            offset.value = 0;
            return;
        }
        offset.value = withDelay(
            delay,
            withRepeat(
            withTiming(-amplitude, { duration, easing: Easing.inOut(Easing.sin) }),
            -1,
            true,
            ),
        );
        return () => cancelAnimation(offset);
    }, [reduceMotion, delay, amplitude, duration, offset]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: offset.value }],
    }));

    return (
        <Animated.View
            style={[
                styles.badge,
                elevation.card,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.outline,
                    borderRadius: radius.pill,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    gap: spacing.sm,
                },
                style,
                animatedStyle,
            ]}
        >
            {dotColor ? (
                <View style={[styles.dot, { backgroundColor: dotColor }]} />
            ) : null}
            <Text style={[typography.label, { color: colors.text }]}>{word}</Text>
            {caption ? (
                <Text style={[typography.caption, { color: colors.textSecondary }]}>{caption}</Text>
            ) : null}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: StyleSheet.hairlineWidth,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});