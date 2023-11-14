import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter, Quicksand } from 'next/font/google'
import {GoogleOAuthProvider} from "@react-oauth/google"
import { Toaster } from 'react-hot-toast';
import {QueryClientProvider, QueryClient} from "@tanstack/react-query"
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"

const inter = Inter({ subsets: ['latin'] })
const quickSand = Quicksand({subsets: ['latin']})

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return <div className={quickSand.className}>
    <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId='1015087549286-g06li1adch0958keqa73b8mpgre4afma.apps.googleusercontent.com'>
      <Component {...pageProps} />
      <Toaster />
      <ReactQueryDevtools />
    </GoogleOAuthProvider>
    </QueryClientProvider>
    </div>
}
