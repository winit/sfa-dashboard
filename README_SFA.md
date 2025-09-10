# SFA Dashboard - Interactive Frontend

## 🚀 Quick Start

The development server is already running! Open your browser and visit:
**http://localhost:5173**

## 📊 What's Built

### ✅ Completed Features

1. **Interactive Dashboard with Mock Data**
   - Real-time KPI cards showing today's sales, customers, orders
   - Growth indicators with trend arrows
   - MTD and YTD sales summaries
   - Auto-refresh every 30 seconds

2. **Advanced Chart Components**
   - Sales trend chart with multiple visualizations (Line, Bar, Area, Composed)
   - Interactive tooltips with formatted data
   - Time range selector (7D, 30D, 90D)
   - Multi-axis support for different metrics

3. **Top Performers Widgets**
   - Top 5 customers by revenue
   - Top 5 products by sales
   - Recent transactions with status indicators

4. **Responsive Design**
   - Mobile-first approach using Tailwind CSS
   - Responsive grid layouts
   - Touch-friendly interface elements

5. **Data Service Layer**
   - Mock data service with realistic SFA data
   - Interface-based design for easy backend integration
   - Simulated network delays for realistic UX
   - Type-safe TypeScript implementation

## 🏗️ Architecture

```
src/
├── components/          # Reusable UI components
│   ├── dashboard/      # Dashboard-specific components
│   │   ├── KPICards.tsx
│   │   └── SalesChart.tsx
│   └── ui/            # Base UI components (shadcn/ui)
│       ├── button.tsx
│       └── card.tsx
├── services/          # Data layer
│   ├── dataService.ts # Service interface & implementations
│   └── mockData.ts    # Mock data generators
├── types/             # TypeScript type definitions
│   └── index.ts       # All data models
├── lib/               # Utilities
│   └── utils.ts       # Helper functions
└── pages/             # Page components
    └── Dashboard.tsx  # Main dashboard page
```

## 🔄 Backend Integration

The dashboard is **ready for backend integration** with minimal changes:

### 1. Current Mock Implementation
```typescript
// src/services/dataService.ts
export const dataService: IDataService = new MockDataService()
```

### 2. Switch to Real API
```typescript
// Just change one line:
export const dataService: IDataService = new APIDataService('https://your-api.com')
```

### 3. API Endpoints Expected
The `APIDataService` expects these endpoints:
- `GET /api/dashboard/kpis` - Dashboard KPIs
- `GET /api/dashboard/sales-trend?days=30` - Sales trend data
- `GET /api/transactions` - Transaction list
- `GET /api/customers` - Customer list
- `GET /api/customers/top?limit=10` - Top customers
- `GET /api/products` - Product list
- `GET /api/products/top?limit=10` - Top products
- `GET /api/journeys` - Journey/route data
- `GET /api/visits` - Visit tracking data
- `GET /api/targets` - Sales targets

## 📦 Data Models

All data models match your SQL Server database structure:

- **Transaction**: Maps to `tblTrxHeader`
- **Customer**: Maps to `tblCustomer`
- **Product**: Maps to `tblItem`
- **Journey**: Maps to `tblJourney`
- **Visit**: Maps to `tblCustomerVisit`
- **Target**: Maps to `tblTargetHeader`

## 🎨 Customization

### Change Colors
Edit `src/index.css` to modify the color scheme:
```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Blue */
  --chart-1: 12 76% 61%;          /* Chart color 1 */
  /* ... */
}
```

### Add New KPI Cards
In `src/components/dashboard/KPICards.tsx`:
```typescript
const kpiCards = [
  // Add your new KPI here
  {
    title: "New Metric",
    value: formatNumber(data.newMetric),
    icon: <IconName className="h-4 w-4" />,
    subtitle: "Description"
  }
]
```

### Change Chart Type
In `src/pages/Dashboard.tsx`:
```tsx
<SalesChart 
  data={salesTrend} 
  chartType="line"  // Options: 'line' | 'bar' | 'area' | 'composed'
/>
```

## 🚀 Next Steps

### Immediate Enhancements Available:
1. **Add Filters & Search** (partially built)
   - Date range picker
   - Route/User/Customer filters
   - Global search with Command Palette (Cmd+K)

2. **Additional Pages** (structure ready)
   - Customer detail page
   - Product catalog
   - Journey tracking with map
   - Target achievement dashboard

3. **Export Features**
   - Export to Excel
   - Export to PDF
   - Print view

4. **Real-time Features**
   - WebSocket integration for live updates
   - Push notifications for alerts

## 📱 Mobile App

The dashboard is fully responsive and works on mobile browsers. For a native app experience, you can:
1. Wrap in a PWA (Progressive Web App)
2. Use React Native with shared business logic
3. Deploy as a mobile web app

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Mock Data Details

The mock data generator creates:
- 500 transactions
- 200 customers
- 150 products
- 30 journeys
- 300 visits
- Sales targets for 5 users
- 30 days of sales trend data

All data is randomized but realistic, following typical FMCG distribution patterns.

## 🔗 Technology Stack

- **React 18** with TypeScript
- **Vite** for fast builds
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **date-fns** for date manipulation
- **shadcn/ui** component library

## 📝 License

This dashboard is built specifically for your SFA solution and is ready for production use with your backend API integration.