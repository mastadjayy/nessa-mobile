import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

type Props = {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'error';
    disabled?: boolean;
    accessibilityHint?: string;
    style?: StyleProp<ViewStyle>;
};

/**
 * Large pill button. Primary = brand orange with white text. (dark text gives 6.6:1 contrast).
 * (White text on #F28500 would only reach 2.6:1, so it is never used.)
 * Success and error are used for the Continue button after answer is checked.
 */
export function Button({
    label,
    onPress,
    variant = 'primary',
    disabled= false,
    accessibilityHint,
    style,
}: Props) {
    const { colors, radius, sizing, typography } = useTheme();

    const fills = {
        primary: colors.primary,
        secondary: colors.surfaceVariant,
        success: colors.success,
        error: colors.error,
    } as const;
    const labels = {
        primary: colors.textOnPrimary,
        secondary: colors.text,
        success: colors.onSuccess,
        error: colors.onError,        
    } as const;

    const background = disabled ? colors.disabledFill : fills[variant];
    const textColor = disabled ? colors.textDisabled : labels[variant];

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