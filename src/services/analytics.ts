/**
 * Analytics placeholder. Events are only logged in development for now.
 * TODO: connect PostHog (or Firebase Analytics) with an anonymous install ID,
 * and ask for consent before sending anything.
 */
type EventName = 'onboarding_started' | 'onboarding_completed' | 'language_interest';

type EventProps = Record<string, string | number | boolean | null>;

export function track(event: EventName, props: EventProps = {}): void {
  if (__DEV__) {
    console.log('[analytics]', event, props);
  }
}