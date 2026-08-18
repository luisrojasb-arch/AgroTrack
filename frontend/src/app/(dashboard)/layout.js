import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getSession } from "@/actions/auth.actions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Panel Principal | AgroTrack",
  description: "Gestión inteligente para granjas porcinas.",
};

export default async function DashboardRootLayout({ children }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.requiere_cambio_contrasenha) {
    redirect("/complete-profile");
  }

  return <DashboardLayout usuario={session}>{children}</DashboardLayout>;
}
