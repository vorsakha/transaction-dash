import type { Transaction, TransactionFilters } from '@/types'

export const mockTransactions: Transaction[] = [
  {
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    blockNumber: 12345,
    timeStamp: '2024-01-15T10:30:00.000Z',
    from: '0x1234567890123456789012345678901234567890',
    to: '0x0987654321098765432109876543210987654321',
    value: '1000000', // 1 USDC
    contractAddress: '0xA0b86a33E6417c6c1b6c7e8B3a59b4A1B4C2D3E4',
    tokenName: 'USD Coin',
    tokenSymbol: 'USDC',
    transactionIndex: 15,
    gas: '21000',
    gasPrice: '20000000000',
    gasUsed: '21000',
    cumulativeGasUsed: '42000',
    input: '0x',
    confirmations: '1000',
  },
  {
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    blockNumber: 12346,
    timeStamp: '2024-01-15T11:45:00.000Z',
    from: '0x0987654321098765432109876543210987654321',
    to: '0x1234567890123456789012345678901234567890',
    value: '500000', // 0.5 USDC
    contractAddress: '0xA0b86a33E6417c6c1b6c7e8B3a59b4A1B4C2D3E4',
    tokenName: 'USD Coin',
    tokenSymbol: 'USDC',
    transactionIndex: 20,
    gas: '21000',
    gasPrice: '20000000000',
    gasUsed: '21000',
    cumulativeGasUsed: '42000',
    input: '0x',
    confirmations: '999',
  },
  {
    hash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    blockNumber: 12347,
    timeStamp: '2024-01-15T14:20:00.000Z',
    from: '0x1234567890123456789012345678901234567890',
    to: '0x5555555555555555555555555555555555555555',
    value: '2500000', // 2.5 USDC
    contractAddress: '0xA0b86a33E6417c6c1b6c7e8B3a59b4A1B4C2D3E4',
    tokenName: 'USD Coin',
    tokenSymbol: 'USDC',
    transactionIndex: 8,
    gas: '21000',
    gasPrice: '20000000000',
    gasUsed: '21000',
    cumulativeGasUsed: '42000',
    input: '0x',
    confirmations: '998',
  },
]

export const mockTransactionFilters: TransactionFilters = {
  page: 1,
  offset: 50,
  sort: 'desc',
  startBlock: 12300,
  endBlock: 12400,
}

export const mockChartData = {
  labels: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5'],
  datasets: [
    {
      label: 'USDC Volume',
      data: [1000, 1500, 800, 2000, 1200],
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      fill: true,
    },
  ],
}

export const mockChartDataDaily = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Daily Volume',
      data: [500, 800, 1200, 900, 1500, 600, 1000],
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      borderColor: 'rgba(34, 197, 94, 1)',
      borderWidth: 2,
      fill: true,
    },
  ],
}

export const mockAddress = '0x1234567890123456789012345678901234567890'
export const mockShortAddress = '0x1234...7890'
export const mockEnsName = 'example.eth'

export const mockBalanceData = {
  balance: '1000000',
  decimals: 6,
  formatted: '1.0',
  symbol: 'USDC',
  value: BigInt('1000000'),
}

export const mockEthBalanceData = {
  balance: '1000000000000000000', // 1 ETH in wei
  decimals: 18,
  formatted: '1.0',
  symbol: 'ETH',
  value: BigInt('1000000000000000000'),
}


// Mock error responses
export const mockNetworkError = new Error('Network error')
export const mockTransactionError = new Error('Transaction failed')
export const mockBalanceError = new Error('Failed to fetch balance')

// Mock form data
export const mockTransferFormData = {
  recipient: '0x0987654321098765432109876543210987654321',
  amount: '10.5',
}

export const mockInvalidTransferFormData = {
  recipient: 'invalid-address',
  amount: '-5',
}

// Mock transaction details
export const mockTransactionDetails = {
  hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  blockNumber: 12345,
  timeStamp: '2024-01-15T10:30:00.000Z',
  from: '0x1234567890123456789012345678901234567890',
  to: '0x0987654321098765432109876543210987654321',
  value: '1000000',
  contractAddress: '0xA0b86a33E6417c6c1b6c7e8B3a59b4A1B4C2D3E4',
  tokenName: 'USD Coin',
  tokenSymbol: 'USDC',
  transactionIndex: 15,
  gas: '21000',
  gasPrice: '20000000000',
  gasUsed: '21000',
  cumulativeGasUsed: '42000',
  input: '0x',
  confirmations: '1000',
  methodId: '0xa9059cbb',
  functionName: 'transfer',
  status: 1,
  isError: '0',
  errCode: '',
}