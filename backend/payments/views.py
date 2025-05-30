from django.shortcuts import render
from rest_framework import permissions, mixins,generics, viewsets
from payments.models import Payments,PaymentsGatewayLog
from payments.serializers import PaymentsSerializer,PaymentsGatewayLogSerializer
# Create your views here.
from rest_framework.views import *
from rest_framework.response import *

# Payment list + create
class PaymentListCreateViewSet(mixins.ListModelMixin,
                               mixins.CreateModelMixin,
                               viewsets.GenericViewSet):
    
    
    queryset = Payments.objects.all()
    serializer_class = PaymentsSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, status="pending")

# Payment retrieve + update + delete
class PaymentDetailViewSet(mixins.RetrieveModelMixin,
                           mixins.UpdateModelMixin,
                           mixins.DestroyModelMixin,
                           viewsets.GenericViewSet):
    queryset = Payments.objects.all()
    serializer_class = PaymentsSerializer

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)

# Gateway log list + create
class PaymentsGatewayLogListCreateViewSet(mixins.ListModelMixin,
                                          mixins.CreateModelMixin,
                                          viewsets.GenericViewSet):
    queryset = PaymentsGatewayLog.objects.all()
    serializer_class = PaymentsGatewayLogSerializer

# Gateway log retrieve 
class PaymentsGatewayLogDetailViewSet(mixins.RetrieveModelMixin,
                                      viewsets.GenericViewSet):
    queryset = PaymentsGatewayLog.objects.all()
    serializer_class = PaymentsGatewayLogSerializer