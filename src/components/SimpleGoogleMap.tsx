import React from 'react'
import { GoogleMap, LoadScript } from '@react-google-maps/api'

const mapContainerStyle = {
  width: '100%',
  height: '400px'
}

const center = {
  lat: 25.2048,
  lng: 55.2708
}

export const SimpleGoogleMap: React.FC = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  
  console.log('SimpleGoogleMap - API Key present:', !!apiKey)
  
  if (!apiKey) {
    return <div>No API Key</div>
  }
  
  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      onLoad={() => console.log('Simple map loaded')}
      onError={(e) => console.error('Simple map error:', e)}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
      />
    </LoadScript>
  )
}