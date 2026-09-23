# iPhone vs. AAPL: Buy the phone or buy the stock?

**Live site: https://aryankori.github.io/apple-stock-vs-iphone/**

This project compares the launch price of each iPhone with an equal investment in Apple stock (AAPL) on the day that iPhone went on sale. The site shows what each investment is worth today.

The project has two parts:

1. An interactive website with charts, a calculator and a personal "iPhone history" builder.
2. A formatted Excel workbook with calculation formulas.

---

## 1. What the Site Shows

| Section | What you can do |
| --- | --- |
| Headline | See the total spent on all 53 iPhones and the value of the same money in AAPL today. |
| Price chart | Explore the AAPL price since 2007. Each iPhone launch is a dot. Hover or tap a dot to see the models. Click a dot to open the model in the calculator. Change the time range and the log/linear scale. |
| Calculator | Pick an iPhone, or drag the slider through time. See the shares bought, the value today, the gain, the multiple and the annual return. |
| Rankings | Compare the multiple or the value today of every model in release order. |
| Your iPhone history | Select the iPhones that you owned. See your total spent and the value of the same purchases in AAPL. Copy a link to share your result. |
| Full table | Sort, filter and download the data as CSV or Excel. |
| Methodology | Read the formulas, the assumptions and the limits of the model. |

The **Reinvest dividends** switch changes every number on the page. When the switch is off, the model uses the share price only. When the switch is on, the model reinvests each dividend in AAPL.

The site has light and dark themes. You can use the keyboard to move through the charts.

---

## 2. Formulas

The model uses these equations for each iPhone:

1. **Shares bought**
   $$\text{Shares} = \frac{\text{Launch price}}{\text{AAPL close on launch day}}$$

2. **Value today**
   $$\text{Value} = \text{Shares} \times \text{Latest AAPL close}$$

3. **Gain**
   $$\text{Gain} = \text{Value} - \text{Launch price}$$

4. **Return on investment (ROI) and multiple**
   $$\text{Multiple} = \frac{\text{Value}}{\text{Launch price}}, \qquad \text{ROI} = \text{Multiple} - 1$$

5. **Annual return (CAGR)**
   $$\text{CAGR} = \text{Multiple}^{1/\text{years held}} - 1$$

If an iPhone went on sale on a weekend or a holiday, the model uses the close of the last trading day before that date.

---

## 3. Stock Splits and Dividends

All share prices are split-adjusted. Apple completed two stock splits during the iPhone timeline:

- **June 2014**: 7-for-1 stock split.
- **August 2020**: 4-for-1 stock split.

With **Reinvest dividends** on, the model uses the Yahoo Finance dividend-adjusted close. This is equal to buying more AAPL with each dividend on its ex-dividend date. The model does not include taxes or fees.

---

## 4. Data

### 4.1 AAPL prices

`scripts/fetch-aapl.mjs` downloads the full daily AAPL history from Yahoo Finance. It writes the result to `src/data/aapl.json`. The site bundles this file at build time.

The repository contains a snapshot of this file. If Yahoo Finance is not available, the build uses the snapshot.

### 4.2 iPhone models

`src/data/iphones.ts` contains 53 models, from the original iPhone (2007) to the iPhone 18 Pro Max (2026). Each row has:

- The first US sale date.
- The US launch price of the base storage model.
- The split-adjusted AAPL close on that date (a reference copy for the Excel workbook).

A unit test compares each stored close with the price history. The test fails if a date or a price is incorrect.

### 4.3 Corrections to the original spreadsheet

Version 2 corrects these rows:

| Row | Before | After |
| --- | --- | --- |
| iPhone (2007) | Labeled "iPhone 3G" | Labeled "iPhone". The 2007 date and $499 price are for the original iPhone. |
| iPhone 5s | 2013-09-21, $17.52 | 2013-09-20, $16.69 |
| iPhone 12, 12 Pro | 2020-11-13, $119.26 | 2020-10-23, $115.04 |
| iPhone 14, 14 Pro, 14 Pro Max | 2022-10-07, $140.09 | 2022-09-16, $150.70 |
| iPhone 15 Plus, 15 Pro, 15 Pro Max | Weekend dates, $176.08 | 2023-09-22, $174.79 |
| iPhone 16 series | $226.31 | $228.20 |
| iPhone 17 series | $244.60 | $245.50 |
| iPhone 17e | $314.97 | $260.81 |

Version 2 also adds the iPhone SE (2016), the iPhone 16e (2025), the iPhone 18 Pro and the iPhone 18 Pro Max (2026).

---

## 5. Project Structure

```text
apple-stock-vs-iphone/
├── .github/workflows/deploy.yml   # Build, test and deploy to GitHub Pages
├── scripts/fetch-aapl.mjs         # Download the AAPL price history
├── src/
│   ├── components/                # Page sections and charts
│   ├── data/
│   │   ├── aapl.json              # AAPL daily history (generated)
│   │   └── iphones.ts             # iPhone models, dates and prices
│   ├── lib/                       # Calculations, scales, formatting, hooks
│   └── App.tsx                    # Page layout and shared state
├── public/
│   └── outsoucrd apple sheet.xlsx # Downloadable Excel workbook
├── update_sheet.py                # Script to update the Excel workbook
└── test_system.py                 # Tests for the workbook and its dataset
```

---

## 6. Run the Site Locally

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Download the latest AAPL prices
npm run fetch-data

# 3. Start the development server at http://localhost:3000
npm run dev

# 4. Run the unit tests
npm test

# 5. Build for production (output in dist/)
npm run build
```

---

## 7. Deployment

GitHub Actions deploys the site to GitHub Pages. The workflow is `.github/workflows/deploy.yml`.

The workflow runs:

- On each push to `main`.
- Each hour during US trading hours on weekdays, and one time after the market closes. The scheduled runs download the latest AAPL prices, so the site stays current.
- On request, from the **Actions** tab (**Run workflow**).

Each run downloads the prices, runs the unit tests, builds the site and publishes it.

> **Note:** GitHub disables scheduled workflows in a public repository after 60 days with no activity. If the prices stop updating, open the **Actions** tab and enable the workflow again.

---

## 8. Update the Excel Workbook

To refresh the Excel workbook with the latest market price, run this command:

```bash
uv run --with openpyxl python update_sheet.py
```

The script gets the current AAPL price from Yahoo Finance and updates the workbook in these locations:

- `outsoucrd apple sheet.xlsx` (repository root)
- `public/outsoucrd apple sheet.xlsx` (website download)
- `~/Downloads/outsoucrd apple sheet.xlsx` (local Downloads folder)

---

## 9. Acknowledgments and Credits

- **Original Ideator & Spreadsheet Creator:** **Outsourced** ([Steam Profile](https://steamcommunity.com/id/Outsourced/)). Special thanks to Outsourced for creating the original spreadsheet concept years ago.
- **Software Engineer & Real-Time Sync:** **aryankori** ([GitHub Profile](https://github.com/aryankori)). Engineered the full-stack real-time calculation pipeline, responsive web application, and mathematical validation.

This project is not investment advice. Past returns do not predict future returns.

---

## 10. Specification and Writing Standard

All documentation in this repository follows the **ASD-STE100 Simplified Technical English** specification.
