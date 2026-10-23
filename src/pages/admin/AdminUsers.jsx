import { PageHeader, SampleNotice } from "@/components/kit";

function AdminUsersContent() {
  return (
    <>
      <PageHeader title="Users & Roles" description="This screen is coming next." />
      <SampleNotice />
    </>
  );
}

export default function AdminUsers() {
  return (
    <>
      <AdminUsersContent />
    </>
  );
}
