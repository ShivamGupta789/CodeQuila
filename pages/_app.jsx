import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Multimodal – TrustLens Engine</title>
        <meta name="description" content="Multimodal Deepfake Detection Engine - Futuristic AI Cybersecurity Platform" />
      </Head>
      <main className={`${inter.variable} font-sans bg-[#020710] text-[#e0e7ff]`}>
        <Component {...pageProps} />
      </main>
    </>
  )
}
