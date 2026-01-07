import { useState, useEffect } from "react";
import { Database, Download, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchActivities } from "@/services/api";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface BioactivityData {
  activity_id: number;
  mw_freebase: number;
  alogp: number;
  psa: number;
  hbd: number;
  hba: number;
  rtb: number;
  is_active: number;
  compound_id: string;
  target_name: string;
}

const tables = [
  { name: "activities", description: "Bioactivity measurements", rows: 0 },
  { name: "molecule_dictionary", description: "Molecule identifiers and names", rows: 500 },
  { name: "target_dictionary", description: "Target protein information", rows: 10 },
  { name: "assays", description: "Assay definitions", rows: 45 },
  { name: "compound_properties", description: "Molecular descriptors", rows: 500 },
  { name: "compound_records", description: "Record linkages", rows: 500 },
];

export function DataExplorer() {
  const [selectedTable, setSelectedTable] = useState("activities");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<BioactivityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities()
      .then((response) => {
        setData(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch activities:", error);
        setLoading(false);
      });
  }, []);

  const filteredData = data.filter(d => 
    d.compound_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.target_name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 20);

  const totalRows = data.length;
  tables[0].rows = totalRows;

  return (
    <div className="space-y-6">
      {/* Database Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <div 
            key={table.name}
            onClick={() => setSelectedTable(table.name)}
            className={`glass-card p-4 cursor-pointer transition-all hover:scale-[1.02] ${
              selectedTable === table.name ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-mono text-sm text-primary">{table.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{table.description}</p>
              </div>
              <Database className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold mt-3">{table.rows.toLocaleString()} rows</p>
          </div>
        ))}
      </div>

      {/* Data Preview */}
      <div className="glass-card p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              <span className="font-mono text-primary">{selectedTable}</span> Preview
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 bg-muted/50"
              />
            </div>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Compound ID</th>
                <th>Target Name</th>
                <th>MolWt</th>
                <th>LogP</th>
                <th>TPSA</th>
                <th>HBD</th>
                <th>HBA</th>
                <th>Rotatable</th>
                <th>Activity ID</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.activity_id}>
                  <td className="font-mono text-primary">{item.compound_id}</td>
                  <td>{item.target_name}</td>
                  <td className="font-mono">{item.mw_freebase.toFixed(1)}</td>
                  <td className="font-mono">{item.alogp.toFixed(2)}</td>
                  <td className="font-mono">{item.psa.toFixed(1)}</td>
                  <td className="font-mono">{item.hbd}</td>
                  <td className="font-mono">{item.hba}</td>
                  <td className="font-mono">{item.rtb}</td>
                  <td className="font-mono">{item.activity_id}</td>
                  <td>
                    <span className={`pill ${item.is_active === 1 ? 'pill-active' : 'pill-inactive'}`}>
                      {item.is_active === 1 ? 'Yes' : 'No'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredData.length} of {totalRows} records
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-mono">PostgreSQL</span>
            <span>•</span>
            <span>ChEMBL v36</span>
          </div>
        </div>
      </div>

      {/* Schema Info */}
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-foreground mb-4">Schema Documentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Join Keys</h4>
            <ul className="text-sm text-muted-foreground space-y-1 font-mono">
              <li>activities.record_id → compound_records.record_id</li>
              <li>activities.molregno → molecule_dictionary.molregno</li>
              <li>compound_records.molregno → compound_properties.molregno</li>
              <li>activities.assay_id → assays.assay_id</li>
              <li>assays.tid → target_dictionary.tid</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">ML Features</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><span className="font-mono text-primary">mw_freebase</span> - Molecular weight</li>
              <li><span className="font-mono text-primary">alogp</span> - Lipophilicity (LogP)</li>
              <li><span className="font-mono text-primary">psa</span> - Topological PSA</li>
              <li><span className="font-mono text-primary">hbd</span> - H-bond donors</li>
              <li><span className="font-mono text-primary">hba</span> - H-bond acceptors</li>
              <li><span className="font-mono text-primary">rtb</span> - Rotatable bonds</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
