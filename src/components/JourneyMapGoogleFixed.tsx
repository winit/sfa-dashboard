import React, { useState, useMemo, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api'
import { colors } from '../styles/colors'

interface JourneyMapGoogleProps {
  salesmen: any[]
  selectedSalesman: string
  date: string
}

const mapCenter = { lat: 25.2048, lng: 55.2708 }
const mapContainerStyle = { width: '100%', height: '600px', borderRadius: '8px' }

const generateJourneyWithTimeMotion = () => {
  const journey = []
  let currentTime = new Date()
  currentTime.setHours(8, 0, 0, 0)
  
  journey.push({
    id: 'start',
    type: 'start',
    location: { lat: 25.2048, lng: 55.2708 },
    time: new Date(currentTime),
    duration: 0,
    activity: 'Start of Day',
    color: colors.gray[500]
  })
  
  const locations = [
    { lat: 25.2148, lng: 55.2808, name: 'Customer A', productive: true },
    { lat: 25.1948, lng: 55.2908, name: 'Customer B', productive: false },
    { lat: 25.2248, lng: 55.2608, name: 'Customer C', productive: true },
    { lat: 25.2048, lng: 55.2508, name: 'Customer D', productive: true },
    { lat: 25.1848, lng: 55.2708, name: 'Customer E', productive: false }
  ]
  
  locations.forEach((loc, index) => {
    currentTime.setMinutes(currentTime.getMinutes() + 15)
    journey.push({
      id: `travel-${index}`,
      type: 'travel',
      location: loc,
      time: new Date(currentTime),
      duration: 15,
      activity: `Travel to ${loc.name}`,
      color: colors.primary[500]
    })
    
    currentTime.setMinutes(currentTime.getMinutes() + 30)
    journey.push({
      id: `customer-${index}`,
      type: 'customer',
      location: loc,
      time: new Date(currentTime),
      duration: 30,
      activity: `Visit ${loc.name}`,
      color: loc.productive ? colors.success.main : colors.warning.main,
      productive: loc.productive,
      customerName: loc.name,
      salesAmount: loc.productive ? Math.floor(Math.random() * 5000 + 1000) : 0
    })
    
    if (index === 2) {
      currentTime.setMinutes(currentTime.getMinutes() + 30)
      journey.push({
        id: 'break',
        type: 'break',
        location: loc,
        time: new Date(currentTime),
        duration: 30,
        activity: 'Lunch Break',
        color: colors.error.main
      })
    }
  })
  
  return journey
}

const generateCustomerLocations = () => {
  const customers = []
  for (let i = 0; i < 20; i++) {
    customers.push({
      id: `cust-${i}`,
      name: `Customer ${String.fromCharCode(65 + i)}`,
      position: {
        lat: 25.2048 + (Math.random() - 0.5) * 0.1,
        lng: 55.2708 + (Math.random() - 0.5) * 0.1
      },
      type: ['Key Account', 'Modern Trade', 'Traditional Trade', 'HORECA'][Math.floor(Math.random() * 4)],
      visited: Math.random() > 0.5
    })
  }
  return customers
}

export const JourneyMapGoogle: React.FC<JourneyMapGoogleProps> = ({ salesmen, selectedSalesman, date }) => {
  const [selectedMarker, setSelectedMarker] = useState<any>(null)
  const [showTimeMotion, setShowTimeMotion] = useState(true)
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  
  const journey = useMemo(() => generateJourneyWithTimeMotion(), [])
  const customerLocations = useMemo(() => generateCustomerLocations(), [])
  
  const salesmanPositions = salesmen.map(sm => ({
    ...sm,
    position: {
      lat: 25.2048 + (Math.random() - 0.5) * 0.08,
      lng: 55.2708 + (Math.random() - 0.5) * 0.08
    },
    status: ['active', 'idle', 'break'][Math.floor(Math.random() * 3)],
    currentCustomer: Math.random() > 0.5 ? customerLocations[Math.floor(Math.random() * customerLocations.length)].name : null
  }))
  
  useEffect(() => {
    if (isPlaying && currentTimeIndex < journey.length - 1) {
      const timer = setTimeout(() => {
        setCurrentTimeIndex(prev => prev + 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (currentTimeIndex >= journey.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, currentTimeIndex, journey.length])
  
  const routePath = journey.map(point => point.location)
  
  const getRouteSegments = () => {
    const segments = []
    for (let i = 0; i < journey.length - 1; i++) {
      segments.push({
        path: [journey[i].location, journey[i + 1].location],
        color: journey[i].color || colors.gray[400]
      })
    }
    return segments
  }
  
  const getMarkerIcon = (type: string, status?: string) => {
    if (typeof google === 'undefined' || !google.maps) {
      return undefined
    }
    
    switch(type) {
      case 'salesman':
        return {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: status === 'active' ? colors.success.main : 
                     status === 'idle' ? colors.warning.main : colors.error.main,
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2
        }
      case 'customer':
        return {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: colors.primary[500],
          fillOpacity: 0.8,
          strokeColor: 'white',
          strokeWeight: 1
        }
      default:
        return undefined
    }
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  
  useEffect(() => {
    console.log('JourneyMapGoogle component mounted')
    console.log('Google Maps API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'Missing')
    console.log('Window.google available?', typeof window !== 'undefined' && window.google ? 'Yes' : 'No')
  }, [apiKey])
  
  if (!apiKey) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: colors.background.secondary,
        borderRadius: '8px',
        border: `1px solid ${colors.gray[200]}`
      }}>
        <h3 style={{ color: colors.error.main, marginBottom: '10px' }}>Google Maps API Key Missing</h3>
        <p style={{ color: colors.gray[600] }}>Please add VITE_GOOGLE_MAPS_API_KEY to your .env file</p>
      </div>
    )
  }
  
  if (loadError) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: colors.background.secondary,
        borderRadius: '8px',
        border: `1px solid ${colors.gray[200]}`
      }}>
        <h3 style={{ color: colors.error.main, marginBottom: '10px' }}>Error Loading Google Maps</h3>
        <p style={{ color: colors.gray[600] }}>{loadError}</p>
        <p style={{ color: colors.gray[500], marginTop: '10px', fontSize: '12px' }}>
          Check browser console for more details
        </p>
      </div>
    )
  }
  
  return (
    <div>
      {/* Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        padding: '12px',
        backgroundColor: colors.background.secondary,
        borderRadius: '8px',
        border: `1px solid ${colors.gray[200]}`
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              backgroundColor: colors.primary[500],
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '13px'
            }}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'} Journey
          </button>
          
          <button
            onClick={() => setCurrentTimeIndex(0)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              backgroundColor: colors.gray[500],
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '13px'
            }}
          >
            ↺ Reset
          </button>
          
          <div style={{
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: colors.background.primary,
            border: `1px solid ${colors.gray[300]}`,
            fontSize: '13px',
            color: colors.gray[700]
          }}>
            {currentTimeIndex < journey.length ? 
              `${journey[currentTimeIndex].time.toLocaleTimeString()} - ${journey[currentTimeIndex].activity}` : 
              'Journey Complete'}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: colors.gray[700] }}>
            <input
              type="checkbox"
              checked={showTimeMotion}
              onChange={(e) => setShowTimeMotion(e.target.checked)}
            />
            Show Time Motion
          </label>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
        <div style={{
          padding: '12px',
          borderRadius: '6px',
          backgroundColor: colors.background.secondary,
          border: `1px solid ${colors.gray[200]}`
        }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: colors.primary[500] }}>
            {journey.filter(j => j.type === 'travel').reduce((sum, j) => sum + j.duration, 0)} min
          </div>
          <div style={{ fontSize: '11px', color: colors.gray[500] }}>Travel Time</div>
        </div>
        
        <div style={{
          padding: '12px',
          borderRadius: '6px',
          backgroundColor: colors.background.secondary,
          border: `1px solid ${colors.gray[200]}`
        }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: colors.gray[900] }}>
            {journey.filter(j => j.type === 'customer').reduce((sum, j) => sum + j.duration, 0)} min
          </div>
          <div style={{ fontSize: '11px', color: colors.gray[500] }}>At Customer</div>
        </div>
        
        <div style={{
          padding: '12px',
          borderRadius: '6px',
          backgroundColor: colors.background.secondary,
          border: `1px solid ${colors.gray[200]}`
        }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: colors.warning.main }}>
            {journey.filter(j => j.type === 'break').reduce((sum, j) => sum + j.duration, 0)} min
          </div>
          <div style={{ fontSize: '11px', color: colors.gray[500] }}>Break Time</div>
        </div>
        
        <div style={{
          padding: '12px',
          borderRadius: '6px',
          backgroundColor: colors.background.secondary,
          border: `1px solid ${colors.gray[200]}`
        }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: colors.gray[900] }}>
            ${journey.filter(j => j.salesAmount).reduce((sum, j) => sum + (j.salesAmount || 0), 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: colors.gray[500] }}>Total Sales</div>
        </div>
      </div>
      
      {/* Loading indicator */}
      {!mapLoaded && !loadError && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: colors.gray[700], marginBottom: '8px' }}>
              Loading Google Maps...
            </div>
            <div style={{ fontSize: '12px', color: colors.gray[500] }}>
              This may take a few seconds
            </div>
          </div>
        </div>
      )}
      
      {/* Google Map */}
      <div style={{ position: 'relative' }}>
        <LoadScript 
          googleMapsApiKey={apiKey}
          onLoad={() => {
            console.log('Google Maps loaded successfully')
            setMapLoaded(true)
          }}
          onError={(error) => {
            console.error('Error loading Google Maps:', error)
            setLoadError(error?.message || 'Failed to load Google Maps')
          }}
          libraries={['places', 'drawing', 'geometry']}
        >
          <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={12}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: true,
            streetViewControl: true,
            rotateControl: true,
            fullscreenControl: true
          }}
        >
          {/* Time Motion Overlay - Route Segments */}
          {showTimeMotion && getRouteSegments().map((segment, index) => (
            <Polyline
              key={`segment-${index}`}
              path={segment.path}
              options={{
                strokeColor: segment.color,
                strokeOpacity: 0.8,
                strokeWeight: 4
              }}
            />
          ))}
          
          {/* Journey Points */}
          {journey.slice(0, currentTimeIndex + 1).map((point) => (
            <Marker
              key={point.id}
              position={point.location}
              title={point.activity}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: point.type === 'customer' ? 8 : 6,
                fillColor: point.color,
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 2
              }}
              onClick={() => setSelectedMarker(point)}
            />
          ))}
          
          {/* Customer Locations */}
          {customerLocations.map((customer) => (
            <Marker
              key={customer.id}
              position={customer.position}
              title={customer.name}
              opacity={customer.visited ? 0.5 : 1}
              icon={{
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 5,
                fillColor: customer.visited ? colors.gray[400] : colors.primary[400],
                fillOpacity: 0.6,
                strokeColor: 'white',
                strokeWeight: 1
              }}
            />
          ))}
          
          {/* Other Salesmen */}
          {selectedSalesman === 'all' && salesmanPositions.map(salesman => (
            <Marker
              key={salesman.id}
              position={salesman.position}
              title={`${salesman.name} - ${salesman.status}`}
              icon={getMarkerIcon('salesman', salesman.status)}
              onClick={() => setSelectedMarker(salesman)}
            />
          ))}
          
          {/* Info Window */}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position || selectedMarker.location}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div style={{ padding: '8px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
                  {selectedMarker.name || selectedMarker.activity || 'Location'}
                </h4>
                {selectedMarker.time && (
                  <p style={{ margin: 0, fontSize: '12px', color: colors.gray[600] }}>
                    Time: {selectedMarker.time.toLocaleTimeString()}
                  </p>
                )}
                {selectedMarker.duration && (
                  <p style={{ margin: 0, fontSize: '12px', color: colors.gray[600] }}>
                    Duration: {selectedMarker.duration} min
                  </p>
                )}
                {selectedMarker.salesAmount && (
                  <p style={{ margin: 0, fontSize: '12px', color: colors.success.main }}>
                    Sales: ${selectedMarker.salesAmount.toLocaleString()}
                  </p>
                )}
                {selectedMarker.currentCustomer && (
                  <p style={{ margin: 0, fontSize: '12px', color: colors.primary[600] }}>
                    At: {selectedMarker.currentCustomer}
                  </p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
      </div>
      
      {/* Legend */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: colors.background.secondary,
        borderRadius: '8px',
        border: `1px solid ${colors.gray[200]}`,
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '4px', backgroundColor: colors.success.main }} />
          <span style={{ fontSize: '12px', color: colors.gray[600] }}>Productive Visit</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '4px', backgroundColor: colors.warning.main }} />
          <span style={{ fontSize: '12px', color: colors.gray[600] }}>Non-Productive Visit</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '4px', backgroundColor: colors.primary[500] }} />
          <span style={{ fontSize: '12px', color: colors.gray[600] }}>Travel</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '4px', backgroundColor: colors.error.main }} />
          <span style={{ fontSize: '12px', color: colors.gray[600] }}>Break</span>
        </div>
      </div>
    </div>
  )
}