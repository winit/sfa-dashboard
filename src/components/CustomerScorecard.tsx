import React from 'react'
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { colors, CHART_COLORS } from '../styles/colors'

interface CustomerScorecardProps {
  customer: any
  onClose: () => void
}

// Generate mock historical data
const generateHistoricalData = (customerCode: string) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months.map(month => ({
    month,
    sales: Math.floor(10000 + Math.random() * 50000),
    orders: Math.floor(10 + Math.random() * 50)
  }))
}

// Generate category breakdown
const generateCategoryBreakdown = () => [
  { name: 'Beverages', value: 35, color: CHART_COLORS[0] },
  { name: 'Snacks', value: 25, color: CHART_COLORS[1] },
  { name: 'Dairy', value: 20, color: CHART_COLORS[2] },
  { name: 'Personal Care', value: 12, color: CHART_COLORS[3] },
  { name: 'Others', value: 8, color: CHART_COLORS[4] }
]

// Generate top products
const generateTopProducts = () => {
  const products = []
  for (let i = 1; i <= 10; i++) {
    products.push({
      rank: i,
      name: `Product ${i}`,
      quantity: Math.floor(100 - i * 8 + Math.random() * 20),
      revenue: Math.floor(5000 - i * 400 + Math.random() * 1000)
    })
  }
  return products
}

export const CustomerScorecard: React.FC<CustomerScorecardProps> = ({ customer, onClose }) => {
  const historicalData = generateHistoricalData(customer.customerCode)
  const categoryData = generateCategoryBreakdown()
  const topProducts = generateTopProducts()
  
  // Calculate additional metrics
  const creditUtilization = (customer.outstandingAmount / customer.creditLimit) * 100
  const daysSinceLastOrder = Math.floor((Date.now() - customer.lastOrderDate.getTime()) / (1000 * 60 * 60 * 24))
  const paymentScore = Math.floor(70 + Math.random() * 30) // Mock payment score
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: colors.background.primary,
        borderRadius: '16px',
        width: '90%',
        maxWidth: '1200px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: `1px solid ${colors.gray[200]}`,
          position: 'sticky',
          top: 0,
          backgroundColor: colors.background.primary,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: colors.gray[900], marginBottom: '8px' }}>
                {customer.customerName}
              </h2>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: colors.gray[600] }}>
                  Code: <strong>{customer.customerCode}</strong>
                </span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: customer.classification === 'Key Account' ? colors.primary[100] :
                                 customer.classification === 'A Class' ? colors.success.light :
                                 customer.classification === 'B Class' ? colors.warning.light :
                                 colors.gray[100],
                  color: customer.classification === 'Key Account' ? colors.primary[700] :
                         customer.classification === 'A Class' ? colors.success.dark :
                         customer.classification === 'B Class' ? colors.warning.dark :
                         colors.gray[700]
                }}>
                  {customer.classification}
                </span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: colors.info.light,
                  color: colors.info.dark
                }}>
                  {customer.channel}
                </span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: customer.isActive ? colors.success.light : colors.error.light,
                  color: customer.isActive ? colors.success.dark : colors.error.dark
                }}>
                  {customer.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: `1px solid ${colors.gray[300]}`,
                backgroundColor: colors.background.primary,
                color: colors.gray[700],
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{
              padding: '20px',
              borderRadius: '12px',
              backgroundColor: colors.background.secondary,
              border: `1px solid ${colors.gray[200]}`
            }}>
              <div style={{ fontSize: '13px', color: colors.gray[500], marginBottom: '4px' }}>Total Revenue</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: colors.gray[900] }}>
                ${customer.totalSales.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: colors.success.main, marginTop: '4px' }}>
                ↑ 12.5% vs last period
              </div>
            </div>

            <div style={{
              padding: '20px',
              borderRadius: '12px',
              backgroundColor: colors.background.secondary,
              border: `1px solid ${colors.gray[200]}`
            }}>
              <div style={{ fontSize: '13px', color: colors.gray[500], marginBottom: '4px' }}>Total Orders</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: colors.gray[900] }}>
                {customer.totalOrders}
              </div>
              <div style={{ fontSize: '12px', color: colors.gray[400], marginTop: '4px' }}>
                Avg {Math.round(customer.totalOrders / 12)}/month
              </div>
            </div>

            <div style={{
              padding: '20px',
              borderRadius: '12px',
              backgroundColor: colors.background.secondary,
              border: `1px solid ${colors.gray[200]}`
            }}>
              <div style={{ fontSize: '13px', color: colors.gray[500], marginBottom: '4px' }}>Avg Order Value</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: colors.gray[900] }}>
                ${customer.avgOrderValue}
              </div>
              <div style={{ fontSize: '12px', color: colors.warning.main, marginTop: '4px' }}>
                ↓ 3.2% vs last period
              </div>
            </div>

            <div style={{
              padding: '20px',
              borderRadius: '12px',
              backgroundColor: colors.background.secondary,
              border: `1px solid ${colors.gray[200]}`
            }}>
              <div style={{ fontSize: '13px', color: colors.gray[500], marginBottom: '4px' }}>Visit Frequency</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: colors.gray[900] }}>
                {customer.visitFrequency}/week
              </div>
              <div style={{ fontSize: '12px', color: colors.gray[400], marginTop: '4px' }}>
                Route: {customer.routeCode}
              </div>
            </div>
          </div>

          {/* Financial Health Section */}
          <div style={{
            marginBottom: '32px',
            padding: '24px',
            borderRadius: '12px',
            backgroundColor: colors.background.secondary,
            border: `1px solid ${colors.gray[200]}`
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
              Financial Health
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
              <div>
                <div style={{ fontSize: '13px', color: colors.gray[500], marginBottom: '8px' }}>Credit Utilization</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `conic-gradient(${creditUtilization > 80 ? colors.error.main : colors.primary[500]} ${creditUtilization * 3.6}deg, ${colors.gray[200]} 0deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: colors.background.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '700'
                    }}>
                      {Math.round(creditUtilization)}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: colors.gray[700] }}>
                      ${customer.outstandingAmount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', color: colors.gray[500] }}>
                      of ${customer.creditLimit.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '13px', color: colors.gray[500], marginBottom: '8px' }}>Payment Terms</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: colors.gray[900] }}>
                  {customer.paymentTerms}
                </div>
                <div style={{ fontSize: '12px', color: colors.gray[400], marginTop: '4px' }}>
                  Payment Score: {paymentScore}%
                </div>
              </div>

              <div>
                <div style={{ fontSize: '13px', color: colors.gray[500], marginBottom: '8px' }}>Last Order</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: colors.gray[900] }}>
                  {daysSinceLastOrder} days ago
                </div>
                <div style={{ fontSize: '12px', color: colors.gray[400], marginTop: '4px' }}>
                  {customer.lastOrderDate.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
            {/* Sales Trend */}
            <div style={{
              padding: '24px',
              borderRadius: '12px',
              backgroundColor: colors.background.secondary,
              border: `1px solid ${colors.gray[200]}`
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
                12-Month Sales Trend
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[200]} />
                  <XAxis dataKey="month" stroke={colors.gray[400]} tick={{ fill: colors.gray[500], fontSize: 12 }} />
                  <YAxis stroke={colors.gray[400]} tick={{ fill: colors.gray[500], fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.background.primary,
                      border: `1px solid ${colors.gray[200]}`,
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke={colors.primary[500]}
                    strokeWidth={2}
                    dot={{ fill: colors.primary[500], r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Category Mix */}
            <div style={{
              padding: '24px',
              borderRadius: '12px',
              backgroundColor: colors.background.secondary,
              border: `1px solid ${colors.gray[200]}`
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
                Category Mix
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ marginTop: '16px' }}>
                {categoryData.map(cat => (
                  <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '2px',
                      backgroundColor: cat.color
                    }} />
                    <span style={{ fontSize: '12px', color: colors.gray[600] }}>{cat.name}</span>
                    <span style={{ fontSize: '12px', color: colors.gray[800], marginLeft: 'auto', fontWeight: '600' }}>
                      {cat.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products Table */}
          <div style={{
            padding: '24px',
            borderRadius: '12px',
            backgroundColor: colors.background.secondary,
            border: `1px solid ${colors.gray[200]}`
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
              Top 10 Products
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.gray[200]}` }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: colors.gray[500], fontWeight: '600' }}>Rank</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: colors.gray[500], fontWeight: '600' }}>Product</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: colors.gray[500], fontWeight: '600' }}>Quantity</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: colors.gray[500], fontWeight: '600' }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map(product => (
                  <tr key={product.rank} style={{ borderBottom: `1px solid ${colors.gray[100]}` }}>
                    <td style={{ padding: '12px', fontSize: '14px', color: colors.gray[900] }}>#{product.rank}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: colors.gray[700] }}>{product.name}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: colors.gray[700], textAlign: 'right' }}>{product.quantity}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: colors.gray[900], fontWeight: '600', textAlign: 'right' }}>
                      ${product.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}