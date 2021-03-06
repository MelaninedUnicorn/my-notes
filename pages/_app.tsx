import '../src/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'theme-ui'
import {theme} from '../src/theme'
import Layout from '../src/components/Common/Layout'

function MyApp({ Component, pageProps }: AppProps) {
  
    return <ThemeProvider data-testid={"theme-provider"} theme={theme}>
        <Layout >
            <Component data-testid={"component"} {...pageProps} />
        </Layout>
    </ThemeProvider>
}
export const baseUrl = process.env.NODE_ENV ==="development" ? "http://localhost:3000/" : "https://my-notes-nine.vercel.app/"
export default MyApp
