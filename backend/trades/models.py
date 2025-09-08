from django.db import models

class Trade(models.Model):
    trade_code = models.CharField(max_length=50, db_index=True)
    date = models.DateField(db_index=True)
    high = models.DecimalField(max_digits=20, decimal_places=4, null=True)
    low = models.DecimalField(max_digits=20, decimal_places=4, null=True)
    open = models.DecimalField(max_digits=20, decimal_places=4, null=True)
    close = models.DecimalField(max_digits=20, decimal_places=4, null=True)
    volume = models.BigIntegerField(null=True)

    def __str__(self):
        return f"{self.trade_code} {self.date}"