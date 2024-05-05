"use client";
import Sidebar from "../Sidebar"
import Link from "next/link"
import LeaveRemaining from "./LeaveRemaining"
import RecentLeave from "./RecentLeave"
import { useEffect } from "react";
import { GiMountains } from "react-icons/gi";
import { IoCalendarClearOutline } from "react-icons/io5";
import Footer from "../footer"
const Leave = () => {
    useEffect(() => {
        const token = localStorage.getItem("token")
        const companyName = localStorage.getItem("companyName")
        if (!token) {
            window.location.replace('/login')
        }
        if (companyName) {
            window.location.replace('/admin/dashboard')
        }
        const userData = localStorage.getItem("isAuthorized")

        if (userData === "sendRequest") {
            window.location.replace('/landing')
        }
    });

    return (
        <div className="flex flex-col lg:flex-row w-full">
            <Sidebar />
            <div className="lg:ml-16 mt-8 w-full">
                <div className="justify-between flex ">
                    <h1 className="lg:text-3xl lg:ml-12 sm:ml-8 ml-4 mt-12 lg:mt-0 text-xl font-bold text-gray-800 flex items-center mb-6"><GiMountains /> &nbsp;     Leave Portal</h1>
                    <div className="flex">
                        <Link href="/leave/holiday-calendar"><button className="bg-blue-400 mt-12 sm:text-sm lg:mt-0 text-white lg:px-4 p-2 lg:py-2 rounded-md flex items-center"><IoCalendarClearOutline />&nbsp; Holiday Calendar</button></Link>
                        <Link href="/leave/leave-application"><button className="mr-10 ml-2 bg-red-400 mt-12 lg:mt-0 text-white lg:px-4 p-2 lg:py-2 rounded-md items-center flex"><GiMountains /> &nbsp; Apply For Leave</button></Link>
                    </div>
                </div>
                <div className="lg:pl-4">
                    <LeaveRemaining />
                </div>
                <div className="lg:pl-4">
                    <RecentLeave />
                </div>
                <Footer />
            </div>
        </div>

    );
}

export default Leave;