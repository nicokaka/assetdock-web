import { httpClient } from '@/lib/http-client'

export type DashboardStatsView = {
  totalAssets: number
  assignedAssets: number
  inStockAssets: number
  inMaintenanceAssets: number
  retiredAssets: number
  lostAssets: number
  totalUsers: number
  activeUsers: number
}

export async function getDashboardStats() {
  return httpClient.request<DashboardStatsView>('/dashboard/stats')
}
