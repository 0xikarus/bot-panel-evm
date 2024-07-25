import { backendHostAtom } from "@/state/app";
import axios from 'axios';
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";

function useAPI() {
    const backendHost = useAtomValue(backendHostAtom);

    const apiClient = useMemo(() => {
        return axios.create({
            baseURL: backendHost,
            headers: {
                'Content-Type': 'application/json'
            },
            validateStatus: function (status) {
                return status >= 200;
            }
        });
    }, [backendHost]);

    return apiClient;
}
export default useAPI;
