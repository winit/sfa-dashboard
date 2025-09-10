import React, { useState, useMemo } from 'react'
import { colors } from '../styles/colors'

// Generate mock orders data
const generateOrdersData = (salesmanId: string) => {
  const customers = ['Al Maya Supermarket', 'Carrefour', 'Lulu Hypermarket', 'Spinneys', 'Union Coop', 'Choithrams', 'West Zone', 'Nesto']
  const products = [
    { code: 'P001', name: 'Coca Cola 330ml', category: 'Beverages', price: 2.5 },
    { code: 'P002', name: 'Pepsi 500ml', category: 'Beverages', price: 3.0 },
    { code: 'P003', name: 'Red Bull 250ml', category: 'Beverages', price: 8.5 },
    { code: 'P004', name: 'Lays Classic', category: 'Snacks', price: 5.0 },
    { code: 'P005', name: 'Oreo Cookies', category: 'Snacks', price: 4.5 },
    { code: 'P006', name: 'Kit Kat', category: 'Confectionery', price: 3.5 },
    { code: 'P007', name: 'Dairy Milk', category: 'Confectionery', price: 4.0 },
    { code: 'P008', name: 'Aquafina 1L', category: 'Beverages', price: 1.5 },
    { code: 'P009', name: 'Sprite 2L', category: 'Beverages', price: 5.5 },
    { code: 'P010', name: 'Doritos Nacho', category: 'Snacks', price: 6.0 }
  ]
  
  const orders = []
  const today = new Date()
  
  // Generate 50-100 orders for the salesman
  const orderCount = Math.floor(50 + Math.random() * 50)
  
  for (let i = 1; i <= orderCount; i++) {
    const orderDate = new Date(today)
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30))
    
    const customer = customers[Math.floor(Math.random() * customers.length)]
    const lineItemCount = Math.floor(3 + Math.random() * 8) // 3-10 line items per order
    const lineItems = []
    let orderTotal = 0
    
    // Generate line items
    for (let j = 0; j < lineItemCount; j++) {
      const product = products[Math.floor(Math.random() * products.length)]
      const quantity = Math.floor(10 + Math.random() * 100)
      const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 15) : 0
      const lineTotal = quantity * product.price * (1 - discount / 100)
      
      lineItems.push({
        lineNo: j + 1,
        productCode: product.code,
        productName: product.name,
        category: product.category,
        quantity: quantity,
        unitPrice: product.price,
        discount: discount,
        lineTotal: lineTotal,
        uom: 'PCS',
        delivered: Math.random() > 0.1 // 90% delivered
      })
      
      orderTotal += lineTotal
    }
    
    // Determine order status
    const statusOptions = [
      { code: 5, name: 'Paid', color: colors.success.main },
      { code: 4, name: 'Invoiced', color: colors.info.main },
      { code: 3, name: 'Delivered', color: colors.warning.main },
      { code: 2, name: 'Approved', color: colors.chart.purple },
      { code: 1, name: 'Pending', color: colors.gray[500] }
    ]
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)]
    
    orders.push({
      orderCode: `ORD-2024-${String(i).padStart(5, '0')}`,
      invoiceNumber: status.code >= 4 ? `INV-2024-${String(i).padStart(5, '0')}` : '',
      customerCode: `C${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
      customerName: customer,
      orderDate: orderDate,
      deliveryDate: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000), // Next day
      status: status,
      paymentType: Math.random() > 0.5 ? 'Cash' : 'Credit',
      lineItems: lineItems,
      totalAmount: orderTotal,
      totalQuantity: lineItems.reduce((sum, item) => sum + item.quantity, 0),
      totalItems: lineItems.length
    })
  }
  
  return orders.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime())
}

interface SalesmanOrderDetailsProps {
  salesmanId?: string
  salesmanName?: string
  onBack?: () => void
}

export const SalesmanOrderDetails: React.FC<SalesmanOrderDetailsProps> = ({ 
  salesmanId = 'SM001', 
  salesmanName = 'Ahmed Hassan',
  onBack 
}) => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')
  
  // Generate mock data
  const allOrders = useMemo(() => generateOrdersData(salesmanId), [salesmanId])
  
  // Filter orders
  const filteredOrders = useMemo(() => {
    let orders = [...allOrders]
    
    // Search filter
    if (searchTerm) {
      orders = orders.filter(o => 
        o.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      orders = orders.filter(o => o.status.code === parseInt(statusFilter))
    }
    
    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date()
      const filterDate = new Date()
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0)
          orders = orders.filter(o => o.orderDate >= filterDate)
          break
        case 'week':
          filterDate.setDate(today.getDate() - 7)
          orders = orders.filter(o => o.orderDate >= filterDate)
          break
        case 'month':
          filterDate.setMonth(today.getMonth() - 1)
          orders = orders.filter(o => o.orderDate >= filterDate)
          break
      }
    }
    
    return orders
  }, [allOrders, searchTerm, statusFilter, dateFilter])
  
  // Calculate summary stats
  const summaryStats = useMemo(() => ({
    totalOrders: filteredOrders.length,
    totalSales: filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0),
    avgOrderValue: filteredOrders.length > 0 ? 
      filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0) / filteredOrders.length : 0,
    paidOrders: filteredOrders.filter(o => o.status.code === 5).length,
    pendingOrders: filteredOrders.filter(o => o.status.code < 3).length
  }), [filteredOrders])
  
  return (
    <div style={{ padding: '24px', backgroundColor: colors.background.secondary, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            {onBack && (
              <button
                onClick={onBack}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.gray[300]}`,
                  backgroundColor: 'white',
                  color: colors.gray[700],
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ← Back
              </button>
            )}
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: colors.gray[900] }}>
              Order Details
            </h1>
          </div>
          <p style={{ color: colors.gray[500], fontSize: '15px' }}>
            Salesman: <strong>{salesmanName}</strong> ({salesmanId}) • Showing {filteredOrders.length} orders
          </p>
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
          <div style={{ fontSize: '12px', color: colors.gray[500], marginBottom: '4px' }}>Total Orders</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: colors.gray[900] }}>
            {summaryStats.totalOrders}
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
            ${(summaryStats.totalSales / 1000).toFixed(1)}k
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
            ${summaryStats.avgOrderValue.toFixed(0)}
          </div>
        </div>
        
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '16px',
          borderRadius: '8px',
          border: `1px solid ${colors.gray[200]}`,
        }}>
          <div style={{ fontSize: '12px', color: colors.gray[500], marginBottom: '4px' }}>Paid Orders</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: colors.success.main }}>
            {summaryStats.paidOrders}
          </div>
        </div>
        
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '16px',
          borderRadius: '8px',
          border: `1px solid ${colors.gray[200]}`,
        }}>
          <div style={{ fontSize: '12px', color: colors.gray[500], marginBottom: '4px' }}>Pending</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: colors.warning.main }}>
            {summaryStats.pendingOrders}
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div style={{
        backgroundColor: colors.background.primary,
        padding: '16px',
        borderRadius: '8px',
        border: `1px solid ${colors.gray[200]}`,
        marginBottom: '20px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
              Search Orders
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Order #, Customer, Invoice..."
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '6px',
                border: `1px solid ${colors.gray[300]}`,
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '12px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '6px',
                border: `1px solid ${colors.gray[300]}`,
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="all">All Status</option>
              <option value="5">Paid</option>
              <option value="4">Invoiced</option>
              <option value="3">Delivered</option>
              <option value="2">Approved</option>
              <option value="1">Pending</option>
            </select>
          </div>
          
          <div>
            <label style={{ fontSize: '12px', color: colors.gray[600], display: 'block', marginBottom: '4px' }}>
              Date Range
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '6px',
                border: `1px solid ${colors.gray[300]}`,
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Orders List or Detail View */}
      {!selectedOrder ? (
        <div style={{
          backgroundColor: colors.background.primary,
          borderRadius: '8px',
          border: `1px solid ${colors.gray[200]}`,
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: colors.background.secondary, borderBottom: `2px solid ${colors.gray[200]}` }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: colors.gray[700] }}>
                    Order #
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: colors.gray[700] }}>
                    Date
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: colors.gray[700] }}>
                    Customer
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: colors.gray[700] }}>
                    Items
                  </th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: colors.gray[700] }}>
                    Total Amount
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: colors.gray[700] }}>
                    Payment
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: colors.gray[700] }}>
                    Status
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: colors.gray[700] }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={order.orderCode} style={{ 
                    borderBottom: `1px solid ${colors.gray[100]}`,
                    backgroundColor: index % 2 === 0 ? 'transparent' : colors.background.secondary,
                    cursor: 'pointer'
                  }}>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      <div style={{ fontWeight: '500', color: colors.primary[600] }}>
                        {order.orderCode}
                      </div>
                      {order.invoiceNumber && (
                        <div style={{ fontSize: '12px', color: colors.gray[500] }}>
                          {order.invoiceNumber}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', color: colors.gray[600] }}>
                      {order.orderDate.toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      <div style={{ color: colors.gray[700] }}>{order.customerName}</div>
                      <div style={{ fontSize: '12px', color: colors.gray[500] }}>{order.customerCode}</div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px', color: colors.gray[700] }}>
                      {order.totalItems}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: colors.gray[900] }}>
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: order.paymentType === 'Cash' ? colors.success.light : colors.info.light,
                        color: order.paymentType === 'Cash' ? colors.success.dark : colors.info.dark,
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {order.paymentType}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: `${order.status.color}20`,
                        color: order.status.color,
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {order.status.name}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '4px',
                          border: `1px solid ${colors.primary[500]}`,
                          backgroundColor: 'transparent',
                          color: colors.primary[500],
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Order Detail View
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '24px',
          borderRadius: '8px',
          border: `1px solid ${colors.gray[200]}`
        }}>
          {/* Order Header */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray[900], marginBottom: '4px' }}>
                  {selectedOrder.orderCode}
                </h2>
                {selectedOrder.invoiceNumber && (
                  <p style={{ fontSize: '14px', color: colors.gray[500] }}>
                    Invoice: {selectedOrder.invoiceNumber}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.gray[300]}`,
                  backgroundColor: 'white',
                  color: colors.gray[700],
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ← Back to List
              </button>
            </div>
            
            {/* Order Info Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px',
              padding: '16px',
              backgroundColor: colors.background.secondary,
              borderRadius: '8px'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: colors.gray[500], marginBottom: '4px' }}>Customer</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: colors.gray[800] }}>
                  {selectedOrder.customerName}
                </div>
                <div style={{ fontSize: '12px', color: colors.gray[500] }}>{selectedOrder.customerCode}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: colors.gray[500], marginBottom: '4px' }}>Order Date</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: colors.gray[800] }}>
                  {selectedOrder.orderDate.toLocaleDateString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: colors.gray[500], marginBottom: '4px' }}>Delivery Date</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: colors.gray[800] }}>
                  {selectedOrder.deliveryDate.toLocaleDateString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: colors.gray[500], marginBottom: '4px' }}>Payment Type</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: colors.gray[800] }}>
                  {selectedOrder.paymentType}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: colors.gray[500], marginBottom: '4px' }}>Status</div>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: `${selectedOrder.status.color}20`,
                  color: selectedOrder.status.color,
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {selectedOrder.status.name}
                </span>
              </div>
            </div>
          </div>
          
          {/* Line Items */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: colors.gray[800] }}>
              Order Line Items ({selectedOrder.lineItems.length} items)
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: colors.background.secondary, borderBottom: `2px solid ${colors.gray[200]}` }}>
                    <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: colors.gray[600] }}>
                      #
                    </th>
                    <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: colors.gray[600] }}>
                      Product Code
                    </th>
                    <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: colors.gray[600] }}>
                      Product Name
                    </th>
                    <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: colors.gray[600] }}>
                      Category
                    </th>
                    <th style={{ padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: colors.gray[600] }}>
                      Quantity
                    </th>
                    <th style={{ padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: colors.gray[600] }}>
                      UOM
                    </th>
                    <th style={{ padding: '8px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: colors.gray[600] }}>
                      Unit Price
                    </th>
                    <th style={{ padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: colors.gray[600] }}>
                      Discount %
                    </th>
                    <th style={{ padding: '8px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: colors.gray[600] }}>
                      Line Total
                    </th>
                    <th style={{ padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: colors.gray[600] }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.lineItems.map((item: any, index: number) => (
                    <tr key={item.lineNo} style={{ 
                      borderBottom: `1px solid ${colors.gray[100]}`,
                      backgroundColor: index % 2 === 0 ? 'transparent' : colors.background.secondary
                    }}>
                      <td style={{ padding: '8px', fontSize: '13px', color: colors.gray[600] }}>
                        {item.lineNo}
                      </td>
                      <td style={{ padding: '8px', fontSize: '13px', fontWeight: '500', color: colors.primary[600] }}>
                        {item.productCode}
                      </td>
                      <td style={{ padding: '8px', fontSize: '13px', color: colors.gray[700] }}>
                        {item.productName}
                      </td>
                      <td style={{ padding: '8px', fontSize: '13px', color: colors.gray[600] }}>
                        {item.category}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center', fontSize: '13px', fontWeight: '500', color: colors.gray[800] }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center', fontSize: '13px', color: colors.gray[600] }}>
                        {item.uom}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right', fontSize: '13px', color: colors.gray[700] }}>
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center', fontSize: '13px' }}>
                        {item.discount > 0 && (
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: colors.warning.light,
                            color: colors.warning.dark,
                            fontSize: '11px',
                            fontWeight: '500'
                          }}>
                            {item.discount}%
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: colors.gray[900] }}>
                        ${item.lineTotal.toFixed(2)}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center', fontSize: '13px' }}>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: item.delivered ? colors.success.light : colors.error.light,
                          color: item.delivered ? colors.success.dark : colors.error.dark,
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          {item.delivered ? 'Delivered' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: `2px solid ${colors.gray[200]}` }}>
                    <td colSpan={8} style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: colors.gray[700] }}>
                      Order Total:
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontSize: '16px', fontWeight: '700', color: colors.gray[900] }}>
                      ${selectedOrder.totalAmount.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: `1px solid ${colors.gray[300]}`,
                backgroundColor: 'white',
                color: colors.gray[700],
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Print Order
            </button>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: colors.primary[500],
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Export to Excel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}