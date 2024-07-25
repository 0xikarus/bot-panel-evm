
import { isBackendConnectedAtom, sidebarState } from '@/state/app';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useAtom, useAtomValue } from 'jotai';
import { useState } from "react";

export default function Navbar() {
    const [sidebarOpen, setSidebarOpen] = useAtom(sidebarState);
    return (<>
        <div className="sticky top-0 z-40 flex h-16 lg:h-0 shrink-0 items-center gap-x-6 border-b border-borderDefault bg-default px-4 shadow-sm sm:px-6 lg:px-8">
            <button type="button" className="-m-2.5 p-2.5 text-white lg:hidden" onClick={() => setSidebarOpen(true)}>
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-5 w-5" aria-hidden="true" />
            </button>
        </div>
    </>)
}