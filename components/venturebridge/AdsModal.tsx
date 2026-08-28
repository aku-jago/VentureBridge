"use client";

import { useState } from "react";
import { X, Zap, CheckCircle, Copy } from "lucide-react";
import { mockAdsPackages } from "@/data/mock";
import { useAds } from "@/contexts/AdsContext";
import { useAuth } from "@/contexts/AuthContext";
import type { AdsPackage } from "@/types";

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

interface AdsModalProps {
  listingId: string;
  listingTitle: string;
  listingType: "idea" | "capex";
  onClose: () => void;
}

export function AdsModal({ listingId, listingTitle, listingType, onClose }: AdsModalProps) {
  const { user } = useAuth();
  const { submitAdsRequest } = useAds();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPkg, setSelectedPkg] = useState<AdsPackage | null>(null);
  const [paymentNote, setPaymentNote] = useState("");
  const [copied, setCopied] = useState(false);

  const ADMIN_BANK = { bank: "BCA", number: "1234567890", holder: "Weaven Indonesia" };

  function handleSelectPkg(pkg: AdsPackage) {
    setSelectedPkg(pkg);
    setStep(2);
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleSubmit() {
    if (!selectedPkg || !user) return;
    submitAdsRequest({
      userId: user.id ?? "user-1",
      userName: user.name ?? "User",
      userInitials: user.initials ?? "U",
      listingId,
      listingTitle,
      listingType,
      packageId: selectedPkg.id,
      packageName: selectedPkg.name,
      amount: selectedPkg.price,
      durationDays: selectedPkg.durationDays,
      paymentProofNote: paymentNote,
    });
    setStep(3);
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
        {/* Header */}
        <div style={{ padding: "24px 28px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #7c3aed, #2563eb)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Boost Listing</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>📌 {listingTitle}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, background: "#f3f4f6", border: "none", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} color="#374151" />
          </button>
        </div>

        {/* Step indicator */}
        <div style={{ padding: "16px 28px", display: "flex", gap: 6, alignItems: "center" }}>
          {["Pilih Paket", "Pembayaran", "Selesai"].map((label, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700,
                background: step > i + 1 ? "#7c3aed" : step === i + 1 ? "#7c3aed" : "#e2e8f0",
                color: step >= i + 1 ? "#fff" : "#94a3b8",
              }}>{i + 1}</div>
              <span style={{ fontSize: 12, color: step === i + 1 ? "#0f172a" : "#94a3b8", fontWeight: step === i + 1 ? 600 : 400 }}>{label}</span>
              {i < 2 && <div style={{ width: 20, height: 1, background: "#e2e8f0", margin: "0 4px" }} />}
            </div>
          ))}
        </div>

        <div style={{ padding: "8px 28px 28px" }}>
          {/* STEP 1: Choose Package */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>
                Pilih paket ads untuk mendorong listing <strong>{listingTitle}</strong> ke posisi teratas.
              </p>
              {mockAdsPackages.map((pkg) => (
                <button key={pkg.id} onClick={() => handleSelectPkg(pkg)}
                  style={{
                    background: "#fff", border: pkg.label ? "2px solid #7c3aed" : "2px solid #e2e8f0", borderRadius: 16, padding: "18px 20px", cursor: "pointer", textAlign: "left", position: "relative", transition: "all 0.15s",
                  }}
                >
                  {pkg.label && (
                    <div style={{ position: "absolute", top: -1, right: 16, background: "linear-gradient(135deg,#7c3aed,#2563eb)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 10px", borderRadius: "0 0 8px 8px" }}>
                      {pkg.label}
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{pkg.name}</div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: "#7c3aed" }}>{formatRupiah(pkg.price)}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "right" }}>{pkg.durationDays} hari</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {pkg.features.map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#374151" }}>
                        <CheckCircle size={13} color="#7c3aed" />
                        {f}
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 2: Payment */}
          {step === 2 && selectedPkg && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "#f5f3ff", border: "1px solid #e9d5ff", borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600, marginBottom: 8 }}>Ringkasan</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 14, color: "#374151" }}>{selectedPkg.name} ({selectedPkg.durationDays} hari)</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#7c3aed" }}>{formatRupiah(selectedPkg.price)}</span>
                </div>
              </div>

              <div style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b)", borderRadius: 16, padding: "20px" }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 12, fontWeight: 600 }}>Transfer ke Rekening</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Bank</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{ADMIN_BANK.bank}</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Nomor Rekening</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "0.05em" }}>{ADMIN_BANK.number}</div>
                  </div>
                  <button onClick={() => handleCopy(ADMIN_BANK.number)}
                    style={{ background: copied ? "#16a34a" : "rgba(255,255,255,0.12)", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                    {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
                    {copied ? "Tersalin!" : "Salin"}
                  </button>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Atas Nama</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{ADMIN_BANK.holder}</div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>
                  Catatan Bukti Transfer (opsional)
                </label>
                <textarea
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="Contoh: Sudah transfer via BCA Mobile jam 10:30..."
                  rows={3}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", fontFamily: "inherit", resize: "none", boxSizing: "border-box", color: "#374151" }}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(1)}
                  style={{ flex: 1, padding: "12px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  ← Kembali
                </button>
                <button onClick={handleSubmit}
                  style={{ flex: 2, padding: "12px", background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  Sudah Transfer — Submit
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Success */}
          {step === 3 && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: 64, height: 64, background: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <CheckCircle size={32} color="#16a34a" />
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Permintaan Terkirim!</div>
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
                Admin akan mengkonfirmasi pembayaran Anda dan listing <strong>{listingTitle}</strong> akan otomatis tampil di posisi teratas setelah diaktifkan.
              </p>
              <button onClick={onClose}
                style={{ padding: "12px 32px", background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Tutup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
