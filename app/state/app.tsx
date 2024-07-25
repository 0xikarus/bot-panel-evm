import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'

export const sidebarState = atom(false);
export const isBackendConnectedAtom = atom(false);
export const backendHostAtom = atomWithStorage("backendHost", "127.0.0.1:2333");