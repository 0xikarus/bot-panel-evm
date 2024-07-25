import classNames from "@/utils/classNames";

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
    ChartBarSquareIcon,
    Cog6ToothIcon,
    FolderIcon,
    GlobeAltIcon,
    ServerIcon,
    SignalIcon,
    BanknotesIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useAtom } from "jotai";
import { sidebarState } from "@/state/app";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navigation = [
    { name: 'Tasks', href: '/', icon: FolderIcon, current: true },
    { name: 'Wallets', href: '/wallets', icon: ServerIcon, current: false },
]

function SidebarInner() {
    const pathname = usePathname()
    return (<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-default ring-1 ring-white/10">
            <div className="flex h-16 shrink-0 items-center justify-start px-4">
                <span className="text-white text-lg">Bot Runner</span>
            </div>
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7 w-full">
                    <li>
                        <ul role="list">
                            {navigation.map((item) => (
                                <li key={item.name} className="px-2 py-2 lg:py-0">
                                    <Link
                                        href={item.href}
                                        className={classNames(
                                            (
                                                (item.href.indexOf(pathname) > -1 && (pathname != "/")) ||
                                                ((pathname == "/" && item.href == "/"))

                                            )
                                                ? 'bg-neonGreen/15 text-neonGreen'
                                                : 'text-gray-400 hover:text-white hover:bg-defaultLight',
                                            'group flex gap-x-3 text-sm leading-6 font-semibold py-2 px-2 rounded-sm mb-1'
                                        )}
                                    >
                                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                    {/* <li>
                        <div className="text-xs font-semibold leading-6 text-gray-400">Your teams</div>
                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {teams.map((team) => (
                                <li key={team.name}>
                                    <a
                                        href={team.href}
                                        className={classNames(
                                            team.current
                                                ? 'bg-gray-800 text-white'
                                                : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                        )}
                                    >
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                            {team.initial}
                                        </span>
                                        <span className="truncate">{team.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </li>*/}
                </ul>
            </nav>
        </div>)
}

export default function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useAtom(sidebarState);
    /* Create a sidebar in react, hide it on mobile and make it viewable using a menu function */


    return (<>

        <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50 xl:hidden" onClose={() => setSidebarOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-defaultLight bg-opacity-35" />
                </Transition.Child>

                <div className="fixed inset-0 flex">
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-in-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in-out duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                                        <span className="sr-only">Close sidebar</span>
                                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </button>
                                </div>
                            </Transition.Child>
                            <SidebarInner />
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>

        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <SidebarInner />
        </div>
    </>)
}