import { PageHeader, SampleNotice } from "@/components/kit";

function AdminVerificationContent() {
  return (
    <>
      <PageHeader title="Incident Verification" description="This screen is coming next." />
      <SampleNotice />
    </>
  );
}

export default function AdminVerification() {
  return (
    <>
      <AdminVerificationContent />
    </>
  );
}
