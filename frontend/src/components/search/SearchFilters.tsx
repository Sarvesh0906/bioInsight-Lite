import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { targetNames } from "@/data/mockCompounds";
import { X, Filter, RotateCcw } from "lucide-react";

export interface SearchFiltersState {
  molWeightRange: [number, number];
  logPRange: [number, number];
  tpsaRange: [number, number];
  targetName: string | null;
  showActive: boolean;
  showInactive: boolean;
  predictedActive: boolean | null;
}

interface SearchFiltersProps {
  filters: SearchFiltersState;
  onFiltersChange: (filters: SearchFiltersState) => void;
  onReset: () => void;
}

export const defaultFilters: SearchFiltersState = {
  molWeightRange: [100, 600],
  logPRange: [-1, 5],
  tpsaRange: [0, 160],
  targetName: null,
  showActive: true,
  showInactive: true,
  predictedActive: null,
};

export function SearchFilters({ filters, onFiltersChange, onReset }: SearchFiltersProps) {
  const hasActiveFilters = 
    filters.molWeightRange[0] !== 100 || 
    filters.molWeightRange[1] !== 600 ||
    filters.logPRange[0] !== -1 ||
    filters.logPRange[1] !== 5 ||
    filters.tpsaRange[0] !== 0 ||
    filters.tpsaRange[1] !== 160 ||
    filters.targetName !== null ||
    !filters.showActive ||
    !filters.showInactive ||
    filters.predictedActive !== null;

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Molecular Weight */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Molecular Weight (Da)</Label>
            <span className="text-sm text-muted-foreground font-mono">
              {filters.molWeightRange[0]} - {filters.molWeightRange[1]}
            </span>
          </div>
          <Slider
            value={filters.molWeightRange}
            min={100}
            max={600}
            step={10}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, molWeightRange: value as [number, number] })
            }
            className="py-2"
          />
        </div>

        {/* LogP */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">LogP (Lipophilicity)</Label>
            <span className="text-sm text-muted-foreground font-mono">
              {filters.logPRange[0]} - {filters.logPRange[1]}
            </span>
          </div>
          <Slider
            value={filters.logPRange}
            min={-1}
            max={5}
            step={0.5}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, logPRange: value as [number, number] })
            }
            className="py-2"
          />
        </div>

        {/* TPSA */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">TPSA (Å²)</Label>
            <span className="text-sm text-muted-foreground font-mono">
              {filters.tpsaRange[0]} - {filters.tpsaRange[1]}
            </span>
          </div>
          <Slider
            value={filters.tpsaRange}
            min={0}
            max={160}
            step={10}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, tpsaRange: value as [number, number] })
            }
            className="py-2"
          />
        </div>

        {/* Target Name */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Target Name</Label>
          <Select
            value={filters.targetName || "all"}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, targetName: value === "all" ? null : value })
            }
          >
            <SelectTrigger className="bg-muted/50">
              <SelectValue placeholder="All targets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All targets</SelectItem>
              {targetNames.map((target) => (
                <SelectItem key={target} value={target}>
                  {target}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Activity Filters */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Experimental Activity</Label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <Switch
                checked={filters.showActive}
                onCheckedChange={(checked) => 
                  onFiltersChange({ ...filters, showActive: checked })
                }
              />
              <span className="text-sm text-muted-foreground">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Switch
                checked={filters.showInactive}
                onCheckedChange={(checked) => 
                  onFiltersChange({ ...filters, showInactive: checked })
                }
              />
              <span className="text-sm text-muted-foreground">Inactive</span>
            </label>
          </div>
        </div>

        {/* Predicted Activity */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Predicted Activity</Label>
          <Select
            value={filters.predictedActive === null ? "all" : filters.predictedActive ? "active" : "inactive"}
            onValueChange={(value) => 
              onFiltersChange({ 
                ...filters, 
                predictedActive: value === "all" ? null : value === "active" 
              })
            }
          >
            <SelectTrigger className="bg-muted/50">
              <SelectValue placeholder="All predictions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All predictions</SelectItem>
              <SelectItem value="active">Predicted Active</SelectItem>
              <SelectItem value="inactive">Predicted Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
