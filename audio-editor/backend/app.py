from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
import os
import whisper
from pathlib import Path

# Import the router we'll create
from routers.audio import router as audio_router

# Create FastAPI app
app = FastAPI(
    title="Audio Transcription API",
    description="API for audio transcription and editing",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5001",
    "http://127.0.0.1:5001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Whisper model
print("Loading Whisper model...")
model = whisper.load_model("base")
print("Whisper model loaded")

# Include the audio router
app.include_router(audio_router, prefix="/api")

# Health check endpoint
@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

# Mount static files
frontend_path = Path("../frontend/dist")
if frontend_path.exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_path / "assets")), name="assets")

    # Serve index.html for all other routes (for client-side routing)
    @app.get("/{full_path:path}")
    async def serve_react(full_path: str):
        # Skip API routes that are already handled
        if full_path.startswith("api/"):
            return JSONResponse({"detail": "Not Found"}, status_code=404)
        
        return FileResponse(str(frontend_path / "index.html"))
else:
    print("Warning: Frontend build folder not found. Only API will be available.") 