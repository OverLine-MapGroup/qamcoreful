import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentMessages, PsychologistCase, createComplaint, CreateComplaintRequest } from '../api/student';
import { useAuthStore } from '../store/auth';
import {
  Bell, Info, Home, User, Calendar, AlertTriangle,
  Lock, ShieldCheck, Users, X, ChevronRight, ExternalLink,
  Send, Check, ArrowLeft, ArrowRight, ArrowUpRight, Bot, Wind,
  Zap, MessageCircle
} from 'lucide-react';

const CLUBS = [
  { name: 'Support Club',   url: 'https://t.me/+XCvc1iO4eL4wZjcx' },
  { name: 'Art',            url: 'https://t.me/+0DsXx1NVM-szNTYx' },
  { name: 'Desk Games',     url: 'https://t.me/+zhUf5MwA03YwMDhh' },
  { name: 'Voluntary Club', url: 'https://t.me/+jp26U9ipQtxmMmQx' },
  { name: 'IT Club',        url: 'https://t.me/+yaFmSaBvIqU2ZTRh' },
  { name: 'Sport Club',     url: 'https://t.me/+iGyzvgVx60ZiOTUx' },
];

const COMPLAINT_CATEGORIES = [
  { id: 'BULLYING',       label: 'Буллинг',       icon: '😔' },
  { id: 'DEPRESSION',     label: 'Депрессия',      icon: '💙' },
  { id: 'TEACHER',        label: 'Учитель',        icon: '⚠️' },
  { id: 'INFRASTRUCTURE', label: 'Инфраструктура', icon: '🏗️' },
];

const THEMES = {
  light: {
    bg: '#f7f6f3',
    card: '#ffffff',
    text: '#111827',
    muted: '#9ca3af',
    mutedDark: '#6b7280',
    border: 'rgba(0,0,0,0.06)',
    inputBg: '#f9fafb',
    mutedBg: '#f3f4f6',
    navBg: '#ffffff',
  },
  dark: {
    bg: '#0d0f1a',
    card: '#161926',
    text: '#f1f5f9',
    muted: '#64748b',
    mutedDark: '#94a3b8',
    border: 'rgba(255,255,255,0.07)',
    inputBg: '#1e2235',
    mutedBg: '#1e2235',
    navBg: '#161926',
  },
};

type Theme = 'light' | 'dark';
type Tab   = 'home' | 'profile';
type Modal = 'none' | 'notifications' | 'complaint' | 'profile' | 'qamunity' | 'booking';

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const [messages, setMessages]                   = useState<PsychologistCase[]>([]);
  const [loading, setLoading]                     = useState(true);
  const [activeTab, setActiveTab]                 = useState<Tab>('home');
  const [modal, setModal]                         = useState<Modal>('none');
  const [theme, setTheme]                         = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [complaintStep, setComplaintStep]         = useState(1);
  const [complaintCategory, setComplaintCategory] = useState('');
  const [complaintText, setComplaintText]         = useState('');
  const [complaintSent, setComplaintSent]         = useState(false);

  const t  = THEMES[theme];
  const PR = '#4361ae';
  const SA = '#10b981';
  const DA = '#ef4444';

  useEffect(() => {
    getStudentMessages()
      .then(d => setMessages(d || []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  const switchTheme = (next: Theme) => { setTheme(next); localStorage.setItem('theme', next); };
  const handleLogout = () => { logout(); navigate('/login'); };
  const openComplaint = () => {
    setComplaintStep(1); setComplaintCategory(''); setComplaintText(''); setComplaintSent(false);
    setModal('complaint');
  };
  const handleComplaintSubmit = async () => {
    try { await createComplaint({ category: complaintCategory as any, text: complaintText }); setComplaintSent(true); }
    catch (err) { console.error(err); }
  };

  const card = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: '#F8FAFC', borderRadius: 14, border: `1px solid ${t.border}`,
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)', ...extra,
  });

  const glassIcon = (color: string, size = 40): React.CSSProperties => ({
    width: size, height: size, flexShrink: 0,
    borderRadius: '22%',
    background: 'rgba(255,255,255,0.88)',
    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.9)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color,
  });

  const btn0: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', padding: 0 };

  const Overlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div onClick={() => setModal('none')} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 200 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: t.card, borderRadius: '28px 28px 0 0', width: '100%', maxWidth: 500, padding: 24, paddingBottom: 44, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)' }}>
        {children}
      </div>
    </div>
  );

  const MHeader: React.FC<{ title: string; subtitle?: string; onBack?: () => void }> = ({ title, subtitle, onBack }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {onBack && <button onClick={onBack} style={{ ...btn0, color: t.muted, display: 'flex' }}><ArrowLeft size={20} /></button>}
        <div>
          <p style={{ margin: 0, fontWeight: 800, fontSize: 18, color: t.text }}>{title}</p>
          {subtitle && <p style={{ margin: '3px 0 0', fontSize: 13, color: t.muted }}>{subtitle}</p>}
        </div>
      </div>
      <button onClick={() => setModal('none')} style={{ ...btn0, color: t.muted }}><X size={20} /></button>
    </div>
  );

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.bg }}>
      <p style={{ color: t.muted }}>Загрузка...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'stretch', fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif", width: '100%', position: 'relative', overflowX: 'hidden' }}>
      <div style={{ width: '100%', maxWidth: 500, margin: '0 auto', position: 'relative', display: 'flex', flexDirection: 'column', flex: 1 }}>

      {/* HEADER */}
      <header style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px 0', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ ...glassIcon('#2a6049', 46), background: '#2a6049', borderRadius: 14 }}>
            <ShieldCheck size={24} color="white" strokeWidth={2.5} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 20, letterSpacing: -0.5, color: '#2a6049', display: 'inline-block', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>QAMCORE</p>
            <p style={{ margin: 0, fontSize: 8, fontWeight: 800, color: '#2a6049', letterSpacing: '0.18em', opacity: 0.7, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>ELITE SECURITY</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => navigate('/landing')} style={{ ...btn0, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <Info size={22} style={{ color: t.muted }} strokeWidth={1.8} />
          </button>
          <button onClick={() => setModal('notifications')} style={{ ...btn0, position: 'relative', width: 44, height: 44, background: 'white', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={22} style={{ color: t.mutedDark }} strokeWidth={1.8} />
            {messages.length > 0 && <span style={{ position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: '50%', background: DA, border: `2px solid ${t.bg}` }} />}
          </button>
        </div>
      </header>

      {/* BODY */}
      <main style={{ width: '100%', padding: '16px 20px 120px', display: 'flex', flexDirection: 'column', gap: 16, boxSizing: 'border-box' }}>

        {/* Check-in */}
        <button onClick={() => navigate('/checkin')}
          style={{ ...card(), padding: '12px 16px', height: 64, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', width: '100%', textAlign: 'left', border: 'none', boxSizing: 'border-box' }}>
          <div style={{ ...glassIcon('#2a6049', 42), flexShrink: 0 }}><Zap size={22} strokeWidth={2} /></div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: t.text }}>Пройти чек-ин</p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: t.muted }}>Ежедневный опрос — 1 минута</p>
          </div>
          <ChevronRight size={18} style={{ color: t.muted }} />
        </button>

        {/* 2×2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

          {/* AI Sezim — в разработке */}
          <div style={{ background: '#f3f4f6', borderRadius: 32, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', padding: '20px', height: 135, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: 0.45, cursor: 'not-allowed', position: 'relative' }}>
            <div style={{ ...glassIcon('#9ca3af', 40) }}><Lock size={22} strokeWidth={2} color="#9ca3af" /></div>
            <div>
              <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 15, color: '#111827', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Al Sezim</p>
              <p style={{ margin: 0, fontSize: 10, color: '#9ca3af', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.05em' }}>В разработке</p>
            </div>
          </div>

          {/* Практики — в разработке */}
          <div style={{ background: '#f3f4f6', borderRadius: 32, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', padding: '20px', height: 135, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: 0.45, cursor: 'not-allowed', position: 'relative' }}>
            <div style={{ ...glassIcon('#9ca3af', 40) }}><Lock size={22} strokeWidth={2} color="#9ca3af" /></div>
            <div>
              <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 15, color: '#111827', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Практики</p>
              <p style={{ margin: 0, fontSize: 10, color: '#9ca3af', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.05em' }}>В разработке</p>
            </div>
          </div>

          {/* Психолог */}
          <div onClick={() => setModal('booking')} style={{ background: '#edf4f0', borderRadius: 32, border: '1px solid rgba(42,96,73,0.12)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', padding: '20px', height: 135, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div style={{ ...glassIcon('#2a6049', 40) }}><Calendar size={24} strokeWidth={2} color="#2a6049" /></div>
            <div>
              <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 15, color: '#111827', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Психолог</p>
              <p style={{ margin: 0, fontSize: 9, color: '#2a6049', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: "'Plus Jakarta Sans', sans-serif", opacity: 0.7 }}>ЗАПИСЬ</p>
            </div>
          </div>

          {/* Жалоба — иконка AlertTriangle */}
          <div onClick={openComplaint} style={{ background: '#fdf4f0', borderRadius: 32, border: '1px solid rgba(210,120,80,0.12)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', padding: '20px', height: 135, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div style={{ ...glassIcon('#c0714a', 40) }}><AlertTriangle size={24} strokeWidth={2} color="#c0714a" /></div>
            <div>
              <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 15, color: '#111827', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Жалоба</p>
              <p style={{ margin: 0, fontSize: 9, color: '#c0714a', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: "'Plus Jakarta Sans', sans-serif", opacity: 0.7 }}>АНОНИМНО</p>
            </div>
          </div>
        </div>

        {/* QAMUNITY — liquid glass */}
        <div onClick={() => setModal('qamunity')} style={{ borderRadius: 36, padding: '20px 24px', cursor: 'pointer', position: 'relative', overflow: 'hidden',
          background: '#2a6049',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.25)',
          boxShadow: '0 8px 32px rgba(42,96,73,0.40), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%)', borderRadius: '36px 36px 0 0', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 18, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'center', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)' }}>
              <Users size={24} color="white" strokeWidth={1.5} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: 'white', letterSpacing: -0.3, display: 'inline-block', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>QAMUNITY</p>
                <span style={{ background: 'rgba(16,185,129,0.2)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(16,185,129,0.3)', color: SA, fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 20 }}>● LIVE</span>
              </div>
              <p style={{ margin: '0 0 8px', fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>1,240 друзей в сети</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {['#a78bfa','#f9a8d4','#93c5fd'].map((c, i) => (
                  <div key={i} style={{ width: 22, height: 22, borderRadius: '50%', background: c, border: '2px solid rgba(255,255,255,0.3)', marginLeft: i === 0 ? 0 : -7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={10} color="white" />
                  </div>
                ))}
                <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>+12</span>
              </div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 14, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
              <ArrowUpRight size={20} color="white" />
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div style={{ background: '#F8FAFC', borderRadius: 28, border: `1px solid ${t.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: 16, background: '#eaf2ee', border: '1px solid #2a604930', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ShieldCheck size={22} color="#2a6049" strokeWidth={1.5} /></div>
          <div>
            <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: t.muted, textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: "'Plus Jakarta Sans', sans-serif", opacity: 0.6 }}>SECURITY STATUS</p>
            <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 600, color: t.text }}>Система защиты активна 24/7</p>
          </div>
          <div style={{ marginLeft: 'auto', width: 9, height: 9, borderRadius: '50%', background: SA, boxShadow: `0 0 0 3px ${SA}30` }} />
        </div>

      </main>
      </div>

      {/* BOTTOM NAV */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, margin: '0 auto', width: '100%', maxWidth: 500, background: t.navBg, borderTop: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '16px 0 32px', zIndex: 100, boxShadow: '0 -2px 16px rgba(0,0,0,0.06)', overflow: 'visible', boxSizing: 'border-box' }}>
        <button onClick={() => setActiveTab('home')} style={{ ...btn0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1, justifyContent: 'center' }}>
          <Home size={22} style={{ color: activeTab === 'home' ? '#2a6049' : t.muted }} fill={activeTab === 'home' ? '#2a6049' : 'none'} strokeWidth={activeTab === 'home' ? 0 : 1.8} />
          <span style={{ fontSize: 7, fontWeight: 700, color: activeTab === 'home' ? '#2a6049' : t.muted, textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Home</span>
        </button>

        <div style={{ position: 'relative', width: 76, display: 'flex', justifyContent: 'center' }}>
          <a href="tel:111" style={{
            position: 'absolute', top: -50, left: 0, right: 0, margin: '0 auto',
            width: 70, height: 70, borderRadius: '50%',
            background: DA, border: `4px solid ${t.navBg}`,
            boxShadow: `0 12px 28px rgba(239,68,68,0.50), 0 4px 12px rgba(239,68,68,0.30)`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: 'white', textDecoration: 'none', gap: 1,
          }}>
            <Zap size={28} fill="white" color="white" />
            <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: 0.5 }}>SOS</span>
          </a>
        </div>

        <button onClick={() => { setActiveTab('profile'); setModal('profile'); }} style={{ ...btn0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1, justifyContent: 'center' }}>
          <User size={22} style={{ color: activeTab === 'profile' ? '#2a6049' : t.muted }} strokeWidth={1.8} />
          <span style={{ fontSize: 7, fontWeight: 700, color: activeTab === 'profile' ? '#2a6049' : t.muted, textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Profile</span>
        </button>
      </nav>

      {/* ── MODALS ─────────────────────────────────────────────────────────── */}

      {modal === 'notifications' && (
        <Overlay>
          <MHeader title="Уведомления" subtitle="Сообщения от психолога" />
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '28px 0', color: t.muted }}>
              <Bell size={36} style={{ opacity: 0.2, marginBottom: 10 }} />
              <p style={{ margin: 0, fontSize: 14 }}>Нет новых уведомлений</p>
            </div>
          ) : messages.map(msg => (
            <div key={msg.caseId} onClick={() => msg.communicationLink && window.open(msg.communicationLink, '_blank')}
              style={{ ...card(), padding: 16, marginBottom: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: t.text }}>{msg.psychologistName}</p>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: t.muted, lineHeight: 1.4 }}>{msg.message}</p>
              </div>
              <ExternalLink size={16} style={{ color: PR, flexShrink: 0 }} />
            </div>
          ))}
        </Overlay>
      )}

      {modal === 'complaint' && (
        <div style={{ position: 'fixed', inset: 0, background: t.bg, zIndex: 300, overflowY: 'auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <div style={{ background: 'linear-gradient(135deg, #f0f4f0 0%, #f7f6f3 100%)', padding: '16px 20px 20px', position: 'sticky', top: 0, zIndex: 10 }}>
            <div style={{ maxWidth: 500, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <button onClick={() => { if (complaintStep > 1 && !complaintSent) { setComplaintStep(complaintStep - 1); } else { setModal('none'); openComplaint(); } }} style={{ ...btn0, width: 40, height: 40, borderRadius: 14, background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.text }}>
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 17, color: t.text }}>Анонимная жалоба</p>
                  <p style={{ margin: '2px 0 0', fontSize: 13, color: t.muted }}>Безопасно сообщить о проблеме</p>
                </div>
              </div>
              {!complaintSent && (
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1,2,3].map(s => (
                    <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= complaintStep ? '#2a6049' : 'rgba(0,0,0,0.1)', transition: 'background .3s' }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {!complaintSent && complaintStep === 1 && (
              <>
                <div style={{ background: t.card, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.06)', padding: 20 }}>
                  <p style={{ margin: '0 0 16px', fontWeight: 600, fontSize: 15, color: t.text }}>О чём ты хочешь сообщить?</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {COMPLAINT_CATEGORIES.map(cat => (
                      <button key={cat.id} onClick={() => { setComplaintCategory(cat.id); setComplaintStep(2); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 16, background: t.mutedBg, border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                        <span style={{ fontSize: 26 }}>{cat.icon}</span>
                        <span style={{ fontWeight: 500, fontSize: 15, color: t.text, flex: 1 }}>{cat.label}</span>
                        <ChevronRight size={16} style={{ color: t.muted }} />
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck size={14} style={{ color: t.muted }} />
                  <span style={{ fontSize: 13, color: t.muted }}>Все жалобы анонимны и конфиденциальны</span>
                </div>
              </>
            )}
            {!complaintSent && complaintStep === 2 && (
              <>
                <div style={{ background: t.card, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.06)', padding: 20 }}>
                  <p style={{ margin: '0 0 6px', fontWeight: 600, fontSize: 15, color: t.text }}>Расскажи подробнее</p>
                  <p style={{ margin: '0 0 14px', fontSize: 13, color: t.muted }}>Опиши ситуацию как можно подробнее</p>
                  <textarea value={complaintText} onChange={e => setComplaintText(e.target.value)}
                    placeholder="Что произошло? Когда? Кто был вовлечён?" rows={6}
                    style={{ width: '100%', padding: 14, borderRadius: 16, border: `1px solid ${t.border}`, background: t.inputBg, color: t.text, fontSize: 14, resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.5 }} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setComplaintStep(1)} style={{ flex: 1, height: 52, borderRadius: 16, border: `1px solid ${t.border}`, background: 'transparent', color: t.text, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Назад</button>
                  <button onClick={() => setComplaintStep(3)} disabled={!complaintText.trim()}
                    style={{ flex: 1, height: 52, borderRadius: 16, border: 'none', background: complaintText.trim() ? '#2a6049' : t.border, color: 'white', fontWeight: 700, fontSize: 15, cursor: complaintText.trim() ? 'pointer' : 'not-allowed' }}>Далее</button>
                </div>
              </>
            )}
            {!complaintSent && complaintStep === 3 && (
              <>
                <div style={{ background: t.card, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.06)', padding: 20 }}>
                  <p style={{ margin: '0 0 14px', fontWeight: 600, fontSize: 15, color: t.text }}>Проверь данные</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
                    <div><span style={{ color: t.muted }}>Категория: </span><span style={{ color: t.text, fontWeight: 500 }}>{COMPLAINT_CATEGORIES.find(c => c.id === complaintCategory)?.icon} {COMPLAINT_CATEGORIES.find(c => c.id === complaintCategory)?.label}</span></div>
                    <div><span style={{ color: t.muted }}>Описание: </span><span style={{ color: t.text }}>{complaintText.slice(0, 100)}{complaintText.length > 100 ? '…' : ''}</span></div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setComplaintStep(2)} style={{ flex: 1, height: 52, borderRadius: 16, border: `1px solid ${t.border}`, background: 'transparent', color: t.text, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Назад</button>
                  <button onClick={handleComplaintSubmit} style={{ flex: 1, height: 52, borderRadius: 16, border: 'none', background: '#2a6049', color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#2a6049' }}>
                    <Send size={16} /> Отправить
                  </button>
                </div>
              </>
            )}
            {complaintSent && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{ background: t.card, borderRadius: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.06)', padding: '40px 32px', textAlign: 'center', maxWidth: 360, width: '100%' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${SA}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Check size={32} style={{ color: SA }} />
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 20, color: t.text, margin: '0 0 10px' }}>Жалоба отправлена</p>
                  <p style={{ fontSize: 14, color: t.muted, lineHeight: 1.6, margin: '0 0 28px' }}>Твоё обращение получено и будет рассмотрено. Спасибо за доверие. 💙</p>
                  <button onClick={() => { setModal('none'); openComplaint(); }} style={{ width: '100%', height: 52, borderRadius: 16, border: 'none', background: '#2a6049', color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                    Вернуться на главную
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {modal === 'booking' && (
        <div style={{ position: 'fixed', inset: 0, background: t.bg, zIndex: 300, overflowY: 'auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <div style={{ background: 'linear-gradient(135deg, #f0f4f0 0%, #f7f6f3 100%)', padding: '16px 20px 20px' }}>
            <div style={{ maxWidth: 500, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14 }}>
              <button onClick={() => setModal('none')} style={{ ...btn0, width: 40, height: 40, borderRadius: 14, background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.text }}>
                <ArrowLeft size={20} />
              </button>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 17, color: t.text }}>Запись к психологу</p>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: t.muted }}>Анонимно и конфиденциально</p>
              </div>
            </div>
          </div>
          <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: t.card, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.06)', padding: 20, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: `${SA}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={24} color={SA} strokeWidth={1.8} />
              </div>
              <div>
                <p style={{ margin: '0 0 6px', fontWeight: 600, fontSize: 15, color: t.text }}>Твоя анонимность защищена</p>
                <p style={{ margin: 0, fontSize: 13, color: t.muted, lineHeight: 1.6 }}>Психолог увидит только уникальный код записи и время. Никаких реальных имён или личных данных.</p>
              </div>
            </div>
            <div style={{ background: t.card, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.06)', padding: 20 }}>
              <p style={{ margin: '0 0 20px', fontWeight: 600, fontSize: 15, color: t.text }}>Как это работает</p>
              {[
                { n: 1, title: 'Выбери удобное время', desc: 'Открой календарь и забронируй свободный слот' },
                { n: 2, title: 'Получи код записи',    desc: 'После бронирования ты получишь уникальный код' },
                { n: 3, title: 'Приди на консультацию', desc: 'Назови код психологу — и начните сессию' },
              ].map((s, i) => (
                <div key={s.n} style={{ display: 'flex', gap: 14, marginBottom: i < 2 ? 18 : 0 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2a604915', color: '#2a6049', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14, flexShrink: 0 }}>\{s.n}</div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: 14, color: t.text }}>{s.title}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: t.muted, lineHeight: 1.4 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => { window.open('https://calendly.com', '_blank'); setModal('none'); }}
              style={{ width: '100%', height: 56, borderRadius: 16, border: 'none', background: '#2a6049', color: 'white', fontWeight: 700, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <Calendar size={20} /> Открыть календарь записи <ExternalLink size={16} />
            </button>
            <div style={{ textAlign: 'center' }}>
              {['📅 Консультации доступны пн-пт, 9:00–18:00', '⏱️ Длительность сессии: 50 минут', '❌ Отмена за 2 часа до приёма'].map(l => (
                <p key={l} style={{ margin: '0 0 6px', fontSize: 13, color: t.muted }}>{l}</p>
              ))}
            </div>
            <p style={{ textAlign: 'center', fontSize: 12, color: t.muted, margin: 0 }}>Если тебе нужна срочная помощь — используй кнопку SOS 💙</p>
          </div>
        </div>
      )}

      {modal === 'qamunity' && (
        <div style={{ position: 'fixed', inset: 0, background: t.bg, zIndex: 300, overflowY: 'auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <div style={{ background: 'linear-gradient(135deg, #f0f4f0 0%, #f7f6f3 100%)', padding: '16px 20px 20px', position: 'sticky', top: 0, zIndex: 10 }}>
            <div style={{ maxWidth: 500, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14 }}>
              <button onClick={() => setModal('none')} style={{ ...btn0, width: 40, height: 40, borderRadius: 14, background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.text }}>
                <ArrowLeft size={20} />
              </button>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 17, color: t.text }}>Сообщества</p>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: t.muted }}>Найди своих людей</p>
              </div>
            </div>
          </div>
          <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CLUBS.map(club => (
              <a key={club.name} href={club.url} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: t.card, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.06)', textDecoration: 'none', border: `1px solid ${t.border}` }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: `${PR}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Users size={22} color={PR} strokeWidth={1.8} />
                </div>
                <span style={{ fontWeight: 600, fontSize: 15, color: t.text, flex: 1 }}>{club.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, color: PR, fontWeight: 600 }}>Вступить</span>
                  <ExternalLink size={14} style={{ color: PR }} />
                </div>
              </a>
            ))}
            <p style={{ textAlign: 'center', fontSize: 12, color: t.muted, marginTop: 8 }}>Хочешь добавить своё сообщество? Напиши нам! 💙</p>
          </div>
        </div>
      )}

      {modal === 'profile' && (
        <div style={{ position: 'fixed', inset: 0, background: t.bg, zIndex: 300, overflowY: 'auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <div style={{ background: 'linear-gradient(135deg, #f0f4f0 0%, #f7f6f3 100%)', padding: '16px 20px 20px' }}>
            <div style={{ maxWidth: 500, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14 }}>
              <button onClick={() => { setModal('none'); setActiveTab('home'); }} style={{ ...btn0, width: 40, height: 40, borderRadius: 14, background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.text }}>
                <ArrowLeft size={20} />
              </button>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 17, color: t.text }}>Профиль</p>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: t.muted }}>Настройки приложения</p>
              </div>
            </div>
          </div>
          <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: t.card, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.06)', padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: `${PR}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={28} color={PR} strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: t.text }}>Анонимный пользователь</p>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: t.muted }}>Ваши данные защищены 🔒</p>
              </div>
            </div>
            <div style={{ background: t.card, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.06)', padding: 20 }}>
              <p style={{ margin: '0 0 14px', fontWeight: 600, fontSize: 15, color: t.text }}>Тема оформления</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {(['light', 'dark'] as Theme[]).map(th => (
                  <button key={th} onClick={() => switchTheme(th)}
                    style={{ flex: 1, padding: '14px 0', borderRadius: 16, border: `2px solid ${theme === th ? PR : t.border}`, background: th === 'light' ? '#f8faff' : '#0f1117', color: th === 'light' ? '#111827' : '#f1f5f9', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                    {th === 'light' ? '☀️ Светлая' : '🌙 Тёмная'}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleLogout}
              style={{ width: '100%', height: 52, background: `${DA}10`, color: DA, border: `1px solid ${DA}20`, borderRadius: 16, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              Выйти из аккаунта
            </button>
          </div>
        </div>
      )}

    </div>
  );
};