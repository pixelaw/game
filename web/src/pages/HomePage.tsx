import {Link} from "react-router-dom";
import Logo from "../components/shared/Logo";
import FullImageLayout from "../components/layouts/FullImageLayout";

const HomePage = () => {
  return (
    <FullImageLayout>
      <div className={'text-center w-full justify-center flex py-[50px] bg-tran'}>
        <div>
          <div>
            <Logo />
          </div>
          <div>
            <button className={'bg-primary'}>
              <Link className={'text-white font-primary'} to={'/connect-wallet'}>
                Connect Wallet
              </Link>
            </button>
          </div>
        </div>
      </div>
    </FullImageLayout>
  )
}

export default HomePage