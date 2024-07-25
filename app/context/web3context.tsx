import { http, createConfig } from 'wagmi'
import { arbitrum, base, bsc, mainnet, optimism, sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { ReactNode } from "react"
import { waitForDebugger } from "inspector"
import { multicall } from "viem/actions"

const config = createConfig({
    chains: [mainnet, arbitrum, base, bsc, optimism],

    batch: {
        multicall: {
            batchSize: 5000,
            wait: 1000
        }
    },
    transports: {
        [mainnet.id]: http(),
        [bsc.id]: http(),
        [arbitrum.id]: http(),
        [base.id]: http(),
        [optimism.id]: http(),
    },
})

const queryClient = new QueryClient()

export default function Web3Context({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={config} initialState={{
            connections: [] as any,
            current: null,
            chainId: 1,
            status: "disconnected"
        }}
            reconnectOnMount={false} >
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}