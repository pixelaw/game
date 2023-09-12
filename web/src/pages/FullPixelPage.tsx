import NavigationContentLayout from "../components/layouts/NavigationContentLayout";
import {useNavigate} from "react-router-dom";

const FullPixelPage = () => {
  const navigate = useNavigate()

  const handleCanvasClick =() => {
    navigate('/pixels/play', { replace: true })
  }

  return (
    <NavigationContentLayout>
      <div className={"h-full w-full flex justify-center my-[6em]"}>
        <img
          src={"/assets/canvas_placeholder.png"}
          alt={"placeholder image"}
          className={'cursor-pointer'}
          onClick={handleCanvasClick}
        />
      </div>
    </NavigationContentLayout>
  )
}

export default FullPixelPage