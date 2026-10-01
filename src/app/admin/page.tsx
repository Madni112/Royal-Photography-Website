import { Metadata } from "next";
import AdminPanel from "@/components/AdminPanel";
import HeaderNavbar from "@/components/HeaderNavbar";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Admin Vault // Antigravity Creative Studio",
  description: "Secure administrative management console for real-time asset updates, project CRUD, and cache revalidation.",
  robots: "noindex, nofollow",
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#050505]">
      <CustomCursor />
      <HeaderNavbar />
      <AdminPanel />
    </main>
  );
}
