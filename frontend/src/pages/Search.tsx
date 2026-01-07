import { useState, useMemo, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  SearchFilters,
  SearchFiltersState,
  defaultFilters,
} from "@/components/search/SearchFilters";
import { NLQSearch } from "@/components/search/NLQSearch";
import { CompoundTable } from "@/components/search/CompoundTable";
import {
  searchCompounds,
  predictBioactivity,
} from "@/services/api";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ------------------ TYPES ------------------ */

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

interface Compound extends BioactivityData {
  id: string;
  chemblId: string;
  prefName: string;
  molWeight: number;
  logP: number;
  tpsa: number;
  hbdCount: number;
  hbaCount: number;
  rotatableBonds: number;
  isActive: boolean;
  predictedActive: boolean;
  confidence: number;
  pchemblValue: number;
}

/* ------------------ COMPONENT ------------------ */

export default function Search() {
  const [filters, setFilters] =
    useState<SearchFiltersState>(defaultFilters);
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [loading, setLoading] = useState(true);

  /* ------------------ BACKEND SEARCH ------------------ */

  useEffect(() => {
    setLoading(true);

    const payload = {
      molwt_min: filters.molWeightRange[0],
      molwt_max: filters.molWeightRange[1],
      logp_min: filters.logPRange[0],
      logp_max: filters.logPRange[1],
      psa_max: filters.tpsaRange[1],
      is_active:
        filters.showActive && !filters.showInactive
          ? 1
          : !filters.showActive && filters.showInactive
          ? 0
          : null,
      nlq: (filters as any).nlq ?? null,
    };

    searchCompounds(payload)
      .then(async (response: BioactivityData[]) => {
        // 1️⃣ Map backend → UI schema
        const baseCompounds: Compound[] = response.map(
          (item) => ({
            ...item,
            id: item.compound_id,
            chemblId: item.compound_id,
            prefName: item.compound_id,
            molWeight: item.mw_freebase,
            logP: item.alogp,
            tpsa: item.psa,
            hbdCount: item.hbd,
            hbaCount: item.hba,
            rotatableBonds: item.rtb,
            isActive: item.is_active === 1,

            // placeholders (updated by ML)
            predictedActive: item.is_active === 1,
            confidence: 0,
            pchemblValue: 6.5,
          })
        );

        // 2️⃣ ML enrichment (limit to first 20 rows)
        const enriched = await Promise.all(
          baseCompounds.slice(0, 20).map(async (compound) => {
            try {
              const prediction = await predictBioactivity({
                mw_freebase: compound.molWeight,
                alogp: compound.logP,
                psa: compound.tpsa,
                hbd: compound.hbdCount,
                hba: compound.hbaCount,
                rtb: compound.rotatableBonds,
              });

              return {
                ...compound,
                predictedActive:
                  prediction.prediction === "Active",
                confidence: prediction.probability,
              };
            } catch {
              return compound;
            }
          })
        );

        setCompounds(
          baseCompounds.map(
            (c, i) => enriched[i] ?? c
          )
        );

        setLoading(false);
      })
      .catch((error) => {
        console.error("Search failed:", error);
        setLoading(false);
      });
  }, [filters]);

  /* ------------------ CLIENT FILTERING ------------------ */

  const filteredCompounds = useMemo(() => {
    return compounds.filter((compound) => {
      if (
        filters.predictedActive !== null &&
        compound.predictedActive !==
          filters.predictedActive
      )
        return false;

      return true;
    });
  }, [compounds, filters]);

  /* ------------------ ACTIVE FILTER COUNT ------------------ */

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (
      filters.molWeightRange[0] !== 100 ||
      filters.molWeightRange[1] !== 600
    )
      count++;
    if (
      filters.logPRange[0] !== -1 ||
      filters.logPRange[1] !== 5
    )
      count++;
    if (
      filters.tpsaRange[0] !== 0 ||
      filters.tpsaRange[1] !== 160
    )
      count++;
    if (filters.targetName) count++;
    if (!filters.showActive || !filters.showInactive)
      count++;
    if (filters.predictedActive !== null)
      count++;
    if ((filters as any).nlq) count++;
    return count;
  }, [filters]);

  /* ------------------ RENDER ------------------ */

  return (
    <MainLayout
      title="Compound Search"
      subtitle="Search and filter bioactive compounds"
    >
      <div className="mb-6">
        <NLQSearch onFiltersChange={setFilters} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Loading compounds...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SearchFilters
              filters={filters}
              onFiltersChange={setFilters}
              onReset={() => setFilters(defaultFilters)}
            />
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  {filteredCompounds.length} compounds found
                </h2>
                {activeFiltersCount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {activeFiltersCount} filter
                    {activeFiltersCount > 1 ? "s" : ""} applied
                  </p>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setFilters(defaultFilters)
                  }
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear all filters
                </Button>
              )}
            </div>

            <CompoundTable
              compounds={filteredCompounds}
              onSelectCompound={() => {}}
            />
          </div>
        </div>
      )}
    </MainLayout>
  );
}
