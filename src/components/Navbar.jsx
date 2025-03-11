import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useStateContext } from "../context";
import { CustomButton } from ".";
import { menu, search } from "../assets";
import { navLinks } from "../constants";
import { IconHeartHandshake } from "@tabler/icons-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { ready, authenticated, login, user, logout } = usePrivy();
  const { fetchUsers, users, fetchUserRecords, setFilteredUsers, records } = useStateContext();
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(records);
      return;
    }
    
    const filteredRecords = records.filter((record) =>
      record.recordName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (filteredRecords.length > 0) {
      setFilteredUsers(filteredRecords);
      navigate(`/records/${filteredRecords[0].recordName}`); // Navigate to first matched record
    } else {
      alert("Record not found");
    }
  };

  return (
    <div className="mb-[35px] flex flex-col-reverse justify-between gap-6 md:flex-row">
      <div className="flex h-[52px] max-w-[458px] flex-row rounded-[100px] bg-[#1c1c24] py-2 pl-4 pr-2 lg:flex-1">
        <input
          type="text"
          placeholder="Search for records"
          className="flex w-full bg-transparent font-epilogue text-[14px] font-normal text-white outline-none placeholder:text-[#4b5264]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div
          className="flex h-full w-[72px] cursor-pointer items-center justify-center rounded-[20px] bg-[#4acd8d]"
          onClick={handleSearch}
        >
          <img src={search} alt="search" className="h-[15px] w-[15px] object-contain" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
