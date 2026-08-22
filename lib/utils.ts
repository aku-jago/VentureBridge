import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(0)}M`;
  }
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(0)}jt`;
  }
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function getStageLabel(stage: string): string {
  const labels: Record<string, string> = {
    ideation: "Ideation",
    pre_seed: "Pre-Seed",
    seed: "Seed",
    early_stage: "Early Stage",
    series_a: "Series A",
    series_b: "Series B",
  };
  return labels[stage] ?? stage;
}

export function getStageBadgeClass(stage: string): string {
  const classes: Record<string, string> = {
    ideation: "badge-ideation",
    pre_seed: "badge-pre-seed",
    seed: "badge-seed",
    early_stage: "badge-early-stage",
    series_a: "badge-series-a",
    series_b: "badge-series-a",
  };
  return `badge ${classes[stage] ?? "badge-gray"}`;
}

export function getMatchColor(score: number): string {
  if (score >= 90) return "text-primary-600 bg-primary-50 border-primary-100";
  if (score >= 75) return "text-warning bg-warning-light border-warning-border";
  return "text-text-secondary bg-border-light border-border";
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
