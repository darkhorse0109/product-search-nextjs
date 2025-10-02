import { type PropsWithChildren } from 'react'
import ReactQueryProvider from '@/providers/react-query-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { AuthProvider } from '@/providers/auth-provider'

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}