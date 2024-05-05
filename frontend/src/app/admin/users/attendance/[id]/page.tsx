"use client";
import React, { useState, useEffect } from "react";
import "rsuite/dist/rsuite.min.css";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import Loading from "../../../../../loading";
import { Select } from 'antd';
import Adminnavbar from "@/app/AdminNavbar";
import Link from "next/link";
import CountHours from '@/Helpers/CountHours';
const { Option } = Select;
interface UserData {
  id: number;
  date: string;
  time: string;
  entry: any;
  exit_time: any;
  user: any;
  onLeave: any;
  attendance: boolean;
}
const ViewAttendanceUser = () => {
  const { calculateDuration } = CountHours();
  const [data, setData] = useState<UserData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [selectedYear, setSelectedYear] = useState<any>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<any>((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const itemsPerPage = 5;

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };



  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      const id = window.location.pathname.split('/').pop();

      formDataToSend.append('year', selectedYear);
      formDataToSend.append('month', selectedMonth);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/attendance/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      const result = await response.json();
      console.log(result);
      if (result?.status === "error") {
        setData([]);
        setLoading(false);
        return;
      } else {
        // Generate IDs starting from 1

        // Filter out data until today
        const today = new Date();
        const filteredData = result.filter((item: UserData) => {
          const itemDate = new Date(item.date);
          return itemDate <= today;
        });
        setData(filteredData.reverse());
        const newData = filteredData?.map((item: UserData, index: number) => ({
          ...item,
          id: index + 1,
        }));
        setData(newData);

        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const companyName = localStorage.getItem("companyName");
    if (!companyName) {
      window.location.replace("/dashboard");
    }
    if (!token) {
      window.location.replace("/admin/login");
    } else {
      setLoading(true);
      fetchData();
    }
  }, [selectedYear, selectedMonth]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full">
      <Adminnavbar />
      <div className="w-full lg:mr-0 pt-24 lg:items-center lg:grid overflow-auto justify-center ">

        <div className="flex">
          <Select placeholder="Select Year" className="z-0" value={selectedYear} onChange={handleYearChange} style={{ width: 120, marginRight: 10 }}>
            <Option value="2023">2023</Option>
            <Option value="2024">2024</Option>
            {/* Add more years as needed */}
          </Select>
          {/* Dropdown for Month */}
          <Select placeholder="Select Month" value={selectedMonth} onChange={handleMonthChange} style={{ width: 120 }}>
            <Option value="01">January</Option>
            <Option value="02">February</Option>
            <Option value="03">March</Option>
            <Option value="04">April</Option>
            <Option value="05">May</Option>
            <Option value="06">June</Option>
            <Option value="07">July</Option>
            <Option value="08">August</Option>
            <Option value="09">September</Option>
            <Option value="10">October</Option>
            <Option value="11">November</Option>
            <Option value="12">December</Option>
          </Select>
        </div>
        {loading ? <Loading /> :
          data?.length === 0 ? <div className="text-center p-32 text-gray-500">No attendance data available</div> :
            <div className="rounded-lg">
              <table className="w-full divide-y mt-8 divide-gray-200 ">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Day</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entry</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Exit</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Hours</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.map((data, index) => (
                    <tr key={data.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{data?.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{data?.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{new Date(data.date).toLocaleDateString("en-US", { weekday: "long" })}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{data.date.split('-').reverse().join('-')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{data.attendance ? data.entry?.split(".")[0] : "-------"}</td>
                      <td className="lg:px-6 px-2 py-2 lg:py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {data.attendance ? (data.exit_time < data.entry ? "-------" : data.exit_time.split(".")[0]) : "------"}
                      </td>
                      <td className="lg:px-6 px-2 py-2 lg:py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {data.attendance ? (data.exit_time < data.entry ? "-------" : calculateDuration(data.entry, data.exit_time)) : "-------"}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-white text-center `}>
                        <span className={`${data?.onLeave ? "bg-blue-400" : data?.attendance ? "bg-green-500" : "bg-red-500"} px-3 py-2 rounded-md inline-block w-24`}>
                          {
                            data?.onLeave ? "On Leave" : data?.attendance ? "Present" : "Absent"
                          }
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200 sm:px-6">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button onClick={prevPage} disabled={currentPage === 1} className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-gray-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150">
                    <SlArrowLeft className="w-4 h-4 mr-1" />
                    Prev
                  </button>
                  <button onClick={nextPage} disabled={currentPage === totalPages} className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-gray-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150">
                    Next
                    <SlArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
        }

      </div>
    </div>
  );
}

export default ViewAttendanceUser;