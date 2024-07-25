
import SelectScriptDialog from "@/components/ui/select-script-dialog"
import { useCallback, useState } from "react"
import useAPI from "@/context/axiosContext"




export default function NewTask() {
    const [triggerOpen, setTriggerOpen] = useState<boolean>(false)
    const [moduleOpen, setModuleOpen] = useState<boolean>(false)
    const [startRunning, setStartRunning] = useState<boolean>(false)
    const [name, setName] = useState<string>("")
    const [triggerSelected, setTriggerSelected] = useState<string>("")
    const [moduleSelected, setModuleSelected] = useState<string>("")
    const [error, setError] = useState<string>("")
    const api = useAPI();
    const createTask = useCallback(async () => {
        if (triggerSelected == "" || moduleSelected == "") {
            setError("Please select trigger and module")
            return;
        }
        setError("")


        const response = await api.post("/tasks/create-task", { name, trigger: triggerSelected, module: moduleSelected, running: startRunning });
        if (response.status == 200) {
            const taskId = response.data?.task.id;
            window.location.href = "/task/" + taskId
        } else {
            setError("An error occured while creating the task. Please try again later.")
        }
    }, [api, name, startRunning, triggerSelected, moduleSelected]);
    const validateName = (input: string) => {
        if (input == "") {
            setError("Name can't be empty")
        } else {
            setError("")
        }
        setName(input);
    }

    return (<>
        <SelectScriptDialog filterName="Trigger" open={triggerOpen} close={() => setTriggerOpen(false)} selectScript={(script: string) => {
            setTriggerSelected(script);
            setTriggerOpen(false)
            setError("")

        }} />
        <SelectScriptDialog filterName="Module" open={moduleOpen} close={() => setModuleOpen(false)} selectScript={(script: string) => {
            setModuleSelected(script);
            setModuleOpen(false)
            setError("")
        }} />


        <main className={`w-full`}>
            <div className="flex justify-between items-center px-4 pt-2 pb-2 relative mx-auto w-full text-white border-b border-b-borderDefault">
                <div className="">
                    <div className="text-xl">New Task</div>
                    <div className="text-xs mt-1 text-textDefault">Create a new task</div>
                </div>
            </div>
            <form className="w-full flex flex-col justify-center items-start px-4 max-w-[900px]">
                <div className="flex flex-col w-full md:w-1/2 mt-4">
                    <label className="text-xs text-textDefault">Name*</label>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => validateName(e.target.value)}
                        className="bg-defaultLight hover:bg-defaultLight/25 text-xs text-textDefault w-full mt-1 px-3 py-2 border border-borderDefault rounded-md outline-none" />
                </div>
                <div className="flex flex-col w-full md:w-1/2 mt-4">
                    <div className="text-xs text-textDefault">Trigger</div>
                    <div onClick={() => setTriggerOpen(true)} className="select-none cursor-pointer w-full mt-1 px-3 text-xs py-2 border bg-defaultLight hover:bg-defaultLight/25 text-textDefault border-borderDefault rounded-md outline-none">{triggerSelected != "" ? triggerSelected : "Select"}</div>
                </div>
                <div className="flex flex-col w-full md:w-1/2 mt-4">
                    <div className="text-xs text-textDefault">Module</div>
                    <div onClick={() => setModuleOpen(true)} className="select-none cursor-pointer text-left w-full mt-1 px-3 text-xs py-2 border bg-defaultLight hover:bg-defaultLight/25 text-textDefault border-borderDefault rounded-md outline-none">{moduleSelected != "" ? moduleSelected : "Select"}</div>
                </div>

                <div className="flex justify-start w-full md:w-1/2 mt-4">
                    <div onClick={() => createTask()} className="select-none text-center cursor-pointer w-full bg-neonGreen/50 hover:bg-neonGreen/40 rounded-md px-4 py-2 text-white">Create Task</div>
                </div>
                {error != "" && <div className="text-xs text-red-500 mt-2">{error}</div>}
            </form>
        </main>
    </>)
}


