from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Trade
from .serializers import TradeSerializers
from rest_framework.decorators import action
from rest_framework.response import Response



class TradeViewSet(viewsets.ModelViewSet):
    queryset = Trade.objects.all().order_by('date')
    serializer_class = TradeSerializers
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['trade_code']
    ordering_fileds = ['date', 'close']


    @action(detail=False)
    def tradecodes(self, request):
        codes = Trade.objects.order_by().values_list('trade_code', flat=True). distinct()
        return Response(list(codes))
    
    @action(detail=False)
    def series(self, request):
        code = request.query_params.get('trade_code')
        qs = Trade.objects.all()
        if code:
            qs = qs.filter(trade_code=code)
        qs = qs.order_by('date')
        data = TradeSerializers(qs, many=True).data
        return Response(data)
