from rest_framework import serializers
from .models import Trade

class TradeSerializers(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = '__all__'