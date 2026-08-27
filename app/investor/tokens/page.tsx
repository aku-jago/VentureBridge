
"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { useToken } from "@/contexts/TokenContext";
import { TokenPackage, TokenTransaction } from "@/types";
import {
  Coins,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CheckCircle,
  X,
  Copy,
  Zap,
  Star,
} from "lucide-react";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function TransactionRow({ txn }: { txn: TokenTransaction }) {
  const isPositive = txn.amount > 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid #f3f4f6" }}>
      <div style={{ width: 38, height: 38, borderRadius: "50%", background: isPositive ? "#f0fdf4" : "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {isPositive ? <ArrowDownLeft size={18} color="#16a34a" /> : <ArrowUpRight size={18} color="#d97706" />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{txn.description}</div>
        {txn.relatedOpportunityTitle && <div style={{ fontSize: 12, color: "#6b7280" }}>{txn.relatedOpportunityTitle}</div>}
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{formatDate(txn.createdAt)}</div>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: isPositive ? "#16a34a" : "#d97706" }}>
        {isPositive ? "+" : ""}{txn.amount} token
      </div>
    </div>
  );
}

export default function InvestorTokensPage() {
  const { tokenPackages, investorBalance, investorTransactions, pendingTopUps, requestTopUp, tokenUnlockCost } = useToken();
  const [showModal, setShowModal] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<TokenPackage | null>(null);
  const [step, setStep] = useState<"select" | "payment" | "done">("select");
  const [paymentNote, setPaymentNote] = useState("");
  const [copied, setCopied] = useState(false);

  const BANK = "BCA";
  const ACCOUNT = "1234567890";
  const HOLDER = "VentureBridge Indonesia";

  function openModal() { setStep("select"); setSelectedPkg(null); setPaymentNote(""); setShowModal(true); }
  function closeModal() { setShowModal(false); setSelectedPkg(null); setStep("select"); }
  function handleCopy() { navigator.clipboard.writeText(ACCOUNT); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  function handleSubmit() { if (!selectedPkg) return; requestTopUp(selectedPkg, paymentNote); setStep("done"); }

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <main className="dashboard-content">
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Token Wallet</h1>
          <p style={{ fontSize: 14, color: "#6b7280" }}>Kelola saldo token untuk mengakses detail ide bisnis founder.</p>
        </div>

        {/* Balance Hero Card */}
        <div style={{ background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)", borderRadius: 20, padding: "32px", marginBottom: 28, color: "#fff", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          <div style={{ position: "absolute", bottom: -20, right: 60, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Coins size={20} color="rgba(255,255,255,0.8)" />
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>Saldo Token Saya</span>
              </div>
              <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1 }}>{investorBalance}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 6 }}>token tersedia • biaya akses: {tokenUnlockCost} token / ide bisnis</div>
            </div>
            <button onClick={openModal} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              <Plus size={16} /> Top Up Token
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 24, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            {[
              { label: "Total Top Up", value: investorTransactions.filter(t => t.type === "topup").reduce((s, t) => s + t.amount, 0) + " token" },
              { label: "Ide Diakses", value: investorTransactions.filter(t => t.type === "unlock").length + " bisnis" },
              { label: "Token Digunakan", value: Math.abs(investorTransactions.filter(t => t.type === "unlock").reduce((s, t) => s + t.amount, 0)) + " token" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {pendingTopUps.length > 0 && (
          <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 12, padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <Clock size={20} color="#d97706" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>{pendingTopUps.length} top up menunggu konfirmasi admin</div>
              <div style={{ fontSize: 12, color: "#78350f" }}>Token akan ditambahkan setelah pembayaran dikonfirmasi.</div>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Packages */}
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Paket Top Up Token</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {tokenPackages.map(pkg => (
                <div key={pkg.id} onClick={() => { setSelectedPkg(pkg); setShowModal(true); setStep("select"); }}
                  style={{ background: "#fff", border: pkg.isPopular ? "2px solid #2563eb" : "1px solid #e5e7eb", borderRadius: 14, padding: "16px 20px", cursor: "pointer", position: "relative", transition: "box-shadow 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.12)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                >
                  {pkg.isPopular && (
                    <div style={{ position: "absolute", top: -10, right: 16, background: "#2563eb", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 999, display: "flex", alignItems: "center", gap: 4 }}>
                      <Star size={9} /> POPULER
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{pkg.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                        <Coins size={14} color="#7c3aed" />
                        <span style={{ fontSize: 22, fontWeight: 800, color: "#7c3aed" }}>{pkg.tokens}</span>
                        <span style={{ fontSize: 13, color: "#6b7280" }}>token</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{formatRupiah(pkg.price)}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{formatRupiah(pkg.price / pkg.tokens)}/token</div>
                      <span style={{ display: "inline-block", marginTop: 8, padding: "5px 12px", background: "#eff6ff", color: "#2563eb", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Beli →</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
                    Bisa akses <strong>{Math.floor(pkg.tokens / tokenUnlockCost)} ide bisnis</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions */}
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Riwayat Transaksi</h2>
            <div className="card" style={{ padding: "8px 20px" }}>
              {investorTransactions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af", fontSize: 14 }}>Belum ada transaksi</div>
              ) : (
                investorTransactions.map(txn => <TransactionRow key={txn.id} txn={txn} />)
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24, backdropFilter: "blur(4px)" }}
          onClick={e => e.target === e.currentTarget && closeModal()}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px", width: "100%", maxWidth: 480, boxShadow: "0 8px 40px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
                {step === "select" ? "Pilih Paket Token" : step === "payment" ? "Instruksi Pembayaran" : "Permintaan Terkirim!"}
              </h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={20} /></button>
            </div>

            {step === "select" && (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  {tokenPackages.map(pkg => (
                    <div key={pkg.id} onClick={() => setSelectedPkg(pkg)}
                      style={{ border: selectedPkg?.id === pkg.id ? "2px solid #2563eb" : "1px solid #e5e7eb", borderRadius: 12, padding: "14px 16px", cursor: "pointer", background: selectedPkg?.id === pkg.id ? "#eff6ff" : "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.15s" }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                          {pkg.name} — {pkg.tokens} token
                          {pkg.isPopular && <span style={{ marginLeft: 8, fontSize: 10, background: "#2563eb", color: "#fff", padding: "1px 6px", borderRadius: 4 }}>POPULER</span>}
                        </div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>Akses {Math.floor(pkg.tokens / tokenUnlockCost)} ide bisnis</div>
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>{formatRupiah(pkg.price)}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep("payment")} disabled={!selectedPkg}
                  style={{ width: "100%", padding: "12px", background: selectedPkg ? "#2563eb" : "#e5e7eb", color: selectedPkg ? "#fff" : "#9ca3af", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: selectedPkg ? "pointer" : "not-allowed" }}>
                  Lanjut ke Pembayaran
                </button>
              </>
            )}

            {step === "payment" && selectedPkg && (
              <>
                <div style={{ background: "#f8faff", border: "1px solid #bfdbfe", borderRadius: 14, padding: "20px", marginBottom: 20 }}>
                  <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>Transfer ke rekening berikut:</div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>Bank</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{BANK}</div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>No. Rekening</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#2563eb", letterSpacing: "0.05em" }}>{ACCOUNT}</div>
                      <button onClick={handleCopy} style={{ background: copied ? "#f0fdf4" : "#eff6ff", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: copied ? "#16a34a" : "#2563eb" }}>
                        {copied ? <CheckCircle size={12} /> : <Copy size={12} />} {copied ? "Tersalin!" : "Salin"}
                      </button>
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>Atas Nama</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{HOLDER}</div>
                  </div>
                  <div style={{ background: "#1e40af", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>Jumlah Transfer</div>
                    <div style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>{formatRupiah(selectedPkg.price)}</div>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Catatan Bukti Pembayaran (opsional)</label>
                  <textarea value={paymentNote} onChange={e => setPaymentNote(e.target.value)}
                    placeholder="Contoh: Transfer via BCA Mobile jam 14:30..."
                    rows={3}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#111827", resize: "none", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>

                <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 10, padding: "12px 14px", marginBottom: 20, fontSize: 12, color: "#78350f", lineHeight: 1.5 }}>
                  <strong>⏱ Proses konfirmasi:</strong> Admin akan memverifikasi pembayaranmu dalam 1×24 jam kerja.
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setStep("select")} style={{ flex: 1, padding: "12px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Kembali</button>
                  <button onClick={handleSubmit} style={{ flex: 2, padding: "12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Zap size={16} /> Sudah Transfer, Konfirmasi!
                  </button>
                </div>
              </>
            )}

            {step === "done" && selectedPkg && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ width: 72, height: 72, background: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <CheckCircle size={36} color="#16a34a" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Permintaan Top Up Terkirim!</h3>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, marginBottom: 24 }}>
                  Permintaan top up <strong>{selectedPkg.tokens} token</strong> ({formatRupiah(selectedPkg.price)}) telah diterima.
                  Token akan ditambahkan setelah admin mengkonfirmasi pembayaran.
                </p>
                <button onClick={closeModal} style={{ padding: "12px 32px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Tutup</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

