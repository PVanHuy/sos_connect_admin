import { AimOutlined } from '@ant-design/icons'
import { Button, Card, List, Space, Typography } from 'antd'
import { PageHeader } from '../../../components/shared/PageHeader'
import { QueryState } from '../../../components/shared/QueryState'
import { SosStatusTag, SosTypeText } from '../../../components/ui/StatusTag'
import { formatDateTime } from '../../../utils/format'
import { sosStatusColor } from '../../../utils/status'
import { useSosMapPage } from './hooks/useSosMapPage'
import {
  Circle,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import L from 'leaflet'
import type { SosRecord } from '../../../types/domain'
import { appColors } from '../../../app/theme/colors'
import { useEffect } from 'react'

function MapCenterController({ center }: { center: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true })
  }, [center, map])

  return null
}

function SosMarker({ item, onSelect }: { item: SosRecord; onSelect: (id: string) => void }) {
  const color = sosStatusColor[item.status] ?? appColors.appColor
  const icon = L.divIcon({
    className: 'sos-marker',
    html: `
      <div style="
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: ${color};
        border: 3px solid #ffffff;
        box-shadow: 0 1px 8px rgba(0,0,0,.28);
      "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })

  return (
    <Marker position={[item.lat, item.lon]} icon={icon} eventHandlers={{ click: () => onSelect(item.id) }}>
      <Popup>
        <Space direction="vertical" size={6}>
          <Typography.Text strong>{item.id}</Typography.Text>
          <SosStatusTag status={item.status} />
          <Typography.Text>{item.description}</Typography.Text>
          <Typography.Text type="secondary">{item.locationName}</Typography.Text>
          <Typography.Text type="secondary">{formatDateTime(item.eventTime)}</Typography.Text>
        </Space>
      </Popup>
    </Marker>
  )
}

export function SosMapPage() {
  const {
    items,
    selectedSos,
    mapCenter,
    routeLine,
    currentPosition,
    isLocating,
    selectSos,
    goToMyLocation,
    isLoading,
    isError,
    errorMessage,
  } = useSosMapPage()

  return (
    <div className="sos-map-page" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 112px)', minHeight: 560 }}>
      <PageHeader
        title="Bản đồ SOS"
        description="Vị trí SOS từ API /admin/all-events. Marker được gom theo vùng (cluster)."
      />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <QueryState
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage}
          isEmpty={!items.length}
        >
        <div
          className="sos-map-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 1fr)',
            gap: 16,
            flex: 1,
            minHeight: 0,
          }}
        >
          <Card
            style={{ height: '100%', minHeight: 0, background: appColors.grayF0Color }}
            styles={{ body: { padding: 12, height: '100%' } }}
          >
            <div style={{ height: '100%', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
              <MapContainer center={mapCenter} zoom={12} minZoom={5} maxZoom={18} style={{ height: '100%', width: '100%' }}>
                <MapCenterController center={mapCenter} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MarkerClusterGroup
                  chunkedLoading
                  showCoverageOnHover={false}
                  maxClusterRadius={80}
                  spiderfyOnMaxZoom
                  disableClusteringAtZoom={17}
                >
                  {items.map((item) => (
                    <SosMarker key={item.id} item={item} onSelect={selectSos} />
                  ))}
                </MarkerClusterGroup>

                {selectedSos ? (
                  <Circle
                    center={[selectedSos.lat, selectedSos.lon]}
                    radius={1000}
                    pathOptions={{ color: appColors.appColor, fillOpacity: 0.08 }}
                  />
                ) : null}

                {routeLine ? (
                  <Polyline
                    positions={routeLine}
                    pathOptions={{ color: appColors.appColor, weight: 4, opacity: 0.8 }}
                  />
                ) : null}

                {currentPosition ? (
                  <Circle
                    center={currentPosition}
                    radius={8}
                    pathOptions={{ color: '#fff', fillColor: appColors.red26Color, fillOpacity: 1, weight: 2 }}
                  >
                    <Popup>Vị trí hiện tại</Popup>
                  </Circle>
                ) : null}
              </MapContainer>

              <Button
                type="primary"
                icon={<AimOutlined />}
                loading={isLocating}
                onClick={goToMyLocation}
                style={{
                  position: 'absolute',
                  right: 12,
                  bottom: 12,
                }}
              >
                Vị trí của tôi
              </Button>
            </div>
          </Card>
          <Card
            style={{ height: '100%', minHeight: 0, overflow: 'hidden' }}
            styles={{ body: { padding: 0, height: '100%', display: 'flex', flexDirection: 'column' } }}
          >
            <div className="sos-map-list" style={{ overflowY: 'auto', flex: 1, padding: '8px 16px' }}>
              <List
                dataSource={items}
                renderItem={(item) => (
                  <List.Item onClick={() => selectSos(item.id)} style={{ cursor: 'pointer' }}>
                    <List.Item.Meta
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                          <span style={{ wordBreak: 'break-all' }}>{item.id}</span>
                          <SosStatusTag status={item.status} />
                        </div>
                      }
                      description={
                        <Space direction="vertical" size={2}>
                          <span>{item.locationName} · {formatDateTime(item.eventTime)}</span>
                          <span><SosTypeText type={item.eventType} /> · {item.victimName}</span>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </div>
      </QueryState>
      </div>
    </div>
  )
}
