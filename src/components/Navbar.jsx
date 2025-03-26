import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useStateContext } from "../context";
import { CustomButton } from ".";
import { menu } from "../assets";
import { navLinks } from "../constants";
import { IconHeartHandshake, IconHeartbeat } from "@tabler/icons-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { ready, authenticated, login, user, logout } = usePrivy();
  const { fetchUsers, users, fetchUserRecords, setFilteredUsers } = useStateContext();

  const fetchUserInfo = useCallback(async () => {
    if (!user) return;

    try {
      await fetchUsers();
      const existingUser = users.find((u) => u.createdBy === user.email.address);
      if (existingUser) {
        await fetchUserRecords(user.email.address);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }, [user, fetchUsers, users, fetchUserRecords]);

  useEffect(() => {
    if (authenticated && user) {
      fetchUserInfo();
    }
  }, [authenticated, user, fetchUserInfo]);

  const handleLoginLogout = useCallback(() => {
    if (authenticated) {
      logout();
    } else {
      login().then(() => {
        if (user) {
          fetchUserInfo();
        }
      });
    }
  }, [authenticated, login, logout, user, fetchUserInfo]);

  return (
    <div className="mb-[35px] flex flex-col-reverse justify-between gap-6 md:flex-row">
      {/* Wellness 360 Title with ECG Icon */}
      <div className="flex items-center lg:flex-1 justify-start pl-6">
        <div className="flex items-center gap-3 transform hover:scale-105 transition-all duration-300">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 
                        bg-clip-text text-transparent animate-gradient-x leading-tight py-2">
            Wellness 360
          </h1>
          <IconHeartbeat 
            size={40} 
            className="text-[#1dc071] animate-pulse"
            stroke={2.5}
          />
        </div>
      </div>

      {/* Profile & Login Section */}
      <div className="hidden flex-row items-center justify-end gap-4 sm:flex">
        {authenticated && user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            className="h-10 w-10 rounded-full object-cover border-2 border-[#1dc071] hover:scale-110 transition-transform"
          />
        ) : (
          <CustomButton
            btnType="button"
            title={authenticated ? "Log Out" : "Log In"}
            styles={authenticated ? "bg-[#1dc071] hover:bg-[#18a561] shadow-glow px-4 py-2 text-sm" : "bg-[#8c6dfd] hover:bg-[#7b5ae6] shadow-glow px-4 py-2 text-sm"}
            handleClick={handleLoginLogout}
          />
        )}
      </div>

      {/* Mobile Menu */}
      <div className="relative flex items-center justify-between sm:hidden">
        <div className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-[10px] bg-[#2c2f32] hover:bg-[#3a3a43] transition-colors">
          <IconHeartHandshake size={40} color="#1ec070" className="p-2" />
        </div>
        
        {/* Mobile Wellness 360 with Icon */}
        <div className="flex items-center gap-2 ml-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 
                        bg-clip-text text-transparent leading-tight">
            Wellness 360
          </h1>
          <IconHeartbeat 
            size={28} 
            className="text-[#1dc071] animate-pulse"
            stroke={2}
          />
        </div>

        <img
          src={menu}
          alt="menu"
          className="h-[34px] w-[34px] cursor-pointer object-contain hover:scale-110 transition-transform"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute left-0 right-0 top-[60px] z-10 bg-[#1c1c24] py-4 shadow-secondary ${
            !toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"
          } transition-all duration-700`}
        >
          <ul className="mb-4">
            {navLinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${isActive === link.name && "bg-[#3a3a43]"} 
                          hover:bg-[#2c2f32] transition-colors group`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img
                  src={link.imageUrl}
                  alt={link.name}
                  className={`h-[24px] w-[24px] object-contain ${
                    isActive === link.name ? "grayscale-0" : "grayscale"
                  } group-hover:grayscale-0 transition-filter`}
                />
                <p
                  className={`ml-[20px] font-epilogue text-[14px] font-semibold ${
                    isActive === link.name ? "text-[#1dc071]" : "text-[#808191]"
                  } group-hover:text-[#1dc071] transition-colors`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;