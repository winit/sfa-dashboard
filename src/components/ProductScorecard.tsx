import React from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { colors, CHART_COLORS } from '../styles/colors'

interface ProductScorecardProps {
  product: any
  onClose: () => void
}

// Generate mock historical data
const generateSalesTrend = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months.map(month => ({
    month,
    units: Math.floor(200 + Math.random() * 800),
    revenue: Math.floor(2000 + Math.random() * 8000)
  }))
}

// Generate channel breakdown
const generateChannelBreakdown = () => [
  { name: 'Modern Trade', value: 45, units: 2340, color: CHART_COLORS[0] },
  { name: 'Traditional', value: 30, units: 1560, color: CHART_COLORS[1] },
  { name: 'HORECA', value: 15, units: 780, color: CHART_COLORS[2] },
  { name: 'E-Commerce', value: 10, units: 520, color: CHART_COLORS[3] }
]

// Generate top customers buying this product
const generateTopCustomers = () => {
  const customers = []
  for (let i = 1; i <= 10; i++) {
    customers.push({
      rank: i,
      name: `Customer ${i}`,
      quantity: Math.floor(50 - i * 4 + Math.random() * 10),
      revenue: Math.floor(2000 - i * 150 + Math.random() * 500)
    })
  }
  return customers
}

// Generate stock movement data
const generateStockMovement = () => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push({
      day: date.toLocaleDateString('en', { weekday: 'short' }),
      inbound: Math.floor(Math.random() * 200),
      outbound: Math.floor(50 + Math.random() * 150)
    })
  }
  return days
}

export const ProductScorecard: React.FC<ProductScorecardProps> = ({ product, onClose }) => {
  const salesTrend = generateSalesTrend()
  const channelData = generateChannelBreakdown()
  const topCustomers = generateTopCustomers()
  const stockMovement = generateStockMovement()
  
  // Calculate additional metrics
  const stockTurnover = Math.round((product.quantitySold / product.stockOnHand) * 12) // Annual turnover
  const daysOfSupply = Math.round(product.stockOnHand / (product.quantitySold / 30))
  const marginPercentage = ((product.price - product.cost) / product.price * 100).toFixed(1)
  const stockStatus = product.stockOnHand < product.reorderLevel ? 'critical' : 
                     product.stockOnHand < product.reorderLevel * 1.5 ? 'low' : 'healthy'
  
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
                {product.itemDescription}
              </h2>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: colors.gray[600] }}>
                  SKU: <strong>{product.itemCode}</strong>
                </span>
                <span style={{ fontSize: '14px', color: colors.gray[600] }}>
                  Barcode: <strong>{product.barcode}</strong>
                </span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: product.isFastMoving ? colors.success.light :
                                 product.isSlowMoving ? colors.warning.light :
                                 colors.info.light,
                  color: product.isFastMoving ? colors.success.dark :
                         product.isSlowMoving ? colors.warning.dark :
                         colors.info.dark
                }}>
                  {product.isFastMoving ? 'Fast Moving' : product.isSlowMoving ? 'Slow Moving' : 'Regular'}
                </span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: product.isActive ? colors.success.light : colors.error.light,
                  color: product.isActive ? colors.success.dark : colors.error.dark
                }}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '12px', fontSize: '13px', color: colors.gray[500] }}>
                <span>Brand: <strong style={{ color: colors.gray[700] }}>{product.brandCode}</strong></span>
                <span>Category: <strong style={{ color: colors.gray[700] }}>{product.categoryCode}</strong></span>
                <span>Supplier: <strong style={{ color: colors.gray[700] }}>{product.supplierCode}</strong></span>
                <span>UOM: <strong style={{ color: colors.gray[700] }}>{product.baseUOM}</strong></span>
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

        {/* Product Hierarchy */}
        <div style={{
          padding: '16px 24px',
          backgroundColor: colors.background.secondary,
          borderBottom: `1px solid ${colors.gray[200]}`
        }}>
          <div style={{ fontSize: '12px', color: colors.gray[500], marginBottom: '4px' }}>Product Hierarchy</div>
          <div style={{ fontSize: '13px', color: colors.gray[700], display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              product.itemGroupLevel1,
              product.itemGroupLevel2,
              product.itemGroupLevel3,
              product.itemGroupLevel4,
              product.itemGroupLevel5,
              product.itemGroupLevel6,
              product.itemGroupLevel7,
              product.itemGroupLevel8
            ].map((level, index) => (
              <React.Fragment key={index}>
                <span style={{
                  padding: '2px 8px',
                  backgroundColor: colors.gray[100],
                  borderRadius: '4px',
                  fontWeight: index === 0 ? '600' : '400'
                }}>
                  {level}
                </span>
                {index < 7 && <span style={{ color: colors.gray[400] }}>→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: colors.background.secondary,
              border: `1px solid ${colors.gray[200]}`
            }}>
              <div style={{ fontSize: '12px', color: colors.gray[500], marginBottom: '4px' }}>Total Sales</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: colors.gray[900] }}>
                ${product.totalSales.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: colors.success.main, marginTop: '4px' }}>
                ↑ 15.3% vs last period
              </div>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: colors.background.secondary,
              border: `1px solid ${colors.gray[200]}`
            }}>
              <div style={{ fontSize: '12px', color: colors.gray[500], marginBottom: '4px' }}>Units Sold</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: colors.gray[900] }}>
                {product.quantitySold.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: colors.gray[400], marginTop: '4px' }}>
                {product.totalOrders} orders
              </div>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: colors.background.secondary,
              border: `1px solid ${colors.gray[200]}`
            }}>
              <div style={{ fontSize: '12px', color: colors.gray[500], marginBottom: '4px' }}>Profit Margin</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: colors.gray[900] }}>
                {marginPercentage}%
              </div>
              <div style={{ fontSize: '11px', color: colors.gray[400], marginTop: '4px' }}>
                ${(product.price - product.cost).toFixed(2)}/unit
              </div>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: colors.background.secondary,
              border: `1px solid ${colors.gray[200]}`
            }}>
              <div style={{ fontSize: '12px', color: colors.gray[500], marginBottom: '4px' }}>Stock on Hand</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: colors.gray[900] }}>
                {product.stockOnHand}
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: stockStatus === 'critical' ? colors.error.main : 
                       stockStatus === 'low' ? colors.warning.main : colors.success.main, 
                marginTop: '4px' 
              }}>
                {stockStatus === 'critical' ? '⚠ Below reorder' : 
                 stockStatus === 'low' ? 'Low stock' : 'Healthy'}
              </div>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: colors.background.secondary,
              border: `1px solid ${colors.gray[200]}`
            }}>
              <div style={{ fontSize: '12px', color: colors.gray[500], marginBottom: '4px' }}>Turnover Rate</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: colors.gray[900] }}>
                {stockTurnover}x/year
              </div>
              <div style={{ fontSize: '11px', color: colors.gray[400], marginTop: '4px' }}>
                {daysOfSupply} days supply
              </div>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: colors.background.secondary,
              border: `1px solid ${colors.gray[200]}`
            }}>
              <div style={{ fontSize: '12px', color: colors.gray[500], marginBottom: '4px' }}>Price</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: colors.gray[900] }}>
                ${product.price.toFixed(2)}
              </div>
              <div style={{ fontSize: '11px', color: colors.gray[400], marginTop: '4px' }}>
                Tax: {product.taxPercentage}%
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
                <LineChart data={salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[200]} />
                  <XAxis dataKey="month" stroke={colors.gray[400]} tick={{ fill: colors.gray[500], fontSize: 12 }} />
                  <YAxis yAxisId="left" stroke={colors.gray[400]} tick={{ fill: colors.gray[500], fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" stroke={colors.gray[400]} tick={{ fill: colors.gray[500], fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.background.primary,
                      border: `1px solid ${colors.gray[200]}`,
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="units"
                    stroke={colors.primary[500]}
                    strokeWidth={2}
                    dot={{ fill: colors.primary[500], r: 3 }}
                    name="Units"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke={colors.chart.green}
                    strokeWidth={2}
                    dot={{ fill: colors.chart.green, r: 3 }}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Channel Mix */}
            <div style={{
              padding: '24px',
              borderRadius: '12px',
              backgroundColor: colors.background.secondary,
              border: `1px solid ${colors.gray[200]}`
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
                Sales by Channel
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ marginTop: '16px' }}>
                {channelData.map(channel => (
                  <div key={channel.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '2px',
                      backgroundColor: channel.color
                    }} />
                    <span style={{ fontSize: '12px', color: colors.gray[600], flex: 1 }}>{channel.name}</span>
                    <span style={{ fontSize: '12px', color: colors.gray[800], fontWeight: '600' }}>
                      {channel.units} units
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stock Movement */}
          <div style={{
            padding: '24px',
            borderRadius: '12px',
            backgroundColor: colors.background.secondary,
            border: `1px solid ${colors.gray[200]}`,
            marginBottom: '32px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
              7-Day Stock Movement
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stockMovement}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[200]} />
                <XAxis dataKey="day" stroke={colors.gray[400]} tick={{ fill: colors.gray[500], fontSize: 12 }} />
                <YAxis stroke={colors.gray[400]} tick={{ fill: colors.gray[500], fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.background.primary,
                    border: `1px solid ${colors.gray[200]}`,
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="inbound" fill={colors.success.main} name="Inbound" />
                <Bar dataKey="outbound" fill={colors.primary[500]} name="Outbound" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Customers Table */}
          <div style={{
            padding: '24px',
            borderRadius: '12px',
            backgroundColor: colors.background.secondary,
            border: `1px solid ${colors.gray[200]}`
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
              Top 10 Customers
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.gray[200]}` }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: colors.gray[500], fontWeight: '600' }}>Rank</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: colors.gray[500], fontWeight: '600' }}>Customer</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: colors.gray[500], fontWeight: '600' }}>Quantity</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: colors.gray[500], fontWeight: '600' }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map(customer => (
                  <tr key={customer.rank} style={{ borderBottom: `1px solid ${colors.gray[100]}` }}>
                    <td style={{ padding: '12px', fontSize: '14px', color: colors.gray[900] }}>#{customer.rank}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: colors.gray[700] }}>{customer.name}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: colors.gray[700], textAlign: 'right' }}>{customer.quantity}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: colors.gray[900], fontWeight: '600', textAlign: 'right' }}>
                      ${customer.revenue.toLocaleString()}
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