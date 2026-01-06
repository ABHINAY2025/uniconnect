from fastapi import FastAPI
from pydantic import BaseModel
from pipeline import process_raw_text

app = FastAPI()

class Request(BaseModel):
    text: str

@app.post("/analyze")
def analyze(req: Request):
    return process_raw_text(req.text)
