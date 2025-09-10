import React, { useState, useEffect } from 'react'
import { colors } from '../styles/colors'

interface JourneyMapProps {
  salesmen: any[]
  selectedSalesman: string
  date: string
}

// Generate mock GPS locations for salesmen
const generateSalesmanLocations = (salesmen: any[]) => {
  // Dubai coordinates as base
  const baseLatInclusive = 25.2048
  const baseLng = 55.2708
  
  return salesmen.map(sm => ({
    ...sm,
    lat: baseLatInclusive + (Math.random() - 0.5) * 0.2,
    lng: baseLng + (Math.random() - 0.5) * 0.3,
    currentCustomer: Math.random() > 0.5 ? `Customer ${Math.floor(Math.random() * 100)}` : null,
    lastUpdate: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString()
  }))
}

// Generate customer locations
const generateCustomerLocations = () => {
  const baseLatExclusive = 25.2048
  const baseLng = 55.2708
  const customers = []
  
  for (let i = 0; i < 50; i++) {
    customers.push({
      id: `C${i}`,
      name: `Customer ${i}`,
      lat: baseLatExclusive + (Math.random() - 0.5) * 0.2,
      lng: baseLng + (Math.random() - 0.5) * 0.3,
      type: ['Modern Trade', 'Traditional', 'HORECA'][Math.floor(Math.random() * 3)],
      visited: Math.random() > 0.5
    })
  }
  return customers
}

export const JourneyMap: React.FC<JourneyMapProps> = ({ salesmen, selectedSalesman, date }) => {
  const [salesmanLocations, setSalesmanLocations] = useState(generateSalesmanLocations(salesmen))
  const [customerLocations] = useState(generateCustomerLocations())
  const [selectedMarker, setSelectedMarker] = useState<any>(null)
  const [mapView, setMapView] = useState<'map' | 'list'>('map')
  
  // Simulate real-time location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSalesmanLocations(prev => prev.map(sm => ({
        ...sm,
        lat: sm.lat + (Math.random() - 0.5) * 0.001,
        lng: sm.lng + (Math.random() - 0.5) * 0.001,
        lastUpdate: new Date().toLocaleTimeString()
      })))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return colors.success.main
      case 'idle': return colors.warning.main
      case 'break': return colors.error.main
      default: return colors.gray[400]
    }
  }
  
  const filteredSalesmen = selectedSalesman === 'all' 
    ? salesmanLocations 
    : salesmanLocations.filter(sm => sm.id === selectedSalesman)
  
  return (
    <div>
      {/* Map Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setMapView('map')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: `1px solid ${mapView === 'map' ? colors.primary[500] : colors.gray[300]}`,
              backgroundColor: mapView === 'map' ? colors.primary[50] : colors.background.primary,
              color: mapView === 'map' ? colors.primary[600] : colors.gray[600],
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Map View
          </button>
          <button
            onClick={() => setMapView('list')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: `1px solid ${mapView === 'list' ? colors.primary[500] : colors.gray[300]}`,
              backgroundColor: mapView === 'list' ? colors.primary[50] : colors.background.primary,
              color: mapView === 'list' ? colors.primary[600] : colors.gray[600],
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            List View
          </button>
        </div>
        
        {/* Legend */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: colors.success.main }} />
            <span style={{ fontSize: '12px', color: colors.gray[600] }}>At Customer</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: colors.primary[500] }} />
            <span style={{ fontSize: '12px', color: colors.gray[600] }}>Traveling</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: colors.warning.main }} />
            <span style={{ fontSize: '12px', color: colors.gray[600] }}>Idle</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: colors.gray[300] }} />
            <span style={{ fontSize: '12px', color: colors.gray[600] }}>Customer</span>
          </div>
        </div>
      </div>
      
      {mapView === 'map' ? (
        <>
          {/* Simulated Map View */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '500px',
            backgroundColor: '#f0f4f8',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundImage: `
              repeating-linear-gradient(0deg, ${colors.gray[200]} 0px, transparent 1px, transparent 40px, ${colors.gray[200]} 41px),
              repeating-linear-gradient(90deg, ${colors.gray[200]} 0px, transparent 1px, transparent 40px, ${colors.gray[200]} 41px)
            `
          }}>
            {/* Map Base Layer - Simulated */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '48px',
              color: colors.gray[300],
              fontWeight: '300',
              userSelect: 'none'
            }}>
              Dubai Map Area
            </div>
            
            {/* Customer Markers */}
            {customerLocations.map(customer => (
              <div
                key={customer.id}
                style={{
                  position: 'absolute',
                  top: `${50 + (customer.lat - 25.2048) * 500}%`,
                  left: `${50 + (customer.lng - 55.2708) * 300}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '20px',
                  height: '20px',
                  backgroundColor: customer.visited ? colors.success.light : colors.gray[300],
                  border: `2px solid ${customer.visited ? colors.success.main : colors.gray[400]}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  zIndex: 1,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.2)'
                  setSelectedMarker(customer)
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'
                  setSelectedMarker(null)
                }}
              />
            ))}
            
            {/* Salesman Markers */}
            {filteredSalesmen.map(salesman => (
              <div
                key={salesman.id}
                style={{
                  position: 'absolute',
                  top: `${50 + (salesman.lat - 25.2048) * 500}%`,
                  left: `${50 + (salesman.lng - 55.2708) * 300}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                  transition: 'all 0.3s ease-out'
                }}
              >
                {/* Pulse Animation */}
                <div style={{
                  position: 'absolute',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(salesman.status),
                  opacity: 0.3,
                  animation: 'mapPulse 2s infinite',
                  transform: 'translate(-50%, -50%)',
                  top: '50%',
                  left: '50%'
                }} />
                
                {/* Main Marker */}
                <div style={{
                  position: 'relative',
                  width: '30px',
                  height: '30px',
                  backgroundColor: getStatusColor(salesman.status),
                  borderRadius: '50%',
                  border: '3px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={() => setSelectedMarker(salesman)}
                onMouseLeave={() => setSelectedMarker(null)}
                >
                  <span style={{ fontSize: '12px', color: 'white', fontWeight: '700' }}>
                    {salesman.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                {/* Direction Arrow */}
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%) rotate(45deg)',
                  width: '0',
                  height: '0',
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: `8px solid ${getStatusColor(salesman.status)}`
                }} />
              </div>
            ))}
            
            {/* Info Tooltip */}
            {selectedMarker && (
              <div style={{
                position: 'absolute',
                top: `${50 + (selectedMarker.lat - 25.2048) * 500 - 10}%`,
                left: `${50 + (selectedMarker.lng - 55.2708) * 300}%`,
                transform: 'translateX(-50%)',
                backgroundColor: colors.gray[900],
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                zIndex: 20,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                <div style={{ fontWeight: '600' }}>{selectedMarker.name}</div>
                {selectedMarker.route && (
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>{selectedMarker.route}</div>
                )}
                {selectedMarker.currentCustomer && (
                  <div style={{ fontSize: '11px', color: colors.success.light }}>
                    At: {selectedMarker.currentCustomer}
                  </div>
                )}
                {selectedMarker.lastUpdate && (
                  <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '4px' }}>
                    Last update: {selectedMarker.lastUpdate}
                  </div>
                )}
                {selectedMarker.type && (
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>{selectedMarker.type}</div>
                )}
              </div>
            )}
          </div>
          
          {/* Route Statistics */}
          <div style={{
            marginTop: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {filteredSalesmen.map(salesman => (
              <div key={salesman.id} style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: colors.background.secondary,
                border: `1px solid ${colors.gray[200]}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray[800] }}>
                    {salesman.name}
                  </span>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(salesman.status)
                  }} />
                </div>
                <div style={{ fontSize: '11px', color: colors.gray[600] }}>
                  <div>Route: {salesman.route}</div>
                  <div>Status: {salesman.status === 'active' ? 'Active' : salesman.status}</div>
                  {salesman.currentCustomer && (
                    <div>Current: {salesman.currentCustomer}</div>
                  )}
                  <div>Updated: {salesman.lastUpdate}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* List View */
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${colors.gray[200]}` }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: colors.gray[500], fontWeight: '600' }}>
                  Salesman
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: colors.gray[500], fontWeight: '600' }}>
                  Route
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: colors.gray[500], fontWeight: '600' }}>
                  Status
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: colors.gray[500], fontWeight: '600' }}>
                  Current Location
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: colors.gray[500], fontWeight: '600' }}>
                  Last Update
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: colors.gray[500], fontWeight: '600' }}>
                  Distance Today
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: colors.gray[500], fontWeight: '600' }}>
                  Visits
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSalesmen.map(salesman => (
                <tr key={salesman.id} style={{ borderBottom: `1px solid ${colors.gray[100]}` }}>
                  <td style={{ padding: '12px', fontSize: '13px', color: colors.gray[700] }}>
                    {salesman.name}
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px', color: colors.gray[600] }}>
                    {salesman.route}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: salesman.status === 'active' ? colors.success.light : 
                                     salesman.status === 'idle' ? colors.warning.light : colors.error.light,
                      fontSize: '12px',
                      fontWeight: '500',
                      color: salesman.status === 'active' ? colors.success.dark : 
                             salesman.status === 'idle' ? colors.warning.dark : colors.error.dark
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(salesman.status)
                      }} />
                      {salesman.status === 'active' ? 'Active' : 
                       salesman.status === 'idle' ? 'Idle' : 'Break'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px', color: colors.gray[700] }}>
                    {salesman.currentCustomer || 'In Transit'}
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px', color: colors.gray[600] }}>
                    {salesman.lastUpdate}
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px', color: colors.gray[700] }}>
                    {Math.floor(Math.random() * 50 + 10)} km
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px', color: colors.gray[700] }}>
                    {Math.floor(Math.random() * 10 + 3)}/{Math.floor(Math.random() * 5 + 12)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* CSS for animations */}
      <style>{`
        @keyframes mapPulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}