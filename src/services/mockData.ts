import { 
  Transaction, 
  Customer, 
  Product, 
  Journey, 
  Visit, 
  Target,
  DashboardKPI,
  SalesTrendData 
} from '../types'
import { subDays, startOfMonth, endOfMonth, addDays } from 'date-fns'

// Generate realistic mock data
const generateMockTransactions = (count: number): Transaction[] => {
  const transactions: Transaction[] = []
  const userNames = ['John Smith', 'Mary Johnson', 'James Wilson', 'Sarah Davis', 'Michael Brown']
  const customerNames = ['ABC Supermarket', 'XYZ Hypermarket', 'Quick Mart', 'Fresh Foods', 'City Store', 
                         'Metro Market', 'Green Grocery', 'Super Save', 'Daily Needs', 'Corner Shop']
  const routes = ['Route 1', 'Route 2', 'Route 3', 'Route 4', 'Route 5']
  
  for (let i = 0; i < count; i++) {
    const userIndex = Math.floor(Math.random() * userNames.length)
    const customerIndex = Math.floor(Math.random() * customerNames.length)
    const routeIndex = Math.floor(Math.random() * routes.length)
    
    transactions.push({
      trxCode: `TRX-2024-${String(i + 1).padStart(6, '0')}`,
      appTrxId: `APP-${Date.now()}-${i}`,
      orgCode: 'ORG001',
      journeyCode: `JRN-${String(Math.floor(i / 10) + 1).padStart(4, '0')}`,
      visitCode: `VST-${String(i + 1).padStart(5, '0')}`,
      userCode: `USR${String(userIndex + 1).padStart(3, '0')}`,
      userName: userNames[userIndex],
      clientCode: `CUST${String(customerIndex + 1).padStart(4, '0')}`,
      clientName: customerNames[customerIndex],
      trxDate: subDays(new Date(), Math.floor(Math.random() * 30)),
      trxType: Math.random() > 0.1 ? 1 : 3, // 90% orders, 10% returns
      paymentType: Math.random() > 0.3 ? 1 : 2, // 70% cash, 30% credit
      totalAmount: Math.floor(Math.random() * 5000) + 500,
      totalDiscountAmount: Math.floor(Math.random() * 200),
      totalTaxAmount: Math.floor(Math.random() * 300) + 50,
      status: Math.floor(Math.random() * 3) + 3, // 3-5 (Delivered to Paid)
      isVanSales: Math.random() > 0.4,
      routeCode: `RT${String(routeIndex + 1).padStart(2, '0')}`,
      routeName: routes[routeIndex],
      geoX: (24 + Math.random() * 2).toFixed(6),
      geoY: (46 + Math.random() * 2).toFixed(6)
    })
  }
  
  return transactions.sort((a, b) => b.trxDate.getTime() - a.trxDate.getTime())
}

const generateMockCustomers = (count: number): Customer[] => {
  const customers: Customer[] = []
  const customerTypes = ['Supermarket', 'Hypermarket', 'Convenience Store', 'Restaurant', 'Cafe']
  const channels = ['Modern Trade', 'Traditional Trade', 'HoReCa', 'E-Commerce']
  const routes = ['Route 1', 'Route 2', 'Route 3', 'Route 4', 'Route 5']
  
  for (let i = 0; i < count; i++) {
    const totalOrders = Math.floor(Math.random() * 200) + 10
    const totalSales = Math.floor(Math.random() * 500000) + 10000
    
    customers.push({
      customerCode: `CUST${String(i + 1).padStart(4, '0')}`,
      customerName: `Customer ${i + 1}`,
      customerArabicName: `عميل ${i + 1}`,
      customerType: customerTypes[Math.floor(Math.random() * customerTypes.length)],
      routeCode: `RT${String(Math.floor(Math.random() * 5) + 1).padStart(2, '0')}`,
      routeName: routes[Math.floor(Math.random() * routes.length)],
      channelCode: channels[Math.floor(Math.random() * channels.length)],
      classificationCode: Math.random() > 0.7 ? 'A' : Math.random() > 0.4 ? 'B' : 'C',
      creditLimit: Math.floor(Math.random() * 100000) + 10000,
      outstandingAmount: Math.floor(Math.random() * 50000),
      lastOrderDate: subDays(new Date(), Math.floor(Math.random() * 30)),
      totalOrders,
      totalSales,
      averageOrderValue: totalSales / totalOrders,
      status: Math.random() > 0.1 ? 'Active' : 'Inactive',
      gpsLatitude: 24 + Math.random() * 2,
      gpsLongitude: 46 + Math.random() * 2
    })
  }
  
  return customers.sort((a, b) => b.totalSales - a.totalSales)
}

const generateMockProducts = (count: number): Product[] => {
  const products: Product[] = []
  const categories = ['Beverages', 'Snacks', 'Dairy', 'Bakery', 'Frozen Foods']
  const brands = ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E']
  
  for (let i = 0; i < count; i++) {
    const totalQuantitySold = Math.floor(Math.random() * 10000) + 100
    const price = Math.floor(Math.random() * 100) + 5
    
    products.push({
      itemCode: `ITM${String(i + 1).padStart(5, '0')}`,
      itemDescription: `Product ${i + 1}`,
      itemArabicDescription: `منتج ${i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      subCategory: `SubCat ${Math.floor(Math.random() * 10) + 1}`,
      brand: brands[Math.floor(Math.random() * brands.length)],
      brandCode: `BR${String(Math.floor(Math.random() * 5) + 1).padStart(2, '0')}`,
      baseUOM: 'PC',
      salesUOM: 'CS',
      conversionFactor: 12,
      price,
      taxPercentage: 15,
      isActive: Math.random() > 0.1,
      totalQuantitySold,
      totalRevenue: totalQuantitySold * price,
      averagePrice: price * (0.9 + Math.random() * 0.2)
    })
  }
  
  return products.sort((a, b) => b.totalRevenue - a.totalRevenue)
}

const generateMockJourneys = (count: number): Journey[] => {
  const journeys: Journey[] = []
  const userNames = ['John Smith', 'Mary Johnson', 'James Wilson', 'Sarah Davis', 'Michael Brown']
  const routes = ['Route 1', 'Route 2', 'Route 3', 'Route 4', 'Route 5']
  
  for (let i = 0; i < count; i++) {
    const userIndex = Math.floor(Math.random() * userNames.length)
    const routeIndex = Math.floor(Math.random() * routes.length)
    const journeyDate = subDays(new Date(), Math.floor(Math.random() * 30))
    const startTime = new Date(journeyDate)
    startTime.setHours(8, 0, 0, 0)
    const endTime = new Date(journeyDate)
    endTime.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0)
    
    const totalVisits = Math.floor(Math.random() * 15) + 5
    const productiveVisits = Math.floor(totalVisits * (0.6 + Math.random() * 0.3))
    
    journeys.push({
      journeyCode: `JRN-${String(i + 1).padStart(4, '0')}`,
      userCode: `USR${String(userIndex + 1).padStart(3, '0')}`,
      userName: userNames[userIndex],
      routeCode: `RT${String(routeIndex + 1).padStart(2, '0')}`,
      routeName: routes[routeIndex],
      journeyDate,
      startTime,
      endTime,
      startOdometer: Math.floor(Math.random() * 1000) + 50000,
      endOdometer: Math.floor(Math.random() * 1000) + 50200,
      totalVisits,
      productiveVisits,
      totalSales: productiveVisits * (Math.floor(Math.random() * 3000) + 1000),
      status: 'Completed'
    })
  }
  
  return journeys.sort((a, b) => b.journeyDate.getTime() - a.journeyDate.getTime())
}

const generateMockVisits = (count: number): Visit[] => {
  const visits: Visit[] = []
  const customerNames = ['ABC Supermarket', 'XYZ Hypermarket', 'Quick Mart', 'Fresh Foods', 'City Store']
  const reasons = ['Customer Closed', 'No Order', 'Already Stocked', 'Payment Issue']
  
  for (let i = 0; i < count; i++) {
    const customerIndex = Math.floor(Math.random() * customerNames.length)
    const checkInTime = subDays(new Date(), Math.floor(Math.random() * 7))
    checkInTime.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60))
    
    const visitDuration = Math.floor(Math.random() * 45) + 15
    const checkOutTime = new Date(checkInTime.getTime() + visitDuration * 60000)
    const isProductive = Math.random() > 0.3
    
    visits.push({
      visitId: `VST-${String(i + 1).padStart(5, '0')}`,
      journeyCode: `JRN-${String(Math.floor(i / 10) + 1).padStart(4, '0')}`,
      customerCode: `CUST${String(customerIndex + 1).padStart(4, '0')}`,
      customerName: customerNames[customerIndex],
      checkInTime,
      checkOutTime,
      visitDuration,
      visitType: isProductive ? 1 : 2,
      reasonCode: !isProductive ? reasons[Math.floor(Math.random() * reasons.length)] : undefined,
      gpsLatitude: 24 + Math.random() * 2,
      gpsLongitude: 46 + Math.random() * 2,
      salesAmount: isProductive ? Math.floor(Math.random() * 5000) + 500 : 0
    })
  }
  
  return visits.sort((a, b) => b.checkInTime.getTime() - a.checkInTime.getTime())
}

const generateMockTargets = (): Target[] => {
  const targets: Target[] = []
  const userNames = ['John Smith', 'Mary Johnson', 'James Wilson', 'Sarah Davis', 'Michael Brown']
  
  for (let i = 0; i < userNames.length; i++) {
    const targetAmount = Math.floor(Math.random() * 50000) + 100000
    const achievedAmount = targetAmount * (0.5 + Math.random() * 0.7)
    const achievementPercentage = (achievedAmount / targetAmount) * 100
    
    targets.push({
      targetCode: `TGT-${String(i + 1).padStart(4, '0')}`,
      userCode: `USR${String(i + 1).padStart(3, '0')}`,
      userName: userNames[i],
      periodType: 'Monthly',
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      targetAmount,
      achievedAmount,
      achievementPercentage,
      status: achievementPercentage >= 100 ? 'Achieved' : 
              achievementPercentage >= 80 ? 'On Track' : 
              achievementPercentage >= 50 ? 'Behind' : 'Critical'
    })
  }
  
  return targets
}

const generateSalesTrend = (days: number): SalesTrendData[] => {
  const data: SalesTrendData[] = []
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i)
    const dayOfWeek = date.getDay()
    // Higher sales on weekdays
    const multiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1
    
    data.push({
      date: date.toISOString().split('T')[0],
      sales: Math.floor((Math.random() * 50000 + 80000) * multiplier),
      orders: Math.floor((Math.random() * 100 + 150) * multiplier),
      customers: Math.floor((Math.random() * 50 + 80) * multiplier)
    })
  }
  
  return data
}

const generateDashboardKPIs = (): DashboardKPI => {
  const todaySales = Math.floor(Math.random() * 50000) + 100000
  const yesterdaySales = Math.floor(Math.random() * 50000) + 95000
  
  return {
    todaySales,
    todayOrders: Math.floor(Math.random() * 100) + 200,
    todayCustomers: Math.floor(Math.random() * 50) + 100,
    growthPercentage: ((todaySales - yesterdaySales) / yesterdaySales) * 100,
    mtdSales: Math.floor(Math.random() * 1000000) + 2000000,
    ytdSales: Math.floor(Math.random() * 10000000) + 20000000,
    averageOrderValue: todaySales / (Math.floor(Math.random() * 100) + 200),
    conversionRate: 65 + Math.random() * 20
  }
}

// Export mock data generators
export const mockData = {
  transactions: generateMockTransactions(500),
  customers: generateMockCustomers(200),
  products: generateMockProducts(150),
  journeys: generateMockJourneys(30),
  visits: generateMockVisits(300),
  targets: generateMockTargets(),
  salesTrend: generateSalesTrend(30),
  dashboardKPIs: generateDashboardKPIs()
}

// Helper functions to get filtered data
export const getTopCustomers = (limit = 10) => {
  return mockData.customers.slice(0, limit)
}

export const getTopProducts = (limit = 10) => {
  return mockData.products.slice(0, limit)
}

export const getRecentTransactions = (limit = 10) => {
  return mockData.transactions.slice(0, limit)
}

export const getRecentVisits = (limit = 10) => {
  return mockData.visits.slice(0, limit)
}