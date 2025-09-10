import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { colors } from '../styles/colors'

// Mock data directly in the component to avoid import issues
const mockKPIData = {
  todaySales: 125420,
  todayOrders: 1245,
  todayCustomers: 892,
  growthPercentage: 12.5,
  averageOrderValue: 100.74
}

const mockCustomers = [
  { customerCode: 'C001', customerName: 'Al Maya Supermarket', totalSales: 45000 },
  { customerCode: 'C002', customerName: 'Carrefour', totalSales: 38000 },
  { customerCode: 'C003', customerName: 'Lulu Hypermarket', totalSales: 32000 },
  { customerCode: 'C004', customerName: 'Spinneys', totalSales: 28000 },
  { customerCode: 'C005', customerName: 'Union Coop', totalSales: 24000 }
]

const mockProducts = [
  { itemCode: 'P001', itemDescription: 'Coca Cola 330ml', totalQuantitySold: 1250 },
  { itemCode: 'P002', itemDescription: 'Pepsi 500ml', totalQuantitySold: 1100 },
  { itemCode: 'P003', itemDescription: 'Red Bull 250ml', totalQuantitySold: 980 },
  { itemCode: 'P004', itemDescription: 'Mountain Dew 1L', totalQuantitySold: 850 },
  { itemCode: 'P005', itemDescription: 'Sprite 2L', totalQuantitySold: 720 }
]

const mockTransactions = [
  { trxCode: 'TRX-2024-001', clientName: 'Al Maya', totalAmount: 2450.50, status: 5 },
  { trxCode: 'TRX-2024-002', clientName: 'Carrefour', totalAmount: 3200.00, status: 4 },
  { trxCode: 'TRX-2024-003', clientName: 'Lulu', totalAmount: 1850.75, status: 5 },
  { trxCode: 'TRX-2024-004', clientName: 'Spinneys', totalAmount: 2100.25, status: 3 },
  { trxCode: 'TRX-2024-005', clientName: 'Union Coop', totalAmount: 4500.00, status: 5 }
]

// Generate sales trend data for last 30 days
const generateSalesTrend = () => {
  const data = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: Math.floor(100000 + Math.random() * 50000 + (29 - i) * 1000)
    })
  }
  return data
}

const salesTrendData = generateSalesTrend()

export const WorkingDashboard: React.FC = () => {
  console.log('WorkingDashboard component rendered')
  
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('today')

  useEffect(() => {
    console.log('Simulating data load...')
    // Simulate loading delay
    setTimeout(() => {
      console.log('Data loaded!')
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>Loading Dashboard...</h2>
      </div>
    )
  }
  
  return (
    <div style={{ padding: '24px', backgroundColor: colors.background.secondary, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: colors.gray[900] }}>
              SFA Dashboard
            </h1>
            <p style={{ color: colors.gray[500], fontSize: '15px' }}>
              Welcome back! Here's your sales performance overview.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: colors.gray[600], marginRight: '8px' }}>Date Range:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: `1px solid ${colors.gray[300]}`,
                backgroundColor: colors.background.primary,
                fontSize: '14px',
                color: colors.gray[700],
                cursor: 'pointer',
                minWidth: '150px'
              }}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisQuarter">This Quarter</option>
              <option value="thisYear">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '24px',
          borderRadius: '12px',
          border: `1px solid ${colors.gray[200]}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          transition: 'all 0.2s',
        }}>
          <div style={{ fontSize: '13px', color: colors.gray[500], marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {dateRange === 'today' ? "Today's Sales" : 
             dateRange === 'yesterday' ? "Yesterday's Sales" :
             dateRange === 'last7days' ? "Last 7 Days Sales" :
             dateRange === 'last30days' ? "Last 30 Days Sales" :
             dateRange === 'thisMonth' ? "This Month Sales" :
             dateRange === 'lastMonth' ? "Last Month Sales" :
             dateRange === 'thisQuarter' ? "This Quarter Sales" :
             "This Year Sales"}
          </div>
          <div style={{ fontSize: '30px', fontWeight: '700', color: colors.gray[900] }}>
            ${mockKPIData.todaySales.toLocaleString()}
          </div>
          <div style={{ fontSize: '13px', color: colors.success.main, marginTop: '8px', fontWeight: '500' }}>
            ↑ {mockKPIData.growthPercentage}% from yesterday
          </div>
        </div>

        <div style={{
          backgroundColor: colors.background.primary,
          padding: '24px',
          borderRadius: '12px',
          border: `1px solid ${colors.gray[200]}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          transition: 'all 0.2s',
        }}>
          <div style={{ fontSize: '13px', color: colors.gray[500], marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Orders
          </div>
          <div style={{ fontSize: '30px', fontWeight: '700', color: colors.gray[900] }}>
            {mockKPIData.todayOrders.toLocaleString()}
          </div>
          <div style={{ fontSize: '13px', color: colors.success.main, marginTop: '8px', fontWeight: '500' }}>
            ↑ 8.2% from yesterday
          </div>
        </div>

        <div style={{
          backgroundColor: colors.background.primary,
          padding: '24px',
          borderRadius: '12px',
          border: `1px solid ${colors.gray[200]}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          transition: 'all 0.2s',
        }}>
          <div style={{ fontSize: '13px', color: colors.gray[500], marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Customers
          </div>
          <div style={{ fontSize: '30px', fontWeight: '700', color: colors.gray[900] }}>
            {mockKPIData.todayCustomers.toLocaleString()}
          </div>
          <div style={{ fontSize: '13px', color: colors.success.main, marginTop: '8px', fontWeight: '500' }}>
            ↑ 5.3% from yesterday
          </div>
        </div>

        <div style={{
          backgroundColor: colors.background.primary,
          padding: '24px',
          borderRadius: '12px',
          border: `1px solid ${colors.gray[200]}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          transition: 'all 0.2s',
        }}>
          <div style={{ fontSize: '13px', color: colors.gray[500], marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Avg Order Value
          </div>
          <div style={{ fontSize: '30px', fontWeight: '700', color: colors.gray[900] }}>
            ${mockKPIData.averageOrderValue.toFixed(2)}
          </div>
          <div style={{ fontSize: '13px', color: colors.error.main, marginTop: '8px', fontWeight: '500' }}>
            ↓ 2.1% from yesterday
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Chart Placeholder */}
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '24px',
          borderRadius: '12px',
          border: `1px solid ${colors.gray[200]}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          minHeight: '300px'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
            Sales Trend (Last 30 Days)
          </h2>
          <div style={{ height: '250px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[200]} />
                <XAxis 
                  dataKey="date" 
                  style={{ fontSize: '12px' }}
                  stroke={colors.gray[400]}
                  tick={{ fill: colors.gray[500] }}
                />
                <YAxis 
                  style={{ fontSize: '12px' }}
                  stroke={colors.gray[400]}
                  tick={{ fill: colors.gray[500] }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Sales']}
                  contentStyle={{ 
                    backgroundColor: colors.background.primary, 
                    border: `1px solid ${colors.gray[200]}`,
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke={colors.primary[500]} 
                  strokeWidth={2.5}
                  dot={{ fill: colors.primary[500], r: 3 }}
                  activeDot={{ r: 5, fill: colors.primary[600] }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Customers */}
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '24px',
          borderRadius: '12px',
          border: `1px solid ${colors.gray[200]}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
            Top Customers
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mockCustomers.map((customer, index) => (
              <div key={customer.customerCode} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                paddingBottom: '12px',
                borderBottom: index < mockCustomers.length - 1 ? `1px solid ${colors.gray[100]}` : 'none'
              }}>
                <span style={{ fontSize: '14px', color: colors.gray[700] }}>
                  <span style={{ 
                    display: 'inline-block', 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    backgroundColor: colors.primary[100], 
                    color: colors.primary[600],
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginRight: '8px'
                  }}>{index + 1}</span>
                  {customer.customerName}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: colors.gray[900] }}>
                  ${customer.totalSales.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        {/* Top Products */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Top Products
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mockProducts.map((product, index) => (
              <div key={product.itemCode} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                paddingBottom: '8px',
                borderBottom: index < mockProducts.length - 1 ? '1px solid #e5e7eb' : 'none'
              }}>
                <span style={{ fontSize: '14px' }}>{product.itemDescription}</span>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  {product.totalQuantitySold.toLocaleString()} units
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Recent Transactions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mockTransactions.map((trx, index) => {
              const statusText = trx.status === 5 ? 'Paid' :
                               trx.status === 4 ? 'Invoiced' :
                               trx.status === 3 ? 'Delivered' : 'Processing'
              const statusColor = trx.status === 5 ? '#d1fae5' :
                                trx.status === 4 ? '#bfdbfe' :
                                trx.status === 3 ? '#fed7aa' : '#ddd6fe'
              const statusTextColor = trx.status === 5 ? '#065f46' :
                                     trx.status === 4 ? '#1e40af' :
                                     trx.status === 3 ? '#92400e' : '#4c1d95'
              
              return (
                <div key={trx.trxCode} style={{ 
                  paddingBottom: '8px',
                  borderBottom: index < mockTransactions.length - 1 ? '1px solid #e5e7eb' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{trx.clientName}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>${trx.totalAmount.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{trx.trxCode}</span>
                    <span style={{ 
                      fontSize: '12px', 
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: statusColor,
                      color: statusTextColor
                    }}>
                      {statusText}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}