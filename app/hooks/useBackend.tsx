import { useAtom } from "jotai";
import { isBackendConnectedAtom } from "@/state/app";
import { useEffect, useState } from "react";




export default function useBackend() {
    const [isBackendConnected, setIsBackendConnected] = useAtom(isBackendConnectedAtom);


    return null;
}