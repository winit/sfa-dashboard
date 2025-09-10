import React, { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { colors } from '../styles/colors'
import { SalesmanOrderDetails } from './SalesmanOrderDetails'

// Generate mock data for 500 routes
const generateRoutesData = () => {
  const regions = ['North', 'South', 'East', 'West', 'Central']
  const areas = ['Downtown', 'Suburban', 'Industrial', 'Commercial', 'Residential']
  const data = []
  
  for (let i = 1; i <= 500; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)]
    const area = areas[Math.floor(Math.random() * areas.length)]
    const totalVisits = Math.floor(30 + Math.random() * 120)
    const productiveVisits = Math.floor(totalVisits * (0.6 + Math.random() * 0.4))
    const orders = productiveVisits + Math.floor(Math.random() * 20) // Some customers place multiple orders
    const sales = Math.floor(50000 + Math.random() * 200000)
    
    data.push({
      routeCode: `R${String(i).padStart(3, '0')}`,
      routeName: `${area} Route ${i}`,
      region: region,
      area: `${region}-${area}`,
      salesman: `Salesman ${i}`,
      sales: sales,
      orders: orders,
      totalVisits: totalVisits,
      productiveVisits: productiveVisits,
      uniqueCustomers: Math.floor(20 + Math.random() * 100), // Unique customers on route
      productivity: Math.round((productiveVisits / totalVisits) * 100),
      targetAchievement: Math.floor(70 + Math.random() * 60),
      avgOrderValue: Math.round(sales / orders),
      visitCompliance: Math.floor(70 + Math.random() * 30)
    })
  }
  return data
}

const allRoutesData = generateRoutesData()

// Aggregate data by region
const regionSummary = allRoutesData.reduce((acc, route) => {
  if (!acc[route.region]) {
    acc[route.region] = { 
      region: route.region, 
      sales: 0, 
      orders: 0, 
      routes: 0, 
      avgProductivity: 0,
      totalCustomers: 0 
    }
  }
  acc[route.region].sales += route.sales
  acc[route.region].orders += route.orders
  acc[route.region].routes += 1
  acc[route.region].totalCustomers += route.uniqueCustomers
  acc[route.region].avgProductivity += route.productivity
  return acc
}, {} as Record<string, any>)

const regionData = Object.values(regionSummary).map((r: any) => ({
  ...r,
  avgProductivity: Math.round(r.avgProductivity / r.routes)
}))

export const ScalableSalesAnalysis: React.FC = () => {
  // State for filters and view controls
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedArea, setSelectedArea] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'sales' | 'orders' | 'productivity' | 'target'>('sales')
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [performanceFilter, setPerformanceFilter] = useState<'all' | 'top' | 'bottom'>('all')
  const [selectedSalesman, setSelectedSalesman] = useState<{id: string, name: string} | null>(null)
  const [dateRange, setDateRange] = useState('last30days')
  const itemsPerPage = 20

  // Filter and sort data
  const filteredData = useMemo(() => {
    let data = [...allRoutesData]
    
    // Apply region filter
    if (selectedRegion !== 'all') {
      data = data.filter(r => r.region === selectedRegion)
    }
    
    // Apply area filter
    if (selectedArea !== 'all') {
      data = data.filter(r => r.area === selectedArea)
    }
    
    // Apply search
    if (searchTerm) {
      data = data.filter(r => 
        r.salesman.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.routeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.routeName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply performance filter
    if (performanceFilter === 'top') {
      data.sort((a, b) => b.sales - a.sales)
      data = data.slice(0, Math.floor(data.length * 0.2)) // Top 20%
    } else if (performanceFilter === 'bottom') {
      data.sort((a, b) => a.sales - b.sales)
      data = data.slice(0, Math.floor(data.length * 0.2)) // Bottom 20%
    }
    
    // Apply sorting
    data.sort((a, b) => {
      let aVal = a[sortBy as keyof typeof a] as number
      let bVal = b[sortBy as keyof typeof b] as number
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
    })
    
    return data
  }, [selectedRegion, selectedArea, searchTerm, sortBy, sortOrder, performanceFilter])

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Get unique areas for selected region
  const availableAreas = useMemo(() => {
    if (selectedRegion === 'all') return []
    return [...new Set(allRoutesData.filter(r => r.region === selectedRegion).map(r => r.area))]
  }, [selectedRegion])

  // Summary statistics
  const summaryStats = useMemo(() => {
    const data = filteredData.length > 0 ? filteredData : allRoutesData
    return {
      totalSales: data.reduce((sum, r) => sum + r.sales, 0),
      totalOrders: data.reduce((sum, r) => sum + r.orders, 0),
      totalRoutes: data.length,
      avgProductivity: Math.round(data.reduce((sum, r) => sum + r.productivity, 0) / data.length),
      avgTargetAchievement: Math.round(data.reduce((sum, r) => sum + r.targetAchievement, 0) / data.length)
    }
  }, [filteredData])

  // If a salesman is selected, show their order details
  if (selectedSalesman) {
    return (
      <SalesmanOrderDetails 
        salesmanId={selectedSalesman.id}
        salesmanName={selectedSalesman.name}
        onBack={() => setSelectedSalesman(null)}
      />
    )
  }

  return (
    <div style={{ padding: '24px', backgroundColor: colors.background.secondary, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: colors.gray[900] }}>
              Sales Force Analysis
            </h1>
            <p style={{ color: colors.gray[500], fontSize: '15px' }}>
              Analyzing performance across {allRoutesData.length} routes and sales representatives
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
              <option value="lastQuarter">Last Quarter</option>
              <option value="allTime">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '20px',
          borderRadius: '12px',
          border: `1px solid ${colors.gray[200]}`,
        }}>
          <div style={{ fontSize: '13px', color: colors.gray[500], marginBottom: '4px', fontWeight: '500' }}>
            Total Sales
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: colors.gray[900] }}>
            ${(summaryStats.totalSales / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: '12px', color: colors.success.main, marginTop: '4px' }}>
            {filteredData.length} routes
          </div>
        </div>

        <div style={{
          backgroundColor: colors.background.primary,
          padding: '20px',
          borderRadius: '12px',
          border: `1px solid ${colors.gray[200]}`,
        }}>
          <div style={{ fontSize: '13px', color: colors.gray[500], marginBottom: '4px', fontWeight: '500' }}>
            Total Orders
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: colors.gray[900] }}>
            {(summaryStats.totalOrders / 1000).toFixed(1)}K
          </div>
          <div style={{ fontSize: '12px', color: colors.gray[400], marginTop: '4px' }}>
            Across all routes
          </div>
        </div>

        <div style={{
          backgroundColor: colors.background.primary,
          padding: '20px',
          borderRadius: '12px',
          border: `1px solid ${colors.gray[200]}`,
        }}>
          <div style={{ fontSize: '13px', color: colors.gray[500], marginBottom: '4px', fontWeight: '500' }}>
            Avg Productivity
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: colors.gray[900] }}>
            {summaryStats.avgProductivity}%
          </div>
          <div style={{ fontSize: '12px', color: colors.gray[400], marginTop: '4px' }}>
            Visit efficiency
          </div>
        </div>

        <div style={{
          backgroundColor: colors.background.primary,
          padding: '20px',
          borderRadius: '12px',
          border: `1px solid ${colors.gray[200]}`,
        }}>
          <div style={{ fontSize: '13px', color: colors.gray[500], marginBottom: '4px', fontWeight: '500' }}>
            Target Achievement
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: colors.gray[900] }}>
            {summaryStats.avgTargetAchievement}%
          </div>
          <div style={{ fontSize: '12px', color: summaryStats.avgTargetAchievement >= 100 ? colors.success.main : colors.warning.main, marginTop: '4px' }}>
            {summaryStats.avgTargetAchievement >= 100 ? 'On track' : 'Below target'}
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
            cursor: 'pointer',
            transition: 'all 0.2s'
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
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Detailed View
        </button>
      </div>

      {viewMode === 'summary' ? (
        <>
          {/* Regional Performance Chart */}
          <div style={{ 
            backgroundColor: colors.background.primary, 
            padding: '24px', 
            borderRadius: '12px',
            border: `1px solid ${colors.gray[200]}`,
            marginBottom: '20px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
              Regional Performance Overview
            </h2>
            <div style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[200]} />
                  <XAxis dataKey="region" stroke={colors.gray[400]} tick={{ fill: colors.gray[500] }} />
                  <YAxis stroke={colors.gray[400]} tick={{ fill: colors.gray[500] }} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      if (name === 'sales') return [`$${(value / 1000).toFixed(0)}k`, 'Sales']
                      if (name === 'avgProductivity') return [`${value}%`, 'Avg Productivity']
                      return [value.toLocaleString(), name]
                    }}
                    contentStyle={{ 
                      backgroundColor: colors.background.primary, 
                      border: `1px solid ${colors.gray[200]}`,
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="sales" fill={colors.primary[500]} name="Sales" />
                  <Bar dataKey="orders" fill={colors.chart.green} name="Orders" />
                  <Bar dataKey="routes" fill={colors.chart.purple} name="Routes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performers */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px',
            marginBottom: '20px'
          }}>
            {/* Top 10 Performers */}
            <div style={{
              backgroundColor: colors.background.primary,
              padding: '24px',
              borderRadius: '12px',
              border: `1px solid ${colors.gray[200]}`
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: colors.gray[900] }}>
                Top 10 Performers
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {allRoutesData
                  .sort((a, b) => b.sales - a.sales)
                  .slice(0, 10)
                  .map((route, index) => (
                    <div key={route.routeCode} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px',
                      backgroundColor: index === 0 ? colors.success.light : colors.background.secondary,
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}>
                      <span style={{ color: colors.gray[700] }}>
                        <span style={{
                          display: 'inline-block',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: index < 3 ? colors.primary[100] : colors.gray[100],
                          color: index < 3 ? colors.primary[600] : colors.gray[600],
                          textAlign: 'center',
                          lineHeight: '24px',
                          fontSize: '12px',
                          fontWeight: '600',
                          marginRight: '8px'
                        }}>{index + 1}</span>
                        {route.salesman}
                      </span>
                      <span style={{ fontWeight: '600', color: colors.gray[900] }}>
                        ${(route.sales / 1000).toFixed(0)}k
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Bottom 10 Performers (Need Attention) */}
            <div style={{
              backgroundColor: colors.background.primary,
              padding: '24px',
              borderRadius: '12px',
              border: `1px solid ${colors.gray[200]}`
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: colors.gray[900] }}>
                Need Attention (Bottom 10)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {allRoutesData
                  .sort((a, b) => a.sales - b.sales)
                  .slice(0, 10)
                  .map((route, index) => (
                    <div key={route.routeCode} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px',
                      backgroundColor: colors.error.light,
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}>
                      <span style={{ color: colors.gray[700] }}>
                        {route.salesman}
                      </span>
                      <span style={{ fontWeight: '600', color: colors.error.dark }}>
                        ${(route.sales / 1000).toFixed(0)}k
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Metrics Explanation */}
          <div style={{
            backgroundColor: colors.info.light,
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            borderLeft: `4px solid ${colors.info.main}`
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: colors.gray[800] }}>
              Understanding the Metrics:
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', fontSize: '13px', color: colors.gray[600] }}>
              <div>
                <strong>Productivity %:</strong> (Productive Visits ÷ Total Visits) × 100
                <br/>
                <span style={{ fontSize: '12px', color: colors.gray[500] }}>Measures how many visits resulted in orders</span>
              </div>
              <div>
                <strong>Unique Customers:</strong> Number of distinct customers on the route
                <br/>
                <span style={{ fontSize: '12px', color: colors.gray[500] }}>Different from orders (one customer can place multiple orders)</span>
              </div>
              <div>
                <strong>Visits:</strong> Productive/Total format
                <br/>
                <span style={{ fontSize: '12px', color: colors.gray[500] }}>Shows successful visits vs all customer visits</span>
              </div>
            </div>
          </div>

          {/* Detailed View with Filters */}
          <div style={{
            backgroundColor: colors.background.primary,
            padding: '20px',
            borderRadius: '12px',
            border: `1px solid ${colors.gray[200]}`,
            marginBottom: '20px'
          }}>
            {/* Filter Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              {/* Search */}
              <div>
                <label style={{ fontSize: '13px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                  Search Salesman/Route
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search by name or code..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${colors.gray[300]}`,
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Region Filter */}
              <div>
                <label style={{ fontSize: '13px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                  Region
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value)
                    setSelectedArea('all')
                    setCurrentPage(1)
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${colors.gray[300]}`,
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="all">All Regions</option>
                  {['North', 'South', 'East', 'West', 'Central'].map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              {/* Area Filter */}
              {selectedRegion !== 'all' && (
                <div>
                  <label style={{ fontSize: '13px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                    Area
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => {
                      setSelectedArea(e.target.value)
                      setCurrentPage(1)
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: `1px solid ${colors.gray[300]}`,
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="all">All Areas</option>
                    {availableAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Performance Filter */}
              <div>
                <label style={{ fontSize: '13px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                  Performance
                </label>
                <select
                  value={performanceFilter}
                  onChange={(e) => {
                    setPerformanceFilter(e.target.value as any)
                    setCurrentPage(1)
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${colors.gray[300]}`,
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="all">All Performers</option>
                  <option value="top">Top 20%</option>
                  <option value="bottom">Bottom 20%</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label style={{ fontSize: '13px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${colors.gray[300]}`,
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="sales">Sales</option>
                  <option value="orders">Orders</option>
                  <option value="productivity">Productivity</option>
                  <option value="target">Target Achievement</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label style={{ fontSize: '13px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                  Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${colors.gray[300]}`,
                    fontSize: '14px',
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
                Showing {paginatedData.length} of {filteredData.length} routes
                {searchTerm && ` matching "${searchTerm}"`}
              </span>
            </div>

            {/* Data Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${colors.gray[200]}` }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: colors.gray[700] }}>
                      Route Code
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: colors.gray[700] }}>
                      Salesman
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: colors.gray[700] }}>
                      Region
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: colors.gray[700] }}>
                      Area
                    </th>
                    <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: colors.gray[700] }}>
                      Sales
                    </th>
                    <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: colors.gray[700] }}>
                      Total Orders
                    </th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: colors.gray[700] }}>
                      Visits<br/>
                      <span style={{ fontSize: '11px', fontWeight: '400', color: colors.gray[500] }}>
                        (Productive/Total)
                      </span>
                    </th>
                    <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: colors.gray[700] }}>
                      Unique<br/>Customers
                    </th>
                    <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: colors.gray[700] }}>
                      Productivity<br/>
                      <span style={{ fontSize: '11px', fontWeight: '400', color: colors.gray[500] }}>
                        (% Productive)
                      </span>
                    </th>
                    <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: colors.gray[700] }}>
                      Target %
                    </th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: colors.gray[700] }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((route, index) => (
                    <tr key={route.routeCode} style={{ 
                      borderBottom: `1px solid ${colors.gray[100]}`,
                      backgroundColor: index % 2 === 0 ? 'transparent' : colors.background.secondary
                    }}>
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500', color: colors.primary[600] }}>
                        {route.routeCode}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: colors.gray[700] }}>
                        {route.salesman}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: colors.gray[600] }}>
                        {route.region}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: colors.gray[600] }}>
                        {route.area}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: colors.gray[900] }}>
                        ${(route.sales / 1000).toFixed(1)}k
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: colors.gray[700] }}>
                        {route.orders}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px', color: colors.gray[700] }}>
                        <span style={{ color: colors.success.main, fontWeight: '500' }}>{route.productiveVisits}</span>
                        <span style={{ color: colors.gray[400] }}>/</span>
                        <span>{route.totalVisits}</span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: colors.gray[700] }}>
                        {route.uniqueCustomers}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: route.productivity >= 80 ? colors.success.light : colors.warning.light,
                          color: route.productivity >= 80 ? colors.success.dark : colors.warning.dark,
                          fontWeight: '500'
                        }}>
                          {route.productivity}%
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: route.targetAchievement >= 100 ? colors.success.light : colors.error.light,
                          color: route.targetAchievement >= 100 ? colors.success.dark : colors.error.dark,
                          fontWeight: '500'
                        }}>
                          {route.targetAchievement}%
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => setSelectedSalesman({ id: route.routeCode, name: route.salesman })}
                          style={{
                            padding: '4px 12px',
                            borderRadius: '4px',
                            border: `1px solid ${colors.primary[500]}`,
                            backgroundColor: 'transparent',
                            color: colors.primary[500],
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          View Orders
                        </button>
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
                    fontSize: '14px'
                  }}
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum = i + 1
                  if (currentPage > 3) {
                    pageNum = currentPage - 2 + i
                  }
                  if (pageNum > totalPages) return null
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: `1px solid ${pageNum === currentPage ? colors.primary[500] : colors.gray[300]}`,
                        backgroundColor: pageNum === currentPage ? colors.primary[500] : 'white',
                        color: pageNum === currentPage ? 'white' : colors.gray[700],
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: pageNum === currentPage ? '600' : '400'
                      }}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                
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
                    fontSize: '14px'
                  }}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Export Button */}
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                onClick={() => alert('Export functionality would download CSV/Excel file')}
                style={{
                  padding: '10px 20px',
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
    </div>
  )
}