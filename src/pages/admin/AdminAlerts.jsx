import { PageHeader, SampleNotice } from "@/components/kit";

function AdminAlertsContent() {
  return (
    <>
      <PageHeader title="Alerts Management" description="This screen is coming next." />
      <SampleNotice />
    </>
  );
}

export default function AdminAlerts() {
  return (
    <>
      <AdminAlertsContent />
    </>
  );
}
