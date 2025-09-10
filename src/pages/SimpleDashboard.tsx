import React, { useEffect, useState } from 'react'

export const SimpleDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('SimpleDashboard mounted')
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) {
    return <div>Loading simple dashboard...</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>SFA Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px' }}>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Today's Sales</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>$125,420</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Orders</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>1,245</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Customers</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>892</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Growth</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'green' }}>+12.5%</p>
        </div>
      </div>
    </div>
  )
}