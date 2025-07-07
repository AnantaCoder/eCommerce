from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import permissions,status
from store.permissions import IsSeller
from store.models import Item
from rest_framework.response import Response
from analyzer.statement_utility import predict_sentiment , analyze_reviews
# Create your views here.


class CustomerReviewAnalyzerView(APIView):
    
    # permission_classes=[IsSeller]
    permission_classes=[permissions.AllowAny]
    def post(self,request):
        text = request.data.get("text")
        
        if not text :
            return Response(
                {"error":"Text is required "}
            )
        result = predict_sentiment(text)
        return Response({
            "result":f'{str(result)}'
        })
    
    def get(self, request):
        return Response({
            "detail": "Welcome to the analyzer server"
        })
        
        
class ItemReviewRecommendationView(APIView):
    
    
    permission_classes=[IsSeller]
    def get(self,request,item_id):
        
        try:
            item = Item.objects.get(pk=item_id)
        except Item.DoesNotExist:
            return Response({
                "error":"item does not exists"
            })
        
            
        reviews = item.reviews.all()
        reviews = [r.comment for r in reviews if r.comment.strip()]
        if not reviews:
            return Response(
                {
                    "final_recommendation": None,
                    "summary": "No reviews yet for this product.",
                    "details": []
                },
                status=status.HTTP_200_OK
            )
        
        result = analyze_reviews(reviews)
        return Response(result,status=status.HTTP_200_OK)
        
        
        