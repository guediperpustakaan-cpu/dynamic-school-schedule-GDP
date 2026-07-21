import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bell,
  BookMarked,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Coffee,
  Copy,
  Download,
  GraduationCap,
  Heart,
  LayoutGrid,
  MapPin,
  Menu,
  MoreHorizontal,
  Pencil,
  Plus,
  Printer,
  QrCode,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"] as const;
type Day = (typeof DAYS)[number];

type Lesson = {
  id: string;
  day: Day;
  subject: string;
  teacher: string;
  room: string;
  start: string;
  end: string;
  color: string;
};

type LessonForm = Omit<Lesson, "id">;

type Task = {
  id: string;
  subject: string;
  description: string;
  dueDate: string;
  priority: "rendah" | "sedang" | "tinggi";
  status: "belum" | "sedang" | "selesai";
};

type TaskForm = Omit<Task, "id">;

type Grade = {
  id: string;
  subject: string;
  task: string;
  score: number;
  maxScore: number;
  date: string;
};

type GradeForm = Omit<Grade, "id">;

const SUBJECT_COLORS = ["#5B66F6", "#FF8A65", "#16A085", "#E4A11B", "#A66DE8", "#E85976"];
const DONATION_AMOUNTS = [6000, 12000, 24000, 60000];

// Isi dengan alamat gambar atau data URL QRIS resmi milik pengelola aplikasi.
const QRIS_IMAGE_URL = "";

const DEFAULT_LESSONS: Lesson[] = [
  { id: "1", day: "Senin", subject: "Matematika", teacher: "Bu Rani", room: "Ruang 8A", start: "07:00", end: "08:20", color: "#5B66F6" },
  { id: "2", day: "Senin", subject: "Ilmu Pengetahuan Alam", teacher: "Pak Bima", room: "Lab Sains", start: "08:35", end: "09:55", color: "#16A085" },
  { id: "3", day: "Senin", subject: "Bahasa Indonesia", teacher: "Bu Siska", room: "Ruang 8A", start: "10:20", end: "11:40", color: "#FF8A65" },
  { id: "4", day: "Selasa", subject: "Bahasa Inggris", teacher: "Miss Wina", room: "Ruang Bahasa", start: "07:00", end: "08:20", color: "#A66DE8" },
  { id: "5", day: "Selasa", subject: "Ilmu Pengetahuan Sosial", teacher: "Pak Arif", room: "Ruang 8A", start: "08:35", end: "09:55", color: "#E4A11B" },
  { id: "6", day: "Rabu", subject: "Pendidikan Jasmani", teacher: "Pak Yoga", room: "Lapangan", start: "07:00", end: "08:20", color: "#E85976" },
  { id: "7", day: "Rabu", subject: "Matematika", teacher: "Bu Rani", room: "Ruang 8A", start: "08:35", end: "09:55", color: "#5B66F6" },
  { id: "8", day: "Kamis", subject: "Seni Budaya", teacher: "Bu Diah", room: "Ruang Seni", start: "08:35", end: "09:55", color: "#FF8A65" },
  { id: "9", day: "Jumat", subject: "Pendidikan Agama", teacher: "Pak Hasan", room: "Ruang 8A", start: "07:00", end: "08:20", color: "#16A085" },
];

const EMPTY_FORM: LessonForm = {
  day: "Senin",
  subject: "",
  teacher: "",
  room: "",
  start: "07:00",
  end: "08:20",
  color: SUBJECT_COLORS[0],
};

const DEFAULT_TASKS: Task[] = [
  { id: "t1", subject: "Matematika", description: "Kerjakan soal latihan Bab 4", dueDate: "2025-07-22", priority: "tinggi", status: "belum" },
  { id: "t2", subject: "Bahasa Inggris", description: "Buat resume cerita阅读理解", dueDate: "2025-07-23", priority: "sedang", status: "sedang" },
  { id: "t3", subject: "Ilmu Pengetahuan Alam", description: "Laporan praktikum fotosintesis", dueDate: "2025-07-25", priority: "tinggi", status: "belum" },
];

const EMPTY_TASK_FORM: TaskForm = {
  subject: "",
  description: "",
  dueDate: "",
  priority: "sedang",
  status: "belum",
};

const DEFAULT_GRADES: Grade[] = [
  { id: "g1", subject: "Matematika", task: "Ulangan Tengah Semester", score: 85, maxScore: 100, date: "2025-07-15" },
  { id: "g2", subject: "Bahasa Indonesia", task: "Essay Puisi", score: 90, maxScore: 100, date: "2025-07-18" },
  { id: "g3", subject: "Bahasa Inggris", task: "Listening Test", score: 78, maxScore: 100, date: "2025-07-20" },
];

const EMPTY_GRADE_FORM: GradeForm = {
  subject: "",
  task: "",
  score: 0,
  maxScore: 100,
  date: "",
};

function getInitialDay(): Day {
  const weekday = new Date().getDay();
  return DAYS[Math.min(Math.max(weekday - 1, 0), 4)];
}

function getMonday(weekOffset: number) {
  const date = new Date();
  const day = date.getDay();
  const distance = day === 0 ? -6 : 1 - day;
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + distance + weekOffset * 7);
  return date;
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(date);
}

function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function getDayDate(day: Day, weekOffset: number) {
  const date = getMonday(weekOffset);
  date.setDate(date.getDate() + DAYS.indexOf(day));
  return date;
}

function AppLogo({ compact = false, schoolName, schoolLogo }: { compact?: boolean; schoolName?: string; schoolLogo?: string }) {
  const logoContent = schoolLogo ? (
    <img src={schoolLogo} alt={schoolName || "Logo sekolah"} className="h-full w-full object-contain" />
  ) : (
    <BookOpen size={21} strokeWidth={2.4} />
  );

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 rotate-[-3deg] items-center justify-center rounded-[14px] bg-[#5965f4] text-white shadow-[0_7px_18px_rgba(89,101,244,0.25)]">
        {logoContent}
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#f8f8fb] bg-[#ffb84d]" />
      </div>
      {!compact && <span className="text-xl font-extrabold tracking-[-0.04em] text-[#20233d]">{schoolName || "KelasKu."}</span>}
    </div>
  );
}

function Sidebar({ currentView, onNavigate, schoolName, schoolLogo }: { currentView: string; onNavigate: (view: string) => void; schoolName: string; schoolLogo: string }) {
  const navigation = [
    { label: "Beranda", icon: LayoutGrid, view: "beranda" },
    { label: "Jadwal Pelajaran", icon: CalendarDays, view: "jadwal" },
    { label: "Tugas Sekolah", icon: BookMarked, view: "tugas", count: 3 },
    { label: "Catatan Nilai", icon: GraduationCap, view: "nilai" },
  ];

  return (
    <aside className="hidden h-screen w-[280px] shrink-0 flex-col border-r border-[#e9e9f1] bg-white px-6 py-8 lg:flex">
      <div className="px-2"><AppLogo schoolName={schoolName} schoolLogo={schoolLogo} /></div>
      <div className="mt-10 px-2 text-sm font-extrabold uppercase tracking-[0.16em] text-[#aaaabd]">Menu utama</div>
      <nav className="mt-4 space-y-2">
        {navigation.map(({ label, icon: Icon, view, count }) => (
          <button
            type="button"
            key={label}
            onClick={() => onNavigate(view)}
            className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-base font-bold transition-colors ${
              currentView === view ? "bg-[#eef0ff] text-[#505cf1]" : "text-[#6e7088] hover:bg-[#f7f7fa] hover:text-[#31334a]"
            }`}
          >
            <Icon size={22} strokeWidth={currentView === view ? 2.5 : 2} />
            <span>{label}</span>
            {count && <span className="ml-auto rounded-full bg-[#ffebe5] px-2.5 py-1 text-xs font-extrabold text-[#ef7255]">{count}</span>}
          </button>
        ))}
      </nav>
      <div className="mt-auto">
        <div className="mx-2 mb-6 overflow-hidden rounded-3xl bg-[#242641] px-5 pb-5 pt-6 text-white">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffbc55] text-[#242641]"><GraduationCap size={22} /></div>
          <p className="text-base font-extrabold">Semangat belajar!</p>
          <p className="mt-2 text-sm leading-6 text-[#b9bad0]">Sedikit demi sedikit, hasilnya pasti hebat.</p>
        </div>
        <button type="button" onClick={() => onNavigate("pengaturan")} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-base font-bold transition-colors ${currentView === "pengaturan" ? "bg-[#eef0ff] text-[#505cf1]" : "text-[#74758b] hover:bg-[#f7f7fa]"}`}>
          <Settings size={22} /> Pengaturan
        </button>
      </div>
    </aside>
  );
}

function Header({
  onAdd,
  onMenu,
  search,
  onSearch,
  currentView,
  userName,
  onUpdateUserName,
  userClass,
  onUpdateUserClass,
  schoolName,
  schoolLogo,
}: {
  onAdd: () => void;
  onMenu: () => void;
  search: string;
  onSearch: (value: string) => void;
  currentView: string;
  userName: string;
  onUpdateUserName: (value: string) => void;
  userClass: string;
  onUpdateUserClass: (value: string) => void;
  schoolName: string;
  schoolLogo: string;
}) {
  const titles: Record<string, string> = {
    jadwal: "Jadwal Pelajaran",
    tugas: "Tugas Sekolah",
    nilai: "Catatan Nilai",
    pengaturan: "Pengaturan",
    beranda: "Beranda",
  };
  const subtitles: Record<string, string> = {
    jadwal: "Atur jadwalmu, belajar lebih tenang.",
    tugas: "Kelola dan pantau perkembangan tugasmu.",
    nilai: "Pantau perkembangan nilai pelajaranmu.",
    pengaturan: "Kelola data dan preferensi aplikasi.",
    beranda: "Ringkasan aktivitas belajarmu hari ini.",
  };

  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const rename = () => {
    const next = window.prompt("Nama lengkap:", userName);
    if (next !== null && next.trim()) onUpdateUserName(next.trim());
  };

  const renameClass = () => {
    const next = window.prompt("Kelas:", userClass);
    if (next !== null && next.trim()) onUpdateUserClass(next.trim());
  };

  return (
    <header className="flex h-20 items-center border-b border-[#e9e9f1] bg-white px-5 sm:px-8 lg:px-10">
      <button type="button" onClick={onMenu} className="mr-3 rounded-xl p-2.5 text-[#5f6177] hover:bg-[#f2f2f7] lg:hidden" aria-label="Buka menu"><Menu size={24} /></button>
      <div className="lg:hidden"><AppLogo compact schoolName={schoolName} schoolLogo={schoolLogo} /></div>
      <div className="hidden lg:block">
        <p className="text-base font-extrabold text-[#272940]">{titles[currentView] || schoolName}</p>
        <p className="mt-1 text-sm text-[#8a8ca0]">{subtitles[currentView] || ""}</p>
      </div>
      <div className="ml-auto flex items-center gap-2.5 sm:gap-3.5">
        <label className="hidden h-12 w-[240px] items-center gap-2.5 rounded-2xl bg-[#f5f5f8] px-4 text-[#9899aa] md:flex">
          <Search size={19} />
          <input value={search} onChange={(event) => onSearch(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#34364d] outline-none placeholder:text-[#a8a9b7]" placeholder="Cari pelajaran..." aria-label="Cari pelajaran" />
        </label>
        <button type="button" className="relative grid h-12 w-12 place-items-center rounded-2xl bg-[#f5f5f8] text-[#65677d] transition-transform hover:scale-105" aria-label="Notifikasi">
          <Bell size={21} /><span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-[#f5f5f8] bg-[#ef7255]" />
        </button>
        {currentView === "jadwal" && (
          <button type="button" onClick={onAdd} className="hidden h-12 items-center gap-2 rounded-2xl bg-[#5965f4] px-5 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(89,101,244,0.22)] transition hover:-translate-y-0.5 hover:bg-[#4b57e8] sm:flex">
            <Plus size={19} strokeWidth={2.7} /> Tambah pelajaran
          </button>
        )}
        <div className="ml-1 flex items-center gap-3 border-l border-[#e3e3eb] pl-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ffe3ba] text-base font-extrabold text-[#81501c]">{initials}</div>
          <div className="hidden xl:block">
            <button type="button" onClick={rename} className="text-left text-sm font-extrabold text-[#33354c] transition hover:text-[#505cf1]" title="Ganti nama">{userName}</button>
            <button type="button" onClick={renameClass} className="text-left text-xs font-semibold text-[#9697a8] transition hover:text-[#505cf1]" title="Ganti kelas">Kelas {userClass}</button>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileMenu({ open, onClose, currentView, onNavigate, schoolName, schoolLogo }: { open: boolean; onClose: () => void; currentView: string; onNavigate: (view: string) => void; schoolName: string; schoolLogo: string }) {
  const navItem = (label: string, view: string, Icon: React.ElementType, active = false) => (
    <button type="button" onClick={() => { onNavigate(view); onClose(); }} className={`mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-base font-bold transition-colors ${active ? "bg-[#eef0ff] text-[#505cf1]" : "text-[#6e7088] hover:bg-[#f7f7fa]"}`}>
      <Icon size={22} strokeWidth={active ? 2.5 : 2} /> {label}
    </button>
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button type="button" aria-label="Tutup menu" className="fixed inset-0 z-40 bg-[#20223c]/30 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="fixed inset-y-0 left-0 z-50 w-[300px] bg-white p-8 shadow-2xl lg:hidden"
            initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
               <AppLogo schoolName={schoolName} schoolLogo={schoolLogo} />
              <button type="button" onClick={onClose} className="rounded-lg p-2.5 text-[#6d6e82] hover:bg-[#f4f4f7]" aria-label="Tutup menu"><X size={22} /></button>
            </div>
            <p className="mt-12 text-sm font-extrabold uppercase tracking-[0.16em] text-[#aaaabd]">Menu utama</p>
            {navItem("Beranda", "beranda", LayoutGrid, currentView === "beranda")}
            {navItem("Jadwal Pelajaran", "jadwal", CalendarDays, currentView === "jadwal")}
            {navItem("Tugas Sekolah", "tugas", BookMarked, currentView === "tugas")}
            {navItem("Catatan Nilai", "nilai", GraduationCap, currentView === "nilai")}
            <button type="button" onClick={() => { onNavigate("pengaturan"); onClose(); }} className={`mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-base font-bold transition-colors ${currentView === "pengaturan" ? "bg-[#eef0ff] text-[#505cf1]" : "text-[#6e7088] hover:bg-[#f7f7fa]"}`}><Settings size={22} /> Pengaturan</button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function LessonModal({
  open,
  initialLesson,
  initialDay,
  onClose,
  onSave,
}: {
  open: boolean;
  initialLesson: Lesson | null;
  initialDay: Day;
  onClose: () => void;
  onSave: (data: LessonForm) => void;
}) {
  const [form, setForm] = useState<LessonForm>({ ...EMPTY_FORM, day: initialDay });
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(initialLesson ? { ...initialLesson } : { ...EMPTY_FORM, day: initialDay });
      setError("");
    }
  }, [open, initialLesson, initialDay]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  const update = <K extends keyof LessonForm>(key: K, value: LessonForm[K]) => setForm((current) => ({ ...current, [key]: value }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.subject.trim() || !form.teacher.trim() || !form.room.trim()) {
      setError("Lengkapi nama pelajaran, guru, dan ruangan terlebih dahulu.");
      return;
    }
    if (form.end <= form.start) {
      setError("Jam selesai harus lebih akhir dari jam mulai.");
      return;
    }
    onSave({ ...form, subject: form.subject.trim(), teacher: form.teacher.trim(), room: form.room.trim() });
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
          <motion.button type="button" aria-label="Tutup formulir" className="absolute inset-0 bg-[#20223c]/35 backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
           <motion.div
             role="dialog" aria-modal="true" aria-labelledby="lesson-form-title"
             initial={{ opacity: 0, y: 32, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.98 }} transition={{ type: "spring", damping: 28, stiffness: 300 }}
             className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] bg-white p-6 shadow-2xl sm:max-w-[560px] sm:rounded-[28px] sm:p-8"
           >
            <div className="mx-auto mb-5 h-2 w-12 rounded-full bg-[#dddde5] sm:hidden" />
            <div className="flex items-start justify-between">
              <div>
                <h2 id="lesson-form-title" className="text-2xl font-extrabold tracking-[-0.03em] text-[#23253d]">{initialLesson ? "Edit pelajaran" : "Tambah pelajaran"}</h2>
                <p className="mt-2 text-sm font-medium text-[#898a9d]">Isi detail jadwal supaya harimu lebih teratur.</p>
              </div>
              <button type="button" onClick={onClose} className="rounded-xl bg-[#f4f4f7] p-2.5 text-[#747589] hover:bg-[#eaeaf0]" aria-label="Tutup"><X size={21} /></button>
            </div>
            <form onSubmit={submit} className="mt-8 space-y-5">
              <div>
                <label className="form-label" htmlFor="subject">Nama pelajaran</label>
                <input id="subject" autoFocus value={form.subject} onChange={(e) => update("subject", e.target.value)} className="form-input" placeholder="Contoh: Matematika" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="form-label" htmlFor="teacher">Nama guru</label>
                  <input id="teacher" value={form.teacher} onChange={(e) => update("teacher", e.target.value)} className="form-input" placeholder="Contoh: Bu Rani" />
                </div>
                <div>
                  <label className="form-label" htmlFor="room">Ruangan</label>
                  <input id="room" value={form.room} onChange={(e) => update("room", e.target.value)} className="form-input" placeholder="Contoh: Ruang 8A" />
                </div>
              </div>
              <div>
                <label className="form-label" htmlFor="day">Hari</label>
                <select id="day" value={form.day} onChange={(e) => update("day", e.target.value as Day)} className="form-input">
                  {DAYS.map((day) => <option key={day}>{day}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="start">Jam mulai</label>
                  <input id="start" type="time" value={form.start} onChange={(e) => update("start", e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="form-label" htmlFor="end">Jam selesai</label>
                  <input id="end" type="time" value={form.end} onChange={(e) => update("end", e.target.value)} className="form-input" />
                </div>
              </div>
              <div>
                <span className="form-label">Warna pelajaran</span>
                <div className="flex gap-3">
                  {SUBJECT_COLORS.map((color) => (
                    <button key={color} type="button" onClick={() => update("color", color)} className="grid h-10 w-10 place-items-center rounded-full transition-transform hover:scale-110" style={{ backgroundColor: color }} aria-label={`Pilih warna ${color}`}>
                      {form.color === color && <Check size={19} className="text-white" strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>
              {error && <p className="rounded-xl bg-[#fff0ec] px-3 py-2.5 text-sm font-bold text-[#d65f48]">{error}</p>}
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={onClose} className="h-12 flex-1 rounded-xl border border-[#dedee7] text-base font-extrabold text-[#66687e] hover:bg-[#f7f7f9]">Batal</button>
                <button type="submit" className="h-12 flex-[1.4] rounded-2xl bg-[#5965f4] text-base font-extrabold text-white shadow-[0_10px_24px_rgba(89,101,244,0.22)] hover:bg-[#4c58e8]">{initialLesson ? "Simpan perubahan" : "Tambahkan ke jadwal"}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function QrisPlaceholder() {
  return (
    <div className="relative grid aspect-square w-full place-items-center overflow-hidden rounded-2xl border border-[#eee7dd] bg-white p-4" aria-label="Tempat QRIS resmi">
      <svg viewBox="0 0 120 120" className="h-full w-full text-[#27283b]" aria-hidden="true">
        <rect width="120" height="120" rx="8" fill="white" />
        <g fill="currentColor">
          <path d="M8 8h30v30H8V8Zm6 6v18h18V14H14Zm4 4h10v10H18V18ZM82 8h30v30H82V8Zm6 6v18h18V14H88Zm4 4h10v10H92V18ZM8 82h30v30H8V82Zm6 6v18h18V88H14Zm4 4h10v10H18V92Z" />
          <path d="M45 8h7v7h-7zM58 8h8v6h-8zM69 9h7v12h-7zM44 20h8v8h-8zM56 18h7v14h-7zM67 27h9v8h-9zM43 37h9v7h-9zM57 37h6v11h-6zM69 41h8v7h-8zM82 44h8v8h-8zM94 43h6v13h-6zM104 45h8v7h-8zM8 45h7v10H8zM20 44h8v7h-8zM32 47h9v8h-9zM8 60h12v7H8zM25 57h7v12h-7zM36 61h8v8h-8zM47 52h7v8h-7zM66 52h9v8h-9zM79 57h7v13h-7zM91 61h8v7h-8zM103 58h9v12h-9zM9 72h8v7H9zM21 72h13v7H21zM39 73h7v9h-7zM50 66h8v11h-8zM63 67h7v15h-7zM74 73h10v8H74zM88 73h7v10h-7zM101 74h11v7h-11zM45 87h8v8h-8zM57 83h7v13h-7zM69 86h9v8h-9zM83 87h8v8h-8zM96 85h7v12h-7zM106 87h6v8h-6zM43 101h12v9H43zM61 101h8v11h-8zM74 99h7v8h-7zM85 102h12v8H85zM102 100h10v12h-10z" />
        </g>
      </svg>
      <div className="absolute grid h-12 w-12 place-items-center rounded-xl border-4 border-white bg-[#f68759] text-white shadow-sm">
        <QrCode size={23} strokeWidth={2.5} />
      </div>
    </div>
  );
}

function DonationWidget() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(DONATION_AMOUNTS[0]);
  const [customAmount, setCustomAmount] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const qrisAvailable = QRIS_IMAGE_URL.trim().length > 0;

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 2500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const chooseAmount = (value: number) => {
    setAmount(value);
    setCustomAmount("");
    setConfirmed(false);
  };

  const applyCustomAmount = () => {
    const value = Number(customAmount);
    if (!Number.isFinite(value) || value < 6000) {
      setNotice("Nominal paling sedikit Rp6.000.");
      return;
    }
    setAmount(Math.floor(value));
    setConfirmed(false);
  };

  const copyAmount = async () => {
    try {
      await navigator.clipboard.writeText(String(amount));
      setNotice("Nominal berhasil disalin.");
    } catch {
      setNotice("Nominal belum dapat disalin. Silakan salin secara manual.");
    }
  };

  const closeWidget = () => {
    setOpen(false);
    window.setTimeout(() => setConfirmed(false), 250);
  };

  return (
    <div className="donation-widget fixed bottom-4 right-4 z-[45] sm:bottom-5 sm:right-5">
      <AnimatePresence>
        {open && (
          <motion.section
            id="donation-panel"
            role="dialog"
            aria-modal="false"
            aria-labelledby="donation-title"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="absolute bottom-[72px] right-0 max-h-[calc(100vh-7rem)] w-[calc(100vw-2rem)] max-w-[360px] overflow-y-auto rounded-[24px] border border-[#eee3d7] bg-[#fffdf9] shadow-[0_24px_70px_rgba(71,43,27,0.22)]"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#f0e8df] bg-[#fffdf9]/95 px-6 py-5 backdrop-blur-md">
              <div className="flex gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#fff0e5] text-[#e76f42]"><Coffee size={22} /></div>
                <div>
                  <h2 id="donation-title" className="text-base font-black text-[#332a2a]">Traktir kopi KelasKu</h2>
                  <p className="mt-1 text-xs font-semibold text-[#8a7c75]">Dukunganmu membantu biaya server.</p>
                </div>
              </div>
              <button type="button" onClick={closeWidget} className="rounded-xl p-2 text-[#9b8f88] transition hover:bg-[#f6eee8] hover:text-[#4e4140]" aria-label="Tutup pilihan traktiran"><X size={20} /></button>
            </div>

            <div className="p-6">
              {confirmed ? (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[330px] flex-col items-center justify-center text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-[#eaf8f0] text-[#23925a]"><CheckCircle2 size={36} strokeWidth={2.3} /></div>
                  <h3 className="mt-5 text-xl font-black text-[#332a2a]">Terima kasih banyak!</h3>
                  <p className="mt-2 max-w-[280px] text-sm font-semibold leading-6 text-[#80736d]">Konfirmasi traktiran {formatRupiah(amount)} sudah dicatat. Dukunganmu sangat berarti untuk KelasKu.</p>
                  <button type="button" onClick={closeWidget} className="mt-6 h-12 w-full rounded-2xl bg-[#ee7950] text-base font-black text-white transition hover:bg-[#df6941]">Kembali ke jadwal</button>
                </motion.div>
              ) : (
                <>
                  <p className="text-xs font-black uppercase tracking-[0.1em] text-[#9a8175]">1. Pilih nominal</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {DONATION_AMOUNTS.map((value) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() => chooseAmount(value)}
                        className={`h-12 rounded-xl border text-sm font-black transition ${amount === value && !customAmount ? "border-[#ee7950] bg-[#fff0e9] text-[#d85f35]" : "border-[#eadfd6] bg-white text-[#5d504b] hover:border-[#efb097]"}`}
                      >
                        {formatRupiah(value)}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <label className="flex h-12 min-w-0 flex-1 items-center rounded-2xl border border-[#eadfd6] bg-white px-4 focus-within:border-[#ee7950]">
                      <span className="mr-1 text-sm font-black text-[#8b7a72]">Rp</span>
                      <input
                        type="number"
                        min="6000"
                        step="1000"
                        inputMode="numeric"
                        value={customAmount}
                        onChange={(event) => setCustomAmount(event.target.value)}
                        onKeyDown={(event) => event.key === "Enter" && applyCustomAmount()}
                        className="min-w-0 flex-1 bg-transparent text-sm font-extrabold text-[#4d4140] outline-none placeholder:text-[#b5a9a3]"
                        placeholder="Nominal lain"
                        aria-label="Nominal traktiran lain"
                      />
                    </label>
                    <button type="button" onClick={applyCustomAmount} className="h-12 rounded-xl bg-[#3b3440] px-5 text-sm font-black text-white transition hover:bg-[#27222b]">Pilih</button>
                  </div>

                  <div className="my-5 h-px bg-[#f0e7df]" />
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-[#9a8175]">2. Pindai QRIS</p>
                    <button type="button" onClick={copyAmount} className="flex items-center gap-1.5 text-sm font-black text-[#db683f] hover:text-[#b94e29]"><Copy size={15} /> Salin nominal</button>
                  </div>

                   <div className="mx-auto mt-4 w-[200px]">
                     {qrisAvailable ? <img src={QRIS_IMAGE_URL} alt="Kode QRIS untuk traktiran KelasKu" className="aspect-square w-full rounded-2xl border border-[#eee7dd] bg-white object-contain p-2" /> : <QrisPlaceholder />}
                   </div>
                   <div className="mt-4 text-center">
                     <p className="text-lg font-black text-[#3b3030]">{formatRupiah(amount)}</p>
                     <p className="mt-2 text-xs font-semibold leading-5 text-[#887a74]">Pindai melalui aplikasi pembayaran yang mendukung QRIS.</p>
                   </div>
                   <a href="https://trakteer.id/perpus_opera/" target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-1.5 text-sm font-black text-[#db683f] hover:text-[#b94e29]">Atau donasi langsung via Trakteer <Coffee size={14} /></a>

                   {!qrisAvailable && (
                    <div className="mt-5 flex gap-2 rounded-xl border border-[#f0d7ba] bg-[#fff7e9] p-3 text-[#8a5c25]">
                      <ShieldCheck size={18} className="mt-0.5 shrink-0" />
                       <p className="text-xs font-bold leading-4">QRIS resmi belum dipasang. Pengelola perlu memasukkan gambar QRIS sebelum traktiran dapat diterima.</p>
                    </div>
                  )}

                  <button type="button" disabled={!qrisAvailable} onClick={() => setConfirmed(true)} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#ee7950] text-base font-black text-white shadow-[0_8px_18px_rgba(238,121,80,0.22)] transition hover:bg-[#df6941] disabled:cursor-not-allowed disabled:bg-[#cfc2bb] disabled:shadow-none">
                    <Heart size={18} fill="currentColor" /> {qrisAvailable ? "Saya sudah membayar" : "QRIS belum aktif"}
                  </button>
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-[#9b8d86]"><ShieldCheck size={14} /> Pembayaran tetap dilakukan melalui aplikasi pilihanmu.</div>
                </>
              )}
            </div>

            <AnimatePresence>
              {notice && (
                <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status" className="sticky bottom-3 mx-5 mb-3 rounded-xl bg-[#3b3440] px-3 py-2 text-center text-sm font-bold text-white shadow-lg">{notice}</motion.p>
              )}
            </AnimatePresence>
            <div className="border-t border-[#f0e7df] px-5 py-3 text-center">
              <p className="text-xs font-bold text-[#9b8d86]">Open Source oleh MZF - 2026</p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((current) => !current)}
        whileTap={{ scale: 0.97 }}
        aria-expanded={open}
        aria-controls="donation-panel"
        className="flex min-h-[64px] max-w-[330px] items-center gap-3 rounded-[20px] border border-[#f3a582] bg-[#ee7950] py-3 pl-4 pr-5 text-left text-white shadow-[0_12px_32px_rgba(191,79,41,0.32)] transition hover:-translate-y-0.5 hover:bg-[#e36d45]"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/18"><Coffee size={22} /></span>
        <span className="text-sm font-extrabold leading-[1.35]">Web app ini gratis &amp; bebas iklan. Traktir kopi untuk bantu biaya server?</span>
      </motion.button>
    </div>
  );
}

// Komponen-komponen view ditambahkan di sini
function formatDate(date: string) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}

function Dashboard({ lessons, tasks, grades }: { lessons: Lesson[]; tasks: Task[]; grades: Grade[] }) {
  const today = new Date().getDay();
  const todayDay = DAYS[Math.min(Math.max(today - 1, 0), 4)] as Day;
  const todayLessons = lessons.filter((l) => l.day === todayDay);
  const pendingTasks = tasks.filter((t) => t.status !== "selesai");
  const avgScore = grades.length > 0 ? Math.round(grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length) : 0;

  const quotes = [
    { text: "Belajar dengan giat adalah langkah awal menuju masa depan yang cerah!", color: "bg-[#eef0ff] text-[#5965f4]", icon: "🚀" },
    { text: "Jangan menyerah! Setiap gagal adalah pelajaran berharga.", color: "bg-[#fff0e5] text-[#ee7950]", icon: "💪" },
    { text: "Bacalah setiap hari, otakmu akan semakin pintar!", color: "bg-[#eaf8f0] text-[#23925a]", icon: "📚" },
    { text: "Tulis dengan rapi, ingat dengan mudah!", color: "bg-[#f3e8ff] text-[#a66de8]", icon: "✏️" },
    { text: "Marbel lebih sehat otak, olahraga setiap hari!", color: "bg-[#e5f8ff] text-[#16a5b8]", icon: "⚽" },
    { text: "Ucapkan terima kasih dan maaf dengan tulus. Itulah budi pekerti luhur!", color: "bg-[#fff7e9] text-[#e4a11b]", icon: "🙏" },
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const quote = quotes[quoteIndex];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mt-8 space-y-6">
      <div>
        <h2 className="text-[28px] font-extrabold tracking-[-0.045em] text-[#22243c] sm:text-[34px]">Beranda</h2>
        <p className="mt-1.5 text-sm font-medium text-[#85869a]">Ringkasan aktivitas belajarmu hari ini.</p>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[#e7e7ee] bg-white shadow-[0_4px_20px_rgba(45,47,75,0.035)]">
        <div className={`${quote.color} px-6 py-5 sm:px-7 sm:py-6 transition-colors duration-500`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">{quote.icon}</span>
            <p className="text-base font-black sm:text-lg">{quote.text}</p>
          </div>
          <div className="mt-4 flex gap-2">
            {quotes.map((_, idx) => (
              <button key={idx} type="button" onClick={() => setQuoteIndex(idx)} className={`h-2 rounded-full transition-all ${idx === quoteIndex ? "w-6 bg-current" : "w-2 bg-black/10"}`} aria-label={`Tips ke-${idx + 1}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-[#e7e7ee] bg-white p-6 shadow-[0_4px_20px_rgba(45,47,75,0.035)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef0ff] text-[#5965f4]"><CalendarDays size={24} /></div>
          <p className="mt-4 text-3xl font-black text-[#23253d]">{todayLessons.length}</p>
          <p className="text-sm font-bold text-[#85869a]">Pelajaran hari ini</p>
        </div>
        <div className="rounded-3xl border border-[#e7e7ee] bg-white p-6 shadow-[0_4px_20px_rgba(45,47,75,0.035)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0e5] text-[#ee7950]"><BookMarked size={24} /></div>
          <p className="mt-4 text-3xl font-black text-[#23253d]">{pendingTasks.length}</p>
          <p className="text-sm font-bold text-[#85869a]">Tugas belum selesai</p>
        </div>
        <div className="rounded-3xl border border-[#e7e7ee] bg-white p-6 shadow-[0_4px_20px_rgba(45,47,75,0.035)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf8f0] text-[#23925a]"><GraduationCap size={24} /></div>
          <p className="mt-4 text-3xl font-black text-[#23253d]">{avgScore}%</p>
          <p className="text-sm font-bold text-[#85869a]">Rata-rata nilai</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#e7e7ee] bg-white p-6 shadow-[0_4px_20px_rgba(45,47,75,0.035)]">
          <h3 className="text-base font-black text-[#23253d]">Jadwal Hari Ini</h3>
          <p className="text-xs font-bold text-[#85869a]">{todayDay}, {formatLongDate(new Date())}</p>
          <div className="mt-5 space-y-3">
            {todayLessons.length > 0 ? todayLessons.sort((a, b) => a.start.localeCompare(b.start)).map((lesson) => (
              <div key={lesson.id} className="flex items-center gap-3 rounded-2xl border border-[#f0f0f5] bg-[#fafafd] p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white" style={{ backgroundColor: lesson.color }}><BookOpen size={20} strokeWidth={2.3} /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-[#2e3047]">{lesson.subject}</p>
                  <p className="text-xs font-bold text-[#8e8fa1]">{lesson.start} - {lesson.end} • {lesson.room}</p>
                </div>
              </div>
            )) : <p className="text-sm font-bold text-[#85869a]">Tidak ada pelajaran hari ini.</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-[#e7e7ee] bg-white p-6 shadow-[0_4px_20px_rgba(45,47,75,0.035)]">
          <h3 className="text-base font-black text-[#23253d]">Tugas Mendesak</h3>
          <p className="text-xs font-bold text-[#85869a]">Tugas yang belum diselesaikan</p>
          <div className="mt-5 space-y-3">
            {pendingTasks.length > 0 ? pendingTasks.slice(0, 4).map((task) => (
              <div key={task.id} className="flex items-start gap-3 rounded-2xl border border-[#f0f0f5] bg-[#fafafd] p-4">
                <div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${task.priority === "tinggi" ? "bg-[#ef7255]" : task.priority === "sedang" ? "bg-[#e4a11b]" : "bg-[#16a085]"}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-[#2e3047]">{task.subject}</p>
                  <p className="text-xs font-bold text-[#8e8fa1]">{task.description}</p>
                  <p className="mt-1.5 text-xs font-bold text-[#85869a]">Deadline: {formatDate(task.dueDate)}</p>
                </div>
              </div>
            )) : <p className="text-sm font-bold text-[#85869a]">Semua tugas sudah selesai!</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TaskModal({ open, initialTask, onClose, onSave }: { open: boolean; initialTask: Task | null; onClose: () => void; onSave: (data: TaskForm) => void }) {
  const [form, setForm] = useState<TaskForm>({ ...EMPTY_TASK_FORM });
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(initialTask ? { ...initialTask } : { ...EMPTY_TASK_FORM });
      setError("");
    }
  }, [open, initialTask]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  const update = <K extends keyof TaskForm>(key: K, value: TaskForm[K]) => setForm((current) => ({ ...current, [key]: value }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.subject.trim() || !form.description.trim() || !form.dueDate) {
      setError("Lengkapi mata pelajaran, deskripsi, dan deadline.");
      return;
    }
    onSave({ ...form, subject: form.subject.trim(), description: form.description.trim() });
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
          <motion.button type="button" aria-label="Tutup formulir" className="absolute inset-0 bg-[#20223c]/35 backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
           <motion.div role="dialog" aria-modal="true" initial={{ opacity: 0, y: 32, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.98 }} transition={{ type: "spring", damping: 28, stiffness: 300 }} className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] bg-white p-6 shadow-2xl sm:max-w-[560px] sm:rounded-[28px] sm:p-8">
            <div className="mx-auto mb-5 h-2 w-12 rounded-full bg-[#dddde5] sm:hidden" />
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-[#23253d]">{initialTask ? "Edit tugas" : "Tambah tugas"}</h2>
                <p className="mt-2 text-sm font-medium text-[#898a9d]">Kelola tugas sekolahmu dengan rapi.</p>
              </div>
              <button type="button" onClick={onClose} className="rounded-xl bg-[#f4f4f7] p-2.5 text-[#747589] hover:bg-[#eaeaf0]" aria-label="Tutup"><X size={21} /></button>
            </div>
            <form onSubmit={submit} className="mt-8 space-y-5">
              <div>
                <label className="form-label" htmlFor="task-subject">Mata pelajaran</label>
                <input id="task-subject" autoFocus value={form.subject} onChange={(e) => update("subject", e.target.value)} className="form-input" placeholder="Contoh: Matematika" />
              </div>
              <div>
                <label className="form-label" htmlFor="task-desc">Deskripsi tugas</label>
                <textarea id="task-desc" value={form.description} onChange={(e) => update("description", e.target.value)} className="form-input min-h-[80px] resize-none" placeholder="Contoh: Kerjakan soal latihan Bab 4" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="form-label" htmlFor="task-due">Deadline</label>
                  <input id="task-due" type="date" value={form.dueDate} onChange={(e) => update("dueDate", e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="form-label" htmlFor="task-priority">Prioritas</label>
                  <select id="task-priority" value={form.priority} onChange={(e) => update("priority", e.target.value as Task["priority"])} className="form-input">
                    <option value="rendah">Rendah</option>
                    <option value="sedang">Sedang</option>
                    <option value="tinggi">Tinggi</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label" htmlFor="task-status">Status</label>
                <select id="task-status" value={form.status} onChange={(e) => update("status", e.target.value as Task["status"])} className="form-input">
                  <option value="belum">Belum</option>
                  <option value="sedang">Sedang dikerjakan</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>
              {error && <p className="rounded-xl bg-[#fff0ec] px-3 py-2.5 text-sm font-bold text-[#d65f48]">{error}</p>}
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={onClose} className="h-12 flex-1 rounded-xl border border-[#dedee7] text-base font-extrabold text-[#66687e] hover:bg-[#f7f7f9]">Batal</button>
                <button type="submit" className="h-12 flex-[1.4] rounded-2xl bg-[#5965f4] text-base font-extrabold text-white shadow-[0_10px_24px_rgba(89,101,244,0.22)] hover:bg-[#4c58e8]">{initialTask ? "Simpan perubahan" : "Tambahkan tugas"}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function TugasSekolah({ tasks, setTasks }: { tasks: Task[]; setTasks: React.Dispatch<React.SetStateAction<Task[]>> }) {
  const [filter, setFilter] = useState<"semua" | "belum" | "sedang" | "selesai">("semua");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter((t) => filter === "semua" || t.status === filter);

  const openNewTask = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const saveTask = (data: TaskForm) => {
    if (editingTask) {
      setTasks((current) => current.map((task) => (task.id === editingTask.id ? { ...data, id: task.id } : task)));
    } else {
      setTasks((current) => [...current, { ...data, id: `${Date.now()}-${Math.random()}` }]);
    }
    setModalOpen(false);
    setEditingTask(null);
  };

  const removeTask = (task: Task) => {
    setTasks((current) => current.filter((item) => item.id !== task.id));
  };

  const toggleStatus = (task: Task) => {
    const nextStatus: Record<string, Task["status"]> = { belum: "sedang", sedang: "selesai", selesai: "belum" };
    setTasks((current) => current.map((t) => (t.id === task.id ? { ...t, status: nextStatus[t.status] } : t)));
  };

  const priorityColor = (p: Task["priority"]) => p === "tinggi" ? "text-[#ef7255]" : p === "sedang" ? "text-[#e4a11b]" : "text-[#16a085]";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mt-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[28px] font-extrabold tracking-[-0.045em] text-[#22243c] sm:text-[34px]">Tugas Sekolah</h2>
          <p className="mt-1.5 text-sm font-medium text-[#85869a]">Kelola dan pantau perkembangan tugasmu.</p>
        </div>
        <button type="button" onClick={openNewTask} className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#5965f4] px-5 text-base font-extrabold text-white shadow-[0_10px_24px_rgba(89,101,244,0.22)] transition hover:-translate-y-0.5 hover:bg-[#4b57e8]">
          <Plus size={20} strokeWidth={2.7} /> Tambah tugas
        </button>
      </div>

      <div className="mt-8 flex gap-2 border-b border-[#e3e3eb] pb-0">
        {(["semua", "belum", "sedang", "selesai"] as const).map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={`min-w-[100px] rounded-t-xl px-4 pb-3.5 pt-1.5 text-left text-base font-extrabold transition-colors ${filter === f ? "border-b-2 border-[#5965f4] text-[#5965f4]" : "text-[#898a9d] hover:text-[#4d4f65]"}`}>
            {f === "semua" ? "Semua" : f === "belum" ? "Belum" : f === "sedang" ? "Sedang" : "Selesai"}
            <span className="ml-2 rounded-full bg-[#f0f0f5] px-2 py-0.5 text-xs font-bold text-[#85869a]">{f === "semua" ? tasks.length : tasks.filter((t) => t.status === f).length}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <motion.div layout key={task.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="task-row group relative grid overflow-hidden rounded-3xl border border-[#e7e7ee] bg-white shadow-[0_4px_20px_rgba(45,47,75,0.035)] sm:grid-cols-[1fr_auto]">
                <div className={`absolute inset-y-0 left-0 w-2 ${task.priority === "tinggi" ? "bg-[#ef7255]" : task.priority === "sedang" ? "bg-[#e4a11b]" : "bg-[#16a085]"}`} />
                <div className="flex items-center gap-4 border-b border-[#eeeef3] px-6 py-5 pl-8 sm:border-b-0 sm:border-r sm:px-7 sm:py-6">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#f5f5f8] text-[#65677d]"><BookMarked size={22} strokeWidth={2.3} /></div>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-base font-extrabold ${task.status === "selesai" ? "text-[#aaaabd] line-through" : "text-[#2e3047]"}`}>{task.subject}</p>
                    <p className={`mt-1 truncate text-sm font-semibold ${task.status === "selesai" ? "text-[#cccce0]" : "text-[#8e8fa1]"}`}>{task.description}</p>
                    <div className="mt-2 flex items-center gap-2 text-sm font-bold text-[#85869a]">
                      <span className={`${priorityColor(task.priority)} capitalize`}>{task.priority}</span>
                      <span>•</span>
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 px-6 py-4 sm:px-7 sm:py-6">
                  <button type="button" onClick={() => toggleStatus(task)} className="flex items-center gap-2 rounded-xl border border-[#e7e7ee] bg-white px-3 py-2 text-sm font-black text-[#5d5f72] hover:border-[#c9cbe9] hover:text-[#505cf1]">
                    <CheckCircle2 size={18} />
                    {task.status === "selesai" ? "Belum" : task.status === "sedang" ? "Selesai" : "Mulai"}
                  </button>
                  <button type="button" onClick={() => { setEditingTask(task); setModalOpen(true); }} className="grid h-10 w-10 place-items-center rounded-xl bg-[#f4f4f8] text-[#74768b] opacity-100 transition hover:bg-[#eceeff] hover:text-[#505cf1] sm:opacity-0 sm:group-hover:opacity-100" aria-label={`Edit ${task.subject}`}><Pencil size={18} /></button>
                  <button type="button" onClick={() => removeTask(task)} className="grid h-10 w-10 place-items-center rounded-xl bg-[#f4f4f8] text-[#74768b] opacity-100 transition hover:bg-[#fff0ec] hover:text-[#e56e55] sm:opacity-0 sm:group-hover:opacity-100" aria-label={`Hapus ${task.subject}`}><Trash2 size={18} /></button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#dedee8] bg-white/55 px-6 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[#eef0ff] text-[#5965f4]"><BookMarked size={30} /></div>
              <p className="mt-5 text-lg font-extrabold text-[#34364d]">Tugas masih kosong</p>
              <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-[#9192a3]">Tambahkan tugas pertamamu agar belajar lebih teratur.</p>
              <button type="button" onClick={openNewTask} className="mt-5 flex items-center gap-2 text-base font-extrabold text-[#505cf1]"><Plus size={20} /> Tambah tugas</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <TaskModal open={modalOpen} initialTask={editingTask} onClose={() => { setModalOpen(false); setEditingTask(null); }} onSave={saveTask} />
    </motion.div>
  );
}

function GradeModal({ open, initialGrade, onClose, onSave }: { open: boolean; initialGrade: Grade | null; onClose: () => void; onSave: (data: GradeForm) => void }) {
  const [form, setForm] = useState<GradeForm>({ ...EMPTY_GRADE_FORM });
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(initialGrade ? { ...initialGrade } : { ...EMPTY_GRADE_FORM });
      setError("");
    }
  }, [open, initialGrade]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  const update = <K extends keyof GradeForm>(key: K, value: GradeForm[K]) => setForm((current) => ({ ...current, [key]: value }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.subject.trim() || !form.task.trim() || !form.date || form.maxScore <= 0) {
      setError("Lengkapi mata pelajaran, nama tugas, tanggal, dan nilai maksimal.");
      return;
    }
    onSave({ ...form, subject: form.subject.trim(), task: form.task.trim() });
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
          <motion.button type="button" aria-label="Tutup formulir" className="absolute inset-0 bg-[#20223c]/35 backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
           <motion.div role="dialog" aria-modal="true" initial={{ opacity: 0, y: 32, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.98 }} transition={{ type: "spring", damping: 28, stiffness: 300 }} className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] bg-white p-6 shadow-2xl sm:max-w-[560px] sm:rounded-[28px] sm:p-8">
            <div className="mx-auto mb-5 h-2 w-12 rounded-full bg-[#dddde5] sm:hidden" />
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-[#23253d]">{initialGrade ? "Edit nilai" : "Tambah nilai"}</h2>
                <p className="mt-2 text-sm font-medium text-[#898a9d]">Catat hasil evaluasi belajarmu.</p>
              </div>
              <button type="button" onClick={onClose} className="rounded-xl bg-[#f4f4f7] p-2.5 text-[#747589] hover:bg-[#eaeaf0]" aria-label="Tutup"><X size={21} /></button>
            </div>
            <form onSubmit={submit} className="mt-8 space-y-5">
              <div>
                <label className="form-label" htmlFor="grade-subject">Mata pelajaran</label>
                <input id="grade-subject" autoFocus value={form.subject} onChange={(e) => update("subject", e.target.value)} className="form-input" placeholder="Contoh: Matematika" />
              </div>
              <div>
                <label className="form-label" htmlFor="grade-task">Nama tugas / ujian</label>
                <input id="grade-task" value={form.task} onChange={(e) => update("task", e.target.value)} className="form-input" placeholder="Contoh: Ulangan Tengah Semester" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="grade-score">Nilai</label>
                  <input id="grade-score" type="number" min="0" value={form.score} onChange={(e) => update("score", Number(e.target.value))} className="form-input" />
                </div>
                <div>
                  <label className="form-label" htmlFor="grade-max">Nilai maksimal</label>
                  <input id="grade-max" type="number" min="1" value={form.maxScore} onChange={(e) => update("maxScore", Number(e.target.value))} className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label" htmlFor="grade-date">Tanggal</label>
                <input id="grade-date" type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className="form-input" />
              </div>
              {error && <p className="rounded-xl bg-[#fff0ec] px-3 py-2.5 text-sm font-bold text-[#d65f48]">{error}</p>}
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={onClose} className="h-12 flex-1 rounded-xl border border-[#dedee7] text-base font-extrabold text-[#66687e] hover:bg-[#f7f7f9]">Batal</button>
                <button type="submit" className="h-12 flex-[1.4] rounded-2xl bg-[#5965f4] text-base font-extrabold text-white shadow-[0_10px_24px_rgba(89,101,244,0.22)] hover:bg-[#4c58e8]">{initialGrade ? "Simpan perubahan" : "Tambahkan nilai"}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CatatanNilai({ grades, setGrades }: { grades: Grade[]; setGrades: React.Dispatch<React.SetStateAction<Grade[]>> }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [subjectFilter, setSubjectFilter] = useState("semua");

  const subjects = ["semua", ...Array.from(new Set(grades.map((g) => g.subject)))];
  const filteredGrades = grades.filter((g) => subjectFilter === "semua" || g.subject === subjectFilter);
  const avgScore = grades.length > 0 ? Math.round(grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length) : 0;
  const highestGrade = grades.length > 0 ? Math.round(Math.max(...grades.map((g) => (g.score / g.maxScore) * 100))) : 0;

  const openNewGrade = () => {
    setEditingGrade(null);
    setModalOpen(true);
  };

  const saveGrade = (data: GradeForm) => {
    if (editingGrade) {
      setGrades((current) => current.map((grade) => (grade.id === editingGrade.id ? { ...data, id: grade.id } : grade)));
    } else {
      setGrades((current) => [...current, { ...data, id: `${Date.now()}-${Math.random()}` }]);
    }
    setModalOpen(false);
    setEditingGrade(null);
  };

  const removeGrade = (grade: Grade) => {
    setGrades((current) => current.filter((item) => item.id !== grade.id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mt-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[28px] font-extrabold tracking-[-0.045em] text-[#22243c] sm:text-[34px]">Catatan Nilai</h2>
          <p className="mt-1.5 text-sm font-medium text-[#85869a]">Pantau perkembangan nilai pelajaranmu.</p>
        </div>
        <button type="button" onClick={openNewGrade} className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#5965f4] px-5 text-base font-extrabold text-white shadow-[0_10px_24px_rgba(89,101,244,0.22)] transition hover:-translate-y-0.5 hover:bg-[#4b57e8]">
          <Plus size={20} strokeWidth={2.7} /> Tambah nilai
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-[#e7e7ee] bg-white p-6 shadow-[0_4px_20px_rgba(45,47,75,0.035)]">
          <p className="text-sm font-bold text-[#85869a]">Rata-rata nilai</p>
          <p className="mt-2 text-3xl font-black text-[#5965f4]">{avgScore}%</p>
        </div>
        <div className="rounded-3xl border border-[#e7e7ee] bg-white p-6 shadow-[0_4px_20px_rgba(45,47,75,0.035)]">
          <p className="text-sm font-bold text-[#85869a]">Nilai tertinggi</p>
          <p className="mt-2 text-3xl font-black text-[#23925a]">{highestGrade}%</p>
        </div>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-[#e3e3eb] pb-0">
        {subjects.map((subject) => (
          <button key={subject} type="button" onClick={() => setSubjectFilter(subject)} className={`min-w-[110px] rounded-t-xl px-4 pb-3.5 pt-1.5 text-left text-base font-extrabold transition-colors ${subjectFilter === subject ? "border-b-2 border-[#5965f4] text-[#5965f4]" : "text-[#898a9d] hover:text-[#4d4f65]"}`}>
            {subject === "semua" ? "Semua" : subject}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredGrades.length > 0 ? (
            filteredGrades.map((grade) => {
              const percent = Math.round((grade.score / grade.maxScore) * 100);
              return (
                <motion.div layout key={grade.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="group relative grid overflow-hidden rounded-3xl border border-[#e7e7ee] bg-white shadow-[0_4px_20px_rgba(45,47,75,0.035)] sm:grid-cols-[1fr_auto]">
                  <div className="flex items-center gap-4 border-b border-[#eeeef3] px-6 py-5 sm:border-b-0 sm:border-r sm:px-7 sm:py-6">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#eef0ff] text-[#5965f4]"><GraduationCap size={22} strokeWidth={2.3} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-extrabold text-[#2e3047]">{grade.subject}</p>
                      <p className="mt-1 truncate text-sm font-semibold text-[#8e8fa1]">{grade.task}</p>
                      <p className="mt-1.5 text-sm font-bold text-[#85869a]">{formatDate(grade.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-4 sm:px-7 sm:py-6">
                    <div className="text-right">
                      <p className="text-base font-black text-[#5965f4]">{grade.score}/{grade.maxScore}</p>
                      <p className="text-xs font-bold text-[#85869a]">{percent}%</p>
                    </div>
                    <button type="button" onClick={() => { setEditingGrade(grade); setModalOpen(true); }} className="grid h-10 w-10 place-items-center rounded-xl bg-[#f4f4f8] text-[#74768b] opacity-100 transition hover:bg-[#eceeff] hover:text-[#505cf1] sm:opacity-0 sm:group-hover:opacity-100" aria-label={`Edit nilai ${grade.subject}`}><Pencil size={18} /></button>
                    <button type="button" onClick={() => removeGrade(grade)} className="grid h-10 w-10 place-items-center rounded-xl bg-[#f4f4f8] text-[#74768b] opacity-100 transition hover:bg-[#fff0ec] hover:text-[#e56e55] sm:opacity-0 sm:group-hover:opacity-100" aria-label={`Hapus nilai ${grade.subject}`}><Trash2 size={18} /></button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#dedee8] bg-white/55 px-6 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[#eef0ff] text-[#5965f4]"><GraduationCap size={30} /></div>
              <p className="mt-5 text-lg font-extrabold text-[#34364d]">Belum ada nilai</p>
              <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-[#9192a3]">Tambahkan nilai pertamamu untuk memantau perkembangan belajarmu.</p>
              <button type="button" onClick={openNewGrade} className="mt-5 flex items-center gap-2 text-base font-extrabold text-[#505cf1]"><Plus size={20} /> Tambah nilai</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <GradeModal open={modalOpen} initialGrade={editingGrade} onClose={() => { setModalOpen(false); setEditingGrade(null); }} onSave={saveGrade} />
    </motion.div>
  );
}

function Pengaturan({ lessons, tasks, grades, userName, onUpdateUserName, userClass, onUpdateUserClass, schoolName, onUpdateSchoolName, schoolLogo, onUpdateSchoolLogo }: { lessons: Lesson[]; tasks: Task[]; grades: Grade[]; userName: string; onUpdateUserName: (value: string) => void; userClass: string; onUpdateUserClass: (value: string) => void; schoolName: string; onUpdateSchoolName: (value: string) => void; schoolLogo: string; onUpdateSchoolLogo: (value: string) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mt-8 max-w-2xl">
      <h2 className="text-[28px] font-extrabold tracking-[-0.045em] text-[#22243c] sm:text-[34px]">Pengaturan</h2>
      <p className="mt-1.5 text-sm font-medium text-[#85869a]">Kelola data dan preferensi aplikasi.</p>

      <div className="mt-8 space-y-6">
        <div className="rounded-3xl border border-[#e7e7ee] bg-white p-6 shadow-[0_4px_20px_rgba(45,47,75,0.035)]">
          <h3 className="text-base font-black text-[#23253d]">Profil</h3>
          <div className="mt-5 space-y-3">
            <div>
              <label className="form-label" htmlFor="user-name">Nama lengkap</label>
              <input id="user-name" value={userName} onChange={(e) => onUpdateUserName(e.target.value)} className="form-input" placeholder="Contoh: Adit Ramadhan" />
            </div>
            <div>
              <label className="form-label" htmlFor="user-class">Kelas</label>
              <input id="user-class" value={userClass} onChange={(e) => onUpdateUserClass(e.target.value)} className="form-input" placeholder="Contoh: 8A" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e7e7ee] bg-white p-6 shadow-[0_4px_20px_rgba(45,47,75,0.035)]">
          <h3 className="text-base font-black text-[#23253d]">Nama Sekolah</h3>
          <div className="mt-5 space-y-3">
            <div>
              <label className="form-label" htmlFor="school-name">Nama sekolah</label>
              <input id="school-name" value={schoolName} onChange={(e) => onUpdateSchoolName(e.target.value)} className="form-input" placeholder="Contoh: SDN 01 Kota" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e7e7ee] bg-white p-6 shadow-[0_4px_20px_rgba(45,47,75,0.035)]">
          <h3 className="text-base font-black text-[#23253d]">Logo Sekolah</h3>
          <div className="mt-5 space-y-3">
            <div>
              <label className="form-label" htmlFor="school-logo">URL logo sekolah</label>
              <input id="school-logo" value={schoolLogo} onChange={(e) => onUpdateSchoolLogo(e.target.value)} className="form-input" placeholder="https://.../logo-sekolah.png" />
              <p className="mt-2 text-xs font-semibold text-[#85869a]">Jika kosong, akan menampilkan ikon buku default.</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e7e7ee] bg-white p-6 shadow-[0_4px_20px_rgba(45,47,75,0.035)]">
          <h3 className="text-base font-black text-[#23253d]">Tentang Aplikasi</h3>
          <div className="mt-5 space-y-3 text-sm font-semibold text-[#6e7088]">
            <div className="flex justify-between border-b border-[#f0f0f5] pb-3">
              <span>Nama aplikasi</span>
              <span className="font-bold text-[#23253d]">KelasKu</span>
            </div>
            <div className="flex justify-between border-b border-[#f0f0f5] pb-3">
              <span>Versi</span>
              <span className="font-bold text-[#23253d]">1.0.0</span>
            </div>
            <div className="flex justify-between border-b border-[#f0f0f5] pb-3">
              <span>Lisensi</span>
              <span className="font-bold text-[#23253d]">Open Source oleh MZF - 2026</span>
            </div>
            <div className="flex justify-between">
              <span>Tujuan</span>
              <span className="font-bold text-[#23253d]">Membantu siswa mengatur jadwal pelajaran</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e7e7ee] bg-white p-6 shadow-[0_4px_20px_rgba(45,47,75,0.035)]">
          <h3 className="text-base font-black text-[#23253d]">Data Aplikasi</h3>
          <p className="mt-1.5 text-sm font-medium text-[#898a9d]">Kelola data yang tersimpan di perangkat ini.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#e7e7ee] bg-[#fafafd] p-5">
              <p className="text-sm font-bold text-[#5965f4]">Jadwal Pelajaran</p>
              <p className="mt-2 text-xl font-black text-[#23253d]">{lessons.length} pelajaran</p>
            </div>
            <div className="rounded-2xl border border-[#e7e7ee] bg-[#fafafd] p-5">
              <p className="text-sm font-bold text-[#ee7950]">Tugas Sekolah</p>
              <p className="mt-2 text-xl font-black text-[#23253d]">{tasks.length} tugas</p>
            </div>
            <div className="rounded-2xl border border-[#e7e7ee] bg-[#fafafd] p-5">
              <p className="text-sm font-bold text-[#23925a]">Nilai</p>
              <p className="mt-2 text-xl font-black text-[#23253d]">{grades.length} nilai</p>
            </div>
            <div className="rounded-2xl border border-[#e7e7ee] bg-[#fafafd] p-5">
              <p className="text-sm font-bold text-[#ef7255]">Total Data</p>
              <p className="mt-2 text-xl font-black text-[#23253d]">{lessons.length + tasks.length + grades.length} item</p>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-[#e7e7ee] bg-[#fafafd] p-5">
            <h4 className="text-sm font-black text-[#23253d]">Kredit</h4>
            <p className="mt-2 text-sm font-bold text-[#85869a]">Open Source oleh MZF - 2026</p>
          </div>
          <div className="mt-5 rounded-2xl border border-[#e7e7ee] bg-[#fafafd] p-5">
            <h4 className="text-sm font-black text-[#23253d]">Unduh Source Code</h4>
            <p className="mt-2 text-sm font-bold text-[#85869a]">Untuk mengunduh source code lengkap, silakan kunjungi repositori GitHub/GitLab proyek ini.</p>
            <button type="button" onClick={() => alert("Fitur download source code akan segera tersedia.")} className="mt-3 flex items-center gap-2 rounded-xl border border-[#e7e7ee] bg-white px-4 py-2.5 text-sm font-extrabold text-[#5965f4] hover:border-[#c9cbe9]">
              <Download size={17} /> Download Source Code
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
export default function App() {
  const [currentView, setCurrentView] = useState("jadwal");
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    try {
      const saved = localStorage.getItem("kelasku-lessons");
      return saved ? JSON.parse(saved) : DEFAULT_LESSONS;
    } catch {
      return DEFAULT_LESSONS;
    }
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem("kelasku-tasks");
      return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });
  const [grades, setGrades] = useState<Grade[]>(() => {
    try {
      const saved = localStorage.getItem("kelasku-grades");
      return saved ? JSON.parse(saved) : DEFAULT_GRADES;
    } catch {
      return DEFAULT_GRADES;
    }
  });
  const [selectedDay, setSelectedDay] = useState<Day>(getInitialDay);
  const [weekOffset, setWeekOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [deletedLesson, setDeletedLesson] = useState<Lesson | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState(() => {
    try {
      const saved = localStorage.getItem("kelasku-userName");
      return saved ? saved : "Adit Ramadhan";
    } catch {
      return "Adit Ramadhan";
    }
  });
  const [userClass, setUserClass] = useState(() => {
    try {
      const saved = localStorage.getItem("kelasku-userClass");
      return saved ? saved : "8A";
    } catch {
      return "8A";
    }
  });

  useEffect(() => {
    localStorage.setItem("kelasku-userName", userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem("kelasku-userClass", userClass);
  }, [userClass]);

  const [schoolName, setSchoolName] = useState(() => {
    try {
      const saved = localStorage.getItem("kelasku-schoolName");
      return saved ? saved : "KelasKu";
    } catch {
      return "KelasKu";
    }
  });
  const [schoolLogo, setSchoolLogo] = useState(() => {
    try {
      const saved = localStorage.getItem("kelasku-schoolLogo");
      return saved ? saved : "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    localStorage.setItem("kelasku-schoolName", schoolName);
  }, [schoolName]);

  useEffect(() => {
    localStorage.setItem("kelasku-schoolLogo", schoolLogo);
  }, [schoolLogo]);

  useEffect(() => {
    localStorage.setItem("kelasku-lessons", JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem("kelasku-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("kelasku-grades", JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    if (!deletedLesson) return;
    const timeout = window.setTimeout(() => setDeletedLesson(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [deletedLesson]);

  const filteredLessons = useMemo(() => {
    const query = search.trim().toLowerCase();
    return lessons
      .filter((lesson) => lesson.day === selectedDay)
      .filter((lesson) => !query || [lesson.subject, lesson.teacher, lesson.room].some((text) => text.toLowerCase().includes(query)))
      .sort((a, b) => a.start.localeCompare(b.start));
  }, [lessons, selectedDay, search]);

  const monday = getMonday(weekOffset);
  const friday = new Date(monday);
  friday.setDate(friday.getDate() + 4);

  const openNewLesson = () => {
    setEditingLesson(null);
    setModalOpen(true);
  };

  const saveLesson = (data: LessonForm) => {
    if (editingLesson) {
      setLessons((current) => current.map((lesson) => (lesson.id === editingLesson.id ? { ...data, id: lesson.id } : lesson)));
    } else {
      setLessons((current) => [...current, { ...data, id: `${Date.now()}-${Math.random()}` }]);
    }
    setSelectedDay(data.day);
    setModalOpen(false);
    setEditingLesson(null);
  };

  const removeLesson = (lesson: Lesson) => {
    setLessons((current) => current.filter((item) => item.id !== lesson.id));
    setDeletedLesson(lesson);
  };

  return (
    <div className="app-shell flex min-h-screen bg-[#f8f8fb] text-[#26283f]">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} schoolName={schoolName} schoolLogo={schoolLogo} />
      <div className="min-w-0 flex-1">
        <Header onAdd={openNewLesson} onMenu={() => setMenuOpen(true)} search={search} onSearch={setSearch} currentView={currentView} userName={userName} onUpdateUserName={setUserName} userClass={userClass} onUpdateUserClass={setUserClass} schoolName={schoolName} schoolLogo={schoolLogo} />
        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} currentView={currentView} onNavigate={setCurrentView} schoolName={schoolName} schoolLogo={schoolLogo} />

        <main className="mx-auto max-w-[1180px] px-4 pb-44 pt-7 sm:px-7 sm:pb-28 sm:pt-9 lg:px-10 lg:pb-12">
          <AnimatePresence mode="wait">
            {currentView === "jadwal" && (
              <motion.div key="jadwal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.14em] text-[#5965f4]"><span className="h-2 w-2 rounded-full bg-[#ffb84d]" /> Kelas {userClass}</div>
                    <h1 className="text-[28px] font-extrabold tracking-[-0.045em] text-[#22243c] sm:text-[34px]">Jadwal Pelajaran</h1>
                    <p className="mt-1.5 text-sm font-medium text-[#85869a]">Atur jadwalmu, belajar lebih tenang.</p>
                  </div>
                  <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
                    <button type="button" onClick={() => window.print()} className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dfe0e9] bg-white px-4 text-base font-extrabold text-[#5e6076] transition hover:border-[#aeb3f5] hover:text-[#505cf1]" aria-label="Cetak jadwal mingguan">
                      <Printer size={19} /> Cetak jadwal
                    </button>
                    <div className="flex items-center justify-between gap-2">
                      <button type="button" onClick={() => setWeekOffset((value) => value - 1)} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#e2e2ea] bg-white text-[#67697e] hover:border-[#c9cbe9] hover:text-[#505cf1]" aria-label="Minggu sebelumnya"><ChevronLeft size={21} /></button>
                      <button type="button" onClick={() => setWeekOffset(0)} className="min-w-[168px] flex-1 rounded-2xl border border-[#e2e2ea] bg-white px-4 py-2 text-center hover:border-[#c9cbe9] sm:flex-none">
                        <span className="block text-xs font-extrabold uppercase tracking-[0.12em] text-[#a0a1b1]">{weekOffset === 0 ? "Minggu ini" : weekOffset > 0 ? "Minggu berikutnya" : "Minggu sebelumnya"}</span>
                        <span className="mt-0.5 block text-sm font-extrabold text-[#414359]">{formatShortDate(monday)} - {formatShortDate(friday)}</span>
                      </button>
                      <button type="button" onClick={() => setWeekOffset((value) => value + 1)} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#e2e2ea] bg-white text-[#67697e] hover:border-[#c9cbe9] hover:text-[#505cf1]" aria-label="Minggu berikutnya"><ChevronRight size={21} /></button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-2 overflow-x-auto border-b border-[#e3e3eb] pb-0 scrollbar-none" role="tablist" aria-label="Pilih hari">
                  {DAYS.map((day) => {
                    const active = selectedDay === day;
                    const date = getDayDate(day, weekOffset);
                    const count = lessons.filter((lesson) => lesson.day === day).length;
                    return (
                      <button type="button" role="tab" aria-selected={active} key={day} onClick={() => setSelectedDay(day)} className={`relative min-w-[110px] flex-1 px-3 pb-4 pt-1 text-left transition-colors sm:text-center ${active ? "text-[#4f5bef]" : "text-[#898a9d] hover:text-[#4d4f65]"}`}>
                        <span className="block text-xs font-extrabold uppercase tracking-[0.1em]">{day}</span>
                        <span className={`mt-1 block text-sm font-extrabold ${active ? "text-[#24263e]" : "text-[#78798e]"}`}>{formatShortDate(date)}</span>
                        <span className="mt-1 block text-xs font-bold">{count} pelajaran</span>
                        {active && <motion.span layoutId="active-day" className="absolute inset-x-3 bottom-[-1px] h-[3px] rounded-t-full bg-[#5965f4]" />}
                      </button>
                    );
                  })}
                </div>

                <section className="mt-7" aria-labelledby="selected-day-heading">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 id="selected-day-heading" className="text-lg font-extrabold tracking-[-0.025em] text-[#2c2e45]">{selectedDay}, {formatLongDate(getDayDate(selectedDay, weekOffset))}</h2>
                      <p className="mt-1 text-sm font-semibold text-[#999aaa]">{filteredLessons.length > 0 ? `${filteredLessons.length} pelajaran sudah terjadwal` : "Belum ada pelajaran yang terjadwal"}</p>
                    </div>
                    <label className="flex h-12 items-center gap-2 rounded-2xl border border-[#e2e2ea] bg-white px-4 text-[#999aaa] md:hidden">
                      <Search size={19} />
                      <input value={search} onChange={(e) => setSearch(e.target.value)} className="min-w-0 flex-1 bg-transparent text-base font-semibold text-[#34364d] outline-none" placeholder="Cari pelajaran..." aria-label="Cari pelajaran" />
                    </label>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {filteredLessons.length > 0 ? (
                      <motion.div key={`${selectedDay}-${search}`} className="mt-6 space-y-3" initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}>
                        {filteredLessons.map((lesson) => (
                          <motion.article
                            layout key={lesson.id}
                            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
                            className="lesson-row group relative grid overflow-hidden rounded-3xl border border-[#e7e7ee] bg-white shadow-[0_4px_20px_rgba(45,47,75,0.035)] sm:grid-cols-[126px_minmax(0,1fr)_190px_84px]"
                          >
                            <div className="absolute inset-y-0 left-0 w-2" style={{ backgroundColor: lesson.color }} />
                            <div className="flex items-center gap-3 border-b border-[#eeeef3] px-6 py-4 pl-6 sm:block sm:border-b-0 sm:border-r sm:px-6 sm:py-5">
                              <div className="flex items-center gap-2 text-base font-extrabold text-[#34364d]"><Clock3 size={17} style={{ color: lesson.color }} /> {lesson.start}</div>
                              <p className="text-sm font-bold text-[#9b9cab] sm:ml-[23px] sm:mt-1">sampai {lesson.end}</p>
                            </div>
                            <div className="flex min-w-0 items-center gap-4 px-6 py-4 sm:px-6 sm:py-5">
                              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white" style={{ backgroundColor: lesson.color }}><BookOpen size={22} strokeWidth={2.3} /></div>
                              <div className="min-w-0">
                                <p className="truncate text-base font-extrabold text-[#2e3047] sm:text-[15px]">{lesson.subject}</p>
                                <p className="mt-1 flex items-center gap-1.5 truncate text-sm font-semibold text-[#8e8fa1]"><UserRound size={15} /> {lesson.teacher}</p>
                              </div>
                            </div>
                            <div className="flex items-center border-t border-[#eeeef3] px-6 py-3 text-sm font-bold text-[#77798e] sm:border-l sm:border-t-0 sm:px-6 sm:py-5">
                              <MapPin size={17} className="mr-2 shrink-0 text-[#a2a3b2]" /> <span className="truncate">{lesson.room}</span>
                            </div>
                            <div className="absolute right-3 top-3 flex gap-1 sm:static sm:items-center sm:justify-center">
                              <button type="button" onClick={() => { setEditingLesson(lesson); setModalOpen(true); }} className="grid h-10 w-10 place-items-center rounded-xl bg-[#f4f4f8] text-[#74768b] opacity-100 transition hover:bg-[#eceeff] hover:text-[#505cf1] sm:opacity-0 sm:group-hover:opacity-100" aria-label={`Edit ${lesson.subject}`}><Pencil size={17} /></button>
                              <button type="button" onClick={() => removeLesson(lesson)} className="grid h-10 w-10 place-items-center rounded-xl bg-[#f4f4f8] text-[#74768b] opacity-100 transition hover:bg-[#fff0ec] hover:text-[#e56e55] sm:opacity-0 sm:group-hover:opacity-100" aria-label={`Hapus ${lesson.subject}`}><Trash2 size={17} /></button>
                              <MoreHorizontal size={20} className="hidden text-[#a3a4b2] sm:block sm:group-hover:hidden" />
                            </div>
                          </motion.article>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#dedee8] bg-white/55 px-6 text-center">
                        <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[#eef0ff] text-[#5965f4]"><CalendarDays size={30} /></div>
                        <p className="mt-5 text-lg font-extrabold text-[#34364d]">{search ? "Pelajaran tidak ditemukan" : `Jadwal ${selectedDay} masih kosong`}</p>
                        <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-[#9192a3]">{search ? "Coba gunakan kata kunci lain." : "Tambahkan pelajaran pertamamu agar tidak ada kelas yang terlewat."}</p>
                        {!search && <button type="button" onClick={openNewLesson} className="mt-5 flex items-center gap-2 text-base font-extrabold text-[#505cf1]"><Plus size={20} /> Tambah sekarang</button>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>
              </motion.div>
            )}
            {currentView === "beranda" && <Dashboard key="beranda" lessons={lessons} tasks={tasks} grades={grades} />}
            {currentView === "tugas" && <TugasSekolah key="tugas" tasks={tasks} setTasks={setTasks} />}
            {currentView === "nilai" && <CatatanNilai key="nilai" grades={grades} setGrades={setGrades} />}
            {currentView === "pengaturan" && <Pengaturan key="pengaturan" lessons={lessons} tasks={tasks} grades={grades} userName={userName} onUpdateUserName={setUserName} userClass={userClass} onUpdateUserClass={setUserClass} schoolName={schoolName} onUpdateSchoolName={setSchoolName} schoolLogo={schoolLogo} onUpdateSchoolLogo={setSchoolLogo} />}
          </AnimatePresence>
        </main>

        <button type="button" onClick={openNewLesson} className="fixed bottom-[90px] right-5 z-30 grid h-16 w-16 place-items-center rounded-[24px] bg-[#5965f4] text-white shadow-[0_12px_28px_rgba(89,101,244,0.35)] transition hover:-translate-y-1 sm:hidden" aria-label="Tambah pelajaran"><Plus size={28} strokeWidth={2.7} /></button>
      </div>

      <LessonModal open={modalOpen} initialLesson={editingLesson} initialDay={selectedDay} onClose={() => { setModalOpen(false); setEditingLesson(null); }} onSave={saveLesson} />

      <AnimatePresence>
        {deletedLesson && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="fixed bottom-[96px] left-1/2 z-[70] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl bg-[#252740] px-5 py-4 text-white shadow-2xl lg:left-[calc(50%+130px)]">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10"><Trash2 size={17} /></div>
            <p className="min-w-0 flex-1 truncate text-sm font-bold">{deletedLesson.subject} dihapus</p>
            <button type="button" onClick={() => { setLessons((current) => [...current, deletedLesson]); setDeletedLesson(null); }} className="text-sm font-extrabold text-[#ffbd58] hover:text-[#ffd18a]">Urungkan</button>
            <button type="button" onClick={() => setDeletedLesson(null)} className="text-white/50 hover:text-white" aria-label="Tutup notifikasi"><X size={18} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <DonationWidget />

      <section className="print-sheet" aria-label="Jadwal pelajaran mingguan untuk dicetak">
        <header className="print-header">
          <div>
            <p className="print-brand">{schoolName}.</p>
            <h1>Jadwal Pelajaran</h1>
            <p>Kelas {userClass} | {userName}</p>
          </div>
          <div className="print-week">
            <strong>{formatShortDate(monday)} - {formatShortDate(friday)}</strong>
            <span>Tahun ajaran 2025/2026</span>
          </div>
        </header>

        <div className="print-days">
          {DAYS.map((day) => {
            const dayLessons = lessons.filter((lesson) => lesson.day === day).sort((a, b) => a.start.localeCompare(b.start));
            return (
              <section className="print-day" key={day}>
                <div className="print-day-heading">
                  <h2>{day}</h2>
                  <span>{formatLongDate(getDayDate(day, weekOffset))}</span>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Jam</th>
                      <th>Pelajaran</th>
                      <th>Guru</th>
                      <th>Ruangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayLessons.length > 0 ? dayLessons.map((lesson) => (
                      <tr key={lesson.id}>
                        <td>{lesson.start} - {lesson.end}</td>
                        <td><span className="print-subject-mark" style={{ backgroundColor: lesson.color }} />{lesson.subject}</td>
                        <td>{lesson.teacher}</td>
                        <td>{lesson.room}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={4} className="print-empty">Belum ada pelajaran</td></tr>
                    )}
                  </tbody>
                </table>
              </section>
            );
          })}
        </div>

        <footer className="print-footer">
          <span>Dicetak dari {schoolName}</span>
          <span>{formatLongDate(new Date())}</span>
        </footer>
      </section>
    </div>
  );
}