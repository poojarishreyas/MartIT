# Mart-It Frontend Development Guide

A comprehensive guide for building the Mart-It frontend application. This document maps every feature to its corresponding backend API.

## Tech Stack (Recommended)

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand or Redux Toolkit
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React or Heroicons

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── common/          # Header, Footer, Layout
│   │   ├── product/         # Product-related components
│   │   ├── cart/            # Cart components
│   │   ├── seller/          # Seller dashboard components
│   │   ├── repair/          # Repair service components
│   │   └── auth/            # Auth forms
│   ├── pages/
│   │   ├── auth/            # Login, Register pages
│   │   ├── products/        # Product listing, detail pages
│   │   ├── cart/            # Cart, Checkout pages
│   │   ├── orders/          # Order history pages
│   │   ├── seller/          # Seller dashboard pages
│   │   ├── technician/      # Technician dashboard pages
│   │   └── repair/          # Repair request pages
│   ├── services/
│   │   ├── api.ts           # Axios instance configuration
│   │   ├── auth.ts          # Auth API calls
│   │   ├── products.ts      # Product API calls
│   │   ├── cart.ts          # Cart API calls
│   │   ├── seller.ts        # Seller API calls
│   │   ├── repair.ts        # Repair API calls
│   │   └── websocket.ts     # WebSocket for video calls
│   ├── stores/
│   │   ├── authStore.ts     # Auth state
│   │   ├── cartStore.ts     # Cart state
│   │   └── notificationStore.ts
│   ├── hooks/               # Custom hooks
│   ├── types/               # TypeScript interfaces
│   ├── utils/               # Helper functions
│   └── App.tsx
├── .env.local
├── package.json
└── vite.config.ts
```

---

## API Configuration

### Base Setup

Create `/src/services/api.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Environment Variables

Create `.env.local`:
```
VITE_API_URL=http://localhost:8080
```

---

# Features to Build

---

## 1. Authentication System

### 1.1 Registration Page

**Location**: `/src/pages/auth/RegisterPage.tsx`

**API**: `POST /api/auth/register`

**Features to Build**:
- Registration form with fields: Name, Email, Password, Confirm Password
- Client-side validation (email format, password min 8 chars, passwords match)
- Role selection (optional - default to customer)
- Success: Redirect to login page
- Error: Display "Email already exists" message

**API Call**:
```typescript
// POST /api/auth/register
const register = async (data: {
  name: string;
  email: string;
  password: string;
  role?: 'customer' | 'seller' | 'technician';
}) => {
  const response = await api.post('/api/auth/register', data);
  return response.data;
};
```

**UI Components Needed**:
- `Input` component with label and error state
- `Button` component with loading state
- `FormError` component for displaying errors
- Link to Login page

---

### 1.2 Login Page

**Location**: `/src/pages/auth/LoginPage.tsx`

**API**: `POST /api/auth/login`

**Features to Build**:
- Login form with Email and Password fields
- "Remember me" checkbox (optional)
- On success: Store token in localStorage, store user in state, redirect based on role
- On error: Display "Invalid credentials" message

**API Call**:
```typescript
// POST /api/auth/login
const login = async (data: { email: string; password: string }) => {
  const response = await api.post('/api/auth/login', data);
  // Response: { token: string, user: { id, name, email, role } }
  return response.data;
};
```

**Post-Login Redirect Logic**:
| User Role | Redirect To |
|-----------|-------------|
| customer | `/` (Home) |
| seller | `/seller/dashboard` |
| technician | `/technician/dashboard` |

**UI Components Needed**:
- Email input field
- Password input field with show/hide toggle
- Submit button with loading spinner
- Link to Register page
- Link to Forgot Password (future feature)

---

### 1.3 Auth State Management

**Location**: `/src/stores/authStore.ts`

**State to Maintain**:
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  loadFromStorage: () => void;
}
```

**On App Load**:
- Check localStorage for existing token
- If token exists, set as authenticated
- Add token to Axios interceptor

---

## 2. Product Catalog (Public)

### 2.1 Home Page

**Location**: `/src/pages/HomePage.tsx`

**API**: `GET /api/public/products`

**Features to Build**:
- Hero section with banner/promotional content
- Featured categories section
- Featured/New products grid (first 8-12 products)
- "View All Products" button

**UI Components Needed**:
- `HeroSection` - Banner with CTA
- `CategoryCard` - Clickable category cards
- `ProductCard` - Product thumbnail, name, price, Add to Cart button
- `ProductGrid` - Grid layout for products

---

### 2.2 Product Listing Page

**Location**: `/src/pages/products/ProductListPage.tsx`

**API**: `GET /api/public/products`

**Features to Build**:
- Product grid with all products
- Sidebar with filters:
  - Category filter (checkboxes)
  - Price range filter (min/max inputs or slider)
- Search bar in header
- Sort dropdown (Price Low-High, Price High-Low, Newest)
- Pagination (if backend supports it - currently returns all)
- Loading skeleton while fetching
- Empty state when no products found

**API Call**:
```typescript
// GET /api/public/products
const getProducts = async () => {
  const response = await api.get('/api/public/products');
  // Returns array of products with inventory
  return response.data;
};
```

**Client-Side Filtering** (until backend adds filters):
```typescript
// Filter products on frontend
const filteredProducts = products
  .filter(p => !selectedCategory || p.category === selectedCategory)
  .filter(p => p.price >= minPrice && p.price <= maxPrice)
  .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  .sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    return 0;
  });
```

**UI Components Needed**:
- `ProductCard` - Image, name, price, stock badge, Add to Cart
- `CategoryFilter` - Checkbox list of categories
- `PriceFilter` - Min/Max inputs
- `SearchBar` - Input with search icon
- `SortDropdown` - Select menu
- `Pagination` - Page numbers or Load More button
- `ProductSkeleton` - Loading placeholder
- `EmptyState` - "No products found" message

---

### 2.3 Product Detail Page

**Location**: `/src/pages/products/ProductDetailPage.tsx`

**API**: `GET /api/public/products/{id}`

**Features to Build**:
- Product images gallery/carousel
- Product name and description
- Price display (formatted currency)
- Stock status indicator:
  - "In Stock" (green) if `inventory.stock > inventory.reserved`
  - "Out of Stock" (red) if `inventory.stock <= inventory.reserved`
- Quantity selector (1 to available stock)
- "Add to Cart" button
- Back to products link

**API Call**:
```typescript
// GET /api/public/products/:id
const getProduct = async (id: string) => {
  const response = await api.get(`/api/public/products/${id}`);
  return response.data;
};
```

**UI Components Needed**:
- `ImageGallery` - Main image with thumbnails
- `QuantitySelector` - Increment/decrement buttons with input
- `StockBadge` - In Stock / Out of Stock indicator
- `AddToCartButton` - With loading state
- `Breadcrumb` - Navigation trail

---

## 3. Shopping Cart

### 3.1 Cart Page

**Location**: `/src/pages/cart/CartPage.tsx`

**APIs**:
- `GET /api/cart` - Fetch cart
- `POST /api/cart` - Add item
- `DELETE /api/cart/{id}` - Remove item

**Features to Build**:
- List of cart items with:
  - Product image (thumbnail)
  - Product name (link to product page)
  - Unit price
  - Quantity display
  - Line total (price × quantity)
  - Remove button
- Cart summary:
  - Subtotal calculation
  - Proceed to Checkout button
- Empty cart state with "Continue Shopping" link
- Cart icon in header with item count badge

**API Calls**:
```typescript
// GET /api/cart
const getCart = async () => {
  const response = await api.get('/api/cart');
  // Returns cart with items array, each item has product details
  return response.data;
};

// POST /api/cart
const addToCart = async (productId: string, quantity: number) => {
  const response = await api.post('/api/cart', {
    product_id: productId,
    quantity: quantity,
  });
  return response.data;
};

// DELETE /api/cart/:itemId
const removeFromCart = async (itemId: string) => {
  await api.delete(`/api/cart/${itemId}`);
};
```

**Cart State Management** (`/src/stores/cartStore.ts`):
```typescript
interface CartState {
  items: CartItem[];
  isLoading: boolean;
  
  // Computed
  totalItems: number;
  subtotal: number;
  
  // Actions
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => void;
}
```

**UI Components Needed**:
- `CartItem` - Row with product info, quantity, remove button
- `CartSummary` - Subtotal and checkout button
- `EmptyCart` - Empty state with shopping link
- `CartIcon` - Header icon with badge count

---

### 3.2 Mini Cart (Header Dropdown)

**Location**: `/src/components/cart/MiniCart.tsx`

**Features to Build**:
- Dropdown showing first 3-5 cart items
- View Cart button
- Checkout button
- Subtotal display

---

## 4. Seller Dashboard

### 4.1 Seller Onboarding Page

**Location**: `/src/pages/seller/SellerOnboardingPage.tsx`

**API**: `POST /api/seller/register`

**Features to Build**:
- Multi-step form or single form with:
  - Store Name (required)
  - Store Description (textarea)
  - GST Number (optional)
  - Store Address (textarea)
- Terms acceptance checkbox
- Submit button
- Redirect to Seller Dashboard on success

**API Call**:
```typescript
// POST /api/seller/register
const registerSeller = async (data: {
  store_name: string;
  store_description?: string;
  gst_number?: string;
  address?: string;
}) => {
  const response = await api.post('/api/seller/register', data);
  return response.data;
};
```

**Access Control**:
- Only show to logged-in users
- Check if already a seller (GET profile first), redirect if exists

---

### 4.2 Seller Dashboard Page

**Location**: `/src/pages/seller/DashboardPage.tsx`

**APIs**:
- `GET /api/seller/profile` - Get store info
- `GET /api/seller/products` - Get product count/list

**Features to Build**:
- Welcome message with store name
- Quick stats cards:
  - Total Products
  - Active Products
  - Low Stock Items (stock < 10)
- Recent products list (last 5)
- Quick action buttons:
  - Add New Product
  - View All Products

**UI Components Needed**:
- `StatCard` - Icon, number, label
- `QuickActionButton` - Icon + text button
- `RecentProductsList` - Compact product table

---

### 4.3 Seller Products Page

**Location**: `/src/pages/seller/ProductsPage.tsx`

**API**: `GET /api/seller/products`

**Features to Build**:
- Table with columns:
  - Image (thumbnail)
  - Name
  - Category
  - Price
  - Stock
  - Status (Active/Inactive)
  - Actions (Edit, Delete)
- "Add Product" button at top
- Search/filter products
- Confirmation modal for delete action

**API Call**:
```typescript
// GET /api/seller/products
const getSellerProducts = async () => {
  const response = await api.get('/api/seller/products');
  return response.data;
};

// DELETE /api/seller/products/:id
const deleteProduct = async (id: string) => {
  await api.delete(`/api/seller/products/${id}`);
};
```

**UI Components Needed**:
- `ProductTable` - Sortable data table
- `ActionMenu` - Dropdown with Edit/Delete
- `ConfirmDialog` - "Are you sure?" modal
- `StockBadge` - Color-coded stock level

---

### 4.4 Add Product Page

**Location**: `/src/pages/seller/AddProductPage.tsx`

**API**: `POST /api/seller/products`

**Features to Build**:
- Product form with fields:
  - Name (required, text input)
  - Description (textarea)
  - Category (dropdown or text input)
  - Price (number input, min 0)
  - Stock (number input, min 0)
  - Images (URL inputs - can add multiple)
- Image preview for entered URLs
- Form validation
- Submit button with loading state
- Redirect to products list on success

**API Call**:
```typescript
// POST /api/seller/products
const createProduct = async (data: {
  name: string;
  description?: string;
  category?: string;
  price: number;
  stock: number;
  images?: string[];
}) => {
  const response = await api.post('/api/seller/products', data);
  return response.data;
};
```

**UI Components Needed**:
- Form input components
- `ImageUrlInput` - Input with preview
- `MultiImageInput` - Add/remove multiple image URLs
- `PriceInput` - Formatted currency input
- `NumberInput` - For stock quantity

---

### 4.5 Edit Product Page

**Location**: `/src/pages/seller/EditProductPage.tsx`

**APIs**:
- `GET /api/public/products/{id}` - Load current data
- (Need to implement) `PUT /api/seller/products/{id}` - Update product

**Note**: Backend currently lacks update endpoint. Build the UI and implement when backend is ready.

---

## 5. Repair Services (Customer)

### 5.1 Request Repair Page

**Location**: `/src/pages/repair/RequestRepairPage.tsx`

**API**: `POST /api/repair/request`

**Features to Build**:
- Form with fields:
  - Device Type (dropdown: Mobile, Laptop, Tablet, Desktop, Other)
  - Issue Summary (short text, required)
  - Detailed Description (textarea)
  - Preferred Mode (radio buttons):
    - Video Call - Get help remotely via video
    - Home Visit - Technician visits your location
- Submit button
- Success message with request ID
- Redirect to repair history

**API Call**:
```typescript
// POST /api/repair/request
const createRepairRequest = async (data: {
  device_type: string;
  issue_summary: string;
  description?: string;
  preferred_mode: 'video_call' | 'home_visit';
}) => {
  const response = await api.post('/api/repair/request', data);
  return response.data;
};
```

**UI Components Needed**:
- `Select` - Dropdown for device type
- `RadioGroup` - For preferred mode selection
- `Textarea` - For description
- Device type icons

---

### 5.2 Repair History Page

**Location**: `/src/pages/repair/RepairHistoryPage.tsx`

**API**: `GET /api/repair/history`

**Features to Build**:
- List of customer's repair requests
- Each item shows:
  - Device type with icon
  - Issue summary
  - Status badge (Pending/Assigned/Completed)
  - Date created
  - Technician name (if assigned)
- Click to view details
- "Request New Repair" button

**API Call**:
```typescript
// GET /api/repair/history
const getRepairHistory = async () => {
  const response = await api.get('/api/repair/history');
  return response.data;
};
```

**UI Components Needed**:
- `RepairRequestCard` - Card for each request
- `StatusBadge` - Colored badge for status
- `DeviceIcon` - Icon based on device type

---

### 5.3 Repair Detail Page

**Location**: `/src/pages/repair/RepairDetailPage.tsx`

**API**: `GET /api/repair/history` (filter by ID on frontend)

**Features to Build**:
- Full request details:
  - Device type
  - Issue summary
  - Full description
  - Status with timeline
  - Preferred mode
  - Created date
- If assigned:
  - Technician name
  - "Start Video Call" button (if mode is video_call)
- Status-specific actions (future: confirm quote, leave review)

**UI Components Needed**:
- `StatusTimeline` - Visual progress indicator
- `TechnicianCard` - Technician info display
- `VideoCallButton` - Initiates video call

---

### 5.4 Video Call Page

**Location**: `/src/pages/repair/VideoCallPage.tsx`

**API**: `WebSocket ws://localhost:8080/ws?roomID={repairRequestId}`

**Features to Build**:
- Local video preview (small, corner)
- Remote video display (large, main)
- Controls:
  - Mute/Unmute audio
  - Enable/Disable video
  - End call
- Connection status indicator
- Call timer

**WebSocket Integration**:
```typescript
// Connect to signaling server
const ws = new WebSocket(`ws://localhost:8080/ws?roomID=${repairRequestId}`);

// Message types to handle:
// - offer: Received SDP offer
// - answer: Received SDP answer
// - ice-candidate: Received ICE candidate

// Send signaling messages
ws.send(JSON.stringify({
  type: 'offer',
  roomID: repairRequestId,
  payload: sdpOffer,
}));
```

**WebRTC Flow**:
1. Both parties connect to WebSocket with same roomID
2. Caller creates offer, sends via WebSocket
3. Callee receives offer, creates answer, sends via WebSocket
4. Both exchange ICE candidates via WebSocket
5. Direct peer-to-peer video connection established

**UI Components Needed**:
- `VideoPlayer` - Video element wrapper
- `CallControls` - Mute, video toggle, end call buttons
- `ConnectionStatus` - Connecting/Connected/Disconnected indicator
- `CallTimer` - Duration display

---

## 6. Technician Dashboard

### 6.1 Technician Onboarding Page

**Location**: `/src/pages/technician/TechnicianOnboardingPage.tsx`

**API**: `POST /api/repair/technician/register`

**Features to Build**:
- Registration form:
  - Specialization (dropdown: Mobile, Laptop, Desktop, Tablet, All)
  - Experience (text: "2 years", "5+ years", etc.)
- Terms acceptance
- Submit button
- Redirect to technician dashboard

**API Call**:
```typescript
// POST /api/repair/technician/register
const registerTechnician = async (data: {
  specialization: string;
  experience: string;
}) => {
  const response = await api.post('/api/repair/technician/register', data);
  return response.data;
};
```

---

### 6.2 Technician Dashboard Page

**Location**: `/src/pages/technician/DashboardPage.tsx`

**APIs**:
- `GET /api/repair/technician/profile` - Get profile
- `GET /api/repair/my-jobs` - Get assigned jobs

**Features to Build**:
- Profile card with:
  - Specialization
  - Experience
  - Rating (stars)
  - Availability toggle (future feature)
- Stats:
  - Active Jobs count
  - Completed Jobs count
- Quick links:
  - View Pending Requests
  - View My Jobs

**API Calls**:
```typescript
// GET /api/repair/technician/profile
const getTechnicianProfile = async () => {
  const response = await api.get('/api/repair/technician/profile');
  return response.data;
};
```

---

### 6.3 Pending Requests Page

**Location**: `/src/pages/technician/PendingRequestsPage.tsx`

**API**: `GET /api/repair/pending`

**Features to Build**:
- List of all pending repair requests
- Each request shows:
  - Customer name
  - Device type
  - Issue summary
  - Preferred mode (Video Call / Home Visit)
  - Time since created
  - "Accept Job" button
- Filter by device type (match specialization)
- Empty state if no pending requests

**API Calls**:
```typescript
// GET /api/repair/pending
const getPendingRequests = async () => {
  const response = await api.get('/api/repair/pending');
  return response.data;
};

// PUT /api/repair/accept/:id
const acceptRequest = async (id: string) => {
  const response = await api.put(`/api/repair/accept/${id}`);
  return response.data;
};
```

**UI Components Needed**:
- `PendingRequestCard` - Request details with Accept button
- `AcceptButton` - With confirmation and loading state
- `DeviceFilter` - Filter by device type

---

### 6.4 My Jobs Page

**Location**: `/src/pages/technician/MyJobsPage.tsx`

**API**: `GET /api/repair/my-jobs`

**Features to Build**:
- List of accepted jobs (assigned to this technician)
- Each job shows:
  - Customer name and contact
  - Device type
  - Issue summary
  - Status
  - "Start Video Call" button (if video_call mode)
  - "Mark Complete" button (future feature)
- Tabs or filters: Active / Completed

**API Call**:
```typescript
// GET /api/repair/my-jobs
const getMyJobs = async () => {
  const response = await api.get('/api/repair/my-jobs');
  return response.data;
};
```

---

### 6.5 Job Detail Page

**Location**: `/src/pages/technician/JobDetailPage.tsx`

**Features to Build**:
- Full job details
- Customer information
- Issue description
- Action buttons based on status and mode
- Video call integration

---

## 7. Common Components

### 7.1 Header Component

**Location**: `/src/components/common/Header.tsx`

**Features**:
- Logo (link to home)
- Navigation links (conditional based on auth state and role)
- Search bar
- Cart icon with count badge (for customers)
- User menu dropdown:
  - Profile
  - Dashboard (role-specific)
  - Logout

**Navigation by Role**:

| Role | Nav Links |
|------|-----------|
| Guest | Home, Products, Login, Register |
| Customer | Home, Products, My Orders, Repair, Cart |
| Seller | Dashboard, Products, Orders |
| Technician | Dashboard, Pending Jobs, My Jobs |

---

### 7.2 Footer Component

**Location**: `/src/components/common/Footer.tsx`

**Features**:
- About links
- Contact information
- Social media links
- Copyright notice

---

### 7.3 Protected Route Component

**Location**: `/src/components/auth/ProtectedRoute.tsx`

**Features**:
- Check if user is authenticated
- Redirect to login if not
- Optional role check

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}
```

---

### 7.4 Layout Components

**Layouts to Build**:
- `MainLayout` - Header + Content + Footer (for public pages)
- `AuthLayout` - Minimal header for login/register
- `DashboardLayout` - Sidebar + Header + Content (for seller/technician)

---

## 8. TypeScript Interfaces

**Location**: `/src/types/`

```typescript
// /src/types/user.ts
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'seller' | 'technician' | 'admin';
  created_at: string;
  updated_at: string;
}

// /src/types/product.ts
interface Product {
  id: string;
  seller_id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  is_active: boolean;
  inventory: Inventory;
  created_at: string;
  updated_at: string;
}

interface Inventory {
  id: string;
  product_id: string;
  stock: number;
  reserved: number;
  updated_at: string;
}

// /src/types/cart.ts
interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  created_at: string;
  updated_at: string;
}

interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  product: Product;
  quantity: number;
}

// /src/types/seller.ts
interface Seller {
  id: string;
  user_id: string;
  store_name: string;
  store_description: string;
  gst_number: string;
  address: string;
  is_verified: boolean;
  is_quick_commerce: boolean;
  created_at: string;
  updated_at: string;
}

// /src/types/repair.ts
interface Technician {
  id: string;
  user_id: string;
  specialization: string;
  experience: string;
  is_available: boolean;
  rating: number;
  created_at: string;
}

interface RepairRequest {
  id: string;
  customer_id: string;
  customer?: User;
  technician_id?: string;
  device_type: string;
  issue_summary: string;
  description: string;
  status: 'pending' | 'assigned' | 'completed';
  preferred_mode: 'video_call' | 'home_visit';
  created_at: string;
  updated_at: string;
}
```

---

## 9. Routing Configuration

**Location**: `/src/App.tsx`

```typescript
// Route structure
const routes = [
  // Public routes
  { path: '/', element: <HomePage /> },
  { path: '/products', element: <ProductListPage /> },
  { path: '/products/:id', element: <ProductDetailPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  
  // Customer routes (protected)
  { path: '/cart', element: <CartPage />, protected: true },
  { path: '/checkout', element: <CheckoutPage />, protected: true },
  { path: '/orders', element: <OrdersPage />, protected: true },
  { path: '/repair/request', element: <RequestRepairPage />, protected: true },
  { path: '/repair/history', element: <RepairHistoryPage />, protected: true },
  { path: '/repair/:id', element: <RepairDetailPage />, protected: true },
  { path: '/repair/:id/call', element: <VideoCallPage />, protected: true },
  
  // Seller routes (protected, role: seller)
  { path: '/seller/onboarding', element: <SellerOnboardingPage />, roles: ['customer'] },
  { path: '/seller/dashboard', element: <SellerDashboardPage />, roles: ['seller'] },
  { path: '/seller/products', element: <SellerProductsPage />, roles: ['seller'] },
  { path: '/seller/products/new', element: <AddProductPage />, roles: ['seller'] },
  { path: '/seller/products/:id/edit', element: <EditProductPage />, roles: ['seller'] },
  
  // Technician routes (protected, role: technician)
  { path: '/technician/onboarding', element: <TechnicianOnboardingPage />, roles: ['customer'] },
  { path: '/technician/dashboard', element: <TechnicianDashboardPage />, roles: ['technician'] },
  { path: '/technician/pending', element: <PendingRequestsPage />, roles: ['technician'] },
  { path: '/technician/jobs', element: <MyJobsPage />, roles: ['technician'] },
  { path: '/technician/jobs/:id', element: <JobDetailPage />, roles: ['technician'] },
];
```

---

## 10. API Service Files

### Auth Service (`/src/services/auth.ts`)

```typescript
import api from './api';

export const authService = {
  register: (data: RegisterData) => api.post('/api/auth/register', data),
  login: (data: LoginData) => api.post('/api/auth/login', data),
};
```

### Product Service (`/src/services/products.ts`)

```typescript
import api from './api';

export const productService = {
  getAll: () => api.get('/api/public/products'),
  getById: (id: string) => api.get(`/api/public/products/${id}`),
};
```

### Cart Service (`/src/services/cart.ts`)

```typescript
import api from './api';

export const cartService = {
  get: () => api.get('/api/cart'),
  addItem: (productId: string, quantity: number) => 
    api.post('/api/cart', { product_id: productId, quantity }),
  removeItem: (itemId: string) => api.delete(`/api/cart/${itemId}`),
};
```

### Seller Service (`/src/services/seller.ts`)

```typescript
import api from './api';

export const sellerService = {
  register: (data: SellerData) => api.post('/api/seller/register', data),
  getProfile: () => api.get('/api/seller/profile'),
  getProducts: () => api.get('/api/seller/products'),
  createProduct: (data: ProductData) => api.post('/api/seller/products', data),
  deleteProduct: (id: string) => api.delete(`/api/seller/products/${id}`),
};
```

### Repair Service (`/src/services/repair.ts`)

```typescript
import api from './api';

export const repairService = {
  // Customer
  createRequest: (data: RepairRequestData) => api.post('/api/repair/request', data),
  getHistory: () => api.get('/api/repair/history'),
  
  // Technician
  registerTechnician: (data: TechnicianData) => api.post('/api/repair/technician/register', data),
  getTechnicianProfile: () => api.get('/api/repair/technician/profile'),
  getPendingRequests: () => api.get('/api/repair/pending'),
  acceptRequest: (id: string) => api.put(`/api/repair/accept/${id}`),
  getMyJobs: () => api.get('/api/repair/my-jobs'),
};
```

---

## 11. Development Checklist

### Phase 1: Foundation
- [ ] Initialize Vite + React + TypeScript project
- [ ] Configure Tailwind CSS
- [ ] Set up project structure (folders)
- [ ] Create API client with Axios
- [ ] Set up React Router
- [ ] Create auth store (Zustand)
- [ ] Create basic UI components (Button, Input, Card)

### Phase 2: Authentication
- [ ] Build Login page
- [ ] Build Register page
- [ ] Implement auth state persistence
- [ ] Create Protected Route component
- [ ] Add auth interceptor to API client

### Phase 3: Product Catalog
- [ ] Build Home page
- [ ] Build Product List page
- [ ] Build Product Detail page
- [ ] Create ProductCard component
- [ ] Implement client-side filtering/sorting

### Phase 4: Shopping Cart
- [ ] Create cart store
- [ ] Build Cart page
- [ ] Build Mini Cart dropdown
- [ ] Add to cart functionality
- [ ] Remove from cart functionality

### Phase 5: Seller Dashboard
- [ ] Build Seller Onboarding page
- [ ] Build Seller Dashboard page
- [ ] Build Products list page
- [ ] Build Add Product page
- [ ] Build Edit Product page

### Phase 6: Repair Services
- [ ] Build Request Repair page
- [ ] Build Repair History page
- [ ] Build Repair Detail page
- [ ] Build Technician Onboarding
- [ ] Build Technician Dashboard
- [ ] Build Pending Requests page
- [ ] Build My Jobs page

### Phase 7: Video Call
- [ ] Set up WebSocket connection
- [ ] Implement WebRTC signaling
- [ ] Build Video Call page
- [ ] Add call controls

### Phase 8: Polish
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add toast notifications
- [ ] Responsive design
- [ ] Testing

---

## Quick Start Commands

```bash
# Create project
npm create vite@latest frontend -- --template react-ts
cd frontend

# Install dependencies
npm install react-router-dom axios @tanstack/react-query zustand
npm install -D tailwindcss postcss autoprefixer
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react

# Initialize Tailwind
npx tailwindcss init -p

# Start development server
npm run dev
```

---

## Notes

1. **Backend updates needed**: The backend currently lacks product update endpoint (`PUT /api/seller/products/{id}`). Build the UI and add when ready.

2. **Checkout flow**: No order/checkout endpoints exist yet. Cart page should be built, but checkout will need backend work.

3. **Image uploads**: Current backend expects image URLs. Consider adding image upload functionality later (e.g., to S3/Cloudinary).

4. **Pagination**: Backend returns all products. Implement client-side pagination initially, then add backend pagination later.

5. **WebRTC**: Video call requires TURN servers for production. Development can use STUN only.
