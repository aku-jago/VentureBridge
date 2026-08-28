"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { useToken } from "@/contexts/TokenContext";
import { TokenPackage, TokenTransaction } from "@/types";
import {
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  Clock,
  X,
  Wallet,
  TrendingUp,
  Users,
  Plus,
  Copy,
  Star,
  Zap,
} from "lucide-react";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function TxnRow({ txn }: { txn: TokenTransaction }) {
  const isPositive = txn.amount > 0;
  const isPending = txn.status === "pending";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid #f3f4f6" }}>
      <div style={{ width: 38, height: 38, borderRadius: "50%", background: isPending ? "#f3f4f6" : isPositive ? "#f0fdf4" : "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {isPending ? <Clock size={18} color="#9ca3af" /> : isPositive ? <ArrowDownLeft size={18} color="#16a34a" /> : <ArrowUpRight size={18} color="#d97706" />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{txn.description}</div>
        {txn.relatedUserName && <div style={{ fontSize: 12, color: "#6b7280" }}>dari {txn.relatedUserName} • {txn.relatedOpportunityTitle}</div>}
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{formatDate(txn.createdAt)}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: isPending ? "#9ca3af" : isPositive ? "#16a34a" : "#d97706" }}>
          {isPositive ? "+" : ""}{txn.amount} token
        </div>
        {isPending && <div style={{ fontSize: 11, color: "#9ca3af" }}>Menunggu</div>}
      </div>
    </div>
  );
}

export default function FounderTokensPage() {
  const {
    founderBalance,
    investorBalance,
    founderTransactions,
    withdrawRequests,
    requestWithdraw,
    tokenRupiahValue,
    tokenPackages,
    requestTopUp,
  } = useToken();

  // Withdraw Modal state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawTokens, setWithdrawTokens] = useState<number | "">(founderBalance || 20);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [withdrawStep, setWithdrawStep] = useState<"form" | "done">("form");
  const [withdrawMsg, setWithdrawMsg] = useState("");
  const [withdrawError, setWithdrawError] = useState("");

  // Top Up Modal state
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<TokenPackage | null>(null);
  const [topUpStep, setTopUpStep] = useState<"select" | "payment" | "done">("select");
  const [paymentNote, setPaymentNote] = useState("");
  const [copied, setCopied] = useState(false);

  const BANK = "BCA";
  const ACCOUNT = "1234567890";
  const HOLDER = "Weaven Indonesia";

  const totalEarned = founderTransactions.filter(t => t.type === "receive").reduce((s, t) => s + t.amount, 0);
  const totalWithdrawn = Math.abs(founderTransactions.filter(t => t.type === "withdraw" || t.type === "withdraw_pending").reduce((s, t) => s + t.amount, 0));
  const uniqueInvestors = new Set(founderTransactions.filter(t => t.type === "receive").map(t => t.relatedUserId)).size;

  function handleWithdrawSubmit(e: React.FormEvent) {
    e.preventDefault();
    setWithdrawError("");
    if (!withdrawTokens || Number(withdrawTokens) <= 0) { setWithdrawError("Masukkan jumlah token yang valid."); return; }
    if (Number(withdrawTokens) > founderBalance) { setWithdrawError("Saldo token tidak mencukupi."); return; }
    if (!bankName) { setWithdrawError("Masukkan nama bank."); return; }
    if (!accountNumber) { setWithdrawError("Masukkan nomor rekening."); return; }
    if (!accountName) { setWithdrawError("Masukkan nama pemilik rekening."); return; }
    const result = requestWithdraw(Number(withdrawTokens), bankName, accountNumber, accountName);
    setWithdrawMsg(result.message);
    if (result.success) setWithdrawStep("done");
    else setWithdrawError(result.message);
  }

  function closeWithdrawModal() {
    setShowWithdrawModal(false);
    setWithdrawStep("form");
    setBankName(""); setAccountNumber(""); setAccountName("");
    setWithdrawTokens(founderBalance); setWithdrawError(""); setWithdrawMsg("");
  }

  function openTopUpModal() {
    setTopUpStep("select");
    setSelectedPkg(null);
    setPaymentNote("");
    setShowTopUpModal(true);
  }

  function closeTopUpModal() {
    setShowTopUpModal(false);
    setSelectedPkg(null);
    setTopUpStep("select");
  }

  function handleCopy() {
    navigator.clipboard.writeText(ACCOUNT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleTopUpSubmit() {
    if (!selectedPkg) return;
    requestTopUp(selectedPkg, paymentNote);
    setTopUpStep("done");
  }

  const pendingWithdraws = withdrawRequests.filter(w => w.status === "pending");

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <main className="dashboard-content">
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Token Wallet</h1>
          <p style={{ fontSize: 14, color: "#6b7280" }}>
            Kelola saldo token Anda untuk membuka ide bisnis (Top Up) atau mencairkan penghasilan (Withdraw).
          </p>
        </div>

        {/* Hero Card with dual Top Up & Withdraw actions */}
        <div style={{ background: "linear-gradient(135deg, #065f46 0%, #0d9488 100%)", borderRadius: 20, padding: "32px", marginBottom: 28, color: "#fff", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          <div style={{ position: "absolute", bottom: -20, right: 60, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Coins size={20} color="rgba(255,255,255,0.8)" />
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>Saldo Token Anda</span>
              </div>
              <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1 }}>{founderBalance || investorBalance || 0}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 6 }}>
                token ≈ {formatRupiah((founderBalance || investorBalance || 0) * tokenRupiahValue)}
              </div>
            </div>

            {/* Top Up & Withdraw Action Buttons */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={openTopUpModal}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "12px 20px",
                  background: "#fff",
                  border: "none",
                  borderRadius: 12,
                  color: "#065f46",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                <Plus size={16} /> Top Up Token
              </button>

              <button
                onClick={() => setShowWithdrawModal(true)}
                disabled={founderBalance === 0}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "12px 20px",
                  background: founderBalance > 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 12,
                  color: founderBalance > 0 ? "#fff" : "rgba(255,255,255,0.4)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: founderBalance > 0 ? "pointer" : "not-allowed",
                }}
              >
                <Wallet size={16} /> Withdraw Token
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 24, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            {[
              { label: "Total Diterima", value: totalEarned + " token", icon: <TrendingUp size={14} /> },
              { label: "Total Ditarik", value: totalWithdrawn + " token", icon: <ArrowUpRight size={14} /> },
              { label: "Investor Mengakses", value: uniqueInvestors + " investor", icon: <Users size={14} /> },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>{s.icon}{s.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {pendingWithdraws.length > 0 && (
          <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 12, padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <Clock size={20} color="#d97706" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>{pendingWithdraws.length} permintaan withdraw sedang diproses</div>
              <div style={{ fontSize: 12, color: "#78350f" }}>Dana akan dikirim ke rekening kamu dalam 1-3 hari kerja.</div>
            </div>
          </div>
        )}

        {/* Packages Preview Grid */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Paket Top Up Token</h2>
            <button onClick={openTopUpModal} style={{ fontSize: 13, fontWeight: 700, color: "#0d9488", background: "none", border: "none", cursor: "pointer" }}>
              Beli Sekarang →
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            {tokenPackages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={openTopUpModal}
                style={{
                  background: "#fff",
                  border: pkg.isPopular ? "2px solid #0d9488" : "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: "16px",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.15s ease",
                }}
              >
                {pkg.isPopular && (
                  <div style={{ position: "absolute", top: -10, right: 14, background: "#0d9488", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 999 }}>
                    Terlaris
                  </div>
                )}
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{pkg.name}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#0d9488", marginBottom: 4 }}>{pkg.tokens} Token</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>{formatRupiah(pkg.price)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="card" style={{ background: "#fff", borderRadius: 16, padding: "24px", border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Riwayat Transaksi Token</h2>
          {founderTransactions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af", fontSize: 14 }}>Belum ada transaksi token.</div>
          ) : (
            founderTransactions.map(txn => <TxnRow key={txn.id} txn={txn} />)
          )}
        </div>
      </main>

      {/* TOP UP MODAL */}
      {showTopUpModal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={(e) => { if (e.target === e.currentTarget) closeTopUpModal(); }}
        >
          <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 500, padding: "24px 28px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
                {topUpStep === "select" ? "Pilih Paket Top Up Token" : topUpStep === "payment" ? "Instruksi Pembayaran" : "Permintaan Terkirim!"}
              </div>
              <button onClick={closeTopUpModal} style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={16} />
              </button>
            </div>

            {topUpStep === "select" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {tokenPackages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => { setSelectedPkg(pkg); setTopUpStep("payment"); }}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 18px",
                      borderRadius: 12,
                      border: pkg.isPopular ? "2px solid #0d9488" : "1px solid #e5e7eb",
                      background: "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{pkg.name}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>Dapatkan <strong>{pkg.tokens} Token</strong></div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#0d9488" }}>
                      {formatRupiah(pkg.price)}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {topUpStep === "payment" && selectedPkg && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>Paket yang Dipilih:</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginTop: 2 }}>
                    {selectedPkg.name} — {selectedPkg.tokens} Token ({formatRupiah(selectedPkg.price)})
                  </div>
                </div>

                <div style={{ background: "linear-gradient(135deg, #111827, #1e293b)", color: "#fff", padding: "18px 20px", borderRadius: 14 }}>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>Transfer ke Rekening Resmi:</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Bank {BANK}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "6px 0" }}>
                    <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "0.05em" }}>{ACCOUNT}</div>
                    <button
                      type="button"
                      onClick={handleCopy}
                      style={{ padding: "6px 12px", background: copied ? "#16a34a" : "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                    >
                      {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
                      {copied ? "Tersalin!" : "Salin"}
                    </button>
                  </div>
                  <div style={{ fontSize: 12, color: "#cbd5e1" }}>a.n. {HOLDER}</div>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
                    Catatan Bukti Transfer (opsional):
                  </label>
                  <textarea
                    rows={2}
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    placeholder="Contoh: Sudah transfer via BCA Mobile jam 14:30..."
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button type="button" onClick={() => setTopUpStep("select")} style={{ flex: 1, padding: "11px", background: "#f3f4f6", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    Kembali
                  </button>
                  <button type="button" onClick={handleTopUpSubmit} style={{ flex: 2, padding: "11px", background: "#0d9488", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    Sudah Transfer — Kirim
                  </button>
                </div>
              </div>
            )}

            {topUpStep === "done" && (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <CheckCircle size={48} color="#16a34a" style={{ margin: "0 auto 12px" }} />
                <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 6 }}>
                  Permintaan Top Up Berhasil Dikirim!
                </div>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5, marginBottom: 20 }}>
                  Admin kami akan segera memverifikasi transfer Anda. Token akan masuk ke saldo Anda secara otomatis setelah dikonfirmasi.
                </p>
                <button onClick={closeTopUpModal} style={{ padding: "10px 24px", background: "#0d9488", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Selesai
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL */}
      {showWithdrawModal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={(e) => { if (e.target === e.currentTarget) closeWithdrawModal(); }}
        >
          <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480, padding: "24px 28px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
                {withdrawStep === "form" ? "Tarik Saldo Token (Withdraw)" : "Permintaan Terkirim"}
              </div>
              <button onClick={closeWithdrawModal} style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={16} />
              </button>
            </div>

            {withdrawStep === "form" ? (
              <form onSubmit={handleWithdrawSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {withdrawError && (
                  <div style={{ padding: "10px 12px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, fontSize: 13, color: "#dc2626" }}>
                    ⚠️ {withdrawError}
                  </div>
                )}

                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 5 }}>
                    Jumlah Token yang Ingin Ditarik (Maks: {founderBalance})
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={founderBalance}
                    value={withdrawTokens}
                    onChange={(e) => setWithdrawTokens(e.target.value === "" ? "" : Number(e.target.value))}
                    required
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                  <div style={{ fontSize: 12, color: "#0d9488", fontWeight: 600, marginTop: 4 }}>
                    Estimasi yang didapatkan: {formatRupiah((Number(withdrawTokens) || 0) * tokenRupiahValue)}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 5 }}>
                    Nama Bank Tujuan
                  </label>
                  <input
                    type="text"
                    placeholder="BCA / Mandiri / BNI / BRI / GoPay"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 5 }}>
                    Nomor Rekening / E-Wallet
                  </label>
                  <input
                    type="text"
                    placeholder="1234567890"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 5 }}>
                    Nama Pemilik Rekening
                  </label>
                  <input
                    type="text"
                    placeholder="Sesuai buku tabungan"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    required
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                <button
                  type="submit"
                  style={{ marginTop: 8, padding: "12px", background: "linear-gradient(135deg, #065f46, #0d9488)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                >
                  Ajukan Penarikan Dana
                </button>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <CheckCircle size={48} color="#16a34a" style={{ margin: "0 auto 12px" }} />
                <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 6 }}>
                  {withdrawMsg || "Permintaan Withdraw Berhasil Diajukan!"}
                </div>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5, marginBottom: 20 }}>
                  Admin akan mentransfer dana ke rekening Anda dalam 1-3 hari kerja.
                </p>
                <button onClick={closeWithdrawModal} style={{ padding: "10px 24px", background: "#065f46", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
