import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useStore } from '@/store/useStore';

/**
 * Listens to Firebase auth state changes and syncs the current user
 * into Zustand. Runs once on app mount — restores session after page reload.
 */
export function useAuth() {
  const { setFirebaseUser, clearAuth } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
      } else {
        clearAuth();
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [setFirebaseUser, clearAuth]);
}
