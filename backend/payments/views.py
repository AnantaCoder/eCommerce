from django.shortcuts import render
from rest_framework import viewsets, mixins
from payments.models import Payment,PaymentGatewayLog
from payments.serializers import PaymentSerializer,PaymentGatewayLogSerializer
# Create your views here.


class PaymentListCreateView:
    pass

class PaymentDetailView:
    pass

