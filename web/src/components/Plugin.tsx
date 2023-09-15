import React from "react";
import {cn} from "@/lib/utils";
import Image from "@/components/ui/Image"
import {plugins} from "@/global/config";
import {Button} from "@/components/ui/button";
import Footer from "@/components/Footer";
import { gameModeAtom } from '@/global/states'
import { useAtom } from 'jotai'

export default function Plugin() {
    const [isOpen, setIsOpen] = React.useState<boolean>(false)

    const [gameMode, setGameMode] = useAtom(gameModeAtom)

    return (
        <>
            <div
                className={cn([
                    'fixed bottom-0 right-0 z-20',
                    'h-[calc(100vh-var(--header-height))]',
                    'bg-[#3E0C57] border-l-[1px] border-black',
                    {'animate-slide-left': isOpen},
                    {'animate-slide-right': !isOpen},
                ])}
            >
                <div
                    className={cn([
                        'flex flex-col',
                        'h-full',
                    ])}
                >
                    <div
                        className={cn([
                            'h-[190px] w-full',
                            'flex items-start justify-center',
                            'pt-xs',
                            'border-b-[1px] border-brand-violetAccent',
                            {'justify-start border-none': isOpen}
                        ])}
                    >
                        <Button
                            className={cn([{'mx-xs': isOpen}])}
                            variant={'icon'}
                            size={'icon'}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <Image
                                className={cn(['w-[14px]'])}
                                src={`/assets/svg/icon_chevron_${isOpen ? 'right' : 'left'}.svg`}
                                alt={'Arrow left Icon'}
                            />
                        </Button>
                    </div>

                    <div
                        className={cn([
                            'flex-1 ',
                            {'mx-xs': isOpen}
                        ])}
                    >
                        {
                            plugins.map((plugin, index) => {
                              const selected = plugin.name === gameMode
                                return (
                                    <div
                                      key={index}
                                      className={cn(['flex justify-center items-center w-full ', {'gap-x-xs justify-start': isOpen}])}
                                      onClick={() => setGameMode(plugin.name as "none" | "paint" | "rps" | "snake")}
                                    >
                                        <Button
                                            key={index}
                                            variant={'icon'}
                                            size={'icon'}
                                            className={cn([
                                                'font-emoji',
                                                'my-xs',
                                                'text-center text-[36px]',
                                                'border border-brand-violetAccent rounded',
                                                {'border-white': selected}
                                            ])}
                                        >
                                            {plugin.icon}

                                        </Button>

                                        <h3 className={cn(
                                            ['text-brand-skyblue text-left text-base uppercase font-silkscreen',
                                                {'hidden': !isOpen},
                                              {'text-white': selected}
                                            ])}
                                        >
                                            {plugin.name}
                                        </h3>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <Footer coordinates={{x: 0, y: 0}} collapsed={isOpen}/>
                </div>
            </div>
        </>
    )
}
