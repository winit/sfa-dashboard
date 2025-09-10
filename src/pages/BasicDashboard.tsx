import React, { useState, useEffect } from 'react'

// We'll import these carefully to avoid path issues
const { dataService } = require('../services/dataService')

// Define types inline to avoid import issues
interface DashboardKPI {
  todaySales: number
  todayOrders: number
  todayCustomers: number
  growthPercentage: number
  averageOrderValue: number
}

interface Customer {
  customerCode: string
  customerName: string
  totalSales: number
}

interface Product {
  itemCode: string
  itemDescription: string
  totalQuantitySold: number
}

interface Transaction {
  trxCode: string
  clientName?: string
  totalAmount: number
  status: number
}

export const BasicDashboard: React.FC = () => {
  console.log('BasicDashboard component rendered')
  
  // State for data
  const [kpiData, setKpiData] = useState<DashboardKPI | null>(null)
  const [topCustomers, setTopCustomers] = useState<Customer[]>([])
  const [topProducts, setTopProducts] = useState<Product[]>([])
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  // Load data on mount
  useEffect(() => {
    console.log('Loading dashboard data...')
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load all data in parallel
      const [kpis, customers, products, transactions] = await Promise.all([
        dataService.getDashboardKPIs(),
        dataService.getTopCustomers(5),
        dataService.getTopProducts(5),
        dataService.getTransactions()
      ])

      console.log('Data loaded:', { kpis, customers, products, transactions })
      
      setKpiData(kpis)
      setTopCustomers(customers)
      setTopProducts(products)
      setRecentTransactions(transactions.slice(0, 5))
      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>Loading Dashboard...</h2>
      </div>
    )
  }
  
  return (
    <div style={{ padding: '24px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
          SFA Dashboard
        </h1>
        <p style={{ color: '#6b7280' }}>
          Welcome back! Here's your sales performance overview.
        </p>
      </div>

      {/* KPI Cards Container */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Today's Sales Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            Today's Sales
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
            ${kpiData?.todaySales?.toLocaleString() || '0'}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: (kpiData?.growthPercentage || 0) > 0 ? '#10b981' : '#ef4444', 
            marginTop: '4px' 
          }}>
            {(kpiData?.growthPercentage || 0) > 0 ? '↑' : '↓'} {Math.abs(kpiData?.growthPercentage || 0)}% from yesterday
          </div>
        </div>

        {/* Orders Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            Orders
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
            {kpiData?.todayOrders?.toLocaleString() || '0'}
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
            ↑ 8.2% from yesterday
          </div>
        </div>

        {/* Customers Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            Active Customers
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
            {kpiData?.todayCustomers?.toLocaleString() || '0'}
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
            ↑ 5.3% from yesterday
          </div>
        </div>

        {/* Average Order Value Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            Avg Order Value
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
            ${kpiData?.averageOrderValue?.toFixed(2) || '0'}
          </div>
          <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
            ↓ 2.1% from yesterday
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Sales Chart Placeholder */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          minHeight: '300px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Sales Trend (Last 30 Days)
          </h2>
          <div style={{ 
            height: '250px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            borderRadius: '4px'
          }}>
            <span style={{ color: '#9ca3af' }}>Chart will be added here</span>
          </div>
        </div>

        {/* Top Customers */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Top Customers
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topCustomers.map((customer, index) => (
              <div key={customer.customerCode} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                paddingBottom: '8px',
                borderBottom: index < topCustomers.length - 1 ? '1px solid #e5e7eb' : 'none'
              }}>
                <span style={{ fontSize: '14px' }}>{index + 1}. {customer.customerName}</span>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>
                  ${customer.totalSales?.toLocaleString() || '0'}
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
            {topProducts.map((product, index) => (
              <div key={product.itemCode} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                paddingBottom: '8px',
                borderBottom: index < topProducts.length - 1 ? '1px solid #e5e7eb' : 'none'
              }}>
                <span style={{ fontSize: '14px' }}>{product.itemDescription}</span>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  {product.totalQuantitySold?.toLocaleString() || '0'} units
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
            {recentTransactions.map((trx, index) => {
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
                  borderBottom: index < recentTransactions.length - 1 ? '1px solid #e5e7eb' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{trx.clientName || 'Customer'}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>${trx.totalAmount?.toFixed(2) || '0'}</span>
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