import { Editor } from "@monaco-editor/react";
import AddAddress from "@/components/modals/add-address";
import { useCallback, useEffect, useState } from "react";
import { Address } from "viem";
import useAPI from "@/context/axiosContext";

export default function Addresses({ taskId, addresses, reload }: { taskId: string | string[] | undefined, addresses: string[], reload: () => void }) {
    const [allAddresses, setSetAddress] = useState<Address[]>([]);
    const [open, setOpen] = useState(false)
    const api = useAPI();
    useEffect(() => {
        setSetAddress([...addresses as Address[]]);
    }, [addresses]);

    const removeAccountFromTask = useCallback(async (address: Address) => {
        try {
            const response = await api.post(`/tasks/id/${taskId}/remove-address-from-task`, { address });
            if (response.status != 200) return console.error("Error removing address from task", response.data);
            if (response.data?.status != "success") return console.error("Error removing address from task", response.data);

            reload();
        } catch (error) {
            console.log("remove error", error);
        }

    }, [api, taskId, reload]);

    return (<>
        <AddAddress taskId={taskId} open={open} close={() => {
            setOpen(false)
            reload();
        }} addedAccounts={allAddresses} />

        <div className="">
            <div className="flex flex-col w-full px-4 overflow-x-auto border-b border-white/10 py-2 items-center justify-between" >
                <div className="grid grid-cols-4 lg:grid-cols-8 w-full text-sm font-semibold leading-6 text-gray-400">
                    <div className="hidden lg:block col-span-2 lg:col-span-3">Address</div>
                    <div className="hidden lg:block col-span-2 lg:col-span-2 text-right lg:text-left ">Balance</div>
                    <div className="hidden lg:block col-span-2 lg:col-span-2">Label</div>
                    <div className="col-span-4 lg:col-span-1 flex justify-end gap-x-1 items-center">
                        <button onClick={() => setOpen(true)} className="font-mono bg-emerald-900 bg-opacity-40 hover:bg-opacity-60 text-neutral-200 cursor-pointer flex text-sm font-medium justify-center px-4 text-center border border-emerald-900 border-solid rounded-md">
                            Add
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-full overflow-x-auto items-center justify-between" >
                {allAddresses.map((address: Address, index: number) => (
                    <div key={index} className="lg:py-1 py-4 grid grid-cols-1 px-4 lg:grid-cols-4 w-full text-sm font-semibold leading-6 text-gray-400  border-b border-white/10 ">
                        <div className="lg:col-span-3 font-mono">{address}</div>
                        <div className="lg:col-span-1 flex justify-end gap-x-1 items-center">
                            <button onClick={() => removeAccountFromTask(address)} className="font-mono bg-red-900 bg-opacity-40 hover:bg-opacity-60 text-neutral-200 cursor-pointer flex text-sm font-medium justify-center px-2 text-center border border-red-900 border-solid rounded-md">
                                Remove
                            </button>
                            {/*                            <button className="font-mono bg-emerald-900 bg-opacity-40 hover:bg-opacity-60 text-neutral-200 cursor-pointer flex text-sm font-medium justify-center px-4 text-center border border-emerald-900 border-solid rounded-md">
                                View
                            </button>*/}
                        </div>
                    </div>))}
            </div>
        </div>
    </>)
}