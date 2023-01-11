import { useState } from 'react'
import { type AztecSdkUser } from '@aztec/sdk'

import ConnectButton from './ConnectButton'

export enum StatusEnum {
    Disconnected = 'disconnected - please connect wallet',
    Init = 'initializing aztec user',
    Connected = 'aztec user connected',
}

function App() {
    const [user, setUser] = useState<AztecSdkUser | undefined>()
    const [status, setStatus] = useState(StatusEnum.Disconnected)

    return (
        <div className="font-mono p-4 space-y-4">
            <h1>tizoc</h1>
            <p>status: {status}</p>
            <ConnectButton setUser={setUser} setStatus={setStatus} status={status}/>
        </div>
    )
}

export default App
