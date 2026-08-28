export const websocketEvents = {
  sosUpdated: 'sos.updated',
  sosCreated: 'sos.created',
  teamStatusChanged: 'team.status.changed',
} as const

export type WebsocketEventName = (typeof websocketEvents)[keyof typeof websocketEvents]
