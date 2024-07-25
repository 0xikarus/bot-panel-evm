import NewWallet from "@/components/modals/new-wallet";
import { Editor } from "@monaco-editor/react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import classNames from "@/utils/classNames";
import { createPortal } from "react-dom";
import useElementPosition from "@/hooks/useElementPosition"
import { Address, formatUnits } from "viem";
import { createPublicClient, http } from 'viem'
import { arbitrum, base, bsc, mainnet, optimism } from 'viem/chains'
import { useBalance, useCall, usePublicClient } from "wagmi";
import useAPI from "@/context/axiosContext";
import { privateKeyToAddress } from "viem/accounts";




function NetworkIcon({ network }: { network: string }) {
    return (<Image alt={network} height={16} width={16} src={`/images/network/${network}.png`} />)
}

function NetworkSelect({ network, set }: { set: (network: string) => void, network: string }) {
    const [selectOpen, setSelectOpen] = useState(false);

    const dropdownRef = useRef(null);
    const position = useElementPosition(dropdownRef);


    return (<Menu as="div" className="relative inline-block text-left">
        <div >
            <Menu.Button ref={dropdownRef} className="px-2 py-1 border border-borderDefault cursor-pointer flex justify-start items-center gap-x-2">
                <span className="flex lg:hidden">Network</span>
                {network == "eth" && <Image alt="eth" height={16} width={16} src={"/images/network/eth.png"} />}
                {network == "arb" && <Image alt="arb" height={16} width={16} src={"/images/network/arb.png"} />}
                {network == "base" && <Image alt="arb" height={16} width={16} src={"/images/network/base.png"} />}
                {network == "op" && <Image alt="op" height={16} width={16} src={"/images/network/op.png"} />}
            </Menu.Button>
        </div>

        {typeof window === 'object' ? createPortal(<Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <Menu.Items
                style={{
                    top: position.y + position.height,
                    left: position.x
                }}
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right border-borderDefault border rounded-md bg-default text-textDefault shadow-lgfocus:outline-none">

                <Menu.Item >
                    <div onClick={() => set("eth")} className="cursor-pointer hover:bg-neonGreen/25 flex justify-start items-center gap-x-2 py-1 px-2 border-b border-1 border-borderDefault ">
                        <Image alt="eth" height={16} width={16} src={"/images/network/eth.png"} />
                        <span>Ethereum</span>
                    </div>
                </Menu.Item>
                <Menu.Item>
                    <div onClick={() => set("base")} className="cursor-pointer hover:bg-neonGreen/25 flex justify-start items-center gap-x-2 py-1 px-2 border-b border-1 border-borderDefault">
                        <Image alt="base" height={16} width={16} src={"/images/network/base.png"} />
                        <span>Base</span>
                    </div>
                </Menu.Item>
                <Menu.Item>
                    <div onClick={() => set("arb")} className="cursor-pointer hover:bg-neonGreen/25 flex justify-start items-center gap-x-2 py-1 px-2 border-b border-1 border-borderDefault">
                        <Image alt="arb" height={16} width={16} src={"/images/network/arb.png"} />
                        <span>Arbitrum</span>
                    </div>
                </Menu.Item>
                <Menu.Item>
                    <div onClick={() => set("op")} className="cursor-pointer hover:bg-neonGreen/25 flex justify-start items-center gap-x-2 py-1 px-2 ">
                        <Image alt="op" height={16} width={16} src={"/images/network/op.png"} />
                        <span>Optimism</span>
                    </div>
                </Menu.Item>
            </Menu.Items>
        </Transition>, document.body) : null}
    </Menu>);
}

function AddressView({ address, balance, network, update }: { address: Address, network: string, balance: bigint, update: () => void }) {

    const api = useAPI();
    const deleteAddress = useCallback(async (address: Address) => {
        (async () => {
            const response = await api.post("/accounts/delete", {
                address: address
            });
            console.log("delete", response.data);
            if (response.data?.status == "success") {
                update?.();
            }
        })();
    }, [api, update]);
    const downloadAddress = useCallback(async (address: Address) => {
        (async () => {
            const response = await api.post("/accounts/get", {
                address: address
            });
            console.log("delete", response.data);
            if (response.data?.status == "success") {
                if (!document) return;
                let csv = privateKeyToAddress(response.data?.privateKey) + ":" + response.data?.privateKey;

                const element = document.createElement("a");
                const file = new Blob([csv], { type: 'text/plain' });
                element.href = URL.createObjectURL(file);
                element.download = privateKeyToAddress(response.data?.privateKey) + ".csv";
                document.body.appendChild(element);
                element.click();
            }
        })();
    }, [api, update]);

    return (
        <div className="flex flex-col w-full px-4 overflow-x-auto border-b border-white/10 lg:py-1 py-4 items-center justify-between" >
            <div className="grid grid-cols-1 lg:grid-cols-8 w-full text-sm font-semibold leading-6 text-gray-400">
                <div className="lg:col-span-4 font-mono">{address}</div>
                <div className="lg:col-span-3 text-left font-mono flex items-center justify-start gap-x-2">{formatUnits(balance || 0n, 18)} ETH <NetworkIcon network={network} /></div>
                <div className="lg:col-span-1 flex justify-end gap-x-1 items-center">
{/*                   
                    <button className="font-mono bg-sky-900 bg-opacity-40 hover:bg-opacity-60 text-neutral-200 cursor-pointer flex text-sm font-medium justify-center px-3 py-1 text-center border border-sky-900 border-solid rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                        </svg>
                    </button>
                    
                    */}

                    <button onClick={() => downloadAddress(address)} className="font-mono bg-emerald-900 bg-opacity-40 hover:bg-opacity-60 text-neutral-200 cursor-pointer flex text-sm font-medium justify-center px-3 py-1 text-center border border-emerald-900 border-solid rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                    </button>

                    <button onClick={() => deleteAddress(address)} className="font-mono bg-red-900 bg-opacity-40 hover:bg-opacity-60 text-neutral-200 cursor-pointer flex text-sm font-medium justify-center px-3 py-1 text-center border border-red-900 border-solid rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>);

}

export default function Wallet() {

    const [open, setOpen] = useState(false)
    const [selectedNetwork, setSelectedNetwork] = useState("eth")
    const [addresses, setAddresses] = useState<Address[]>([])
    const [balances, setBalances] = useState<bigint[]>([])
    const api = useAPI();


    const chainId = useMemo(() => {
        if (selectedNetwork == "eth") return mainnet.id;
        if (selectedNetwork == "bsc") return bsc.id;
        if (selectedNetwork == "base") return base.id;
        if (selectedNetwork == "arb") return arbitrum.id;
        if (selectedNetwork == "op") return optimism.id;
        return 1;
    }, [selectedNetwork]);
    const publicClient = usePublicClient({
        chainId: chainId
    });

    const loadBalances = useCallback(async () => {
        (async () => {
            try {
                let awaits = [];
                for (let index = 0; index < addresses.length; index++) {
                    const address = addresses[index];

                    const balances = publicClient?.getBalance({address:address});
                    awaits.push(balances);
                }
                const results = await Promise.all(awaits);
                console.log(results);
                setBalances(results as bigint[]);
            } catch (error) {

            }
        })();
    }, [publicClient, addresses]);
    /* Load balances for accouznts in addresses using batch viem */

    /* useEffect that loads all addresses from backend */

    const updateAccounts = useCallback(async () => {
        (async () => {
            try {
                const response = await api.get("/accounts/list");
                console.log(response.data);

                if (response.data?.status == "success") {
                    setAddresses(response.data?.addresses);
                }
            } catch (error) {

            }
        })();
    }, [api]);

    useEffect(() => {
        // Load addresses from backend
        updateAccounts();

    }, [api]);

    return (<>
        <NewWallet open={open} close={() => {
            updateAccounts();
            setOpen(false);
        }} />

        <div className="">
            <div className="flex flex-col w-full px-4 overflow-x-auto border-b border-white/10 py-2 items-center justify-between" >
                <div className="grid grid-cols-4 lg:grid-cols-8 w-full text-sm font-semibold leading-6 text-gray-400">
                    <div className="hidden lg:block col-span-2 lg:col-span-4">Address</div>
                    <div className="hidden col-span-2 lg:col-span-3 text-right lg:text-left lg:flex items-center justify-start gap-x-2">
                        <span>Balance</span>
                        <NetworkSelect set={setSelectedNetwork} network={selectedNetwork} />

                        <div onClick={() => loadBalances()} className="border border-borderDefault cursor-pointer flex justify-start items-center gap-x-2 px-2">
                            Load
                        </div>
                    </div>

                    <div className="col-span-2 lg:hidden flex justify-start gap-x-1 items-center">
                        <NetworkSelect set={setSelectedNetwork} network={selectedNetwork} />

                        <div onClick={() => loadBalances()} className="border border-borderDefault cursor-pointer flex justify-start items-center gap-x-2 py-1 px-2">
                            <span className="flex">Load</span>
                        </div>
                    </div>
                    <div className="col-span-2 lg:col-span-1 flex justify-end gap-x-1 items-center">
                        <button onClick={() => setOpen(true)} className="font-mono bg-emerald-900 bg-opacity-40 hover:bg-opacity-60 text-neutral-200 cursor-pointer flex text-sm font-medium justify-center px-4 text-center border border-emerald-900 border-solid rounded-md">
                            New
                        </button>
                    </div>
                </div>
            </div>
            {addresses.map((address, index) => <AddressView key={index} balance={balances[address as any] || 0n} address={address} network={selectedNetwork} update={updateAccounts} />)}

        </div>
    </>)
}