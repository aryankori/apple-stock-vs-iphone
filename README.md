# Apple Stock vs iPhone Investment Tracker

This project calculates financial returns from Apple stock (AAPL). It compares the retail price of each iPhone model to an equivalent investment in Apple stock on that model's release date.

The project includes two interfaces:
1. A dynamic web dashboard with live market price updates.
2. A formatted Excel workbook with automatic calculation formulas.

---

## 1. Mathematical Formulas

The model uses four primary equations for each iPhone row:

1. **Shares Acquired**:
   $$\text{Shares} = \frac{\text{Model MSRP}}{\text{Historical Stock Price}}$$

2. **Invested Value Today**:
   $$\text{Invested Value} = \text{Shares} \times \text{Current Stock Price}$$

3. **Net Dollar Profit**:
   $$\text{Profit} = \text{Invested Value} - \text{Model MSRP}$$

4. **Return on Investment (ROI)**:
   $$\text{ROI} = \frac{\text{Invested Value} - \text{Model MSRP}}{\text{Model MSRP}} = \frac{\text{Invested Value}}{\text{Model MSRP}} - 1$$

---

## 2. Stock Split Adjustments

Historical share prices use split adjustments. Apple completed two stock splits during the iPhone timeline:
- **June 9, 2014**: 7-for-1 stock split.
- **August 28, 2020**: 4-for-1 stock split.

Split adjustments keep the share counts and investment valuations mathematically accurate across all 49 iPhone models.

---

## 3. Project Structure

```text
apple-stock-vs-iphone/
├── src/
│   ├── components/       # UI components (Header, KPIs, Simulator, Chart, Table)
│   ├── data/             # Historical iPhone dataset (49 models)
│   ├── services/         # Live market API services
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Calculation logic and formatters
├── public/
│   └── outsoucrd apple sheet.xlsx   # Updated downloadable Excel workbook
├── update_sheet.py       # Python script to update the Excel workbook
└── package.json          # Project dependencies
```

---

## 4. Run the Web Application Locally

To start the development server, run these commands:

```bash
# 1. Install dependencies
npm install

# 2. Start the local Vite server
npm run dev

# 3. Build for production
npm run build
```

---

## 5. Update the Excel Workbook

To refresh the Excel sheet with the latest market price from the terminal:

```bash
uv run --with openpyxl python update_sheet.py
```

The script fetches the current AAPL price from Yahoo Finance and updates the workbook at:
- `outsoucrd apple sheet.xlsx`
- `public/outsoucrd apple sheet.xlsx`
- `C:\Users\aryan\Downloads\outsoucrd apple sheet.xlsx`

---

## 6. Specification and Writing Standard

All documentation in this repository follows the **ASD-STE100 Simplified Technical English** specification.
