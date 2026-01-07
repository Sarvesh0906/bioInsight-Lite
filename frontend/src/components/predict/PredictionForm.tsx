import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FlaskConical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  predictWithLogistic,
  predictWithXGBoost,
  explainPrediction,
} from "@/services/api";


/* ------------------ SCHEMA ------------------ */

const predictionSchema = z.object({
  molWeight: z.number().min(50).max(1000),
  logP: z.number().min(-5).max(10),
  tpsa: z.number().min(0).max(250),
  hbdCount: z.number().int().min(0).max(15),
  hbaCount: z.number().int().min(0).max(20),
  rotatableBonds: z.number().int().min(0).max(20),
  aromaticRings: z.number().int().min(0).max(10),
  qedScore: z.number().min(0).max(1),
});

type PredictionInput = z.infer<typeof predictionSchema>;

export interface PredictionResult {
  isActive: boolean;
  confidence: number;
  model: string;
  shapValues: {
    feature: string;
    value: number;
    contribution: number;
  }[];
}

interface PredictionFormProps {
  onPredict: (result: PredictionResult) => void;
}

/* ------------------ MODEL METRICS ------------------ */

const modelMetrics = [
  {
    name: "Logistic Regression",
    rocAuc: 0.71,
  },
  {
    name: "XGBoost",
    rocAuc: 0.86,
  },
];


/* ------------------ COMPONENT ------------------ */

export function PredictionForm({ onPredict }: PredictionFormProps) {
  const [selectedModel, setSelectedModel] = useState("XGBoost");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PredictionInput>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      molWeight: 350,
      logP: 2.5,
      tpsa: 75,
      hbdCount: 2,
      hbaCount: 5,
      rotatableBonds: 4,
      aromaticRings: 2,
      qedScore: 0.65,
    },
  });

  const onSubmit = async (data: PredictionInput) => {
    try {
      setIsLoading(true);

      const payload = {
        mw_freebase: data.molWeight,
        alogp: data.logP,
        psa: data.tpsa,
        hbd: data.hbdCount,
        hba: data.hbaCount,
        rtb: data.rotatableBonds,
      };

      let prediction;
      if (selectedModel === "Logistic Regression") {
        prediction = await predictWithLogistic(payload);
      } else {
        prediction = await predictWithXGBoost(payload);
      }

      const explanation = await explainPrediction(payload);

      const result: PredictionResult = {
        isActive: prediction.prediction === "Active",
        confidence: prediction.probability,
        model: prediction.model,
        shapValues: explanation.explanation.map((item) => ({
          feature: item.feature,
          value:
            item.feature === "mw_freebase" ? payload.mw_freebase :
              item.feature === "alogp" ? payload.alogp :
                item.feature === "psa" ? payload.psa :
                  item.feature === "hbd" ? payload.hbd :
                    item.feature === "hba" ? payload.hba :
                      item.feature === "rtb" ? payload.rtb :
                        0,
          contribution: item.impact,
        })),
      };

      onPredict(result);
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <FlaskConical className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Bioactivity Prediction
        </h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Model Selection */}
        <div className="space-y-2">
          <Label>Select Model</Label>
          <Select
            value={selectedModel}
            onValueChange={setSelectedModel}
          >
            <SelectTrigger className="bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {modelMetrics.map((model) => (
                <SelectItem
                  key={model.name}
                  value={model.name}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span>{model.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ROC-AUC: {model.rocAuc.toFixed(3)}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* INPUT GRID (UNCHANGED UI) */}
        {/* --- your existing inputs remain exactly as-is --- */}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Predicting...
            </>
          ) : (
            <>
              <FlaskConical className="h-4 w-4 mr-2" />
              Predict Bioactivity
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
