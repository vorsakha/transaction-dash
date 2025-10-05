/// <reference types="@types/jest" />
import React from 'react'
import '@testing-library/jest-dom'

jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
  useConnect: jest.fn(),
  useDisconnect: jest.fn(),
  useBalance: jest.fn(),
  useEnsName: jest.fn(),
  useBlockNumber: jest.fn(),
  useClient: jest.fn(),
  useWaitForTransactionReceipt: jest.fn(),
  useTransaction: jest.fn(),
  useTransactionConfirmations: jest.fn(),
  useReadContract: jest.fn(),
  useWriteContract: jest.fn(),
  WagmiProvider: ({ children }) => children,
}))


jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

jest.mock('@radix-ui/react-dropdown-menu', () => ({
  DropdownMenu: ({ children }) => React.createElement('div', null, children),
  DropdownMenuTrigger: ({ children, ...props }) => React.createElement('button', props, children),
  DropdownMenuContent: ({ children, ...props }) => React.createElement('div', props, children),
  DropdownMenuItem: ({ children, ...props }) => React.createElement('div', props, children),
  DropdownMenuSeparator: () => React.createElement('hr'),
}))

jest.mock('@radix-ui/react-dialog', () => ({
  Dialog: ({ children }) => React.createElement('div', null, children),
  DialogPortal: ({ children }) => React.createElement('div', null, children),
  DialogOverlay: ({ children, ...props }) => React.createElement('div', props, children),
  DialogTrigger: ({ children, ...props }) => React.createElement('button', props, children),
  DialogContent: ({ children, ...props }) => React.createElement('div', props, children),
  DialogHeader: ({ children, ...props }) => React.createElement('div', props, children),
  DialogFooter: ({ children, ...props }) => React.createElement('div', props, children),
  DialogTitle: ({ children, ...props }) => React.createElement('h2', props, children),
  DialogDescription: ({ children, ...props }) => React.createElement('p', props, children),
}))

jest.mock('@radix-ui/react-select', () => ({
  Select: ({ children }) => React.createElement('div', null, children),
  SelectGroup: ({ children, ...props }) => React.createElement('div', props, children),
  SelectValue: (props) => React.createElement('span', props),
  SelectTrigger: ({ children, ...props }) => React.createElement('button', props, children),
  SelectContent: ({ children, ...props }) => React.createElement('div', props, children),
  SelectLabel: ({ children, ...props }) => React.createElement('label', props, children),
  SelectItem: ({ children, ...props }) => React.createElement('div', props, children),
  SelectSeparator: () => React.createElement('hr'),
  SelectScrollUpButton: ({ children, ...props }) => React.createElement('div', props, children),
  SelectScrollDownButton: ({ children, ...props }) => React.createElement('div', props, children),
}))

jest.mock('@radix-ui/react-label', () => ({
  Label: ({ children, ...props }) => React.createElement('label', props, children),
}))

jest.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children, ...props }) => React.createElement('div', props, children),
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}