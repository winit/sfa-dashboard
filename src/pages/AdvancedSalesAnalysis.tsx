import React, { useState } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { colors, CHART_COLORS } from '../styles/colors'
import { Calendar, Filter, TrendingUp, Users, Package, MapPin, DollarSign, Clock, Target } from 'lucide-react'

// Mock data based on actual database structure
const salesByRoute = [
  { routeCode: 'R001', routeName: 'Downtown Dubai', salesman: 'Ahmed Hassan', sales: 145000, orders: 320, customers: 85, productivity: 92 },
  { routeCode: 'R002', routeName: 'Business Bay', salesman: 'Mohammed Ali', sales: 138000, orders: 295, customers: 78, productivity: 88 },
  { routeCode: 'R003', routeName: 'Jumeirah', salesman: 'Khalid Omar', sales: 125000, orders: 260, customers: 72, productivity: 85 },
  { routeCode: 'R004', routeName: 'Deira', salesman: 'Rashid Khan', sales: 118000, orders: 285, customers: 92, productivity: 78 },
  { routeCode: 'R005', routeName: 'Al Barsha', salesman: 'Youssef Ibrahim', sales: 112000, orders: 245, customers: 68, productivity: 82 },
  { routeCode: 'R006', routeName: 'Marina', salesman: 'Omar Syed', sales: 108000, orders: 230, customers: 65, productivity: 90 },
]

const salesByProductHierarchy = [
  { 
    category: 'Beverages',
    subCategories: [
      { name: 'Carbonated Soft Drinks', sales: 125000, units: 45000 },
      { name: 'Juices', sales: 85000, units: 32000 },
      { name: 'Water', sales: 65000, units: 55000 },
      { name: 'Energy Drinks', sales: 45000, units: 12000 }
    ]
  },
  {
    category: 'Snacks',
    subCategories: [
      { name: 'Chips', sales: 78000, units: 35000 },
      { name: 'Biscuits', sales: 56000, units: 28000 },
      { name: 'Chocolates', sales: 48000, units: 18000 },
      { name: 'Nuts', sales: 35000, units: 15000 }
    ]
  },
  {
    category: 'Dairy Products',
    subCategories: [
      { name: 'Milk', sales: 92000, units: 38000 },
      { name: 'Yogurt', sales: 48000, units: 25000 },
      { name: 'Cheese', sales: 35000, units: 12000 },
      { name: 'Butter', sales: 28000, units: 10000 }
    ]
  }
]

const customerSegmentData = [
  { channel: 'Hypermarket', customers: 45, sales: 380000, avgOrderValue: 8444, growth: 12.5 },
  { channel: 'Supermarket', customers: 125, sales: 450000, avgOrderValue: 3600, growth: 8.3 },
  { channel: 'Convenience Store', customers: 280, sales: 320000, avgOrderValue: 1143, growth: 15.2 },
  { channel: 'Restaurant', customers: 85, sales: 180000, avgOrderValue: 2118, growth: 6.8 },
  { channel: 'Hotel', customers: 38, sales: 145000, avgOrderValue: 3816, growth: 10.5 },
]

const timeBasedAnalysis = [
  { hour: '6AM', sales: 12000, orders: 25 },
  { hour: '7AM', sales: 28000, orders: 58 },
  { hour: '8AM', sales: 45000, orders: 92 },
  { hour: '9AM', sales: 62000, orders: 125 },
  { hour: '10AM', sales: 78000, orders: 156 },
  { hour: '11AM', sales: 85000, orders: 170 },
  { hour: '12PM', sales: 72000, orders: 145 },
  { hour: '1PM', sales: 58000, orders: 116 },
  { hour: '2PM', sales: 68000, orders: 136 },
  { hour: '3PM', sales: 55000, orders: 110 },
  { hour: '4PM', sales: 42000, orders: 84 },
  { hour: '5PM', sales: 35000, orders: 70 },
]

const visitProductivity = [
  { type: 'Productive Visits', value: 782, percentage: 68 },
  { type: 'Non-Productive Visits', value: 368, percentage: 32 },
]

export const AdvancedSalesAnalysis: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [selectedRoute, setSelectedRoute] = useState('all')
  const [selectedChannel, setSelectedChannel] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(true)

  const periodOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' },
  ]

  return (
    <div style={{ backgroundColor: colors.background.secondary, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: colors.background.primary, 
        padding: '24px',
        borderBottom: `1px solid ${colors.gray[200]}`
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.gray[900], marginBottom: '8px' }}>
          Advanced Sales Analysis
        </h1>
        <p style={{ color: colors.gray[500], fontSize: '14px' }}>
          Comprehensive sales insights based on routes, products, and customer segments
        </p>
      </div>

      {/* Filter Section */}
      <div style={{ 
        backgroundColor: colors.background.primary,
        padding: '20px 24px',
        borderBottom: `1px solid ${colors.gray[200]}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Quick Filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: `1px solid ${colors.gray[300]}`,
              backgroundColor: colors.background.primary,
              color: colors.gray[700],
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          {/* Route Filter */}
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: `1px solid ${colors.gray[300]}`,
              backgroundColor: colors.background.primary,
              color: colors.gray[700],
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Routes</option>
            {salesByRoute.map(route => (
              <option key={route.routeCode} value={route.routeCode}>
                {route.routeName} - {route.salesman}
              </option>
            ))}
          </select>

          {/* Channel Filter */}
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: `1px solid ${colors.gray[300]}`,
              backgroundColor: colors.background.primary,
              color: colors.gray[700],
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Channels</option>
            {customerSegmentData.map(segment => (
              <option key={segment.channel} value={segment.channel}>{segment.channel}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: `1px solid ${colors.gray[300]}`,
              backgroundColor: colors.background.primary,
              color: colors.gray[700],
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Categories</option>
            {salesByProductHierarchy.map(cat => (
              <option key={cat.category} value={cat.category}>{cat.category}</option>
            ))}
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: `1px solid ${colors.primary[500]}`,
              backgroundColor: showFilters ? colors.primary[500] : colors.background.primary,
              color: showFilters ? 'white' : colors.primary[500],
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Filter size={16} />
            Advanced Filters
          </button>
        </div>

        {/* Advanced Filters (expandable) */}
        {showFilters && (
          <div style={{
            padding: '16px',
            backgroundColor: colors.gray[50],
            borderRadius: '8px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <label style={{ fontSize: '12px', color: colors.gray[600], marginBottom: '4px', display: 'block' }}>
                Transaction Type
              </label>
              <select style={{
                width: '100%',
                padding: '6px',
                borderRadius: '4px',
                border: `1px solid ${colors.gray[300]}`,
                fontSize: '14px'
              }}>
                <option>All Types</option>
                <option>Van Sales</option>
                <option>Pre-Sales</option>
                <option>Returns</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: colors.gray[600], marginBottom: '4px', display: 'block' }}>
                Payment Type
              </label>
              <select style={{
                width: '100%',
                padding: '6px',
                borderRadius: '4px',
                border: `1px solid ${colors.gray[300]}`,
                fontSize: '14px'
              }}>
                <option>All Payments</option>
                <option>Cash</option>
                <option>Credit</option>
                <option>Mixed</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: colors.gray[600], marginBottom: '4px', display: 'block' }}>
                Customer Classification
              </label>
              <select style={{
                width: '100%',
                padding: '6px',
                borderRadius: '4px',
                border: `1px solid ${colors.gray[300]}`,
                fontSize: '14px'
              }}>
                <option>All Classifications</option>
                <option>Key Account</option>
                <option>Regular</option>
                <option>New</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: colors.gray[600], marginBottom: '4px', display: 'block' }}>
                Brand
              </label>
              <select style={{
                width: '100%',
                padding: '6px',
                borderRadius: '4px',
                border: `1px solid ${colors.gray[300]}`,
                fontSize: '14px'
              }}>
                <option>All Brands</option>
                <option>Coca Cola</option>
                <option>Pepsi</option>
                <option>Nestle</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px' }}>
        {/* Sales by Route/Salesman */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            backgroundColor: colors.background.primary,
            borderRadius: '12px',
            padding: '24px',
            border: `1px solid ${colors.gray[200]}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <MapPin size={20} color={colors.primary[500]} style={{ marginRight: '8px' }} />
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray[900] }}>
                Sales by Route & Salesman
              </h2>
            </div>

            <div style={{ height: '400px', marginBottom: '24px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByRoute} margin={{ left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[200]} />
                  <XAxis 
                    dataKey="routeName" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    tick={{ fill: colors.gray[500], fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: colors.gray[500], fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: colors.background.primary,
                      border: `1px solid ${colors.gray[200]}`,
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="sales" fill={colors.primary[500]} name="Sales" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="orders" fill={colors.chart.purple} name="Orders" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Route Performance Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${colors.gray[200]}` }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: colors.gray[600], fontWeight: '600' }}>Route</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: colors.gray[600], fontWeight: '600' }}>Salesman</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', color: colors.gray[600], fontWeight: '600' }}>Sales</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', color: colors.gray[600], fontWeight: '600' }}>Orders</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', color: colors.gray[600], fontWeight: '600' }}>Customers</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', color: colors.gray[600], fontWeight: '600' }}>Productivity</th>
                  </tr>
                </thead>
                <tbody>
                  {salesByRoute.map((route, index) => (
                    <tr key={route.routeCode} style={{ borderBottom: `1px solid ${colors.gray[100]}` }}>
                      <td style={{ padding: '12px', fontSize: '14px', color: colors.gray[700] }}>{route.routeName}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: colors.gray[700] }}>{route.salesman}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: colors.gray[900] }}>
                        ${route.sales.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: colors.gray[700] }}>{route.orders}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: colors.gray[700] }}>{route.customers}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: route.productivity >= 85 ? colors.success.light : colors.warning.light,
                          color: route.productivity >= 85 ? colors.success.dark : colors.warning.dark,
                          fontSize: '13px',
                          fontWeight: '500'
                        }}>
                          {route.productivity}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sales by Product Hierarchy */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            backgroundColor: colors.background.primary,
            borderRadius: '12px',
            padding: '24px',
            border: `1px solid ${colors.gray[200]}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <Package size={20} color={colors.chart.green} style={{ marginRight: '8px' }} />
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray[900] }}>
                Sales by Product Category & Hierarchy
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {salesByProductHierarchy.map((category, catIndex) => (
                <div key={category.category} style={{
                  padding: '16px',
                  backgroundColor: colors.gray[50],
                  borderRadius: '8px',
                  border: `1px solid ${colors.gray[200]}`
                }}>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: colors.gray[900],
                    marginBottom: '16px',
                    paddingBottom: '8px',
                    borderBottom: `1px solid ${colors.gray[200]}`
                  }}>
                    {category.category}
                  </h3>
                  {category.subCategories.map((subCat, index) => (
                    <div key={subCat.name} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: index < category.subCategories.length - 1 ? `1px solid ${colors.gray[100]}` : 'none'
                    }}>
                      <div>
                        <div style={{ fontSize: '14px', color: colors.gray[700] }}>{subCat.name}</div>
                        <div style={{ fontSize: '12px', color: colors.gray[500] }}>{subCat.units.toLocaleString()} units</div>
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: colors.gray[900] }}>
                        ${(subCat.sales / 1000).toFixed(1)}k
                      </div>
                    </div>
                  ))}
                  <div style={{
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: `1px solid ${colors.gray[200]}`,
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: colors.gray[700] }}>Total</span>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: colors.primary[600] }}>
                      ${(category.subCategories.reduce((sum, sc) => sum + sc.sales, 0) / 1000).toFixed(1)}k
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Segmentation & Time Analysis */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Customer Segmentation */}
          <div style={{
            backgroundColor: colors.background.primary,
            borderRadius: '12px',
            padding: '24px',
            border: `1px solid ${colors.gray[200]}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <Users size={20} color={colors.chart.orange} style={{ marginRight: '8px' }} />
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray[900] }}>
                Customer Channel Performance
              </h2>
            </div>

            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerSegmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ channel, sales }) => `${channel}: $${(sales/1000).toFixed(0)}k`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="sales"
                  >
                    {customerSegmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Time-based Analysis */}
          <div style={{
            backgroundColor: colors.background.primary,
            borderRadius: '12px',
            padding: '24px',
            border: `1px solid ${colors.gray[200]}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <Clock size={20} color={colors.chart.purple} style={{ marginRight: '8px' }} />
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray[900] }}>
                Sales by Time of Day
              </h2>
            </div>

            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeBasedAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[200]} />
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fill: colors.gray[500], fontSize: 11 }}
                  />
                  <YAxis 
                    tick={{ fill: colors.gray[500], fontSize: 11 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: colors.background.primary,
                      border: `1px solid ${colors.gray[200]}`,
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke={colors.primary[500]} 
                    fill={colors.primary[100]} 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Visit Productivity */}
        <div style={{
          backgroundColor: colors.background.primary,
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${colors.gray[200]}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Target size={20} color={colors.chart.pink} style={{ marginRight: '8px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray[900] }}>
              Visit Productivity Analysis
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{
              padding: '16px',
              backgroundColor: colors.success.light,
              borderRadius: '8px',
              borderLeft: `4px solid ${colors.success.main}`
            }}>
              <div style={{ fontSize: '13px', color: colors.gray[600], marginBottom: '4px' }}>Productive Visits</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: colors.success.dark }}>782</div>
              <div style={{ fontSize: '13px', color: colors.success.main }}>68% of total</div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: colors.warning.light,
              borderRadius: '8px',
              borderLeft: `4px solid ${colors.warning.main}`
            }}>
              <div style={{ fontSize: '13px', color: colors.gray[600], marginBottom: '4px' }}>Non-Productive</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: colors.warning.dark }}>368</div>
              <div style={{ fontSize: '13px', color: colors.warning.main }}>32% of total</div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: colors.info.light,
              borderRadius: '8px',
              borderLeft: `4px solid ${colors.info.main}`
            }}>
              <div style={{ fontSize: '13px', color: colors.gray[600], marginBottom: '4px' }}>Avg Visit Duration</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: colors.info.dark }}>18 min</div>
              <div style={{ fontSize: '13px', color: colors.info.main }}>↑ 2 min from last month</div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: colors.primary[50],
              borderRadius: '8px',
              borderLeft: `4px solid ${colors.primary[500]}`
            }}>
              <div style={{ fontSize: '13px', color: colors.gray[600], marginBottom: '4px' }}>Conversion Rate</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: colors.primary[700] }}>68%</div>
              <div style={{ fontSize: '13px', color: colors.primary[500] }}>↑ 5% from target</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}