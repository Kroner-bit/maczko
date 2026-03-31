import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [maltaSubmissions, setMaltaSubmissions] = useState<Submission[]>([]);
  const [adminEmails, setAdminEmails] = useState<AdminEmail[]>([]);
  const [settings, setSettings] = useState({
    maltaTiktokEnabled: true,
    maltaTiktokUrls: [
      'https://www.tiktok.com/@maczkotetofedes/video/7485304675713436961',
      'https://www.tiktok.com/@maczkotetofedes/video/7485303648058608929',
      'https://www.tiktok.com/@maczkotetofedes/video/7485302684845083937'
    ]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'submissions' | 'malta_submissions' | 'admins' | 'settings'>('submissions');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; type: 'submission' | 'malta_submission' | 'admin'; id: string; label: string } | null>(null);
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
    let unsubscribeMaltaSubmissions: (() => void) | undefined;
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

        // Fetch malta submissions
        const qMaltaSub = query(collection(db, 'malta_submissions'), orderBy('createdAt', 'desc'));
        unsubscribeMaltaSubmissions = onSnapshot(qMaltaSub, (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Submission[];
          setMaltaSubmissions(data);
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'malta_submissions');
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

        // Fetch settings
        const settingsDoc = await getDoc(doc(db, 'settings', 'global'));
        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data() as any);
        } else {
          // Initialize settings if they don't exist
          await setDoc(doc(db, 'settings', 'global'), {
            maltaTiktokEnabled: true,
            maltaTiktokUrls: [
              'https://www.tiktok.com/@maczkotetofedes/video/7485304675713436961',
              'https://www.tiktok.com/@maczkotetofedes/video/7485303648058608929',
              'https://www.tiktok.com/@maczkotetofedes/video/7485302684845083937'
            ]
          });
        }

      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/login');
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSubmissions) unsubscribeSubmissions();
      if (unsubscribeMaltaSubmissions) unsubscribeMaltaSubmissions();
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

  const handleDelete = (id: string, type: 'submission' | 'malta_submission') => {
    setDeleteConfirm({
      isOpen: true,
      type,
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
      } else if (type === 'malta_submission') {
        await deleteDoc(doc(db, 'malta_submissions', id));
        setNotification({ message: 'Máltai üzenet sikeresen törölve!', type: 'success' });
      } else {
        await deleteDoc(doc(db, 'admins', id.toLowerCase().trim()));
        setNotification({ message: 'Admin sikeresen törölve!', type: 'success' });
      }
    } catch (error: any) {
      console.error(`Delete ${type} error:`, error);
      setNotification({ message: `Hiba történt a törlés során: ${error.message || 'Ismeretlen hiba'}`, type: 'error' });
      const collectionName = type === 'submission' ? 'submissions' : type === 'malta_submission' ? 'malta_submissions' : 'admins';
      handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
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

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
      setNotification({ message: 'Beállítások sikeresen mentve!', type: 'success' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/global');
      setNotification({ message: 'Hiba történt a mentés során!', type: 'error' });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleTiktokUrlChange = (index: number, value: string) => {
    const newUrls = [...settings.maltaTiktokUrls];
    newUrls[index] = value;
    setSettings({ ...settings, maltaTiktokUrls: newUrls });
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
    <div className="min-h-screen bg-light py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-12">
          <div className="w-full">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-dark mb-2">Adminisztrációs Felület</h1>
            <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap shrink-0 ${activeTab === 'submissions' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-dark/40 hover:text-dark'}`}
              >
                Üzenetek
              </button>
              <button
                onClick={() => setActiveTab('malta_submissions')}
                className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap shrink-0 ${activeTab === 'malta_submissions' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-dark/40 hover:text-dark'}`}
              >
                Máltai Üzenetek
              </button>
              <button
                onClick={() => setActiveTab('admins')}
                className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap shrink-0 ${activeTab === 'admins' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-dark/40 hover:text-dark'}`}
              >
                Adminok
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap shrink-0 ${activeTab === 'settings' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-dark/40 hover:text-dark'}`}
              >
                Beállítások
              </button>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full md:w-auto px-6 py-3 rounded-2xl bg-white border border-black/5 text-dark font-bold flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Kijelentkezés
          </button>
        </div>

        {activeTab === 'submissions' ? (
          <>
            <div className="mb-6 px-2">
              <p className="text-dark/60">Összesen {submissions.length} üzenet érkezett.</p>
            </div>
            {submissions.length === 0 ? (
              <div className="p-8 md:p-16 bg-white rounded-[32px] md:rounded-[40px] border border-black/5 shadow-xl text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="text-primary w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-dark mb-2">Nincs még üzenet</h2>
                <p className="text-dark/60">Amint valaki kitölti a kapcsolatfelvételi űrlapot, itt fog megjelenni.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden"
                  >
                    <div 
                      onClick={() => toggleExpand(sub.id)}
                      className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-light/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                          <User className="text-primary w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-dark text-base md:text-lg truncate">{sub.name}</h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm text-dark/40">
                            <span className="flex items-center gap-1 truncate max-w-[150px] md:max-w-none"><Mail className="w-3 h-3 shrink-0" /> {sub.email}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3 shrink-0" /> {sub.createdAt?.toDate().toLocaleString('hu-HU', { dateStyle: 'short', timeStyle: 'short' })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-end">
                        {sub.phone && (
                          <a
                            href={`tel:${sub.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2.5 md:p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center"
                            title="Hívás indítása"
                          >
                            <Phone className="w-4 h-4 md:w-5 md:h-5" />
                          </a>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(sub.id, 'submission');
                          }}
                          className="p-2.5 md:p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        {expandedId === sub.id ? <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-dark/20" /> : <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-dark/20" />}
                      </div>
                    </div>

                    {expandedId === sub.id && (
                      <div className="border-t border-black/5">
                        <div className="p-6 md:p-8 bg-light/30">
                          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
                            <div className="space-y-4">
                              <div>
                                <p className="text-[10px] md:text-xs font-bold text-dark/40 uppercase tracking-widest mb-1">Telefonszám</p>
                                <p className="text-base md:text-lg font-bold text-dark flex items-center gap-2">
                                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                                  {sub.phone || 'Nincs megadva'}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] md:text-xs font-bold text-dark/40 uppercase tracking-widest mb-1">Email cím</p>
                                <p className="text-base md:text-lg font-bold text-dark flex items-center gap-2 break-all">
                                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                                  {sub.email}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] md:text-xs font-bold text-dark/40 uppercase tracking-widest mb-2">Üzenet</p>
                            <div className="p-4 md:p-6 bg-white rounded-2xl border border-black/5 text-dark leading-relaxed text-sm md:text-base">
                              {sub.message}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : activeTab === 'malta_submissions' ? (
          <>
            <div className="mb-6 px-2">
              <p className="text-dark/60">Összesen {maltaSubmissions.length} máltai üzenet érkezett.</p>
            </div>
            {maltaSubmissions.length === 0 ? (
              <div className="p-8 md:p-16 bg-white rounded-[32px] md:rounded-[40px] border border-black/5 shadow-xl text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="text-primary w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-dark mb-2">Nincs még máltai üzenet</h2>
                <p className="text-dark/60">Amint valaki kitölti a máltai kapcsolatfelvételi űrlapot, itt fog megjelenni.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {maltaSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden"
                  >
                    <div 
                      onClick={() => toggleExpand(sub.id)}
                      className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-light/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                          <User className="text-primary w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-dark text-base md:text-lg truncate">{sub.name}</h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm text-dark/40">
                            <span className="flex items-center gap-1 truncate max-w-[150px] md:max-w-none"><Mail className="w-3 h-3 shrink-0" /> {sub.email}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3 shrink-0" /> {sub.createdAt?.toDate().toLocaleString('hu-HU', { dateStyle: 'short', timeStyle: 'short' })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-end">
                        {sub.phone && (
                          <a
                            href={`tel:${sub.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2.5 md:p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center"
                            title="Hívás indítása"
                          >
                            <Phone className="w-4 h-4 md:w-5 md:h-5" />
                          </a>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(sub.id, 'malta_submission');
                          }}
                          className="p-2.5 md:p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        {expandedId === sub.id ? <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-dark/20" /> : <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-dark/20" />}
                      </div>
                    </div>

                    {expandedId === sub.id && (
                      <div className="border-t border-black/5">
                        <div className="p-6 md:p-8 bg-light/30">
                          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
                            <div className="space-y-4">
                              <div>
                                <p className="text-[10px] md:text-xs font-bold text-dark/40 uppercase tracking-widest mb-1">Telefonszám</p>
                                <p className="text-base md:text-lg font-bold text-dark flex items-center gap-2">
                                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                                  {sub.phone || 'Nincs megadva'}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] md:text-xs font-bold text-dark/40 uppercase tracking-widest mb-1">Email cím</p>
                                <p className="text-base md:text-lg font-bold text-dark flex items-center gap-2 break-all">
                                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                                  {sub.email}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] md:text-xs font-bold text-dark/40 uppercase tracking-widest mb-2">Üzenet</p>
                            <div className="p-4 md:p-6 bg-white rounded-2xl border border-black/5 text-dark leading-relaxed text-sm md:text-base">
                              {sub.message}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : activeTab === 'settings' ? (
          <div className="space-y-6 md:space-y-8">
            <div className="bg-white rounded-[32px] md:rounded-[40px] border border-black/5 shadow-xl p-6 md:p-10">
              <h2 className="text-xl md:text-2xl font-bold text-dark mb-6 md:mb-8 flex items-center gap-2">
                <Settings className="text-primary w-5 h-5 md:w-6 md:h-6" />
                Máltai Oldal Beállításai
              </h2>

              <div className="space-y-6 md:space-y-8">
                {/* TikTok Toggle */}
                <div className="flex items-center justify-between p-4 md:p-6 bg-light rounded-2xl md:rounded-3xl border border-black/5">
                  <div className="pr-4">
                    <h3 className="font-bold text-dark text-base md:text-lg">TikTok Szekció</h3>
                    <p className="text-dark/60 text-xs md:text-sm">Kapcsolja be vagy ki a TikTok videókat a máltai oldalon.</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, maltaTiktokEnabled: !settings.maltaTiktokEnabled })}
                    className={`relative inline-flex h-7 w-12 md:h-8 md:w-14 items-center rounded-full transition-colors focus:outline-none shrink-0 ${
                      settings.maltaTiktokEnabled ? 'bg-primary' : 'bg-dark/20'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 md:h-6 md:w-6 transform rounded-full bg-white transition-transform ${
                        settings.maltaTiktokEnabled ? 'translate-x-6 md:translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* TikTok URLs */}
                <div className="space-y-4">
                  <h3 className="font-bold text-dark text-base md:text-lg px-2">TikTok Videó Linkek</h3>
                  <div className="grid gap-3 md:gap-4">
                    {settings.maltaTiktokUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[10px] md:text-xs font-bold text-primary bg-primary/10 w-5 h-5 md:w-6 md:h-6 rounded-lg flex items-center justify-center">
                          {index + 1}
                        </span>
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => handleTiktokUrlChange(index, e.target.value)}
                          placeholder="https://vm.tiktok.com/..."
                          className="w-full bg-light border border-black/5 rounded-xl md:rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-dark text-sm md:text-base"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 md:pt-4">
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings}
                    className="w-full md:w-auto px-8 md:px-12 py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-70 text-sm md:text-base"
                  >
                    {isSavingSettings ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Beállítások Mentése'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-8">
            <div className="bg-white rounded-[32px] md:rounded-[40px] border border-black/5 shadow-xl p-6 md:p-10">
              <h2 className="text-xl md:text-2xl font-bold text-dark mb-6 flex items-center gap-2">
                <Plus className="text-primary w-5 h-5 md:w-6 md:h-6" />
                Új Admin Hozzáadása
              </h2>
              <form onSubmit={handleAddAdmin} className="flex flex-col md:flex-row gap-3 md:gap-4">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/20" />
                  <input
                    required
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="pelda@gmail.com"
                    className="w-full bg-light border border-black/5 rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-dark text-sm md:text-base"
                  />
                </div>
                <button
                  disabled={isAddingAdmin}
                  type="submit"
                  className="px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-dark transition-all disabled:opacity-70 text-sm md:text-base"
                >
                  {isAddingAdmin ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Hozzáadás'}
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-bold text-dark mb-4 px-2">Adminisztrátorok Listája</h2>
              
              {/* Hardcoded main admin */}
              <div className="bg-white rounded-2xl md:rounded-3xl border border-black/5 shadow-sm p-4 md:p-6 flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                    <User className="text-primary w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-dark text-sm md:text-base truncate">barni.kroner@gmail.com</h3>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Fő Adminisztrátor</p>
                  </div>
                </div>
              </div>

              {adminEmails.map((admin) => (
                admin.email !== 'barni.kroner@gmail.com' && (
                  <div
                    key={admin.id}
                    className="bg-white rounded-2xl md:rounded-3xl border border-black/5 shadow-sm p-4 md:p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-light rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                        <User className="text-dark/20 w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-dark text-sm md:text-base truncate">{admin.email}</h3>
                        <p className="text-[10px] text-dark/40 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> 
                          Hozzáadva: {admin.addedAt?.toDate().toLocaleDateString('hu-HU')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAdmin(admin.email)}
                      className="p-2.5 md:p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {deleteConfirm?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          <div
            onClick={() => setDeleteConfirm(null)}
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-2xl">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-50 rounded-xl md:rounded-2xl flex items-center justify-center mb-6">
              <Trash2 className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-dark mb-2">Biztos benne?</h3>
            <p className="text-dark/60 mb-8 text-sm md:text-base">
              Biztosan törölni szeretné <span className="font-bold text-dark">{deleteConfirm.label}</span>? 
              Ez a művelet nem vonható vissza.
            </p>
            <div className="flex gap-3 md:gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-light text-dark font-bold hover:bg-dark/5 transition-colors text-sm md:text-base"
              >
                Mégse
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 text-sm md:text-base"
              >
                Törlés
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed bottom-4 md:bottom-8 left-4 md:left-1/2 right-4 md:right-auto z-50 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-2xl flex items-center gap-3 md:min-w-[300px] md:-translate-x-1/2 ${
          notification.type === 'success' ? 'bg-dark text-white' : 'bg-red-600 text-white'
        }`}>
          {notification.type === 'success' ? (
            <div className="w-5 h-5 md:w-6 md:h-6 bg-primary rounded-full flex items-center justify-center shrink-0">
              <Settings className="w-3 h-3 md:w-4 md:h-4 text-white" />
            </div>
          ) : (
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
          )}
          <p className="font-bold text-sm md:text-base">{notification.message}</p>
          <button 
            onClick={() => setNotification(null)}
            className="ml-auto p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
