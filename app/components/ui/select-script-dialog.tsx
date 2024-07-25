

import { Fragment, use, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import classNames from "@/utils/classNames";
import axios from "axios";
import useAPI from "@/context/axiosContext";

function ScriptEntry({ selected, path }: { selected: boolean, path: string }) {
    return (<div className={
        classNames("hover:bg-neonGreen/25 cursor-pointer py-2 px-4 flex flex-col odd:border-b border-borderDefault last:border-none",
            selected == true ? "bg-neonGreen/25" : "bg-defaultLight"
        )
    }>
        <div className="flex w-full gap-x-4 text-textDefault">
            <label className="text-xs">Script</label>
            <div
                className="text-xs font-mono" >
                {path}
            </div>
        </div>
    </div>);
}


export default function SelectScriptDialog({ filterName, open, close, selectScript }: { filterName: string, open: boolean, close: () => void, selectScript: (path: string) => void }) {
    const [filesFound, setFilesFound] = useState(["path/to/file.js"]);
    const [selectedFile, setSelectedFile] = useState<string>("")
    const [error, setError] = useState<string>("")
    const api = useAPI();

    //axios get request that fetches all scripts from /api/scripts/${filterName} then save in setFilesFound.
    useEffect(() => {

        (async () => {
            try {
                console.log("filterName", filterName);
                const response = await api.get(`/tasks/get-all-${filterName.toLowerCase()}`);
                console.log("response", response);
                if (response.status == 200) {
                    if (response?.data?.status != "success") return setError("Error fetching scripts");
                    console.log("response?.data?.files", response?.data?.files);
                    if (response?.data?.files != undefined) {

                    }
                    setFilesFound([...response?.data?.files]);
                    setError("");
                }
            } catch (error) {
                console.log("error", error);
                setError("Error fetching scripts");

            }
        })()

    }, [api, open, filterName])


    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog className="relative z-10" onClose={() => close?.()}>
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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-defaultLight border-borderDefault border text-left shadow-xl transition-all sm:my-8 w-full sm:w-full sm:max-w-lg">
                                <div className="pb-4 px-4 ">
                                    <div className="flex items-start">
                                        <div className="mt-3 sm:mt-3 text-left">
                                            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-textDefault">
                                                Select {filterName}
                                            </Dialog.Title>
                                            <p className="text-xs text-gray-400">
                                                Select a file from the list below.<br />
                                                Files with {filterName} found:
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="max-h-[60vh] overflow-y-auto">
                                    {filesFound.map((fileName:string, index: number) => (<div key={index} onClick={() => setSelectedFile(selectedFile == fileName ? "" : fileName)}>
                                        <ScriptEntry selected={selectedFile == fileName} path={fileName} />
                                    </div>))}
                                </div>

                                {error != "" && <div className="flex items-center mt-2 text-red-600 text-xs px-4 ">{error}</div>}

                                <div className="mt-1 py-3 gap-x-4 flex flex-row-reverse px-6">
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-1/4 border border-1 hover:bg-default/50 text-textDefault justify-center rounded-md bg-defaultLight border-borderDefault px-3 py-2 text-sm font-semibold shadow-sm outline-none"
                                        onClick={() => close()}
                                    >
                                        Cancel
                                    </button>

                                    {selectedFile != "" && <button
                                        type="button"
                                        className="mt-3 inline-flex w-1/4 border border-1 bg-neonGreen/50 hover:bg-neonGreen/40 text-textDefault justify-center rounded-md border-neonGreen/10 px-3 py-2 text-sm font-semibold shadow-sm outline-none"
                                        onClick={() => selectScript(selectedFile)}
                                    >
                                        Confirm
                                    </button>}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root >
    )
}


