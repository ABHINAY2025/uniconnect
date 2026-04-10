from fastapi import FastAPI
from pydantic import BaseModel
from semantic_engine.pipeline import process_experience

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

class Request(BaseModel):
    text: str

@app.post("/analyze")
def analyze(req: Request):
    return process_experience(req.text)
