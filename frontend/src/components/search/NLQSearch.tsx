import { useState, useCallback } from "react";
import { Sparkles, Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchFiltersState, defaultFilters } from "./SearchFilters";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NLQSearchProps {
  onFiltersChange: (filters: SearchFiltersState) => void;
}

const exampleQueries = [
  "Show compounds with low molecular weight and high activity",
  "Compounds predicted active with TPSA below 90",
  "High lipophilicity drugs targeting EGFR",
  "Small molecules with good drug-likeness",
];

export function NLQSearch({ onFiltersChange }: NLQSearchProps) {
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const parseNaturalQuery = useCallback((input: string): Partial<SearchFiltersState> => {
    const lower = input.toLowerCase();
    const filters: Partial<SearchFiltersState> = {};

    // Molecular weight parsing
    if (lower.includes("low molecular weight") || lower.includes("small molecule")) {
      filters.molWeightRange = [100, 300];
    } else if (lower.includes("high molecular weight") || lower.includes("large molecule")) {
      filters.molWeightRange = [400, 600];
    }

    // Activity parsing
    if (lower.includes("high activity") || lower.includes("active")) {
      filters.showActive = true;
      filters.showInactive = false;
    } else if (lower.includes("inactive") || lower.includes("low activity")) {
      filters.showActive = false;
      filters.showInactive = true;
    }

    // Predicted activity
    if (lower.includes("predicted active")) {
      filters.predictedActive = true;
    } else if (lower.includes("predicted inactive")) {
      filters.predictedActive = false;
    }

    // TPSA parsing
    const tpsaMatch = lower.match(/tpsa\s*(below|under|<)\s*(\d+)/);
    if (tpsaMatch) {
      const value = parseInt(tpsaMatch[2]);
      filters.tpsaRange = [0, value];
    }
    const tpsaAboveMatch = lower.match(/tpsa\s*(above|over|>)\s*(\d+)/);
    if (tpsaAboveMatch) {
      const value = parseInt(tpsaAboveMatch[2]);
      filters.tpsaRange = [value, 160];
    }

    // LogP / lipophilicity parsing
    if (lower.includes("high lipophilicity") || lower.includes("lipophilic")) {
      filters.logPRange = [3, 5];
    } else if (lower.includes("low lipophilicity") || lower.includes("hydrophilic")) {
      filters.logPRange = [-1, 1];
    }

    // Target parsing
    if (lower.includes("egfr")) {
      filters.targetName = "Epidermal Growth Factor Receptor";
    } else if (lower.includes("hiv")) {
      filters.targetName = "Human Immunodeficiency Virus Type 1";
    } else if (lower.includes("covid") || lower.includes("sars")) {
      filters.targetName = "SARS-CoV-2 Main Protease";
    }

    return filters;
  }, []);

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;

    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const parsedFilters = parseNaturalQuery(query);
      onFiltersChange({
        ...defaultFilters,
        ...parsedFilters,
      });
      setIsProcessing(false);
    }, 500);
  }, [query, parseNaturalQuery, onFiltersChange]);

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setTimeout(() => {
      const parsedFilters = parseNaturalQuery(example);
      onFiltersChange({
        ...defaultFilters,
        ...parsedFilters,
      });
    }, 100);
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">Natural Language Search</h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>Search using natural language. Try queries like "low molecular weight and high activity" or "TPSA below 90".</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Try: 'Show compounds with low molecular weight and high activity'"
          className="search-input pr-24"
        />
        <Button
          onClick={handleSearch}
          disabled={isProcessing || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2"
          size="sm"
        >
          {isProcessing ? (
            <span className="animate-spin">⟳</span>
          ) : (
            <>
              <Search className="h-4 w-4 mr-1" />
              Search
            </>
          )}
        </Button>
      </div>

      <div className="mt-4">
        <p className="text-xs text-muted-foreground mb-2">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {exampleQueries.map((example) => (
            <button
              key={example}
              onClick={() => handleExampleClick(example)}
              className="text-xs px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
