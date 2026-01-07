# 🧬 BioInsight Lite — Data Explorer & Bioactivity Predictor

BioInsight Lite is a full-stack mini application built to **explore chemical/biological datasets and predict compound bioactivity** using machine learning models. The application is designed as a **searchable, explainable, and deployable ML system**, built using modern web and ML technologies.

---

## 🎯 Project Goal

To build an end-to-end system that allows users to:

- Explore ChEMBL chemical bioactivity data
- Search compounds using structured filters and natural language queries
- Predict compound bioactivity using ML models
- Explain predictions using feature-level explainability
- Interact with the system through a clean web UI

---

## 🧱 System Architecture

Frontend (React + TypeScript)
 ->
FastAPI Backend (Search + ML Inference)
->
MySQL (ChEMBL v36 derived tables)

### Key Design Principles

- **Separation of concerns**: ML training is offline, inference is online
- **Explainability-first ML** using SHAP
- **Backend-driven search** for scalability
- **Frontend ML enrichment** for performance

---

## 🛠️ Tech Stack

### Frontend

- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- Netlify (deployment)

### Backend

- FastAPI
- Python
- SQLAlchemy
- MySQL
- Render (deployment)

### Machine Learning

- Pandas, NumPy
- Scikit-learn (Logistic Regression)
- XGBoost
- SHAP (Explainability)

---

## 📊 Dataset

- **Source:** ChEMBL Database v36
- **Format:** MySQL dump (`chembl_36_mysql.dmp`)
- **Primary Table:** `activities`
- **Supporting Tables:**
  - `compound_properties`
  - `molecule_dictionary`
  - `assays`
  - `target_dictionary`

A cleaned and derived dataset (`bioactivity_ml_view`) is used for ML training and inference.

---

## 🔬 Data Preprocessing & EDA

- Missing value handling
- Feature normalization
- Binary activity label generation (`is_active`)
- Feature correlation analysis
- Descriptor distribution analysis

All preprocessing and analysis are documented in the provided Jupyter notebook.

---

## 🤖 Machine Learning Models

### Models Trained

- **Baseline:** Logistic Regression
- **Advanced:** XGBoost

### Features Used

- Molecular weight (MW)
- LogP (ALogP)
- Topological Polar Surface Area (TPSA)
- Hydrogen bond donors (HBD)
- Hydrogen bond acceptors (HBA)
- Rotatable bonds (RTB)

### Evaluation Metrics

- Accuracy
- ROC-AUC
- F1-Score

Model metrics are surfaced in the UI to help users choose between models.

---

## 📈 Explainability

- SHAP is used to compute **per-prediction feature contributions**
- Feature impact is visualized directly in the frontend
- Users can understand **why** a compound was predicted active/inactive

---

## 🔍 Search Functionality

### Structured Search

Users can filter compounds by:

- Molecular weight range
- LogP range
- TPSA range
- Target name
- Actual bioactivity
- Predicted bioactivity

### Natural Language Query (Bonus Feature)

A lightweight NLQ system allows queries such as:

- `low molecular weight active compounds`
- `high molecular weight inactive`
- `low logp active`

NLQ input is parsed into SQL filters on the backend.

---

## 🌐 Frontend Features

- Interactive compound table
- Filter sidebar with live updates
- NLQ search bar
- ML-enriched predictions with confidence
- Clear separation of actual vs predicted activity

---

## 🔐 Security & Best Practices

- No hardcoded secrets
- Input validation using Pydantic
- Controlled database access
- No dynamic SQL or unsafe evaluation

---

## 🚀 Deployment

### Frontend

- Hosted on **Netlify**
- Static React build

### Backend

- Hosted on **Render**
- FastAPI with persistent ML model loading

---

## ⚡ Quick Start Guide (Local Setup)

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd bioinsight-lite
```

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start the backend
uvicorn app.main:app --reload
```

- Backend will be available at: http://127.0.0.1:8000
- Swagger UI: http://127.0.0.1:8000/docs

### 3️⃣ Database Setup (MySQL)

```sql
CREATE DATABASE chembl_36
DEFAULT CHARACTER SET utf8
DEFAULT COLLATE utf8_general_ci;
```

Import ChEMBL dump: 
Open command prompt, then enter:

```bash
mysql -uUSERNAME -p chembl_36 < chembl_36_mysql.dmp
```

### 4️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

- Frontend will be available at: http://localhost:5173

---

## 🧪 Sample NLQ Prompts

Use these to verify functionality:

- low molecular weight active compounds
- high molecular weight inactive
- low logp active

---

## 📦 Deliverables Included

- ✔ FastAPI backend
- ✔ React frontend
- ✔ ML models & inference pipeline
- ✔ SHAP explainability
- ✔ Database-backed search
- ✔ NLQ support
- ✔ Jupyter notebook (EDA + ML)
- ✔ README documentation

---

## 🏁 Conclusion

BioInsight Lite demonstrates a complete ML-powered data exploration system, combining:

- Scalable backend search
- Explainable machine learning
- Modern frontend design
- Clean deployment architecture

The project fulfills all mandatory requirements and includes bonus NLQ functionality.

---

## 👨‍💻 Author

Sarvesh Chaurasia
&copy; 2025
