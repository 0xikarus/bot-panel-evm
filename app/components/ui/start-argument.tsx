

export interface Argument {
    name: string;
    type: string;
    required: boolean,
    description?: string
}
export default function StartArgument({ args }: { args: Argument[] }) {

    if (args.length == 0) return;

    return (<div className="flex flex-col overflow-x-auto mt-1" >
        <div className="pb-1 flex min-w-full flex-none gap-x-6 text-sm font-semibold leading-6 text-gray-400 px-4">
            Start arguments
        </div>
        <div className=" bg-defaultLight">
            {args.map((arg, index) => (<div key={index} className="flex items-center justify-start h-8">
                <div className="w-[150px] flex items-center justify-start whitespace-nowrap text-wrap font-mono text-xs text-textDefault px-2 h-8">
                    <div>{arg.name}{arg.required ? "*" : ""}</div>
                </div>
                <input
                    type="text"
                    className="w-full pr-2 h-8 text-xs font-mono bg-defaultLight text-textDefault border-transparent outline-none"
                    placeholder={(arg?.description || arg.name)}>
                </input>
            </div>))}
        </div>

    </div >);
}