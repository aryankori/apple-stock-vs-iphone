"""
Verification test suite for Apple Stock vs iPhone calculations and consistency.
"""

import os
import openpyxl
from update_sheet import IPHONE_DATASET, fetch_live_aapl_price

def test_dataset_completeness():
    print(f"Checking dataset completeness: {len(IPHONE_DATASET)} models loaded.")
    assert len(IPHONE_DATASET) == 49, f"Expected 49 models, got {len(IPHONE_DATASET)}"
    print("Dataset completeness: PASS")

def test_mathematical_consistency():
    price = 325.70
    total_cost = sum(m[2] for m in IPHONE_DATASET)
    total_shares = sum(m[2] / m[3] for m in IPHONE_DATASET)
    total_value = total_shares * price
    total_profit = total_value - total_cost
    overall_roi = total_profit / total_cost

    print(f"Total iPhone Cost: ${total_cost:,.2f}")
    print(f"Total AAPL Shares: {total_shares:.2f}")
    print(f"Total Invested Value @ ${price}: ${total_value:,.2f}")
    print(f"Total Net Profit: ${total_profit:,.2f}")
    print(f"Overall Cumulative ROI: {overall_roi*100:.2f}%")

    # Verify iPhone 3G specific invariants
    iphone_3g = IPHONE_DATASET[0]
    assert iphone_3g[0] == "iPhone 3G"
    shares_3g = iphone_3g[2] / iphone_3g[3] # 499 / 4.36 = 114.4495
    val_3g = shares_3g * price
    roi_3g = (val_3g / iphone_3g[2]) - 1
    assert round(shares_3g, 2) == 114.45
    print(f"iPhone 3G ROI: +{roi_3g*100:.2f}% (Shares: {shares_3g:.4f})")
    print("Mathematical Invariants: PASS")

def test_workbook_integrity():
    wb_path = os.path.join(os.path.dirname(__file__), "outsoucrd apple sheet.xlsx")
    assert os.path.exists(wb_path), f"Workbook missing at {wb_path}"
    wb = openpyxl.load_workbook(wb_path, data_only=False)
    ws = wb.active
    assert ws.max_row == 51, f"Expected 51 rows (headers + 49 models + 1 summary), got {ws.max_row}"
    # Verify row 2 formulas
    assert ws.cell(2, 6).value == "=C2/D2*E2"
    assert ws.cell(2, 7).value == "=F2-C2"
    assert ws.cell(2, 8).value == "=(F2/C2)-1"
    print("Workbook Integrity & Formulas: PASS")

if __name__ == "__main__":
    test_dataset_completeness()
    test_mathematical_consistency()
    test_workbook_integrity()
    print("ALL TESTS PASSED SUCCESSFULLY!")
