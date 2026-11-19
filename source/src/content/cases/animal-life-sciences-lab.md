---
# Real Evenmont project. The client is under NDA: no name, logo or quote is published.
title: "Animal life sciences: order to lab in one day"
description: "An animal life sciences company replaced paper folders and four legacy tools with Odoo 19 and starts lab work within one business day of an order."
scenario: services
order: 0
anonymous: true
company: "North American animal life sciences company"
profile:
  industry: "Animal life sciences laboratories"
  size: "Up to 20 Odoo users"
  state: "North America, multiple locations"
result:
  number: "1 day"
  label: "from order to lab start, down from up to a week"
headline: "Lab work starts within one business day of an order."
beforeAfter:
  before: "Paper folders and four disconnected tools"
  after: "One Odoo platform, from checkout to the lab"
apps: ["Contacts", "Sales", "Accounting", "Sign", "Website & eCommerce", "5 custom lab modules"]
integrations: ["Benchling", "NetSuite", "EBizCharge", "Avalara AvaTax", "UPS", "FedEx", "WordPress"]
timeline: "About 7 months to full rollout"
cover: "../../assets/cases/animal-life-sciences-lab.jpg"
coverAlt: "Line illustration of three sample vials, a DNA helix and a microscope"
results:
  - metric: "Order to lab start"
    before: "Up to a week"
    after: "1 business day"
    measured: "after full rollout"
  - metric: "Time to sign a contract"
    before: "1–3 days, sometimes 4"
    after: "1 business day"
    measured: "after full rollout"
  - metric: "Prepayments made online at checkout"
    before: "Typed-in invoice numbers, matched by hand"
    after: "~80%"
    measured: "after full rollout"
  - metric: "Duplicate client records"
    before: "One client in three systems"
    after: "0"
    measured: "after full rollout"
  - metric: "Legacy tools"
    before: "4 tools plus paper folders"
    after: "All retired"
    measured: "after full rollout"
  - metric: "Sales tax and nexus"
    before: "Calculated by a person"
    after: "Automatic"
    measured: "after full rollout"
resultsNote: "Compared with how the same work ran before the project."
whatsNext: "Support and continuous improvement of the live platform. Next: a customer mobile app (iOS and Android) and web portal for every service line, where clients will view and pay invoices, manage their animals and track their cases."
referenceCall: false
coDelivery: false
---

## Before

The client delivers specialized laboratory services, from assisted reproductive technologies to biological sample banking, across several service lines and locations. For its clients every procedure is a major emotional and financial commitment, and some commitments run three years or more.

Behind the scenes, about 150 requests a month moved through color-coded paper folders, four legacy tools and manual hand-offs. The same client lived in legacy industry software, a custom LIMS and QuickBooks. Staff copied client data into DocuSign by hand, card details were collected inside signed contracts and charged later, prepayments arrived through a web form with a typed-in invoice number, and a person calculated sales tax and nexus. Getting from order to lab start took up to a week.

## Our approach

A custom ERP built from scratch was too expensive. We built on Odoo 19 Enterprise instead, wrote custom modules only where the lab's work is unique, and organized everything around one object: the procedure case.

- **One record, entered once.** Every client and case is created once in Odoo and synced to the lab and finance systems.
- **Contract-first, payment-gated.** No case reaches the lab without a signed contract and payment.
- **Self-service by default.** The online store handles the contract, the payment and the case setup.
- **Compliance by design.** The system decides entity, currency, sales tax and nexus, not people.
- **Integrate, don't rebuild.** Benchling keeps the lab data and NetSuite the ledger; Odoo runs the operation.

## What we did

### Discovery

Workshops with seven stakeholder groups: leadership, the financial controller, the accountant, the lab manager, two specialist lab teams and customer success. We mapped how each service moves from request to lab work and invoicing, and reviewed the legacy tools and the paper process.

### System design

A procedure case with stages for each service line, contracts generated at checkout, two legal entities and two currencies chosen from the client's address, and the integrations with Benchling, NetSuite, EBizCharge, AvaTax, UPS and FedEx.

### Phased releases

Releases in the order the client wanted to retire its legacy tools, so each one switched another tool off. Five custom modules, including two lab management modules.

### Migration and cut-over

Clients merged from the industry software, the custom LIMS and QuickBooks into one record each; contracts moved from QuickBooks; lab data into Odoo and Benchling. Old and new systems ran side by side for about a month.

## How it runs now

Clients move from the WordPress site into the Odoo store, sign a contract generated with their details in Odoo Sign, and prepay at checkout through EBizCharge. The order reaches the back office complete; staff countersign and approve it within one business day, the procedure case opens and lab work begins. Custom emails confirm the order, the payment and every status change.

About 80% of prepayments are now made online. Most of the rest come from senior clients who order by phone, and customer success handles those orders in the same system.

The store picks the right entity and currency from the billing and delivery address, AvaTax calculates sales tax and nexus, and EBizCharge card authorization replaced card details in contracts. Clients can pay by card, ACH, eCheck or pay-by-link, each prepayment is tied to its order, and financial data flows to NetSuite, where the accounting team works.

In the lab, stored samples are tracked across storage locations, sample kits ship with UPS and FedEx labels created in Odoo, and returned kits are linked to their case on arrival.

## What changed for each team

- **Clients** order, sign and pay online in one sitting, then get email updates as their case moves.
- **Lab teams** receive cases complete, signed and paid, with stages in Odoo instead of folder colors.
- **Customer success** has orders, contracts and payments in one place, and handles phone orders and card charges from Odoo.
- **Finance and accounting** no longer match payments or calculate tax by hand, and every invoice carries the right entity and currency.
- **Leadership** has every case, contract and payment in one system of record, ready for further growth.
