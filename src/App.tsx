import { useEffect, useState } from 'react'
import { type AztecSdkUser, type AztecSdk } from '@aztec/sdk'
import { ethers } from 'ethers'

import ConnectButton from './ConnectButton'
import DepositForm from './DepositForm'
import Transactions from './Transactions'

export enum StatusEnum {
    Disconnected = 'disconnected - please connect wallet',
    Init = 'initializing aztec user',
    Connected = 'aztec user connected',
}

function App() {
    const [user, setUser] = useState<AztecSdkUser | undefined>()
    const [sdk, setSdk] = useState<AztecSdk | undefined>()
    const [status, setStatus] = useState(StatusEnum.Disconnected)
    const [balance, setBalance] = useState(0)

    useEffect(() => {
        getBalance()
        const balanceInterval = setInterval(getBalance, 3000)

        return () => {
            clearInterval(balanceInterval)
        }
    })

    async function getBalance() {
        if (!user || !sdk) return

        const balance = await user.getBalance(sdk.getAssetIdBySymbol('eth'))
        setBalance(Number(ethers.utils.formatEther(balance.value)))
    }

    return (
        <div className="font-mono p-4 space-y-4">
            <h1>tizoc</h1>
            <p>status: {status}</p>
            <p>balance: {balance} ETH</p>
            <ConnectButton
                setUser={setUser}
                setStatus={setStatus}
                setSdk={setSdk}
                status={status}
            />
            {user && sdk && <DepositForm user={user} sdk={sdk} />}
            {user && <Transactions user={user} />}
        </div>
    )
}

export default App
