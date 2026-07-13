# Frontend Development Specification

This document is generated directly from the actual NestJS backend implementation (controllers, DTOs, and Prisma schema) — every route, field name, and validation rule below is verified against the current source, not assumed from the original ASP.NET Core contract. All routes are mounted under the global prefix `/api` (set in `src/main.ts`) and validated by a global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` — **any request body field not declared on the DTO is rejected with 400**, so the frontend must never send extra fields (e.g. `id`, `userId`, `createdAt`) even if the backend entity has them.

Every protected endpoint requires `Authorization: Bearer <token>` and returns `401` if missing/invalid. Ownership is enforced server-side on every resource — a resource that exists but belongs to another user returns `404`, not `403` (except the Users module, which uses `403` for cross-user profile access — see §1).

---

## 1. Authentication & Users Module

### 1.1 Pages & Routing
* **`/login`**: Public route. Displays login form.
* **`/register`**: Public route. Displays registration form.
* **`/profile`**: Protected route (requires JWT). Displays current user profile.

### 1.2 Components
* **`LoginForm`**: Collects email/password.
* **`RegisterForm`**: Collects fullName, email, userName, password, and optional phoneNumber/currency.
* **`UserProfileCard`**: Displays user details and role/authority.
* **`AuthGuard`**: Wrapper component or hook to redirect unauthenticated users to `/login`.

### 1.3 Forms & Validation
* **Register Form** (`RegisterDto`):
  * `fullName`: Required, string, max 100 chars.
  * `email`: Required, valid email, max 150 chars. Server trims and lowercases it — the frontend does not need to.
  * `userName`: Required, string, max 50 chars.
  * `password`: Required, string, min 6 chars, max 100 chars.
  * `phoneNumber`: Optional string.
  * `currency`: Optional string.
* **Login Form** (`LoginDto`):
  * `email`: Required, valid email (server trims/lowercases).
  * `password`: Required, string.

### 1.4 API Calls & Payloads
* **`POST /api/User/register`**
  * Payload: `{ fullName, email, userName, password, phoneNumber?, currency? }`
  * Response `201`: `LoginResponseDto` — `{ token: string, user: UserInfoDto }`. **Registration auto-logs-in**; there is no separate login step required afterward.
  * `409 Conflict`: email already registered.
  * `429 Too Many Requests`: shared rate-limit bucket with `/login` (see §1.5).
* **`POST /api/User/login`**
  * Payload: `{ email, password }`
  * Response `200`: `LoginResponseDto` — `{ token: string, user: UserInfoDto }`.
  * `401 Unauthorized`: invalid email or password (the message is identical for both cases — do not reveal which one was wrong).
  * `429 Too Many Requests`.
* **`GET /api/User/me`**
  * Response `200`: `UserInfoDto`.
* **`GET /api/User?Id=<userId>`**
  * Query param name is capital-`Id`. Returns the profile for the given user ID.
  * `403 Forbidden` if the caller is neither the target user nor an Admin.
  * `404 Not Found` if the user doesn't exist.
  * Note: prefer `GET /api/User/me` for "my own profile" — this endpoint exists mainly for future Admin tooling.

**`UserInfoDto` shape** (note the field names — several differ from a typical User entity):
```json
{
  "userId": "uuid",
  "userName": "string",
  "authority": ["User"],
  "email": "string",
  "phone": "string | null",
  "curency": "string | null"
}
```
* `authority` is an **array** containing the single role string (`"User"` or `"Admin"`), not a plain string.
* `phone` maps to the backend's `phoneNumber` field — renamed in the response.
* `curency` is **intentionally misspelled** (preserved for frontend compatibility with the original contract) — do not "fix" this key when consuming the response.
* `passwordHash` is never returned.

### 1.5 States & UX
* **Loading**: Spinner on submit buttons. Skeleton loader for profile page.
* **Error**:
  * `401 Unauthorized`: Invalid credentials (login only).
  * `409 Conflict`: Email already exists (register only).
  * `429 Too Many Requests`: Register and login share **one** rate-limit bucket per client IP (default: 5 requests / 60 seconds, server-configured) — a burst of registration attempts can also lock out a subsequent login attempt from the same IP. Surface a clear "too many attempts, try again shortly" message rather than a generic error.
* **User Flow**: User registers → token + profile returned immediately (no separate login call needed) → save JWT (e.g. `localStorage`) → redirect to Dashboard. Returning users: login → save JWT → redirect to Dashboard.
* **Session note**: The default access-token lifetime is long (7 days, server-configured) and there is currently **no refresh-token or logout/revocation endpoint** — "logout" is purely a client-side token discard. Do not build UI that assumes a refresh flow exists yet.

---

## 2. Customers & Suppliers Module

Customers and Suppliers are **not** symmetric — Suppliers currently have no update or delete endpoint. Build the Supplier UI without an edit/deactivate action, or confirm with the backend team before adding one.

### 2.1 Pages & Routing
* **`/customers`**: List customers.
* **`/customers/new`**: Create customer.
* **`/customers/:id`**: Customer details (edit form + link to Ledger via §7).
* **`/suppliers`**: List suppliers.
* **`/suppliers/new`**: Create supplier.
* **`/suppliers/:id`**: Supplier details (read-only + link to Ledger via §7 — no edit/delete action exists).

### 2.2 Components
* **`CustomerTable` / `SupplierTable`**: Paginated lists with search/filtering.
* **`CustomerForm`**: Create/Edit fields.
* **`SupplierForm`**: Create-only fields.
* **`LedgerTable`**: Shared component to display ledger entries for a party (see §7).

### 2.3 Forms & Validation

**Create Customer** (`CreateCustomerDto`):
* `fullName`: Required, string, max 100 chars.
* `email`: Optional, valid email, max 150 chars.
* `phoneNumber`: Optional, string, max 30 chars.
* `role`: Optional, string, max 50 chars (a free-text label, e.g. "VIP" — not an auth role).
* `activeStatus`: Optional boolean, defaults to `true`.
* `lastLoginAt`: Optional ISO-8601 date string.
* There is **no `address` field** on Customer.

**Update Customer** (`UpdateCustomerDto`): every field above, all optional (partial update).

**Create Supplier** (`CreateSupplierDto`):
* `name`: Required, string, 1–100 chars.
* `email`: Optional, valid email, max 150 chars.
* `phoneNumber`: Optional, string, max 30 chars.
* `activeStatus`: Optional boolean, defaults to `true`.
* There is **no `address` field**, and **no update DTO** — Supplier is create/list/get only.

### 2.4 API Calls & Payloads
* **`POST /api/Customer`** → `CustomerResponseDto` (`201`).
* **`GET /api/Customer?page=1&pageSize=20&search=term&activeStatus=true`** → `PaginatedCustomerResponseDto`. `search` matches against `fullName`, `email`, and `phoneNumber`. `activeStatus` defaults to `true` (active-only) when omitted — pass `activeStatus=false` explicitly to see deactivated customers.
* **`GET /api/Customer/:id`** → `CustomerResponseDto`. `404` if missing/foreign.
* **`PUT /api/Customer/:id`** → `CustomerResponseDto`. Partial update.
* **`DELETE /api/Customer/:id`** → `204 No Content`. **Soft delete** — sets `activeStatus: false`; the row is not removed and existing Orders/Invoices referencing it are unaffected. ⚠️ Note for the frontend: a deactivated Customer is **not currently blocked** from being selected for a new Order at the API level — filter deactivated customers out of "new order" pickers on the client side.
* **`POST /api/supplier`** (lowercase route) → `SupplierResponseDto` (`201`).
* **`GET /api/supplier?page=1&pageSize=20&search=term&activeStatus=true`** → `PaginatedSupplierResponseDto`. Same search/pagination shape as Customer.
* **`GET /api/supplier/:id`** → `SupplierResponseDto`. `404` if missing/foreign.

**`CustomerResponseDto`:**
```json
{
  "id": "uuid", "fullName": "string", "email": "string | null",
  "phoneNumber": "string | null", "role": "string | null",
  "activeStatus": true, "createdAt": "ISO-8601", "updatedAt": "ISO-8601",
  "lastLoginAt": "ISO-8601 | null"
}
```

**`SupplierResponseDto`:**
```json
{
  "id": "uuid", "name": "string", "email": "string | null",
  "phoneNumber": "string | null", "activeStatus": true,
  "createdAt": "ISO-8601", "updatedAt": "ISO-8601"
}
```

### 2.5 States & UX
* **Empty State**: "No customers found. Create your first customer." (same pattern for suppliers).
* **Error**: There is **no unique-email constraint** enforced at the Customer/Supplier level in the current backend — do not build a "409 duplicate email" error handler for these two forms (unlike User registration, which does enforce email uniqueness).

---

## 3. Stock & Products Module

### 3.1 Pages & Routing
* **`/stock`**: List stock batches. *(No list/get-by-id endpoint currently exists on the backend for Stock beyond creation — see note below.)*
* **`/stock/new`**: Create stock (receiving inventory).
* **`/products/new`**: Add a single ad-hoc product to an existing Stock batch.

> **Backend note:** Only `POST /api/Stock` and `POST /api/Product` currently exist. There is no `GET /api/Stock`, `GET /api/Stock/:id`, or `GET /api/Product` list endpoint yet. A "Stock list" or "Stock detail" page cannot be built against the current API without a new backend endpoint — flag this to the backend team if those pages are required for this milestone. Product/Stock data for other screens (e.g. the Order POS product picker) must currently be sourced from whatever endpoint the Order flow ends up using, or a new query endpoint must be added.

### 3.2 Components
* **`StockEntryForm`**: Form for receiving inventory.
* **`ProductAddForm`**: Add one additional product to a Stock (manual barcode import or auto-generated).

### 3.3 Forms & Validation

**Create Stock** (`CreateStockDto`):
* `title`: Required, string, max 150 chars (server trims it).
* `totalQuantity`: Required, integer, min 1.
* `unitPrice`: Required, number, min 0, max 2 decimal places. This is the **per-unit supplier cost** (used later as the cost basis for COGS/profit calculations) — not a "sale price".
* `stockPrice`: Required, number, min 0, max 2 decimals. The total invoice amount for this batch.
* `totalAmountPaid`: Required, number, min 0, max 2 decimals, must be `<= stockPrice`. Amount paid to the supplier up front.
* `supplierId`: Required, UUID.
* `storage`, `color`, `condition`: All optional strings.
* There is **no `salePrice` field** and **no `generateBarcodes` boolean** — Stock creation **always** auto-generates exactly `totalQuantity` Products with unique EAN-13 barcodes in the same transaction. There is no "create Stock without products" option.

**Create Product** (`CreateProductDto`) — for adding a single extra Product to an existing Stock after the fact (not a bulk "count" endpoint):
* `stockId`: Required, UUID.
* `name`: Optional string (defaults to the Stock's title).
* `barcode`: Optional. **Only used to import a pre-existing 13-digit EAN-13 barcode** — must match `^\d{13}$` and pass the EAN-13 checksum, or the request is rejected `400`. Omit it to have the server generate a new valid one.
* `price`: Optional number, min 0, 2 decimals (defaults to the Stock's `unitPrice`).
* `storage`, `color`, `condition`: Optional strings.
* Rejected `400` if the Stock has already reached `totalQuantity` capacity (based on current Product count for that Stock).

### 3.4 API Calls
* **`POST /api/Stock`**
  * Response `201`: `StockResponseDto` — `{ id, title, totalQuantity, quantityAvailable, unitPrice, stockPrice, supplierId, generatedProductCount, supplierInvoiceId, createdAt }`. `unitPrice`/`stockPrice` are returned as **strings** (Decimal-safe), not numbers.
  * Flow (all one transaction — fully atomic, rolls back together on any failure): Creates Stock → auto-generates `totalQuantity` Products with barcodes → creates a `SupplierInvoice` (`totalAmount = stockPrice`) → creates an initial `SupplierPayment` **only if** `totalAmountPaid > 0` → appends Ledger entries.
  * `404`: Supplier not found. `400`: `totalAmountPaid > stockPrice`.
* **`POST /api/Product`**
  * Payload: `CreateProductDto` (see above — one product per call, not a `{ stockId, count }` bulk shape).
  * Response `201`: `ProductResponseDto`.
  * `404`: Stock not found. `409 Conflict`: barcode already exists.

### 3.5 Business Rules
* The backend computes and validates real EAN-13 checksums for every barcode (both auto-generated and client-imported).
* `Product.status` is one of: `Available`, `Sold`, `SentToRepair`, `Repaired`, `Vendor`, `Scrap` — driven entirely by Order/Return/Repair flows, never settable directly.
* Quantity (`Stock.quantityAvailable`) is never edited directly by the frontend — it only changes as a side effect of Orders, Returns, and Repairs.

---

## 4. Orders (Sales) Module

### 4.1 Pages & Routing
* **`/orders/new`**: Point of Sale / Create Order.
* **`/orders/:id`**: Order view (there is currently no `GET /api/Order/:id` — see note).

> **Backend note:** There is no `GET /api/Order/:id` or `GET /api/Order` list endpoint. The Order detail/receipt page must be populated from the response of the `POST`/`PUT` call that created/last-modified it, or a read endpoint must be added.

### 4.2 Components
* **`POSForm`**: Select customer, select stock, scan/select barcodes (products).
* **`InvoiceReceipt`**: Printable view of the order (built from the create/update response, per the note above).

### 4.3 Forms & Validation

**Create Order** (`CreateOrderDto`):
* `customerId`: Required UUID.
* `stockId`: Required UUID.
* `productIds`: Required array of unique UUIDs (`ArrayUnique`), non-empty. Length must equal `quantity`.
* `quantity`: Required integer, min 1.
* `unitPrice`: Required number, min 0, 2 decimals. This is the **sale price per unit** for this order (independent of the Stock's cost-basis `unitPrice`).
* `totalPrice`: Required number, min 0, 2 decimals. Must exactly equal `quantity × unitPrice` (server validates this, rejects `400` on mismatch — beware floating-point rounding on the client, round to 2 decimals before sending).
* `paidAmount`: Required number, min 0, 2 decimals, must be `<= totalPrice`.

**Update Order** (`UpdateOrderDto`) — all fields optional, this is a partial update, not a full replacement:
* `productIds`: Optional array of unique UUIDs. **If provided, this is the full replacement set** of Products for the Order (the backend diffs it against the current set and handles add/remove inventory effects) — omit entirely to leave Products unchanged.
* `unitPrice`: Optional number, min 0, 2 decimals. Changing this recalculates `totalPrice` server-side as `newQuantity × unitPrice`.
* `paidAmount`: Optional number, min 0, 2 decimals — replaces the invoice's paid amount; must be `<=` the *new* `totalPrice` after any quantity/price change.
* `narration`: Optional string, max 255 chars.
* There is **no `totalPrice` field on Update** — it's always server-derived from quantity × unitPrice, never sent by the client.

### 4.4 API Calls
* **`POST /api/Order`**
  * Response `201`: `OrderResponseDto` — `{ orderId, customerId, stockId, quantity, totalPrice, paidAmount, productIds, invoiceId, orderDate }`. `totalPrice`/`paidAmount` are **strings**.
  * Flow (one transaction): Validates Customer/Stock/Products ownership → validates Products are `Available` → marks them `Sold` (conditional/race-safe update) → decrements Stock `quantityAvailable` (conditional/race-safe) → creates `CustomerInvoice` → creates an initial `CustomerPayment` **only if** `paidAmount > 0` → appends Ledger entries.
  * `404`: Customer, Stock, or Product not found. `400`: quantity/productIds/totalPrice mismatch. `409 Conflict`: a Product is no longer `Available`, or Stock has insufficient `quantityAvailable`.
* **`PUT /api/Order/:id`**
  * Response `200`: `OrderResponseDto` (same shape).
  * Handles inventory restoration for removed Products, sells newly-added Products, adjusts the linked `CustomerInvoice` totals, and appends a signed Ledger adjustment entry for the total delta.
  * `404`: Order (or a referenced Product) not found. `400`: a Product doesn't belong to the Order's Stock. `409 Conflict`: insufficient inventory, a Product no longer available, or paidAmount exceeds the new totalPrice.

### 4.5 Edge Cases
* `409 Conflict` on create/update: concurrent checkout — if a Product is sold by someone else before this request commits, the API rejects it with a race-safe conditional check (not a naive read-then-write). The frontend must refetch Product availability and let the user retry rather than assume a transient error.
* When editing an Order's `productIds`, send the **full desired set**, not a delta — the backend computes what to add/remove by diffing against the Order's current confirmed Products.

---

## 5. Returns Module

### 5.1 Pages & Routing
* **`/returns`**: Return history (paginated, filterable).
* **`/returns/new`**: Process a return.

### 5.2 Components
* **`ReturnForm`**: Select Stock, select products to return, select return type.
* **`ReturnHistoryTable`**: Paginated, filterable by stock/type/date range.

### 5.3 Forms & Validation

**Create Return** (`CreateReturnDto`):
* `stockId`: Required UUID.
* `returnType`: Required enum — one of `ToStock`, `ToRepair`, `ToVendor`, `ToScrap`.
* `productIds`: Required array of unique UUIDs, non-empty. Each must currently be `Sold` **and** belong to `stockId`.
* `narration`: Optional string, max 255 chars.

**Return History Query** (`ReturnHistoryQueryDto`, all optional): `page`, `pageSize`, `stockId` (UUID), `returnType` (enum), `startDate`/`endDate` (ISO-8601 date strings).

### 5.4 API Calls
* **`POST /api/return`** (lowercase route)
  * Response `201`: `ReturnResponseDto` — `{ returnId, stockId, returnType, productIds, narration, createdAt }`.
  * Flow: Validates Products are currently `Sold` and belong to `stockId` → applies the return-type-specific effect (`ToStock`: Product back to `Available`, Stock `quantityAvailable` incremented; `ToRepair`: delegates into the Repair flow, Product → `SentToRepair`; `ToVendor`/`ToScrap`: Product → `Vendor`/`Scrap`, permanently removed from `totalQuantity`) → reconciles each affected Order's quantity/total and linked `CustomerInvoice` → appends a signed Ledger credit entry.
  * `404`: Stock or Product not found. `400`: a Product doesn't belong to `stockId`, or was never sold. `409 Conflict`: Product not currently `Sold`/already returned, **or the Order's already-paid amount would exceed the reduced total** — in this last case the return is rejected outright (there is currently no refund/credit-note flow; surface a clear message that a manual refund must be processed before this return can go through).
* **`GET /api/return/history?page=1&pageSize=20&stockId=...&returnType=...&startDate=...&endDate=...`**
  * Response `200`: `PaginatedReturnResponseDto`.

---

## 6. Repairs Module

### 6.1 Pages & Routing
* **`/repairs/new`**: Send products to repair.
* **`/repairs/:id/complete`**: Resolve/complete a repair batch.

> Route prefix is intentionally `Reparing` (not `Repairing`) — preserved from the original backend for compatibility. Do not "fix" this typo when wiring up API calls.

### 6.2 Components
* **`SendToRepairForm`**: Select Stock + Products (must currently be `Available`, `Repaired`, or `Sold`).
* **`CompleteRepairForm`**: Per-item outcome (`Repaired` or `Scrap`) with a required cost per item.

### 6.3 Forms & Validation

**Send to Repair** (`SendToRepairDto`):
* `stockId`: Required UUID.
* `productIds`: Required array of unique UUIDs.
* `narration`: Optional string, max 255 chars.
* `technician`: Optional string, max 100 chars.

**Complete Repair** (`CompleteRepairDto`):
* `repairId`: Required UUID (the batch ID returned from `send`).
* `narration`: Optional string, max 255 chars.
* `items`: Required array, non-empty, unique by `productId`. Each item:
  * `productId`: Required UUID.
  * `status`: Required enum — `Repaired` or `Scrap` (**not** `'Repaired' | 'Scrap'` as free strings; there is no third option — a Sold product being scrapped is rejected `400`, since scrapping a currently-sold item isn't a valid outcome).
  * `cost`: Required number, min 0, 2 decimals — **required for every item, including `Repaired`** ones (no "free repair" default; send `0` explicitly if there's genuinely no cost).

### 6.4 API Calls
* **`POST /api/Reparing/send`**
  * Response `201`: `RepairBatchResponseDto` (batch ID + item list with per-product status).
  * `404`: Stock or Product not found. `400`: duplicate Product IDs, or a Product from another Stock. `409 Conflict`: a Product is in a disallowed status, or already in an open repair batch for another request.
* **`POST /api/Reparing/complete`**
  * Response `201`: `RepairCompletionResponseDto` — `{ batchId, status, completedAt, items: [{ id, productId, status, cost, completedAt }] }`. `status`/`completedAt` on the batch itself only become non-null/terminal once **every** item is resolved; a partially-completed batch stays `Pending`/in-progress.
  * Rolls the per-item `cost` into `Stock.repairCostTotal` (used later by the Dashboard's cost/profit calculations).
  * `404`: Repair batch not found. `400`: a Product doesn't belong to this batch, or a Sold Product was marked `Scrap`. `409 Conflict`: an item was already completed, or a concurrency guard was lost.

---

## 7. Finance Module

The Finance module has **more endpoints than a typical "record a payment" surface** — invoices can also be created manually (outside the automatic Order/Stock flow), and there are two different ledger views: a **per-invoice-rollup ledger** (existing, one per party type) and a newer **party-wide Ledger report** with a corrected running-balance calculation. Prefer the party-wide report (`/api/Finance/party/ledger/...`) for any new "statement" UI — it is the one built to reconcile correctly against total invoice/payment history; the older `/customer/:id/ledger` and `/supplier/:id/ledger` endpoints remain for backward compatibility with the existing invoice-list views.

### 7.1 Pages & Routing
* **`/finance/customers/:id/statement`**: Customer ledger/statement (uses the party-wide report).
* **`/finance/suppliers/:id/statement`**: Supplier ledger/statement (uses the party-wide report).
* **`/finance/invoices/new`**: (Optional/advanced) manually create a Customer or Supplier invoice outside the normal Order/Stock flow.

### 7.2 Components
* **`PaymentModal`**: Record a manual payment against an existing invoice (Customer or Supplier).
* **`LedgerStatement`**: Table showing chronological debit/credit entries, using the backend's own `totalDebit`/`totalCredit`/`closingBalance` — **do not recompute a running balance client-side from `balanceAfter`; that field is reserved and always empty (see §7.4)**.

### 7.3 Forms & Validation

**Record Customer Payment** (`CreateCustomerPaymentDto`) / **Record Supplier Payment** (`CreateSupplierPaymentDto`) — identical shape, different endpoint:
* `invoiceId`: Required UUID.
* `amount`: Required number, **min 0.01** (exclusive — zero is rejected), 2 decimals.
* `paymentDate`: Optional ISO-8601 string. Purely informational — the server's own `createdAt` timestamp is authoritative for ordering/ledger purposes.
* `method`: Optional string, max 50 chars.
* `reference`: Optional string, max 100 chars.
* `idempotencyKey`: Optional string, max 100 chars. **Strongly recommended for payment forms** — if the same key is sent twice (e.g. a user double-clicks "Pay" or a network retry occurs), the server returns the **original** payment result instead of creating a duplicate. Generate one client-side UUID per payment-form submission attempt.

**Manual Invoice Creation** (advanced/optional — `CreateCustomerInvoiceDto`):
* `customerId`: Required UUID. `orderId`: Required UUID (must be an existing Order belonging to that Customer with no invoice yet). `totalAmount`, `paidAmount`: Required numbers, min 0, 2 decimals.
* The equivalent Supplier DTO (`CreateSupplierInvoiceDto`) uses `supplierId`/`stockId` in place of `customerId`/`orderId`.
* In practice, invoices are almost always created automatically by Order/Stock creation — this manual path exists for edge cases (e.g. backfilling).

### 7.4 API Calls

* **`POST /api/Finance/customer/payment`** / **`POST /api/Finance/supplier/payment`**
  * Response `201`: `PaymentResponseDto` — `{ paymentId, invoiceId, amount, paidAmount, outstanding, createdAt }` (all money fields are **strings**, `outstanding` is `totalAmount - paidAmount` as of after this payment).
  * `404`: Invoice not found/foreign. `400`: `amount <= 0`. `409 Conflict`: payment would exceed the invoice's outstanding balance (also the response if a concurrent payment already consumed the remaining balance).
* **`POST /api/Finance/customer/invoice`** / **`POST /api/Finance/supplier/invoice`** (manual path)
  * Response `201`: `CustomerInvoiceResponseDto` / `SupplierInvoiceResponseDto`.
  * `404`: Customer/Order (or Supplier/Stock) not found. `400`: amount validation or an Order/Customer (or Stock/Supplier) mismatch. `409 Conflict`: an invoice already exists for that Order/Stock.
* **`GET /api/Finance/customer/:customerId/ledger`** / **`GET /api/Finance/supplier/:supplierId/ledger`** (existing, invoice-rollup view)
  * Response `200`: `{ customer|supplier: {...}, total, paid, outstanding, invoices: [...], pagination: {...} }` — one row per **invoice**, not per ledger entry.
* **`GET /api/Finance/party/ledger/:partyId/:partyType?startDate=...&endDate=...&page=1&pageSize=20`** (party-wide report — preferred for new statement UI)
  * `partyType` path segment must be exactly `Customer` or `Supplier` (case-sensitive) — any other value returns `400`.
  * Response `200`:
    ```json
    {
      "partyId": "uuid",
      "partyType": "Customer",
      "totalDebit": "1000.00",
      "totalCredit": "400.00",
      "closingBalance": "600.00",
      "entries": [
        {
          "id": "uuid", "invoiceId": "uuid | null",
          "debit": "100.00", "credit": "0.00",
          "narration": "string | null",
          "referenceType": "string | null", "referenceId": "uuid | null",
          "createdAt": "ISO-8601"
        }
      ],
      "pagination": { "page": 1, "pageSize": 20, "totalItems": 5, "totalPages": 1 }
    }
    ```
  * **`totalDebit`/`totalCredit`/`closingBalance` reflect ALL entries for the party, regardless of the `startDate`/`endDate` filter** — the date filter only narrows which rows appear in `entries`. Do not expect the visible entries to sum to `closingBalance` when a date filter is applied; that's by design (the summary is always the true全-time balance).
  * **Sign convention differs by `partyType`**: for `Customer`, `closingBalance = totalDebit − totalCredit` (debit = invoiced amount owed to you, credit = payments received). For `Supplier`, it's **flipped**: `closingBalance = totalCredit − totalDebit` (credit = invoiced amount you owe them, debit = payments you made). Build the statement UI's debit/credit column labels and running-total sign per `partyType` accordingly — do not hardcode one convention for both.
  * `entries` are ordered by `createdAt` ascending, then `id` ascending (stable pagination — safe to paginate without rows shifting between pages).
  * `404`: party not found/foreign to the caller.

### 7.5 Business Rules
* Invoices and their initial payment are created automatically by `POST /api/Order` (Customer side) and `POST /api/Stock` (Supplier side) — the manual invoice-creation endpoints in §7.4 are for exceptional cases only.
* Manual payments cannot exceed `totalAmount − paidAmount` of the target invoice (enforced server-side with race-safe concurrency guards — two simultaneous payment attempts against the same invoice cannot both succeed if their combined total would overpay it).
* Ledger entries are **append-only** — there is no edit/delete endpoint for individual ledger rows, by design.

---

## 8. Dashboard Module

### 8.1 Pages & Routing
* **`/`** (Home): Overview of business metrics.

### 8.2 Components
* **`MetricCards`**: One card each for `totalStockValue`, `totalSales`, `totalOrders`, `totalCustomers`, `totalVendors`, `totalRepairCost`, `totalExpense`, `totalPayments`, `customerReceivables`, `totalProfit`, `totalNetProfit` (11 metrics total — see full list in §8.3).
* **`SalesChart`**: Time-series chart showing Sales, (Supplier) Payments, and Outstanding amounts per day.
* **`DateRangePicker`**: Filter dashboard metrics; omit both dates for an all-time total on the metrics endpoint, or a trailing-30-day default window on the chart endpoint (see below).

### 8.3 API Calls

* **`GET /api/DashBoard?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`**
  * Both params optional and independent — omit both for an **all-time** total; provide one or both to filter. `startDate` must be `<= endDate` or the request is rejected `400`. Dates are treated as whole UTC calendar days (the entire `endDate` day is included).
  * Response `200` — `PerformanceMetricsDto` (all money fields are **strings** formatted to 2 decimals; count fields are plain numbers):
    ```json
    {
      "totalStockValue": "0.00",
      "totalSales": "0.00",
      "totalOrders": 0,
      "totalCustomers": 0,
      "totalVendors": 0,
      "totalRepairCost": "0.00",
      "totalExpense": "0.00",
      "totalPayments": "0.00",
      "customerReceivables": "0.00",
      "totalProfit": "0.00",
      "totalNetProfit": "0.00"
    }
    ```
  * `400`: invalid `startDate`/`endDate`, or `startDate > endDate`.
* **`GET /api/DashBoard/sales-chart?startDate=...&endDate=...&type=sales|payments|outstanding|all`**
  * `type` optional, defaults to `all`. If **neither** `startDate` nor `endDate` is given, the backend defaults to a **trailing 30-day UTC window ending today** (the chart is never unbounded) — the metrics endpoint above has no such default and returns all-time totals instead when dates are omitted; don't conflate the two endpoints' default behavior.
  * Response `200` — `SalesChartDto`:
    ```json
    {
      "type": "all",
      "dates": ["2026-07-01", "2026-07-02", "..."],
      "sales": [100, 0, "..."],
      "payments": [0, 50, "..."],
      "outstanding": [80, 0, "..."]
    }
    ```
  * `dates` is always a **complete, gap-free** array of every UTC day in range (zero-filled, no missing days) — safe to zip directly with `sales`/`payments`/`outstanding` by index.
  * `sales`/`payments`/`outstanding` are each only present in the response when relevant to the requested `type` (`all` returns all three; `type=sales` returns only `sales`, etc.) — check for `undefined`, don't assume all three keys always exist.
  * **`payments` is specifically Supplier payments**, not Customer payments, despite the generic name — this is intentional, preserved from the original frontend contract. Label the chart legend "Supplier Payments", not just "Payments", to avoid user confusion.
  * **`outstanding` is a per-day net-new figure**, not a running/cumulative balance: for each day, it's `(invoices created that day) − (their same-day initial payment)`. It is **not** "current total outstanding as of that day" — do not sum it cumulatively expecting it to reconcile with `customerReceivables` from §8.3's metrics endpoint on any single day; only the metrics endpoint's `customerReceivables` represents a true point-in-time balance.
  * `400`: invalid `startDate`/`endDate`, `startDate > endDate`, or `type` is not one of `sales`/`payments`/`outstanding`/`all`.

### 8.4 Business Rules — exact formulas
* `totalStockValue` = SUM(`Stock.unitPrice × Stock.quantityAvailable`) — **unsold inventory only**, not the value of the full purchased batch.
* `totalSales` = SUM(`Order.totalPrice`) in range. `totalOrders` = COUNT(Order) in range.
* `totalRepairCost` = SUM(`RepairHistory.cost`) for repairs completed in range.
* `totalExpense` is **always `"0.00"`** — there is no Expense model in this backend. Do not build an "add expense" form against this API yet; it isn't wired to anything.
* `customerReceivables` = SUM(`CustomerInvoice.totalAmount − CustomerInvoice.paidAmount`) for invoices created in range.
* `totalProfit` = `totalSales − costOfGoodsSold − totalRepairCost`, where `costOfGoodsSold` = SUM(`Order.quantity × Stock.unitPrice`) for orders in range — i.e. the supplier **cost basis of units actually sold**, never the value of the entire purchased Stock batch (a batch that's only partially sold does not have its unsold portion counted as an expense).
* `totalNetProfit` = `totalProfit − totalExpense` — since `totalExpense` is always `0`, **`totalNetProfit` currently always equals `totalProfit`**. Both fields are returned so the UI has a stable place to show a true net-profit figure once an Expense model exists in a future backend version, without a breaking API change. Repair cost is deducted exactly once (inside `totalProfit`) — never build client-side logic that subtracts it again.
* All money fields across both endpoints are decimal-safe (server-side Decimal arithmetic, formatted to exactly 2 decimals as strings) — parse with a decimal-safe library on the client if performing further arithmetic (e.g. `Number()` is fine for *display*, but avoid client-side floating-point math for anything that gets sent back to the server).
