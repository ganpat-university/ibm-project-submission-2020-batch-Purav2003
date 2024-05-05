"use client";
import React, { useState, useEffect, useCallback } from 'react';
import AdminNavbar from '@/app/AdminNavbar';
import { PieChart } from '@mui/x-charts';
import { Card, Typography, Table, TableHead, TableBody, TableRow, TableCell, Button } from '@mui/material'; // Material UI components
import { HiArrowDown } from "react-icons/hi2";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import Loading from "../../../loading"
import Last from './Last';
import CountHours from '@/Helpers/CountHours';

interface Data {
    attendance?: any; // You can change the type if attendance is not a string
    user: any;
    entry: any;
    exit_time: any;
    date: any;
    id: any;
    onLeave: any;    
    // Add other properties if necessary
}

const Attendance = () => {
    const [data, setData] = useState<Data[]>([]);
    const [presentCount, setPresentCount] = useState(0);
    const { calculateDuration } = CountHours();
    const [absentCount, setAbsentCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [loading, setLoading] = useState(true); // Initially set loading to true

    // Memoize fetchData function
    const fetchData = useCallback(async () => {
        const token = localStorage.getItem("token");
        const companyCode = localStorage.getItem("companyCode");
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/allAttendance/${companyCode}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = await response.json();
        setData(result);
        setLoading(false); // Set loading to false when data is fetched
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]); // Call fetchData only once when component mounts

    useEffect(() => {
        let presentCount = 0;
        let absentCount = 0;

        data?.filter((datas) => new Date(datas.date).toLocaleDateString() === new Date().toLocaleDateString()).forEach((datas) => {
            datas?.attendance ? presentCount++ : absentCount++;
        });

        setPresentCount(presentCount);
        localStorage.setItem("presentCount", presentCount.toString());
        setAbsentCount(absentCount);
        localStorage.setItem("absentCount", absentCount.toString());
    }, [data]);

    const pieChartData = [
        { label: 'Present', value: presentCount },
        { label: 'Absent', value: absentCount },
    ];

    // Function to generate CSV content
    const generateCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
            "ID,Name,Entry,Exit,Total Hours,Attendance\n" +
            data.filter((datas) => new Date(datas.date).toLocaleDateString() === new Date().toLocaleDateString()).map((datas, index) =>
                `${index + 1},${datas.user},${datas.attendance ? datas.entry?.split(".")[0] : "-------"},${datas.attendance ? datas.exit_time?.split(".")[0] : "-------"},${datas.attendance ? (datas.exit_time < datas.entry ? "-------" : calculateDuration(datas.entry, datas.exit_time)) : "-------"},${datas?.onLeave ? "On Leave" : datas?.attendance ? "Present" : "Absent"}`
            ).join("\n");
        const encodedURI = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedURI);
        let date = new Date().toLocaleDateString()
        link.setAttribute("download", `attendance_${date}.csv`);
        document.body.appendChild(link);
        link.click();
    };


    const renderItems = () => {
        const todayData = data.filter(datas => new Date(datas.date).toLocaleDateString() === new Date().toLocaleDateString());
        const items = [];
        for (let i = 0; i < todayData.length; i++) {
            const datas = todayData[i];
            const date = new Date(datas.date);

            items.push(
                <TableRow key={datas.id} className={datas?.onLeave ? "bg-blue-100" : datas?.attendance ? "bg-green-100" : "bg-red-100"}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{datas.user}</TableCell>
                    <TableCell>{datas.date.split("-").reverse().join("-")}</TableCell>
                    <TableCell>{datas.attendance ? datas.entry?.split(".")[0] : "-------"}</TableCell>
                    <TableCell>
                        {datas.attendance ? (datas.exit_time < datas.entry ? "-------" : datas.exit_time.split(".")[0]) : "------"}
                    </TableCell>
                    <TableCell>
                        {datas.attendance ? (datas.exit_time < datas.entry ? "-------" : calculateDuration(datas.entry, datas.exit_time)) : "-------"}
                    </TableCell>
                    <TableCell> {
                        datas?.onLeave ? "On Leave" : datas?.attendance ? "Present" : "Absent"
                    }</TableCell>
                </TableRow>
            );
        }

        return items;
    };

    // Pagination Logic
    const totalPages = Math.ceil(renderItems().length / itemsPerPage);
    const lastPage = currentPage === totalPages;

    const next = () => {
        if (!lastPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prev = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    };


    return (
        <>
            <AdminNavbar /><br /><br /><br />
            {loading ? (
                <Loading />
            ) : (
                <div className="p-4 lg:p-8">
                    <div className='lg:flex justify-between'>
                        <div className='lg:w-[60%]'>
                            <h1 className='pb-4 font-semibold text-xl'>Today&apos;s Attendance</h1>
                            {data?.length === 0 ? <h1 className="text-center m-12 pt-8">There is No Attendance Data For Today </h1> :
                                <div className="overflow-x-auto">
                                    <div>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell>Entry</TableCell>
                                                    <TableCell>Exit</TableCell>
                                                    <TableCell>Total Hours</TableCell>
                                                    <TableCell>Attendance</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {renderItems()}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className='w-full lg:flex justify-between mt-4'>
                                        {/* Pagination */}
                                        <div className="flex items-center space-x-2">
                                            <span>Page No: {currentPage} | {totalPages}</span>
                                            <button onClick={prev} disabled={currentPage === 1}><SlArrowLeft className="text-sm" /></button>
                                            <button onClick={next} disabled={lastPage}><SlArrowRight className="text-sm" /></button>
                                        </div>
                                        <button onClick={generateCSV} className='px-4 mt-4 lg:mt-0 py-2 bg-blue-600 rounded-md flex items-center text-white'><HiArrowDown className="mr-2" />Download CSV</button>
                                    </div>
                                </div>}


                        </div>
                        <div className='lg:w-[40%] lg:grid items-center justify-center hidden lg:visible sm:visible md:visible'>
                            <div className="p-4 lg:fixed">
                                <h1 className='pb-4 ml-12 font-semibold text-xl'>Today&apos;s Attendance Summary</h1>
                                <div className='overflow-x-auto'>
                                    {data && data.length > 0 ? (
                                        <div>
                                            <PieChart
                                                series={[
                                                    {
                                                        arcLabel: (item) => `${(item.value * 100 / (presentCount + absentCount)).toFixed(2)}%`,
                                                        data: pieChartData
                                                    },
                                                ]}
                                                width={400}
                                                height={200}                                                
                                            /></div>
                                    ) : (
                                        <Typography variant="body1" className='text-center m-12 pt-8'>No data available</Typography>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Last />
        </>
    );
};

export default Attendance;