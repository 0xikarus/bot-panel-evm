import useAPI from "@/context/axiosContext";
import { useCallback } from "react";

export default function Status({ reload, taskId, name, trigger, module }: { reload: () => void, taskId: any, name: string, trigger: string, module: string }) {
    console.log("name", name);

    const api = useAPI();
    const enableTask = useCallback(async () => {
        try {
            const response = await api.post(`/tasks/id/${taskId}/enable`);
            if (response.status != 200) return console.error("Error enabling task", response.data);
            if (response.data?.status != "success") return console.error("Error enabling task", response.data);
            console.log("Task enabled", response.data);

            reload?.();

        } catch (error) {
            console.error("Error enabling task");
        }
    }, [api, reload,taskId]);


    const disableTask = useCallback(async () => {
        try {
            const response = await api.post(`/tasks/id/${taskId}/disable`);
            if (response.status != 200) return console.error("Error disabling task", response.data);
            if (response.data?.status != "success") return console.error("Error disabling task", response.data);
            console.log("Task disabled", response.data);
            reload?.();

        } catch (error) {
            console.error("Error disabling task");
        }
    }, [api, reload,taskId]);
    return (<div>
        <div className="bg-defaultLight">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 px-4 py-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex flex-col items-start justify-start gap-x-3">
                            <span className="text-xs text-neutral-400">Name</span>
                            <span className="text-neutral-300 sm:block font-mono">{name}</span>
                        </div>
                        <div className="flex flex-col items-start justify-start gap-x-3 mt-2 ">
                            <span className="text-xs text-neutral-400">Trigger</span>
                            <span className="text-neutral-300 sm:block font-mono">{trigger}</span>
                        </div>
                        <div className="flex flex-col items-start justify-start gap-x-3 mt-2 ">
                            <span className="text-xs text-neutral-400">Module</span>
                            <span className="text-neutral-300 sm:block font-mono">{module}</span>
                        </div>
                        <p className="mt-2 text-xs leading-6 text-gray-400">Tasks are executed as long as the trigger is online</p>
                    </div>
                </div>
                <div className="flex flex-col items-start lg:items-end justify-start p-4 gap-y-2">
                    <button onClick={() => enableTask()} className="bg-emerald-900 text-neutral-200 cursor-pointer flex text-sm font-medium h-9 justify-center py-2 px-4 text-center w-16 border border-emerald-900 bg-opacity-50 border-solid rounded-md">
                        Start
                    </button>
                    <button onClick={() => disableTask()} className="bg-red-900 text-neutral-200 cursor-pointer flex justify-center items-center text-sm font-medium h-9 py-2 px-4 text-center w-16 border border-red-900 bg-opacity-50 border-solid rounded-md">
                        Stop
                    </button>
                </div>
            </div>
        </div>
        {/*<div className="flex flex-col overflow-x-auto mt-1" >
            <div className="pb-1 flex min-w-full flex-none gap-x-6 text-sm font-semibold leading-6 text-gray-400 px-4">
                Logs
            </div>
            <div className=" bg-defaultLight">

            </div>

        </div >*/}
    </div>)
}