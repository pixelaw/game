import { IconContext } from 'react-icons'
import { GiRock, GiSandSnake } from "react-icons/gi";
import { BsPaintBucket } from "react-icons/bs";
import { MdOutlineIncompleteCircle } from "react-icons/md";
import {useSetAtom} from "jotai";
import {gameModeAtom} from "../global/states";


interface ModalProps {
  setIsModalOpen: (isOpen: boolean) => void;
}

export default function Modal({setIsModalOpen}: ModalProps) {

  const setGameMode = useSetAtom(gameModeAtom)

  function onSelect(mode: "paint" | "rps" | "snake"){
    setGameMode(mode)
    setIsModalOpen(false)
  }

  return (
    <div className='justify-center item-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
      <div className='relative w-auto my-6 mx-auto max-w-3xl'>
        {/*content*/}
        <div className="border-1 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          {/*header*/}
          <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-3xl font-semibold">
              SELECT GAME MODE
            </h3>
          </div>
          {/*body*/}
          <div className="relative p-6 flex-auto">
            <IconContext.Provider value={{ color: '#1c4966', size: '100px' }}>
              <div className='flex flex-warp'>
                <div className='w-1/2 p-10 flex flex-col items-center'>
                  <button className="text-5xl"
                          onClick={() => onSelect("paint")}
                  >
                    <BsPaintBucket />
                  </button>
                  <div>Paint Pixel</div>
                </div>
                <div className='w-1/2 p-10 flex flex-col items-center'>
                  <button className="text-5xl"
                          onClick={() => onSelect("rps")}
                  >
                    <GiRock />
                  </button>
                  <div>RPS Game</div>
                </div>
                <div className='w-1/2 p-10 flex flex-col items-center'>
                  <button className="text-5xl"
                          onClick={() => onSelect("snake")}
                  >
                    <GiSandSnake />
                  </button>
                  <div>SNAKE Game</div>
                </div>
                <div className='w-1/2 p-10 flex flex-col items-center'>
                  <button className="text-5xl">
                    <MdOutlineIncompleteCircle />
                  </button>
                  <div>Pack Man</div>
                </div>
              </div>
            </IconContext.Provider>
          </div>

          {/*footer*/}
          <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
            <button
              className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}