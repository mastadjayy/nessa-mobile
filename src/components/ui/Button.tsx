import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "@/theme";

type Props = {
    label: string;
    onPress: () => void;
    variant?: "primary" | "secondary";
    disabled?: boolean;
    accessibilityHint?: string;
    style?: StyleProp<ViewStyle>;
};

/**
 * Large pill button. Primary = brand orange with dark text (6.6:1 contrast).
 * White text on #F28500 would only reach 2.6:1, so it is never used.
 */
export function Button({
    label,
    onPress,
    variant = "primary",
    disabled= false,
    accessibilityHint,
    style,
}: Props) {
    const { colors, radius, sizing, typography } = useTheme();

    const background = disabled
        ? colors.disabledFill
        : variant === "primary"
            ? colors.primary
            : colors.surfaceVariant;

    const textColor = disabled
        ? colors.textDisabled
        : variant === "primary"
            ? colors.textOnPrimaryDeep
            : colors.text;

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ disabled }}
            style={({ pressed }) => [
                styles.base,
                {
                    minHeight: sizing.buttonHeight,
                    borderRadius: radius.pill,
                    backgroundColor: background,
                    opacity: pressed ? 0.85 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                },
                style,
            ]}
        >
            <Text style={[typography.button, { color: textColor, fontSize: 20 }]}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        alignSelf: "stretch",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },
});