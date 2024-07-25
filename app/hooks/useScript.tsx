import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export async function isValidScript(script: string) {
    return new Promise((resolve, reject) => {
        const blob = new Blob([script], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);

        import(/* webpackIgnore: true */ url).then((module: any) => {
            URL.revokeObjectURL(url); // Clean up the URL object
            return resolve([true,null]);
        }).catch(error => {
            console.error('Error importing module:', error);
            return resolve([false,error]);
        });
    });
}

export default function useParseScript(script: string): { module: any } {
    const [module, setModule] = useState<any>(undefined);


    useEffect(() => {
        console.log("script", script);
        const blob = new Blob([script], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);

        import(/* webpackIgnore: true */ url).then((module: any) => {
            console.log(module);
            setModule(module);
            URL.revokeObjectURL(url); // Clean up the URL object
        }).catch(error => {
            console.error('Error importing module:', error);
        });
    }, [script]);

    return { module: module };
}