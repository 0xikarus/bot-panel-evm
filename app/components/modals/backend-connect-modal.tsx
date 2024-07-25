import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Address, generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { extractSubstrings } from "@/utils/extractSubstrings";
import { createPortal } from "react-dom";
import classNames from "@/utils/classNames";
import { useAtom } from "jotai";
import { backendHostAtom, isBackendConnectedAtom } from "@/state/app";
import axios, { AxiosError } from "axios";
import useAPI from "@/context/axiosContext";


export default function BackendConnectModal({ close }: { close: () => void }) {
    const [connectionType, setConnectionType] = useState('local');
    const [isBackendConnected, setIsBackendConnected] = useAtom(isBackendConnectedAtom)
    const [backendHost, setBackendHost] = useAtom(backendHostAtom)
    const [logs, setLogs] = useState<string[]>(["Init..."])

    // Handle the change event when a radio button is selected
    const handleConnectionTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("handle change", event.target.value)
        setConnectionType(event.target.value);
    };

    const [open, setOpen] = useState(true)
    const cancelButtonRef = useRef(null)

    const updateBackendHost = (newHost: string) => {
        console.log("newHost", newHost);
        const regex = new RegExp('^(https?://)?([a-zA-Z0-9-.]+)(:[0-9]+)?$');
        if (!regex.test(newHost)) {
            return;
        }
        console.log("set host");
        setBackendHost(newHost);
    }


    const api = useAPI();
    const updateStatus = useCallback(() => {
        (async () => {
            setLogs([]);
            if (connectionType === 'remote') {
                // Connect to remote
                console.log("Connecting to host")
                setLogs((logs) => [...logs, "Connecting to host " + backendHost])
                try {
                    const response = await api.post(`${backendHost}/ping`);
                    if (response.status === 200) {
                        setIsBackendConnected(true);
                        setLogs((logs) => [...logs, "Connected to host " + backendHost])
                    } else if (isBackendConnected == true) {
                        setIsBackendConnected(false);
                        setLogs((logs) => [...logs, "Disconnected from host"])
                    }
                } catch (error) {

                    console.log("error", (error as AxiosError));
                    if ((error as AxiosError)?.message === "Network Error") {
                        setLogs((logs) => [...logs, "Connection refused"])
                    } else {
                        setLogs((logs) => [...logs, (error as AxiosError)?.message])
                    }
                }

            } else if (connectionType === 'local') {
                // Connect to local
                console.log("Connecting to local")
                setLogs((logs) => [...logs, "Connecting to local"])
                try {
                    const response = await api.post("http://localhost:3332/auth/ping");
                    console.log("response", response);
                    if (response.status === 200) {
                        if (response.data?.pong == true) {
                            console.log("Connected to local");
                            setIsBackendConnected(true);
                            setLogs((logs) => [...logs, "Connected to local"])

                            setBackendHost("http://127.0.0.1:3332");
                        }
                    } else if (isBackendConnected == true) {
                        setIsBackendConnected(false);
                        setLogs((logs) => [...logs, "Disconnected from local"])
                    }
                } catch (error) {

                    console.log("error", (error as AxiosError)?.message);
                    if ((error as AxiosError)?.message === "Network Error") {
                        setLogs((logs) => [...logs, "Connection refused"])
                    } else {
                        setLogs((logs) => [...logs, (error as AxiosError)?.message])
                    }
                }
            }
        })();
    }, [api, backendHost, isBackendConnected, connectionType]);

    useEffect(() => {
        updateStatus();
    }, [api, backendHost, isBackendConnected, connectionType]);
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog className="relative z-10" initialFocus={cancelButtonRef} onClose={() => false}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-default bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-defaultLight border-borderDefault  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="sm:flex sm:items-start pt-3">
                                    <div className="text-center sm:text-left w-full">
                                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-textDefault px-4">
                                            Backend Connection
                                        </Dialog.Title>
                                        <div className="mt-2 flex justify-between items-center px-4">
                                            <div className="text-xs text-gray-400">
                                                Configure your backend connection
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2 overflow-y-auto overflow-x-hidden">
                                    <div className="flex flex-col items-start justify-center px-4 py-2 text-textDefault gap-y-4">
                                        <label className="inline-flex items-center">
                                            <input type="radio" className="form-radio" name="connectionType" value="local" onChange={handleConnectionTypeChange} />
                                            <div className="flex flex-col pl-2">
                                                <span className="ml-2 text-xs">Local</span>
                                                <span className="ml-2 text-xs">You are using a local instance</span>
                                            </div>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input type="radio" className="form-radio" name="connectionType" value="remote" onChange={handleConnectionTypeChange} />
                                            <div className="flex flex-col pl-2">
                                                <span className="ml-2 text-xs">Remote</span>
                                                <span className="ml-2 text-xs">You are using a remote hosted instance</span>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="px-4 mt-2">
                                        {connectionType == "remote" && <div className="flex flex-col text-textDefault pb-1 ">
                                            <span className="text-xs">Remote Host</span>
                                            <input
                                                type="text"
                                                id="backend-host"
                                                placeholder="127.0.0.1:8545"
                                                onChange={(e) => updateBackendHost(e.target.value)}
                                                className="block w-full rounded-md border-0 bg-default px-2 py-1 text-xs outline-none shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                            />
                                        </div>}




                                        <div className="flex items-start justify-between text-textDefault pb-1 ">
                                            <div className="">
                                                <span className="text-xs pr-2">Connection:</span>
                                                {isBackendConnected && <span className="text-xs text-neonGreen">Connected</span>}
                                                {!isBackendConnected && <span className="text-xs text-neonRed">Disconnected</span>}
                                            </div>
                                            <div className="">
                                                <span onClick={() => updateStatus?.()} className="select-none text-xs px-2 border border-borderDefault cursor-pointer py-1">Reload</span>
                                            </div>
                                        </div>
                                        <div className="text-textDefault pb-1 min-h-[120px]">
                                            <span className="text-xs pr-2">Logs</span>
                                            {/* Add logs read from state in small */}
                                            <span className="text-xs flex flex-col">
                                                {logs.map((log, index) => (
                                                    <span key={index}>{log}</span>
                                                ))}
                                            </span>
                                        </div>
                                    </div>

                                </div>
                                <div className="flex justify-end items-end border-t border-t-borderDefault p-4">
                                    <div className="mt-5 sm:mt-4 flex flex-row-reverse">
                                        <button
                                            onClick={() => close?.()}
                                            type="button"
                                            className="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 px-3 py-2 border-solid rounded-md "
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
    )
}

