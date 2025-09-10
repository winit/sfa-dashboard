import React from 'react'

export const SimpleTest = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>React is Working!</h1>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
      <button onClick={() => alert('Button clicked!')}>
        Click to test
      </button>
    </div>
  )
}