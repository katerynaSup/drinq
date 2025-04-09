from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
import os
import whisper
from pathlib import Path

# Import the router we'll create
from routers import drinks

# Create FastAPI app
app = FastAPI(
    title="Bar Drink Recommender",
    description="An API for recommending bar drinks based on user preferences",
    version="1.0.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Whisper model
print("Loading Whisper model...")
model = whisper.load_model("base")
print("Whisper model loaded")

# Include the audio router
app.include_router(drinks.router, prefix="/api", tags=["drinks"])

# Create the data directory if it doesn't exist
data_dir = Path(__file__).parent / "data"
os.makedirs(data_dir, exist_ok=True)

# Ensure the drinks.json file exists
drinks_file = data_dir / "drinks.json"
if not drinks_file.exists():
    with open(drinks_file, "w") as f:
        f.write("[]")  # Initialize with empty array

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

# Make sure the API can access the data directory
app.mount("/data", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "data")), name="data")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True) 