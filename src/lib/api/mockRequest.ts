export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

const MOCK_LATENCY_MS = 2000

/**
 * Placeholder for unconnected NestJS endpoints.
 * TODO: replace with real Axios calls in feature API modules.
 */
export async function mockRequest<T>(data: T, latencyMs = MOCK_LATENCY_MS): Promise<T> {
  await delay(latencyMs)
  return data
}
