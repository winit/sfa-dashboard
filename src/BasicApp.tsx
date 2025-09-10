import React from 'react'

function BasicApp() {
  return React.createElement('div', {
    style: { padding: '20px', fontFamily: 'sans-serif' }
  }, [
    React.createElement('h1', { key: '1' }, 'SFA Dashboard - Working!'),
    React.createElement('p', { key: '2' }, 'React is successfully rendering'),
    React.createElement('p', { key: '3' }, 'Time: ' + new Date().toLocaleTimeString())
  ])
}

export default BasicApp