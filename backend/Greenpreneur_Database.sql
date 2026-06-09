-- =============================================================================
-- GREENPRENEUR DATABASE — MySQL Schema
-- Database: Greenpreneur
-- Organisation: 1MEIF NGO / Peers Global
-- Generated: 2026
-- =============================================================================

CREATE DATABASE IF NOT EXISTS Greenpreneur
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE Greenpreneur;

-- =============================================================================
-- TABLE 1: award_categories
-- Master list of all 45 award categories used in nominations
-- =============================================================================
CREATE TABLE award_categories (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120)  NOT NULL UNIQUE,
  slug        VARCHAR(120)  NOT NULL UNIQUE COMMENT 'URL-safe slug',
  group_name  VARCHAR(80)   NOT NULL COMMENT 'Segment: Green Business | MSME | Individual | Social',
  is_active   TINYINT(1)    NOT NULL DEFAULT 1,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO award_categories (name, slug, group_name) VALUES
-- Green Business Segment
('Eco-Friendly Product',            'eco-friendly-product',           'Green Business'),
('Sustainable Manufacturer',         'sustainable-manufacturer',        'Green Business'),
('Sustainable Construction',         'sustainable-construction',        'Green Business'),
('Architecture',                     'architecture',                    'Green Business'),
('Interior / Exterior Design',       'interior-exterior-design',        'Green Business'),
('E-Vehicle Business',               'e-vehicle-business',              'Green Business'),
('Renewable Energy',                 'renewable-energy',                'Green Business'),
('Waste Management',                 'waste-management',                'Green Business'),
('Recycling',                        'recycling',                       'Green Business'),
('Upcycling',                        'upcycling',                       'Green Business'),
('Water Conservation',               'water-conservation',              'Green Business'),
('Sustainable Service Business',     'sustainable-service-business',    'Green Business'),
('Sustainable Factory',              'sustainable-factory',             'Green Business'),
('Sustainable Agriculture',          'sustainable-agriculture',         'Green Business'),
('Healthcare & Wellness',            'healthcare-wellness',             'Green Business'),
('Hospitality & Tourism',            'hospitality-tourism',             'Green Business'),
('Rural Development',                'rural-development',               'Green Business'),
('Sustainable Education',            'sustainable-education',           'Green Business'),
('Sustainable Campus',               'sustainable-campus',              'Green Business'),
('Green Consulting & Services',      'green-consulting-services',       'Green Business'),
('Conservation & Restoration',       'conservation-restoration',        'Green Business'),
('Clean Technology',                 'clean-technology',                'Green Business'),
('Circular Economy',                 'circular-economy',                'Green Business'),
('Sustainable Innovation',           'sustainable-innovation',          'Green Business'),
('Start-Up of the Year',             'start-up-of-the-year',            'Green Business'),
-- Social / NGO
('Social Impact Creator',            'social-impact-creator',           'Social'),
('NGO Impact Award',                 'ngo-impact-award',                'Social'),
('Corporate CSR in Green',           'corporate-csr-in-green',          'Social'),
('Carbon Credit Pioneer',            'carbon-credit-pioneer',           'Social'),
('Biodiversity Champion',            'biodiversity-champion',           'Social'),
('Sustainability Trend Setter',      'sustainability-trend-setter',     'Social'),
('Green Storyteller',                'green-storyteller',               'Social'),
('Net Zero Early Mover',             'net-zero-early-mover',            'Social'),
-- Individual
('Sustainability Champion (Woman)',  'sustainability-champion-woman',   'Individual'),
('Sustainability Champion (Man)',    'sustainability-champion-man',     'Individual'),
-- MSME Segment
('Best Manufacturing MSME',          'best-manufacturing-msme',         'MSME'),
('Best Service-Based MSME',          'best-service-based-msme',         'MSME'),
('Innovative MSME of the Year',      'innovative-msme-of-the-year',     'MSME'),
('Fastest Growing MSME',             'fastest-growing-msme',            'MSME'),
('Sustainable MSME of the Year',     'sustainable-msme-of-the-year',    'MSME'),
('Best Woman-Led MSME',              'best-woman-led-msme',             'MSME'),
('Social Impact MSME',               'social-impact-msme',              'MSME'),
('Best Export-Oriented MSME',        'best-export-oriented-msme',       'MSME'),
('Tech-Driven MSME of the Year',     'tech-driven-msme-of-the-year',    'MSME'),
('Young Entrepreneur MSME Award',    'young-entrepreneur-msme-award',   'MSME');


-- =============================================================================
-- TABLE 2: nominations
-- Stores all award applications from ApplyAward.tsx wizard (Steps 1–4)
-- =============================================================================
CREATE TABLE nominations (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  -- Step 1: Track
  track            ENUM('honorary','rated') NOT NULL DEFAULT 'honorary'
                   COMMENT 'honorary = Free 100% jury; rated = paid competitive',

  -- Step 2: Personal Details
  nominee_name     VARCHAR(150) NOT NULL,
  business_name    VARCHAR(200) NOT NULL,
  phone            VARCHAR(20)  NOT NULL  COMMENT 'WhatsApp number',
  email            VARCHAR(150) NOT NULL,
  city             VARCHAR(100) NOT NULL  COMMENT 'City & State',

  -- Step 3: About Work
  category_id      INT UNSIGNED NOT NULL,
  description      TEXT         NOT NULL  COMMENT 'Green impact description ≤200 words',
  website_link     VARCHAR(500) DEFAULT NULL COMMENT 'Optional website/social link',
  profile_picture  VARCHAR(500) DEFAULT NULL,
  business_logo    VARCHAR(500) DEFAULT NULL,

  -- Step 4: Package (rated only)
  package          ENUM('identity', 'change_maker', 'fame_india', 'impact_creator') DEFAULT NULL
                   COMMENT 'identity=₹2000, change_maker=₹3000, fame_india=₹5000, impact_creator=₹10000; NULL for honorary',
  package_amount   DECIMAL(10,2) DEFAULT NULL COMMENT 'Amount in INR',

  -- Admin tracking
  status           ENUM('pending','vetting','approved','rejected','winner') NOT NULL DEFAULT 'pending',
  payment_status   ENUM('not_applicable','pending','paid','failed') NOT NULL DEFAULT 'not_applicable',
  payment_ref      VARCHAR(200) DEFAULT NULL COMMENT 'Razorpay/UPI transaction reference',
  jury_score       TINYINT UNSIGNED DEFAULT NULL COMMENT '0–100 jury score',
  public_votes     INT UNSIGNED NOT NULL DEFAULT 0,
  notes            TEXT DEFAULT NULL COMMENT 'Internal secretariat notes',

  -- Year partition
  award_year       YEAR NOT NULL DEFAULT (YEAR(CURRENT_DATE)),

  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_nom_category FOREIGN KEY (category_id)
    REFERENCES award_categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,

  INDEX idx_nom_status      (status),
  INDEX idx_nom_track       (track),
  INDEX idx_nom_year        (award_year),
  INDEX idx_nom_email       (email),
  INDEX idx_nom_category    (category_id)
) ENGINE=InnoDB;


-- =============================================================================
-- TABLE 3: winners
-- Confirmed past & present winners shown on Winners.tsx page
-- =============================================================================
CREATE TABLE winners (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nomination_id   INT UNSIGNED DEFAULT NULL COMMENT 'Link to nominations if applied online',

  -- Display data
  name            VARCHAR(150) NOT NULL,
  company         VARCHAR(200) NOT NULL,
  category_id     INT UNSIGNED NOT NULL,
  city            VARCHAR(100) NOT NULL,
  award_year      YEAR        NOT NULL,
  track           ENUM('honorary','rated') NOT NULL,

  -- Profile & story
  impact_text     TEXT        NOT NULL COMMENT 'Impact description shown on winners page',
  quote           TEXT        DEFAULT NULL,
  photo_url       VARCHAR(500) DEFAULT NULL,
  website_url     VARCHAR(500) DEFAULT NULL,

  -- Flags
  is_featured     TINYINT(1)  NOT NULL DEFAULT 0 COMMENT 'Show on homepage highlights',
  is_published    TINYINT(1)  NOT NULL DEFAULT 1,

  created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_win_category    FOREIGN KEY (category_id)
    REFERENCES award_categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_win_nomination  FOREIGN KEY (nomination_id)
    REFERENCES nominations(id) ON DELETE SET NULL ON UPDATE CASCADE,

  INDEX idx_win_year     (award_year),
  INDEX idx_win_category (category_id),
  INDEX idx_win_featured (is_featured)
) ENGINE=InnoDB;


-- =============================================================================
-- TABLE 4: event_registrations
-- Event pass bookings from Event2026.tsx registration form
-- =============================================================================
CREATE TABLE event_registrations (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  -- Attendee details
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(150) NOT NULL,
  phone         VARCHAR(20)  NOT NULL,
  city          VARCHAR(100) NOT NULL,
  segment       VARCHAR(100) NOT NULL DEFAULT 'Green Entrepreneur'
                COMMENT 'Green Entrepreneur | MSME Owner | Startup | CXO | NGO Leader | Government | Sponsor | Architect',

  -- Event
  event_name    VARCHAR(200) NOT NULL DEFAULT 'Greenpreneur 2026',
  event_date    DATE         NOT NULL DEFAULT '2026-06-25',
  event_venue   VARCHAR(300) NOT NULL DEFAULT 'Renaissance by Marriott, S.G. Highway, Ahmedabad',

  -- Ticket
  pass_type     ENUM('general','vip','delegate','complimentary') NOT NULL DEFAULT 'general',
  pass_amount   DECIMAL(10,2) DEFAULT 0.00,
  payment_status ENUM('pending','paid','complimentary','cancelled') NOT NULL DEFAULT 'pending',
  payment_ref   VARCHAR(200) DEFAULT NULL,

  -- Check-in
  is_checked_in TINYINT(1)  NOT NULL DEFAULT 0,
  checked_in_at TIMESTAMP   NULL DEFAULT NULL,

  created_at    TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_reg_email  (email),
  INDEX idx_reg_event  (event_date),
  INDEX idx_reg_checkin (is_checked_in)
) ENGINE=InnoDB;


-- =============================================================================
-- TABLE 5: sponsorships
-- Sponsorship applications from Sponsorship.tsx enquiry form
-- =============================================================================
CREATE TABLE sponsorships (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  -- Contact
  contact_name  VARCHAR(150) NOT NULL,
  company_name  VARCHAR(200) NOT NULL,
  email         VARCHAR(150) NOT NULL,
  phone         VARCHAR(20)  NOT NULL,

  -- Tier chosen
  tier          ENUM(
                  'Title Sponsor',
                  'Powered By',
                  'Platinum Sponsor',
                  'Gold Sponsor',
                  'Silver Sponsor',
                  'Category Sponsor',
                  'Custom'
                ) NOT NULL DEFAULT 'Gold Sponsor',
  tier_amount   DECIMAL(12,2) DEFAULT NULL COMMENT 'INR value of chosen tier',

  -- Stall interest
  stall_interest    TINYINT(1) NOT NULL DEFAULT 0,
  stall_type        ENUM('Standard','Premium') DEFAULT NULL,

  -- Message & status
  message           TEXT DEFAULT NULL,
  status            ENUM('new','contacted','negotiating','confirmed','cancelled') NOT NULL DEFAULT 'new',
  assigned_to       VARCHAR(100) DEFAULT 'Vishal Parmar' COMMENT 'Internal team member',
  contract_signed   TINYINT(1) NOT NULL DEFAULT 0,
  payment_received  TINYINT(1) NOT NULL DEFAULT 0,
  payment_ref       VARCHAR(200) DEFAULT NULL,

  award_year        YEAR NOT NULL DEFAULT (YEAR(CURRENT_DATE)),

  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_spon_status (status),
  INDEX idx_spon_year   (award_year),
  INDEX idx_spon_email  (email)
) ENGINE=InnoDB;


-- =============================================================================
-- TABLE 6: coffee_table_book_orders
-- Feature/ad bookings from CoffeeTableBook.tsx
-- =============================================================================
CREATE TABLE coffee_table_book_orders (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  -- Buyer
  name          VARCHAR(150) NOT NULL,
  phone         VARCHAR(20)  NOT NULL,
  email         VARCHAR(150) NOT NULL,
  company       VARCHAR(200) NOT NULL,

  -- Package selected
  package       ENUM(
                  'Cover Story',
                  'Back Cover',
                  'Inside Front/Back Cover',
                  'Full-Page Advertisement',
                  'Inside Feature Story',
                  'Green Editorial Spread',
                  'Inside Feature (Members)',
                  'Extra Print Copies'
                ) NOT NULL DEFAULT 'Inside Feature Story',
  quantity      SMALLINT UNSIGNED NOT NULL DEFAULT 1
                COMMENT 'For Extra Print Copies quantity; 1 for all others',
  package_price DECIMAL(10,2) NOT NULL,
  total_amount  DECIMAL(10,2) NOT NULL,

  message       TEXT DEFAULT NULL,

  -- Status
  status        ENUM('enquiry','slot_reserved','content_received','designing','printed','delivered','cancelled')
                NOT NULL DEFAULT 'enquiry',
  payment_status ENUM('pending','paid','cancelled') NOT NULL DEFAULT 'pending',
  payment_ref   VARCHAR(200) DEFAULT NULL,
  slot_available TINYINT(1)  NOT NULL DEFAULT 1,

  edition_year  YEAR NOT NULL DEFAULT (YEAR(CURRENT_DATE)),

  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_ctb_status  (status),
  INDEX idx_ctb_package (package),
  INDEX idx_ctb_year    (edition_year)
) ENGINE=InnoDB;


-- =============================================================================
-- TABLE 7: contact_enquiries
-- General enquiries from Contact.tsx form
-- =============================================================================
CREATE TABLE contact_enquiries (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  name        VARCHAR(150) NOT NULL,
  phone       VARCHAR(20)  NOT NULL,
  email       VARCHAR(150) NOT NULL,
  interest    ENUM(
                'Awards',
                'Sponsorship',
                'Book',
                'Exhibition',
                'Speaking',
                'General'
              ) NOT NULL DEFAULT 'General',
  message     TEXT NOT NULL,

  -- Admin
  status      ENUM('new','read','replied','closed') NOT NULL DEFAULT 'new',
  replied_by  VARCHAR(100) DEFAULT NULL,
  reply_notes TEXT DEFAULT NULL,

  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_enq_status   (status),
  INDEX idx_enq_interest (interest),
  INDEX idx_enq_email    (email)
) ENGINE=InnoDB;


-- =============================================================================
-- TABLE 8: community_applications
-- Community / membership applications from Community.tsx form
-- =============================================================================
CREATE TABLE community_applications (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  name        VARCHAR(150) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  phone       VARCHAR(20)  NOT NULL,
  city        VARCHAR(100) NOT NULL,
  company     VARCHAR(200) NOT NULL,
  sector      VARCHAR(100) NOT NULL  COMMENT 'Green sector of the applicant',
  interest    VARCHAR(100) NOT NULL  COMMENT 'Membership | Story Feature | Mentorship etc.',
  why_join    TEXT         NOT NULL  COMMENT 'Motivation paragraph from applicant',

  -- Status
  status      ENUM('applied','under_review','approved','rejected','onboarded')
              NOT NULL DEFAULT 'applied',
  membership_type ENUM('standard','premium','honorary') DEFAULT NULL,
  membership_expiry DATE DEFAULT NULL,
  member_id   VARCHAR(30) DEFAULT NULL COMMENT 'e.g. 1MEIF-2026-0001',

  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_comm_status (status),
  INDEX idx_comm_email  (email)
) ENGINE=InnoDB;


-- =============================================================================
-- TABLE 9: admin_users
-- Internal secretariat/admin accounts to manage the backend dashboard
-- =============================================================================
CREATE TABLE admin_users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL COMMENT 'bcrypt hash',
  role          ENUM('superadmin','admin','coordinator','viewer') NOT NULL DEFAULT 'coordinator',
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  last_login    TIMESTAMP NULL DEFAULT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Default superadmin (password must be changed immediately)
INSERT INTO admin_users (name, email, password_hash, role)
VALUES ('Vishal Parmar', 'hello@greenpreneur.in',
        '$2b$12$CHANGETHISHASH_PLACEHOLDER_DO_NOT_USE', 'superadmin');


-- =============================================================================
-- TABLE 10: audit_log
-- Every significant status change across all tables
-- =============================================================================
CREATE TABLE audit_log (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  table_name   VARCHAR(60)  NOT NULL,
  record_id    INT UNSIGNED NOT NULL,
  action       ENUM('INSERT','UPDATE','DELETE') NOT NULL,
  changed_by   INT UNSIGNED DEFAULT NULL COMMENT 'admin_users.id',
  old_values   JSON DEFAULT NULL,
  new_values   JSON DEFAULT NULL,
  ip_address   VARCHAR(45) DEFAULT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_audit_table    (table_name),
  INDEX idx_audit_record   (record_id),
  INDEX idx_audit_user     (changed_by),
  INDEX idx_audit_created  (created_at)
) ENGINE=InnoDB;


-- =============================================================================
-- VIEWS — for common dashboard queries
-- =============================================================================

-- Active nominations summary
CREATE OR REPLACE VIEW v_nominations_summary AS
SELECT
  n.id,
  n.nominee_name,
  n.business_name,
  n.email,
  n.phone,
  n.city,
  ac.name     AS category,
  ac.group_name AS category_group,
  n.track,
  n.package,
  n.package_amount,
  n.status,
  n.payment_status,
  n.jury_score,
  (SELECT COUNT(*) FROM nomination_votes WHERE nomination_id = n.id) AS public_votes,
  n.award_year,
  n.created_at
FROM nominations n
LEFT JOIN award_categories ac ON n.category_id = ac.id;


-- Sponsorship pipeline summary
CREATE OR REPLACE VIEW v_sponsorship_pipeline AS
SELECT
  id,
  contact_name,
  company_name,
  email,
  tier,
  tier_amount,
  stall_interest,
  stall_type,
  status,
  contract_signed,
  payment_received,
  award_year,
  created_at
FROM sponsorships;


-- Revenue summary view
CREATE OR REPLACE VIEW v_revenue_summary AS
SELECT
  'nominations'     AS source,
  award_year        AS year,
  COUNT(*)          AS total_count,
  SUM(CASE WHEN payment_status = 'paid' THEN package_amount ELSE 0 END) AS collected_inr
FROM nominations
WHERE track = 'rated'
GROUP BY award_year

UNION ALL

SELECT
  'sponsorships',
  award_year,
  COUNT(*),
  SUM(CASE WHEN payment_received = 1 THEN COALESCE(tier_amount, 0) ELSE 0 END)
FROM sponsorships
GROUP BY award_year

UNION ALL

SELECT
  'coffee_table_book',
  edition_year,
  COUNT(*),
  SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END)
FROM coffee_table_book_orders
GROUP BY edition_year;


-- =============================================================================
-- SAMPLE DATA — past winners (matching Winners.tsx)
-- =============================================================================
INSERT INTO winners (name, company, category_id, city, award_year, track, impact_text, quote, is_featured, is_published) VALUES
(
  'Rohan Shah', 'EcoCycle Solutions',
  (SELECT id FROM award_categories WHERE slug = 'waste-management'),
  'Ahmedabad', 2025, 'rated',
  'Pioneered automated segregation systems handling 50 tons of organic and dry waste daily, diverting it from local dumpsites.',
  'Winning the Rated Challenge in 2025 completely shifted our business trajectory. The media stories published on VyapaarJagat brought us 3 major corporate clients.',
  1, 1
),
(
  'Anjali Desai', 'GreenWeave Textures',
  (SELECT id FROM award_categories WHERE slug = 'sustainable-manufacturer'),
  'Surat', 2024, 'honorary',
  'Transformed crop residual banana fibers into export-grade organic fabrics, creating livelihood for 200+ rural artisans.',
  'The Honorary Award nomination process was transparent and prestigious. Being felicitated at AMA Ahmedabad was a lifetime achievement.',
  1, 1
),
(
  'Dr. Amit Patel', 'AgriSustain Organics',
  (SELECT id FROM award_categories WHERE slug = 'sustainable-agriculture'),
  'Rajkot', 2023, 'honorary',
  'Scaled organic soil inputs and bio-fertilizers across 10,000+ hectares of farmland, improving crop yields naturally.',
  'Greenpreneur is not just an award event; it is an active community. The connections helped us raise our seed round.',
  0, 1
),
(
  'Vikram Mehra', 'SolarDrive Tech',
  (SELECT id FROM award_categories WHERE slug = 'renewable-energy'),
  'Mumbai', 2025, 'rated',
  'Deployed containerized off-grid solar generators for remote agricultural processing units, saving 12,000 litres of diesel annually.',
  'Representing solar deployment models at the BSE Mumbai felicitation opened discussions with state renewable energy regulators.',
  1, 1
),
(
  'Shalini Gupta', 'BioPack India',
  (SELECT id FROM award_categories WHERE slug = 'eco-friendly-product'),
  'Pune', 2024, 'rated',
  'Manufactured biodegradable packaging materials from agricultural waste, replacing single-use plastic boxes for major e-commerce platforms.',
  'The organic visibility we received after VyapaarJagat published our manufacturing walkthrough was instrumental in signing corporate contracts.',
  0, 1
);
