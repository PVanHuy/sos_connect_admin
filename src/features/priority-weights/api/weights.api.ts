import { mockRequest } from '../../../lib/api/mockRequest'
import { mockWeights } from '../../../lib/api/mocks/adminMocks'
import type { PriorityWeight } from '../../../types/domain'

export async function fetchPriorityWeights(): Promise<PriorityWeight[]> {
  // TODO: GET apiEndpoints.weights.list
  return mockRequest(mockWeights)
}

export async function savePriorityWeights(
  weights: PriorityWeight[],
): Promise<PriorityWeight[]> {
  // TODO: PUT apiEndpoints.weights.save
  return mockRequest(weights)
}
