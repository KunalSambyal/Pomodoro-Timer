import Container from "./components/Container";
import Navbar from "./components/Navbar";
import Settings from "./components/Settings";

import { useState } from "react";

function App() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className="w-full h-dvh bg-slate-700 text-white flex flex-col items-center gap-y-12 p-4">
            <Navbar
                onOpenSettings={() => {
                    setIsSettingsOpen(true);
                }}
            />
            <Container />
            {isSettingsOpen && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50">
                    <Settings
                        onClose={() => {
                            setIsSettingsOpen(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default App;
