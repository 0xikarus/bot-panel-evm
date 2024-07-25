import Image from "next/image";
import { Inter } from "next/font/google";
import classNames from "@/utils/classNames";
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { EyeIcon } from '@heroicons/react/20/solid';
import formatDateTime from "@/utils/formatDateTime"
import Link from "next/link";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import useAPI from "@/context/axiosContext";

const inter = Inter({ subsets: ["latin"] });



const statuses: any = { Completed: 'text-green-400 bg-green-400/10', Error: 'text-rose-400 bg-rose-400/10' }
/*
const tasks = [
    {
        id: 0,
        name: "Test Task",
        trigger: "time",
        module: "swap",
        active: false,
        addresses: 100,
        lastExecuted: Date.now() - (Math.random() * 1000 * 60 * 10)
    },
    {
        id: 1,
        name: "Test Task 1",
        trigger: "enable-trade",
        module: "snipe",
        active: true,
        addresses: 100
    }, ,
    {
        id: 1,
        name: "Test Task 1",
        trigger: "enable-trade",
        module: "snipe",
        active: true,
        addresses: 100
    },

]*/

function Task({ task }: { task: any }) {

    const trigger = useMemo(() => {
        const regex = /([^\/]+)$/;
        const match = task?.trigger.match(regex);
        return match ? match[1] : task?.trigger;
    }, [task?.trigger]);

    const module = useMemo(() => {
        const regex = /([^\/]+)$/;
        const match = task?.module.match(regex);
        return match ? match[1] : task?.module;
    }, [task?.module]);


    return (<div className={`flex w-full px-2 py-2 text-neutral-200 relative items-center hover:bg-defaultLight border-b border-b-borderDefault`}>
        <div className={classNames(
            task.active ? 'text-green-400 bg-green-400/10' : false,
            !task.active ? 'text-rose-400 bg-rose-400/10' : false,
            'lg:hidden flex-none rounded-full p-1')}>
            <div className="h-2 w-2 rounded-full bg-current" />
        </div>


        <div className="pl-4 lg:pl-0 grid grid-cols-2 lg:grid-cols-4 w-full">
            <div className="flex justify-start items-center gap-x-4 py-1">
                <div className={classNames(
                    task.running ? 'text-green-400 bg-green-400/10' : false,
                    !task.running ? 'text-rose-400 bg-rose-400/10' : false,
                    'flex-none rounded-full p-1 hidden lg:block')}>
                    <div className="h-2 w-2 rounded-full bg-current" />
                </div>

                <div className="flex flex-col">
                    <div className="text-xs text-textDefault">Name</div>
                    <div>{task?.name}</div>
                </div>
            </div>
            <div className="flex flex-col py-1">
                <div className="text-xs text-textDefault">Trigger</div>
                <div className="text-neutral-200 sm:block font-mono ">{trigger}</div>
            </div>
            <div className="flex flex-col py-1">
                <div className="text-xs text-textDefault">Module</div>
                <div className="text-neutral-200 sm:block font-mono">{module}</div>
            </div>
            <div className="flex-col py-1 hidden lg:flex">
                <div className="text-xs text-textDefault">Addresses</div>
                <div className="text-neutral-200 sm:block font-mono">{task?.addresses.length || 0}</div>
            </div>
            {/*<div className="flex flex-col py-1">
                <div className="text-xs text-textDefault">New Logs</div>
                <div className="text-neutral-200 sm:block font-mono">0<span className="text-xs">/10000</span></div>
            </div>*/}
        </div>

        <Link href={`./task/${task.id}`} className="font-mono bg-emerald-900 bg-opacity-40 hover:bg-opacity-60 text-neutral-200 cursor-pointer flex text-sm font-medium justify-center px-4 py-2 text-center border border-emerald-900 border-solid rounded-md">
            <EyeIcon className="h-4 w-4 mr-2 translate-y-[2px]" />
            <span className="-translate-y-[1px]">Open</span>
        </Link>
    </div>);
}
export default function Home() {
    const api = useAPI();

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await api.get("/tasks/list");
                if (response.status == 200) {
                    console.log(response?.data);
                    console.log("response?.data", response?.data);
                    if (response?.data?.status == "success" && response?.data?.tasks.length > 0) {

                        let _tasks = response?.data?.tasks;
                        setTasks(_tasks.map((task: any) => {
                            return {
                                id: task.id,
                                name: task.name,
                                trigger: task.trigger,
                                module: task.module,
                                running: task.running,
                                addresses: task.addresses,
                            };
                        }));
                    }
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, [api]);

    // Rest of the code...


    return (
        <main className={`w-full`}>
            <div className="flex justify-between items-center px-4 pt-2 pb-2 relative mx-auto w-full text-white border-b border-b-borderDefault">
                <div className="">
                    <div className="text-xl">Tasks</div>
                    <div className="text-xs mt-1 text-textDefault">Click Task to view</div>
                </div>
                <Link href={`./task/new`} className="flex items-center font-mono bg-gray-500 bg-opacity-40 hover:bg-opacity-60 text-neutral-200 cursor-pointer text-sm font-medium justify-center px-4 py-1 pt-1 text-center border border-gray-600 border-solid rounded-md">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    <span className="">New</span>
                </Link>
            </div>
            {tasks.map((task: any, index: number) => {
                return (<Task key={index} task={task} />)
            })}

        </main>
    );
}
