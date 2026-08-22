import type {
  Opportunity,
  User,
  InvestorProfile,
  AccessRequest,
  Match,
} from "@/types";

// ===========================
// Mock Users
// ===========================
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Dzakki Naufal",
    role: "founder",
    initials: "DN",
    title: "Idea Founder",
    company: "EDUKITA",
    location: "Yogyakarta, Indonesia",
    bio: "Passionate educator and technologist building the future of Indonesian education.",
    isVerified: true,
    verificationBadges: [
      { type: "campus", label: "Terverifikasi Kampus", issuedBy: "UGM" },
    ],
    joinedAt: "2024-01-15",
  },
  {
    id: "user-2",
    name: "Budi Santoso",
    role: "investor",
    initials: "BS",
    title: "Managing Partner",
    company: "Nusantara Capital",
    location: "Jakarta, Indonesia",
    bio: "I am passionate about empowering the next generation of Indonesian founders who are solving real-world problems through scalable technology. With a background in early-stage operations and corporate M&A, I bring more than just capital to the table.\n\nMy investment philosophy is founder-first. I look for grit, deep market understanding, and a willingness to pivot when necessary. I typically lead rounds but am open to co-investing with trusted syndicates.",
    isVerified: true,
    verificationBadges: [
      { type: "identity", label: "Investor Terverifikasi" },
      { type: "lead_syndicate", label: "Lead Syndicate" },
    ],
    joinedAt: "2023-06-10",
  },
  {
    id: "user-3",
    name: "Siti Rahmawati",
    role: "cofounder",
    initials: "SR",
    title: "Co-Founder / Mentor",
    company: "TechBridge",
    location: "Bandung, Indonesia",
    bio: "Experienced product manager and mentor specializing in SaaS B2B solutions.",
    isVerified: true,
    verificationBadges: [
      { type: "identity", label: "Terverifikasi" },
    ],
    joinedAt: "2024-03-20",
  },
  {
    id: "user-4",
    name: "Andi Wijaya",
    role: "investor",
    initials: "AW",
    title: "Syndicate Lead",
    company: "East Ventures",
    location: "Jakarta, Indonesia",
    bio: "Early-stage investor focused on EdTech and FinTech sectors.",
    isVerified: true,
    verificationBadges: [
      { type: "identity", label: "Investor Terverifikasi" },
    ],
    joinedAt: "2023-11-05",
  },
];

// ===========================
// Mock Opportunities
// ===========================
export const mockOpportunities: Opportunity[] = [
  {
    id: "opp-1",
    title: "EDUKITA",
    shortDescription: "Platform pembelajaran adaptif berbasis AI untuk siswa SD-SMA di Indonesia.",
    description:
      "EDUKITA adalah platform pendidikan berbasis kecerdasan buatan yang mempersonalisasi pengalaman belajar untuk setiap siswa. Kami menggunakan adaptive learning algorithms untuk mengidentifikasi celah pengetahuan dan memberikan konten yang tepat sasaran. Platform kami sudah digunakan oleh lebih dari 5.000 siswa di Yogyakarta dan Jawa Tengah.",
    sector: ["EdTech", "AI"],
    stage: "seed",
    targetFunding: 500000000,
    location: "Yogyakarta",
    founderId: "user-1",
    founder: { id: "user-1", name: "Dzakki N.", initials: "DN" },
    seekingRoles: ["investor"],
    verificationStatus: "verified",
    matchScore: 95,
    createdAt: "2024-10-01",
    traction: "5.000+ pengguna aktif, 3 sekolah mitra",
    teamSize: 4,
  },
  {
    id: "opp-2",
    title: "PANENLOKAL",
    shortDescription: "Supply chain management menghubungkan petani lokal dengan restoran dan retailer premium.",
    description:
      "PANENLOKAL menyelesaikan masalah inefisiensi distribusi hasil tani di Indonesia. Platform kami menghubungkan petani langsung dengan pembeli premium, memangkas rantai distribusi hingga 60% dan meningkatkan pendapatan petani rata-rata 40%.",
    sector: ["AgriTech", "Marketplace"],
    stage: "seed",
    targetFunding: 750000000,
    location: "Bandung",
    founderId: "user-3",
    founder: { id: "user-3", name: "Siti R.", initials: "SR" },
    seekingRoles: ["investor", "mentor"],
    verificationStatus: "verified",
    matchScore: 88,
    createdAt: "2024-09-15",
    traction: "150+ petani mitra, Rp 500jt GMV",
    teamSize: 6,
  },
  {
    id: "opp-3",
    title: "KOPI LOKAL",
    shortDescription: "Brand kopi specialty Indonesia dengan model subscription dan online-to-offline.",
    description:
      "KOPI LOKAL membangun ekosistem kopi specialty Indonesia yang berkelanjutan. Kami bekerja langsung dengan petani kopi di Aceh, Toraja, dan Flores, menciptakan rantai pasokan yang transparan dan menguntungkan semua pihak.",
    sector: ["F&B", "D2C"],
    stage: "early_stage",
    targetFunding: 300000000,
    location: "Jakarta",
    founderId: "user-4",
    founder: { id: "user-4", name: "Andi W.", initials: "AW" },
    seekingRoles: ["investor", "cofounder"],
    verificationStatus: "pending",
    matchScore: 72,
    createdAt: "2024-11-01",
    teamSize: 3,
  },
  {
    id: "opp-4",
    title: "FITSPACE",
    shortDescription: "Aplikasi booking fasilitas olahraga dan wellness on-demand untuk urban millennial.",
    description:
      "FITSPACE adalah super-app untuk gaya hidup aktif. Pengguna dapat memesan lapangan badminton, studio yoga, kolam renang, dan personal trainer dalam satu platform. Kami bermitra dengan 200+ venue di 5 kota besar Indonesia.",
    sector: ["HealthTech", "Lifestyle"],
    stage: "seed",
    targetFunding: 450000000,
    location: "Surabaya",
    founderId: "user-2",
    founder: { id: "user-2", name: "Budi S.", initials: "BS" },
    seekingRoles: ["investor", "cofounder"],
    verificationStatus: "verified",
    matchScore: 85,
    createdAt: "2024-08-20",
    traction: "200+ venue mitra, 15.000 MAU",
    teamSize: 8,
  },
  {
    id: "opp-5",
    title: "AgriSmart: IoT untuk Efisiensi Irigasi Sawah",
    shortDescription: "Sistem sensor tanah terjangkau yang mengoptimalisasi irigasi, menghemat air hingga 40% untuk petani kecil.",
    description:
      "AgriSmart mengembangkan solusi IoT terjangkau untuk petani kecil di Indonesia. Sensor kami memantau kelembaban tanah, cuaca, dan kebutuhan nutrisi tanaman secara real-time, membantu petani menghemat air hingga 40% dan meningkatkan hasil panen.",
    sector: ["AgriTech", "IoT"],
    stage: "seed",
    targetFunding: 500000000,
    location: "Bandung",
    founderId: "user-3",
    founder: { id: "user-3", name: "Budi S.", initials: "BS" },
    seekingRoles: ["investor"],
    verificationStatus: "verified",
    matchScore: 95,
    createdAt: "2024-07-10",
    traction: "1.000+ petani terdaftar, 70% tingkat retensi",
    teamSize: 5,
  },
  {
    id: "opp-6",
    title: "PayMicro: Solusi Pembayaran untuk UMKM",
    shortDescription: "Aplikasi kasir dan pembayaran digital terintegrasi khusus untuk UMKM Indonesia.",
    description:
      "PayMicro menyediakan solusi pembayaran digital lengkap untuk usaha mikro dan kecil. Dari kasir digital, manajemen inventori, hingga akses modal kerja terintegrasi dalam satu aplikasi yang mudah digunakan.",
    sector: ["FinTech", "SaaS"],
    stage: "ideation",
    targetFunding: 150000000,
    location: "Jakarta",
    founderId: "user-1",
    founder: { id: "user-1", name: "Siti R.", initials: "SR" },
    seekingRoles: ["cofounder", "investor"],
    verificationStatus: "unverified",
    matchScore: 78,
    createdAt: "2024-11-10",
    teamSize: 2,
  },
];

// ===========================
// Mock Investor Profile
// ===========================
export const mockBudiSantoso: InvestorProfile = {
  id: "user-2",
  name: "Budi Santoso",
  role: "investor",
  initials: "BS",
  title: "Managing Partner at Nusantara Capital | Tech & Education Enthusiast",
  company: "Nusantara Capital",
  location: "Jakarta, Indonesia",
  bio: "I am passionate about empowering the next generation of Indonesian founders who are solving real-world problems through scalable technology. With a background in early-stage operations and corporate M&A, I bring more than just capital to the table.\n\nMy investment philosophy is founder-first. I look for grit, deep market understanding, and a willingness to pivot when necessary. I typically lead rounds but am open to co-investing with trusted syndicates.",
  isVerified: true,
  verificationBadges: [
    { type: "identity", label: "Investor Terverifikasi" },
    { type: "lead_syndicate", label: "Lead Syndicate" },
  ],
  joinedAt: "2023-06-10",
  preferredSectors: ["EdTech", "SaaS", "F&B Innovation"],
  capitalRangeMin: 100000000,
  capitalRangeMax: 500000000,
  preferredStages: ["pre_seed", "seed"],
  yearsInvesting: 10,
  typicalResponseHours: 45,
  investmentPhilosophy:
    "Founder-first. I look for grit, deep market understanding, and a willingness to pivot when necessary.",
  activeInvestments: 12,
  trackRecord: [
    {
      id: "tr-1",
      companyName: "PinterAcademy",
      sector: "B2B SaaS for Universities",
      stage: "Series A",
      round: "Follow-on",
    },
    {
      id: "tr-2",
      companyName: "AgriKultur F&B",
      sector: "Supply Chain Optimization",
      stage: "Seed",
      round: "Exited",
    },
  ],
  affiliations: [
    {
      id: "aff-1",
      organizationName: "ANGIN Network",
      role: "Verified Member since 2021",
      isVerified: true,
    },
    {
      id: "aff-2",
      organizationName: "East Ventures Alumni",
      role: "Former EIR",
      isVerified: true,
    },
    {
      id: "aff-3",
      organizationName: "UI Incubator",
      role: "Official Mentor",
      isVerified: false,
    },
  ],
};

// ===========================
// Mock Access Requests
// ===========================
export const mockAccessRequests: AccessRequest[] = [
  {
    id: "req-1",
    opportunityId: "opp-1",
    opportunityTitle: "Project Nusantara AI",
    requesterId: "user-2",
    requester: {
      id: "user-2",
      name: "Alpha Ventures Indonesia",
      initials: "AV",
      title: "Individual Investor",
      isVerified: true,
      verificationBadges: [
        { type: "identity", label: "Investor Terverifikasi" },
        { type: "lead_syndicate", label: "High Match" },
      ],
    },
    status: "pending",
    message:
      "Tertarik dengan model bisnis EdTech Anda. Ingin melihat proyeksi finansial?",
    matchScore: 94,
    requestedAt: "2 jam yang lalu",
    isHighMatch: true,
    requesterType: "investor",
  },
  {
    id: "req-2",
    opportunityId: "opp-1",
    opportunityTitle: "GreenTech Solutions",
    requesterId: "user-3",
    requester: {
      id: "user-3",
      name: "Siti Rahmawati",
      initials: "SR",
      title: "Co-Founder Candidate",
      isVerified: true,
      verificationBadges: [
        { type: "identity", label: "Skill Match" },
      ],
    },
    status: "pending",
    message:
      "Saya memiliki pengalaman 5 tahun di tech. Ingin membantu pengembangan platform?",
    matchScore: 87,
    requestedAt: "1 hari yang lalu",
    isHighMatch: false,
    requesterType: "cofounder",
  },
  {
    id: "req-3",
    opportunityId: "opp-1",
    opportunityTitle: "Project Nusantara AI",
    requesterId: "user-4",
    requester: {
      id: "user-4",
      name: "Andi Wijaya",
      initials: "AW",
      title: "Syndicate Lead",
      isVerified: true,
      verificationBadges: [
        { type: "identity", label: "Akses Diberikan" },
      ],
    },
    status: "approved",
    message: "Tertarik untuk investasi tahap awal.",
    matchScore: 76,
    requestedAt: "3 hari yang lalu",
    isHighMatch: false,
    requesterType: "investor",
  },
];

// ===========================
// Mock Matches
// ===========================
export const mockMatches: Match[] = [
  {
    id: "match-1",
    userId: "user-1",
    targetId: "user-2",
    target: {
      id: "user-2",
      name: "Budi Santoso",
      initials: "BS",
      title: "Managing Partner",
      company: "Nusantara Ventures",
    },
    matchScore: 92,
    aiAnalysis:
      "Budi tertarik pada sektor EdTech dan memiliki rentang modal yang sesuai dengan EDUKITA. Rekam jejak investasinya di startup pendidikan tahap awal (Seed) sangat relevan.",
    status: "new",
    matchType: "investor",
    createdAt: "2024-11-10",
  },
  {
    id: "match-2",
    userId: "user-1",
    targetId: "user-3",
    target: {
      id: "user-3",
      name: "Siti Rahma",
      initials: "SR",
      title: "Angel Investor",
      company: undefined,
    },
    matchScore: 76,
    aiAnalysis: "Angel investor, fokus pada SaaS B2B.",
    status: "pending",
    matchType: "investor",
    createdAt: "2024-11-09",
  },
];
