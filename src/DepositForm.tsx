import { useState, FormEvent } from 'react'
import {
    AssetValue,
    AztecSdk,
    EthAddress,
    GrumpkinAddress,
    TxSettlementTime,
    TxId,
    AztecSdkUser,
} from '@aztec/sdk'
import { useAccount } from 'wagmi'
import { ethers } from 'ethers'
import { GetAccountResult } from '@wagmi/core'

type DepositFormProps = {
    user: AztecSdkUser
    sdk: AztecSdk
}

async function depositEthToAztec(
    depositor: EthAddress,
    recipient: GrumpkinAddress,
    tokenQuantity: bigint,
    settlementTime: TxSettlementTime,
    sdk: AztecSdk,
    account: GetAccountResult
): Promise<TxId> {
    const tokenAssetId = sdk.getAssetIdBySymbol('ETH')
    const tokenDepositFee = (await sdk.getDepositFees(tokenAssetId))[
        settlementTime
    ]
    const tokenAssetValue: AssetValue = {
        assetId: tokenAssetId,
        value: tokenQuantity,
    }
    const tokenDepositController = sdk.createDepositController(
        depositor,
        tokenAssetValue,
        tokenDepositFee,
        recipient,
        true,
        await account.connector?.getProvider()
    )
    await tokenDepositController.createProof()
    await tokenDepositController.sign()
    await tokenDepositController.getPendingFunds()
    if ((await tokenDepositController.getPendingFunds()) < tokenQuantity) {
        await tokenDepositController.depositFundsToContract()
        await tokenDepositController.awaitDepositFundsToContract()
    }
    let txId = await tokenDepositController.send()
    return txId
}

function DepositForm({ user, sdk }: DepositFormProps) {
    const [amount, setAmount] = useState(0)
    const account = useAccount()

    function handleChange(event: FormEvent) {
        const element = event.target as HTMLFormElement
        setAmount(Math.max(0, element.value))
    }

    const ethereumAddress = EthAddress.fromString(account.address)
    function handleSubmit(event: FormEvent) {
        event.preventDefault()
        depositEthToAztec(
            ethereumAddress,
            user.id,
            ethers.utils.parseEther(amount.toString()).toBigInt(),
            TxSettlementTime.INSTANT,
            sdk,
            account
        )
    }

    return (
        <form className="space-x-4" onSubmit={handleSubmit}>
            <label>
                <input
                    className="border border-black p-4"
                    type="number"
                    step="0.01"
                    name="amount"
                    onChange={handleChange}
                />
            </label>
            <input
                className="border border-black p-4 hover:cursor-pointer hover:bg-blue-200"
                type="submit"
                value="deposit"
            />
        </form>
    )
}

export default DepositForm
