import type {
  Opportunity,
  User,
  InvestorProfile,
  AccessRequest,
  Match,
  TokenPackage,
  TokenTransaction,
  TopUpRequest,
  WithdrawRequest,
  AdsPackage,
  AdsRequest,
  CapexListing,
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
    joinedAt: "2026-01-15",
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
    joinedAt: "2026-03-20",
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
    createdAt: "2026-10-01",
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
    createdAt: "2026-09-15",
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
    createdAt: "2026-11-01",
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
    createdAt: "2026-08-20",
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
    createdAt: "2026-07-10",
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
    createdAt: "2026-11-10",
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
    createdAt: "2026-11-10",
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
    createdAt: "2026-11-09",
  },
];

// ===========================
// Token Packages
// ===========================
export const TOKEN_PACKAGES: TokenPackage[] = [
  {
    id: "pkg-starter",
    name: "Starter",
    price: 50000,
    tokens: 20,
  },
  {
    id: "pkg-basic",
    name: "Basic",
    price: 100000,
    tokens: 50,
    isPopular: true,
  },
  {
    id: "pkg-pro",
    name: "Pro",
    price: 200000,
    tokens: 110,
  },
  {
    id: "pkg-premium",
    name: "Premium",
    price: 500000,
    tokens: 300,
  },
];

// Biaya token untuk unlock 1 ide bisnis
export const TOKEN_UNLOCK_COST = 20;

// Nilai rupiah per token (untuk estimasi withdraw founder)
export const TOKEN_RUPIAH_VALUE = 2000; // Rp 2.000 per token

// ===========================
// Mock Token Transactions (Investor user-2)
// ===========================
export const mockInvestorTransactions: TokenTransaction[] = [
  {
    id: "txn-1",
    userId: "user-2",
    type: "topup",
    amount: 50,
    description: "Top Up Paket Basic",
    createdAt: "2026-11-01T10:00:00",
    status: "completed",
  },
  {
    id: "txn-2",
    userId: "user-2",
    type: "unlock",
    amount: -20,
    description: "Akses Detail Bisnis",
    relatedOpportunityId: "opp-1",
    relatedOpportunityTitle: "EDUKITA",
    relatedUserId: "user-1",
    relatedUserName: "Dzakki N.",
    createdAt: "2026-11-05T14:30:00",
    status: "completed",
  },
  {
    id: "txn-3",
    userId: "user-2",
    type: "topup",
    amount: 110,
    description: "Top Up Paket Pro",
    createdAt: "2026-11-08T09:15:00",
    status: "completed",
  },
  {
    id: "txn-4",
    userId: "user-2",
    type: "unlock",
    amount: -20,
    description: "Akses Detail Bisnis",
    relatedOpportunityId: "opp-4",
    relatedOpportunityTitle: "FITSPACE",
    relatedUserId: "user-2",
    relatedUserName: "Budi S.",
    createdAt: "2026-11-09T16:00:00",
    status: "completed",
  },
];

// ===========================
// Mock Token Transactions (Founder user-1)
// ===========================
export const mockFounderTransactions: TokenTransaction[] = [
  {
    id: "ftxn-1",
    userId: "user-1",
    type: "receive",
    amount: 20,
    description: "Token diterima dari akses investor",
    relatedOpportunityId: "opp-1",
    relatedOpportunityTitle: "EDUKITA",
    relatedUserId: "user-2",
    relatedUserName: "Budi Santoso",
    createdAt: "2026-11-05T14:30:00",
    status: "completed",
  },
  {
    id: "ftxn-2",
    userId: "user-1",
    type: "receive",
    amount: 20,
    description: "Token diterima dari akses investor",
    relatedOpportunityId: "opp-1",
    relatedOpportunityTitle: "EDUKITA",
    relatedUserId: "user-4",
    relatedUserName: "Andi Wijaya",
    createdAt: "2026-11-07T11:20:00",
    status: "completed",
  },
  {
    id: "ftxn-3",
    userId: "user-1",
    type: "withdraw",
    amount: -20,
    description: "Withdraw token ke rekening",
    createdAt: "2026-11-10T08:00:00",
    status: "completed",
  },
];

// ===========================
// Mock Top-Up Requests (untuk Admin)
// ===========================
export const mockTopUpRequests: TopUpRequest[] = [
  {
    id: "topup-1",
    userId: "user-4",
    userName: "Andi Wijaya",
    userInitials: "AW",
    packageId: "pkg-basic",
    packageName: "Basic",
    amount: 100000,
    tokens: 50,
    status: "waiting",
    requestedAt: "2026-11-12T13:45:00",
  },
  {
    id: "topup-2",
    userId: "user-2",
    userName: "Budi Santoso",
    userInitials: "BS",
    packageId: "pkg-pro",
    packageName: "Pro",
    amount: 200000,
    tokens: 110,
    status: "confirmed",
    requestedAt: "2026-11-08T09:00:00",
    confirmedAt: "2026-11-08T09:15:00",
  },
];

// ===========================
// Mock Withdraw Requests (untuk Admin)
// ===========================
export const mockWithdrawRequests: WithdrawRequest[] = [
  {
    id: "wd-1",
    founderId: "user-1",
    founderName: "Dzakki Naufal",
    founderInitials: "DN",
    tokens: 20,
    estimatedRupiah: 40000,
    bankName: "BCA",
    accountNumber: "1234567890",
    accountName: "Dzakki Naufal",
    status: "processed",
    requestedAt: "2026-11-10T08:00:00",
    processedAt: "2026-11-10T10:30:00",
  },
];

// ===========================
// Mock Ads Packages
// ===========================
export const mockAdsPackages: AdsPackage[] = [
  {
    id: "ads-1",
    name: "Starter Boost",
    price: 99000,
    durationDays: 3,
    features: ["Tampil di posisi teratas 3 hari", "Label Sponsored", "Notifikasi ke 50+ investor"],
  },
  {
    id: "ads-2",
    name: "Pro Boost",
    price: 249000,
    durationDays: 7,
    label: "Terlaris",
    features: ["Tampil di posisi teratas 7 hari", "Label Sponsored", "Notifikasi ke 200+ investor", "Highlight warna khusus"],
  },
  {
    id: "ads-3",
    name: "Premium Boost",
    price: 499000,
    durationDays: 30,
    features: ["Tampil di posisi teratas 30 hari", "Label Sponsored", "Notifikasi ke semua investor", "Highlight + badge Premium", "Laporan performa iklan"],
  },
];

// ===========================
// Mock Ads Requests
// ===========================
export const mockAdsRequests: AdsRequest[] = [
  {
    id: "ads-req-1",
    userId: "user-1",
    userName: "Dzakki Naufal",
    userInitials: "DN",
    listingId: "opp-1",
    listingTitle: "EDUKITA",
    listingType: "idea",
    packageId: "ads-2",
    packageName: "Pro Boost",
    amount: 249000,
    durationDays: 7,
    status: "active",
    requestedAt: "2026-11-01T09:00:00",
    activatedAt: "2026-11-01T14:00:00",
    expiresAt: "2026-11-08T14:00:00",
  },
  {
    id: "ads-req-2",
    userId: "user-3",
    userName: "Andi Wijaya",
    userInitials: "AW",
    listingId: "opp-2",
    listingTitle: "PANENLOKAL",
    listingType: "idea",
    packageId: "ads-1",
    packageName: "Starter Boost",
    amount: 99000,
    durationDays: 3,
    status: "waiting",
    paymentProofNote: "Sudah transfer via BCA Mobile jam 10:15",
    requestedAt: "2026-11-12T10:00:00",
  },
];

// ===========================
// Mock Capex Listings
// ===========================
export const mockCapexListings: CapexListing[] = [
  {
    id: "capex-1",
    title: "Ruko Strategis 2 Lantai — Jalan Malioboro",
    shortDescription: "Ruko 2 lantai siap pakai di jantung kota Yogyakarta, cocok untuk bisnis retail, kafe, atau kantor.",
    description: "Ruko 2 lantai berlokasi strategis di Jalan Malioboro, Yogyakarta. Akses mudah ke transportasi umum, parkir luas, dan sekitar pusat perbelanjaan. Bangunan kondisi baik, sudah renovasi 2023. Cocok untuk bisnis retail, kafe, restoran, atau startup kantor. SHM atas nama pemilik, siap proses.",
    ownerId: "user-4",
    owner: { id: "user-4", name: "Budi S.", initials: "BS" },
    propertyType: "ruko",
    capexType: "rent",
    price: 15000000,
    location: "Yogyakarta",
    area: 120,
    sector: ["F&B", "Retail", "Kantor"],
    verificationStatus: "verified",
    facilities: ["Listrik 2200W", "Air PDAM", "WiFi siap", "Parkir", "AC"],
    createdAt: "2026-10-05",
    isAds: true,
    adsExpiresAt: "2026-11-15",
  },
  {
    id: "capex-2",
    title: "Lahan 500m² Siap Bangun — Bandung Utara",
    shortDescription: "Lahan kosong 500m² lokasi premium Bandung Utara, sertifikat SHM, cocok untuk vila atau kafe.",
    description: "Lahan kosong seluas 500m² di Bandung Utara, area Lembang. Pemandangan gunung, udara segar. IMB tersedia untuk vila/resort/kafe. Dekat wisata Tangkuban Perahu. Cocok untuk investasi properti atau bisnis hospitality.",
    ownerId: "user-5",
    owner: { id: "user-5", name: "Siti R.", initials: "SR" },
    propertyType: "land",
    capexType: "sell",
    price: 2500000000,
    location: "Bandung",
    area: 500,
    sector: ["Hospitality", "F&B", "Tourism"],
    verificationStatus: "verified",
    facilities: ["SHM", "IMB", "Akses jalan aspal", "PLN tersedia"],
    createdAt: "2026-09-20",
  },
  {
    id: "capex-3",
    title: "Gudang Industrial 800m² — Kawasan MM2100 Bekasi",
    shortDescription: "Gudang siap pakai di kawasan industri MM2100 Bekasi, akses tol terjangkau, cocok logistik/manufaktur.",
    description: "Gudang industrial seluas 800m² berlokasi di Kawasan Industri MM2100 Bekasi. Dilengkapi loading dock, tinggi plafon 8m, kapasitas listrik 33KVA. Cocok untuk perusahaan logistik, e-commerce fulfillment, atau manufaktur ringan.",
    ownerId: "user-4",
    owner: { id: "user-4", name: "Budi S.", initials: "BS" },
    propertyType: "warehouse",
    capexType: "rent",
    price: 45000000,
    location: "Jakarta",
    area: 800,
    sector: ["Logistik", "E-Commerce", "Manufaktur"],
    verificationStatus: "verified",
    facilities: ["Loading Dock", "Listrik 33KVA", "Plafon 8m", "CCTV", "Satpam 24 jam"],
    createdAt: "2026-10-15",
  },
  {
    id: "capex-4",
    title: "Kantor Coworking Space Siap Pakai — Jakarta Selatan",
    shortDescription: "Ruang kantor lantai 12, view Jakarta, siap pakai untuk startup 10-50 orang.",
    description: "Ruang kantor modern lantai 12 di gedung premium Jakarta Selatan. Sudah dilengkapi furnitur, meeting room, pantry, dan internet dedicated 100Mbps. Ideal untuk startup tech yang membutuhkan kantor profesional tanpa investasi besar.",
    ownerId: "user-5",
    owner: { id: "user-5", name: "Siti R.", initials: "SR" },
    propertyType: "office",
    capexType: "rent",
    price: 25000000,
    location: "Jakarta",
    area: 200,
    sector: ["Tech", "Startup", "Konsultan"],
    verificationStatus: "pending",
    facilities: ["Internet 100Mbps", "AC", "Meeting Room", "Pantry", "Resepsionis"],
    createdAt: "2026-11-01",
  },
  {
    id: "capex-5",
    title: "Ruko Jalan Braga Bandung — Investasi Properti",
    shortDescription: "Ruko heritage 3 lantai di Jalan Braga Bandung, ROI tinggi untuk sewa jangka pendek.",
    description: "Ruko heritage bergaya art deco di Jalan Braga Bandung. 3 lantai, total 300m². Kawasan wisata & kuliner favorit. Rental yield estimasi 8-10%/tahun. Ideal untuk investor properti atau bisnis hospitality.",
    ownerId: "user-3",
    owner: { id: "user-3", name: "Andi W.", initials: "AW" },
    propertyType: "ruko",
    capexType: "invest",
    price: 5500000000,
    location: "Bandung",
    area: 300,
    sector: ["Hospitality", "F&B", "Retail"],
    verificationStatus: "unverified",
    facilities: ["SHM", "3 Lantai", "Parkir", "Heritage Building"],
    createdAt: "2026-11-05",
  },
];
