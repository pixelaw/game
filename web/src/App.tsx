import HomePage from "./pages/HomePage";
import WalletPage from "./pages/WalletPage";
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import FullPixelPage from "./pages/FullPixelPage";
import GamePlayPage from "./pages/GamePlayPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={"/"}>
      <Route index element={<HomePage />} />
      <Route path={'connect-wallet'} element={<WalletPage />} />
      <Route path={'pixels'} element={<FullPixelPage />} />
      <Route path={'/pixels/play'} element={<GamePlayPage />} />
    </Route>
  )
)

function App() {

  return (
    <RouterProvider router={router} />
  );
}

export default App;
