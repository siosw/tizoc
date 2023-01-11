import React from 'react'
import ReactDOM from 'react-dom/client'

import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { localhost } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

import App from './App'
import './index.css'

const { provider, webSocketProvider } = configureChains(
    [localhost],
    [publicProvider()]
)

const client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <WagmiConfig client={client}>
            <App />
        </WagmiConfig>
    </React.StrictMode>
)
