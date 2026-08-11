import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/queries/profiles";
import { getAllWebinars } from "@/lib/queries/webinars";
import WebinarsClient from "@/components/admin/WebinarsClient";

export default async function AdminWebinarsPage({ params }) {
  const { lang } = await params;
  const { profile } = await getSessionProfile();

  if (profile?.role !== "admin") {
    redirect(`/${lang}/admin`);
  }

  const webinars = await getAllWebinars();

  return <WebinarsClient initialWebinars={webinars} />;
}
