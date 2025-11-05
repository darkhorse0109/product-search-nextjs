import { type PropsWithChildren } from 'react'
import ReactQueryProvider from '@/providers/react-query-provider'
import ReduxProvider from "@/providers/redux-provider";
import { ThemeProvider } from '@/providers/theme-provider'
import { AuthProvider } from '@/providers/auth-provider'

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <ReactQueryProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </ReactQueryProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}