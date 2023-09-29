import {cn} from "@/lib/utils";

type PropsType = {
    coordinates: {
        x: number,
        y: number
    },
    type?: string,
    owner?: string,
    collapsed?: boolean
}

export default function Footer(props: PropsType) {
    return (
        <div
            className={cn(
                [
                    'h-[150px] w-full',
                    'flex items-start justify-center',
                    'bg-brand-violetAccent01',
                    {'justify-start': props.collapsed}
                ]
            )}
        >
            <div
                className={cn(
                    [
                        'px-xs pt-sm',
                        'flex flex-col gap-y-xs',
                        'animate-fade-in duration-700',
                        {'hidden': !props.collapsed},
                    ]
                )}
            >
                <h3 className={cn(['text-brand-violetAccent04 text-sm'])}>Coordinates: <span
                    className={'text-white font-semibold ml-1'}>{`${props.coordinates.x}, ${props.coordinates.y}`}</span>
                </h3>
                <h3 className={cn(['text-brand-violetAccent04 text-sm'])}>Type: <span
                    className={'text-white font-semibold ml-1'}>{props.type ?? 'null'}</span></h3>
                <h3 className={cn(['text-brand-violetAccent04 text-sm'])}>Owner: <span
                    className={'text-white font-semibold ml-1'}>{props.owner ?? 'n/a'}</span></h3>
            </div>

            <div
                className={cn(
                    [
                        'h-full',
                        'flex-center flex-col gap-y-xs',
                        {'hidden': props.collapsed}
                    ]
                )}
            >
                <h3 className={cn(['text-brand-violetAccent04 text-sm'])}>x: <span
                    className={'text-white font-semibold ml-1'}>{props.coordinates.x}</span></h3>
                <h3 className={cn(['text-brand-violetAccent04 text-sm'])}>y: <span
                    className={'text-white font-semibold ml-1'}>{props.coordinates.y}</span></h3>
            </div>
        </div>
    )
}
