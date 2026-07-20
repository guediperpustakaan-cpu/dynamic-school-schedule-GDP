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
  ShieldCheck,
  Settings,
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

const SUBJECT_COLORS = ["#5B66F6", "#FF8A65", "#16A085", "#E4A11B", "#A66DE8", "#E85976"];
const DONATION_AMOUNTS = [5000, 10000, 20000, 50000];

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

function AppLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 rotate-[-3deg] items-center justify-center rounded-[14px] bg-[#5965f4] text-white shadow-[0_7px_18px_rgba(89,101,244,0.25)]">
        <BookOpen size={21} strokeWidth={2.4} />
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#f8f8fb] bg-[#ffb84d]" />
      </div>
      {!compact && <span className="text-xl font-extrabold tracking-[-0.04em] text-[#20233d]">KelasKu.</span>}
    </div>
  );
}

function Sidebar() {
  const navigation = [
    { label: "Beranda", icon: LayoutGrid },
    { label: "Jadwal Pelajaran", icon: CalendarDays, active: true },
    { label: "Tugas Sekolah", icon: BookMarked, count: 3 },
    { label: "Catatan Nilai", icon: GraduationCap },
  ];

  return (
    <aside className="hidden h-screen w-[260px] shrink-0 flex-col border-r border-[#e9e9f1] bg-white px-5 py-7 lg:flex">
      <div className="px-2"><AppLogo /></div>
      <div className="mt-10 px-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#aaaabd]">Menu utama</div>
      <nav className="mt-3 space-y-1.5">
        {navigation.map(({ label, icon: Icon, active, count }) => (
          <button
            type="button"
            key={label}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition-colors ${
              active ? "bg-[#eef0ff] text-[#505cf1]" : "text-[#6e7088] hover:bg-[#f7f7fa] hover:text-[#31334a]"
            }`}
          >
            <Icon size={19} strokeWidth={active ? 2.5 : 2} />
            <span>{label}</span>
            {count && <span className="ml-auto rounded-full bg-[#ffebe5] px-2 py-0.5 text-[10px] font-extrabold text-[#ef7255]">{count}</span>}
          </button>
        ))}
      </nav>
      <div className="mt-auto">
        <div className="mx-2 mb-5 overflow-hidden rounded-2xl bg-[#242641] px-4 pb-4 pt-5 text-white">
          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#ffbc55] text-[#242641]"><GraduationCap size={18} /></div>
          <p className="text-sm font-extrabold">Semangat belajar!</p>
          <p className="mt-1 text-xs leading-5 text-[#b9bad0]">Sedikit demi sedikit, hasilnya pasti hebat.</p>
        </div>
        <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#74758b] hover:bg-[#f7f7fa]">
          <Settings size={19} /> Pengaturan
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
}: {
  onAdd: () => void;
  onMenu: () => void;
  search: string;
  onSearch: (value: string) => void;
}) {
  return (
    <header className="flex h-[76px] items-center border-b border-[#e9e9f1] bg-white px-4 sm:px-7 lg:px-10">
      <button type="button" onClick={onMenu} className="mr-3 rounded-xl p-2 text-[#5f6177] hover:bg-[#f2f2f7] lg:hidden" aria-label="Buka menu"><Menu size={22} /></button>
      <div className="lg:hidden"><AppLogo compact /></div>
      <div className="hidden lg:block">
        <p className="text-sm font-extrabold text-[#272940]">Halo, Adit!</p>
        <p className="mt-0.5 text-xs text-[#8a8ca0]">Siap belajar hal baru hari ini?</p>
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <label className="hidden h-10 w-[220px] items-center gap-2 rounded-xl bg-[#f5f5f8] px-3 text-[#9899aa] md:flex">
          <Search size={17} />
          <input value={search} onChange={(event) => onSearch(event.target.value)} className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-[#34364d] outline-none placeholder:text-[#a8a9b7]" placeholder="Cari pelajaran..." aria-label="Cari pelajaran" />
        </label>
        <button type="button" className="relative grid h-10 w-10 place-items-center rounded-xl bg-[#f5f5f8] text-[#65677d] transition-transform hover:scale-105" aria-label="Notifikasi">
          <Bell size={19} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-[#f5f5f8] bg-[#ef7255]" />
        </button>
        <button type="button" onClick={onAdd} className="hidden h-10 items-center gap-2 rounded-xl bg-[#5965f4] px-4 text-xs font-extrabold text-white shadow-[0_7px_18px_rgba(89,101,244,0.22)] transition hover:-translate-y-0.5 hover:bg-[#4b57e8] sm:flex">
          <Plus size={17} strokeWidth={2.7} /> Tambah pelajaran
        </button>
        <div className="ml-1 flex items-center gap-2 border-l border-[#e3e3eb] pl-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#ffe3ba] text-sm font-extrabold text-[#81501c]">AR</div>
          <div className="hidden xl:block">
            <p className="text-xs font-extrabold text-[#33354c]">Adit Ramadhan</p>
            <p className="mt-0.5 text-[10px] font-semibold text-[#9697a8]">Kelas 8A</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button type="button" aria-label="Tutup menu" className="fixed inset-0 z-40 bg-[#20223c]/30 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white p-6 shadow-2xl lg:hidden"
            initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <AppLogo />
              <button type="button" onClick={onClose} className="rounded-lg p-2 text-[#6d6e82] hover:bg-[#f4f4f7]" aria-label="Tutup menu"><X size={20} /></button>
            </div>
            <p className="mt-10 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#aaaabd]">Menu utama</p>
            <button type="button" onClick={onClose} className="mt-3 flex w-full items-center gap-3 rounded-xl bg-[#eef0ff] px-3 py-3 text-left text-sm font-bold text-[#505cf1]"><CalendarDays size={19} strokeWidth={2.5} /> Jadwal Pelajaran</button>
            <button type="button" className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-[#6e7088] hover:bg-[#f7f7fa]">
              <BookMarked size={19} /> Tugas Sekolah <span className="ml-auto rounded-full bg-[#ffebe5] px-2 py-0.5 text-[10px] font-extrabold text-[#ef7255]">3</span>
            </button>
            <button type="button" className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-[#6e7088] hover:bg-[#f7f7fa]"><GraduationCap size={19} /> Catatan Nilai</button>
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
            className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[26px] bg-white p-5 shadow-2xl sm:max-w-[560px] sm:rounded-[26px] sm:p-7"
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-[#dddde5] sm:hidden" />
            <div className="flex items-start justify-between">
              <div>
                <h2 id="lesson-form-title" className="text-xl font-extrabold tracking-[-0.03em] text-[#23253d]">{initialLesson ? "Edit pelajaran" : "Tambah pelajaran"}</h2>
                <p className="mt-1 text-xs font-medium text-[#898a9d]">Isi detail jadwal supaya harimu lebih teratur.</p>
              </div>
              <button type="button" onClick={onClose} className="rounded-xl bg-[#f4f4f7] p-2 text-[#747589] hover:bg-[#eaeaf0]" aria-label="Tutup"><X size={19} /></button>
            </div>
            <form onSubmit={submit} className="mt-6 space-y-4">
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
                    <button key={color} type="button" onClick={() => update("color", color)} className="grid h-9 w-9 place-items-center rounded-full transition-transform hover:scale-110" style={{ backgroundColor: color }} aria-label={`Pilih warna ${color}`}>
                      {form.color === color && <Check size={17} className="text-white" strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>
              {error && <p className="rounded-xl bg-[#fff0ec] px-3 py-2.5 text-xs font-bold text-[#d65f48]">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="h-11 flex-1 rounded-xl border border-[#dedee7] text-sm font-extrabold text-[#66687e] hover:bg-[#f7f7f9]">Batal</button>
                <button type="submit" className="h-11 flex-[1.4] rounded-xl bg-[#5965f4] text-sm font-extrabold text-white shadow-[0_7px_18px_rgba(89,101,244,0.22)] hover:bg-[#4c58e8]">{initialLesson ? "Simpan perubahan" : "Tambahkan ke jadwal"}</button>
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
    if (!Number.isFinite(value) || value < 5000) {
      setNotice("Nominal paling sedikit Rp5.000.");
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
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#f0e8df] bg-[#fffdf9]/95 px-5 py-4 backdrop-blur-md">
              <div className="flex gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fff0e5] text-[#e76f42]"><Coffee size={20} /></div>
                <div>
                  <h2 id="donation-title" className="text-sm font-black text-[#332a2a]">Traktir kopi KelasKu</h2>
                  <p className="mt-0.5 text-[11px] font-semibold text-[#8a7c75]">Dukunganmu membantu biaya server.</p>
                </div>
              </div>
              <button type="button" onClick={closeWidget} className="rounded-lg p-1.5 text-[#9b8f88] transition hover:bg-[#f6eee8] hover:text-[#4e4140]" aria-label="Tutup pilihan traktiran"><X size={18} /></button>
            </div>

            <div className="p-5">
              {confirmed ? (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[330px] flex-col items-center justify-center text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-[#eaf8f0] text-[#23925a]"><CheckCircle2 size={31} strokeWidth={2.3} /></div>
                  <h3 className="mt-5 text-lg font-black text-[#332a2a]">Terima kasih banyak!</h3>
                  <p className="mt-2 max-w-[260px] text-xs font-semibold leading-5 text-[#80736d]">Konfirmasi traktiran {formatRupiah(amount)} sudah dicatat. Dukunganmu sangat berarti untuk KelasKu.</p>
                  <button type="button" onClick={closeWidget} className="mt-6 h-10 w-full rounded-xl bg-[#ee7950] text-xs font-black text-white transition hover:bg-[#df6941]">Kembali ke jadwal</button>
                </motion.div>
              ) : (
                <>
                  <p className="text-[11px] font-black uppercase tracking-[0.1em] text-[#9a8175]">1. Pilih nominal</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {DONATION_AMOUNTS.map((value) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() => chooseAmount(value)}
                        className={`h-10 rounded-xl border text-xs font-black transition ${amount === value && !customAmount ? "border-[#ee7950] bg-[#fff0e9] text-[#d85f35]" : "border-[#eadfd6] bg-white text-[#5d504b] hover:border-[#efb097]"}`}
                      >
                        {formatRupiah(value)}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 flex gap-2">
                    <label className="flex h-10 min-w-0 flex-1 items-center rounded-xl border border-[#eadfd6] bg-white px-3 focus-within:border-[#ee7950]">
                      <span className="mr-1 text-xs font-black text-[#8b7a72]">Rp</span>
                      <input
                        type="number"
                        min="5000"
                        step="1000"
                        inputMode="numeric"
                        value={customAmount}
                        onChange={(event) => setCustomAmount(event.target.value)}
                        onKeyDown={(event) => event.key === "Enter" && applyCustomAmount()}
                        className="min-w-0 flex-1 bg-transparent text-xs font-extrabold text-[#4d4140] outline-none placeholder:text-[#b5a9a3]"
                        placeholder="Nominal lain"
                        aria-label="Nominal traktiran lain"
                      />
                    </label>
                    <button type="button" onClick={applyCustomAmount} className="h-10 rounded-xl bg-[#3b3440] px-4 text-xs font-black text-white transition hover:bg-[#27222b]">Pilih</button>
                  </div>

                  <div className="my-5 h-px bg-[#f0e7df]" />
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-black uppercase tracking-[0.1em] text-[#9a8175]">2. Pindai QRIS</p>
                    <button type="button" onClick={copyAmount} className="flex items-center gap-1.5 text-[10px] font-black text-[#db683f] hover:text-[#b94e29]"><Copy size={13} /> Salin nominal</button>
                  </div>

                  <div className="mx-auto mt-3 w-[190px]">
                    {qrisAvailable ? <img src={QRIS_IMAGE_URL} alt="Kode QRIS untuk traktiran KelasKu" className="aspect-square w-full rounded-2xl border border-[#eee7dd] bg-white object-contain p-2" /> : <QrisPlaceholder />}
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-base font-black text-[#3b3030]">{formatRupiah(amount)}</p>
                    <p className="mt-1 text-[10px] font-semibold leading-4 text-[#887a74]">Pindai melalui aplikasi pembayaran yang mendukung QRIS.</p>
                  </div>

                  {!qrisAvailable && (
                    <div className="mt-4 flex gap-2 rounded-xl border border-[#f0d7ba] bg-[#fff7e9] p-3 text-[#8a5c25]">
                      <ShieldCheck size={16} className="mt-0.5 shrink-0" />
                      <p className="text-[10px] font-bold leading-4">QRIS resmi belum dipasang. Pengelola perlu memasukkan gambar QRIS sebelum traktiran dapat diterima.</p>
                    </div>
                  )}

                  <button type="button" disabled={!qrisAvailable} onClick={() => setConfirmed(true)} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#ee7950] text-xs font-black text-white shadow-[0_8px_18px_rgba(238,121,80,0.22)] transition hover:bg-[#df6941] disabled:cursor-not-allowed disabled:bg-[#cfc2bb] disabled:shadow-none">
                    <Heart size={16} fill="currentColor" /> {qrisAvailable ? "Saya sudah membayar" : "QRIS belum aktif"}
                  </button>
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] font-bold text-[#9b8d86]"><ShieldCheck size={12} /> Pembayaran tetap dilakukan melalui aplikasi pilihanmu.</div>
                </>
              )}
            </div>

            <AnimatePresence>
              {notice && (
                <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status" className="sticky bottom-3 mx-5 mb-3 rounded-xl bg-[#3b3440] px-3 py-2 text-center text-[10px] font-bold text-white shadow-lg">{notice}</motion.p>
              )}
            </AnimatePresence>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((current) => !current)}
        whileTap={{ scale: 0.97 }}
        aria-expanded={open}
        aria-controls="donation-panel"
        className="flex min-h-[58px] max-w-[330px] items-center gap-3 rounded-2xl border border-[#f3a582] bg-[#ee7950] py-2.5 pl-3 pr-4 text-left text-white shadow-[0_12px_32px_rgba(191,79,41,0.32)] transition hover:-translate-y-0.5 hover:bg-[#e36d45]"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/18"><Coffee size={20} /></span>
        <span className="text-[11px] font-extrabold leading-[1.35]">Web app ini gratis &amp; bebas iklan. Traktir kopi untuk bantu biaya server?</span>
      </motion.button>
    </div>
  );
}

export default function App() {
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    try {
      const saved = localStorage.getItem("kelasku-lessons");
      return saved ? JSON.parse(saved) : DEFAULT_LESSONS;
    } catch {
      return DEFAULT_LESSONS;
    }
  });
  const [selectedDay, setSelectedDay] = useState<Day>(getInitialDay);
  const [weekOffset, setWeekOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [deletedLesson, setDeletedLesson] = useState<Lesson | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("kelasku-lessons", JSON.stringify(lessons));
  }, [lessons]);

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
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header onAdd={openNewLesson} onMenu={() => setMenuOpen(true)} search={search} onSearch={setSearch} />
        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

        <main className="mx-auto max-w-[1180px] px-4 pb-44 pt-7 sm:px-7 sm:pb-28 sm:pt-9 lg:px-10 lg:pb-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#5965f4]"><span className="h-1.5 w-1.5 rounded-full bg-[#ffb84d]" /> Kelas 8A</div>
                <h1 className="text-[28px] font-extrabold tracking-[-0.045em] text-[#22243c] sm:text-[34px]">Jadwal Pelajaran</h1>
                <p className="mt-1.5 text-sm font-medium text-[#85869a]">Atur jadwalmu, belajar lebih tenang.</p>
              </div>
              <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
                <button type="button" onClick={() => window.print()} className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#dfe0e9] bg-white px-3 text-xs font-extrabold text-[#5e6076] transition hover:border-[#aeb3f5] hover:text-[#505cf1]" aria-label="Cetak jadwal mingguan">
                  <Printer size={17} /> Cetak jadwal
                </button>
                <div className="flex items-center justify-between gap-2">
                  <button type="button" onClick={() => setWeekOffset((value) => value - 1)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#e2e2ea] bg-white text-[#67697e] hover:border-[#c9cbe9] hover:text-[#505cf1]" aria-label="Minggu sebelumnya"><ChevronLeft size={19} /></button>
                  <button type="button" onClick={() => setWeekOffset(0)} className="min-w-[168px] flex-1 rounded-xl border border-[#e2e2ea] bg-white px-4 py-2 text-center hover:border-[#c9cbe9] sm:flex-none">
                    <span className="block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#a0a1b1]">{weekOffset === 0 ? "Minggu ini" : weekOffset > 0 ? "Minggu berikutnya" : "Minggu sebelumnya"}</span>
                    <span className="mt-0.5 block text-xs font-extrabold text-[#414359]">{formatShortDate(monday)} - {formatShortDate(friday)}</span>
                  </button>
                  <button type="button" onClick={() => setWeekOffset((value) => value + 1)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#e2e2ea] bg-white text-[#67697e] hover:border-[#c9cbe9] hover:text-[#505cf1]" aria-label="Minggu berikutnya"><ChevronRight size={19} /></button>
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
                    <span className="block text-[10px] font-extrabold uppercase tracking-[0.1em]">{day}</span>
                    <span className={`mt-1 block text-sm font-extrabold ${active ? "text-[#24263e]" : "text-[#78798e]"}`}>{formatShortDate(date)}</span>
                    <span className="mt-1 block text-[10px] font-bold">{count} pelajaran</span>
                    {active && <motion.span layoutId="active-day" className="absolute inset-x-3 bottom-[-1px] h-[3px] rounded-t-full bg-[#5965f4]" />}
                  </button>
                );
              })}
            </div>

            <section className="mt-7" aria-labelledby="selected-day-heading">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 id="selected-day-heading" className="text-lg font-extrabold tracking-[-0.025em] text-[#2c2e45]">{selectedDay}, {formatLongDate(getDayDate(selectedDay, weekOffset))}</h2>
                  <p className="mt-1 text-xs font-semibold text-[#999aaa]">{filteredLessons.length > 0 ? `${filteredLessons.length} pelajaran sudah terjadwal` : "Belum ada pelajaran yang terjadwal"}</p>
                </div>
                <label className="flex h-10 items-center gap-2 rounded-xl border border-[#e2e2ea] bg-white px-3 text-[#999aaa] md:hidden">
                  <Search size={17} />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-[#34364d] outline-none" placeholder="Cari pelajaran..." aria-label="Cari pelajaran" />
                </label>
              </div>

              <AnimatePresence mode="popLayout">
                {filteredLessons.length > 0 ? (
                  <motion.div key={`${selectedDay}-${search}`} className="mt-5 space-y-3" initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}>
                    {filteredLessons.map((lesson) => (
                      <motion.article
                        layout key={lesson.id}
                        variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
                        className="lesson-row group relative grid overflow-hidden rounded-2xl border border-[#e7e7ee] bg-white shadow-[0_4px_20px_rgba(45,47,75,0.035)] sm:grid-cols-[126px_minmax(0,1fr)_190px_84px]"
                      >
                        <div className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: lesson.color }} />
                        <div className="flex items-center gap-3 border-b border-[#eeeef3] px-5 py-4 pl-6 sm:block sm:border-b-0 sm:border-r sm:px-6 sm:py-5">
                          <div className="flex items-center gap-2 text-sm font-extrabold text-[#34364d]"><Clock3 size={15} style={{ color: lesson.color }} /> {lesson.start}</div>
                          <p className="text-xs font-bold text-[#9b9cab] sm:ml-[23px] sm:mt-1">sampai {lesson.end}</p>
                        </div>
                        <div className="flex min-w-0 items-center gap-4 px-5 py-4 sm:px-6 sm:py-5">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white" style={{ backgroundColor: lesson.color }}><BookOpen size={19} strokeWidth={2.3} /></div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-extrabold text-[#2e3047] sm:text-[15px]">{lesson.subject}</p>
                            <p className="mt-1 flex items-center gap-1.5 truncate text-xs font-semibold text-[#8e8fa1]"><UserRound size={13} /> {lesson.teacher}</p>
                          </div>
                        </div>
                        <div className="flex items-center border-t border-[#eeeef3] px-5 py-3 text-xs font-bold text-[#77798e] sm:border-l sm:border-t-0 sm:px-6 sm:py-5">
                          <MapPin size={15} className="mr-2 shrink-0 text-[#a2a3b2]" /> <span className="truncate">{lesson.room}</span>
                        </div>
                        <div className="absolute right-3 top-3 flex gap-1 sm:static sm:items-center sm:justify-center">
                          <button type="button" onClick={() => { setEditingLesson(lesson); setModalOpen(true); }} className="grid h-8 w-8 place-items-center rounded-lg bg-[#f4f4f8] text-[#74768b] opacity-100 transition hover:bg-[#eceeff] hover:text-[#505cf1] sm:opacity-0 sm:group-hover:opacity-100" aria-label={`Edit ${lesson.subject}`}><Pencil size={15} /></button>
                          <button type="button" onClick={() => removeLesson(lesson)} className="grid h-8 w-8 place-items-center rounded-lg bg-[#f4f4f8] text-[#74768b] opacity-100 transition hover:bg-[#fff0ec] hover:text-[#e56e55] sm:opacity-0 sm:group-hover:opacity-100" aria-label={`Hapus ${lesson.subject}`}><Trash2 size={15} /></button>
                          <MoreHorizontal size={18} className="hidden text-[#a3a4b2] sm:block sm:group-hover:hidden" />
                        </div>
                      </motion.article>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 flex min-h-[260px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#dedee8] bg-white/55 px-6 text-center">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#eef0ff] text-[#5965f4]"><CalendarDays size={26} /></div>
                    <p className="mt-4 text-base font-extrabold text-[#34364d]">{search ? "Pelajaran tidak ditemukan" : `Jadwal ${selectedDay} masih kosong`}</p>
                    <p className="mt-1 max-w-xs text-xs font-medium leading-5 text-[#9192a3]">{search ? "Coba gunakan kata kunci lain." : "Tambahkan pelajaran pertamamu agar tidak ada kelas yang terlewat."}</p>
                    {!search && <button type="button" onClick={openNewLesson} className="mt-4 flex items-center gap-2 text-xs font-extrabold text-[#505cf1]"><Plus size={16} /> Tambah sekarang</button>}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </motion.div>
        </main>

        <button type="button" onClick={openNewLesson} className="fixed bottom-[90px] right-5 z-30 grid h-14 w-14 place-items-center rounded-2xl bg-[#5965f4] text-white shadow-[0_12px_28px_rgba(89,101,244,0.35)] transition hover:-translate-y-1 sm:hidden" aria-label="Tambah pelajaran"><Plus size={25} strokeWidth={2.7} /></button>
      </div>

      <LessonModal open={modalOpen} initialLesson={editingLesson} initialDay={selectedDay} onClose={() => { setModalOpen(false); setEditingLesson(null); }} onSave={saveLesson} />

      <AnimatePresence>
        {deletedLesson && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="fixed bottom-[96px] left-1/2 z-[70] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl bg-[#252740] px-4 py-3 text-white shadow-2xl lg:left-[calc(50%+130px)]">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10"><Trash2 size={15} /></div>
            <p className="min-w-0 flex-1 truncate text-xs font-bold">{deletedLesson.subject} dihapus</p>
            <button type="button" onClick={() => { setLessons((current) => [...current, deletedLesson]); setDeletedLesson(null); }} className="text-xs font-extrabold text-[#ffbd58] hover:text-[#ffd18a]">Urungkan</button>
            <button type="button" onClick={() => setDeletedLesson(null)} className="text-white/50 hover:text-white" aria-label="Tutup notifikasi"><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <DonationWidget />

      <section className="print-sheet" aria-label="Jadwal pelajaran mingguan untuk dicetak">
        <header className="print-header">
          <div>
            <p className="print-brand">KelasKu.</p>
            <h1>Jadwal Pelajaran</h1>
            <p>Kelas 8A | Adit Ramadhan</p>
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
          <span>Dicetak dari KelasKu</span>
          <span>{formatLongDate(new Date())}</span>
        </footer>
      </section>
    </div>
  );
}