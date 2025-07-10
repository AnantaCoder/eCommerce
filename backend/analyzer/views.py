from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import permissions,status
from store.permissions import IsSeller
from store.models import Item
from rest_framework.response import Response
# from analyzer.statement_utility import predict_sentiment , analyze_reviews
from gradio_client import Client
import json
# Create your views here.

GRADIO_CLIENT = Client("anantacoder/ecommerce_reviews")


class CustomerReviewAnalyzerView(APIView):
    
    # permission_classes=[IsSeller]
    permission_classes=[permissions.AllowAny]
    def post(self,request):
        text = request.data.get("text")
        
        if not text :
            return Response(
                {"error":"Text is required "}
            )
        result = GRADIO_CLIENT.predict(
            text=text,
            api_name="/single_review"
        )
        return Response({
            "result":f'{str(result)}'
        })
    
    def get(self, request):
        return Response({
            "detail": "Welcome to the analyzer server"
        })
        
        
class ItemReviewRecommendationView(APIView):
    permission_classes = [IsSeller]

    def get(self, request, item_id):
        # 1) Fetch the item
        try:
            item = Item.objects.get(pk=item_id)
        except Item.DoesNotExist:
            return Response(
                {"error": "Item does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        # 2) Gather non‑empty review comments
        reviews = [r.comment.strip() for r in item.reviews.all() if r.comment and r.comment.strip()]
        if not reviews:
            return Response(
                {
                    "final_recommendation": None,
                    "summary": "No reviews yet for this product.",
                    "details": []
                },
                status=status.HTTP_200_OK
            )

        # 3) Build the JSON payload
        payload = {"reviews": reviews}
        json_payload = json.dumps(payload)

        # 4) Call the Gradio endpoint
        try:
            result = GRADIO_CLIENT.predict(
                json_text=json_payload,
                api_name="/batch_reviews"
            )
        except Exception as e:
            return Response(
                {"error": "Failed to get review recommendations", "details": str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )

        # 5) Return exactly what the Gradio app returns
        print(result)
        return Response(result, status=status.HTTP_200_OK)
        


        
"""no database connections """