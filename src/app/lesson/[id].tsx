import { useLocalSearchParams } from 'expo-router';

import { LessonPlayerScreen } from '@/features/lessons/LessonPlayerScreen';

export default function LessonRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LessonPlayerScreen lessonId={id} />;
}