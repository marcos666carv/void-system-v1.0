# System Map & Architecture

## Overview
This document maps the relationships between Frontend Routes, Backend API Endpoints, and Database/Container services in the Void System v1.0.

## 1. Route Map (Layout)

### Public
- `/`: Landing Page (Marketing)
  - Components: `Hero`, `ServiceGrid`, `VoidClubPromo`
- `/schedule`: Booking Flow
  - Components: `AppointmentWizard`
- `/services`: Service List
- `/club`: Void Club Info
- `/about`: About Us

### Client (Protected)
- `/dashboard`: Client Dashboard
  - Fetches: `GET /api/dashboard`
  - Components: `XPTracker`, `CreditBalance`, `UpcomingBookings`
- `/profile`: User Profile
  - Fetches: `GET /api/clients/me`

### Admin (Protected)
- `/admin`: Admin Dashboard
  - Fetches: `GET /api/dashboard/admin`
- `/admin/calendar`: Schedule Management
- `/admin/customers`: CRM
  - Fetches: `GET /api/clients`
- `/admin/sales/new`: POS (Point of Sale)
  - Fetches: `GET /api/clients`, `GET /api/products`
  - Posts: `POST /api/sales`

## 2. API Endpoints

### Clients
- `GET /api/clients`: List clients (paginated)
- `POST /api/clients`: Create client
- `GET /api/clients/[id]`: Get client details
- `PUT /api/clients/[id]`: Update client

### Products
- `GET /api/products`: List products/services
- `GET /api/products/[id]`: Get product details
- `DELETE /api/products/[id]`: Delete product

### Sales
- `POST /api/sales`: Process a sale (PurchaseForm)

### Calendar
- `GET /api/calendar/blocked-slots`: Get unavailable times
- `DELETE /api/calendar/blocked-slots`: Unblock slot
- `POST /api/appointments`: Create appointment

### Locations
- `GET /api/locations`: List locations
- `GET /api/locations/[id]`: Get location details
- `DELETE /api/locations/[id]`: Delete location

## 3. Component Dependencies
- `PurchaseForm` (`src/components/features/sales/PurchaseForm.tsx`)
  - Depends on `GET /api/clients`
  - Depends on `GET /api/products`
  - Depends on `POST /api/sales`

## 4. Database Links
- `InMemoryClientRepository` -> `clients` collection
- `InMemoryProductRepository` -> `products` collection
- `InMemorySaleRepository` -> `sales` collection
