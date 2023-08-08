import React from 'react';
import Modal from './components/Modal';
import NavBar from './components/NavBar';
import Main from "./components/Main.tsx";

function App() {

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const handlePlayClick = () => {
        setIsModalOpen(true);
    };

    return (
        <div className='relative h-screen w-full bg-no-repeat bg-center bg-fixed bg-cover overflow-auto'>
            <div className='w-full bg-custom-gray mb-16'>
                <NavBar handlePlayClick={handlePlayClick}/>
                {isModalOpen ? (
                    <Modal setIsModalOpen={setIsModalOpen}/>
                ) : null}
                <Main />
            </div>
        </div>
    );
}

export default App;
