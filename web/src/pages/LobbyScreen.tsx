import React from "react";
import {cn} from "@/lib/utils";
import Image from "@/components/ui/Image"
import {Button} from "@/components/ui/button";
import {useMainLayout} from "@/components/layouts/MainLayout";
import {Active_Page} from "@/global/types";

const PIXEL_STATE_SRC = '/assets/placeholder/pixel-state.png'

export default function LobbyScreen() {
    const {setCurrentPage, setHasNavbar, setHasBackgroundImage, setHasBackgroundOverlay} = useMainLayout()

    React.useEffect(() => {
        setHasNavbar(true)
        setHasBackgroundImage(true)
        setHasBackgroundOverlay(true)
    }, [])

  // this is to force the image tag to refetch
  const [imageSrc, setImageSrc] = React.useState(PIXEL_STATE_SRC);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setImageSrc(`${PIXEL_STATE_SRC}?timestamp=${new Date().getTime()}`);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

    return (
        <div
            className={cn(
                [
                    'flex-1 flex-center'
                ])}
        >
            <div
                className={cn(
                    [
                        'max-w-[1000px] w-full',
                        'flex flex-col gap-y-sm'
                    ])}
            >
                <div className={cn(['flex gap-x-sm'])}>
                    <h4 className={cn(['text-xl text-brand-yellow uppercase font-silkscreen'])}>Choose Map/Game</h4>
                    <Button
                        variant={"icon"}
                        size={'icon'}
                        className={cn(['text-xl text-brand-skyblue uppercase font-silkscreen'])}
                    >
                        <div>
                            <span className={cn(['text-white '])}>[</span>
                            Create New
                            <span className={cn(['text-white'])}>]</span>
                        </div>
                    </Button>
                </div>

                <Image
                    className={cn(['cursor-pointer'])}
                    src={imageSrc}
                    alt={'Lobby Canvas'}
                    onClick={() => setCurrentPage(Active_Page.Gameplay)}
                />
            </div>
        </div>
    )
}
