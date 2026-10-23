import { Image, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/theme";

import { WarmBackground } from "@/components/ui/WarmBackground";
import { FloatingBadge } from "./FloatingBadge";

const logo = require("@/assets/images/icon.png");

type Props = {
    onStart: () => void;
};

type BadgeConfig = {
    word: string;
    caption: string;
    color: 'primary' | 'tertiary' | 'success';
    position: ViewStyle;
    delay: number;
    amplitude: number;
    duration: number;
};

// Replace with correct words.
const BADGES: BadgeConfig[] = [
    { word: 'Akwaaba', caption: 'Twi', color: 'primary', position: { top: '4%', left: '2%' }, delay: 0, amplitude: 6, duration: 2400 },
    { word: 'Ojekoo', caption: 'Ga', color: 'tertiary', position: { top: '12%', right: '2%' }, delay: 400, amplitude: 5, duration: 2800 },
    { word: 'Woezɔ', caption: 'Ewe', color: 'success', position: { top: '50%', left: '0%' }, delay: 800, amplitude: 7, duration: 2600 },
    { word: 'Desiba', caption: 'Dagbani', color: 'primary', position: { top: '58%', right: '0%' }, delay: 200, amplitude: 6, duration: 3000 },
    { word: 'Medaase', caption: 'Twi', color: 'tertiary', position: { top: '82%', left: '14%' }, delay: 1000, amplitude: 5, duration: 2500 },
];

const TILE_SIZE = 168;

export function WelcomeScreen({ onStart }: Props) {
    const { colors, spacing, radius, sizing, typography, elevation } = useTheme();
    const insets = useSafeAreaInsets();

    const dotColors = {
        primary: colors.primary,
        tertiary: colors.tertiary,
        success: colors.success,
    };

    return (
        <WarmBackground>
        <View
            style={[
                styles.root,
                {
                    paddingTop: insets.top + spacing.lg,
                    paddingBottom: insets.bottom + spacing.lg,
                    paddingHorizontal: spacing.xl,
                },
            ]}
        >
            <View style={[styles.content, { maxWidth: sizing.maxContentWidth }]}>
                <View
                    style={styles.stage}
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                >
                    <View
                        style={[
                            styles.halo,
                            { width: 288, height: 288, borderRadius: 144, backgroundColor: colors.primaryContainer, opacity: 0.3 },
                        ]}
                    />
                    <View
                        style={[
                            styles.halo,
                            { width: 228, height: 228, borderRadius: 114, backgroundColor: colors.primaryContainer, opacity: 0.5 },
                        ]}
                    />

                    <View style={styles.tileWrap}>
                        <Image
                            source={logo}
                            style={[
                                elevation.card,
                                {
                                    width: TILE_SIZE,
                                    height: TILE_SIZE,
                                    borderRadius: radius.xl,
                                    borderWidth: 4,
                                    borderColor: colors.surface,
                                },
                            ]}
                        />
                        <FloatingBadge
                            word="Salut! 👋"
                            style={styles.helloBadge}
                            delay={300}
                            amplitude={4}
                            duration={2200}
                        />
                    </View>

                    {BADGES.map((badge) => (
                        <FloatingBadge
                            key={`${badge.caption}-${badge.word}`}
                            word={badge.word}
                            caption={badge.caption}
                            dotColor={dotColors[badge.color]}
                            style={badge.position}
                            delay={badge.delay}
                            amplitude={badge.amplitude}
                            duration={badge.duration}
                        />
                    ))}
                </View>

                <View style={[styles.textBlock, { gap: spacing.sm, marginBottom: spacing.xl }]}>
                    <Text
                        accessibilityRole="header"
                        style={[typography.headline, styles.centered, { color: colors.text }]}
                    >
                        Apprend les langues de la Côte d'Ivoire
                    </Text>
                    <Text style={[typography.body, styles.centered, { color: colors.textSecondary }]}>
                        De courtes leçons quotidiennes. Commencez par le Kroumen.
                    </Text>
                </View>

                <Button label="Démarrer" onPress={onStart} />

                {/* TODO: link "Terms" and "Privacy Policy" once those pages exist. */}
                <Text
                    style={[
                        typography.caption,
                        styles.centered,
                        { color: colors.textSecondary, marginTop: spacing.lg },
                    ]}
                >
                    En poursuivant, vous acceptez nos Conditions générales et notre Politique de confidentialité.
                </Text>
            </View>
        </View>
        </WarmBackground>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
    },
    content: {
        flex: 1,
        width: '100%',
    },
    stage: {
        flex: 1,
        minHeight: 320,
        alignItems: 'center',
        justifyContent: 'center',
    },
    halo: {
        position: 'absolute',
    },
    tileWrap: {
        alignItems: 'center',
    },
    helloBadge: {
        top: -16,
    },
    textBlock: {
        alignItems: 'center',
    },
    centered: {
        textAlign: 'center',
    },
});