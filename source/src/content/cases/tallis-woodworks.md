---
# DEMO CONTENT — invented for the pre-release preview (company, people, numbers and
# quotes are fictional). Replace with a real, approved case and remove `demo: true`.
title: "Tallis Woodworks: the real cost of every table"
description: "A 58-person furniture maker moved bills of materials, work orders and costing into Odoo and raised gross margin by 11 points in the first year."
demo: true
scenario: manufacturing
order: 3
company: "Tallis Woodworks"
profile:
  industry: "Custom furniture"
  size: "58 people"
  state: "Asheville, North Carolina"
result:
  number: "+11 pts"
  label: "gross margin after the first year"
headline: "The real cost of every table, down to the hardware."
beforeAfter:
  before: "Production planned on a whiteboard"
  after: "Work orders, bills of materials and real unit costs"
apps: ["Manufacturing", "Inventory", "Purchase", "Quality", "Sales", "Accounting"]
integrations: ["Storefront connector", "Avalara"]
timeline: "Live in 5 months"
pricingModel: "Fixed-price phases"
quote:
  text: "We were pricing tables from a cost sheet nobody had updated in years. Now every work order shows what the table really cost us, down to the hardware."
  name: "Greg Lindqvist"
  role: "Owner"
cover: "../../assets/placeholders/case-manufacturing.jpg"
coverAlt: "Close-up of hands assembling a wooden furniture frame in a workshop"
results:
  - metric: "Unit cost known"
    before: "Estimated once a year"
    after: "On every work order"
    measured: "Feb 2026"
  - metric: "Gross margin"
    before: "27%"
    after: "38%"
    measured: "Apr 2026"
  - metric: "Orders delivered on time"
    before: "71%"
    after: "94%"
    measured: "Apr 2026"
screenshots:
  - kind: production
    caption: "Work orders by workcenter for the week"
  - kind: costing
    caption: "Real cost per unit: materials, labor and overhead"
whatsNext: "On Keep. Next phase: a product configurator for custom sizes and finishes on their web store."
referenceCall: true
coDelivery: true
---

## Before

Production was planned on a whiteboard, lumber was ordered when someone noticed the rack was empty, and product costs came from a spreadsheet updated once a year. Some best-sellers were quietly losing money.

## Why they chose us

Light manufacturing is our sweet spot: bills of materials, work orders and costing without an enterprise MRP project. The Blueprint put a fixed price on each phase, and their accountant agreed the costing method before we built anything.

## What we did

### Blueprint

We costed their ten best-selling products the old way and the new way, mapped the shop floor into four workcenters and agreed a fixed price for three phases.

### Build

Bills of materials with routings, work orders by workcenter, purchase with reorder rules for lumber and hardware, quality checks before finishing, and costing that flows into the books.

### Go-live

One product line first, then the rest over three weeks. Shop leads trained on tablets at their stations. 30 days of hypercare.

### Keep

Managed Odoo and a monthly margin review with the owner.
