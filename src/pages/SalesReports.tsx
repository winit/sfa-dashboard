import React, { useState } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { colors, CHART_COLORS } from '../styles/colors'

// Mock data for different reports
const salesPerformanceData = [
  { month: 'Jan', sales: 145000, target: 150000, orders: 1250 },
  { month: 'Feb', sales: 152000, target: 150000, orders: 1340 },
  { month: 'Mar', sales: 168000, target: 160000, orders: 1450 },
  { month: 'Apr', sales: 175000, target: 170000, orders: 1520 },
  { month: 'May', sales: 182000, target: 180000, orders: 1680 },
  { month: 'Jun', sales: 195000, target: 190000, orders: 1750 },
]

const topCustomersData = [
  { name: 'Al Maya Supermarket', sales: 125000, orders: 245, growth: 12.5 },
  { name: 'Carrefour', sales: 118000, orders: 220, growth: 8.3 },
  { name: 'Lulu Hypermarket', sales: 98000, orders: 198, growth: 15.2 },
  { name: 'Spinneys', sales: 87000, orders: 175, growth: -2.1 },
  { name: 'Union Coop', sales: 76000, orders: 165, growth: 5.8 },
  { name: 'Choithrams', sales: 68000, orders: 142, growth: 10.3 },
  { name: 'West Zone', sales: 62000, orders: 135, growth: 7.5 },
  { name: 'Nesto', sales: 58000, orders: 128, growth: 4.2 },
]

const topProductsData = [
  { name: 'Coca Cola 330ml', sales: 45000, units: 15000, margin: 22 },
  { name: 'Pepsi 500ml', sales: 38000, units: 12000, margin: 20 },
  { name: 'Red Bull 250ml', sales: 35000, units: 8500, margin: 25 },
  { name: 'Aquafina 1L', sales: 32000, units: 16000, margin: 18 },
  { name: 'Lays Classic', sales: 28000, units: 14000, margin: 28 },
  { name: 'Oreo Cookies', sales: 26000, units: 13000, margin: 30 },
  { name: 'Kit Kat', sales: 24000, units: 12000, margin: 32 },
  { name: 'Doritos Nacho', sales: 22000, units: 11000, margin: 26 },
]

const categoryData = [
  { name: 'Beverages', value: 285000, percentage: 35 },
  { name: 'Snacks', value: 198000, percentage: 25 },
  { name: 'Dairy', value: 156000, percentage: 20 },
  { name: 'Personal Care', value: 98000, percentage: 12 },
  { name: 'Bakery', value: 65000, percentage: 8 },
]

const targetAchievementData = [
  { name: 'Q1 Target', target: 450000, achieved: 465000, percentage: 103 },
  { name: 'Q2 Target', target: 520000, achieved: 495000, percentage: 95 },
  { name: 'Monthly Target', target: 180000, achieved: 195000, percentage: 108 },
  { name: 'Weekly Target', target: 45000, achieved: 42000, percentage: 93 },
  { name: 'Daily Target', target: 7500, achieved: 8200, percentage: 109 },
]


export const SalesReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('performance')
  const [dateRange, setDateRange] = useState('thisMonth')
  
  const tabs = [
    { id: 'performance', label: 'Sales Performance' },
    { id: 'customers', label: 'Top Customers' },
    { id: 'products', label: 'Top Products' },
    { id: 'targets', label: 'Target vs Achievement' },
    { id: 'category', label: 'Sales by Category' },
  ]

  return (
    <div style={{ padding: '24px', backgroundColor: colors.background.secondary, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: colors.gray[900] }}>
              Sales Reports
            </h1>
            <p style={{ color: colors.gray[500], fontSize: '15px' }}>
              Comprehensive sales analytics and performance metrics
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: colors.gray[600], marginRight: '8px' }}>Period:</span>
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
              <option value="thisWeek">This Week</option>
              <option value="lastWeek">Last Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisQuarter">This Quarter</option>
              <option value="lastQuarter">Last Quarter</option>
              <option value="thisYear">This Year</option>
              <option value="lastYear">Last Year</option>
              <option value="last12Months">Last 12 Months</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px',
        borderBottom: `2px solid ${colors.gray[200]}`,
        paddingBottom: '0'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? `2px solid ${colors.primary[500]}` : '2px solid transparent',
              color: activeTab === tab.id ? colors.primary[500] : colors.gray[500],
              fontWeight: activeTab === tab.id ? '600' : '400',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div style={{ backgroundColor: colors.background.primary, borderRadius: '12px', padding: '24px', border: `1px solid ${colors.gray[200]}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        
        {/* Sales Performance Report */}
        {activeTab === 'performance' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
              Sales Performance Overview
            </h2>
            
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div style={{ padding: '16px', backgroundColor: colors.info.light, borderRadius: '8px', borderLeft: `4px solid ${colors.info.main}` }}>
                <div style={{ fontSize: '14px', color: colors.gray[500] }}>Total Sales (YTD)</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: colors.info.dark }}>$1,042,000</div>
                <div style={{ fontSize: '12px', color: colors.success.main }}>↑ 15.2% vs last year</div>
              </div>
              <div style={{ padding: '16px', backgroundColor: colors.success.light, borderRadius: '8px', borderLeft: `4px solid ${colors.success.main}` }}>
                <div style={{ fontSize: '14px', color: colors.gray[500] }}>Total Orders</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: colors.success.dark }}>8,750</div>
                <div style={{ fontSize: '12px', color: colors.success.main }}>↑ 12.8% vs last year</div>
              </div>
              <div style={{ padding: '16px', backgroundColor: colors.warning.light, borderRadius: '8px', borderLeft: `4px solid ${colors.warning.main}` }}>
                <div style={{ fontSize: '14px', color: colors.gray[500] }}>Avg Order Value</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: colors.warning.dark }}>$119.08</div>
                <div style={{ fontSize: '12px', color: colors.success.main }}>↑ 2.1% vs last year</div>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#fce7f3', borderRadius: '8px', borderLeft: `4px solid ${colors.chart.pink}` }}>
                <div style={{ fontSize: '14px', color: colors.gray[500] }}>Active Customers</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#9f1239' }}>1,245</div>
                <div style={{ fontSize: '12px', color: colors.success.main }}>↑ 8.5% vs last year</div>
              </div>
            </div>

            {/* Sales Trend Chart */}
            <div style={{ height: '400px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '16px' }}>Monthly Sales Trend</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[200]} />
                  <XAxis dataKey="month" stroke={colors.gray[400]} tick={{ fill: colors.gray[500] }} />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} stroke={colors.gray[400]} tick={{ fill: colors.gray[500] }} />
                  <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} contentStyle={{ backgroundColor: colors.background.primary, border: `1px solid ${colors.gray[200]}`, borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke={colors.primary[500]} strokeWidth={2} name="Sales" />
                  <Line type="monotone" dataKey="target" stroke={colors.error.main} strokeWidth={2} strokeDasharray="5 5" name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Top Customers Report */}
        {activeTab === 'customers' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
              Top Customers Analysis
            </h2>
            
            {/* Customer Performance Chart */}
            <div style={{ height: '400px', marginBottom: '32px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCustomersData.slice(0, 8)} margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[200]} />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke={colors.gray[400]} tick={{ fill: colors.gray[500] }} />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} stroke={colors.gray[400]} tick={{ fill: colors.gray[500] }} />
                  <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} contentStyle={{ backgroundColor: colors.background.primary, border: `1px solid ${colors.gray[200]}`, borderRadius: '8px' }} />
                  <Bar dataKey="sales" fill={colors.primary[500]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Customer Details Table */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '16px' }}>Customer Performance Details</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${colors.gray[200]}` }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Customer</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Sales</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Orders</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Avg Order</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomersData.map((customer, index) => (
                    <tr key={index} style={{ borderBottom: `1px solid ${colors.gray[100]}` }}>
                      <td style={{ padding: '12px' }}>{customer.name}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>
                        ${customer.sales.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>{customer.orders}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        ${(customer.sales / customer.orders).toFixed(0)}
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        textAlign: 'right',
                        color: customer.growth > 0 ? colors.success.main : colors.error.main
                      }}>
                        {customer.growth > 0 ? '↑' : '↓'} {Math.abs(customer.growth)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Products Report */}
        {activeTab === 'products' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
              Top Products Performance
            </h2>
            
            {/* Products Bar Chart */}
            <div style={{ height: '400px', marginBottom: '32px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData} margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[200]} />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke={colors.gray[400]} tick={{ fill: colors.gray[500] }} />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} stroke={colors.gray[400]} tick={{ fill: colors.gray[500] }} />
                  <Tooltip formatter={(value: any, name: string) => {
                    if (name === 'sales') return `$${value.toLocaleString()}`
                    if (name === 'margin') return `${value}%`
                    return value.toLocaleString()
                  }} />
                  <Legend />
                  <Bar dataKey="sales" fill={colors.primary[500]} name="Sales" />
                  <Bar dataKey="units" fill={colors.success.main} name="Units Sold" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Product Performance Table */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '16px' }}>Product Details</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${colors.gray[200]}` }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Product</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Sales</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Units</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Avg Price</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Margin %</th>
                  </tr>
                </thead>
                <tbody>
                  {topProductsData.map((product, index) => (
                    <tr key={index} style={{ borderBottom: `1px solid ${colors.gray[100]}` }}>
                      <td style={{ padding: '12px' }}>{product.name}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>
                        ${product.sales.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>{product.units.toLocaleString()}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        ${(product.sales / product.units).toFixed(2)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: product.margin > 25 ? colors.success.light : colors.warning.light,
                          color: product.margin > 25 ? colors.success.dark : colors.warning.dark
                        }}>
                          {product.margin}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Target vs Achievement Report */}
        {activeTab === 'targets' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
              Target vs Achievement Analysis
            </h2>
            
            {/* Achievement Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              {targetAchievementData.map((item, index) => (
                <div key={index} style={{ 
                  padding: '20px', 
                  border: `1px solid ${colors.gray[200]}`, 
                  borderRadius: '8px',
                  backgroundColor: item.percentage >= 100 ? colors.success.light : colors.error.light
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>{item.name}</h4>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', color: colors.gray[500] }}>Target</span>
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>${item.target.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', color: colors.gray[500] }}>Achieved</span>
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>${item.achieved.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div style={{ backgroundColor: colors.gray[200], borderRadius: '4px', height: '8px', marginBottom: '8px' }}>
                    <div style={{
                      width: `${Math.min(item.percentage, 100)}%`,
                      height: '100%',
                      backgroundColor: item.percentage >= 100 ? colors.success.main : colors.warning.main,
                      borderRadius: '4px',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <span style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: item.percentage >= 100 ? colors.success.main : colors.warning.main
                    }}>
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Monthly Target Comparison */}
            <div style={{ height: '400px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '16px' }}>Monthly Target vs Achievement</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[200]} />
                  <XAxis dataKey="month" stroke={colors.gray[400]} tick={{ fill: colors.gray[500] }} />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} stroke={colors.gray[400]} tick={{ fill: colors.gray[500] }} />
                  <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="target" fill={colors.error.main} name="Target" />
                  <Bar dataKey="sales" fill={colors.success.main} name="Achieved" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Sales by Category Report */}
        {activeTab === 'category' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
              Sales by Category
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              {/* Pie Chart */}
              <div style={{ height: '400px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '16px' }}>Category Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percentage }) => `${percentage}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Details */}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '16px' }}>Category Performance</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {categoryData.map((category, index) => (
                    <div key={index} style={{ 
                      padding: '16px', 
                      border: `1px solid ${colors.gray[200]}`, 
                      borderRadius: '8px',
                      borderLeft: `4px solid ${CHART_COLORS[index % CHART_COLORS.length]}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>{category.name}</span>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                          ${(category.value / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <div style={{ backgroundColor: colors.gray[200], borderRadius: '4px', height: '8px' }}>
                        <div style={{
                          width: `${category.percentage}%`,
                          height: '100%',
                          backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                          borderRadius: '4px'
                        }} />
                      </div>
                      <div style={{ marginTop: '4px', fontSize: '14px', color: colors.gray[500] }}>
                        {category.percentage}% of total sales
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}