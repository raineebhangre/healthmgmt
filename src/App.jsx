import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";

const App=()=>{
    return (
     <div className="relative flex min-h-screen flex-row bg-[#13131a] p-4">
        <div className="hidden relative mr-10 sm:flex"> 
            <Sidebar />
        </div>

        <div className="mx-auto max-w-[1280px] flex-1 max-sm:w-full sm:pr-5">
            {/* Navbar */}
            <Routes>
                <Route path="/" element={<main> Home Page</main>} />
            </Routes>
        </div>
     </div>        
    );
};

export default App;