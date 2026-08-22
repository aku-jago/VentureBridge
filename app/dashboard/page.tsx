import type { Metadata } from "next";
import { FounderDashboardClient } from "./FounderDashboardClient";

export const metadata: Metadata = {
  title: "Dashboard Founder",
};

export default function FounderDashboardPage() {
  return <FounderDashboardClient />;
}
