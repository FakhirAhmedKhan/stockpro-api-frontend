The screenshot is only **161 px wide**, so several Swagger labels are not readable accurately. The text below reconstructs the API from the backend module documentation; fields marked optional may differ slightly from the generated Swagger schema.

## API information

```text
API: StockPro API
Base URL: http://localhost:3030
Swagger UI: http://localhost:3030/api-docs
Authentication: Bearer JWT
```

Only registration and login are public. The remaining endpoints require a bearer token. 

# Endpoints

## 1. User and Authentication

```http
POST /api/User/register
POST /api/User/login
GET  /api/User?Id={userId}
```

```text
POST /api/User/register
Auth: Public
Rate limit: Shared authentication limiter

POST /api/User/login
Auth: Public
Rate limit: Shared authentication limiter

GET /api/User?Id={userId}
Auth: Bearer JWT
Purpose: Get a user profile
```



---

## 2. Customers

```http
GET    /api/Customer
GET    /api/Customer/{id}
POST   /api/Customer
PUT    /api/Customer/{id}
DELETE /api/Customer/{id}
```

```text
GET /api/Customer
Purpose: Paginated customer list
Queries: page, pageSize, search

GET /api/Customer/{id}
Purpose: Get one customer

POST /api/Customer
Purpose: Create customer

PUT /api/Customer/{id}
Purpose: Update customer

DELETE /api/Customer/{id}
Purpose: Soft-delete customer by setting activeStatus=false
```

The documentation explicitly confirms Customer GET, POST, PUT, and DELETE operations, although the compressed screenshot does not make every route signature readable.

---

## 3. Suppliers

```http
GET  /api/supplier
GET  /api/supplier/{id}
POST /api/supplier
```

There is currently no Supplier PUT or DELETE endpoint. 

---

## 4. Stock

Confirmed creation endpoint:

```http
POST /api/Stock
```

The Stock controller also contains read/update/delete functionality, but only the creation route is fully documented in the supplied module report.

```text
POST /api/Stock
Purpose:
- Create Stock batch
- Generate Product units
- Create Supplier invoice
- Create initial payment
- Create Ledger entry
```



---

## 5. Products

Confirmed manual creation endpoint:

```http
POST /api/Product
```

Products are normally generated automatically when Stock is created. 

---

## 6. Orders

```http
POST /api/Order
PUT  /api/Order/{id}
```

```text
POST /api/Order
Purpose:
- Create order
- Mark Products as Sold
- Update Stock availability
- Create Customer invoice
- Create Ledger entry

PUT /api/Order/{id}
Purpose:
- Update order quantity and total
```

---

## 7. Returns

```http
POST /api/return
GET  /api/return/history
```

```text
POST /api/return
Purpose: Return sold Products

GET /api/return/history
Queries:
- stockId
- returnType
- startDate
- endDate
```

Supported return types:

```text
ToStock
ToRepair
ToVendor
ToScrap
```



---

## 8. Repairs

The original route spelling is `Reparing`.

```http
POST /api/Reparing/send
POST /api/Reparing/complete
```

```text
POST /api/Reparing/send
Purpose: Send one or more Products for repair

POST /api/Reparing/complete
Purpose: Complete individual repair items as Repaired or Scrap
```

---

## 9. Finance

### Supplier invoices

```http
POST /api/Finance/supplier/invoice
GET  /api/Finance/supplier/{supplierId}/ledger
```



### Customer invoices

```http
POST /api/Finance/customer/invoice
GET  /api/Finance/customer/{customerId}/ledger
```



### Payments

```http
POST /api/Finance/customer/payment
POST /api/Finance/supplier/payment
```



### General party ledger

```http
GET /api/Finance/party/ledger/{partyId}/{partyType}
```

Supported party types:

```text
Customer
Supplier
```



---

## 10. Dashboard

```http
GET /api/DashBoard
GET /api/DashBoard/sales-chart
```

```text
GET /api/DashBoard
Queries:
- startDate
- endDate

GET /api/DashBoard/sales-chart
Queries:
- startDate
- endDate
- type
```

Supported chart types:

```text
sales
payments
outstanding
all
```



---

## 11. Invoice PDF

```http
GET /api/Invoice/download/{id}
GET /api/Invoice/customer/{id}
```

```text
GET /api/Invoice/download/{id}
Purpose: Download Supplier invoice PDF

GET /api/Invoice/customer/{id}
Purpose: Download Customer invoice PDF

Response Content-Type: application/pdf
```

Foreign or missing invoices return `404`; missing authentication returns `401`. 

# Schemas

## RegisterDto

```ts
interface RegisterDto {
  fullName: string;      // Required, maximum 100
  email: string;         // Required, valid email, maximum 150
  userName: string;      // Required, maximum 50
  password: string;      // Required, 6–100 characters
  phoneNumber?: string;
  currency?: string;
}
```

## LoginDto

```ts
interface LoginDto {
  email: string;
  password: string;
}
```

## UserInfoDto

```ts
interface UserInfoDto {
  userId: string;
  userName: string;
  authority: string[];
  email: string;
  phone: string | null;
  curency: string | null;
}
```

The response uses the existing misspelled field `curency`.

## LoginResponseDto

```ts
interface LoginResponseDto {
  token: string;
  user: UserInfoDto;
}
```

---

## CustomerDto

```ts
interface CustomerDto {
  id?: string;
  fullName: string;
  email?: string | null;
  phoneNumber?: string | null;
  role?: string;
  activeStatus: boolean;
  userId?: string;
  createdAt?: string;
  lastLoginAt?: string | null;
}
```

Current validation behavior:

```text
fullName: required, maximum 100
email: not reliably validated in the original DTO
activeStatus: defaults to false when omitted
```

---

## SupplierDto

```ts
interface SupplierDto {
  id?: string;
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
  activeStatus: boolean;
  userId?: string;
  createdAt?: string;
}
```

Current validation behavior:

```text
name: required, maximum 100
email: validation is not enforced in the original DTO
activeStatus: defaults to false when omitted
```



---

## StockDto

```ts
interface StockDto {
  id?: string;
  title: string;

  supplierId: string;

  totalQuantity: number;
  quantityAvailable?: number;

  unitPrice: number;
  stockPrice: number;
  totalAmountPaid: number;

  storage?: string | null;
  color?: string | null;
  condition?: string | null;

  reorderLevel?: number;
  repairningCost?: number;

  userId?: string;
  createdAt?: string;
  lastUpdated?: string;
}
```

Creating Stock also generates Products and creates the Supplier invoice and Ledger records. 

---

## ProductDto

```ts
interface ProductDto {
  id?: string;
  stockId: string;

  name: string;
  barcode?: string;

  storage?: string | null;
  color?: string | null;
  condition?: string | null;

  price: number;
  status?: ProductStatus;
  message?: string | null;

  userId?: string;
}
```

## ProductStatus

The documentation confirms these statuses or transitions:

```ts
enum ProductStatus {
  Available = 0,
  Sold = 1,
  SentToRepair = 2,
  Scrap = 3,
  Repaired = 4,
  Vendor = 5,
}
```

The exact numeric values other than `Available = 0`, `Scrap = 3`, and `Vendor = 5` should be checked against the enum source.

---

## OrderDto

```ts
interface OrderDto {
  id?: string;

  customerId: string;
  stockId: string;

  productIds: string[];

  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paidAmount?: number;

  orderDate?: string;
  userId?: string;
}
```

Order creation expects specific serialized Product IDs from the selected Stock. 

---

## ReturnDto

```ts
interface ReturnDto {
  stockId: string;
  returnType: ReturnType;
  narration?: string;
  products: ReturnProductDto[];
}
```

## ReturnProductDto

```ts
interface ReturnProductDto {
  productId: string;
  quantity: number;
}
```

## ReturnType

```ts
enum ReturnType {
  ToStock = "ToStock",
  ToRepair = "ToRepair",
  ToVendor = "ToVendor",
  ToScrap = "ToScrap",
}
```



---

## SendToRepairDto

```ts
interface SendToRepairDto {
  stockId: string;
  productIds: string[];
  narration?: string;
  technician?: string;
}
```

## SentToRepairingDto

```ts
interface SentToRepairingDto {
  id: string;
  stockId: string;
  narration?: string | null;
  technician?: string | null;
  status: RepairStatus;
  sentAt: string;
  completedAt?: string | null;
  items: CompleteRepairingDto[];
}
```

## CompleteRepairingDto

```ts
interface CompleteRepairingDto {
  id: string;
  productId: string;
  itemStatus: RepairItemStatus;
  updatedAt?: string | null;
  history?: RepairHistoryDto[];
}
```



---

## CompleteRepairDto

The original service receives Product-based updates containing status and cost:

```ts
interface CompleteRepairDto {
  repairId: string;
  narration?: string;
  products: Record<string, RepairCompletionItem>;
}
```

```ts
interface RepairCompletionItem {
  status: RepairItemStatus;
  cost: number;
}
```

## RepairHistoryDto

```ts
interface RepairHistoryDto {
  id?: string;
  completeRepairingId: string;
  productId: string;
  status: RepairItemStatus;
  narration?: string | null;
  cost: number;
  updatedAt: string;
}
```

## Repair statuses

```ts
enum RepairStatus {
  Pending = "Pending",
  Repaired = "Repaired",
}
```

```ts
enum RepairItemStatus {
  Pending = "Pending",
  Repaired = "Repaired",
  Scrap = "Scrap",
}
```



---

## SupplierInvoiceDto

```ts
interface SupplierInvoiceDto {
  id?: string;
  supplierId: string;
  stockId: string;

  totalAmount: number;
  paidAmount: number;

  payments?: SupplierPaymentDto[];
  createdAt?: string;
}
```

## SupplierPaymentDto

```ts
interface SupplierPaymentDto {
  id?: string;
  supplierInvoiceId?: string;
  amount: number;
  paymentDate?: string;
}
```

---

## CustomerInvoiceDto

```ts
interface CustomerInvoiceDto {
  id?: string;
  customerId: string;
  orderId: string;

  totalAmount: number;
  paidAmount: number;

  payments?: CustomerPaymentDto[];
  createdAt?: string;
}
```

## CustomerPaymentDto

```ts
interface CustomerPaymentDto {
  id?: string;
  salesInvoiceId?: string;
  amount: number;
  paymentDate?: string;
}
```

---

## LedgerDto

```ts
interface LedgerDto {
  id: string;

  partyId: string;
  partyType: PartyType;

  debit: number;
  credit: number;
  balance: number;

  narration: string;
  createdAt: string;
}
```

## LedgerReportDto

```ts
interface LedgerReportDto {
  partyId: string;
  partyType: PartyType;

  totalDebit: number;
  totalCredit: number;
  closingBalance: number;

  entries: LedgerDto[];
}
```

## PartyType

```ts
enum PartyType {
  Customer = "Customer",
  Supplier = "Supplier",
}
```



---

## PerformanceMetricsDto

```ts
interface PerformanceMetricsDto {
  totalStockValue: number;
  totalSales: number;
  totalOrders: number;

  totalCustomers: number;
  totalVendors: number;

  totalRepairCost: number;
  totalExpense: number;
  totalPayments: number;

  customerReceivables: number;

  totalProfit: number;
  totalNetProfit: number;
}
```

## DashboardQuery

```ts
interface DashboardQuery {
  startDate?: string;
  endDate?: string;
}
```

## SalesChartQuery

```ts
interface SalesChartQuery {
  startDate?: string;
  endDate?: string;
  type?: "sales" | "payments" | "outstanding" | "all";
}
```

## SalesChartDto

```ts
interface SalesChartDto {
  sales: Array<{
    date: string;
    amount: number;
  }>;

  payments: Array<{
    date: string;
    amount: number;
  }>;

  outstanding: Array<{
    date: string;
    amount: number;
  }>;
}
```

