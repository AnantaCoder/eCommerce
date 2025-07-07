from transformers import AutoTokenizer,AutoModelForSequenceClassification
import torch
import torch.nn.functional as F
from collections import Counter
MODEL_DIR = 'review-finetuned-model'

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model  = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
model.eval()

labels = [
    "Customer dissatisfaction - Consider removal or reduction ",
    "Mixed feedback - Maintain current status and observe the market ",
    "Positive sentiment - Boost supply and deliver good products"
]


def predict_sentiment(text):
    inputs = tokenizer(text,return_tensors="pt")
    with torch.no_grad():
        output = model(**inputs)
        probs = F.softmax(output.logits,dim=1)
        conf, pred = torch.max(probs, dim=1)
        return {
            "label": labels[pred.item()],
            "confidence": round(conf.item(), 4)
        }


def analyze_reviews(reviews):
    if not reviews:
        return {
            "error":"No reviews to analyze."
        }
    
    counter = Counter()
    details = []

    for review in reviews:
        res = predict_sentiment(text=review)
        counter[res["label"]] +=1
        details.append({
            "reviews":review,**res
        })
        
    top_label , count = counter.most_common(1)[0]

    summery=(
        f"Out of {len(reviews)} reviews, "
        f"{count} recommend “{top_label}”."
    )
    
    return {
        "final_recommendation":top_label,
        "summary":summery,
        "details":details
    }