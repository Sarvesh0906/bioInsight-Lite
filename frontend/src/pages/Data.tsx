import { MainLayout } from "@/components/layout/MainLayout";
import { DataExplorer } from "@/components/data/DataExplorer";

export default function Data() {
  return (
    <MainLayout title="Data Explorer" subtitle="Browse and query ChEMBL v36 database tables">
      <DataExplorer />
    </MainLayout>
  );
}
