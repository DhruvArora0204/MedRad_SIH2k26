import os
import sys
import warnings

# Suppress third-party library deprecation and user warnings
warnings.filterwarnings("ignore")

# Ensure project root is in sys.path when imported directly by uvicorn
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.app.api.endpoints import router as api_router

app = FastAPI(
    title="RADIS Backend API & Workstation",
    description="Radiology AI Decision Support & Reporting API and Clinical Workstation",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "RADIS Backend API"}

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    from fastapi.responses import Response
    return Response(status_code=204)

app.include_router(api_router, prefix="/api/v1")

# Mount frontend static files from root workspace frontend/dist or local dist
possible_dist_paths = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "frontend", "dist")),
    os.path.abspath(os.path.join(root_dir, "frontend", "dist")),
    os.path.join(os.getcwd(), "frontend", "dist")
]
for p in possible_dist_paths:
    if os.path.exists(p):
        app.mount("/", StaticFiles(directory=p, html=True), name="frontend")
        break

