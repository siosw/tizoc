import { useEffect, useState } from 'react'
import {
    AztecSdkUser,
    UserDefiTx,
    UserDefiClaimTx,
    UserPaymentTx,
    UserAccountTx,
} from '@aztec/sdk'
import { ethers } from 'ethers'

type TransactionsProps = {
    user: AztecSdkUser
}

type ReadableTx = {
    txId: String
    txType: String
    txValue: String
    // value: Number
}

function Transactions({ user }: TransactionsProps) {
    const [txs, setTxs] = useState<Array<ReadableTx>>()

    function getTxType(
        tx: UserDefiTx | UserDefiClaimTx | UserAccountTx | UserPaymentTx
    ): String {
        switch (true) {
            case tx instanceof UserDefiTx: {
                return 'defi'
            }
            case tx instanceof UserDefiClaimTx: {
                return 'defi claim'
            }
            case tx instanceof UserPaymentTx: {
                return 'payment'
            }
            case tx instanceof UserAccountTx: {
                return 'account'
            }
        }

        return 'unknown type'
    }

    function getTxValue(
        tx: UserDefiTx | UserDefiClaimTx | UserAccountTx | UserPaymentTx
    ): String {
        // TODO: handle all transaction types here
        if (tx instanceof UserPaymentTx)
            return ethers.utils.formatEther(tx.value.value).toString()

        return 'n/a'
    }

    async function getTxs() {
        const rawTransactions = await user.getTxs()
        setTxs(
            rawTransactions.map((tx) => {
                return {
                    txId: tx.txId.toString(),
                    txType: getTxType(tx),
                    txValue: getTxValue(tx),
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

    if (!txs) return <></>

    return (
        <table className="table-auto text-right">
            <thead>
                <tr className="border-b border-black">
                    <td className="px-4">id</td>
                    <td className="px-4">type</td>
                    <td className="px-4">value</td>
                </tr>
            </thead>
            <tbody>
                {txs.map((tx) => (
                    <tr
                        key={tx.txId.slice(-8)}
                        className="border-b border-gray-300"
                    >
                        <td className="px-4">...{tx.txId.slice(-8)}</td>
                        <td className="px-4">{tx.txType}</td>
                        <td className="px-4">{tx.txValue}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Transactions
