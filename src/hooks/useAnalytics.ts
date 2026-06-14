import { useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, setDoc, increment, arrayUnion } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';

function getSessionId() {
  try {
    const raw = localStorage.getItem('analytics_session');
    if (raw) {
      const data = JSON.parse(raw);
      // expiry is 1 hour
      if (Date.now() - data.time < 3600 * 1000) {
        return data.id;
      }
    }
  } catch (e) {
    // disregard
  }
  return null;
}

function setSessionId(id: string) {
  try {
    localStorage.setItem('analytics_session', JSON.stringify({
      id,
      time: Date.now()
    }));
  } catch (e) {
    // disregard
  }
}

export function useAnalytics() {
  const location = useLocation();
  const trackingRef = useRef(false);

  useEffect(() => {
    // Don't track admin pages
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/login')) {
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const statRef = doc(db, 'daily_stats', today);
    
    // Check session timeout (1 hour = 3600 seconds)
    const sessionId = getSessionId();
    
    // Prevent double execution in React StrictMode
    if (!sessionId && !trackingRef.current) {
        trackingRef.current = true;
        const newSessionId = Date.now().toString();
        setSessionId(newSessionId);
        
        const logVisit = async () => {
          try {
            let ip = 'Ismeretlen';
            try {
              const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
              const data = await res.json();
              if (data.ip && data.country_code) {
                ip = `${data.ip}|${data.country_code}`;
              } else if (data.ip) {
                ip = data.ip;
              }
            } catch (e) {
              // Ignore if adblocker blocks
            }
  
            const updateData: any = {
              date: today,
              views: increment(1)
            };
  
            if (ip !== 'Ismeretlen') {
              updateData.ips = arrayUnion(ip);
              const safeIp = ip.replace(/[.#$/[\]]/g, '_');
              updateData[`ipCounts.${safeIp}`] = increment(1);
            }
  
            await setDoc(statRef, updateData, { merge: true });
          } catch (error) {
            // Ignore errors
          } finally {
            // Allow tracking again if session is cleared
            setTimeout(() => {
               trackingRef.current = false;
            }, 5000);
          }
        };
  
        logVisit();
    } else if (sessionId) {
        // Refresh session expiration
        setSessionId(sessionId);
    }

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        const currentSession = getSessionId();
        if (currentSession) {
          setSessionId(currentSession);
        }
        setDoc(statRef, {
          totalDurationSeconds: increment(10)
        }, { merge: true }).catch(() => {});
      }
    }, 10000); // 10 másodperc

    return () => clearInterval(interval);
  }, [location.pathname]);
}
