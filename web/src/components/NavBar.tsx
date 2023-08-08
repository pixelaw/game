import {useAtom} from "jotai";
import {viewModeAtom} from "../global/states";
import {useDojo} from "../DojoContext";

interface NavBarProps {
  handlePlayClick: () => void;
}

export default function NavBar({handlePlayClick}: NavBarProps) {


  const {
    network: { signer }
  } = useDojo()

  const [viewMode, setViewMode] = useAtom(viewModeAtom)

  const handleViewClick = () => {
    setViewMode(prev => prev === "Pixel" ? "Game" : "Pixel")
  }

  return (
    <nav
      className='flex py-2 justify-between'>
      <div
        className='px-6 text-custom-yellow text-2xl font-bold'
        style={{ fontFamily: 'PixelFont' }}>
        PixeLAW (user: {signer.address.slice(-6)})
      </div>
      <div className="justify-center">
        <button 
          className='text-2xl text-white mx-2 bg-custom-blue rounded-md px-2 md:4'
          onClick={() => handleViewClick()}
          style={{ fontFamily: 'PixelFont' }}>
            {viewMode === "Pixel" ? "Pixel Art View" : "Game Mode View"}
        </button>
        <button
          className='text-2xl text-white mx-2 bg-custom-blue rounded-md px-2 md:4'
          onClick={() => handlePlayClick()}
          style={{ fontFamily: 'PixelFont' }}>
          Play
        </button>

      </div>
    </nav>
  );
}
