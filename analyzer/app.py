from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F

model_dir = "./review-finetuned-model"  
tokenizer = AutoTokenizer.from_pretrained(model_dir)
model = AutoModelForSequenceClassification.from_pretrained(model_dir)
model.eval()

labels = ["Discontinue", "Keep", "Increase"]

app = FastAPI(title="Review Sentiment API")

class Review(BaseModel):
    text: str

@app.post("/analyze_review")
def predict(review: Review):
    inputs = tokenizer(review.text, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
        probs = F.softmax(outputs.logits, dim=1)
        conf, pred = torch.max(probs, dim=1)
        label = labels[pred.item()]
        return {
            "label": label,
            "confidence": round(conf.item(), 4)
        }
@app.get("/", response_class=HTMLResponse)
def home():
    return "<h1>Welcome to the customer sentiment analysis BERT-based model</h1>"