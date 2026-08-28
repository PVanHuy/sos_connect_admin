import { Segmented, Space, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { appColors } from '../../../app/theme/colors'
import type { DashboardTrendPeriod, DashboardTrendPoint } from '../../../types/domain'

interface DashboardTrendChartProps {
  trends: Record<DashboardTrendPeriod, DashboardTrendPoint[]>
}

type MetricKey = 'events' | 'users' | 'teams'

const periodOptions: Array<{ label: string; value: DashboardTrendPeriod }> = [
  { label: 'Ngày', value: 'day' },
  { label: 'Tháng', value: 'month' },
  { label: 'Năm', value: 'year' },
]

const metricConfig: Array<{ key: MetricKey; label: string; color: string }> = [
  { key: 'events', label: 'Sự kiện', color: appColors.appColor },
  { key: 'users', label: 'Người dùng', color: appColors.green47Color },
  { key: 'teams', label: 'Đội cứu hộ', color: appColors.mintyWaveColor },
]

function buildPath(points: DashboardTrendPoint[], key: MetricKey, width: number, height: number): string {
  if (!points.length) return ''

  const values = points.map((point) => point[key])
  const max = Math.max(...values, 1)
  const stepX = points.length === 1 ? width / 2 : width / (points.length - 1)

  return points
    .map((point, index) => {
      const x = index * stepX
      const normalized = point[key] / max
      const y = height - normalized * (height - 24) - 8
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

export function DashboardTrendChart({ trends }: DashboardTrendChartProps) {
  const [period, setPeriod] = useState<DashboardTrendPeriod>('day')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const points = trends[period]
  const width = 720
  const height = 280
  const chartTop = 8
  const chartBottom = height - 28
  const chartUsableHeight = chartBottom - chartTop
  const stepX = points.length === 1 ? width / 2 : width / Math.max(points.length - 1, 1)

  const maxValue = useMemo(() => {
    const values = points.flatMap((point) => [point.events, point.users, point.teams])
    return Math.max(...values, 1)
  }, [points])

  const hoveredPoint = hoveredIndex === null ? null : points[hoveredIndex]

  function getPointY(value: number): number {
    return chartBottom - (value / maxValue) * chartUsableHeight
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Biểu đồ thống kê
          </Typography.Title>
          <Typography.Text type="secondary">
            So sánh số lượng sự kiện, người dùng và đội cứu hộ theo {period === 'day' ? 'ngày' : period === 'month' ? 'tháng' : 'năm'}.
          </Typography.Text>
        </div>
        <Segmented<DashboardTrendPeriod>
          value={period}
          onChange={setPeriod}
          options={periodOptions}
        />
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {metricConfig.map((metric) => (
          <Space key={metric.key} size={8}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: metric.color,
                display: 'inline-block',
              }}
            />
            <Typography.Text>{metric.label}</Typography.Text>
          </Space>
        ))}
      </div>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <div style={{ minWidth: 720 }}>
          <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="280" role="img" aria-label="Dashboard trend chart">
            {[0, 1, 2, 3].map((line) => {
              const y = 24 + ((height - 48) / 3) * line
              return (
                <line
                  key={line}
                  x1="0"
                  y1={y}
                  x2={width}
                  y2={y}
                  stroke={appColors.grayEBColor}
                  strokeDasharray="4 4"
                />
              )
            })}

            {metricConfig.map((metric) => (
              <path
                key={metric.key}
                d={buildPath(points, metric.key, width, height)}
                fill="none"
                stroke={metric.color}
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}

            {hoveredPoint && hoveredIndex !== null ? (
              <>
                <line
                  x1={hoveredIndex * stepX}
                  y1={chartTop}
                  x2={hoveredIndex * stepX}
                  y2={chartBottom}
                  stroke={appColors.grayAFColor}
                  strokeDasharray="4 4"
                />
                {metricConfig.map((metric) => (
                  <circle
                    key={metric.key}
                    cx={hoveredIndex * stepX}
                    cy={getPointY(hoveredPoint[metric.key])}
                    r="5"
                    fill={metric.color}
                    stroke={appColors.whiteColor}
                    strokeWidth="2"
                  />
                ))}
                <g transform={`translate(${Math.min(Math.max(hoveredIndex * stepX + 12, 12), width - 172)}, 18)`}>
                  <rect
                    width="160"
                    height="78"
                    rx="10"
                    fill={appColors.whiteColor}
                    stroke={appColors.grayEBColor}
                  />
                  <text x="12" y="20" fill={appColors.gray37Color} fontSize="12" fontWeight="700">
                    {hoveredPoint.label}
                  </text>
                  {metricConfig.map((metric, idx) => (
                    <g key={metric.key} transform={`translate(12, ${34 + idx * 14})`}>
                      <circle cx="4" cy="-4" r="4" fill={metric.color} />
                      <text x="14" y="0" fill={appColors.gray37Color} fontSize="11">
                        {metric.label}: {hoveredPoint[metric.key]}
                      </text>
                    </g>
                  ))}
                </g>
              </>
            ) : null}

            {points.map((point, index) => {
              const x = points.length === 1 ? width / 2 : index * (width / (points.length - 1))
              return (
                <g key={point.label}>
                  <rect
                    x={Math.max(x - stepX / 2, 0)}
                    y={0}
                    width={points.length === 1 ? width : Math.min(stepX, width - Math.max(x - stepX / 2, 0))}
                    height={height}
                    fill="transparent"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                  <text
                    x={x}
                    y={height - 4}
                    textAnchor="middle"
                    fill={appColors.gray80Color}
                    fontSize="12"
                  >
                    {point.label}
                  </text>
                </g>
              )
            })}

            <text x={width - 8} y={20} textAnchor="end" fill={appColors.gray80Color} fontSize="12">
              Max: {maxValue}
            </text>
          </svg>
        </div>
      </div>
    </Space>
  )
}

