export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected'

export interface WebsocketClient {
  connect: () => void
  disconnect: () => void
  getStatus: () => ConnectionStatus
}

/**
 * Socket.IO client will be wired when backend contract is available.
 * TODO: implement connect/reconnect/auth handling.
 */
export function createWebsocketClient(): WebsocketClient {
  let status: ConnectionStatus = 'idle'
  return {
    connect: () => {
      status = 'disconnected'
    },
    disconnect: () => {
      status = 'idle'
    },
    getStatus: () => status,
  }
}
