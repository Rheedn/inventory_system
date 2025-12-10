# 📦 Goods Tracking System — Database Schema

This document outlines all database tables and their relationships for the Goods Tracking System.
Every good has a QR code that can be scanned for issuing and returning verification.

---

## 🧑‍💼 USERS TABLE
Stores admin and staff accounts.

| Column | Type | Constraints | Description |
|--------|------|--------------|--------------|
| user_id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique ID for each user |
| name | VARCHAR(100) | NOT NULL | Full name |
| email | VARCHAR(150) | UNIQUE, NOT NULL | User email for login |
| password_hash | TEXT | NOT NULL | Encrypted password |
| role | VARCHAR(20) | DEFAULT 'staff' | User role (`admin` or `staff`) |
| status | VARCHAR(20) | DEFAULT 'active' | Account status |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation date |

---

## 👥 CUSTOMERS TABLE
Stores details of customers receiving goods.

| Column | Type | Constraints | Description |
|--------|------|--------------|--------------|
| customer_id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique customer ID |
| name | VARCHAR(100) | NOT NULL | Customer name |
| phone | VARCHAR(20) | | Phone number |
| email | VARCHAR(150) | | Customer email |
| address | TEXT | | Customer address |
| created_at | TIMESTAMP | DEFAULT NOW() | Date added |

---

## 📦 GOODS TABLE
Main inventory table for all goods in the store.

| Column | Type | Constraints | Description |
|--------|------|--------------|--------------|
| good_id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique ID for the good |
| name | VARCHAR(150) | NOT NULL | Name of the good |
| description | TEXT | | Details about the good |
| category_id | UUID | REFERENCES categories(category_id) | Category of the good |
| quantity | INT | DEFAULT 0 | Quantity in stock |
| qr_code | TEXT | UNIQUE, NOT NULL | QR code string for tracking |
| image_url | TEXT | | Picture taken at registration |
| status | VARCHAR(20) | DEFAULT 'available' | `available`, `issued`, `damaged`, etc. |
| added_by | UUID | REFERENCES users(user_id) | Staff who registered the item |
| date_added | TIMESTAMP | DEFAULT NOW() | Date the good was added |

---

## 🗂️ CATEGORIES TABLE
Helps group goods logically (e.g., electronics, furniture).

| Column | Type | Constraints | Description |
|--------|------|--------------|--------------|
| category_id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique category ID |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Category name |
| description | TEXT | | Description of category |

---

## 🔄 TRANSACTIONS TABLE
Tracks all goods issued or returned.

| Column | Type | Constraints | Description |
|--------|------|--------------|--------------|
| transaction_id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique transaction ID |
| good_id | UUID | REFERENCES goods(good_id) | Linked good |
| customer_id | UUID | REFERENCES customers(customer_id) | Customer involved |
| staff_id | UUID | REFERENCES users(user_id) | Staff who performed the action |
| action | VARCHAR(20) | NOT NULL | Either `issued` or `returned` |
| quantity | INT | DEFAULT 1 | Number of goods issued/returned |
| condition_photo_url | TEXT | | Picture of the good’s condition |
| notes | TEXT | | Optional notes on transaction |
| date | TIMESTAMP | DEFAULT NOW() | Timestamp of transaction |

---

## 📸 GOODS_PHOTOS TABLE (Optional)
Stores multiple photos for a single good (e.g., at registration and return).

| Column | Type | Constraints | Description |
|--------|------|--------------|--------------|
| photo_id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique photo record ID |
| good_id | UUID | REFERENCES goods(good_id) | Linked good |
| photo_url | TEXT | | Image URL |
| type | VARCHAR(20) | | `registration`, `issued`, or `return` |
| uploaded_at | TIMESTAMP | DEFAULT NOW() | When the photo was added |

---

## 🧾 RETURNS TABLE (Optional)
Used when a return requires admin verification.

| Column | Type | Constraints | Description |
|--------|------|--------------|--------------|
| return_id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique return record |
| good_id | UUID | REFERENCES goods(good_id) | Returned good |
| customer_id | UUID | REFERENCES customers(customer_id) | Customer returning item |
| verified_by | UUID | REFERENCES users(user_id) | Admin/staff who verified |
| return_condition_photo_url | TEXT | | Picture at return time |
| approval_status | VARCHAR(20) | DEFAULT 'pending' | `pending`, `approved`, `rejected` |
| date | TIMESTAMP | DEFAULT NOW() | Return date |

---

## ⚙️ RELATIONSHIPS OVERVIEW
- `users (1) ↔ (many) goods` → each good is added by a staff/admin
- `goods (1) ↔ (many) transactions` → goods can be issued or returned multiple times
- `customers (1) ↔ (many) transactions` → one customer can have many transactions
- `categories (1) ↔ (many) goods` → one category can have many goods
- `transactions` link `goods`, `customers`, and `staff`

---

## 🧮 Example PostgreSQL Extensions

| Schema         | Tables                                | Purpose                                 |
| -------------- | ------------------------------------- | --------------------------------------- |
| **auth**       | `users`                               | Manages admin & staff accounts          |
| **inventory**  | `goods`, `categories`, `goods_photos` | Handles goods, categories & item photos |
| **operations** | `transactions`, `returns`             | Tracks issuing and returning goods      |
| **people**     | `customers`                           | Stores customer records                 |

