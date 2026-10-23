import { useRouter } from 'expo-router';

import { WelcomeScreen } from '@/features/onboarding/WelcomeScreen';
import { track } from '@/services/analytics';

export default function Index() {
    const router = useRouter();

    return (
        <WelcomeScreen
            onStart={() => {
                track("onboarding_started");
                router.push("/language");
            }}
        />
    );
}