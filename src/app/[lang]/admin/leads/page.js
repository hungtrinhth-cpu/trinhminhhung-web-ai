import { getLeads, getPipelineStages } from "@/lib/queries/leads";
import { getLeadLists } from "@/lib/queries/lead-lists";
import LeadsClient from "@/components/admin/LeadsClient";

export default async function LeadsPage() {
  const [leads, stages, lists] = await Promise.all([
    getLeads({ limit: 500 }),
    getPipelineStages(),
    getLeadLists(),
  ]);

  return <LeadsClient initialLeads={leads} stages={stages} lists={lists} />;
}
