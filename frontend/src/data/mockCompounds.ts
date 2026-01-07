// Mock ChEMBL-like compound data for demonstration
export interface Compound {
  id: string;
  chemblId: string;
  prefName: string;
  molWeight: number;
  logP: number;
  tpsa: number;
  hbdCount: number;
  hbaCount: number;
  rotatableBonds: number;
  aromaticRings: number;
  heavyAtoms: number;
  qedScore: number;
  pchemblValue: number;
  targetName: string;
  targetOrganism: string;
  assayType: string;
  isActive: boolean;
  predictedActive: boolean;
  confidence: number;
}

export interface ModelMetrics {
  name: string;
  accuracy: number;
  rocAuc: number;
  f1Score: number;
  precision: number;
  recall: number;
}

export const targetNames = [
  "Human Immunodeficiency Virus Type 1",
  "SARS-CoV-2 Main Protease",
  "Epidermal Growth Factor Receptor",
  "Cyclooxygenase-2",
  "Acetylcholinesterase",
  "Beta-Secretase 1",
  "Dipeptidyl Peptidase IV",
  "Janus Kinase 2",
  "Phosphodiesterase 5A",
  "Cannabinoid Receptor 1",
];

const compoundPrefixes = ["Aspirin", "Ibuprofen", "Metformin", "Atorvastatin", "Omeprazole", "Amlodipine", "Lisinopril", "Gabapentin", "Sertraline", "Levothyroxine"];

function generateRandomCompound(index: number): Compound {
  const molWeight = Math.round((150 + Math.random() * 450) * 100) / 100;
  const logP = Math.round((Math.random() * 6 - 1) * 100) / 100;
  const tpsa = Math.round((20 + Math.random() * 120) * 100) / 100;
  const hbdCount = Math.floor(Math.random() * 6);
  const hbaCount = Math.floor(Math.random() * 10);
  const pchemblValue = Math.round((4 + Math.random() * 5) * 100) / 100;
  const isActive = pchemblValue >= 6.5;
  
  // Simulate ML prediction with some error
  const predictionError = Math.random() < 0.15; // 15% error rate
  const predictedActive = predictionError ? !isActive : isActive;
  
  return {
    id: `COMP${String(index + 1).padStart(5, '0')}`,
    chemblId: `CHEMBL${Math.floor(100000 + Math.random() * 900000)}`,
    prefName: `${compoundPrefixes[Math.floor(Math.random() * compoundPrefixes.length)]}-${Math.floor(Math.random() * 1000)}`,
    molWeight,
    logP,
    tpsa,
    hbdCount,
    hbaCount,
    rotatableBonds: Math.floor(Math.random() * 12),
    aromaticRings: Math.floor(Math.random() * 5),
    heavyAtoms: Math.floor(15 + Math.random() * 30),
    qedScore: Math.round(Math.random() * 100) / 100,
    pchemblValue,
    targetName: targetNames[Math.floor(Math.random() * targetNames.length)],
    targetOrganism: "Homo sapiens",
    assayType: ["B", "F", "A"][Math.floor(Math.random() * 3)],
    isActive,
    predictedActive,
    confidence: Math.round((0.65 + Math.random() * 0.3) * 100) / 100,
  };
}

export const mockCompounds: Compound[] = Array.from({ length: 500 }, (_, i) => generateRandomCompound(i));

export const modelMetrics: ModelMetrics[] = [
  {
    name: "Logistic Regression",
    accuracy: 0.847,
    rocAuc: 0.891,
    f1Score: 0.823,
    precision: 0.856,
    recall: 0.792,
  },
  {
    name: "Random Forest",
    accuracy: 0.912,
    rocAuc: 0.956,
    f1Score: 0.904,
    precision: 0.918,
    recall: 0.891,
  },
  {
    name: "XGBoost",
    accuracy: 0.928,
    rocAuc: 0.967,
    f1Score: 0.921,
    precision: 0.932,
    recall: 0.910,
  },
];

export const featureImportance = [
  { feature: "pchemblValue", importance: 0.342, description: "Bioactivity measurement" },
  { feature: "molWeight", importance: 0.156, description: "Molecular weight" },
  { feature: "logP", importance: 0.134, description: "Lipophilicity" },
  { feature: "tpsa", importance: 0.098, description: "Topological polar surface area" },
  { feature: "hbaCount", importance: 0.087, description: "H-bond acceptors" },
  { feature: "hbdCount", importance: 0.073, description: "H-bond donors" },
  { feature: "rotatableBonds", importance: 0.054, description: "Rotatable bonds" },
  { feature: "aromaticRings", importance: 0.032, description: "Aromatic rings" },
  { feature: "qedScore", importance: 0.024, description: "Drug-likeness score" },
];

export const distributionData = {
  molWeight: [
    { range: "100-200", count: 45 },
    { range: "200-300", count: 89 },
    { range: "300-400", count: 156 },
    { range: "400-500", count: 134 },
    { range: "500-600", count: 76 },
  ],
  logP: [
    { range: "-1 to 0", count: 34 },
    { range: "0 to 1", count: 67 },
    { range: "1 to 2", count: 123 },
    { range: "2 to 3", count: 145 },
    { range: "3 to 4", count: 89 },
    { range: "4 to 5", count: 42 },
  ],
  tpsa: [
    { range: "0-40", count: 78 },
    { range: "40-80", count: 145 },
    { range: "80-120", count: 167 },
    { range: "120-160", count: 89 },
    { range: "160+", count: 21 },
  ],
  activity: [
    { name: "Active", value: 312, color: "hsl(var(--success))" },
    { name: "Inactive", value: 188, color: "hsl(var(--destructive))" },
  ],
};

export const correlationMatrix = [
  { x: "MolWt", y: "LogP", value: 0.42 },
  { x: "MolWt", y: "TPSA", value: 0.67 },
  { x: "MolWt", y: "HBD", value: 0.38 },
  { x: "MolWt", y: "HBA", value: 0.56 },
  { x: "MolWt", y: "pChEMBL", value: -0.12 },
  { x: "LogP", y: "TPSA", value: -0.54 },
  { x: "LogP", y: "HBD", value: -0.48 },
  { x: "LogP", y: "HBA", value: -0.23 },
  { x: "LogP", y: "pChEMBL", value: 0.18 },
  { x: "TPSA", y: "HBD", value: 0.71 },
  { x: "TPSA", y: "HBA", value: 0.82 },
  { x: "TPSA", y: "pChEMBL", value: -0.08 },
  { x: "HBD", y: "HBA", value: 0.45 },
  { x: "HBD", y: "pChEMBL", value: -0.05 },
  { x: "HBA", y: "pChEMBL", value: -0.03 },
];
