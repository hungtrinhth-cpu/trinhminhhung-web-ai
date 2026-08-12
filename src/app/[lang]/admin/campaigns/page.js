import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/queries/profiles";
import { createClient } from "@/lib/supabase/server";
import CampaignsClient from "@/components/admin/CampaignsClient";

export default async function AdminCampaignsPage({ params }) {
  const { lang } = await params;
  const { profile } = await getSessionProfile();

  if (profile?.role !== "admin") {
    redirect(`/${lang}/admin`);
  }

  const supabase = await createClient();
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  return <CampaignsClient initialCampaigns={campaigns ?? []} />;
}
