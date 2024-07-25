import { Editor } from "@monaco-editor/react";
import StartArgument, { Argument } from "../ui/start-argument";
import CodeEditor from "../ui/editor";
import { useCallback, useEffect, useState } from "react";
import useParseScript from "@/hooks/useScript";
import axios from "axios";
import { useCall } from "wagmi";
import SelectScriptDialog from "../ui/select-script-dialog";
import useAPI from "@/context/axiosContext";
import LogViewer from "../ui/log-viewer";

export default function Module({ taskId, moduleName }: { taskId: any, moduleName: string }) {
    const [scriptName, setScriptName] = useState<string>("")
    const [triggerOpen, setModuleOpen] = useState<boolean>(false)

    const [currentScriptPath, setCurrentScriptPath] = useState<string>("");
    useEffect(() => {
        console.log("moduleName", moduleName);
        setCurrentScriptPath(moduleName);
    }, [moduleName]);

    const api = useAPI();
    const [script, setScript] = useState<string>(``);
    /*


    const [startArguments, setStartArgument] = useState<Argument[]>([]);

    const getTriggerScript = async () => {
        try {
            const data = {
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
            } as any;

            setScriptName(data.name)
            setStartArgument(Object.keys(data.arguments).map((key: string) => {
                return {
                    name: key,
                    type: data.arguments[key].type,
                    description: data.arguments[key].description,
                    required: data.arguments[key].required
                }
            }))

            setScript(data.code);
            setCurrentScriptPath(data?.path || "./path/not/found.js");

        } catch (error) {
            console.error("Error fetching trigger script");
        }
    }

    useEffect(() => {

        getTriggerScript();
    }, [taskId]);

    const setNewScript = useCallback(async (scriptName: string) => {
        try {
            const response = await axios.post(`/api/tasks/${taskId}/trigger`, { scriptName: scriptName });
            if (response.status == 200) {
                setScript(script);
            }
        } catch (error) {
            console.error("Error setting trigger script");
        }
    }, [taskId]);*/
    //const [startArguments, setStartArgument] = useState<Argument[]>([]);

    const getTriggerScript = useCallback(async () => {
        try {
            const response = await api.get(`/tasks/id/${taskId}/module`);
            if (response.status != 200) return console.error("Error fetching module script", response.data);
            if (response.data?.status != "success") return console.error("Error fetching module script", response.data);
            setScript(response.data.code);

        } catch (error) {
            console.error("Error fetching trigger script");
        }
    }, [api, taskId]);

    useEffect(() => {

        getTriggerScript();
    }, [taskId]);

    const [selectedLogs, setSelectedLogs] = useState<boolean>(false);
    const updateLogs = useCallback(async () => {
        try {
            const response = await api.get(`/tasks/id/${taskId}/get-module-logs`);
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


    return (<>
        {triggerOpen && <SelectScriptDialog filterName="Module" open={triggerOpen} close={() => setModuleOpen(false)} selectScript={(script: string) => {
            //setCurrentScriptPath(script);
            /*setNewScript(script);*/

            setModuleOpen(false)
        }} />}


        <div className="flex flex-col">
            <div className="bg-defaultLight">
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
                            <p className="mt-2 text-xs leading-6 text-gray-400">Module script is executed by trigger for each address</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-start lg:items-end justify-start p-4 gap-y-2">
                        <button className="bg-neutral-900 text-neutral-200 cursor-pointer flex text-sm font-medium justify-center py-1 px-4 text-center w-16 border border-neutral-800 border-solid rounded-md">
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
        </div>
    </>)
}