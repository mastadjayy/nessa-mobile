import { Text, View } from 'react-native';

import { LessonRow } from '@/features/lessons/components/LessonRow';
import type { PathLesson, PathModuleWithState } from '@/features/lessons/useCoursePath';
import { useTheme } from '@/theme';

type Props = {
  modules: PathModuleWithState[];
  onOpenLesson: (lesson: PathLesson) => void;
};

/** Modules as sections, lessons as a vertical list. */
export function LearningPath({ modules, onOpenLesson }: Props) {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={{ gap: spacing.xl }}>
      {modules.map((module) => (
        <View key={module.id} style={{ gap: spacing.md }}>
          <View style={{ gap: 2 }}>
            <Text accessibilityRole="header" style={[typography.title, { color: colors.text }]}>
              {module.title}
            </Text>
            {module.description ? (
              <Text style={[typography.caption, { color: colors.textSecondary }]}>
                {module.description}
              </Text>
            ) : null}
          </View>

          <View style={{ gap: spacing.sm }}>
            {module.lessons.map((lesson) => (
              <LessonRow key={lesson.id} lesson={lesson} onPress={onOpenLesson} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}