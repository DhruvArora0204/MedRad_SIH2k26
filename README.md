# R×M Ecosystem 🧠💊
> **Unified Clinical AI Decision Support (RADIS) & Decentralized Healthcare Platform (MediShare)**

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](https://fastapi.tiangolo.com)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0%2B-EE4C2C.svg)](https://pytorch.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF.svg)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-Ethereum-yellow.svg)](https://hardhat.org/)

---

## 🌟 Overview

The **R×M Ecosystem** bridges advanced deep learning computer vision with decentralized healthcare and generative intelligence:

```
                          ┌─────────────────────────────────────────────────────────┐
                          │            R×M Unified Frontend (React 19 + Vite)       │
                          │                  http://localhost:5173                  │
                          └──────────┬───────────────────────────────────┬──────────┘
                                     │                                   │
                 ┌───────────────────▼───────────────────┐   ┌───────────▼───────────────────────────┐
                 │       RADIS Clinical AI Engine        │   │       MediShare Microservice          │
                 │      (FastAPI @ Port 8000)            │   │      (Express.js @ Port 5000)         │
                 ├───────────────────────────────────────┤   ├───────────────────────────────────────┤
                 │ • ResNet-50 Multi-label ICH CNN       │   │ • Gemini AI Diagnostic Report Parser  │
                 │ • Grad-CAM Explainability Heatmaps    │   │ • Medicine Batch Supply Chain         │
                 │ • PNG / JPG / DICOM Ingestion         │   │ • Medicine Donation Portal            │
                 │ • Dynamic Windowing (Brain/Bone/Sub)  │   │ • Decentralized Marketplace           │
                 │ • Clinical Decision Rule Engine       │   └───────────────────┬───────────────────┘
                 │ • Automated Radiology Reports         │                       │
                 └───────────────────────────────────────┘           ┌───────────▼───────────┐
                                                                     │ Hardhat Local Node    │
                                                                     │ (Ethereum @ Port 8545)│
                                                                     └───────────────────────┘
```

---

## 🚀 Key Modules

### 1. RADIS — Radiology AI Decision Support
* **Multi-Label Hemorrhage Classification**: Detects 6 intracranial hemorrhage subtypes (*Epidural, Intraparenchymal, Intraventricular, Subarachnoid, Subdural, Any ICH*).
* **Grad-CAM Visual Explainability**: Generates pixel-level activation heatmaps with blend modes and bounding boxes for lesion localization.
* **Flexible Ingestion**: Ingests standard `.png`, `.jpg`, `.jpeg` brain scans as well as `.dcm` DICOM datasets with Hounsfield Unit (HU) conversion.
* **Clinical Windowing Presets**:
  * **Brain CT Window** (WC: 40, WW: 80)
  * **Bone Detail Window** (WC: 600, WW: 2000)
  * **Subdural Window** (WC: 80, WW: 200)
* **Automated Radiology Reports**: Generates structured clinical drafts with severity/urgency triage tagging.

### 2. MediShare — Decentralized Healthcare & Verification
* **Blockchain Batch Verification**: Smart-contract-backed medicine batch integrity via Solidity on Ethereum / Hardhat (`verifyBatch`).
* **Gemini AI Medical Report Analysis**: Automated diagnostic parsing of patient blood and oncology PDF lab reports.
* **Medicine Donations**: Community-driven surplus medicine donation system.
* **Medicine Marketplace**: Direct inventory catalog for verified medicines.

---

## ⚡ Quick Start (Single Command)

To spin up all 4 services across dedicated terminal windows, execute the root batch launcher:

```cmd
.\start_all.bat
```

### Launched Services:
1. **Frontend App**: `http://localhost:5173`
2. **RADIS AI Backend**: `http://localhost:8000` (Swagger UI: `http://localhost:8000/docs`)
3. **Hardhat Blockchain Node**: `http://127.0.0.1:8545`
4. **MediShare Backend API**: `http://localhost:5000`

---

## 🛠️ Manual Step-by-Step Setup

### Prerequisites
* **Node.js**: v18+ & npm
* **Python**: 3.10+
* **Git**

---

### Step 1: Install Python Requirements
```bash
pip install -r requirements.txt
```

---

### Step 2: Launch the Frontend
```bash
cd frontend
npm install
npm run dev
```

---

### Step 3: Launch RADIS AI Backend
```bash
cd RADIS_2
python scripts/run_demo_server.py
```

---

### Step 4: Launch Hardhat Blockchain & MediShare Backend

**In Terminal A (Hardhat Node):**
```bash
cd medishare/Medishare-localhost/backend
npm install
npx hardhat node
```

**In Terminal B (Smart Contracts & Express API):**
```bash
cd medishare/Medishare-localhost/backend
npx hardhat run scripts/deploy.js --network localhost
npm run start
```

---

## 🧪 Testing & Verification

### Run Python AI & Backend Test Suite (29 Tests)
```bash
cd RADIS_2
python -m pytest
```

### Validate Production Frontend Build
```bash
cd frontend
npm run build
```

---

## 📂 Project Architecture

```
try_merge/
├── frontend/                   # Unified React 19 + TypeScript + Vite + Tailwind frontend
│   ├── src/pages/Radis.tsx     # Modern PACS AI Clinical Workstation
│   ├── src/pages/MediShare.tsx # MediShare Healthcare & Verification Hub
│   └── src/api/                # Axios API services for RADIS & MediShare
├── RADIS_2/                    # Radiology AI inference engine & FastAPI server
│   ├── ml/                     # PyTorch models, Grad-CAM, preprocessing, rule engine
│   ├── backend/                # FastAPI endpoints, schemas, and storage
│   ├── data/demo_scans/        # Demo brain CT scans (.png, .jpg, .dcm)
│   └── scripts/                # Synthetic generator & server runner
├── medishare/                  # MediShare microservice
│   └── Medishare-localhost/
│       └── backend/            # Express.js API, Solidity contracts & Hardhat environment
├── requirements.txt            # Unified Python dependencies
├── start_all.bat               # 4-terminal Windows launcher script
└── .gitignore                  # Comprehensive root repository gitignore
```

---

## 📄 License
This project is developed for clinical AI research and healthcare verification workflows.
