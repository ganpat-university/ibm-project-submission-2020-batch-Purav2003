"use client";
import { useEffect, useState } from "react";
import { IoCalendarClearOutline } from "react-icons/io5";
import Footer from "../../footer";
import Sidebar from "../../Sidebar";
import Link from "next/link";
import Loading from "../../../loading";
import { DateRangePicker } from "rsuite";

const HolidayCalendar = () => {
    const [date, setDate] = useState([]);
    const fetchData = async () => {
        const companyCode = localStorage.getItem('cc');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/getHolidays/${companyCode}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const res = await response.json();
            const validJSON = "[" + res[0].dates.replace(/'/g, '"') + "]";

            console.log(JSON.parse(validJSON));
            setDate(JSON.parse(validJSON)[0]);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        console.log(date)
        const token = localStorage.getItem("token");
        const companyName = localStorage.getItem("companyName");
        if (!token) {
            window.location.replace('/login');
        }
        if (companyName) {
            window.location.replace('/admin/dashboard');
        }
        const userData = localStorage.getItem("isAuthorized");

        if (userData === "sendRequest") {
            window.location.replace('/landing');
        }

        fetchData();
    }, []);

    const months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    return (
        <div className="flex flex-col lg:flex-row w-full">
            <Sidebar />
            <div className="lg:ml-16 mt-8 w-full">
                <div className="justify-between flex">
                    <h1 className="lg:text-3xl lg:ml-12 sm:ml-8 ml-4 mt-12 lg:mt-0 text-xl font-bold text-gray-800 flex items-center mb-6">
                        <IoCalendarClearOutline />&nbsp; Holiday Calendar
                    </h1>
                </div>
                {date.length > 1 ? (
                    <div className="grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-4 px-12 mt-6">
                        {months.map((month, index) => {
                            let holidaysFound = false;
                            return (
                                <div key={month} className="bg-white p-4 rounded-md border h-48 min-h-48 max-h-64 border-gray-200">
                                    <h2 className="text-lg font-semibold mb-4">{month}</h2>
                                    <div className="overflow-y-auto max-h-28">
                                        {date
                                            .filter(date => date?.split('/')[1] == index + 1) // Filter holidays for the current month
                                            .sort((a, b) => { // Sort the filtered holidays
                                                const dateA = new Date(a?.split('/')[2], index, a?.split('/')[0]);
                                                const dateB = new Date(b?.split('/')[2], index, b?.split('/')[0]);
                                                return dateA - dateB;
                                            })
                                            .map((date, i) => {
                                                holidaysFound = true
                                                return (
                                                    <p key={i} className="text-gray-800 mb-2 text-sm">{date} - {
                                                        new Date(date?.split('/')[2], index, date?.split('/')[0]).toLocaleString("en-us", { weekday: "long" })
                                                    }
                                                    </p>)
                                            })
                                        }

                                        {!holidaysFound && <p className="text-gray-400 text-sm h-24 grid items-center justify-center">No holidays This Month</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : <Loading />}

                <Footer />
            </div>
        </div>
    );
}

export default HolidayCalendar;
