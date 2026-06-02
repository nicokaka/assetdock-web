import { httpClient } from '@/lib/http-client'

export type DashboardStatsView = {
  totalAssets: number
  assignedAssets: number
  inStockAssets: number
  inMaintenanceAssets: number
  retiredAssets: number
  totalPeople: number
  activePeople: number
  activeCheckouts: number
}

export async function getDashboardStats() {
  return httpClient.request<DashboardStatsView>('/dashboard/stats')
}
