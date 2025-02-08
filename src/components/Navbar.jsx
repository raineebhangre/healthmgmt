import React, { useState, useCallback, useEffect } from "react";
import CustomButton from "./CustomButton";
import { usePrivy } from "@privy-io/react-auth";
import searchIcon from "../assets/search.svg"; // Adjust path accordingly
import { IconHeartHandshake } from "@tabler/icons-react";
import {menu, search} from "../assets";
import {navLinks} from "../constants";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const { ready, authenticated, login, user, logout } = usePrivy();
    const [toggleDrawer, setToggleDrawer] = useState(false);
    const [isActive, setIsActive]= useState('dashboard');
    const navigate=useNavigate();

    console.log("user info", user);
    const handleLoginLogout = useCallback(() => {
        if (authenticated) {
            logout();
        } else {
            login();
        }
    }, [authenticated, login, logout]);

    useEffect(() => {
        if (authenticated && user) {
            console.log(user);
            // fetch user
        }
    }, [authenticated, user]);

    return (
        <div className="mb-[35px] flex flex-col-reverse justify-between gap-6 md:flex-row">
            {/* Search bar */}
            <div className="flex h-[52px] max-w-[458px] flex-row rounded-[100px] bg-[#1c1c24] py-2 pl-4 lg:flex-1">
                <input
                    type="text"
                    placeholder="Search for records"
                    className="flex w-full bg-transparent font-epilogue text-[14px] font-normal text-white outline-none placeholder:text-[#4b5264]"
                />
                <div className="flex h-full w-[72px] cursor-pointer items-center justify-center rounded-[20px] bg-[#4acd8d]">
                    <img
                        src={searchIcon}
                        alt="search"
                        className="h-[15px] w-[15px] object-contain"
                    />
                </div>
            </div>

            {/* Login/Logout Button */}
            <div className="hidden flex-row justify-end gap-2 sm:flex">
                <CustomButton
                    btnType="button"
                    title={authenticated ? "Logout" : "Login"}
                    styles={authenticated ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
                    handleClick={handleLoginLogout}
                />
            </div>

            {/*mobile view */}
            <div className="relative flex items-center justify-between sm:hidden">
                <div className="h-[40px] cursor-pointer items-center justify-center 
                  rounded-[10px] bg-[#2c2f32]">
                    <IconHeartHandshake size={40} color='#1ec070' className="p-2" />
                </div>
                <img src={menu} alt="menu" 
                    className="h-[34px] w-[34px] cursor-pointer object-contain"
                    onClick={() =>
                        { setToggleDrawer((prev) => !prev);
                      }}
                />

                <div className={`absolute left-0 right-0 top-[60px] z-10 bg-[#1c1c24] py-4 shadow-secondary 
                      ${!toggleDrawer ? '-translate-y-[100vh]' :'translate-y-0'}
                      transition-all duration-700`}>
                       <ul className="mb-4">
                            {navLinks.map((link) => (
                                <li
                                key={link.name}
                                className={`flex items-center gap-3 p-4 ${isActive === link.name && "bg-[#3a3a43]"}`}
                                onClick={() => {
                                    setIsActive(link.name);
                                    setToggleDrawer(false);
                                    navigate(link.link);
                                }}
                                >
                                <img src={link.imageUrl} alt={link.name} className="h-6 w-6 object-contain" /> 
                                <span className="text-white">{link.name}</span>
                                </li>
                            ))}
                        </ul>


                </div>
            </div>
        </div>
    );
};

export default Navbar;
