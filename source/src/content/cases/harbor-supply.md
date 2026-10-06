---
# DEMO CONTENT — invented for the pre-release preview (company, people, numbers and
# quotes are fictional). Replace with a real, approved case and remove `demo: true`.
title: "Harbor Supply Co.: reorders without guesswork"
description: "A 48-person industrial supply distributor replaced spreadsheet reordering with Odoo purchase rules and landed costs, cutting dead stock by 31% in nine months."
demo: true
scenario: distribution
order: 5
company: "Harbor Supply Co."
profile:
  industry: "Industrial & janitorial supplies"
  size: "48 people"
  state: "Cleveland, Ohio"
result:
  number: "−31%"
  label: "dead stock in nine months"
headline: "Reorders proposed by the system, approved by people."
beforeAfter:
  before: "Purchase orders built from one person’s spreadsheet"
  after: "Reorder rules with real lead times and landed costs"
apps: ["Purchase", "Inventory", "Sales", "Barcode", "Accounting"]
integrations: ["Avalara", "UPS", "EDI"]
timeline: "Live in 16 weeks"
pricingModel: "Fixed-price phases"
quote:
  text: "Reordering used to be one person’s spreadsheet and a lot of gut feel. Now Odoo proposes the purchase orders every morning and we just approve them."
  name: "Rachel Novak"
  role: "Operations Director"
cover: "../../assets/placeholders/case-distribution-2.jpg"
coverAlt: "A warehouse worker in a red cap scanning drums on a shelf with a handheld scanner"
results:
  - metric: "Dead stock value"
    before: "$412k"
    after: "$284k"
    measured: "Mar 2026"
  - metric: "Purchase orders built by hand"
    before: "All of them"
    after: "Under 10%"
    measured: "Mar 2026"
  - metric: "Landed cost per item"
    before: "Estimated"
    after: "Exact, per shipment"
    measured: "Jan 2026"
screenshots:
  - kind: inventory
    caption: "Replenishment report with suggested purchase quantities"
  - kind: orders
    caption: "Customer orders with delivery status and tracking"
whatsNext: "On Keep. Next phase: a B2B portal so contractors can reorder and see their invoices."
referenceCall: false
coDelivery: false
---

## Before

Around 6,000 SKUs, two warehouses and one buyer who knew everything. Reorders were built from a spreadsheet, landed costs were estimated once a year, and slow movers piled up in the back of the warehouse.

## Why they chose us

They needed someone who understood distribution and inventory valuation, not just software. The fixed price and the weekly demos made the project easy to approve internally.

## What we did

### Blueprint

We analysed a year of sales and purchases, measured dead stock and lead times per vendor, and agreed a fixed price for three phases.

### Build

Reorder rules with vendor lead times, landed costs on every receipt, barcode receiving and picking across both warehouses, sales tax through Avalara and UPS labels from the delivery order.

### Go-live

Warehouse by warehouse, two weeks apart. Opening stock valued with their accountant. 30 days of hypercare.

### Keep

Managed Odoo and a quarterly dead-stock review.
