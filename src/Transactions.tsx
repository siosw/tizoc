import { useEffect, useState } from 'react'
import {
    AztecSdkUser,
    UserDefiTx,
    UserPaymentTx,
    UserAccountTx,
} from '@aztec/sdk'
import { ethers } from 'ethers'

type TransactionsProps = {
    user: AztecSdkUser
}

type ReadableTx = {
    txId: String
    // value: Number
}

function Transactions({ user }: TransactionsProps) {
    const [txs, setTxs] = useState<Array<ReadableTx>>()

    async function getTxs() {
        const rawTransactions = await user.getTxs()
        setTxs(
            rawTransactions.map((tx) => {
                return {
                    txId: tx.txId.toString(),
                }
            })
        )
    }

    useEffect(() => {
        getTxs()
        const txsInterval = setInterval(getTxs, 3000)

        return () => {
            clearInterval(txsInterval)
        }
    })
    return <div>
      { txs && txs.map(tx => <div  >{ tx.txId }</div>) }
    </div>
}

export default Transactions
