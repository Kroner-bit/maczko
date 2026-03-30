import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Trash2, Mail, Phone, Calendar, MessageSquare, User, Loader2, AlertCircle, ChevronDown, ChevronUp, Settings, Plus, X } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: any;
}

interface AdminEmail {
  id: string;
  email: string;
  addedAt: any;
}

export default function Admin() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [adminEmails, setAdminEmails] = useState<AdminEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'submissions' | 'admins'>('submissions');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; type: 'submission' | 'admin'; id: string; label: string } | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    let unsubscribeSubmissions: (() => void) | undefined;
    let unsubscribeAdmins: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        sessionStorage.removeItem('isAdmin');
        navigate('/login');
        setIsAuthChecking(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const adminDoc = user.email ? await getDoc(doc(db, 'admins', user.email)) : null;
        
        const isAdmin = 
          (userDoc.exists() && userDoc.data().role === 'admin') || 
          (adminDoc && adminDoc.exists()) || 
          user.email === 'barni.kroner@gmail.com';
        
        if (!isAdmin) {
          await signOut(auth);
          sessionStorage.removeItem('isAdmin');
          navigate('/login');
          return;
        }
        
        sessionStorage.setItem('isAdmin', 'true');
        setIsAuthChecking(false);

        // Fetch submissions
        const qSub = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
        unsubscribeSubmissions = onSnapshot(qSub, (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Submission[];
          setSubmissions(data);
          setIsLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'submissions');
          setIsLoading(false);
        });

        // Fetch admin list
        const qAdmin = query(collection(db, 'admins'), orderBy('addedAt', 'desc'));
        unsubscribeAdmins = onSnapshot(qAdmin, (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            email: doc.id,
            ...doc.data()
          })) as AdminEmail[];
          setAdminEmails(data);
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'admins');
        });

      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/login');
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSubmissions) unsubscribeSubmissions();
      if (unsubscribeAdmins) unsubscribeAdmins();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem('isAdmin');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'submission',
      id,
      label: 'ezt az üzenetet'
    });
  };

  const handleDeleteAdmin = (email: string) => {
    if (email.toLowerCase().trim() === 'barni.kroner@gmail.com') {
      setNotification({ message: 'A fő adminisztrátor nem törölhető!', type: 'error' });
      return;
    }
    
    setDeleteConfirm({
      isOpen: true,
      type: 'admin',
      id: email,
      label: `az admint: ${email}`
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    const { type, id } = deleteConfirm;
    try {
      if (type === 'submission') {
        await deleteDoc(doc(db, 'submissions', id));
        setNotification({ message: 'Üzenet sikeresen törölve!', type: 'success' });
      } else {
        await deleteDoc(doc(db, 'admins', id.toLowerCase().trim()));
        setNotification({ message: 'Admin sikeresen törölve!', type: 'success' });
      }
    } catch (error: any) {
      console.error(`Delete ${type} error:`, error);
      setNotification({ message: `Hiba történt a törlés során: ${error.message || 'Ismeretlen hiba'}`, type: 'error' });
      handleFirestoreError(error, OperationType.DELETE, `${type === 'submission' ? 'submissions' : 'admins'}/${id}`);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    
    setIsAddingAdmin(true);
    try {
      await setDoc(doc(db, 'admins', newAdminEmail.toLowerCase().trim()), {
        addedAt: serverTimestamp(),
        addedBy: auth.currentUser?.uid
      });
      setNewAdminEmail('');
      setNotification({ message: 'Admin sikeresen hozzáadva!', type: 'success' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `admins/${newAdminEmail}`);
      setNotification({ message: 'Hiba történt az admin hozzáadása során!', type: 'error' });
    } finally {
      setIsAddingAdmin(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isAuthChecking || isLoading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold text-dark mb-2">Adminisztrációs Felület</h1>
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${activeTab === 'submissions' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-dark/40 hover:text-dark'}`}
              >
                Üzenetek
              </button>
              <button
                onClick={() => setActiveTab('admins')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${activeTab === 'admins' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-dark/40 hover:text-dark'}`}
              >
                Adminok
              </button>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-2xl bg-white border border-black/5 text-dark font-bold flex items-center gap-2 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Kijelentkezés
          </button>
        </div>

        {activeTab === 'submissions' ? (
          <>
            <div className="mb-6">
              <p className="text-dark/60">Összesen {submissions.length} üzenet érkezett.</p>
            </div>
            {submissions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-16 bg-white rounded-[40px] border border-black/5 shadow-xl text-center"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="text-primary w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-dark mb-2">Nincs még üzenet</h2>
                <p className="text-dark/60">Amint valaki kitölti a kapcsolatfelvételi űrlapot, itt fog megjelenni.</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub, index) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden"
                  >
                    <div 
                      onClick={() => toggleExpand(sub.id)}
                      className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-light/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                          <User className="text-primary w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-dark text-lg">{sub.name}</h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-dark/40">
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {sub.email}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {sub.createdAt?.toDate().toLocaleString('hu-HU')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-end md:self-center">
                        {sub.phone && (
                          <a
                            href={`tel:${sub.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center"
                            title="Hívás indítása"
                          >
                            <Phone className="w-5 h-5" />
                          </a>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(sub.id);
                          }}
                          className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        {expandedId === sub.id ? <ChevronUp className="w-6 h-6 text-dark/20" /> : <ChevronDown className="w-6 h-6 text-dark/20" />}
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedId === sub.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-black/5"
                        >
                          <div className="p-8 bg-light/30">
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                              <div className="space-y-4">
                                <div>
                                  <p className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-1">Telefonszám</p>
                                  <p className="text-lg font-bold text-dark flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-primary" />
                                    {sub.phone || 'Nincs megadva'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-1">Email cím</p>
                                  <p className="text-lg font-bold text-dark flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-primary" />
                                    {sub.email}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-2">Üzenet</p>
                              <div className="p-6 bg-white rounded-2xl border border-black/5 text-dark leading-relaxed">
                                {sub.message}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] border border-black/5 shadow-xl p-10"
            >
              <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
                <Plus className="text-primary w-6 h-6" />
                Új Admin Hozzáadása
              </h2>
              <form onSubmit={handleAddAdmin} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/20" />
                  <input
                    required
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="pelda@gmail.com"
                    className="w-full bg-light border border-black/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-dark"
                  />
                </div>
                <button
                  disabled={isAddingAdmin}
                  type="submit"
                  className="px-8 py-4 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-dark transition-all disabled:opacity-70"
                >
                  {isAddingAdmin ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Hozzáadás'}
                </button>
              </form>
            </motion.div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-dark mb-4 px-2">Adminisztrátorok Listája</h2>
              
              {/* Hardcoded main admin */}
              <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <User className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark">barni.kroner@gmail.com</h3>
                    <p className="text-xs text-primary font-bold uppercase tracking-widest">Fő Adminisztrátor</p>
                  </div>
                </div>
              </div>

              {adminEmails.map((admin, index) => (
                admin.email !== 'barni.kroner@gmail.com' && (
                  <motion.div
                    key={admin.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-3xl border border-black/5 shadow-sm p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-light rounded-2xl flex items-center justify-center">
                        <User className="text-dark/20 w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-dark">{admin.email}</h3>
                        <p className="text-xs text-dark/40 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> 
                          Hozzáadva: {admin.addedAt?.toDate().toLocaleDateString('hu-HU')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAdmin(admin.email)}
                      className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                )
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm?.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-dark mb-2">Biztos benne?</h3>
              <p className="text-dark/60 mb-8">
                Biztosan törölni szeretné <span className="font-bold text-dark">{deleteConfirm.label}</span>? 
                Ez a művelet nem vonható vissza.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-6 py-4 rounded-2xl bg-light text-dark font-bold hover:bg-dark/5 transition-colors"
                >
                  Mégse
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                >
                  Törlés
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-8 left-1/2 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px] ${
              notification.type === 'success' ? 'bg-dark text-white' : 'bg-red-600 text-white'
            }`}
          >
            {notification.type === 'success' ? (
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0">
                <Settings className="w-4 h-4 text-white" />
              </div>
            ) : (
              <AlertCircle className="w-6 h-6 shrink-0" />
            )}
            <p className="font-bold">{notification.message}</p>
            <button 
              onClick={() => setNotification(null)}
              className="ml-auto p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
