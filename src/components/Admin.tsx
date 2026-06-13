import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2, Mail, Phone, Calendar, MessageSquare, User, Loader2, AlertCircle, ChevronDown, ChevronUp, Settings, Plus, X, Edit2, Layout, Image as ImageIcon, Briefcase, MapPin, Tag, ShieldCheck, ChevronRight } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, getDoc, setDoc, serverTimestamp, addDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { Project } from '../types';
import { cn } from '../lib/utils';

// Swiper imports for live preview
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

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

const DEFAULT_PROJECT: Project = {
  title: 'Modern Családi Ház',
  slug: 'modern-csaladi-haz',
  category: 'Zsindelytető',
  location: 'Budapest, II. kerület',
  date: '2023. Október',
  description: 'Ez a projekt egy modern minimalista családi ház tetőfedését foglalta magában. A tulajdonos választása a tartós és esztétikus bitumenes zsindelyre esett, amely tökéletesen illeszkedik az épület letisztult vonalaihoz. A munka során kiemelt figyelmet fordítottunk a szellőzésre és a rétegrendek pontos kialakítására, biztosítva a hosszú élettartamot és az energiatakarékosságot.',
  images: [
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1635424710928-0544e8512eae?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200'
  ],
  features: [
    'Prémium minőségű bitumenes zsindely',
    'Komplett bádogozás',
    'Hőszigetelés javítása',
    'Esővíz elvezető rendszer kiépítése'
  ]
};

export default function Admin() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [maltaSubmissions, setMaltaSubmissions] = useState<Submission[]>([]);
  const [adminEmails, setAdminEmails] = useState<AdminEmail[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<any>({ maltaPageEnabled: true, facebookPostsEnabled: true, facebookUrls: ['', '', ''] });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'submissions' | 'malta_submissions' | 'admins' | 'settings' | 'projects'>('submissions');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [thumbsSwiperAdmin, setThumbsSwiperAdmin] = useState<SwiperType | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; type: 'submission' | 'malta_submission' | 'admin' | 'project'; id: string; label: string } | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [projectFormData, setProjectFormData] = useState<Project>(DEFAULT_PROJECT);
  const navigate = useNavigate();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const updateMetaTags = () => {
      let themeColorMeta = document.querySelector('meta[name="theme-color"]');
      let statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');

      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta');
        themeColorMeta.setAttribute('name', 'theme-color');
        document.head.appendChild(themeColorMeta);
      }

      if (!statusBarMeta) {
        statusBarMeta = document.createElement('meta');
        statusBarMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
        document.head.appendChild(statusBarMeta);
      }

      if (darkMode) {
        themeColorMeta.setAttribute('content', '#121212');
        statusBarMeta.setAttribute('content', 'black');
      } else {
        themeColorMeta.setAttribute('content', '#F8F9FA');
        statusBarMeta.setAttribute('content', 'default');
      }
    };

    updateMetaTags();

    return () => {
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      const statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (themeColorMeta) themeColorMeta.setAttribute('content', '#F8F9FA');
      if (statusBarMeta) statusBarMeta.setAttribute('content', 'default');
    };
  }, [darkMode]);

  useEffect(() => {
    let unsubscribeSubmissions: (() => void) | undefined;
    let unsubscribeMaltaSubmissions: (() => void) | undefined;
    let unsubscribeAdmins: (() => void) | undefined;
    let unsubscribeProjects: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        sessionStorage.removeItem('isAdmin');
        navigate('/login');
        setIsAuthChecking(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setDarkMode(userDoc.data().darkMode || false);
        }
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

        // Fetch projects
        const qProjects = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Project[];
          setProjects(data);
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'projects');
        });

        // Fetch settings
        const settingsDoc = await getDoc(doc(db, 'settings', 'global'));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          setSettings({
            maltaPageEnabled: data.maltaPageEnabled ?? true,
            facebookPostsEnabled: data.facebookPostsEnabled ?? true,
            facebookUrls: data.facebookUrls || ['', '', '']
          });
        } else {
          // Initialize settings if they don't exist
          await setDoc(doc(db, 'settings', 'global'), {
            maltaPageEnabled: true,
            facebookPostsEnabled: true,
            facebookUrls: ['', '', '']
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
      if (unsubscribeProjects) unsubscribeProjects();
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

  const handleDelete = (id: string, type: 'submission' | 'malta_submission' | 'project', label?: string) => {
    setDeleteConfirm({
      isOpen: true,
      type,
      id,
      label: label || 'ezt az elemet'
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
      } else if (type === 'project') {
        await deleteDoc(doc(db, 'projects', id));
        setNotification({ message: 'Projekt sikeresen törölve!', type: 'success' });
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

  const handleOpenProjectModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setProjectFormData(project);
    } else {
      setEditingProject(null);
      setProjectFormData(DEFAULT_PROJECT);
    }
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProject(true);
    try {
      const projectData = {
        ...projectFormData,
        updatedAt: serverTimestamp(),
        createdAt: projectFormData.createdAt || serverTimestamp()
      };

      if (editingProject?.id) {
        await updateDoc(doc(db, 'projects', editingProject.id), projectData as any);
        setNotification({ message: 'Projekt sikeresen frissítve!', type: 'success' });
      } else {
        await addDoc(collection(db, 'projects'), projectData as any);
        setNotification({ message: 'Projekt sikeresen hozzáadva!', type: 'success' });
      }
      setIsProjectModalOpen(false);
    } catch (error: any) {
      handleFirestoreError(error, editingProject ? OperationType.UPDATE : OperationType.CREATE, 'projects');
      setNotification({ message: `Hiba történt a mentés során: ${error.message}`, type: 'error' });
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      // Save global settings
      await setDoc(doc(db, 'settings', 'global'), settings);

      // Save user-specific dark mode setting
      if (auth.currentUser) {
        await setDoc(doc(db, 'users', auth.currentUser.uid), { 
          darkMode,
          email: auth.currentUser.email,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
      
      setNotification({ message: 'Beállítások sikeresen mentve!', type: 'success' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users/settings');
      setNotification({ message: 'Hiba történt a mentés során!', type: 'error' });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleFacebookUrlChange = (index: number, value: string) => {
    const newUrls = [...(settings?.facebookUrls || ['', '', ''])];
    newUrls[index] = value;
    setSettings({ ...settings, facebookUrls: newUrls });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isAuthChecking || isLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-6 ${darkMode ? 'bg-[#121212]' : 'bg-light'}`}>
        <img 
          src="https://kephost.net/p/MjM2NTE3MA.png" 
          alt="Logo" 
          className="h-16 md:h-24 w-auto animate-pulse" 
          referrerPolicy="no-referrer"
        />
        <Loader2 className={`w-10 h-10 animate-spin ${darkMode ? 'text-white' : 'text-dark'}`} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#121212] text-white' : 'bg-light text-dark'} py-8 md:py-12 px-4 md:px-6`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-12">
          <div className="w-full">
            <h1 className={`text-3xl md:text-4xl font-display font-bold mb-2 ${darkMode ? 'text-white' : 'text-dark'}`}>Adminisztrációs Felület</h1>
            <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap shrink-0 ${activeTab === 'submissions' ? 'bg-primary text-white shadow-lg shadow-primary/20' : darkMode ? 'bg-white/5 text-white/40 hover:text-white' : 'bg-white text-dark/40 hover:text-dark'}`}
              >
                Üzenetek
              </button>
              {(settings as any).maltaPageEnabled !== false && (
                <button
                  onClick={() => setActiveTab('malta_submissions')}
                  className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap shrink-0 ${activeTab === 'malta_submissions' ? 'bg-primary text-white shadow-lg shadow-primary/20' : darkMode ? 'bg-white/5 text-white/40 hover:text-white' : 'bg-white text-dark/40 hover:text-dark'}`}
                >
                  Máltai Üzenetek
                </button>
              )}
              <button
                onClick={() => setActiveTab('admins')}
                className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap shrink-0 ${activeTab === 'admins' ? 'bg-primary text-white shadow-lg shadow-primary/20' : darkMode ? 'bg-white/5 text-white/40 hover:text-white' : 'bg-white text-dark/40 hover:text-dark'}`}
              >
                Adminok
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap shrink-0 ${activeTab === 'settings' ? 'bg-primary text-white shadow-lg shadow-primary/20' : darkMode ? 'bg-white/5 text-white/40 hover:text-white' : 'bg-white text-dark/40 hover:text-dark'}`}
              >
                Beállítások
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap shrink-0 ${activeTab === 'projects' ? 'bg-primary text-white shadow-lg shadow-primary/20' : darkMode ? 'bg-white/5 text-white/40 hover:text-white' : 'bg-white text-dark/40 hover:text-dark'}`}
              >
                Referenciák
              </button>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className={`w-full md:w-auto px-6 py-3 rounded-2xl border font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-red-500/10 hover:text-red-500' : 'bg-white border-black/5 text-dark hover:bg-red-50 hover:text-red-600'}`}
          >
            <LogOut className="w-5 h-5" />
            Kijelentkezés
          </button>
        </div>

        {activeTab === 'submissions' ? (
          <>
            <div className="mb-6 px-2">
              <p className={darkMode ? 'text-white/60' : 'text-dark/60'}>Összesen {submissions.length} üzenet érkezett.</p>
            </div>
            {submissions.length === 0 ? (
              <div className={`p-8 md:p-16 rounded-[32px] md:rounded-[40px] border shadow-xl text-center ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="text-primary w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h2 className={`text-xl md:text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-dark'}`}>Nincs még üzenet</h2>
                <p className={darkMode ? 'text-white/60' : 'text-dark/60'}>Amint valaki kitölti a kapcsolatfelvételi űrlapot, itt fog megjelenni.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className={`rounded-3xl border shadow-sm overflow-hidden ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}
                  >
                    <div 
                      onClick={() => toggleExpand(sub.id)}
                      className={`p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-light/50'}`}
                    >
                      <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                          <User className="text-primary w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className={`font-bold text-base md:text-lg truncate ${darkMode ? 'text-white' : 'text-dark'}`}>{sub.name}</h3>
                          <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm ${darkMode ? 'text-white/40' : 'text-dark/40'}`}>
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
                        {expandedId === sub.id ? <ChevronUp className={`w-5 h-5 md:w-6 md:h-6 ${darkMode ? 'text-white/20' : 'text-dark/20'}`} /> : <ChevronDown className={`w-5 h-5 md:w-6 md:h-6 ${darkMode ? 'text-white/20' : 'text-dark/20'}`} />}
                      </div>
                    </div>

                    {expandedId === sub.id && (
                      <div className={`border-t ${darkMode ? 'border-white/10' : 'border-black/5'}`}>
                        <div className={`p-6 md:p-8 ${darkMode ? 'bg-white/5' : 'bg-light/30'}`}>
                          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
                            <div className="space-y-4">
                              <div>
                                <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 ${darkMode ? 'text-white/40' : 'text-dark/40'}`}>Telefonszám</p>
                                <p className={`text-base md:text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-dark'}`}>
                                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                                  {sub.phone || 'Nincs megadva'}
                                </p>
                              </div>
                              <div>
                                <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 ${darkMode ? 'text-white/40' : 'text-dark/40'}`}>Email cím</p>
                                <p className={`text-base md:text-lg font-bold flex items-center gap-2 break-all ${darkMode ? 'text-white' : 'text-dark'}`}>
                                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                                  {sub.email}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 ${darkMode ? 'text-white/40' : 'text-dark/40'}`}>Üzenet</p>
                            <div className={`p-4 md:p-6 rounded-2xl border leading-relaxed text-sm md:text-base ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-black/5 text-dark'}`}>
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
        ) : activeTab === 'malta_submissions' && (settings as any).maltaPageEnabled !== false ? (
          <>
            <div className="mb-6 px-2">
              <p className={darkMode ? 'text-white/60' : 'text-dark/60'}>Összesen {maltaSubmissions.length} máltai üzenet érkezett.</p>
            </div>
            {maltaSubmissions.length === 0 ? (
              <div className={`p-8 md:p-16 rounded-[32px] md:rounded-[40px] border shadow-xl text-center ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="text-primary w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h2 className={`text-xl md:text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-dark'}`}>Nincs még máltai üzenet</h2>
                <p className={darkMode ? 'text-white/60' : 'text-dark/60'}>Amint valaki kitölti a máltai kapcsolatfelvételi űrlapot, itt fog megjelenni.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {maltaSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className={`rounded-3xl border shadow-sm overflow-hidden ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}
                  >
                    <div 
                      onClick={() => toggleExpand(sub.id)}
                      className={`p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-light/50'}`}
                    >
                      <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                          <User className="text-primary w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className={`font-bold text-base md:text-lg truncate ${darkMode ? 'text-white' : 'text-dark'}`}>{sub.name}</h3>
                          <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm ${darkMode ? 'text-white/40' : 'text-dark/40'}`}>
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
                        {expandedId === sub.id ? <ChevronUp className={`w-5 h-5 md:w-6 md:h-6 ${darkMode ? 'text-white/20' : 'text-dark/20'}`} /> : <ChevronDown className={`w-5 h-5 md:w-6 md:h-6 ${darkMode ? 'text-white/20' : 'text-dark/20'}`} />}
                      </div>
                    </div>

                    {expandedId === sub.id && (
                      <div className={`border-t ${darkMode ? 'border-white/10' : 'border-black/5'}`}>
                        <div className={`p-6 md:p-8 ${darkMode ? 'bg-white/5' : 'bg-light/30'}`}>
                          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
                            <div className="space-y-4">
                              <div>
                                <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 ${darkMode ? 'text-white/40' : 'text-dark/40'}`}>Telefonszám</p>
                                <p className={`text-base md:text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-dark'}`}>
                                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                                  {sub.phone || 'Nincs megadva'}
                                </p>
                              </div>
                              <div>
                                <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 ${darkMode ? 'text-white/40' : 'text-dark/40'}`}>Email cím</p>
                                <p className={`text-base md:text-lg font-bold flex items-center gap-2 break-all ${darkMode ? 'text-white' : 'text-dark'}`}>
                                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                                  {sub.email}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 ${darkMode ? 'text-white/40' : 'text-dark/40'}`}>Üzenet</p>
                            <div className={`p-4 md:p-6 rounded-2xl border leading-relaxed text-sm md:text-base ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-black/5 text-dark'}`}>
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
        ) : activeTab === 'projects' ? (
          <div className="space-y-6 md:space-y-8">
            <div className="flex justify-between items-center px-2">
              <h2 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-dark'}`}>Portfólió Referenciák</h2>
              <button
                onClick={() => handleOpenProjectModal()}
                className="px-6 py-3 rounded-2xl bg-primary text-white font-bold flex items-center gap-2 hover:bg-dark transition-all shadow-lg shadow-primary/20"
              >
                <Plus className="w-5 h-5" />
                Új Projekt
              </button>
            </div>
            
            {projects.length === 0 ? (
              <div className={`p-8 md:p-16 rounded-[32px] md:rounded-[40px] border shadow-xl text-center ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="text-primary w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h2 className={`text-xl md:text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-dark'}`}>Nincs még projekt</h2>
                <p className={darkMode ? 'text-white/60' : 'text-dark/60'}>Vegyen fel új projektet a „Új Projekt” gombbal.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`rounded-3xl border shadow-sm overflow-hidden flex flex-col ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={project.images[0]} 
                        alt={project.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider">
                        {project.category}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-4">
                        <h3 className={`font-bold text-xl mb-1 ${darkMode ? 'text-white' : 'text-dark'}`}>{project.title}</h3>
                        <p className={`text-xs flex items-center gap-1 ${darkMode ? 'text-white/40' : 'text-dark/40'}`}>
                          <MapPin className="w-3 h-3" /> {project.location}
                        </p>
                      </div>
                      <div className="mt-auto flex gap-3 pt-4 border-t border-black/5">
                        <button
                          onClick={() => handleOpenProjectModal(project)}
                          className={`flex-1 px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group/edit ${darkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-light text-dark hover:bg-dark/10'}`}
                        >
                          <Edit2 className="w-4 h-4 text-primary group-hover/edit:scale-110 transition-transform" />
                          Szerkesztés
                        </button>
                        <button
                          onClick={() => handleDelete(project.id!, 'project', project.title)}
                          className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'settings' ? (
          <div className="space-y-6 md:space-y-8">
            <div className={`rounded-[32px] md:rounded-[40px] border shadow-xl p-6 md:p-10 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
              <h2 className={`text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-dark'}`}>
                <Settings className="text-primary w-5 h-5 md:w-6 md:h-6" />
                Máltai Oldal Beállításai
              </h2>

              <div className="space-y-6 md:space-y-8">
                {/* Dark Mode Toggle */}
                <div className={`flex items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-3xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-light border-black/5'}`}>
                  <div className="pr-4">
                    <h3 className={`font-bold text-base md:text-lg ${darkMode ? 'text-white' : 'text-dark'}`}>Sötét Mód</h3>
                    <p className={darkMode ? 'text-white/60 text-xs md:text-sm' : 'text-dark/60 text-xs md:text-sm'}>Kapcsolja be a sötét témát az admin felületen.</p>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative inline-flex h-7 w-12 md:h-8 md:w-14 items-center rounded-full transition-colors focus:outline-none shrink-0 ${
                      darkMode ? 'bg-primary' : 'bg-dark/20'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 md:h-6 md:w-6 transform rounded-full bg-white transition-transform ${
                        darkMode ? 'translate-x-6 md:translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Malta Setting Toggle */}
                <div className={`flex items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-3xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-light border-black/5'}`}>
                  <div className="pr-4">
                    <h3 className={`font-bold text-base md:text-lg ${darkMode ? 'text-white' : 'text-dark'}`}>Máltai Szolgáltatások Oldal</h3>
                    <p className={darkMode ? 'text-white/60 text-xs md:text-sm' : 'text-dark/60 text-xs md:text-sm'}>Máltai oldal és gombok láthatóságának bekapcsolása.</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, maltaPageEnabled: !(settings as any).maltaPageEnabled })}
                    className={`relative inline-flex h-7 w-12 md:h-8 md:w-14 items-center rounded-full transition-colors focus:outline-none shrink-0 ${
                      (settings as any).maltaPageEnabled ? 'bg-primary' : 'bg-dark/20'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 md:h-6 md:w-6 transform rounded-full bg-white transition-transform ${
                        (settings as any).maltaPageEnabled ? 'translate-x-6 md:translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Facebook Posts Toggle */}
                <div className={`flex items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-3xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-light border-black/5'}`}>
                  <div className="pr-4">
                    <h3 className={`font-bold text-base md:text-lg ${darkMode ? 'text-white' : 'text-dark'}`}>Facebook Posztok</h3>
                    <p className={darkMode ? 'text-white/60 text-xs md:text-sm' : 'text-dark/60 text-xs md:text-sm'}>Legutóbbi Facebook posztok megjelenítése a főoldalon.</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, facebookPostsEnabled: !(settings as any).facebookPostsEnabled })}
                    className={`relative inline-flex h-7 w-12 md:h-8 md:w-14 items-center rounded-full transition-colors focus:outline-none shrink-0 ${
                      (settings as any).facebookPostsEnabled ? 'bg-primary' : 'bg-dark/20'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 md:h-6 md:w-6 transform rounded-full bg-white transition-transform ${
                        (settings as any).facebookPostsEnabled ? 'translate-x-6 md:translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Facebook URLs */}
                {(settings as any).facebookPostsEnabled && (
                  <div className="space-y-4">
                    <h3 className={`font-bold text-base md:text-lg px-2 ${darkMode ? 'text-white' : 'text-dark'}`}>Facebook Poszt Linkek (Opcionális)</h3>
                    <div className="grid gap-3 md:gap-4">
                      {((settings as any).facebookUrls || ['', '', '']).map((url: string, index: number) => (
                        <div key={index} className="relative">
                          <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[10px] md:text-xs font-bold text-primary bg-primary/10 w-5 h-5 md:w-6 md:h-6 rounded-lg flex items-center justify-center">
                            {index + 1}
                          </span>
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => handleFacebookUrlChange(index, e.target.value)}
                            placeholder="https://www.facebook.com/krisztian.maczko.7/posts/..."
                            className={`w-full border rounded-xl md:rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-sm md:text-base ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-light border-black/5 text-dark'}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
            <div className={`rounded-[32px] md:rounded-[40px] border shadow-xl p-6 md:p-10 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
              <h2 className={`text-xl md:text-2xl font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-dark'}`}>
                <Plus className="text-primary w-5 h-5 md:w-6 md:h-6" />
                Új Admin Hozzáadása
              </h2>
              <form onSubmit={handleAddAdmin} className="flex flex-col md:flex-row gap-3 md:gap-4">
                <div className="flex-1 relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-white/20' : 'text-dark/20'}`} />
                  <input
                    required
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="pelda@gmail.com"
                    className={`w-full border rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-sm md:text-base ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-light border-black/5 text-dark'}`}
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
              <h2 className={`text-lg md:text-xl font-bold mb-4 px-2 ${darkMode ? 'text-white' : 'text-dark'}`}>Adminisztrátorok Listája</h2>
              
              {/* Hardcoded main admin */}
              <div className={`rounded-2xl md:rounded-3xl border shadow-sm p-4 md:p-6 flex items-center justify-between ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                    <User className="text-primary w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className={`font-bold text-sm md:text-base truncate ${darkMode ? 'text-white' : 'text-dark'}`}>barni.kroner@gmail.com</h3>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Fő Adminisztrátor</p>
                  </div>
                </div>
              </div>

              {adminEmails.map((admin) => (
                admin.email !== 'barni.kroner@gmail.com' && (
                  <div
                    key={admin.id}
                    className={`rounded-2xl md:rounded-3xl border shadow-sm p-4 md:p-6 flex items-center justify-between ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}
                  >
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${darkMode ? 'bg-white/5' : 'bg-light'}`}>
                        <User className={`w-5 h-5 md:w-6 md:h-6 ${darkMode ? 'text-white/20' : 'text-dark/20'}`} />
                      </div>
                      <div className="min-w-0">
                        <h3 className={`font-bold text-sm md:text-base truncate ${darkMode ? 'text-white' : 'text-dark'}`}>{admin.email}</h3>
                        <p className={`text-[10px] flex items-center gap-1 ${darkMode ? 'text-white/40' : 'text-dark/40'}`}>
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
          <div className={`relative w-full max-w-md rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-2xl ${darkMode ? 'bg-[#1a1a1a] border border-white/10' : 'bg-white'}`}>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-50 rounded-xl md:rounded-2xl flex items-center justify-center mb-6">
              <Trash2 className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
            </div>
            <h3 className={`text-xl md:text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-dark'}`}>Biztos benne?</h3>
            <p className={`mb-8 text-sm md:text-base ${darkMode ? 'text-white/60' : 'text-dark/60'}`}>
              Biztosan törölni szeretné <span className={`font-bold ${darkMode ? 'text-white' : 'text-dark'}`}>{deleteConfirm.label}</span>? 
              Ez a művelet nem vonható vissza.
            </p>
            <div className="flex gap-3 md:gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className={`flex-1 px-4 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold transition-colors text-sm md:text-base ${darkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-light text-dark hover:bg-dark/5'}`}
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

      {/* Project Management Modal - Live Preview Editor */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-[60] flex justify-center items-center p-0 md:p-8">
          <div
            onClick={() => !isSavingProject && setIsProjectModalOpen(false)}
            className="fixed inset-0 bg-dark/80 backdrop-blur-md hidden md:block"
          />
          <div className={`relative w-full max-h-full max-w-7xl md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden ${darkMode ? 'bg-[#1a1a1a] md:border md:border-white/10' : 'bg-light'}`}>
            {/* Modal Header/Toolbar */}
            <div className={`flex-none z-20 flex items-center justify-between px-4 py-3 md:px-8 md:py-4 border-b ${darkMode ? 'bg-dark/80 border-white/10' : 'bg-white/80 border-black/5'} backdrop-blur-xl`}>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {editingProject ? <Edit2 className="w-4 h-4 md:w-5 md:h-5" /> : <Plus className="w-4 h-4 md:w-5 md:h-5" />}
                </div>
                <div>
                  <h2 className={`font-bold text-sm md:text-base ${darkMode ? 'text-white' : 'text-dark'}`}>
                    {editingProject ? 'Szerkesztés' : 'Új Projekt'}
                  </h2>
                  <p className={`text-[10px] uppercase tracking-widest font-bold hidden md:block ${darkMode ? 'text-white/40' : 'text-dark/40'}`}>
                    Live Preview Editor • {projectFormData.slug}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className={`px-3 py-2 md:px-6 md:py-2 rounded-xl font-bold transition-all text-xs md:text-sm ${darkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-white text-dark hover:bg-dark/5 shadow-sm'}`}
                >
                  Mégse
                </button>
                <button
                  onClick={handleSaveProject}
                  disabled={isSavingProject}
                  className="px-4 py-2 md:px-8 md:py-2 rounded-xl bg-primary text-white font-bold hover:bg-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-70 flex items-center justify-center gap-2 text-xs md:text-sm"
                >
                  {isSavingProject ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Mentés'}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-12 custom-scrollbar pb-24 md:pb-12">
              <div className="max-w-5xl mx-auto">
                <div className="grid lg:grid-cols-12 gap-6 md:gap-12 mb-8 md:mb-16">
                  <div className="lg:col-span-7 space-y-6 md:space-y-8">
                    <div>
                      <div className="hidden md:inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-6">
                        Referencia Projekt
                      </div>
                      <input
                        placeholder="Projekt címe..."
                        className={`w-full text-2xl md:text-5xl font-display font-bold bg-transparent border-b-2 border-transparent focus:border-primary focus:outline-none transition-all placeholder:opacity-20 ${darkMode ? 'text-white' : 'text-dark'}`}
                        value={projectFormData.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          const slug = title.toLowerCase()
                            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                            .replace(/ /g, '-')
                            .replace(/[^\w-]+/g, '');
                          setProjectFormData({ ...projectFormData, title, slug });
                        }}
                      />
                    </div>
                    
                    <div className="relative">
                      <textarea
                        placeholder="Projekt leírása..."
                        rows={4}
                        className={`w-full text-sm md:text-lg leading-relaxed font-medium bg-transparent border-l-2 md:border-l-4 border-primary/10 pl-4 md:pl-6 focus:border-primary focus:outline-none transition-all placeholder:opacity-20 resize-none ${darkMode ? 'text-white/70' : 'text-dark/70'}`}
                        value={projectFormData.description}
                        onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                      />
                    </div>

                    <div className={`p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-xl relative overflow-hidden group ${darkMode ? 'bg-dark text-white border border-white/5' : 'bg-white border border-black/5 text-dark'}`}>
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 transition-transform duration-700" />
                      <div className="flex justify-between items-center mb-6 md:mb-8 relative z-10">
                        <h3 className="text-lg md:text-2xl font-bold flex items-center gap-2 md:gap-3">
                          <div className="w-1.5 md:w-2 h-6 md:h-8 bg-primary rounded-full" />
                          Projekt Jellemzők
                        </h3>
                        <button
                          type="button"
                          onClick={() => setProjectFormData({ ...projectFormData, features: [...projectFormData.features, ''] })}
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-primary/10 hover:bg-primary/20'}`}
                        >
                          <Plus className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                        </button>
                      </div>
                      <ul className="grid sm:grid-cols-2 gap-4 md:gap-6 relative z-10">
                        {projectFormData.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3 md:gap-4">
                            <div className="w-5 h-5 md:w-6 md:h-6 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
                              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                            </div>
                            <input
                              placeholder="Új jellemző..."
                              className={`bg-transparent border-b focus:border-primary focus:outline-none w-full py-1 text-sm md:text-base font-medium ${darkMode ? 'border-white/10 text-white/90' : 'border-black/10 text-dark/90'}`}
                              value={feature}
                              onChange={(e) => {
                                const newFeatures = [...projectFormData.features];
                                newFeatures[i] = e.target.value;
                                setProjectFormData({ ...projectFormData, features: newFeatures });
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newFeatures = projectFormData.features.filter((_, idx) => idx !== i);
                                setProjectFormData({ ...projectFormData, features: newFeatures });
                              }}
                              className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1 md:hover:text-red-400 text-red-500 md:text-inherit transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className={`p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border shadow-sm space-y-6 md:space-y-8 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                      <h4 className="text-xs md:text-sm font-bold text-primary uppercase tracking-[0.2em] text-center">Projekt Adatok</h4>
                      
                      <div className="space-y-3 md:space-y-4">
                        <div className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl border ${darkMode ? 'bg-primary/5 border-primary/10' : 'bg-primary/5 border-primary/5'}`}>
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Tag className="w-4 h-4 md:w-5 md:h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[9px] md:text-[10px] text-dark/30 uppercase font-bold tracking-wider mb-0.5">Kategória</p>
                            <input
                              className={`w-full font-bold bg-transparent border-none p-0 focus:ring-0 text-base md:text-lg ${darkMode ? 'text-white' : 'text-dark'}`}
                              value={projectFormData.category}
                              onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl border ${darkMode ? 'bg-primary/5 border-primary/10' : 'bg-primary/5 border-primary/5'}`}>
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[9px] md:text-[10px] text-dark/30 uppercase font-bold tracking-wider mb-0.5">Helyszín</p>
                            <input
                              className={`w-full font-bold bg-transparent border-none p-0 focus:ring-0 text-base md:text-lg ${darkMode ? 'text-white' : 'text-dark'}`}
                              value={projectFormData.location}
                              onChange={(e) => setProjectFormData({ ...projectFormData, location: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl border ${darkMode ? 'bg-primary/5 border-primary/10' : 'bg-primary/5 border-primary/5'}`}>
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[9px] md:text-[10px] text-dark/30 uppercase font-bold tracking-wider mb-0.5">Dátum</p>
                            <input
                              className={`w-full font-bold bg-transparent border-none p-0 focus:ring-0 text-base md:text-lg ${darkMode ? 'text-white' : 'text-dark'}`}
                              value={projectFormData.date}
                              onChange={(e) => setProjectFormData({ ...projectFormData, date: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/5 opacity-60">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] text-dark/30 uppercase font-bold tracking-wider mb-0.5">Garancia</p>
                            <p className="font-bold text-dark text-lg">Minden munkára</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 md:mt-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-primary/10 text-primary">
                        <ImageIcon className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <h2 className={`text-xl md:text-3xl font-display font-bold ${darkMode ? 'text-white' : 'text-dark'}`}>Projekt Galéria</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProjectFormData({ ...projectFormData, images: [...projectFormData.images, ''] })}
                      className="px-4 py-2 md:px-6 md:py-2 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                      <Plus className="w-4 h-4" /> Kép hozzáadása
                    </button>
                  </div>

                  {/* Live Gallery Edit Mode */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
                    {projectFormData.images.map((img, i) => (
                      <div key={i} className="group relative aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden border border-black/5 shadow-md bg-dark flex flex-col justify-end">
                        <img 
                          src={img || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=400'} 
                          alt="Preview" 
                          className="absolute inset-0 w-full h-full object-cover opacity-60 md:opacity-60 md:group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent flex flex-col justify-end p-3 md:p-4">
                          <div className="flex gap-2">
                            <input
                              className="flex-1 bg-white/20 md:bg-white/10 backdrop-blur-md border border-white/30 md:border-white/20 rounded-xl px-3 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-primary placeholder:text-white/60 font-medium"
                              value={img}
                              placeholder="Kép URL..."
                              onChange={(e) => {
                                const newImages = [...projectFormData.images];
                                newImages[i] = e.target.value;
                                setProjectFormData({ ...projectFormData, images: newImages });
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = projectFormData.images.filter((_, idx) => idx !== i);
                                setProjectFormData({ ...projectFormData, images: newImages });
                              }}
                              className="p-2 md:p-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                            >
                              <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                          </div>
                        </div>
                        <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md">
                          #{i + 1}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Real Live Preview with Swiper */}
                  <div className="relative pt-8 md:pt-12 border-t border-black/5 hidden md:block">
                    <p className={`text-center text-xs font-bold uppercase tracking-widest mb-8 ${darkMode ? 'text-white/20' : 'text-dark/20'}`}>
                      Interaktív Előnézet
                    </p>
                    <div className="relative">
                      <Swiper
                        spaceBetween={10}
                        navigation={true}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        thumbs={{ swiper: thumbsSwiperAdmin && !thumbsSwiperAdmin.destroyed ? thumbsSwiperAdmin : null }}
                        modules={[FreeMode, Navigation, Thumbs, Pagination]}
                        className="rounded-[2.5rem] overflow-hidden shadow-2xl mb-6 bg-dark aspect-[16/9] lg:aspect-[21/9]"
                      >
                        {projectFormData.images.filter(img => img).map((img, i) => (
                          <SwiperSlide key={i}>
                            <img 
                              src={img} 
                              alt={`${projectFormData.title} ${i + 1}`} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                </div>
              </div>
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
