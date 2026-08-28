import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { getUserFacingErrorMessage, toAppError } from '../../../../lib/api/errors'
import { fetchSosList } from '../../api/sos.api'

export function useSosMapPage() {
  const [selectedSosId, setSelectedSosId] = useState<string | null>(null)
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  const sosQuery = useQuery({
    queryKey: ['sos', 'map', { status: 'ALL', page: 1, pageSize: 50 }],
    queryFn: () => fetchSosList({ status: 'ALL', page: 1, pageSize: 50 }),
  })

  const items = useMemo(() => sosQuery.data?.items ?? [], [sosQuery.data])
  const needRescueItems = useMemo(
    () => items.filter((item) => item.status === 'PENDING' || item.status === 'IN_PROGRESS'),
    [items],
  )
  const selectedSos = needRescueItems.find((item) => item.id === selectedSosId) ?? null

  const mapCenter = useMemo<[number, number]>(() => {
    if (selectedSos) return [selectedSos.lat, selectedSos.lon]
    if (needRescueItems.length > 0) return [needRescueItems[0].lat, needRescueItems[0].lon]
    return [10.7769, 106.7009]
  }, [needRescueItems, selectedSos])

  const routeLine = useMemo(() => {
    if (!currentPosition || !selectedSos) return null
    return [currentPosition, [selectedSos.lat, selectedSos.lon] as [number, number]]
  }, [currentPosition, selectedSos])

  async function goToMyLocation() {
    if (!navigator.geolocation || isLocating) return
    setIsLocating(true)
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10_000,
        })
      })
      setCurrentPosition([position.coords.latitude, position.coords.longitude])
    } finally {
      setIsLocating(false)
    }
  }

  return {
    items: needRescueItems,
    selectedSosId,
    selectedSos,
    currentPosition,
    mapCenter,
    routeLine,
    isLocating,
    selectSos: (id: string) => setSelectedSosId(id),
    clearSelection: () => setSelectedSosId(null),
    goToMyLocation,
    isLoading: sosQuery.isLoading,
    isError: sosQuery.isError,
    errorMessage: sosQuery.error
      ? getUserFacingErrorMessage(toAppError(sosQuery.error))
      : undefined,
  }
}
