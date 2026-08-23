from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.app.schemas.scan import ScanUploadResponse, ScanAnalysisResponse, ScanSummary
from backend.app.services.storage import StorageService
from typing import List, Optional
import os
import base64
import cv2
import numpy as np

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))

router = APIRouter()
storage = StorageService()

def render_image_to_base64(file_path: str, preset: str = "brain") -> Optional[str]:
    try:
        ext = os.path.splitext(file_path)[1].lower()
        if ext in ['.png', '.jpg', '.jpeg', '.webp', '.bmp']:
            img_bgr = cv2.imread(file_path)
            if img_bgr is None:
                from PIL import Image
                pil_img = Image.open(file_path).convert('RGB')
                img_rgb = np.array(pil_img)
            else:
                img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
                
            # Apply simulated windowing contrast if requested
            if preset.lower() == "bone":
                img_rgb = cv2.convertScaleAbs(img_rgb, alpha=1.4, beta=15)
            elif preset.lower() == "subdural":
                img_rgb = cv2.convertScaleAbs(img_rgb, alpha=1.2, beta=5)
                
            _, buffer = cv2.imencode('.png', cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR))
            b64_str = base64.b64encode(buffer).decode('utf-8')
            return f"data:image/png;base64,{b64_str}"
            
        else:
            # DICOM rendering
            from ml.preprocessing.dicom_parser import read_dicom
            from ml.preprocessing.transforms import convert_to_hu, apply_window
            
            presets = {
                "brain": (40.0, 80.0),
                "subdural": (80.0, 200.0),
                "bone": (600.0, 2000.0)
            }
            window_center, window_width = presets.get(preset.lower(), (40.0, 80.0))
            
            dcm = read_dicom(file_path)
            pixel_array = dcm.pixel_array
            
            while pixel_array.ndim > 2:
                if pixel_array.shape[0] > 1:
                    pixel_array = pixel_array[pixel_array.shape[0] // 2]
                else:
                    pixel_array = pixel_array[0]
                    
            intercept_val = getattr(dcm, 'RescaleIntercept', 0.0)
            slope_val = getattr(dcm, 'RescaleSlope', 1.0)
            intercept = float(intercept_val[0] if isinstance(intercept_val, (list, tuple)) else intercept_val)
            slope = float(slope_val[0] if isinstance(slope_val, (list, tuple)) else slope_val)
            
            hu_img = convert_to_hu(pixel_array, intercept, slope)
            windowed = apply_window(hu_img, window_center, window_width)
            img_uint8 = (windowed * 255.0).astype(np.uint8)
            
            if img_uint8.ndim == 2:
                img_rgb = cv2.cvtColor(img_uint8, cv2.COLOR_GRAY2RGB)
            else:
                img_rgb = img_uint8
                
            _, buffer = cv2.imencode('.png', img_rgb)
            b64_str = base64.b64encode(buffer).decode('utf-8')
            return f"data:image/png;base64,{b64_str}"
    except Exception as e:
        print(f"Error rendering image to Base64: {e}")
        return None

def extract_image_or_dicom_meta(file_path: str) -> dict:
    try:
        ext = os.path.splitext(file_path)[1].lower()
        if ext in ['.png', '.jpg', '.jpeg', '.webp', '.bmp']:
            img = cv2.imread(file_path)
            if img is not None:
                h, w, c = img.shape
            else:
                from PIL import Image
                with Image.open(file_path) as im:
                    w, h = im.size
                    c = len(im.getbands())
                    
            file_size_kb = os.path.getsize(file_path) / 1024.0
            return {
                'PatientID': 'ANONYMOUS-PATIENT',
                'Modality': f'CT Image ({ext[1:].upper()})',
                'BodyPartExamined': 'HEAD / BRAIN',
                'Rows': h,
                'Columns': w,
                'Channels': c,
                'Format': ext[1:].upper(),
                'FileSize': f"{file_size_kb:.1f} KB"
            }
        else:
            from ml.preprocessing.dicom_parser import read_dicom, extract_metadata
            dcm = read_dicom(file_path)
            return extract_metadata(dcm)
    except Exception:
        return {}

SUPPORTED_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.webp', '.bmp', '.dcm', '.DCM')

@router.post("/scans/upload", response_model=ScanUploadResponse, status_code=201)
async def upload_scan(file: UploadFile = File(...)):
    filename_lower = file.filename.lower()
    if not any(filename_lower.endswith(ext.lower()) for ext in SUPPORTED_EXTENSIONS):
        raise HTTPException(
            status_code=400, 
            detail="Only image files (.png, .jpg, .jpeg) and DICOM (.dcm) files are supported."
        )
    
    content = await file.read()
    record = storage.save_scan(file.filename, content)
    meta = extract_image_or_dicom_meta(record["file_path"])
    record["metadata"] = meta
    storage._save_metadata(storage._load_metadata() | {record["scan_id"]: record})
    
    img_b64 = render_image_to_base64(record["file_path"], "brain")
    
    return ScanUploadResponse(
        scan_id=record["scan_id"],
        filename=record["filename"],
        status=record["status"],
        uploaded_at=record["uploaded_at"],
        image_data_url=img_b64,
        metadata=meta
    )

@router.post("/scans/load_demo", response_model=ScanUploadResponse, status_code=201)
def load_demo_scan():
    demo_png = os.path.join(PROJECT_ROOT, "data", "demo_scans", "epidural_hematoma_ct.png")
    demo_dcm = os.path.join(PROJECT_ROOT, "data", "demo_scans", "epidural_hematoma_ct.dcm")
    
    if not os.path.exists(demo_png) and not os.path.exists(demo_dcm):
        from scripts.create_demo_dataset import main as create_dataset
        create_dataset()
        
    demo_file = demo_png if os.path.exists(demo_png) else demo_dcm
    filename = os.path.basename(demo_file)
        
    with open(demo_file, "rb") as f:
        content = f.read()
        
    record = storage.save_scan(filename, content)
    meta = extract_image_or_dicom_meta(record["file_path"])
    record["metadata"] = meta
    storage._save_metadata(storage._load_metadata() | {record["scan_id"]: record})
    
    img_b64 = render_image_to_base64(record["file_path"], "brain")
    
    return ScanUploadResponse(
        scan_id=record["scan_id"],
        filename=record["filename"],
        status=record["status"],
        uploaded_at=record["uploaded_at"],
        image_data_url=img_b64,
        metadata=meta
    )

@router.get("/scans/{scan_id}/image")
def get_scan_image(scan_id: str, preset: str = "brain"):
    record = storage.get_scan(scan_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Scan {scan_id} not found.")
    
    img_b64 = render_image_to_base64(record["file_path"], preset)
    
    return {
        "scan_id": scan_id,
        "preset": preset,
        "image_data_url": img_b64
    }

@router.post("/scans/{scan_id}/analyze", response_model=ScanAnalysisResponse)
def analyze_scan(scan_id: str):
    from ml.inference.pipeline import run_pipeline
    record = storage.get_scan(scan_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Scan {scan_id} not found.")
    
    file_path = record["file_path"]
    model_weights_path = os.path.join(PROJECT_ROOT, "checkpoints", "best_model.pth")
    
    try:
        pipeline_output = run_pipeline(
            dicom_path=file_path,
            model_weights_path=model_weights_path,
            study_id=scan_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference pipeline error: {str(e)}")
        
    img_b64 = render_image_to_base64(file_path, "brain")
    pipeline_output["image_data_url"] = img_b64
    
    updated_record = storage.update_scan_analysis(scan_id, pipeline_output)
    meta = record.get("metadata") or extract_image_or_dicom_meta(file_path)
    
    return ScanAnalysisResponse(
        scan_id=scan_id,
        status="analyzed",
        decision_support=pipeline_output["decision_support"],
        radiology_report=pipeline_output["radiology_report"],
        report_markdown=pipeline_output["report_markdown"],
        is_valid_report=pipeline_output["is_valid_report"],
        analyzed_at=updated_record["analyzed_at"],
        image_data_url=img_b64,
        heatmap_data_url=pipeline_output.get("heatmap_data_url"),
        metadata=meta
    )

@router.get("/scans/{scan_id}")
def get_scan_detail(scan_id: str, preset: str = "brain"):
    record = storage.get_scan(scan_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Scan {scan_id} not found.")
    
    detail = dict(record)
    if not detail.get("metadata") and os.path.exists(detail.get("file_path", "")):
        detail["metadata"] = extract_image_or_dicom_meta(detail["file_path"])
        
    if os.path.exists(detail.get("file_path", "")):
        detail["image_data_url"] = render_image_to_base64(detail["file_path"], preset)
        
    return detail

@router.delete("/scans/{scan_id}")
def delete_scan(scan_id: str):
    success = storage.delete_scan(scan_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Scan {scan_id} not found.")
    return {"status": "deleted", "scan_id": scan_id}

@router.get("/scans", response_model=List[ScanSummary])
def list_scans():
    records = storage.list_scans()
    summaries = []
    for r in records:
        sev = None
        urg = None
        if r.get("analysis"):
            sev = r["analysis"]["decision_support"]["assessment"]["severity_level"]
            urg = r["analysis"]["decision_support"]["assessment"]["urgency_level"]
        summaries.append(ScanSummary(
            scan_id=r["scan_id"],
            filename=r["filename"],
            status=r["status"],
            uploaded_at=r["uploaded_at"],
            severity_level=sev,
            urgency_level=urg,
            metadata=r.get("metadata")
        ))
    return summaries

