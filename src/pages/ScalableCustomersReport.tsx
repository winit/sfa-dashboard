import React, { useState, useMemo } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { colors, CHART_COLORS } from '../styles/colors'
import { CustomerScorecard } from '../components/CustomerScorecard'

// Generate mock customer data (simulating thousands of customers)
const generateCustomersData = () => {
  const channels = ['Modern Trade', 'Traditional Trade', 'HORECA', 'E-Commerce', 'Wholesale']
  const classifications = ['Key Account', 'A Class', 'B Class', 'C Class', 'New Customer']
  const customerTypes = ['Cash', 'Credit', 'Mixed']
  const regions = ['North', 'South', 'East', 'West', 'Central']
  const paymentTerms = ['Net 30', 'Net 45', 'Net 60', 'COD', 'Advance']
  
  const customers = []
  
  // Generate 2000 customers
  for (let i = 1; i <= 2000; i++) {
    const channel = channels[Math.floor(Math.random() * channels.length)]
    const classification = classifications[Math.floor(Math.random() * classifications.length)]
    
    // Key accounts and A class have higher sales
    let baseSales = 10000
    if (classification === 'Key Account') baseSales = 200000
    else if (classification === 'A Class') baseSales = 100000
    else if (classification === 'B Class') baseSales = 50000
    else if (classification === 'C Class') baseSales = 20000
    
    const sales = Math.floor(baseSales + Math.random() * baseSales)
    const orders = Math.floor(20 + Math.random() * 200)
    
    customers.push({
      customerCode: `C${String(i).padStart(4, '0')}`,
      customerName: `Customer ${i}`,
      channel: channel,
      classification: classification,
      customerType: customerTypes[Math.floor(Math.random() * customerTypes.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      routeCode: `R${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
      creditLimit: Math.floor(50000 + Math.random() * 200000),
      outstandingAmount: Math.floor(Math.random() * 50000),
      paymentTerms: paymentTerms[Math.floor(Math.random() * paymentTerms.length)],
      totalSales: sales,
      totalOrders: orders,
      avgOrderValue: Math.round(sales / orders),
      lastOrderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      visitFrequency: Math.floor(1 + Math.random() * 7), // visits per week
      isActive: Math.random() > 0.1
    })
  }
  
  return customers
}

const allCustomersData = generateCustomersData()

// Calculate channel summary
const channelSummary = allCustomersData.reduce((acc, customer) => {
  if (!acc[customer.channel]) {
    acc[customer.channel] = { 
      channel: customer.channel, 
      customers: 0, 
      sales: 0,
      orders: 0,
      avgOrderValue: 0
    }
  }
  acc[customer.channel].customers += 1
  acc[customer.channel].sales += customer.totalSales
  acc[customer.channel].orders += customer.totalOrders
  return acc
}, {} as Record<string, any>)

const channelData = Object.values(channelSummary).map((c: any) => ({
  ...c,
  avgOrderValue: Math.round(c.sales / c.orders)
}))

// Calculate classification summary
const classificationSummary = allCustomersData.reduce((acc, customer) => {
  if (!acc[customer.classification]) {
    acc[customer.classification] = { 
      classification: customer.classification, 
      customers: 0, 
      sales: 0,
      contribution: 0
    }
  }
  acc[customer.classification].customers += 1
  acc[customer.classification].sales += customer.totalSales
  return acc
}, {} as Record<string, any>)

const totalSales = allCustomersData.reduce((sum, c) => sum + c.totalSales, 0)
const classificationData = Object.values(classificationSummary).map((c: any) => ({
  ...c,
  contribution: ((c.sales / totalSales) * 100).toFixed(1)
}))

export const ScalableCustomersReport: React.FC = () => {
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState('last30days')
  const [channelFilter, setChannelFilter] = useState('all')
  const [classificationFilter, setClassificationFilter] = useState('all')
  const [regionFilter, setRegionFilter] = useState('all')
  const [customerTypeFilter, setCustomerTypeFilter] = useState('all')
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'sales' | 'orders' | 'avgOrderValue' | 'creditLimit'>('sales')
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary')
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const itemsPerPage = 25
  
  // Filter customers
  const filteredCustomers = useMemo(() => {
    let customers = [...allCustomersData]
    
    // Search filter
    if (searchTerm) {
      customers = customers.filter(c => 
        c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.customerCode.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Channel filter
    if (channelFilter !== 'all') {
      customers = customers.filter(c => c.channel === channelFilter)
    }
    
    // Classification filter
    if (classificationFilter !== 'all') {
      customers = customers.filter(c => c.classification === classificationFilter)
    }
    
    // Region filter
    if (regionFilter !== 'all') {
      customers = customers.filter(c => c.region === regionFilter)
    }
    
    // Customer type filter
    if (customerTypeFilter !== 'all') {
      customers = customers.filter(c => c.customerType === customerTypeFilter)
    }
    
    // Active filter
    if (activeFilter === 'active') {
      customers = customers.filter(c => c.isActive)
    } else if (activeFilter === 'inactive') {
      customers = customers.filter(c => !c.isActive)
    }
    
    // Sorting
    customers.sort((a, b) => {
      const aVal = a[sortBy] as number
      const bVal = b[sortBy] as number
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
    })
    
    return customers
  }, [searchTerm, channelFilter, classificationFilter, regionFilter, customerTypeFilter, activeFilter, sortBy, sortOrder])
  
  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  
  // Summary statistics
  const summaryStats = useMemo(() => {
    const data = filteredCustomers.length > 0 ? filteredCustomers : allCustomersData
    return {
      totalCustomers: data.length,
      activeCustomers: data.filter(c => c.isActive).length,
      totalSales: data.reduce((sum, c) => sum + c.totalSales, 0),
      totalOrders: data.reduce((sum, c) => sum + c.totalOrders, 0),
      avgOrderValue: data.length > 0 ? 
        Math.round(data.reduce((sum, c) => sum + c.totalSales, 0) / data.reduce((sum, c) => sum + c.totalOrders, 0)) : 0,
      totalOutstanding: data.reduce((sum, c) => sum + c.outstandingAmount, 0)
    }
  }, [filteredCustomers])
  
  return (
    <div style={{ padding: '24px', backgroundColor: colors.background.secondary, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: colors.gray[900] }}>
              Customer Analysis
            </h1>
            <p style={{ color: colors.gray[500], fontSize: '15px' }}>
              Analyzing {summaryStats.totalCustomers.toLocaleString()} customers across all channels and classifications
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
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisQuarter">This Quarter</option>
              <option value="lastQuarter">Last Quarter</option>
              <option value="thisYear">This Year</option>
              <option value="allTime">All Time</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '16px',
          borderRadius: '8px',
          border: `1px solid ${colors.gray[200]}`,
        }}>
          <div style={{ fontSize: '12px', color: colors.gray[500], marginBottom: '4px' }}>Total Customers</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: colors.gray[900] }}>
            {summaryStats.totalCustomers.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: colors.success.main }}>
            {summaryStats.activeCustomers} active
          </div>
        </div>
        
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '16px',
          borderRadius: '8px',
          border: `1px solid ${colors.gray[200]}`,
        }}>
          <div style={{ fontSize: '12px', color: colors.gray[500], marginBottom: '4px' }}>Total Sales</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: colors.gray[900] }}>
            ${(summaryStats.totalSales / 1000000).toFixed(1)}M
          </div>
        </div>
        
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '16px',
          borderRadius: '8px',
          border: `1px solid ${colors.gray[200]}`,
        }}>
          <div style={{ fontSize: '12px', color: colors.gray[500], marginBottom: '4px' }}>Total Orders</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: colors.gray[900] }}>
            {(summaryStats.totalOrders / 1000).toFixed(1)}K
          </div>
        </div>
        
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '16px',
          borderRadius: '8px',
          border: `1px solid ${colors.gray[200]}`,
        }}>
          <div style={{ fontSize: '12px', color: colors.gray[500], marginBottom: '4px' }}>Avg Order Value</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: colors.gray[900] }}>
            ${summaryStats.avgOrderValue}
          </div>
        </div>
        
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '16px',
          borderRadius: '8px',
          border: `1px solid ${colors.gray[200]}`,
        }}>
          <div style={{ fontSize: '12px', color: colors.gray[500], marginBottom: '4px' }}>Outstanding</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: colors.warning.main }}>
            ${(summaryStats.totalOutstanding / 1000).toFixed(0)}K
          </div>
        </div>
      </div>
      
      {/* View Mode Toggle */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '20px',
        backgroundColor: colors.background.primary,
        padding: '4px',
        borderRadius: '8px',
        width: 'fit-content',
        border: `1px solid ${colors.gray[200]}`
      }}>
        <button
          onClick={() => setViewMode('summary')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: viewMode === 'summary' ? colors.primary[500] : 'transparent',
            color: viewMode === 'summary' ? 'white' : colors.gray[600],
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Summary View
        </button>
        <button
          onClick={() => setViewMode('detailed')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: viewMode === 'detailed' ? colors.primary[500] : 'transparent',
            color: viewMode === 'detailed' ? 'white' : colors.gray[600],
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Detailed View
        </button>
      </div>
      
      {viewMode === 'summary' ? (
        <>
          {/* Channel Performance */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              backgroundColor: colors.background.primary,
              padding: '24px',
              borderRadius: '12px',
              border: `1px solid ${colors.gray[200]}`
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
                Sales by Channel
              </h2>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={channelData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[200]} />
                    <XAxis dataKey="channel" angle={-45} textAnchor="end" height={80} stroke={colors.gray[400]} tick={{ fill: colors.gray[500], fontSize: 12 }} />
                    <YAxis stroke={colors.gray[400]} tick={{ fill: colors.gray[500] }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: any) => `$${(value / 1000).toFixed(0)}k`} contentStyle={{ backgroundColor: colors.background.primary, border: `1px solid ${colors.gray[200]}`, borderRadius: '8px' }} />
                    <Bar dataKey="sales" fill={colors.primary[500]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div style={{
              backgroundColor: colors.background.primary,
              padding: '24px',
              borderRadius: '12px',
              border: `1px solid ${colors.gray[200]}`
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
                Customer Classification
              </h2>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={classificationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ classification, contribution }) => `${classification} (${contribution}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="sales"
                    >
                      {classificationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `$${(value / 1000).toFixed(0)}k`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* ABC Analysis */}
          <div style={{
            backgroundColor: colors.background.primary,
            padding: '24px',
            borderRadius: '12px',
            border: `1px solid ${colors.gray[200]}`,
            marginBottom: '20px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
              ABC Analysis - Customer Contribution
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {classificationData.map((cls, index) => (
                <div key={cls.classification} style={{
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: colors.background.secondary,
                  borderLeft: `4px solid ${CHART_COLORS[index % CHART_COLORS.length]}`
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: colors.gray[800] }}>
                    {cls.classification}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', color: colors.gray[600] }}>Customers:</span>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: colors.gray[800] }}>{cls.customers}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', color: colors.gray[600] }}>Sales:</span>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: colors.gray[800] }}>${(cls.sales / 1000000).toFixed(1)}M</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: colors.gray[600] }}>Contribution:</span>
                    <span style={{ 
                      fontSize: '13px', 
                      fontWeight: '600',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: parseFloat(cls.contribution) > 20 ? colors.success.light : colors.warning.light,
                      color: parseFloat(cls.contribution) > 20 ? colors.success.dark : colors.warning.dark
                    }}>
                      {cls.contribution}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Detailed View with Filters */}
          <div style={{
            backgroundColor: colors.background.primary,
            padding: '20px',
            borderRadius: '12px',
            border: `1px solid ${colors.gray[200]}`,
            marginBottom: '20px'
          }}>
            {/* Filters */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '12px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                  Search Customer
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Name or code..."
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${colors.gray[300]}`,
                    fontSize: '13px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ fontSize: '12px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                  Channel
                </label>
                <select
                  value={channelFilter}
                  onChange={(e) => {
                    setChannelFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${colors.gray[300]}`,
                    fontSize: '13px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="all">All Channels</option>
                  {['Modern Trade', 'Traditional Trade', 'HORECA', 'E-Commerce', 'Wholesale'].map(channel => (
                    <option key={channel} value={channel}>{channel}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '12px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                  Classification
                </label>
                <select
                  value={classificationFilter}
                  onChange={(e) => {
                    setClassificationFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${colors.gray[300]}`,
                    fontSize: '13px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="all">All Classes</option>
                  {['Key Account', 'A Class', 'B Class', 'C Class', 'New Customer'].map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '12px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                  Region
                </label>
                <select
                  value={regionFilter}
                  onChange={(e) => {
                    setRegionFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${colors.gray[300]}`,
                    fontSize: '13px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="all">All Regions</option>
                  {['North', 'South', 'East', 'West', 'Central'].map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '12px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                  Type
                </label>
                <select
                  value={customerTypeFilter}
                  onChange={(e) => {
                    setCustomerTypeFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${colors.gray[300]}`,
                    fontSize: '13px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="all">All Types</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit">Credit</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '12px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                  Status
                </label>
                <select
                  value={activeFilter}
                  onChange={(e) => {
                    setActiveFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${colors.gray[300]}`,
                    fontSize: '13px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '12px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${colors.gray[300]}`,
                    fontSize: '13px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="sales">Sales</option>
                  <option value="orders">Orders</option>
                  <option value="avgOrderValue">Avg Order Value</option>
                  <option value="creditLimit">Credit Limit</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '12px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                  Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${colors.gray[300]}`,
                    fontSize: '13px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="desc">Highest First</option>
                  <option value="asc">Lowest First</option>
                </select>
              </div>
            </div>
            
            {/* Results Summary */}
            <div style={{ 
              padding: '12px', 
              backgroundColor: colors.background.secondary, 
              borderRadius: '6px',
              marginBottom: '20px'
            }}>
              <span style={{ color: colors.gray[600], fontSize: '14px' }}>
                Showing {paginatedCustomers.length} of {filteredCustomers.length} customers
                {searchTerm && ` matching "${searchTerm}"`}
              </span>
            </div>
            
            {/* Customer Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${colors.gray[200]}` }}>
                    <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: colors.gray[700] }}>
                      Customer Code
                    </th>
                    <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: colors.gray[700] }}>
                      Customer Name
                    </th>
                    <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: colors.gray[700] }}>
                      Channel
                    </th>
                    <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: colors.gray[700] }}>
                      Classification
                    </th>
                    <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: colors.gray[700] }}>
                      Region
                    </th>
                    <th style={{ padding: '10px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: colors.gray[700] }}>
                      Total Sales
                    </th>
                    <th style={{ padding: '10px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: colors.gray[700] }}>
                      Orders
                    </th>
                    <th style={{ padding: '10px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: colors.gray[700] }}>
                      AOV
                    </th>
                    <th style={{ padding: '10px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: colors.gray[700] }}>
                      Credit Limit
                    </th>
                    <th style={{ padding: '10px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: colors.gray[700] }}>
                      Outstanding
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: colors.gray[700] }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.map((customer, index) => (
                    <tr key={customer.customerCode} style={{ 
                      borderBottom: `1px solid ${colors.gray[100]}`,
                      backgroundColor: index % 2 === 0 ? 'transparent' : colors.background.secondary,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primary[50]
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'transparent' : colors.background.secondary
                    }}
                    onClick={() => setSelectedCustomer(customer)}>
                      <td style={{ padding: '10px', fontSize: '13px', fontWeight: '500', color: colors.primary[600] }}>
                        {customer.customerCode}
                      </td>
                      <td style={{ padding: '10px', fontSize: '13px', color: colors.gray[700] }}>
                        {customer.customerName}
                      </td>
                      <td style={{ padding: '10px', fontSize: '13px' }}>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: colors.gray[100],
                          color: colors.gray[700],
                          fontSize: '11px'
                        }}>
                          {customer.channel}
                        </span>
                      </td>
                      <td style={{ padding: '10px', fontSize: '13px' }}>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: 
                            customer.classification === 'Key Account' ? colors.chart.purple + '20' :
                            customer.classification === 'A Class' ? colors.success.light :
                            customer.classification === 'B Class' ? colors.info.light :
                            customer.classification === 'C Class' ? colors.warning.light :
                            colors.gray[100],
                          color: 
                            customer.classification === 'Key Account' ? colors.chart.purple :
                            customer.classification === 'A Class' ? colors.success.dark :
                            customer.classification === 'B Class' ? colors.info.dark :
                            customer.classification === 'C Class' ? colors.warning.dark :
                            colors.gray[600],
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          {customer.classification}
                        </span>
                      </td>
                      <td style={{ padding: '10px', fontSize: '13px', color: colors.gray[600] }}>
                        {customer.region}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: colors.gray[900] }}>
                        ${(customer.totalSales / 1000).toFixed(1)}k
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', fontSize: '13px', color: colors.gray[700] }}>
                        {customer.totalOrders}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', fontSize: '13px', color: colors.gray[700] }}>
                        ${customer.avgOrderValue}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', fontSize: '13px', color: colors.gray[700] }}>
                        ${(customer.creditLimit / 1000).toFixed(0)}k
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', fontSize: '13px' }}>
                        <span style={{
                          color: customer.outstandingAmount > customer.creditLimit * 0.8 ? colors.error.main : colors.gray[700],
                          fontWeight: customer.outstandingAmount > customer.creditLimit * 0.8 ? '600' : '400'
                        }}>
                          ${(customer.outstandingAmount / 1000).toFixed(0)}k
                        </span>
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center', fontSize: '13px' }}>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: customer.isActive ? colors.success.light : colors.error.light,
                          color: customer.isActive ? colors.success.dark : colors.error.dark,
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          {customer.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '20px',
              padding: '16px',
              backgroundColor: colors.background.secondary,
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '14px', color: colors.gray[600] }}>
                Page {currentPage} of {totalPages}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${colors.gray[300]}`,
                    backgroundColor: currentPage === 1 ? colors.gray[100] : 'white',
                    color: currentPage === 1 ? colors.gray[400] : colors.gray[700],
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Previous
                </button>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${colors.gray[300]}`,
                    backgroundColor: currentPage === totalPages ? colors.gray[100] : 'white',
                    color: currentPage === totalPages ? colors.gray[400] : colors.gray[700],
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Next
                </button>
              </div>
            </div>
            
            {/* Export Button */}
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: colors.primary[500],
                  color: 'white',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Export to Excel
              </button>
            </div>
          </div>
        </>
      )}
      
      {/* Customer Scorecard Modal */}
      {selectedCustomer && (
        <CustomerScorecard 
          customer={selectedCustomer} 
          onClose={() => setSelectedCustomer(null)} 
        />
      )}
    </div>
  )
}