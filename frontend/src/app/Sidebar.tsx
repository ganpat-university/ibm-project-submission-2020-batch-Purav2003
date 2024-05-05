"use client";
import { LuLogOut } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa6";
import { GoHome } from "react-icons/go";
import { AiOutlineBarChart } from "react-icons/ai";
import { IoCalendarClearOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import Link from "next/link";

const Sidebar = () => {
  const [route, setRoute] = useState(" ");

  useEffect(() => {
    const nav = window.location.href;
    console.log(nav); 
    if (nav.includes("reports")) { 
      setRoute("reports");
    } else if (nav.includes("profile")) {
      setRoute("profile");
    } else if (nav.includes("dashboard")) {
      setRoute("dashboard");
    } else if (nav.includes("leave")) {
      setRoute("leave");
    }
  }, []);

  return (
    <div>
      <div className="hidden lg:flex lg:visible md:hidden flex-col lg:h-screen">
        <div className="sidebar bg-gray-100">
          <div className="sidebar-header items-center fixed min-h-screen bg-gray-100 grid justify-center">
            <div className="px-2">
              <Link href="/dashboard">
                <h3
                  className={`text-center hover:bg-blue-500 hover:text-white rounded-md items-center justify-center flex text-lg p-4 ${route === "dashboard"
                      ? "bg-blue-500 font-bold text-[#fff] items-center rounded-md"
                      : "text-[#4a4a4a]"
                    }`}
                >
                  <GoHome />
                </h3>
              </Link>
              <Link href="/leave">
                <h3
                  className={`text-center mt-1 hover:bg-blue-500 hover:text-white rounded-md items-center justify-center flex text-lg p-4 ${route === "leave"
                      ? "bg-blue-500 font-bold text-[#fff] items-center rounded-md"
                      : "text-[#4a4a4a]"
                    }`}
                >
                  <IoCalendarClearOutline />
                </h3>
              </Link>
              <Link href="/reports">
                <h3
                  className={`text-center mt-1 hover:bg-blue-500 hover:text-white rounded-md items-center justify-center flex text-lg p-4 ${route === "reports"
                      ? "bg-blue-500 font-bold text-[#fff] items-center p-2 rounded-md"
                      : "text-[#4a4a4a]"
                    }`}
                >
                  <AiOutlineBarChart />
                </h3>
              </Link>
              <Link href="/profile">
                <h3
                  className={`text-center mt-1 hover:bg-blue-500 hover:text-white rounded-md items-center justify-center flex text-lg p-4 text-sm ${route === "profile"
                      ? "bg-blue-500 font-bold items-center justify-center text-[#fff] p-2 rounded-md"
                      : "text-[#4a4a4a]"
                    }`}
                >
                  <FaRegUser />
                </h3>
              </Link>
              <Link href="/logout">
                <h3 className="text-lg p-4 mt-1 text-sm hover:bg-red-400 hover:text-white text-center items-center justify-center flex rounded-md">
                  <LuLogOut />
                </h3>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:hidden flex-col">
        <nav className="bg-gray-100 p-4 fixed justify-between flex w-full items-center" style={{zIndex:100}}>
          <div className="text-gray-800 font-semibold">Attendance Portal</div>
          <Link href="/logout">
                <h3 className="text-lg p-2 mt-1 text-sm hover:bg-red-400 hover:text-white text-center items-center justify-center flex rounded-md">
                  <LuLogOut />
                </h3>
                
              </Link>
        </nav>
        <footer className="bg-gray-100 items-center bottom-0 fixed w-full p-2 flex justify-around" style={{zIndex:100}}>
        <Link href="/dashboard">
                <h3
                  className={`text-center hover:bg-blue-500 hover:text-white rounded-md items-center justify-center flex text-lg p-4 ${route === "dashboard"
                      ? "bg-blue-500 font-bold text-[#fff] items-center rounded-md"
                      : "text-[#4a4a4a]"
                    }`}
                >
                  <GoHome />
                </h3>
              </Link>
              <Link href="/leave">
                <h3
                  className={`text-center mt-1 hover:bg-blue-500 hover:text-white rounded-md items-center justify-center flex text-lg p-4 ${route === "leave"
                      ? "bg-blue-500 font-bold text-[#fff] items-center rounded-md"
                      : "text-[#4a4a4a]"
                    }`}
                >
                  <IoCalendarClearOutline />
                </h3>
              </Link>
              <Link href="/reports">
                <h3
                  className={`text-center mt-1 hover:bg-blue-500 hover:text-white rounded-md items-center justify-center flex text-lg p-4 ${route === "reports"
                      ? "bg-blue-500 font-bold text-[#fff] items-center p-2 rounded-md"
                      : "text-[#4a4a4a]"
                    }`}
                >
                  <AiOutlineBarChart />
                </h3>
              </Link>
              <Link href="/profile">
                <h3
                  className={`text-center mt-1 hover:bg-blue-500 hover:text-white rounded-md items-center justify-center flex text-lg p-4 text-sm ${route === "profile"
                      ? "bg-blue-500 font-bold items-center justify-center text-[#fff] p-2 rounded-md"
                      : "text-[#4a4a4a]"
                    }`}
                >
                  <FaRegUser />
                </h3>
              </Link>
        </footer>

      </div>
    </div>
  );
};

export default Sidebar;
