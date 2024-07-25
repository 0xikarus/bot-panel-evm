
import { isValidScript } from "@/hooks/useScript";
import { Editor, useMonaco } from "@monaco-editor/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import debounce from 'lodash.debounce';
import { useCall } from "wagmi";
import axios from "axios";
import useAPI from "@/context/axiosContext";




export default function LogViewer({ update, interval }: { update: () => Promise<any>, interval: number }) {
    const monaco = useMonaco();
    const [logs, setLogs] = useState<string[]>([]);
    const api = useAPI();
    useEffect(() => {
        const updateInterval = setInterval(async () => {
            const logs = await update();
            setLogs(logs.logs);
        }, interval);
        (async () => {
            const logs = await update();
            setLogs(logs.logs);
        })();

        return () => clearInterval(updateInterval);
    }, [interval, update, api]);


    useEffect(() => {
        // do conditional chaining
        //monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
        // or make sure that it exists by other ways
        if (monaco) {

            monaco.editor.defineTheme('bot-theme', {
                base: 'vs-dark',
                inherit: true,
                rules: [],
                colors: {
                    'editor.background': '#0f1011',
                },
            });
            monaco.editor.setTheme('bot-theme');

            monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: true,
                noSyntaxValidation: true,
                validated: false,
            });
            /*monaco.updateOptions({ readOnly: true })*/

        }
    }, [monaco]);


    const code = useMemo(() => {
        return logs.join("");
    }, [logs]);


    return (<>
        <div className="relative flex-grow h-[400px]">
            {/*   <CodeMirror
                lang="javascript"
                value={newScript} height="400px"
                onChange={(value, _) => debouncedChangeHandler(value as string)}
                basicSetup={{ lineNumbers: true }}
            />*/}
            <Editor className="inset-0 h-[400px]"
                theme={"bot-theme"}
                options={{
                    readOnly: true,
                    minimap: { enabled: false },
                }}
                defaultLanguage="typescript"
                value={code}
            />
        </div>
    </>)
}