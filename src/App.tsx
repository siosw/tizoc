import { useState } from 'react'
import { type AztecSdkUser } from '@aztec/sdk'

import ConnectButton from './ConnectButton'

function App() {
    const [user, setUser] = useState<AztecSdkUser | undefined>()

    return (
        <div className="font-mono p-4 space-y-4">
            <h1>tizoc</h1>
            <p>user connected: {!!user ? 'true' : 'false'}</p>
            <ConnectButton setUser={setUser} />
        </div>
    )
}

export default App
