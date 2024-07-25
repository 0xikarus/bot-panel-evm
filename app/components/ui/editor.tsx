
import { isValidScript } from "@/hooks/useScript";
import { Editor, useMonaco } from "@monaco-editor/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import debounce from 'lodash.debounce';
import { useCall } from "wagmi";
import axios from "axios";




export default function CodeEditor({ code, onSave }: { code: string, onSave?: (updatedCode: string) => void }) {
    const monaco = useMonaco();


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

        }
    }, [monaco]);
    const [newScript, setNewScript] = useState<string>(code);

    useEffect(() => {
        setNewScript(code);
    }, [code]);

    const hasCodeChanges = useMemo(() => {
        return code !== newScript;
    }, [code, newScript]);


    const changeHandler = (code: string) => {
        setNewScript(code);
    };

    const debouncedChangeHandler = useCallback(
        debounce(changeHandler, 300)
        , []);


    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault(); // Prevent the browser's save dialog
                // Call your custom function here
                console.log('Ctrl+S is pressed!');
            }
        };

        // Add event listener
        document.addEventListener('keydown', handleKeyDown);

        // Cleanup function to remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (<>
        <div className="flex min-w-full items-center justify-between px-2 py-1 h-12" >
            <div className="font-mono flex flex-none gap-x-6 text-sm font-semibold leading-6 text-gray-400 px-2">
                {hasCodeChanges && <span className="text-red-400">Unsaved changes</span>}
                {!hasCodeChanges && <span className="text-neutral-400">No changes</span>}
            </div>
            {/* TODO */}
            {hasCodeChanges && <button className="font-mono bg-emerald-900 bg-opacity-40 hover:bg-opacity-60 text-neutral-200 cursor-pointer flex text-sm font-medium justify-center py-1 my-1 px-4 text-center w-16 border border-emerald-900 border-solid rounded-md">
                Save
            </button>}

        </div >

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
                    minimap: { enabled: false },
                }}
                defaultLanguage="typescript"
                value={newScript}
                onChange={(value, _) => debouncedChangeHandler(value as string)}
            />
        </div>
    </>)
}