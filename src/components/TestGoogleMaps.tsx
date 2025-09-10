import React, { useState } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  border: '2px solid #4CAF50',
  borderRadius: '8px'
}

const center = {
  lat: 25.2048,
  lng: 55.2708
}

export const TestGoogleMaps: React.FC = () => {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Google Maps API Test</h2>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <p><strong>API Key Status:</strong> {apiKey ? '✅ Present' : '❌ Missing'}</p>
        {apiKey && <p><strong>Key (first 10 chars):</strong> {apiKey.substring(0, 10)}...</p>}
        <p><strong>Map Load Status:</strong> {mapLoaded ? '✅ Loaded' : '⏳ Loading...'}</p>
        {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
      </div>

      {apiKey ? (
        <LoadScript
          googleMapsApiKey={apiKey}
          onLoad={() => {
            console.log('✅ Google Maps loaded successfully!')
            setMapLoaded(true)
          }}
          onError={(e) => {
            console.error('❌ Google Maps load error:', e)
            setError(`Failed to load: ${e}`)
          }}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
            onLoad={(map) => {
              console.log('✅ Map instance created:', map)
            }}
          >
            <Marker 
              position={center}
              title="Test Marker - Dubai"
            />
          </GoogleMap>
        </LoadScript>
      ) : (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          backgroundColor: '#ffebee',
          borderRadius: '8px',
          color: '#c62828'
        }}>
          <h3>API Key Missing!</h3>
          <p>Please add VITE_GOOGLE_MAPS_API_KEY to your .env file</p>
        </div>
      )}
    </div>
  )
}