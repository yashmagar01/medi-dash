-- ============================================================
-- MEDI-DASH DATABASE SCHEMA
-- AR Medicals — Medical Billing & Inventory System
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: medicines
-- ============================================================
CREATE TABLE IF NOT EXISTS medicines (
  id             UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT          NOT NULL,
  batch_number   TEXT          NOT NULL,
  expiry_date    DATE          NOT NULL,
  purchase_price NUMERIC(10,2) NOT NULL CHECK (purchase_price >= 0),
  selling_price  NUMERIC(10,2) NOT NULL CHECK (selling_price >= 0),
  quantity       INTEGER       NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on every row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER medicines_updated_at
  BEFORE UPDATE ON medicines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABLE: bills
-- ============================================================
CREATE TABLE IF NOT EXISTS bills (
  id            UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_number   TEXT          NOT NULL UNIQUE,
  total_amount  NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: bill_items
-- ============================================================
CREATE TABLE IF NOT EXISTS bill_items (
  id            UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_id       UUID          NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  medicine_id   UUID          NOT NULL REFERENCES medicines(id),
  medicine_name TEXT          NOT NULL,   -- snapshot at time of sale
  quantity      INTEGER       NOT NULL CHECK (quantity > 0),
  price         NUMERIC(10,2) NOT NULL,   -- selling price at time of sale
  subtotal      NUMERIC(10,2) NOT NULL
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE medicines  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills      ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_items ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access (service role bypasses RLS automatically)
CREATE POLICY "Auth full access medicines"
  ON medicines FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Auth full access bills"
  ON bills FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Auth full access bill_items"
  ON bill_items FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ============================================================
-- SEED DATA — 20 Sample Medicines for AR Medicals
-- Includes: 2 expired, 3 low stock, 2 expiring soon
-- ============================================================
INSERT INTO medicines (name, batch_number, expiry_date, purchase_price, selling_price, quantity) VALUES
  ('Paracetamol 500mg',       'B001', '2027-06-01',   2.50,   5.00, 200),
  ('Amoxicillin 250mg',       'B002', '2026-12-01',   8.00,  15.00,  80),
  ('Ibuprofen 400mg',         'B003', '2027-03-01',   4.00,   8.00, 150),
  ('Cetirizine 10mg',         'B004', '2026-09-01',   3.00,   6.00,  60),
  ('Metformin 500mg',         'B005', '2027-01-01',   5.00,  10.00, 120),
  ('Atorvastatin 10mg',       'B006', '2026-09-15',   6.00,  12.00,  45),
  ('Omeprazole 20mg',         'B007', '2026-08-15',   7.00,  14.00,  30),
  ('Azithromycin 500mg',      'B008', '2026-11-01',  20.00,  40.00,  25),
  ('Ciprofloxacin 500mg',     'B009', '2026-10-01',  12.00,  24.00,  55),
  ('Doxycycline 100mg',       'B010', '2026-08-20',  10.00,  20.00,   8),  -- low stock + expiring soon
  ('Pantoprazole 40mg',       'B011', '2025-12-01',   8.00,  16.00,  10),  -- EXPIRED
  ('Ranitidine 150mg',        'B012', '2025-11-01',   3.50,   7.00,   5),  -- EXPIRED + low stock
  ('Aspirin 75mg',            'B013', '2027-04-01',   1.50,   3.00, 300),
  ('Amlodipine 5mg',          'B014', '2027-02-01',   4.50,   9.00,  90),
  ('Losartan 50mg',           'B015', '2026-11-01',   6.50,  13.00,  70),
  ('Salbutamol Inhaler',      'B016', '2026-09-15',  45.00,  85.00,  20),
  ('Insulin Glargine',        'B017', '2026-10-30', 120.00, 200.00,  15),
  ('Vitamin D3 1000IU',       'B018', '2027-12-01',   5.00,  10.00, 400),
  ('Calcium Carbonate 500mg', 'B019', '2027-08-01',   4.00,   8.00, 180),
  ('Zinc Sulphate 20mg',      'B020', '2026-08-20',   2.00,   4.00,   7); -- low stock
