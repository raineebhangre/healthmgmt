import React, { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { Home, Onboarding, Profile } from "./pages";
import { useStateContext } from "./context";
import { usePrivy } from "@privy-io/react-auth";
import MedicalRecord from './pages/records/index';
import SingleRecordDetails from "./pages/records/single-record-details";
import ScreeningSchedule from './pages/ScreeningSchedule';
import { KanbanProvider } from "./context/KanbanContext";
import MedicalExercisePage from "./pages/exercise/ExercisePage";
import NewsPage from "./pages/news/NewsPage";
import FoodScanPage from "./pages/food-scan/index";

const App = () => {
    const {currentUser} = useStateContext();
    const {user, authenticated, ready, login} = usePrivy();
    const navigate = useNavigate();

    useEffect(() => {
        if (ready && !authenticated) {
            // Don't auto-login immediately - let users see HealthHero first
            // login(); // Commented out to show HealthHero first
        } else if (user && !currentUser) {
            navigate("/onboarding");
        }
    }, [ready, currentUser, navigate, authenticated, user]);
    
    return (
        <KanbanProvider>
        <div className="relative flex min-h-screen flex-row bg-[#13131a] p-4">
            {authenticated && (
              <div className="relative mr-10 hidden sm:flex">
                  <Sidebar/>
              </div>
            )}

            <div className="mx-auto max-w-[1280px] flex-1 max-sm:w-full sm:pr-5">
                {authenticated && <Navbar/>}
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/onboarding" element={<Onboarding/>}/>
                    <Route path="/medical-records" element={<MedicalRecord/>}/>
                    <Route path="/medical-records/:id" element={<SingleRecordDetails/>}/>
                    
                    <Route 
                        path="/personal-board" 
                        element={<ScreeningSchedule isPersonalBoard={true} />}
                    />
                    
                    <Route 
                        path="/record-board/:recordId" 
                        element={<ScreeningSchedule isPersonalBoard={false} />}
                    />
                    
                    <Route 
                        path="/screening-schedules" 
                        element={<Navigate to="/personal-board" replace />}
                    />
                    
                    <Route path="/exercise" element={<MedicalExercisePage/>}/>
                    <Route path="/news" element={<NewsPage/>}/>
                    <Route path="/food-scan" element={<FoodScanPage/>} />
                </Routes>
            </div>
        </div>
        </KanbanProvider>
    );
};
export default App;