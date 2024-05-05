"use client";
import React from 'react';
import Sidebar from '../Sidebar';
import { useState, useEffect } from 'react';
import PresentDayWisePie from '../admin/report/PresentDayWisePie';
import LeaveCountBarChart from '../admin/report/LeaveCountBarChart';
import InTimeOutTime from '../admin/report/InTime';
import PresentPie from './PresentPie';
import axios from "axios"
const Report = () => {
    const [data, setData] = useState()
    const [leaveData, setLeaveData] = useState()
    // const [presentDayWisePieMonth, setPresentDayWisePieMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'))
    // const [presentDayWisePieYear, setPresentDayWisePieYear] = useState(new Date().getFullYear().toString())
    // const [leavePerYear, setLeavePerYear] = useState(new Date().getFullYear().toString())
    // const [workingHoursData, setWorkingHoursData] = useState()
    // const [workingHoursUserId, setWorkingHoursUserId] = useState(0)
    // const [workingHoursYear, setWorkingHoursYear] = useState(new Date().getFullYear().toString())
    // const [workingHoursMonth, setWorkingHoursMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'))
    const id = localStorage.getItem('id')
    // const fetchDataPie = async () => {
    //     try {
    //         const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/user/report/month/attendance/${id}`,
    //             { month: presentDayWisePieMonth, year: presentDayWisePieYear },
    //         )
    //         const data = await response
    //         setData(data.data)
    //         console.log(data)
    //     }
    //     catch (err) {
    //         console.log(err)
    //     }
    // }
    // const fetchDataYear = async () => {
    //     try {
    //         const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/user/report/year/leave/${id}`, {
    //             year: leavePerYear,
    //         })
    //         const data = await response 
    //         setLeaveData(data.data)
    //         console.log(data)
    //     }
    //     catch (err) {
    //         console.log(err)
    //     }
    // }

    // const fetchDataWorkingHours = async () => {
    //     try {
    //         const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/user/report/year/workingHours/${id}`,
    //             { month: workingHoursMonth, year: workingHoursYear},
    //         )
    //         const data = await response
    //         setWorkingHoursData(data.data)
    //         console.log(data)
    //     }
    //     catch (err) {
    //         console.log(err)
    //     }
    // }

    // useEffect(() => {
    //     fetchDataPie()
    // }, [presentDayWisePieMonth, presentDayWisePieYear])
    // useEffect(() => {
    //     fetchDataYear()
    // }, [leavePerYear])

    // useEffect(() => {
    //     fetchDataWorkingHours()
    // }, [workingHoursMonth, workingHoursYear, workingHoursUserId])
    return (
        <div className="w-full flex relative ">
            <Sidebar />
            <div className="w-full lg:ml-12">
                <h1 className='px-12 text-2xl font-bold'>Report</h1>
                <div className="grid grid-cols-2 max-h-[500px] gap-0 mt-12">
                    {/* <div className="px-12">
                        <h1 className='pb-4 font-bold'>Month wise Attendance</h1>

                        <PresentPie data={data}
                            setSelectedMonth={setPresentDayWisePieMonth}
                            setSelectedYear={setPresentDayWisePieYear}
                            selectedMonth={presentDayWisePieMonth}
                            selectedYear={presentDayWisePieYear}
                        />
                    </div>
                    <div>
                        <h1 className='pb-4 font-bold'>Count of Leaves Per Year</h1>

                        <LeaveCountBarChart data={leaveData}
                            setSelectedYear={setLeavePerYear}
                            selectedYear={leavePerYear}  
                            type="user"                         
                        />
                    </div>
                    <div className='px-12'>
                        <h1 className='pb-4 font-bold py-12'>Monthy Working Hours</h1>
                        <InTimeOutTime data={workingHoursData}
                            workingHoursUserId={workingHoursUserId}
                            setWorkingHoursUserId={setWorkingHoursUserId}
                            setWorkingHoursYear={setWorkingHoursYear}
                            setWorkingHoursMonth={setWorkingHoursMonth}
                            workingHoursMonth={workingHoursMonth}
                            workingHoursYear={workingHoursYear}
                            type="user"
                        />
                    </div> */}
                </div>
            </div>
            </div>
            );
}

export default Report;