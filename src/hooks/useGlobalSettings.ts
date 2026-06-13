import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export function useGlobalSettings() {
  const [settings, setSettings] = useState<any>({ maltaPageEnabled: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data());
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching global settings:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { settings, loading };
}
