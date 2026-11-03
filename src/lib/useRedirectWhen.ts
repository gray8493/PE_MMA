import { useCallback } from 'react';
import { router, useFocusEffect, type Href } from 'expo-router';

// Screens lower in the stack stay mounted, so a plain useEffect would let them
// navigate away from the screen the person is actually looking at.
export function useRedirectWhen(when: boolean, href: Href) {
  useFocusEffect(
    useCallback(() => {
      if (when) {
        router.replace(href);
      }
    }, [when, href]),
  );
}
