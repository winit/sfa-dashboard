import React, { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { colors, CHART_COLORS } from '../styles/colors'
import { ProductScorecard } from '../components/ProductScorecard'

// Generate mock product hierarchy data (simulating thousands of products)
const generateProductsData = () => {
  // 8-Level Product Hierarchy as per database
  const level1 = ['Food', 'Beverages', 'Personal Care', 'Home Care', 'Health & Wellness']
  const level2 = ['Packaged Foods', 'Fresh Foods', 'Frozen Foods', 'Dairy', 'Bakery']
  const level3 = ['Snacks', 'Confectionery', 'Breakfast', 'Ready Meals', 'Condiments']
  const level4 = ['Chips', 'Cookies', 'Chocolates', 'Candies', 'Nuts']
  const level5 = ['Sweet', 'Salty', 'Spicy', 'Mixed', 'Plain']
  const level6 = ['Premium', 'Standard', 'Economy', 'Value', 'Bulk']
  const level7 = ['Small Pack', 'Medium Pack', 'Large Pack', 'Family Pack', 'Institutional']
  const level8 = ['Local', 'Regional', 'National', 'International', 'Private Label']
  
  const categories = ['Beverages', 'Snacks', 'Dairy', 'Personal Care', 'Confectionery', 'Bakery', 'Home Care']
  const brands = ['Coca-Cola', 'Pepsi', 'Nestle', 'Unilever', 'P&G', 'Mars', 'Mondelez', 'Kraft', 'General Mills', 'Kelloggs']
  const suppliers = ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D', 'Supplier E']
  const uoms = ['PCS', 'BOX', 'CTN', 'PAL', 'KG', 'LTR']
  
  const products = []
  
  // Generate 3000 products
  for (let i = 1; i <= 3000; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const brand = brands[Math.floor(Math.random() * brands.length)]
    
    // Different categories have different price ranges
    let basePrice = 5
    if (category === 'Personal Care') basePrice = 15
    else if (category === 'Home Care') basePrice = 12
    else if (category === 'Beverages') basePrice = 3
    else if (category === 'Snacks') basePrice = 5
    
    const price = basePrice + Math.random() * basePrice
    const quantitySold = Math.floor(100 + Math.random() * 5000)
    const sales = price * quantitySold
    
    products.push({
      itemCode: `P${String(i).padStart(4, '0')}`,
      itemDescription: `${brand} ${category} Product ${i}`,
      itemGroupLevel1: level1[Math.floor(Math.random() * level1.length)],
      itemGroupLevel2: level2[Math.floor(Math.random() * level2.length)],
      itemGroupLevel3: level3[Math.floor(Math.random() * level3.length)],
      itemGroupLevel4: level4[Math.floor(Math.random() * level4.length)],
      itemGroupLevel5: level5[Math.floor(Math.random() * level5.length)],
      itemGroupLevel6: level6[Math.floor(Math.random() * level6.length)],
      itemGroupLevel7: level7[Math.floor(Math.random() * level7.length)],
      itemGroupLevel8: level8[Math.floor(Math.random() * level8.length)],
      categoryCode: category,
      brandCode: brand,
      supplierCode: suppliers[Math.floor(Math.random() * suppliers.length)],
      baseUOM: uoms[Math.floor(Math.random() * uoms.length)],
      barcode: `${Math.floor(Math.random() * 1000000000000)}`,
      price: price,
      cost: price * 0.7,
      margin: 30 + Math.random() * 20,
      taxPercentage: category === 'Food' ? 5 : 15,
      quantitySold: quantitySold,
      totalSales: sales,
      totalOrders: Math.floor(50 + Math.random() * 200),
      stockOnHand: Math.floor(Math.random() * 1000),
      reorderLevel: Math.floor(50 + Math.random() * 100),
      isActive: Math.random() > 0.1,
      isFastMoving: quantitySold > 2500,
      isSlowMoving: quantitySold < 500
    })
  }
  
  return products
}

const allProductsData = generateProductsData()

// Calculate category summary
const categorySummary = allProductsData.reduce((acc, product) => {
  if (!acc[product.categoryCode]) {
    acc[product.categoryCode] = { 
      category: product.categoryCode, 
      products: 0, 
      sales: 0,
      quantity: 0,
      avgMargin: 0
    }
  }
  acc[product.categoryCode].products += 1
  acc[product.categoryCode].sales += product.totalSales
  acc[product.categoryCode].quantity += product.quantitySold
  acc[product.categoryCode].avgMargin += product.margin
  return acc
}, {} as Record<string, any>)

const categoryData = Object.values(categorySummary).map((c: any) => ({
  ...c,
  avgMargin: Math.round(c.avgMargin / c.products)
}))

// Calculate brand performance
const brandSummary = allProductsData.reduce((acc, product) => {
  if (!acc[product.brandCode]) {
    acc[product.brandCode] = { 
      brand: product.brandCode, 
      products: 0, 
      sales: 0,
      quantity: 0
    }
  }
  acc[product.brandCode].products += 1
  acc[product.brandCode].sales += product.totalSales
  acc[product.brandCode].quantity += product.quantitySold
  return acc
}, {} as Record<string, any>)

const brandData = Object.values(brandSummary)
  .sort((a: any, b: any) => b.sales - a.sales)
  .slice(0, 10)

export const ScalableProductsReport: React.FC = () => {
  // Filters
  const [dateRange, setDateRange] = useState('last30days')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [brandFilter, setBrandFilter] = useState('all')
  const [supplierFilter, setSupplierFilter] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [level1Filter, setLevel1Filter] = useState('all')
  const [level2Filter, setLevel2Filter] = useState('all')
  const [movementFilter, setMovementFilter] = useState('all')
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'sales' | 'quantity' | 'margin' | 'stock'>('sales')
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'summary' | 'hierarchy' | 'detailed'>('summary')
  const itemsPerPage = 25
  
  // Filter products
  const filteredProducts = useMemo(() => {
    let products = [...allProductsData]
    
    // Search filter
    if (searchTerm) {
      products = products.filter(p => 
        p.itemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode.includes(searchTerm)
      )
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      products = products.filter(p => p.categoryCode === categoryFilter)
    }
    
    // Brand filter
    if (brandFilter !== 'all') {
      products = products.filter(p => p.brandCode === brandFilter)
    }
    
    // Supplier filter
    if (supplierFilter !== 'all') {
      products = products.filter(p => p.supplierCode === supplierFilter)
    }
    
    // Level 1 filter
    if (level1Filter !== 'all') {
      products = products.filter(p => p.itemGroupLevel1 === level1Filter)
    }
    
    // Level 2 filter
    if (level2Filter !== 'all') {
      products = products.filter(p => p.itemGroupLevel2 === level2Filter)
    }
    
    // Movement filter
    if (movementFilter === 'fast') {
      products = products.filter(p => p.isFastMoving)
    } else if (movementFilter === 'slow') {
      products = products.filter(p => p.isSlowMoving)
    } else if (movementFilter === 'normal') {
      products = products.filter(p => !p.isFastMoving && !p.isSlowMoving)
    }
    
    // Active filter
    if (activeFilter === 'active') {
      products = products.filter(p => p.isActive)
    } else if (activeFilter === 'inactive') {
      products = products.filter(p => !p.isActive)
    }
    
    // Sorting
    products.sort((a, b) => {
      let aVal: number = 0
      let bVal: number = 0
      
      switch(sortBy) {
        case 'sales':
          aVal = a.totalSales
          bVal = b.totalSales
          break
        case 'quantity':
          aVal = a.quantitySold
          bVal = b.quantitySold
          break
        case 'margin':
          aVal = a.margin
          bVal = b.margin
          break
        case 'stock':
          aVal = a.stockOnHand
          bVal = b.stockOnHand
          break
      }
      
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
    })
    
    return products
  }, [searchTerm, categoryFilter, brandFilter, supplierFilter, level1Filter, level2Filter, movementFilter, activeFilter, sortBy, sortOrder])
  
  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  
  // Summary statistics
  const summaryStats = useMemo(() => {
    const data = filteredProducts.length > 0 ? filteredProducts : allProductsData
    return {
      totalProducts: data.length,
      activeProducts: data.filter(p => p.isActive).length,
      totalSales: data.reduce((sum, p) => sum + p.totalSales, 0),
      totalQuantity: data.reduce((sum, p) => sum + p.quantitySold, 0),
      avgMargin: data.length > 0 ? 
        Math.round(data.reduce((sum, p) => sum + p.margin, 0) / data.length) : 0,
      fastMoving: data.filter(p => p.isFastMoving).length,
      slowMoving: data.filter(p => p.isSlowMoving).length,
      outOfStock: data.filter(p => p.stockOnHand === 0).length
    }
  }, [filteredProducts])
  
  // Hierarchy data for treemap
  const hierarchyData = useMemo(() => {
    const grouped = filteredProducts.reduce((acc, product) => {
      const key = product.itemGroupLevel1
      if (!acc[key]) {
        acc[key] = {
          name: key,
          value: 0,
          children: []
        }
      }
      acc[key].value += product.totalSales
      return acc
    }, {} as Record<string, any>)
    
    return Object.values(grouped)
  }, [filteredProducts])
  
  return (
    <div style={{ padding: '24px', backgroundColor: colors.background.secondary, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: colors.gray[900] }}>
              Product Analysis
            </h1>
            <p style={{ color: colors.gray[500], fontSize: '15px' }}>
              Analyzing {summaryStats.totalProducts.toLocaleString()} products across all categories and brands
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '14px',
          borderRadius: '8px',
          border: `1px solid ${colors.gray[200]}`,
        }}>
          <div style={{ fontSize: '11px', color: colors.gray[500], marginBottom: '4px' }}>Total Products</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: colors.gray[900] }}>
            {summaryStats.totalProducts.toLocaleString()}
          </div>
          <div style={{ fontSize: '10px', color: colors.success.main }}>
            {summaryStats.activeProducts} active
          </div>
        </div>
        
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '14px',
          borderRadius: '8px',
          border: `1px solid ${colors.gray[200]}`,
        }}>
          <div style={{ fontSize: '11px', color: colors.gray[500], marginBottom: '4px' }}>Total Sales</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: colors.gray[900] }}>
            ${(summaryStats.totalSales / 1000000).toFixed(1)}M
          </div>
        </div>
        
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '14px',
          borderRadius: '8px',
          border: `1px solid ${colors.gray[200]}`,
        }}>
          <div style={{ fontSize: '11px', color: colors.gray[500], marginBottom: '4px' }}>Units Sold</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: colors.gray[900] }}>
            {(summaryStats.totalQuantity / 1000).toFixed(0)}K
          </div>
        </div>
        
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '14px',
          borderRadius: '8px',
          border: `1px solid ${colors.gray[200]}`,
        }}>
          <div style={{ fontSize: '11px', color: colors.gray[500], marginBottom: '4px' }}>Avg Margin</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: colors.gray[900] }}>
            {summaryStats.avgMargin}%
          </div>
        </div>
        
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '14px',
          borderRadius: '8px',
          border: `1px solid ${colors.gray[200]}`,
        }}>
          <div style={{ fontSize: '11px', color: colors.gray[500], marginBottom: '4px' }}>Fast Moving</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: colors.success.main }}>
            {summaryStats.fastMoving}
          </div>
        </div>
        
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '14px',
          borderRadius: '8px',
          border: `1px solid ${colors.gray[200]}`,
        }}>
          <div style={{ fontSize: '11px', color: colors.gray[500], marginBottom: '4px' }}>Slow Moving</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: colors.warning.main }}>
            {summaryStats.slowMoving}
          </div>
        </div>
        
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '14px',
          borderRadius: '8px',
          border: `1px solid ${colors.gray[200]}`,
        }}>
          <div style={{ fontSize: '11px', color: colors.gray[500], marginBottom: '4px' }}>Out of Stock</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: colors.error.main }}>
            {summaryStats.outOfStock}
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
            fontSize: '13px'
          }}
        >
          Summary
        </button>
        <button
          onClick={() => setViewMode('hierarchy')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: viewMode === 'hierarchy' ? colors.primary[500] : 'transparent',
            color: viewMode === 'hierarchy' ? 'white' : colors.gray[600],
            fontWeight: '500',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          Hierarchy View
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
            fontSize: '13px'
          }}
        >
          Detailed List
        </button>
      </div>
      
      {viewMode === 'summary' && (
        <>
          {/* Category and Brand Performance */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div style={{
              backgroundColor: colors.background.primary,
              padding: '24px',
              borderRadius: '12px',
              border: `1px solid ${colors.gray[200]}`
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
                Sales by Category
              </h2>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[200]} />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} stroke={colors.gray[400]} tick={{ fill: colors.gray[500], fontSize: 11 }} />
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
              <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
                Top 10 Brands
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {brandData.map((brand: any, index) => (
                  <div key={brand.brand} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px',
                    backgroundColor: index === 0 ? colors.primary[50] : colors.background.secondary,
                    borderRadius: '6px',
                    borderLeft: `3px solid ${CHART_COLORS[index % CHART_COLORS.length]}`
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: colors.gray[800] }}>
                        {brand.brand}
                      </div>
                      <div style={{ fontSize: '11px', color: colors.gray[500] }}>
                        {brand.products} products • {(brand.quantity / 1000).toFixed(0)}k units
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray[900] }}>
                      ${(brand.sales / 1000).toFixed(0)}k
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      
      {viewMode === 'hierarchy' && (
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '24px',
          borderRadius: '12px',
          border: `1px solid ${colors.gray[200]}`,
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
            Product Hierarchy Analysis (8-Level Structure)
          </h2>
          
          {/* Hierarchy Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '11px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                Level 1
              </label>
              <select
                value={level1Filter}
                onChange={(e) => {
                  setLevel1Filter(e.target.value)
                  setLevel2Filter('all')
                }}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.gray[300]}`,
                  fontSize: '12px',
                  backgroundColor: 'white'
                }}
              >
                <option value="all">All Level 1</option>
                {['Food', 'Beverages', 'Personal Care', 'Home Care', 'Health & Wellness'].map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ fontSize: '11px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                Level 2
              </label>
              <select
                value={level2Filter}
                onChange={(e) => setLevel2Filter(e.target.value)}
                disabled={level1Filter === 'all'}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.gray[300]}`,
                  fontSize: '12px',
                  backgroundColor: level1Filter === 'all' ? colors.gray[50] : 'white',
                  cursor: level1Filter === 'all' ? 'not-allowed' : 'pointer'
                }}
              >
                <option value="all">All Level 2</option>
                {['Packaged Foods', 'Fresh Foods', 'Frozen Foods', 'Dairy', 'Bakery'].map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Hierarchy Tree Visualization */}
          <div style={{ 
            padding: '16px',
            backgroundColor: colors.background.secondary,
            borderRadius: '8px',
            minHeight: '400px'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: colors.gray[800] }}>
              Product Distribution by Hierarchy
            </div>
            {hierarchyData.map((level1, idx) => (
              <div key={level1.name} style={{
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: colors.background.primary,
                borderRadius: '6px',
                borderLeft: `4px solid ${CHART_COLORS[idx % CHART_COLORS.length]}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray[800] }}>
                      {level1.name}
                    </div>
                    <div style={{ fontSize: '12px', color: colors.gray[500] }}>
                      Level 1 Category
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: colors.gray[900] }}>
                      ${(level1.value / 1000).toFixed(0)}k
                    </div>
                    <div style={{ fontSize: '11px', color: colors.gray[500] }}>
                      {((level1.value / summaryStats.totalSales) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {viewMode === 'detailed' && (
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '20px',
          borderRadius: '12px',
          border: `1px solid ${colors.gray[200]}`,
          marginBottom: '20px'
        }}>
          {/* Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '11px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                Search Product
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Name, code, barcode..."
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.gray[300]}`,
                  fontSize: '12px'
                }}
              />
            </div>
            
            <div>
              <label style={{ fontSize: '11px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value)
                  setCurrentPage(1)
                }}
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.gray[300]}`,
                  fontSize: '12px',
                  backgroundColor: 'white'
                }}
              >
                <option value="all">All Categories</option>
                {['Beverages', 'Snacks', 'Dairy', 'Personal Care', 'Confectionery', 'Bakery', 'Home Care'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ fontSize: '11px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                Brand
              </label>
              <select
                value={brandFilter}
                onChange={(e) => {
                  setBrandFilter(e.target.value)
                  setCurrentPage(1)
                }}
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.gray[300]}`,
                  fontSize: '12px',
                  backgroundColor: 'white'
                }}
              >
                <option value="all">All Brands</option>
                {['Coca-Cola', 'Pepsi', 'Nestle', 'Unilever', 'P&G', 'Mars', 'Mondelez', 'Kraft'].map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ fontSize: '11px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                Movement
              </label>
              <select
                value={movementFilter}
                onChange={(e) => {
                  setMovementFilter(e.target.value)
                  setCurrentPage(1)
                }}
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.gray[300]}`,
                  fontSize: '12px',
                  backgroundColor: 'white'
                }}
              >
                <option value="all">All Products</option>
                <option value="fast">Fast Moving</option>
                <option value="slow">Slow Moving</option>
                <option value="normal">Normal</option>
              </select>
            </div>
            
            <div>
              <label style={{ fontSize: '11px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.gray[300]}`,
                  fontSize: '12px',
                  backgroundColor: 'white'
                }}
              >
                <option value="sales">Sales</option>
                <option value="quantity">Quantity</option>
                <option value="margin">Margin</option>
                <option value="stock">Stock</option>
              </select>
            </div>
          </div>
          
          {/* Results Summary */}
          <div style={{ 
            padding: '10px', 
            backgroundColor: colors.background.secondary, 
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            <span style={{ color: colors.gray[600], fontSize: '13px' }}>
              Showing {paginatedProducts.length} of {filteredProducts.length} products
              {searchTerm && ` matching "${searchTerm}"`}
            </span>
          </div>
          
          {/* Product Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${colors.gray[200]}` }}>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: colors.gray[700] }}>
                    Item Code
                  </th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: colors.gray[700] }}>
                    Description
                  </th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: colors.gray[700] }}>
                    Category
                  </th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: colors.gray[700] }}>
                    Brand
                  </th>
                  <th style={{ padding: '8px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: colors.gray[700] }}>
                    Sales
                  </th>
                  <th style={{ padding: '8px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: colors.gray[700] }}>
                    Qty Sold
                  </th>
                  <th style={{ padding: '8px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: colors.gray[700] }}>
                    Price
                  </th>
                  <th style={{ padding: '8px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: colors.gray[700] }}>
                    Margin %
                  </th>
                  <th style={{ padding: '8px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: colors.gray[700] }}>
                    Stock
                  </th>
                  <th style={{ padding: '8px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: colors.gray[700] }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product, index) => (
                  <tr key={product.itemCode} style={{ 
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
                  onClick={() => setSelectedProduct(product)}>
                    <td style={{ padding: '8px', fontSize: '12px', fontWeight: '500', color: colors.primary[600] }}>
                      {product.itemCode}
                    </td>
                    <td style={{ padding: '8px', fontSize: '12px', color: colors.gray[700] }}>
                      <div>{product.itemDescription}</div>
                      <div style={{ fontSize: '10px', color: colors.gray[500] }}>{product.barcode}</div>
                    </td>
                    <td style={{ padding: '8px', fontSize: '12px', color: colors.gray[600] }}>
                      {product.categoryCode}
                    </td>
                    <td style={{ padding: '8px', fontSize: '12px', color: colors.gray[600] }}>
                      {product.brandCode}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: colors.gray[900] }}>
                      ${(product.totalSales / 1000).toFixed(1)}k
                    </td>
                    <td style={{ padding: '8px', textAlign: 'right', fontSize: '12px', color: colors.gray[700] }}>
                      {product.quantitySold.toLocaleString()}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'right', fontSize: '12px', color: colors.gray[700] }}>
                      ${product.price.toFixed(2)}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'right', fontSize: '12px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: product.margin > 35 ? colors.success.light : colors.warning.light,
                        color: product.margin > 35 ? colors.success.dark : colors.warning.dark,
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        {product.margin.toFixed(0)}%
                      </span>
                    </td>
                    <td style={{ padding: '8px', textAlign: 'right', fontSize: '12px' }}>
                      <span style={{
                        color: product.stockOnHand < product.reorderLevel ? colors.error.main : colors.gray[700],
                        fontWeight: product.stockOnHand < product.reorderLevel ? '600' : '400'
                      }}>
                        {product.stockOnHand}
                      </span>
                    </td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>
                      {product.isFastMoving && (
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: colors.success.light,
                          color: colors.success.dark,
                          fontSize: '10px',
                          fontWeight: '500'
                        }}>
                          Fast
                        </span>
                      )}
                      {product.isSlowMoving && (
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: colors.warning.light,
                          color: colors.warning.dark,
                          fontSize: '10px',
                          fontWeight: '500'
                        }}>
                          Slow
                        </span>
                      )}
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
            padding: '12px',
            backgroundColor: colors.background.secondary,
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '13px', color: colors.gray[600] }}>
              Page {currentPage} of {totalPages}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.gray[300]}`,
                  backgroundColor: currentPage === 1 ? colors.gray[100] : 'white',
                  color: currentPage === 1 ? colors.gray[400] : colors.gray[700],
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '12px'
                }}
              >
                Previous
              </button>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.gray[300]}`,
                  backgroundColor: currentPage === totalPages ? colors.gray[100] : 'white',
                  color: currentPage === totalPages ? colors.gray[400] : colors.gray[700],
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '12px'
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Product Scorecard Modal */}
      {selectedProduct && (
        <ProductScorecard 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  )
}