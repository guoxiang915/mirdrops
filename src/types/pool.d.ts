interface PoolData {
  id: string | number
  score: number
  name: string
  equity?: number
  balance?: number
  buying_power?: number
  total_profits: number
  fees: number
}

interface PoolsData {
  pools: PoolData[]
}

interface Pool extends PoolData {
  inception?: number
  self_delegation?: number
  performance_fees?: number
  total_delegation: number
  daily_return: number
  my_delegation: number
  my_rewards?: number
  pool_payouts?: number
}
