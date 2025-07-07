
from django.urls import path
from analyzer.views import CustomerReviewAnalyzerView,ItemReviewRecommendationView

urlpatterns = [
    path("", CustomerReviewAnalyzerView.as_view(), name="review-analyzer"),
    path("item/<int:item_id>/recommendation/", ItemReviewRecommendationView.as_view(), name="review-review-recommendation"),
]
