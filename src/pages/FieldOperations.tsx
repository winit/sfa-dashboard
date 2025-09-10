import React, { useState } from 'react'
import { colors } from '../styles/colors'
import { JourneyMapGoogle } from '../components/JourneyMapGoogleFixed'
import { TestGoogleMaps } from '../components/TestGoogleMaps'
import { TimeMotionAnalysis } from '../components/TimeMotionAnalysis'
import { JourneyCompliance } from '../components/JourneyCompliance'

export const FieldOperations: React.FC = () => {
  console.log('FieldOperations component rendering')
  const [activeTab, setActiveTab] = useState('map')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedSalesman, setSelectedSalesman] = useState('all')
  
  console.log('Active tab:', activeTab)
  console.log('Selected date:', selectedDate)
  
  const tabs = [
    { id: 'map', label: 'Live Tracking', icon: '📍' },
    { id: 'journey', label: 'Journey Compliance', icon: '📅' },
    { id: 'time', label: 'Time & Motion', icon: '⏱️' },
    { id: 'analytics', label: 'Visit Analytics', icon: '📊' }
  ]
  
  // Mock salesmen data
  const salesmen = [
    { id: 'SM001', name: 'Ahmed Hassan', route: 'Downtown Route', status: 'active' },
    { id: 'SM002', name: 'John Smith', route: 'Suburban Route', status: 'active' },
    { id: 'SM003', name: 'Ali Mohammed', route: 'Industrial Route', status: 'idle' },
    { id: 'SM004', name: 'Sarah Johnson', route: 'Commercial Route', status: 'break' },
    { id: 'SM005', name: 'Mike Wilson', route: 'Residential Route', status: 'active' }
  ]
  
  // Summary metrics
  const fieldMetrics = {
    activeFieldForce: 42,
    onRoute: 38,
    atCustomer: 25,
    traveling: 13,
    idle: 4,
    avgCompliance: 87,
    totalVisitsToday: 285,
    productiveVisits: 245,
    totalDistanceCovered: 1250 // km
  }
  
  // Add error boundary
  if (!tabs || !salesmen) {
    return <div>Error loading Field Operations data</div>
  }
  
  return (
    <div style={{ padding: '24px', backgroundColor: colors.background.secondary, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: colors.gray[900] }}>
              Field Operations
            </h1>
            <p style={{ color: colors.gray[500], fontSize: '15px' }}>
              Real-time tracking and analysis of field force activities
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Date Selector */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: `1px solid ${colors.gray[300]}`,
                backgroundColor: colors.background.primary,
                fontSize: '14px',
                color: colors.gray[700]
              }}
            />
            {/* Salesman Filter */}
            <select
              value={selectedSalesman}
              onChange={(e) => setSelectedSalesman(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: `1px solid ${colors.gray[300]}`,
                backgroundColor: colors.background.primary,
                fontSize: '14px',
                color: colors.gray[700],
                minWidth: '180px'
              }}
            >
              <option value="all">All Salesmen</option>
              {salesmen.map(sm => (
                <option key={sm.id} value={sm.id}>{sm.name}</option>
              ))}
            </select>
            {/* Live Status Indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: colors.success.light
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: colors.success.main,
                animation: 'pulse 2s infinite'
              }} />
              <span style={{ fontSize: '13px', color: colors.success.dark, fontWeight: '500' }}>
                Live Tracking Active
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: colors.background.primary,
          border: `1px solid ${colors.gray[200]}`
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: colors.gray[900] }}>
            {fieldMetrics.activeFieldForce}
          </div>
          <div style={{ fontSize: '12px', color: colors.gray[500], marginTop: '4px' }}>
            Active Field Force
          </div>
        </div>
        
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: colors.background.primary,
          border: `1px solid ${colors.gray[200]}`
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: colors.success.main }}>
            {fieldMetrics.atCustomer}
          </div>
          <div style={{ fontSize: '12px', color: colors.gray[500], marginTop: '4px' }}>
            At Customer
          </div>
        </div>
        
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: colors.background.primary,
          border: `1px solid ${colors.gray[200]}`
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: colors.primary[500] }}>
            {fieldMetrics.traveling}
          </div>
          <div style={{ fontSize: '12px', color: colors.gray[500], marginTop: '4px' }}>
            Traveling
          </div>
        </div>
        
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: colors.background.primary,
          border: `1px solid ${colors.gray[200]}`
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: colors.warning.main }}>
            {fieldMetrics.idle}
          </div>
          <div style={{ fontSize: '12px', color: colors.gray[500], marginTop: '4px' }}>
            Idle/Break
          </div>
        </div>
        
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: colors.background.primary,
          border: `1px solid ${colors.gray[200]}`
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: colors.gray[900] }}>
            {fieldMetrics.avgCompliance}%
          </div>
          <div style={{ fontSize: '12px', color: colors.gray[500], marginTop: '4px' }}>
            Journey Compliance
          </div>
        </div>
        
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: colors.background.primary,
          border: `1px solid ${colors.gray[200]}`
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: colors.gray[900] }}>
            {fieldMetrics.totalVisitsToday}
          </div>
          <div style={{ fontSize: '12px', color: colors.gray[500], marginTop: '4px' }}>
            Total Visits
          </div>
        </div>
        
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: colors.background.primary,
          border: `1px solid ${colors.gray[200]}`
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: colors.success.main }}>
            {Math.round((fieldMetrics.productiveVisits / fieldMetrics.totalVisitsToday) * 100)}%
          </div>
          <div style={{ fontSize: '12px', color: colors.gray[500], marginTop: '4px' }}>
            Productive Calls
          </div>
        </div>
        
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: colors.background.primary,
          border: `1px solid ${colors.gray[200]}`
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: colors.gray[900] }}>
            {fieldMetrics.totalDistanceCovered}
            <span style={{ fontSize: '14px', fontWeight: '400' }}> km</span>
          </div>
          <div style={{ fontSize: '12px', color: colors.gray[500], marginTop: '4px' }}>
            Distance Covered
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: `2px solid ${colors.gray[200]}`,
        paddingBottom: '0'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? `2px solid ${colors.primary[500]}` : '2px solid transparent',
              color: activeTab === tab.id ? colors.primary[500] : colors.gray[500],
              fontWeight: activeTab === tab.id ? '600' : '400',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '16px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div style={{
        backgroundColor: colors.background.primary,
        borderRadius: '12px',
        padding: '24px',
        border: `1px solid ${colors.gray[200]}`,
        minHeight: '600px'
      }}>
        {activeTab === 'map' ? (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
              Live Tracking - {selectedDate}
            </h3>
            <JourneyMapGoogle 
              salesmen={salesmen}
              selectedSalesman={selectedSalesman}
              date={selectedDate}
            />
          </div>
        ) : null}
        
        {activeTab === 'journey' && (
          <JourneyCompliance
            salesmen={salesmen}
            selectedSalesman={selectedSalesman}
            date={selectedDate}
          />
        )}
        
        {activeTab === 'time' && (
          <TimeMotionAnalysis
            salesmen={salesmen}
            selectedSalesman={selectedSalesman}
            date={selectedDate}
          />
        )}
        
        {activeTab === 'analytics' && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
              Visit Analytics
            </h3>
            
            {/* Visit Duration Heatmap */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px'
            }}>
              <div style={{
                padding: '20px',
                borderRadius: '8px',
                backgroundColor: colors.background.secondary,
                border: `1px solid ${colors.gray[200]}`
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: colors.gray[800] }}>
                  Average Visit Duration by Customer Type
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { type: 'Key Account', duration: 45, color: colors.chart.purple },
                    { type: 'Modern Trade', duration: 38, color: colors.primary[500] },
                    { type: 'Traditional Trade', duration: 25, color: colors.chart.green },
                    { type: 'HORECA', duration: 30, color: colors.chart.orange },
                    { type: 'Wholesale', duration: 20, color: colors.chart.red }
                  ].map(item => (
                    <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '13px', color: colors.gray[600], width: '120px' }}>
                        {item.type}
                      </span>
                      <div style={{
                        flex: 1,
                        height: '24px',
                        backgroundColor: colors.gray[100],
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${(item.duration / 45) * 100}%`,
                          height: '100%',
                          backgroundColor: item.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          paddingRight: '8px'
                        }}>
                          <span style={{ fontSize: '11px', color: 'white', fontWeight: '600' }}>
                            {item.duration} min
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{
                padding: '20px',
                borderRadius: '8px',
                backgroundColor: colors.background.secondary,
                border: `1px solid ${colors.gray[200]}`
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: colors.gray[800] }}>
                  Best Visiting Times (Conversion Rate)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { time: '9:00 - 10:00 AM', rate: 92 },
                    { time: '10:00 - 11:00 AM', rate: 88 },
                    { time: '11:00 - 12:00 PM', rate: 75 },
                    { time: '2:00 - 3:00 PM', rate: 85 },
                    { time: '3:00 - 4:00 PM', rate: 78 },
                    { time: '4:00 - 5:00 PM', rate: 65 }
                  ].map(slot => (
                    <div key={slot.time} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: colors.gray[600] }}>{slot.time}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '100px',
                          height: '8px',
                          backgroundColor: colors.gray[200],
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${slot.rate}%`,
                            height: '100%',
                            backgroundColor: slot.rate > 80 ? colors.success.main : 
                                           slot.rate > 70 ? colors.warning.main : colors.error.main
                          }} />
                        </div>
                        <span style={{ 
                          fontSize: '12px', 
                          fontWeight: '600',
                          color: slot.rate > 80 ? colors.success.main : 
                                 slot.rate > 70 ? colors.warning.main : colors.error.main
                        }}>
                          {slot.rate}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Activity Summary */}
            <div style={{
              marginTop: '24px',
              padding: '20px',
              borderRadius: '8px',
              backgroundColor: colors.background.secondary,
              border: `1px solid ${colors.gray[200]}`
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: colors.gray[800] }}>
                Field Activity Summary
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: colors.gray[900] }}>6.5 hrs</div>
                  <div style={{ fontSize: '11px', color: colors.gray[500] }}>Avg Working Time</div>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: colors.primary[500] }}>2.3 hrs</div>
                  <div style={{ fontSize: '11px', color: colors.gray[500] }}>Avg Travel Time</div>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: colors.success.main }}>4.2 hrs</div>
                  <div style={{ fontSize: '11px', color: colors.gray[500] }}>Avg Selling Time</div>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: colors.gray[900] }}>8.5</div>
                  <div style={{ fontSize: '11px', color: colors.gray[500] }}>Avg Visits/Day</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Add CSS animation for pulse */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}