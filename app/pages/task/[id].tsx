import Image from "next/image";
import { Inter } from "next/font/google";
import classNames from "@/utils/classNames";
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { EyeIcon } from '@heroicons/react/20/solid';
import formatDateTime from "@/utils/formatDateTime"
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Status from "@/components/task-view/Status";
import Trigger from "@/components/task-view/Trigger";
import Module from "@/components/task-view/Module";
import Addresses from "@/components/task-view/Addresses";
import useAPI from "@/context/axiosContext";
import { useCall } from "wagmi";


const subMenu = ["Status", "Trigger", "Module", "Addresses"]

export default function TaskPage({ }) {
    const router = useRouter()
    const api = useAPI();
    const [selectedMenu, setSelected] = useState(subMenu[0]);

    /* useMemo make taskname,trigger,accounts,module etc */
    const [taskName, setTaskName] = useState<string>("First Task");
    const [triggerName, setTriggerName] = useState<string>("on-liquidity-add");
    const [moduleName, setModuleName] = useState<string>("buy-token");
    const [addedAddresses, setAddresses] = useState([]);
    const taskId = useMemo(() => (router?.query?.id), [router?.query?.id])
    const [taskRunning, setTaskRunning] = useState<boolean>(false);

    const fetchTaskDetails = useCallback(async () => {
        if (!taskId) return;
        try {
            const response = await api.get(`/tasks/id/${taskId}/get`);
            console.log("response.data 1", response.data)
            if (response.status != 200) return console.error("Error fetching task details", response.data);
            if (response.data?.status != "success") return console.error("Error fetching task details", response.data);


            const task = response.data?.task;
            setTaskRunning(task?.running);
            console.log("task", task)
            setTaskName(task?.name);
            setTriggerName(task?.trigger);
            setModuleName(task?.module);
            setAddresses(task?.addresses);
        } catch (error) {
            // Handle error
            console.log("error", error);
        }
    }, [api, taskId]);
    useEffect(() => {

        if (taskId) {

            fetchTaskDetails();
        }
    }, [api, taskId]);





    return (<main className={`w-full h-full`}>
        <div className="px-4 pt-2 pb-2 relative mx-auto flex justify-between w-full text-white border-b border-b-borderDefault">
            <div className="flex flex-col">
                <div className="text-xl">{taskId} - {taskName}</div>
                <div className="text-xs mt-1 text-textDefault">Manage task below</div>
            </div>
            <div className="flex justify-center items-center">
                {taskRunning && <div className="flex rounded-full bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-400/30">
                    Online
                </div>}

                {!taskRunning && <div className="flex rounded-full bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-400/30">
                    Offline
                </div>}

            </div>

        </div>
        <nav className="flex overflow-x-auto border-b border-white/10 py-1 mt-1" >
            <ul role="list" className="flex min-w-full flex-none gap-x-6 text-sm font-semibold leading-6 text-gray-400 px-4">
                {subMenu.map((name: string, index: number) => (<li onClick={() => setSelected(name)} key={index} className={classNames(selectedMenu == name ? "text-neonGreen" : "hover:text-textDefault", "cursor-pointer ")}>
                    {name}
                </li>))}
            </ul>
        </nav>

        {selectedMenu == "Status" && <Status reload={fetchTaskDetails} taskId={taskId} name={taskName} trigger={triggerName} module={moduleName} />}
        {selectedMenu == "Trigger" && <Trigger taskId={taskId} triggerName={triggerName} />}
        {selectedMenu == "Module" && <Module taskId={taskId} moduleName={moduleName} />}
        {selectedMenu == "Addresses" && <Addresses taskId={taskId} addresses={addedAddresses} reload={fetchTaskDetails} />}

    </main>);
}