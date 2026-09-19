import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  Image as ImageIcon,
  LayoutDashboard,
  Lightbulb,
  LockKeyhole,
  Mail,
  MapPin,
  Menu,
  Megaphone,
  Pencil,
  Phone,
  Plus,
  Send,
  Trash2,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

type EventItem = { id: string; title: string; date: string; month: string; description: string; category: string };
type ManagementItem = { id: string; name: string; position: string; period: string; initials: string };
type AspirationItem = { id: string; name: string; kelas: string; message: string; status: string };
type FormType = 'event' | 'management' | 'aspiration';

const initialEvents: EventItem[] = [
  { id: 'ev-1', title: 'Masa Pengenalan ORSIKA', date: '12', month: 'Agt', description: 'Kenalan dengan pengurus, divisi, dan ruang-ruang untuk ikut bergerak.', category: 'Pengenalan' },
  { id: 'ev-2', title: 'Pekan Kreativitas Siswa', date: '24', month: 'Agt', description: 'Panggung untuk karya, ide, dan keberanian mencoba sesuatu yang baru.', category: 'Kegiatan' },
  { id: 'ev-3', title: 'Forum Suara Siswa', date: '06', month: 'Sep', description: 'Ruang terbuka untuk mendengar kebutuhan teman-teman di sekolah.', category: 'Forum' },
  { id: 'ev-4', title: 'Aksi Peduli Lingkungan', date: '21', month: 'Sep', description: 'Satu hari untuk merawat halaman sekolah dan kebiasaan baik bersama.', category: 'Sosial' },
];
const initialManagement: ManagementItem[] = [
  { id: 'mg-1', name: 'Nadira Putri', position: 'Ketua OSIS', period: '2024 / 2025', initials: 'NP' },
  { id: 'mg-2', name: 'Raka Adinata', position: 'Wakil Ketua OSIS', period: '2024 / 2025', initials: 'RA' },
  { id: 'mg-3', name: 'Alya Kinasih', position: 'Sekretaris', period: '2024 / 2025', initials: 'AK' },
  { id: 'mg-4', name: 'Bima Prasetyo', position: 'Bendahara', period: '2024 / 2025', initials: 'BP' },
];
const initialAspirations: AspirationItem[] = [
  { id: 'asp-1', name: 'Siswa anonim', kelas: 'XI IPA 2', message: 'Semoga ada lebih banyak ruang teduh di lapangan belakang.', status: 'Baru' },
  { id: 'asp-2', name: 'Nabila R.', kelas: 'X IPS 1', message: 'Boleh diadakan klub fotografi untuk pemula?', status: 'Ditinjau' },
  { id: 'asp-3', name: 'Siswa anonim', kelas: 'XII Bahasa', message: 'Ingin ada kotak donasi buku di setiap lantai.', status: 'Selesai' },
];

function useStoredState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : fallback;
    } catch {
      return fallback;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

function Brand({ admin = false }: { admin?: boolean }) {
  return (
    <Link href="/" className="brand-lockup" data-testid="link-brand">
      <span className="brand-mark" aria-hidden="true">O</span>
      <span className="brand-word">ORSIKA<small>{admin ? 'ruang pengelola' : 'suara siswa bergerak'}</small></span>
    </Link>
  );
}

function PublicShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { href: '/', label: 'Beranda' },
    { href: '/divisi', label: 'Divisi' },
    { href: '/tentang', label: 'Tentang' },
    { href: '/galeri', label: 'Galeri' },
    { href: '/kontak', label: 'Kontak' },
  ];
  return (
    <div className="orsika-page">
      <header className="public-nav">
        <div className="site-wrap public-nav-inner">
          <Brand />
          <nav className={`nav-links ${mobileOpen ? 'open' : ''}`} aria-label="Navigasi utama">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={`nav-link ${location === link.href ? 'active' : ''}`} data-testid={`link-nav-${link.label.toLowerCase()}`} onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/kontak" className="nav-cta" data-testid="link-submit-aspiration">
              Sampaikan ide <ArrowUpRight size={14} />
            </Link>
            <button type="button" className="mobile-menu" aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)} data-testid="button-mobile-menu">
              {mobileOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}

function PublicFooter() {
  return (
    <footer className="footer">
      <div className="site-wrap">
        <div className="footer-grid">
          <div>
            <Brand />
            <p className="mt-5">Ruang kerja bersama siswa untuk membuat kehidupan sekolah lebih terlihat, terdengar, dan terasa punya arti.</p>
          </div>
          <div>
            <h3>Jelajah</h3>
            <Link href="/">Beranda</Link><Link href="/divisi">Semua divisi</Link><Link href="/tentang">Tentang ORSIKA</Link>
          </div>
          <div>
            <h3>Hubungi kami</h3>
            <a href="mailto:orsika@sekolah.sch.id">orsika@sekolah.sch.id</a>
            <a href="/kontak">Kirim aspirasi</a>
            <Link href="/admin/login">Masuk pengelola</Link>
          </div>
        </div>
        <div className="footer-bottom"><span>© 2025 ORSIKA · OSIS sekolah kita</span><span>Dibuat bersama, untuk semua.</span></div>
      </div>
    </footer>
  );
}

function Home() {
  return (
    <PublicShell>
      <section className="hero">
        <div className="site-wrap hero-grid">
          <div className="reveal">
            <p className="hero-kicker mono-label">Organisasi Siswa Intra Sekolah</p>
            <h1>Tempat ide<br />menjadi <em>gerak.</em></h1>
            <p className="hero-copy">ORSIKA adalah ruang siswa untuk menyusun kegiatan, menyuarakan kebutuhan, dan membuat hari-hari di sekolah terasa lebih hidup.</p>
            <div className="hero-actions">
              <Link href="/divisi" className="button-primary" data-testid="link-explore-divisions">Kenali divisi kami <ArrowRight size={16} /></Link>
              <Link href="/tentang" className="button-ghost" data-testid="link-about-hero">Apa itu ORSIKA?</Link>
            </div>
          </div>
          <div className="hero-visual reveal reveal-delay-2" aria-label="Papan agenda kegiatan ORSIKA">
            <div className="visual-board">
              <div className="board-top"><span className="mono-label">Catatan lapangan / 01</span><span className="board-seal">O</span></div>
              <div className="board-title">Satu sekolah. Banyak kemungkinan.</div>
              <div className="board-rule" />
              <div className="board-list"><div className="board-item"><span>Ruang aspirasi</span><span>Terbuka</span></div><div className="board-item"><span>Agenda bulan ini</span><span>04 acara</span></div><div className="board-item"><span>Teman bergerak</span><span>Semua siswa</span></div></div>
            </div>
            <div className="floating-note"><span className="mono-label">Catatan ketua</span><p>Datang dengan ide. Pulang membawa cerita.</p></div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="site-wrap">
          <div className="section-head">
            <div><p className="section-eyebrow mono-label">Yang sedang bergerak</p><h2>Kalender sekolah, dari sudut pandang siswa.</h2></div>
            <p>Kegiatan bukan sekadar tanggal. Di baliknya ada orang-orang yang merancang, mencoba, dan mengajak kamu ikut ambil bagian.</p>
          </div>
          <div className="event-layout">
            <article className="event-feature reveal"><div className="event-meta"><span className="mono-label">Sorotan bulan ini</span><div className="date-chip"><strong>24</strong><span>Agt</span></div></div><div><h3>Pekan Kreativitas Siswa</h3><p>Panggung untuk karya, ide, dan keberanian mencoba sesuatu yang baru. Bawa karya terbaikmu, atau datang untuk memberi dukungan.</p></div></article>
            <div className="event-list">
              {initialEvents.slice(0, 3).map((event, index) => <article className={`event-card reveal reveal-delay-${index + 1}`} key={event.id}><div className="date-chip"><strong>{event.date}</strong><span>{event.month}</span></div><div><h4>{event.title}</h4><p>{event.description}</p></div></article>)}
            </div>
          </div>
        </div>
      </section>
      <section className="section section-tinted">
        <div className="site-wrap">
          <div className="section-head"><div><p className="section-eyebrow mono-label">Cara ikut ambil bagian</p><h2>Temukan tempat yang paling dekat denganmu.</h2></div><Link href="/divisi" className="button-coral" data-testid="link-all-divisions">Lihat semua divisi <ArrowRight size={15} /></Link></div>
          <div className="divisions-grid">{divisionData.slice(0, 8).map((division, index) => <Link href="/divisi" className="division-card reveal" style={{ animationDelay: `${index * 50}ms` }} key={division.name} data-testid={`card-division-${index}`}><span className="division-number">0{index + 1}</span><ChevronRight className="division-arrow" size={18} /><h3>{division.name}</h3><p>{division.description}</p></Link>)}</div>
        </div>
      </section>
      <section className="section section-dark">
        <div className="site-wrap quote-layout"><div className="quote-stamp">suara<br />kita<br />berarti</div><div className="quote-content"><blockquote>“Jangan menunggu sekolah berubah. Mari jadi bagian yang membuatnya berubah.”</blockquote><div className="quote-author"><span className="portrait">NP</span><span><strong className="block text-[#f8f2e8]">Nadira Putri</strong><span>Ketua OSIS · 2024 / 2025</span></span></div></div></div>
      </section>
      <section className="section">
        <div className="site-wrap quote-layout"><div><p className="section-eyebrow mono-label">Pesan wakil ketua</p><h2>Semua orang punya pintu masuk.</h2></div><div className="quote-content"><blockquote className="!text-[2rem] md:!text-[2.8rem]">“Mulai dari hal kecil yang ingin kamu lihat di sekolah. Kami bantu mencari jalannya.”</blockquote><div className="quote-author"><span className="portrait coral">RA</span><span><strong className="block">Raka Adinata</strong><span>Wakil Ketua OSIS · 2024 / 2025</span></span></div></div></div>
      </section>
    </PublicShell>
  );
}

const divisionData = [
  { name: 'Keimanan dan Ketakwaan', description: 'Menjaga ruang refleksi dan kegiatan keagamaan yang inklusif.' },
  { name: 'Budi Pekerti', description: 'Membuat budaya saling menghargai terasa dalam keseharian.' },
  { name: 'Prestasi Akademik', description: 'Mendukung teman-teman tumbuh lewat belajar bersama.' },
  { name: 'Seni dan Budaya', description: 'Merayakan karya, tradisi, dan ekspresi siswa.' },
  { name: 'Olahraga', description: 'Mengajak tubuh bergerak dan kompetisi tetap sehat.' },
  { name: 'Teknologi Informasi', description: 'Membuka akses digital untuk kegiatan sekolah.' },
  { name: 'Lingkungan Hidup', description: 'Merawat halaman sekolah dan kebiasaan berkelanjutan.' },
  { name: 'Kesehatan', description: 'Menumbuhkan perhatian pada kesehatan fisik dan mental.' },
  { name: 'Kewirausahaan', description: 'Belajar mencipta nilai dari ide yang sederhana.' },
  { name: 'Hubungan Masyarakat', description: 'Menjembatani kabar ORSIKA dengan warga sekolah.' },
  { name: 'Dokumentasi', description: 'Menyimpan cerita kegiatan agar tidak hilang begitu saja.' },
  { name: 'Sosial', description: 'Mengubah kepedulian menjadi aksi nyata bersama.' },
];

function DivisionsPage() {
  return <PublicShell><PageHero eyebrow="12 ruang untuk bertumbuh" title="Satu minat bisa menjadi gerakan." copy="Setiap divisi punya cara sendiri untuk membuat sekolah lebih hidup. Pilih yang paling membuatmu penasaran, lalu datang dan berkenalan." /><section className="section"><div className="site-wrap"><div className="divisions-grid">{divisionData.map((division, index) => <article className="division-card reveal" style={{ animationDelay: `${index * 45}ms` }} key={division.name} data-testid={`card-all-division-${index}`}><span className="division-number">{String(index + 1).padStart(2, '0')}</span><ChevronRight className="division-arrow" size={18} /><h3>{division.name}</h3><p>{division.description}</p></article>)}</div><div className="mt-16 border-l-2 border-[#e07a61] pl-5 max-w-xl"><p className="mono-label text-[#e07a61]">Catatan</p><p className="mt-2 text-sm leading-7 text-[#536178]">Placeholder divisi di atas dapat disesuaikan dengan struktur organisasi dan kebutuhan sekolahmu. Belum menemukan yang pas? <Link className="font-bold text-[#172b4d] underline underline-offset-4" href="/kontak">Kirim ide divisi baru.</Link></p></div></div></section></PublicShell>;
}

function PageHero({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <section className="page-hero"><div className="site-wrap"><p className="hero-kicker mono-label">{eyebrow}</p><h1>{title}</h1><p>{copy}</p></div></section>;
}

function AboutPage() {
  return <PublicShell><PageHero eyebrow="Tentang ORSIKA" title="Kami percaya sekolah adalah milik semua orang." copy="ORSIKA hadir sebagai ruang kerja siswa: bukan yang paling ramai, tetapi yang mau mendengar dan benar-benar mengerjakan." /><section className="section"><div className="site-wrap about-grid"><div className="about-copy"><p className="section-eyebrow mono-label">Kenapa kami ada</p><h2>Hal baik dimulai saat ada yang mau peduli.</h2><p className="mt-7">Organisasi siswa bukan hanya tentang rapat dan seragam kepengurusan. Ia tentang membuat teman merasa dilibatkan, membuat ide punya tempat, dan memastikan kegiatan sekolah tidak berjalan tanpa arah.</p><p>Di ORSIKA, kami merancang program bersama, belajar memimpin dengan rendah hati, dan membuka pintu selebar-lebarnya untuk siapa pun yang ingin berkontribusi.</p></div><div className="principles"><div className="principle"><span className="portrait">01</span><div><strong>Dengar sebelum bergerak</strong><span>Setiap program dimulai dari kebutuhan yang nyata.</span></div></div><div className="principle"><span className="portrait coral">02</span><div><strong>Kerjakan bersama</strong><span>Ide terbaik tumbuh ketika banyak suara bertemu.</span></div></div><div className="principle"><span className="portrait">03</span><div><strong>Tinggalkan jejak</strong><span>Kegiatan selesai, pembelajaran dan cerita tetap tinggal.</span></div></div></div></div></section><section className="section section-tinted"><div className="site-wrap"><div className="section-head"><div><p className="section-eyebrow mono-label">Nilai kerja kami</p><h2>Bukan sempurna. Terus belajar.</h2></div><p>Placeholder narasi visi dan misi ini bisa diganti sesuai dokumen resmi sekolah.</p></div><div className="grid md:grid-cols-3 gap-4"><div className="bg-[#172b4d] text-[#f8f2e8] p-7"><Megaphone size={25} className="text-[#e5ad35]" /><h3 className="display-font text-2xl mt-16">Terbuka</h3><p className="text-xs leading-6 text-white/60 mt-3">Kabar kegiatan dan keputusan penting mudah diakses semua warga sekolah.</p></div><div className="bg-[#e5ad35] p-7"><Users size={25} /><h3 className="display-font text-2xl mt-16">Inklusif</h3><p className="text-xs leading-6 text-[#172b4d]/65 mt-3">Tidak perlu punya jabatan untuk menjadi bagian dari perubahan.</p></div><div className="bg-[#e07a61] text-[#fff8ee] p-7"><Lightbulb size={25} /><h3 className="display-font text-2xl mt-16">Berani mencoba</h3><p className="text-xs leading-6 text-white/70 mt-3">Eksperimen kecil hari ini dapat menjadi tradisi baik esok hari.</p></div></div></div></section></PublicShell>;
}

function GalleryPage() {
  return <PublicShell><PageHero eyebrow="Galeri cerita" title="Yang kami kerjakan, kami ingat bersama." copy="Galeri dokumentasi ORSIKA sedang disiapkan. Sementara itu, bayangkan ruang ini dipenuhi wajah, warna, dan momen dari kegiatan sekolahmu." /><section className="section"><div className="site-wrap"><div className="placeholder-gallery">{['Pekan kreativitas', 'Rapat terbuka', 'Aksi lingkungan', 'Di balik layar', 'Masa pengenalan'].map((title, index) => <div className="gallery-tile reveal" style={{ animationDelay: `${index * 80}ms` }} key={title}><strong>{title}</strong><span>Placeholder dokumentasi · 2025</span></div>)}</div><div className="text-center mt-12"><ImageIcon size={22} className="mx-auto text-[#e07a61]" /><p className="mt-3 text-sm text-[#68748a]">Foto kegiatan akan hadir di sini setelah periode dokumentasi berikutnya.</p></div></div></section></PublicShell>;
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); event.currentTarget.reset(); }
  return <PublicShell><PageHero eyebrow="Mari terhubung" title="Punya pertanyaan, ide, atau kegelisahan?" copy="Sampaikan kepada kami. Tidak ada suara yang terlalu kecil untuk didengar." /><section className="section"><div className="site-wrap contact-grid"><div><p className="section-eyebrow mono-label">Pintu kami terbuka</p><h2>Mulai percakapan yang berarti.</h2><p className="mt-6 text-sm leading-7 text-[#536178]">Untuk kebutuhan resmi, silakan hubungi pembina OSIS melalui sekretariat sekolah. Untuk ide dan masukan sehari-hari, gunakan formulir ini.</p><div className="contact-list"><div className="contact-row"><Mail size={18} /><div><strong>Email sekretariat</strong><span>orsika@sekolah.sch.id</span></div></div><div className="contact-row"><MapPin size={18} /><div><strong>Temui kami</strong><span>Ruang OSIS, lantai dua · Senin—Jumat</span></div></div><div className="contact-row"><Phone size={18} /><div><strong>Jam layanan</strong><span>07.00—15.00 WIB</span></div></div></div></div><div className="form-card">{sent && <div className="status-message"><Check size={15} className="inline mr-2" />Terima kasih, aspirasi kamu sudah dicatat. (Demo)</div>}<form onSubmit={submit}><div className="form-field"><label htmlFor="contact-name">Nama atau inisial</label><input id="contact-name" required placeholder="Misalnya: Rani / anonim" data-testid="input-contact-name" /></div><div className="form-field"><label htmlFor="contact-class">Kelas</label><input id="contact-class" required placeholder="Contoh: XI IPA 1" data-testid="input-contact-class" /></div><div className="form-field"><label htmlFor="contact-message">Pesan atau aspirasi</label><textarea id="contact-message" required placeholder="Apa yang ingin kamu lihat terjadi di sekolah?" data-testid="input-contact-message" /></div><button className="button-coral" type="submit" data-testid="button-submit-contact">Kirim ke ORSIKA <Send size={15} /></button></form></div></div></section></PublicShell>;
}

function AdminLogin() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState('');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get('email') === 'admin@orsika.id' && data.get('password') === 'orsika2025') {
      localStorage.setItem('orsika-admin', 'true');
      setLocation('/admin/dashboard');
    } else setError('Email atau kata sandi demo belum tepat.');
  }
  return <div className="login-layout"><div className="login-art"><Brand admin /><div><p className="hero-kicker mono-label">Ruang pengelola</p><h1>Jadikan kegiatan <em>terlihat.</em></h1></div><p className="mono-label text-white/45">ORSIKA / INTERNAL</p></div><div className="login-form-side"><div className="login-card"><LockKeyhole size={26} className="text-[#e07a61]" /><h2>Selamat datang kembali.</h2><p>Kelola agenda, struktur kepengurusan, dan suara siswa dari satu ruang kerja.</p>{error && <div className="status-message !bg-[#f8ded8] !border-[#e07a61] !text-[#8e3d2b]">{error}</div>}<form onSubmit={submit}><div className="form-field"><label htmlFor="admin-email">Email</label><input id="admin-email" name="email" type="email" defaultValue="admin@orsika.id" required data-testid="input-admin-email" /></div><div className="form-field"><label htmlFor="admin-password">Kata sandi</label><input id="admin-password" name="password" type="password" defaultValue="orsika2025" required data-testid="input-admin-password" /></div><button type="submit" className="button-coral w-full" data-testid="button-admin-login">Masuk ke dashboard <ArrowRight size={15} /></button></form><div className="login-hint"><strong>Akun demo</strong><br />admin@orsika.id · orsika2025</div><Link href="/" className="block mt-6 text-center text-xs font-bold text-[#536178] hover:text-[#e07a61]" data-testid="link-back-home">Kembali ke halaman utama</Link></div></div></div>;
}

function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [events, setEvents] = useStoredState<EventItem[]>('orsika-events', initialEvents);
  const [management, setManagement] = useStoredState<ManagementItem[]>('orsika-management', initialManagement);
  const [aspirations, setAspirations] = useStoredState<AspirationItem[]>('orsika-aspirations', initialAspirations);
  const [tab, setTab] = useState<FormType>('event');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState('');
  const isAuthed = localStorage.getItem('orsika-admin') === 'true';

  useEffect(() => { if (!isAuthed) setLocation('/admin/login'); }, [isAuthed, setLocation]);
  const counts = useMemo(() => ({ events: events.length, management: management.length, aspirations: aspirations.length, active: events.filter((event) => event.category !== 'Arsip').length }), [events, management, aspirations]);
  if (!isAuthed) return null;

  const records = tab === 'event' ? events : tab === 'management' ? management : aspirations;
  function startAdd(type: FormType) { setTab(type); setEditingId(null); setForm(type === 'event' ? { title: '', date: '', month: 'Agt', description: '', category: 'Kegiatan' } : type === 'management' ? { name: '', position: '', period: '2025 / 2026', initials: '' } : { name: '', kelas: '', message: '', status: 'Baru' }); setFormOpen(true); }
  function startEdit(type: FormType, item: EventItem | ManagementItem | AspirationItem) { setTab(type); setEditingId(item.id); setForm({ ...item } as unknown as Record<string, string>); setFormOpen(true); }
  function remove(type: FormType, id: string) {
    if (!window.confirm('Hapus data ini dari dashboard demo?')) return;
    if (type === 'event') setEvents(events.filter((item) => item.id !== id));
    if (type === 'management') setManagement(management.filter((item) => item.id !== id));
    if (type === 'aspiration') setAspirations(aspirations.filter((item) => item.id !== id));
    setFeedback('Data berhasil dihapus.');
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = editingId || `${tab}-${Date.now()}`;
    if (tab === 'event') { const item = { ...form, id } as EventItem; setEvents(editingId ? events.map((entry) => entry.id === id ? item : entry) : [item, ...events]); }
    if (tab === 'management') { const item = { ...form, id } as ManagementItem; setManagement(editingId ? management.map((entry) => entry.id === id ? item : entry) : [item, ...management]); }
    if (tab === 'aspiration') { const item = { ...form, id } as AspirationItem; setAspirations(editingId ? aspirations.map((entry) => entry.id === id ? item : entry) : [item, ...aspirations]); }
    setFormOpen(false); setFeedback(editingId ? 'Perubahan berhasil disimpan.' : 'Data baru berhasil ditambahkan.');
  }
  function signOut() { localStorage.removeItem('orsika-admin'); setLocation('/admin/login'); }
  const labels = { event: 'Agenda kegiatan', management: 'Pengurus', aspiration: 'Aspirasi siswa' };
  return <div className="admin-shell"><header className="admin-topbar"><Brand admin /><div className="flex items-center gap-4"><span className="hidden sm:inline mono-label text-[#68748a]">Mode demo aktif</span><button className="button-ghost !border-[#d1c9ba] !text-[#172b4d] !px-3 !py-2" onClick={signOut} data-testid="button-admin-logout">Keluar</button></div></header><main className="admin-content"><div className="admin-title"><div><p className="mono-label text-[#e07a61]">Selamat pagi, pengelola</p><h1>Ruang kendali.</h1></div><Link href="/" className="button-primary" data-testid="link-view-public">Lihat situs <ArrowUpRight size={15} /></Link></div>{feedback && <div className="status-message"><Check size={15} className="inline mr-2" />{feedback}</div>}<div className="admin-stats"><div className="stat-card"><CalendarDays size={18} className="text-[#e07a61]" /><strong>{counts.active}</strong><span>Agenda aktif</span></div><div className="stat-card"><Users size={18} className="text-[#e07a61]" /><strong>{counts.management}</strong><span>Posisi pengurus</span></div><div className="stat-card"><Lightbulb size={18} className="text-[#e07a61]" /><strong>{counts.aspirations}</strong><span>Aspirasi masuk</span></div><div className="stat-card"><ClipboardList size={18} className="text-[#e07a61]" /><strong>2025</strong><span>Periode kerja</span></div></div><div className="admin-tabs" role="tablist">{(['event', 'management', 'aspiration'] as FormType[]).map((type) => <button className={`admin-tab ${tab === type ? 'active' : ''}`} onClick={() => setTab(type)} key={type} role="tab" aria-selected={tab === type} data-testid={`tab-admin-${type}`}>{labels[type]}</button>)}</div><section className="admin-panel"><div className="panel-heading"><div><h2>{labels[tab]}</h2><p className="text-xs text-[#68748a] mt-1">Data tersimpan di perangkat ini · demo lokal</p></div><button className="button-coral !rounded-sm !px-3 !py-2" onClick={() => startAdd(tab)} data-testid={`button-add-${tab}`}><Plus size={15} /> Tambah</button></div><div className="overflow-x-auto"><table className="admin-table"><thead><tr>{tab === 'event' ? <><th>Judul kegiatan</th><th>Tanggal</th><th>Kategori</th></> : tab === 'management' ? <><th>Nama</th><th>Posisi</th><th>Periode</th></> : <><th>Pengirim</th><th>Aspirasi</th><th>Status</th></>}</tr></thead><tbody>{records.map((record) => <tr key={record.id}>{tab === 'event' && <><td><span className="table-title">{(record as EventItem).title}</span><span className="table-subtitle">{(record as EventItem).description}</span></td><td>{(record as EventItem).date} {(record as EventItem).month}</td><td>{(record as EventItem).category}</td></>}{tab === 'management' && <><td><span className="table-title">{(record as ManagementItem).name}</span><span className="table-subtitle">{(record as ManagementItem).initials}</span></td><td>{(record as ManagementItem).position}</td><td>{(record as ManagementItem).period}</td></>}{tab === 'aspiration' && <><td><span className="table-title">{(record as AspirationItem).name}</span><span className="table-subtitle">{(record as AspirationItem).kelas}</span></td><td className="max-w-xs">{(record as AspirationItem).message}</td><td>{(record as AspirationItem).status}</td></>}<td><div className="table-actions"><button className="icon-button" aria-label={`Edit ${record.id}`} onClick={() => startEdit(tab, record)} data-testid={`button-edit-${record.id}`}><Pencil size={14} /></button><button className="icon-button danger" aria-label={`Hapus ${record.id}`} onClick={() => remove(tab, record.id)} data-testid={`button-delete-${record.id}`}><Trash2 size={14} /></button></div></td></tr>)}</tbody></table></div>{records.length === 0 && <div className="text-center py-12 text-sm text-[#68748a]">Belum ada data. Tambahkan item pertama dari tombol di atas.</div>}</section></main>{formOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-[#172b4d]/55 p-4" role="dialog" aria-modal="true"><div className="w-full max-w-lg bg-[#f5f0e6] p-6 shadow-2xl"><div className="flex items-start justify-between gap-5 mb-6"><div><p className="mono-label text-[#e07a61]">{editingId ? 'Edit data' : 'Data baru'}</p><h2 className="display-font text-3xl text-[#172b4d] mt-2">{labels[tab]}</h2></div><button className="icon-button" onClick={() => setFormOpen(false)} aria-label="Tutup formulir" data-testid="button-close-form"><X size={16} /></button></div><form onSubmit={save}>{tab === 'event' && <><Field label="Judul kegiatan" value={form.title} onChange={(value) => setForm({ ...form, title: value })} required /><div className="grid grid-cols-2 gap-3"><Field label="Tanggal" value={form.date} onChange={(value) => setForm({ ...form, date: value })} required /><Field label="Bulan" value={form.month} onChange={(value) => setForm({ ...form, month: value })} required /></div><Field label="Kategori" value={form.category} onChange={(value) => setForm({ ...form, category: value })} required /><Field label="Deskripsi" value={form.description} onChange={(value) => setForm({ ...form, description: value })} required textarea /></>}{tab === 'management' && <><Field label="Nama lengkap" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required /><Field label="Posisi" value={form.position} onChange={(value) => setForm({ ...form, position: value })} required /><div className="grid grid-cols-2 gap-3"><Field label="Periode" value={form.period} onChange={(value) => setForm({ ...form, period: value })} required /><Field label="Inisial" value={form.initials} onChange={(value) => setForm({ ...form, initials: value })} required /></div></>}{tab === 'aspiration' && <><Field label="Nama atau label pengirim" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required /><Field label="Kelas" value={form.kelas} onChange={(value) => setForm({ ...form, kelas: value })} required /><Field label="Status" value={form.status} onChange={(value) => setForm({ ...form, status: value })} required /><Field label="Isi aspirasi" value={form.message} onChange={(value) => setForm({ ...form, message: value })} required textarea /></>}<button className="button-coral w-full mt-2" type="submit" data-testid="button-save-record">{editingId ? 'Simpan perubahan' : 'Tambah data'} <Check size={15} /></button></form></div></div>}</div>;
}

function Field({ label, value, onChange, required, textarea = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; textarea?: boolean }) {
  return <div className="form-field"><label>{label}</label>{textarea ? <textarea value={value || ''} required={required} onChange={(event) => onChange(event.target.value)} data-testid={`input-admin-${label.toLowerCase().replaceAll(' ', '-')}`} /> : <input value={value || ''} required={required} onChange={(event) => onChange(event.target.value)} data-testid={`input-admin-${label.toLowerCase().replaceAll(' ', '-')}`} />}</div>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Home} /><Route path="/divisi" component={DivisionsPage} /><Route path="/tentang" component={AboutPage} /><Route path="/galeri" component={GalleryPage} /><Route path="/kontak" component={ContactPage} /><Route path="/admin/login" component={AdminLogin} /><Route path="/admin/dashboard" component={AdminDashboard} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;