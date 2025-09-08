import os
import json
import pandas as pd
from django.core.management.base import BaseCommand
from trades.models import Trade
from django.db import transaction
from datetime import datetime

class Command(BaseCommand):
    help = "Seed trades from CSV or JSON. Usage: python manage.py seed_trades path/to/file.json"

    def add_arguments(self, parser):
        parser.add_argument('file', type=str, help='Path to CSV or JSON file')

    def handle(self, *args, **options):
        filepath = options['file']
        if not os.path.exists(filepath):
            self.stderr.write(f"File not found: {filepath}")
            return

        ext = os.path.splitext(filepath)[1].lower()
        if ext == '.csv':
            df = pd.read_csv(filepath)
        elif ext == '.json':
            try:
                df = pd.read_json(filepath)
            except ValueError:
                with open(filepath, 'r', encoding='utf-8') as f:
                    raw = json.load(f)

                if isinstance(raw, dict):
                    for k in ('data', 'results', 'rows', 'items'):
                        if k in raw and isinstance(raw[k], list):
                            raw = raw[k]
                            break
                    else:
                        for v in raw.values():
                            if isinstance(v, list):
                                raw = v
                                break
                if not isinstance(raw, list):
                    self.stderr.write("JSON file does not contain a top-level list of records.")
                    return
                df = pd.json_normalize(raw)
        else:
            self.stderr.write("Unsupported file type. Use .csv or .json")
            return

        mapping = {
            'trade_code': ['trade_code', 'symbol', 'tradeCode', 'code', 'TradeCode'],
            'date':       ['date', 'Date', 'trade_date', 'datetime'],
            'open':       ['open', 'Open'],
            'high':       ['high', 'High'],
            'low':        ['low', 'Low'],
            'close':      ['close', 'Close'],
            'volume':     ['volume', 'Volume', 'vol']
        }

        def pick(col_list, row):
            for name in col_list:
                if name in row and pd.notna(row[name]):
                    return row[name]
            return None

        def safe_num(x):
            if x is None:
                return None
            try:
                return float(x)
            except Exception:
                return None

        trades = []
        for _, r in df.iterrows():
            code = pick(mapping['trade_code'], r)
            date_raw = pick(mapping['date'], r)
            if pd.isna(date_raw) or date_raw is None:
                continue
    
            try:
                date_val = pd.to_datetime(date_raw).date()
            except Exception:
                try:
                    date_val = datetime.strptime(str(date_raw).split('T')[0], '%Y-%m-%d').date()
                except Exception:
                    continue

            open_v = safe_num(pick(mapping['open'], r))
            high_v = safe_num(pick(mapping['high'], r))
            low_v = safe_num(pick(mapping['low'], r))
            close_v = safe_num(pick(mapping['close'], r))
            vol_v = pick(mapping['volume'], r)
            try:
                vol_v = int(vol_v) if pd.notna(vol_v) else None
            except Exception:
                vol_v = None

            trades.append(Trade(
                trade_code = str(code) if code is not None else '',
                date = date_val,
                open = open_v,
                high = high_v,
                low = low_v,
                close = close_v,
                volume = vol_v
            ))

        if not trades:
            self.stderr.write("No valid trades found in file.")
            return

        with transaction.atomic():
            Trade.objects.all().delete()
            Trade.objects.bulk_create(trades)

        self.stdout.write(self.style.SUCCESS(f"Inserted {len(trades)} trades from {filepath}"))
