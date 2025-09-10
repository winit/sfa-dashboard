import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { colors, CHART_COLORS } from '../styles/colors'

interface TimeMotionAnalysisProps {
  salesmen: any[]
  selectedSalesman: string
  date: string
}

// Generate time blocks for a salesman's day
const generateTimeBlocks = () => {
  const blocks = []
  const activities = ['productive', 'travel', 'break', 'idle', 'admin']
  const activityColors = {
    productive: colors.success.main,
    travel: colors.primary[500],
    break: colors.warning.main,
    idle: colors.error.main,
    admin: colors.gray[500]
  }
  
  let currentHour = 8
  while (currentHour < 18) {
    const duration = Math.random() * 2 + 0.5 // 0.5 to 2.5 hours
    const activity = activities[Math.floor(Math.random() * activities.length)]
    
    blocks.push({
      startTime: `${currentHour}:00`,
      endTime: `${Math.min(currentHour + duration, 18).toFixed(0)}:00`,
      activity,
      color: activityColors[activity],
      duration: duration * 60, // in minutes
      customer: activity === 'productive' ? `Customer ${Math.floor(Math.random() * 100)}` : null
    })
    
    currentHour += duration
  }
  
  return blocks
}

// Generate daily summary data
const generateDailySummary = () => {
  const productive = Math.floor(Math.random() * 180 + 180) // 3-6 hours
  const travel = Math.floor(Math.random() * 120 + 60) // 1-3 hours
  const breakTime = Math.floor(Math.random() * 60 + 30) // 0.5-1.5 hours
  const idle = Math.floor(Math.random() * 60 + 30) // 0.5-1.5 hours
  const admin = Math.floor(Math.random() * 30 + 15) // 0.25-0.75 hours
  
  return [
    { name: 'Productive', value: productive, color: colors.success.main },
    { name: 'Travel', value: travel, color: colors.primary[500] },
    { name: 'Break', value: breakTime, color: colors.warning.main },
    { name: 'Idle', value: idle, color: colors.error.main },
    { name: 'Admin', value: admin, color: colors.gray[500] }
  ]
}

// Generate hourly productivity data
const generateHourlyProductivity = () => {
  return [
    { hour: '8 AM', productive: 45, travel: 15, other: 0 },
    { hour: '9 AM', productive: 50, travel: 10, other: 0 },
    { hour: '10 AM', productive: 55, travel: 5, other: 0 },
    { hour: '11 AM', productive: 45, travel: 10, other: 5 },
    { hour: '12 PM', productive: 30, travel: 10, other: 20 },
    { hour: '1 PM', productive: 20, travel: 5, other: 35 },
    { hour: '2 PM', productive: 40, travel: 15, other: 5 },
    { hour: '3 PM', productive: 50, travel: 10, other: 0 },
    { hour: '4 PM', productive: 45, travel: 10, other: 5 },
    { hour: '5 PM', productive: 35, travel: 20, other: 5 }
  ]
}

export const TimeMotionAnalysis: React.FC<TimeMotionAnalysisProps> = ({ salesmen, selectedSalesman, date }) => {
  const timeBlocks = generateTimeBlocks()
  const dailySummary = generateDailySummary()
  const hourlyData = generateHourlyProductivity()
  
  const totalMinutes = dailySummary.reduce((sum, item) => sum + item.value, 0)
  
  const filteredSalesmen = selectedSalesman === 'all' 
    ? salesmen 
    : salesmen.filter(sm => sm.id === selectedSalesman)
  
  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: colors.gray[900] }}>
        Time & Motion Analysis - {date}
      </h3>
      
      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {dailySummary.map(item => (
          <div key={item.name} style={{
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: colors.background.secondary,
            border: `1px solid ${colors.gray[200]}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: item.color
              }} />
              <span style={{ fontSize: '12px', color: colors.gray[600], fontWeight: '500' }}>
                {item.name}
              </span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: colors.gray[900] }}>
              {Math.floor(item.value / 60)}h {item.value % 60}m
            </div>
            <div style={{ fontSize: '11px', color: colors.gray[500], marginTop: '4px' }}>
              {((item.value / totalMinutes) * 100).toFixed(1)}% of day
            </div>
          </div>
        ))}
      </div>
      
      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Timeline View */}
        <div style={{
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: colors.background.secondary,
          border: `1px solid ${colors.gray[200]}`
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px', color: colors.gray[800] }}>
            Daily Timeline
          </h4>
          
          {/* Hour Grid */}
          <div style={{ position: 'relative', height: '60px', marginBottom: '20px' }}>
            {/* Hour markers */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              position: 'absolute',
              width: '100%',
              top: 0,
              fontSize: '10px',
              color: colors.gray[500]
            }}>
              {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(hour => (
                <span key={hour} style={{ width: '9%', textAlign: 'center' }}>
                  {hour > 12 ? `${hour - 12}PM` : `${hour}AM`}
                </span>
              ))}
            </div>
            
            {/* Time blocks visualization */}
            <div style={{
              display: 'flex',
              height: '40px',
              marginTop: '20px',
              borderRadius: '4px',
              overflow: 'hidden',
              border: `1px solid ${colors.gray[200]}`
            }}>
              {timeBlocks.map((block, index) => (
                <div
                  key={index}
                  style={{
                    flex: block.duration,
                    backgroundColor: block.color,
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                  title={`${block.activity}: ${block.startTime} - ${block.endTime}${block.customer ? ` (${block.customer})` : ''}`}
                >
                  {block.duration > 30 && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '10px',
                      color: 'white',
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}>
                      {block.activity === 'productive' && block.customer ? 
                        block.customer.substring(0, 10) : 
                        block.activity.substring(0, 3).toUpperCase()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Activity List */}
          <div style={{ marginTop: '24px' }}>
            <h5 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', color: colors.gray[700] }}>
              Activity Log
            </h5>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {timeBlocks.map((block, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px',
                  borderBottom: `1px solid ${colors.gray[100]}`,
                  fontSize: '12px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: block.color,
                    flexShrink: 0
                  }} />
                  <span style={{ color: colors.gray[600], width: '100px' }}>
                    {block.startTime} - {block.endTime}
                  </span>
                  <span style={{ color: colors.gray[700], fontWeight: '500', flex: 1 }}>
                    {block.activity === 'productive' ? 'Customer Visit' :
                     block.activity === 'travel' ? 'Travel' :
                     block.activity === 'break' ? 'Break' :
                     block.activity === 'idle' ? 'Idle Time' : 'Admin Work'}
                  </span>
                  {block.customer && (
                    <span style={{ color: colors.gray[600], fontSize: '11px' }}>
                      {block.customer}
                    </span>
                  )}
                  <span style={{ color: colors.gray[500], fontSize: '11px' }}>
                    {Math.floor(block.duration / 60)}h {block.duration % 60}m
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Pie Chart */}
        <div style={{
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: colors.background.secondary,
          border: `1px solid ${colors.gray[200]}`
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px', color: colors.gray[800] }}>
            Time Distribution
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={dailySummary}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {dailySummary.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `${Math.floor(value / 60)}h ${value % 60}m`} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div style={{ marginTop: '16px' }}>
            {dailySummary.map(item => (
              <div key={item.name} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px',
                    backgroundColor: item.color
                  }} />
                  <span style={{ fontSize: '12px', color: colors.gray[600] }}>
                    {item.name}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: colors.gray[800], fontWeight: '600' }}>
                  {((item.value / totalMinutes) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Hourly Productivity Chart */}
      <div style={{
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: colors.background.secondary,
        border: `1px solid ${colors.gray[200]}`
      }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px', color: colors.gray[800] }}>
          Hourly Productivity Breakdown
        </h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[200]} />
            <XAxis dataKey="hour" stroke={colors.gray[400]} tick={{ fill: colors.gray[500], fontSize: 11 }} />
            <YAxis stroke={colors.gray[400]} tick={{ fill: colors.gray[500], fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.background.primary,
                border: `1px solid ${colors.gray[200]}`,
                borderRadius: '6px'
              }}
            />
            <Bar dataKey="productive" stackId="a" fill={colors.success.main} name="Productive" />
            <Bar dataKey="travel" stackId="a" fill={colors.primary[500]} name="Travel" />
            <Bar dataKey="other" stackId="a" fill={colors.gray[400]} name="Other" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Performance Metrics */}
      <div style={{
        marginTop: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: colors.background.secondary,
          border: `1px solid ${colors.gray[200]}`
        }}>
          <div style={{ fontSize: '13px', color: colors.gray[600], marginBottom: '8px' }}>
            Productivity Score
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: colors.success.main }}>
            {Math.floor(Math.random() * 20 + 70)}%
          </div>
          <div style={{
            marginTop: '8px',
            height: '4px',
            backgroundColor: colors.gray[200],
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.floor(Math.random() * 20 + 70)}%`,
              height: '100%',
              backgroundColor: colors.success.main
            }} />
          </div>
        </div>
        
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: colors.background.secondary,
          border: `1px solid ${colors.gray[200]}`
        }}>
          <div style={{ fontSize: '13px', color: colors.gray[600], marginBottom: '8px' }}>
            Travel Efficiency
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: colors.primary[500] }}>
            {Math.floor(Math.random() * 15 + 80)}%
          </div>
          <div style={{ fontSize: '11px', color: colors.gray[500], marginTop: '4px' }}>
            Optimal route usage
          </div>
        </div>
        
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: colors.background.secondary,
          border: `1px solid ${colors.gray[200]}`
        }}>
          <div style={{ fontSize: '13px', color: colors.gray[600], marginBottom: '8px' }}>
            Time Utilization
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: colors.gray[900] }}>
            {Math.floor(Math.random() * 10 + 85)}%
          </div>
          <div style={{ fontSize: '11px', color: colors.gray[500], marginTop: '4px' }}>
            Working time vs available
          </div>
        </div>
      </div>
    </div>
  )
}