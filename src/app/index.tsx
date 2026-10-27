import { Redirect, useRouter } from 'expo-router';

import { WelcomeScreen } from '@/features/onboarding/WelcomeScreen';
import { track } from '@/services/analytics';
import { useProfileStore } from '@/store/profileStore';

/**
 * The "/" route. New learners see the welcome screen; learners who finished
 * onboarding are sent straight to home.
 */
export default function Index() {
    const router = useRouter();
    const onboardingCompleted = useProfileStore((s) => s.onboardingCompleted);

    if (onboardingCompleted) {
        return <Redirect href="/home" />
    }

    return (
        <WelcomeScreen
            onStart={() => {
                track("onboarding_started");
                router.push("/language");
            }}
        />
    );
}