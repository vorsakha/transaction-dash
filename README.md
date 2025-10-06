# USDC Transaction Dashboard

A modern, responsive single-page application that interfaces with the Etherscan API to display and interact with USDC transactions on Ethereum testnet.

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm
- MetaMask browser extension

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (optional):
```bash
cp .env.example .env
```

Add your Etherscan API key for enhanced rate limits:
```env
NEXT_PUBLIC_ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing

### Running Tests

Run all tests:
```bash
npm run test
```

## Features Implemented

- **MetaMask Integration**: Connect to MetaMask wallet with one click
- **Real-time USDC Balance**: View current USDC balance on Sepolia testnet
- **Transaction History**: Complete transaction history with filtering and sorting
- **Transaction Volume Charts**: Visual representation of transaction patterns over time
- **USDC Transfer**: Send USDC to any Ethereum address with gas estimation
- **Transaction Details**: Detailed view of individual transactions with confirmations
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessible**: WCAG compliant with keyboard navigation and screen reader support

## Technical Decisions and Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS
- **Blockchain**: wagmi + viem for Ethereum interactions
- **State Management**: React Query for server state
- **Charts**: Recharts for data visualization
- **UI Components**: Radix UI for accessible primitives
- **Testing**: Jest + React Testing Library
- **API**: Etherscan API

### API Implementation
The following Etherscan API endpoints are implemented:
- **Get USDC Token Transfers**: Fetch USDC transaction history for an address
- **Get USDC Balance**: Retrieve current USDC balance for an address
- **Get Transaction Details**: Fetch detailed information for specific transactions

### Architecture
- **Component-Based**: Modular, reusable components with clear separation of concerns
- **Custom Hooks**: Encapsulated business logic in custom hooks for reusability
- **State Management**: React Query for server state, local state for UI
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Caching**: React Query with 1-minute stale time and 5-minute garbage collection

### Key Technical Decisions
- **wagmi + viem**: Chose for better React integration and modern TypeScript support
- **React Query**: Implemented for robust caching, background updates, and error handling
- **Radix UI**: Used for accessible, unstyled components with full customization
- **Recharts**: Better React integration and TypeScript support for charts

## Known Limitations or Future Improvements

### Current Limitations
- **Test Coverage**: Low overall test coverage needs improvement
- **Single Token**: USDC-only implementation

### Future Improvements
- **Enhanced Testing**: Increase test coverage
- **Advanced Analytics**: More sophisticated transaction analytics
- **Dark Mode**: Implement dark mode toggle (CSS is prepared)
- **Notification System**: Transaction status notifications
- **Export Features**: Export transaction history to CSV