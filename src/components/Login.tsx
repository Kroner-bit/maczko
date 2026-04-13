import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, AlertCircle, LogIn } from 'lucide-react';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user is admin
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const adminDoc = user.email ? await getDoc(doc(db, 'admins', user.email)) : null;
          
          const isAdmin = 
            (userDoc.exists() && userDoc.data().role === 'admin') || 
            (adminDoc && adminDoc.exists()) || 
            user.email === 'barni.kroner@gmail.com';
          
          if (isAdmin) {
            sessionStorage.setItem('isAdmin', 'true');
            navigate('/admin');
          } else {
            setError('Nincs admin jogosultsága ehhez a fiókhoz!');
            await auth.signOut();
          }
        } catch (err) {
          console.error('Auth check error:', err);
          setError('Hiba történt a jogosultság ellenőrzésekor.');
          await auth.signOut();
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Hiba történt a bejelentkezés során: ' + err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 border border-black/10">
        <div className="text-center mb-10">
          <img 
            src="https://kephost.net/p/MjM2NTE3MA.png" 
            alt="Logo" 
            className="h-16 md:h-20 w-auto mx-auto mb-8" 
            referrerPolicy="no-referrer"
          />
          <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="text-black w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-black mb-2">Admin Belépés</h1>
          <p className="text-black/60">Kérjük, jelentkezzen be Google fiókjával az üzenetek megtekintéséhez.</p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-5 rounded-2xl bg-white border border-black/20 text-black font-bold flex items-center justify-center gap-3 hover:bg-black/5 transition-all group shadow-sm disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5 text-black" />
                Bejelentkezés Google-lel
              </>
            )}
          </button>
          
          <p className="text-center text-xs text-black/40">
            Csak az engedélyezett adminisztrátorok léphetnek be.
          </p>
        </div>
      </div>
    </div>
  );
}
