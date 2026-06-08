# Medical Billing Software - System Architecture

## Objective

Build a functional MVP medical billing and inventory management system within 2–3 hours.

The system should allow:

* Medicine Inventory Management
* Expiry Date Tracking
* Stock Management
* Billing/POS
* Printable Invoice Generation
* Dashboard Overview

---

# Tech Stack

## Frontend

* React
* Vite
* TypeScript
* Tailwind CSS
* Shadcn UI

---

## Backend

* Node.js
* Express.js

Responsibilities:

* API Routes
* Business Logic
* Billing Operations
* Inventory Operations

---

## Database

### Supabase PostgreSQL

Tables:

* medicines
* bills
* bill_items

Supabase handles:

* Authentication
* Database
* Row Level Security

---

# High Level Architecture

Frontend (React)

↓

Express Backend

↓

Supabase PostgreSQL

↓

Bill Generation Service

↓

Printable Invoice

---

# Core Modules

## 1. Authentication

Supabase Auth

Features:

* Login
* Logout

No registration UI for MVP.

Owner account created manually.

---

## 2. Dashboard

Display:

* Total Medicines
* Low Stock Medicines
* Expiring Soon Medicines
* Today's Sales
* Recent Bills

---

## 3. Inventory Module

Medicine Fields

* Name
* Generic Name
* Batch Number
* Category
* Purchase Price
* Selling Price
* Quantity
* Expiry Date

Operations

* Add Medicine
* Update Medicine
* Delete Medicine
* Search Medicine

---

## 4. Expiry Tracking

Automatic calculation:

Current Date

↓

Expiry Date

↓

Status

Status Values:

* Safe
* Expiring Soon
* Expired

Rules:

Expiring Soon = less than 90 days

Expired = current date > expiry date

---

## 5. Billing Module

Workflow

Search Medicine

↓

Add To Cart

↓

Change Quantity

↓

Calculate Total

↓

Generate Bill

↓

Reduce Stock

↓

Save Bill

↓

Print Invoice

---

## 6. Invoice Generator

Invoice contains:

* Shop Name
* Bill Number
* Date
* Medicine List
* Quantity
* Price
* Total Amount

Use:

window.print()

for MVP.

No PDF generation required.

---

# Database Schema

## medicines

id UUID PK

name TEXT

batch_number TEXT

expiry_date DATE

purchase_price NUMERIC

selling_price NUMERIC

quantity INTEGER

created_at TIMESTAMP

---

## bills

id UUID PK

bill_number TEXT

total_amount NUMERIC

created_at TIMESTAMP

---

## bill_items

id UUID PK

bill_id UUID

medicine_id UUID

quantity INTEGER

price NUMERIC

subtotal NUMERIC

---

# API Endpoints

GET /medicines

POST /medicines

PUT /medicines/:id

DELETE /medicines/:id

GET /dashboard

POST /billing/create

GET /bills

GET /bill/:id

---

# Security

MVP Security

* Supabase Auth
* Protected Routes
* Environment Variables

Skip:

* Audit Logs
* RBAC
* Multi-user Support

for MVP.

---

# Future Enhancements

Phase 2

* GST Billing
* Barcode Scanner
* Purchase Orders
* Supplier Management
* Sales Reports

Phase 3

* Multi Store Support
* Cloud Backup
* WhatsApp Bills
* Mobile App
* AI Demand Prediction
