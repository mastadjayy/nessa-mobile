import type { Exercise } from '@/types/content';

import { MatchingView } from './MatchingView';
import { MultipleChoiceView } from './MultipleChoiceView';

type Props = {
  exercise: Exercise;
  onComplete: (correct: boolean) => void;
};

/** Picks the right view for an exercise type. */
export function ExerciseView({ exercise, onComplete }: Props) {
  switch (exercise.type) {
    case 'multiple_choice':
    case 'listening':
      return <MultipleChoiceView exercise={exercise} onComplete={onComplete} />;
    case 'matching':
      return <MatchingView exercise={exercise} onComplete={onComplete} />;
  }
}