// Root layout intentionally delegates html/body to [locale]/layout.tsx
// This is the recommended pattern for next-intl App Router setups
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
