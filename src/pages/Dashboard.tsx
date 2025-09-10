import React, { useEffect, useState, useMemo } from 'react'
import { KPICards } from '@/components/dashboard/KPICards'
import { SalesChart } from '@/components/dashboard/SalesChart'
// import { FilterBar } from '@/components/dashboard/FilterBar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { dataService } from '@/services/dataService'
import type { DashboardKPI, SalesTrendData, Customer, Product, Transaction, FilterOptions } from '@/types'
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils'
import { ArrowUpRight, Package, ShoppingCart, RefreshCw } from 'lucide-react'

export const Dashboard: React.FC = () => {
  const [kpiData, setKpiData] = useState<DashboardKPI | null>(null)
  const [salesTrend, setSalesTrend] = useState<SalesTrendData[]>([])
  const [topCustomers, setTopCustomers] = useState<Customer[]>([])
  const [topProducts, setTopProducts] = useState<Product[]>([])
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const [allCustomers, setAllCustomers] = useState<Customer[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filters, setFilters] = useState<Partial<FilterOptions>>({})
  const [searchTerm, setSearchTerm] = useState('')

  const loadDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)

      const [kpis, trend, customers, products, transactions] = await Promise.all([
        dataService.getDashboardKPIs(),
        dataService.getSalesTrend(30),
        dataService.getCustomers(filters),
        dataService.getProducts(filters),
        dataService.getTransactions(filters)
      ])

      setKpiData(kpis)
      setSalesTrend(trend)
      setAllCustomers(customers)
      setAllProducts(products)
      setAllTransactions(transactions)
      
      // Set top items from filtered data
      const sortedCustomers = [...customers].sort((a, b) => b.totalSales - a.totalSales)
      const sortedProducts = [...products].sort((a, b) => b.totalRevenue - a.totalRevenue)
      
      setTopCustomers(sortedCustomers.slice(0, 5))
      setTopProducts(sortedProducts.slice(0, 5))
      setRecentTransactions(transactions.slice(0, 5))
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Reload data when filters change
  useEffect(() => {
    loadDashboardData()
  }, [filters])

  // Apply search filtering on the client side
  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return topCustomers
    
    return topCustomers.filter(customer =>
      customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.routeName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [topCustomers, searchTerm])

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return topProducts
    
    return topProducts.filter(product =>
      product.itemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [topProducts, searchTerm])

  const filteredTransactions = useMemo(() => {
    if (!searchTerm) return recentTransactions
    
    return recentTransactions.filter(transaction =>
      transaction.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.trxCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.clientCode.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [recentTransactions, searchTerm])

  useEffect(() => {
    // Initial load
    loadDashboardData()
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      loadDashboardData(true)
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    loadDashboardData(true)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-gray-500">
            Welcome back! Here's your sales performance overview.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm">
            Download Report
          </Button>
        </div>
      </div>

      {/* Filter Bar - temporarily disabled */}
      {/* <FilterBar 
        onFilterChange={setFilters}
        onSearchChange={setSearchTerm}
        className="mb-6"
      /> */}

      {/* KPI Cards */}
      {kpiData && (
        <KPICards data={kpiData} loading={loading} />
      )}

      {/* Sales Chart */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <SalesChart data={salesTrend} loading={loading} />
        </div>

        {/* Top Customers */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Top Customers</CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <CardDescription>
                Your best performing customers this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 animate-pulse rounded" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredCustomers.map((customer, index) => (
                    <div key={customer.customerCode} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {customer.customerName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {customer.routeName} • {customer.customerType}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatCurrency(customer.totalSales)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {customer.totalOrders} orders
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Row - Products and Recent Transactions */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Products</CardTitle>
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <CardDescription>
              Best selling products by revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <div key={product.itemCode} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Package className="h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">
                          {product.itemDescription}
                        </p>
                        <p className="text-sm text-gray-500">
                          {product.category} • {product.brand}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatCurrency(product.totalRevenue)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatNumber(product.totalQuantitySold)} units
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <CardDescription>
              Latest sales activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.trxCode} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ShoppingCart className="h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">
                          {transaction.clientName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.trxCode} • {formatDate(transaction.trxDate)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatCurrency(transaction.totalAmount)}
                      </p>
                      <div className="flex items-center justify-end">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          transaction.status === 5 ? 'bg-green-100 text-green-700' :
                          transaction.status === 4 ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {transaction.status === 5 ? 'Paid' :
                           transaction.status === 4 ? 'Invoiced' :
                           'Delivered'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}