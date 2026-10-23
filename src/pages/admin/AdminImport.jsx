import { CsvImporter } from "@/components/CsvImporter";
import { PageHeader, SampleNotice } from "@/components/kit";

function AdminImportContent() {
  return (
    <>
      <PageHeader title="Data Import" description="This screen is coming next." />
      <SampleNotice />
      <div className="card-surface mt-4 p-6">
        <CsvImporter />
      </div>
    </>
  );
}

export default function AdminImport() {
  return (
    <>
      <AdminImportContent />
    </>
  );
}
