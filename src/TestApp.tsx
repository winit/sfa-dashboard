import React from 'react'

export const TestApp = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#3b82f6' }}>SFA Dashboard Loading Test</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ marginTop: '20px', padding: '10px', background: '#f3f4f6', borderRadius: '8px' }}>
        <p>✓ React App Loaded</p>
        <p>✓ Vite Server Running</p>
        <p>Loading main dashboard...</p>
      </div>
    </div>
  )
}