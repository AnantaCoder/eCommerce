# _ is the lazy load feature 
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F
from collections import Counter

MODEL_DIR = './review-finetuned-model'

# these start out None, and will be initialized on first call
_tokenizer = None
_model     = None

labels = [
    "Customer dissatisfaction - Consider removal or reduction ",
    "Mixed feedback - Maintain current status and observe the market ",
    "Positive sentiment - Boost supply and deliver good products"
]

def _load_model():
    global _tokenizer, _model
    if _tokenizer is None or _model is None:
        _tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
        _model     = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
        _model.eval()
    return _tokenizer, _model

def predict_sentiment(text):
    tokenizer, model = _load_model()
    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    with torch.no_grad():
        output = model(**inputs)
        probs = F.softmax(output.logits, dim=1)
        conf, pred = torch.max(probs, dim=1)
    return {
        "label": labels[pred.item()],
        "confidence": round(conf.item(), 4)
    }

def analyze_reviews(reviews):
    if not reviews:
        return {"error": "No reviews to analyze."}

    counter = Counter()
    details = []
    for review in reviews:
        res = predict_sentiment(review)
        counter[res["label"]] += 1
        details.append({"review": review, **res})

    top_label, count = counter.most_common(1)[0]
    summary = (
        f"Out of {len(reviews)} reviews, "
        f"{count} recommend “{top_label}.”"
    )
    return {
        "final_recommendation": top_label,
        "summary": summary,
        "details": details
    }
