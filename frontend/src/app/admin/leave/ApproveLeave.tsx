"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { IoCheckmark } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { toast, Toaster } from 'react-hot-toast';

interface LeaveData {
    id: any;
    user_name: any;
    start_date: any;
    end_date: any;
    leave_type: any;
    reason: any;
    onLeave: any;
}

const ApproveLeave = () => {
  const [leave, setLeave] = useState<LeaveData[]>([]);
  const fetchLeave = async () => {
    const companyCode = localStorage.getItem("companyCode");
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/leaveStatus/pending/${companyCode}`);
    const data = await response.json();
    setLeave(data);
    console.log(data);
  }

  const approveLeave = (id: string) => async () => {
    const API_URL = `${process.env.NEXT_PUBLIC_BASE_URI}/leaveUpdateStatus/approved/${id}`;
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${token}`,
        },
      });
      const authResponse = await response.json();
      console.log(await authResponse);
      if (authResponse?.status === "success") {
        toast.success('Leave Approved');
        const timer = setTimeout(() => {
          fetchLeave();
        }, 1000)
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const denyLeave = (id: string) => async () => {
    const API_URL = `${process.env.NEXT_PUBLIC_BASE_URI}/leaveUpdateStatus/denied/${id}`;
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${token}`,
        },
      });
      const authResponse = await response.json();
      console.log(await authResponse);
      if (authResponse?.status === "success") {
        toast.success('Leave Denied');
        const timer = setTimeout(() => {
          fetchLeave();
        }, 1000)
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    fetchLeave();
  }
    , []);
  return (
    <div className="py-4 px-12">
      <Toaster />
      <h1 className="font-bold text-2xl pb-4">Pending Leave Requests</h1>
      <div>
        {leave?.length > 0 ?
          <table className="table-striped w-full text-sm text-gray-500 text-white overflow-scroll">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 text-white">
              <tr>
                <th scope="col" className="text-center px-6 py-3">
                  ID
                </th>
                <th scope="col" className="text-center px-6 py-3">
                  Name
                </th>
                <th scope="col" className="text-center px-6 py-3">
                  Start Date
                </th>
                <th scope="col" className="text-center px-6 py-3">
                  End Date
                </th>
                <th scope="col" className="text-center px-6 py-3">
                  Leave Type
                </th>
                <th scope="col" className="text-center px-6 py-3">
                  Reason
                </th>
                <th>

                </th>
              </tr>
            </thead>
            <tbody>
              {leave?.map((item) => (
                <tr key={item.id} className="p-4  text-[#4a4a4a] items-center">

                  <td className="p-4 text-center">{item.id}</td>
                  <td className="p-4 text-center">{item.user_name}</td>
                  <td className="p-4 text-center">{item.start_date}</td>
                  <td className="p-4 text-center">{item.end_date}</td>
                  <td className="p-4 text-center">{item.leave_type}</td>
                  <td className="p-4 text-center">{item.reason}</td>
                  <td className="text-center">
                    <button className="btn border px-2 py-1 border-green-500 text-white rounded-md bg-green-500" onClick={approveLeave(item.id)}>
                      <IoCheckmark className="text-xl" /></button>

                    <button className="btn border ml-2 px-2 py-1 border-red-500 text-white rounded-md bg-red-500" onClick={denyLeave(item.id)}>
                      <RxCross2 className="text-xl" /></button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          : <div>
            <h1 className="text-center m-12 pt-8 text-sm">There are no Pending Leave Requests </h1>
          </div>
        }
      </div>
    </div>
  );
}

export default ApproveLeave;    