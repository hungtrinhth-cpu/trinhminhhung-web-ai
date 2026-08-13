import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/queries/profiles";
import PortalSettingsClient from "./PortalSettingsClient";

export default async function PortalSettingsPage({ params }) {
  const { lang } = await params;
  const { user, profile } = await getSessionProfile();
  if (!user) redirect(`/${lang}/auth/login`);

  return <PortalSettingsClient profile={profile} email={user.email} />;
}
