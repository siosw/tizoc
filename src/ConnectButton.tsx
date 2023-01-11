import { type Dispatch, type SetStateAction } from 'react'
import { useAccount, useConnect, useProvider } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import {
    createAztecSdk,
    EthersAdapter,
    type EthereumProvider,
    type AztecSdkUser,
    SdkFlavour,
    EthAddress,
} from '@aztec/sdk'

type ConnectButtonProps = {
    setUser: Dispatch<SetStateAction<AztecSdkUser | undefined>>
}

function ConnectButton({ setUser }: ConnectButtonProps) {
    const { address, isConnected } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const provider = useProvider()
    const connector = new InjectedConnector()

    const connectWallet = async () => {
        if (!isConnected) connect()
        console.log({ address })

        const ethereumProvider: EthereumProvider = new EthersAdapter(provider)

        const sdk = await createAztecSdk(ethereumProvider, {
            serverUrl: 'http://localhost:8081',
            pollInterval: 1000,
            memoryDb: true,
            debug: 'bb:*',
            flavour: SdkFlavour.PLAIN,
            minConfirmation: 1,
        })
        await sdk.run()
        console.log({ sdk })

        const ethereumAddress = EthAddress.fromString(address)
        const { publicKey, privateKey } = await sdk.generateAccountKeyPair(
            ethereumAddress,
            await connector.getProvider()
        )
        console.log({ publicKey, privateKey })

        const user = (await sdk.userExists(publicKey))
            ? await sdk.getUser(publicKey)
            : await sdk.addUser(privateKey)

        setUser(user)
    }

    return (
        <>
            <button
                className="absolute top-0 right-4 p-4 border border-black hover:bg-blue-200"
                onClick={() => connectWallet()}
            >
                Connect Wallet
            </button>
        </>
    )
}

export default ConnectButton
