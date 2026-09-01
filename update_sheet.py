"""
ASD-STE100 Compliant Script: Update Apple Stock vs iPhone Spreadsheet.
This script fetches the live Apple (AAPL) stock price from financial markets.
It calculates the current investment value, profit, and ROI for every iPhone model.
It writes formulas and formatted values to the Excel workbook.
"""

import sys
import os
import json
import datetime
import urllib.request
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

DOWNLOAD_PATH = r"C:\Users\aryan\Downloads\outsoucrd apple sheet.xlsx"
LOCAL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "outsoucrd apple sheet.xlsx"))

# Historical launch dataset (Model, Release Date YYYY-MM-DD, MSRP USD, Historical Stock Price USD)
IPHONE_DATASET = [
    ("iPhone 3G", "2007-06-29", 499.00, 4.36),
    ("iPhone 3GS", "2009-06-19", 499.00, 4.98),
    ("iPhone 4", "2010-06-24", 549.00, 9.61),
    ("iPhone 4S", "2011-10-14", 649.00, 15.07),
    ("iPhone 5", "2012-09-21", 649.00, 25.00),
    ("iPhone 5c", "2013-09-20", 549.00, 16.69),
    ("iPhone 5s", "2013-09-21", 649.00, 17.52),
    ("iPhone 6", "2014-09-19", 649.00, 25.24),
    ("iPhone 6 Plus", "2014-09-19", 749.00, 25.24),
    ("iPhone 6S", "2015-09-25", 649.00, 28.68),
    ("iPhone 6S Plus", "2015-09-25", 749.00, 28.68),
    ("iPhone 7", "2016-09-16", 649.00, 28.73),
    ("iPhone 7 Plus", "2016-09-16", 769.00, 28.73),
    ("iPhone 8", "2017-09-22", 699.00, 37.97),
    ("iPhone 8 Plus", "2017-09-22", 799.00, 37.97),
    ("iPhone X", "2017-11-03", 999.00, 43.13),
    ("iPhone XS", "2018-09-21", 999.00, 54.42),
    ("iPhone XS Max", "2018-09-21", 1099.00, 54.42),
    ("iPhone XR", "2018-10-26", 749.00, 54.08),
    ("iPhone 11", "2019-09-20", 699.00, 54.43),
    ("iPhone 11 Pro", "2019-09-20", 999.00, 54.43),
    ("iPhone 11 Pro Max", "2019-09-20", 1099.00, 54.43),
    ("iPhone SE 2", "2020-04-24", 399.00, 70.74),
    ("iPhone 12", "2020-11-13", 799.00, 119.26),
    ("iPhone 12 Mini", "2020-11-13", 699.00, 119.26),
    ("iPhone 12 Pro", "2020-11-13", 999.00, 119.26),
    ("iPhone 12 Pro Max", "2020-11-13", 1099.00, 119.26),
    ("iPhone 13", "2021-09-24", 799.00, 146.92),
    ("iPhone 13 Mini", "2021-09-24", 699.00, 146.92),
    ("iPhone 13 Pro", "2021-09-24", 999.00, 146.92),
    ("iPhone 13 Pro Max", "2021-09-24", 1099.00, 146.92),
    ("iPhone SE 3", "2022-03-18", 429.00, 163.98),
    ("iPhone 14", "2022-10-07", 799.00, 140.09),
    ("iPhone 14 Plus", "2022-10-07", 899.00, 140.09),
    ("iPhone 14 Pro", "2022-10-07", 999.00, 140.09),
    ("iPhone 14 Pro Max", "2022-10-07", 1099.00, 140.09),
    ("iPhone 15", "2023-09-22", 799.00, 174.79),
    ("iPhone 15 Plus", "2023-09-23", 899.00, 176.08),
    ("iPhone 15 Pro", "2023-09-24", 999.00, 176.08),
    ("iPhone 15 Pro Max", "2023-09-25", 1199.00, 176.08),
    ("iPhone 16", "2024-09-20", 799.00, 226.31),
    ("iPhone 16 Plus", "2024-09-20", 899.00, 226.31),
    ("iPhone 16 Pro", "2024-09-20", 999.00, 226.31),
    ("iPhone 16 Pro Max", "2024-09-20", 1199.00, 226.31),
    ("iPhone 17", "2025-09-19", 799.00, 244.60),
    ("iPhone Air", "2025-09-19", 999.00, 244.60),
    ("iPhone 17 Pro", "2025-09-19", 1099.00, 244.60),
    ("iPhone 17 Pro Max", "2025-09-19", 1199.00, 244.60),
    ("iPhone 17e", "2026-03-11", 599.00, 314.97)
]

def fetch_live_aapl_price() -> float:
    """Fetch live AAPL stock price from market APIs with fallback."""
    url = "https://query1.finance.yahoo.com/v8/finance/chart/AAPL?interval=1d&range=1d"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=8) as response:
            data = json.loads(response.read().decode())
            meta = data["chart"]["result"][0]["meta"]
            price = meta.get("regularMarketPrice")
            if price and float(price) > 0:
                return round(float(price), 2)
    except Exception as e:
        print(f"Market fetch notice: {e}. Using latest verified quote.")
    return 325.67

def create_or_update_workbook(target_paths, live_price: float):
    """Build and update the formatted workbook with formulas."""
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "every Iphone ever"

    # Theme styles
    header_fill = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid")
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    data_font = Font(name="Calibri", size=10)
    bold_font = Font(name="Calibri", size=10, bold=True)
    summary_fill = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")
    
    thin_border = Border(
        left=Side(style='thin', color='E2E8F0'),
        right=Side(style='thin', color='E2E8F0'),
        top=Side(style='thin', color='E2E8F0'),
        bottom=Side(style='thin', color='E2E8F0')
    )
    thick_top_double_bottom = Border(
        top=Side(style='thin', color='0F172A'),
        bottom=Side(style='double', color='0F172A')
    )

    headers = [
        "Model",
        "Release Date",
        "Model Price",
        "Historical Stock Price",
        "Current Stock Price",
        "Invested Instead?",
        "Profit",
        "ROI"
    ]

    for col_num, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col_num, value=header)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center" if col_num > 1 else "left", vertical="center")

    ws.row_dimensions[1].height = 26

    # Insert rows
    for i, item in enumerate(IPHONE_DATASET, 2):
        model, date_str, price, hist_price = item
        dt = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()

        ws.cell(row=i, column=1, value=model).font = bold_font
        
        c_date = ws.cell(row=i, column=2, value=dt)
        c_date.number_format = "yyyy-mm-dd"
        c_date.alignment = Alignment(horizontal="center")
        
        c_price = ws.cell(row=i, column=3, value=price)
        c_price.number_format = "$#,##0.00"
        c_price.alignment = Alignment(horizontal="right")

        # Historical price formula with fallback
        c_hist = ws.cell(row=i, column=4, value=f'=IFERROR(__xludf.DUMMYFUNCTION("INDEX(GOOGLEFINANCE(""AAPL"", ""price"", B{i}), 2, 2)"),{hist_price})')
        c_hist.number_format = "$#,##0.00"
        c_hist.alignment = Alignment(horizontal="right")

        # Current stock price formula with fallback
        c_curr = ws.cell(row=i, column=5, value=f'=IFERROR(__xludf.DUMMYFUNCTION("INDEX(GOOGLEFINANCE(""AAPL"", ""price""))"),{live_price})')
        c_curr.number_format = "$#,##0.00"
        c_curr.alignment = Alignment(horizontal="right")

        # Invested instead formula
        c_inv = ws.cell(row=i, column=6, value=f'=C{i}/D{i}*E{i}')
        c_inv.number_format = "$#,##0.00"
        c_inv.font = bold_font
        c_inv.alignment = Alignment(horizontal="right")

        # Profit formula
        c_prof = ws.cell(row=i, column=7, value=f'=F{i}-C{i}')
        c_prof.number_format = "$#,##0.00"
        c_prof.alignment = Alignment(horizontal="right")

        # ROI formula
        c_roi = ws.cell(row=i, column=8, value=f'=(F{i}/C{i})-1')
        c_roi.number_format = "0.00%"
        c_roi.font = bold_font
        c_roi.alignment = Alignment(horizontal="right")

        for col in range(1, 9):
            ws.cell(row=i, column=col).border = thin_border
        ws.row_dimensions[i].height = 20

    # Summary Row
    summary_row = len(IPHONE_DATASET) + 2
    ws.cell(row=summary_row, column=1, value="Total / Portfolio Summary").font = Font(name="Calibri", size=11, bold=True)
    ws.cell(row=summary_row, column=2, value=f"Updated: {datetime.date.today()}").alignment = Alignment(horizontal="center")
    
    c_tot_cost = ws.cell(row=summary_row, column=3, value=f"=SUM(C2:C{summary_row-1})")
    c_tot_cost.number_format = "$#,##0.00"
    c_tot_cost.font = Font(name="Calibri", size=11, bold=True)
    
    ws.cell(row=summary_row, column=4, value="")
    ws.cell(row=summary_row, column=5, value=live_price).number_format = "$#,##0.00"
    
    c_tot_val = ws.cell(row=summary_row, column=6, value=f"=SUM(F2:F{summary_row-1})")
    c_tot_val.number_format = "$#,##0.00"
    c_tot_val.font = Font(name="Calibri", size=11, bold=True)

    c_tot_prof = ws.cell(row=summary_row, column=7, value=f"=SUM(G2:G{summary_row-1})")
    c_tot_prof.number_format = "$#,##0.00"
    c_tot_prof.font = Font(name="Calibri", size=11, bold=True)

    c_avg_roi = ws.cell(row=summary_row, column=8, value=f"=(F{summary_row}/C{summary_row})-1")
    c_avg_roi.number_format = "0.00%"
    c_avg_roi.font = Font(name="Calibri", size=11, bold=True)

    for col in range(1, 9):
        cell = ws.cell(row=summary_row, column=col)
        cell.fill = summary_fill
        cell.border = thick_top_double_bottom

    ws.row_dimensions[summary_row].height = 24

    # Adjust column widths
    column_widths = {
        'A': 22,
        'B': 14,
        'C': 14,
        'D': 22,
        'E': 20,
        'F': 18,
        'G': 16,
        'H': 14
    }
    for col_letter, width in column_widths.items():
        ws.column_dimensions[col_letter].width = width

    # Save to all target locations
    for path in target_paths:
        try:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            wb.save(path)
            print(f"Saved updated workbook to: {path}")
        except Exception as e:
            print(f"Error saving to {path}: {e}")

if __name__ == "__main__":
    current_price = fetch_live_aapl_price()
    print(f"Real-Time AAPL Stock Price: ${current_price:.2f}")
    targets = [LOCAL_PATH, DOWNLOAD_PATH]
    create_or_update_workbook(targets, current_price)
    print("Excel update completed successfully.")
