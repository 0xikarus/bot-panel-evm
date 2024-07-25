import { Editor } from "@monaco-editor/react";
import StartArgument, { Argument } from "../ui/start-argument";
import CodeEditor from "../ui/editor";
import SelectScriptDialog from "../ui/select-script-dialog";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import useParseScript from "@/hooks/useScript";
import { useCall } from "wagmi";
import useAPI from "@/context/axiosContext";
import LogViewer from "../ui/log-viewer";

export default function Trigger({ taskId, triggerName }: { taskId: any, triggerName: string }) {
    const [scriptName, setScriptName] = useState<string>("")
    const [triggerOpen, setTriggerOpen] = useState<boolean>(false)

    const [currentScriptPath, setCurrentScriptPath] = useState<string>(triggerName);
    useEffect(() => {
        setCurrentScriptPath(triggerName);
    }, [triggerName]);
    const [script, setScript] = useState<string>(``);
    const api = useAPI();
    //const [startArguments, setStartArgument] = useState<Argument[]>([]);

    const getTriggerScript = useCallback(async () => {
        try {
            /*const data = {
                code: `// process.argv[0] will always be the accounts private key
import viem from "viem";
const privateKey = process.argv[0];

(async () => {
    const accounts = await viem.getAccounts();
    console.log(accounts);
}`,
                path: "./module/on-liquidity-add.js",
                name: "on-liquidity-add",
                description: "Trigger when liquidity is added with a given pair of tokens",
                arguments: {
                    "token-0": {
                        type: "address",
                        description: "address of token 0",
                        required: true
                    },
                    "token-1": {
                        type: "address",
                        description: "address of token 1",
                        required: false
                    }
                }
            } as any;*/



            /*  
                        
                        setScriptName(data.name)*/
            /* setStartArgument(Object.keys(data.arguments).map((key: string) => {
                 return {
                     name: key,
                     type: data.arguments[key].type,
                     description: data.arguments[key].description,
                     required: data.arguments[key].required
                 }
             }))*/
            const response = await api.get(`/tasks/id/${taskId}/trigger`);
            if (response.status != 200) return console.error("Error fetching trigger script", response.data);
            if (response.data?.status != "success") return console.error("Error fetching trigger script", response.data);
            setScript(response.data.code);

        } catch (error) {
            console.error("Error fetching trigger script");
        }
    }, [api, taskId]);

    useEffect(() => {

        getTriggerScript();
    }, [taskId]);


    const updateLogs = useCallback(async () => {
        try {
            const response = await api.get(`/tasks/id/${taskId}/get-trigger-logs`);
            console.log("response.data.logs", response.data.logs);
            if (response.status != 200 || response.data?.status != "success") {
                console.error("Error fetching logs", response.data);
                return { logs: [] }
            }
            return { logs: response.data.logs };
        } catch (error) {
            console.error("Error fetching logs");
            return { logs: [] };
        }
    }, [api, taskId]);

    const [selectedLogs, setSelectedLogs] = useState<boolean>(false);
    return (<>
        {triggerOpen && <SelectScriptDialog filterName="Trigger" open={triggerOpen} close={() => setTriggerOpen(false)} selectScript={(script: string) => {
            //setCurrentScriptPath(script);
            //setNewScript(script);

            setTriggerOpen(false)
        }} />}

        <div className="flex flex-col">
            <div className="bg-gray-700/10 ">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 px-4 py-4 sm:flex-row sm:items-center">
                        <div>
                            {scriptName != "" && <div className="flex flex-col items-start justify-start gap-x-3">
                                <span className="text-xs text-neutral-400">Name</span>
                                <span className="text-neutral-300 sm:block font-mono">{scriptName}</span>
                            </div>}
                            <div className="flex flex-col items-start justify-start gap-x-3 mt-2">
                                <span className="text-xs text-neutral-400">Script</span>
                                <span className="text-neutral-300 sm:block font-mono">{currentScriptPath}</span>
                            </div>
                            <p className="mt-2 text-xs leading-6 text-gray-400">Trigger decide when a module is executed.</p>
                        </div>
                    </div>


                    <div className="flex flex-col items-start lg:items-end justify-start p-4 gap-y-2">
                        <button onClick={() => setTriggerOpen(true)} className="bg-neutral-900 text-neutral-200 cursor-pointer flex text-sm font-medium justify-center py-1 px-4 text-center w-16 border border-neutral-800 border-solid rounded-md">
                            Edit
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex overflow-x-auto border-t border-white/10 py-1" >
                <div onClick={() => setSelectedLogs(false)} className="cursor-pointer hover:text-gray-200 flex gap-x-6 text-sm font-semibold leading-6 text-gray-400 px-4">
                    <span>Code</span>
                </div>
                <div onClick={() => setSelectedLogs(true)} className="cursor-pointer hover:text-gray-200 flex gap-x-6 text-sm font-semibold leading-6 text-gray-400 px-4">
                    <span>Logs</span>
                </div>
            </div>

            {/*  
            TODO
            <StartArgument args={startArguments} />
            */}
            {!selectedLogs && <CodeEditor code={script} />}
            {selectedLogs && <LogViewer update={updateLogs} interval={5000} />}



        </div >
    </>)
}