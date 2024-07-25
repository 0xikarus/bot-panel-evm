import { Fragment, useCallback, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Address, generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { extractSubstrings } from "@/utils/extractSubstrings";
import { createPortal } from "react-dom";
import useAPI from "@/context/axiosContext";
import Wallet from "@/pages/wallets";

interface Wallet { privateKey?: string, address: string };

export default function NewWallet({ close, open }: {
    open: boolean, close: () => void
}) {
    const [wallets, setWallet] = useState<Wallet[]>([])
    const api = useAPI();


    const add = useCallback(async () => {
        try {
            const response = await api.post("/accounts/addAccounts", { accounts: [...wallets.filter((e: Wallet) => (e.privateKey != undefined)).map((wallet: Wallet) => (wallet.privateKey))] });
            console.log("response", response);
            if (response.status == 200) {
                close?.();
            }
        } catch (error) {
            alert("Error adding wallets");
            console.error("Error adding wallets", error);
        }
    }, [api, wallets]);


    const addKey = (amount: number = 1) => {

        let keysArr = [];
        for (let index = 0; index < amount; index++) {
            let privateKey = generatePrivateKey()
            let account = privateKeyToAccount(privateKey);
            keysArr.push({ privateKey: privateKey, address: account.address });
        }
        console.log("adding accounts", keysArr);
        setWallet((currentKeys: Wallet[]) => [...currentKeys, ...keysArr])
    }

    const exportWallets = useCallback(() => {
        if (!document) return;

        let csv = "address,privatekey\n";
        for (let index = 0; index < wallets.length; index++) {
            const wallet = wallets[index];
            csv += wallet.address + "," + wallet.privateKey + "\n";
        }

        const element = document.createElement("a");
        const file = new Blob([csv], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "wallets.csv";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }, [wallets]);


    if (typeof window != 'object') return null;
    return (<>
        {createPortal(
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-[100] " onClose={() => close?.()}>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center text-center sm:items-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-sm bg-defaultLight border-borderDefault border text-left shadow-xl transition-all w-full max-w-2xl">
                                    <div className="sm:flex sm:items-start pt-3">
                                        <div className="text-center sm:text-left w-full">
                                            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-textDefault px-4">
                                                New Wallets ({wallets.length})
                                            </Dialog.Title>
                                            <div className="mt-2 flex justify-between items-center px-4">
                                                <p className="text-xs text-gray-400">
                                                    Create new wallets
                                                </p>
                                                <div className="flex gap-x-2">
                                                    <div onClick={() => addKey()} className="px-2 border border-borderDefault text-textDefault text-xs py-1 cursor-pointer hover:bg-default select-none">
                                                        Generate
                                                    </div>
                                                    <div onClick={() => addKey(10)} className="px-2 border border-borderDefault text-textDefault text-xs py-1 cursor-pointer hover:bg-default select-none">
                                                        Generate 10
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-[430px] mt-2 overflow-y-auto overflow-x-hidden">
                                        {wallets.map((wallet: Wallet, index: number) => {
                                            return (
                                                <div className="sm:px-2 lg:px-4 flex flex-col text-textDefault text-xs border-b border-b-borderDefault pb-2 pt-1 last-of-type:border-none">
                                                    <div>
                                                        <div className="text-xs text-gray-400">
                                                            Address
                                                        </div>
                                                        <div className="col-span-2">{wallet.address}</div>
                                                    </div>

                                                    <div>
                                                        <div className="text-xs text-gray-400">
                                                            Private Key
                                                        </div>
                                                        <div className="col-span-2">{wallet.privateKey}</div>
                                                    </div>
                                                </div>
                                            )
                                        })}

                                    </div>
                                    <div className="flex justify-end items-end border-t border-t-borderDefault p-4">
                                        <div className="mt-5 sm:mt-4 flex flex-row-reverse">
                                            {wallets.length > 0 && <button
                                                type="button"
                                                className="ml-4 border border-emerald-900 border-solid bg-emerald-900 bg-opacity-40 hover:bg-opacity-60 text-neutral-200 px-3 py-2 rounded-md"
                                                onClick={() => add?.()}
                                            >
                                                Add {wallets.length} Wallets
                                            </button>}
                                            {wallets.length > 0 && <button
                                                type="button"
                                                className="ml-4 border border-neutral-700 hover:bg-neutral-800 border-solid bg-neutral-900 bg-opacity-40 hover:bg-opacity-60 text-neutral-200 px-3 py-2 rounded-md"
                                                onClick={() => exportWallets?.()}
                                            >
                                                Export
                                            </button>}

                                            <button
                                                type="button"
                                                className="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 px-3 py-2 border-solid rounded-md "
                                                onClick={() => close?.()}
                                            >
                                                Cancel
                                            </button>
                                        </div>

                                    </div>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
            , document.body
        )}
    </>
    )
}