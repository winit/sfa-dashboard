import { useState } from 'react'
import { colors } from './styles/colors'
import { WorkingDashboard } from './pages/WorkingDashboard'
import { SalesReports } from './pages/SalesReports'
import { ScalableSalesAnalysis } from './pages/ScalableSalesAnalysis'
import { ScalableCustomersReport } from './pages/ScalableCustomersReport'
import { ScalableProductsReport } from './pages/ScalableProductsReport'
import { FieldOperations } from './pages/FieldOperations'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  
  console.log('App component loaded, currentPage:', currentPage)
  
  return (
    <div>
      {/* Navigation Bar */}
      <div style={{ 
        backgroundColor: colors.background.primary, 
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${colors.gray[200]}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: colors.gray[900] }}>
            SFA Analytics
          </h1>
          <nav style={{ display: 'flex', gap: '24px' }}>
            <button
              onClick={() => setCurrentPage('dashboard')}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 16px',
                color: currentPage === 'dashboard' ? colors.primary[500] : colors.gray[500],
                fontWeight: currentPage === 'dashboard' ? '600' : '400',
                borderBottom: currentPage === 'dashboard' ? `2px solid ${colors.primary[500]}` : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('sales')}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 16px',
                color: currentPage === 'sales' ? colors.primary[500] : colors.gray[500],
                fontWeight: currentPage === 'sales' ? '600' : '400',
                borderBottom: currentPage === 'sales' ? `2px solid ${colors.primary[500]}` : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Sales Reports
            </button>
            <button
              onClick={() => setCurrentPage('analysis')}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 16px',
                color: currentPage === 'analysis' ? colors.primary[500] : colors.gray[500],
                fontWeight: currentPage === 'analysis' ? '600' : '400',
                borderBottom: currentPage === 'analysis' ? `2px solid ${colors.primary[500]}` : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Sales Analysis
            </button>
            <button
              onClick={() => setCurrentPage('field')}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 16px',
                color: currentPage === 'field' ? colors.primary[500] : colors.gray[500],
                fontWeight: currentPage === 'field' ? '600' : '400',
                borderBottom: currentPage === 'field' ? `2px solid ${colors.primary[500]}` : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Field Operations
            </button>
            <button
              onClick={() => setCurrentPage('customers')}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 16px',
                color: currentPage === 'customers' ? colors.primary[500] : colors.gray[500],
                fontWeight: currentPage === 'customers' ? '600' : '400',
                borderBottom: currentPage === 'customers' ? `2px solid ${colors.primary[500]}` : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Customers
            </button>
            <button
              onClick={() => setCurrentPage('products')}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 16px',
                color: currentPage === 'products' ? colors.primary[500] : colors.gray[500],
                fontWeight: currentPage === 'products' ? '600' : '400',
                borderBottom: currentPage === 'products' ? `2px solid ${colors.primary[500]}` : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Products
            </button>
          </nav>
        </div>
        <div style={{ fontSize: '14px', color: colors.gray[500] }}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Page Content */}
      {currentPage === 'dashboard' && <WorkingDashboard />}
      {currentPage === 'sales' && <SalesReports />}
      {currentPage === 'analysis' && <ScalableSalesAnalysis />}
      {currentPage === 'field' && <FieldOperations />}
      {currentPage === 'customers' && <ScalableCustomersReport />}
      {currentPage === 'products' && <ScalableProductsReport />}
    </div>
  )
}

export default App