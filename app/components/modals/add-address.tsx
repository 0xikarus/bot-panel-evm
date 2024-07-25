import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { createPortal } from "react-dom"
import { Address } from "viem"
import axios from "axios"
import useAPI from "@/context/axiosContext"
import { useCall } from "wagmi"


export default function AddAddress({ taskId, close, open, addedAccounts }: {
    taskId: any,
    open: boolean, close: () => void,
    addedAccounts: Address[]
}) {
    const api = useAPI();
    const [wallets, setWallets] = useState<string[]>([]);
    const [toggledAddresses, setToggledAddresses] = useState<string[]>([]);

    const toggleAddress = useCallback((address: string) => {
        if (toggledAddresses.includes(address)) {
            setToggledAddresses(toggledAddresses.filter(addr => addr !== address));
        } else {
            setToggledAddresses([...toggledAddresses, address]);
        }
    }, [toggledAddresses]);



    const updateAccounts = useCallback(async () => {
        (async () => {
            try {
                const response = await api.get("/accounts/list");
                if (response.data?.status == "success") {
                    console.log("response.data?.addresses", response.data?.addresses);
                    setWallets([...response.data?.addresses]);
                }
            } catch (error) {

            }
        })();
    }, [api]);

    useEffect(() => {
        updateAccounts();
    }, [api]);


    const add = useCallback(async () => {
        try {
            console.log("toggledAddresses", toggledAddresses);
            const response = await api.post(`/tasks/id/${taskId}/add-addresses-to-task`, { addresses: toggledAddresses });
            console.log("response", response);
            if (response.status == 200) {
                close?.();
            }
        }
        catch (error) {
            alert("Error adding wallets");
            console.error("Error adding wallets", error);
        }
    }, [api, taskId, toggledAddresses]);
    const unusedAddresses = useMemo(() => {
        return wallets.filter((wallet: string) => !addedAccounts.includes(wallet as Address));
    }, [wallets, addedAccounts]);


    const selectedCount = useMemo(() => {
        console.log("unusedAddresses", unusedAddresses);
        return unusedAddresses.length;
    }, [unusedAddresses]);


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
                                <Dialog.Panel className="relative transform overflow-hidden rounded-sm bg-defaultLight border-borderDefault border text-left shadow-xl transition-all w-full max-w-md md:max-w-2xl ">
                                    <div className="sm:flex sm:items-start pt-3">
                                        <div className="text-center sm:text-left w-full">
                                            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-textDefault px-4">
                                                Add Addresses to Task
                                            </Dialog.Title>
                                        </div>
                                    </div>

                                    <div className="h-[430px] mt-2 overflow-y-auto overflow-x-hidden px-2">
                                        {unusedAddresses.map((wallet: any, index: number) => {
                                            return (
                                                <div key={index} onClick={() => toggleAddress(wallet)} className="cursor-pointer sm:px-2 lg:px-4 flex items-center hover:bg-[rgb(15,15,15)] justify-between text-textDefault text-xs border-b border-b-borderDefault pb-2 pt-2 last-of-type:border-none">
                                                    <div className="flex flex-col">
                                                        <div className="text-xs text-gray-400">
                                                            Address
                                                        </div>
                                                        <div className="col-span-2">{wallet}</div>
                                                    </div>

                                                    <div className="col-span-2 flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id={`address-${index}`}
                                                            checked={toggledAddresses.includes(wallet)}
                                                            onChange={() => toggleAddress(wallet)}
                                                            className="hidden"
                                                        />
                                                        <label htmlFor={`address-${index}`} className="relative cursor-pointer">
                                                            <div className={`w-[32px] h-[32px] flex justify-center items-center rounded-md bg-gray-700/10 relative`}>
                                                                {toggledAddresses.includes(wallet) && (
                                                                    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                                        <path color="rgb(31, 249, 173)" strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        </label>
                                                    </div>

                                                </div>
                                            )
                                        })}

                                    </div>
                                    <div className="flex justify-end items-end border-t border-t-borderDefault p-4">
                                        <div className="mt-5 sm:mt-4 flex flex-row-reverse">
                                            {selectedCount > 0 && <button
                                                type="button"
                                                className="ml-4 border border-emerald-900 border-solid bg-emerald-900 bg-opacity-40 hover:bg-opacity-60 text-neutral-200 px-3 py-2 rounded-md"
                                                onClick={() => add?.()}
                                            >
                                                Add
                                            </button>}

                                            <button
                                                type="button"
                                                className="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 px-3 py-2 border-solid rounded-md "
                                                onClick={() => close?.()}
                                            >
                                                Close
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

        {/*{createPortal(
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => close?.()}>
                    <div className="fixed inset-0" />

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-300"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-300"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl pt-16">
                                        <div className="flex h-full flex-col overflow-y-scroll bg-defaultLight py-6 shadow-xl">
                                            <div className="px-4 sm:px-6">
                                                <div className="flex items-start justify-between text-textDefaultWhite">
                                                    <Dialog.Title className="text-base font-semibold leading-6 ">
                                                        Select addresses to add
                                                    </Dialog.Title>
                                                    <div className="ml-3 flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            className="rounded-md text-neutral-400 hover:text-gray-500 "
                                                            onClick={() => close?.()}
                                                        >
                                                            <span className="sr-only">Close panel</span>
                                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative mt-6 flex-1 px-4 sm:px-6">ASDF</div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
            ,document.body
        )}*/}
    </>)
}