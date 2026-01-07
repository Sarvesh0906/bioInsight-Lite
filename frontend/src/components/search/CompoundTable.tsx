import { useState } from "react";
import { Compound } from "@/data/mockCompounds";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CompoundTableProps {
  compounds: Compound[];
  onSelectCompound: (compound: Compound) => void;
}

type SortField = "chemblId" | "molWeight" | "logP" | "tpsa" | "pchemblValue" | "confidence";
type SortDirection = "asc" | "desc";

export function CompoundTable({ compounds, onSelectCompound }: CompoundTableProps) {
  const [sortField, setSortField] = useState<SortField>("chemblId");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCompounds = [...compounds].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const modifier = sortDirection === "asc" ? 1 : -1;
    
    if (typeof aVal === "string") {
      return aVal.localeCompare(bVal as string) * modifier;
    }
    return ((aVal as number) - (bVal as number)) * modifier;
  });

  const totalPages = Math.ceil(sortedCompounds.length / itemsPerPage);
  const paginatedCompounds = sortedCompounds.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="glass-card overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th 
                className="cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("chemblId")}
              >
                <div className="flex items-center gap-1">
                  ChEMBL ID
                  <SortIcon field="chemblId" />
                </div>
              </th>
              <th>Name</th>
              <th 
                className="cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("molWeight")}
              >
                <div className="flex items-center gap-1">
                  MolWt
                  <SortIcon field="molWeight" />
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("logP")}
              >
                <div className="flex items-center gap-1">
                  LogP
                  <SortIcon field="logP" />
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("tpsa")}
              >
                <div className="flex items-center gap-1">
                  TPSA
                  <SortIcon field="tpsa" />
                </div>
              </th>
              <th>Target</th>
              <th 
                className="cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("pchemblValue")}
              >
                <div className="flex items-center gap-1">
                  pChEMBL
                  <SortIcon field="pchemblValue" />
                </div>
              </th>
              <th>Actual</th>
              <th>Predicted</th>
              <th 
                className="cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("confidence")}
              >
                <div className="flex items-center gap-1">
                  Confidence
                  <SortIcon field="confidence" />
                </div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedCompounds.map((compound) => (
              <tr 
                key={compound.id} 
                className="cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => onSelectCompound(compound)}
              >
                <td className="font-mono text-primary">{compound.chemblId}</td>
                <td className="font-medium">{compound.prefName}</td>
                <td className="font-mono">{compound.molWeight.toFixed(1)}</td>
                <td className="font-mono">{compound.logP.toFixed(2)}</td>
                <td className="font-mono">{compound.tpsa.toFixed(1)}</td>
                <td className="max-w-[200px] truncate text-sm text-muted-foreground">
                  {compound.targetName}
                </td>
                <td className="font-mono">{compound.pchemblValue.toFixed(2)}</td>
                <td>
                  <span className={cn("pill", compound.isActive ? "pill-active" : "pill-inactive")}>
                    {compound.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <span className={cn("pill", compound.predictedActive ? "pill-active" : "pill-inactive")}>
                    {compound.predictedActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${compound.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                      {(compound.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, compounds.length)} of {compounds.length} compounds
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
