from fastapi import APIRouter, File, UploadFile, HTTPException, Form, BackgroundTasks
import whisper
from fastapi.responses import JSONResponse, FileResponse
from pydub import AudioSegment
import os
from typing import List, Dict, Any
import shutil
from pathlib import Path

router = APIRouter()

# Load the Whisper model once when the module is imported
model = whisper.load_model("base")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    print(f"Received upload request for file: {file.filename}")
    
    try:
        # Save the uploaded file
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        print(f"File saved to: {file_path}")
        
        # Transcribe the audio using Whisper
        print("Starting transcription...")
        result = model.transcribe(file_path)
        print("Transcription complete")
        
        # Extract the full transcription
        transcription = result["text"]
        
        # Extract the segments with timing information
        segments = []
        for segment in result["segments"]:
            segments.append({
                "text": segment["text"],
                "start": segment["start"],
                "end": segment["end"]
            })
        
        print(f"Transcription has {len(segments)} segments")
        
        return {
            "transcription": transcription,
            "segments": segments
        }
    except Exception as e:
        print(f"Error in upload_file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/edit-audio")
async def edit_audio(data: Dict[str, Any]):
    try:
        filename = data["filename"]
        segments_to_keep = data["segments"]
        
        # Load the original audio file
        audio_path = os.path.join(UPLOAD_FOLDER, filename)
        print(f"Loading audio from: {audio_path}")
        audio = AudioSegment.from_file(audio_path)
        
        # Create new audio with only kept segments
        new_audio = AudioSegment.empty()
        for segment in segments_to_keep:
            start = segment["start"] * 1000  # Convert to milliseconds
            end = segment["end"] * 1000
            new_audio += audio[start:end]
        
        # Export the new audio
        output_path = os.path.join(UPLOAD_FOLDER, f"edited_{filename}")
        new_audio.export(output_path, format="mp3")
        print(f"Edited audio saved to: {output_path}")
        
        return FileResponse(
            path=output_path, 
            filename=f"edited_{filename}", 
            media_type="audio/mpeg"
        )
    except Exception as e:
        print(f"Error in edit_audio: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 