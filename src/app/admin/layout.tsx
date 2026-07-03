import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Administración | Suministros L&D",
  description:
    "Panel administrativo de Suministros L&D — gestión de inventario, tasas cambiarias y catálogo de productos.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-200 selection:bg-[#007BFF]/20 selection:text-white">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
