import { useEffect } from 'react';
import { db } from '../firebase';
import { doc, setDoc, increment } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Don't track admin pages
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/login')) {
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const statRef = doc(db, 'daily_stats', today);
    const sessionId = sessionStorage.getItem('sessionId');
    const isNewSession = !sessionId;

    if (isNewSession) {
      sessionStorage.setItem('sessionId', Date.now().toString());
    }

    const logVisit = async () => {
      try {
        await setDoc(statRef, {
          views: increment(1),
          sessions: increment(isNewSession ? 1 : 0),
          date: today
        }, { merge: true });
      } catch (error) {
        // Ignore errors (e.g. ad blockers or permissions)
      }
    };

    logVisit();

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setDoc(statRef, {
          totalDurationMinutes: increment(1)
        }, { merge: true }).catch(() => {});
      }
    }, 60000); // Add 1 minute to total duration every minute watched

    return () => clearInterval(interval);
  }, [location.pathname]);
}
