import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import BackendConnectModal from "@/components/modals/backend-connect-modal";
import Web3Context from "@/context/web3context";
import { isBackendConnectedAtom } from "@/state/app";
import "@/styles/globals.css";
import { useAtomValue } from "jotai";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
    const backendConnected = useAtomValue<boolean>(isBackendConnectedAtom);
    return (
        <Web3Context>
            <div className=" h-full">
                <Sidebar />
                <div className="lg:pl-72 h-full">
                    <Navbar />

                    {backendConnected == false && <BackendConnectModal close={() => false}/>}
                    <Component {...pageProps} />
                </div>
            </div>
        </Web3Context>
    );
}
