"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from "../../Sidebar";
import { toast, Toaster } from 'react-hot-toast';
import Link from "next/link";
import Footer from "../../footer"

interface LeaveRemaining {
    leaveType: any;
    remaining: any;
}

interface FormDatas {
    leaveType: any;
    startDate: any;
    endDate: any;
    reason: any;
}
const LeaveApply = () => {
    const [formData, setFormData] = useState<FormDatas>({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [remainingLeaves, setRemainingLeaves] = useState<LeaveRemaining[]>();

    useEffect(()=>{
        const token = localStorage.getItem("token")
        const companyName = localStorage.getItem("companyName")
        if (!token) {
            window.location.replace('/login')
        }
        if (companyName) {
            window.location.replace('/admin/dashboard')
        }
        const userData = localStorage.getItem("isAuthorized")
    
        if(userData === "sendRequest"){
          window.location.replace('/landing')
      }
    },[])

    useEffect(() => {
        const fetchRemainingLeaves = async () => {
            try {
                const id = localStorage.getItem("id");
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/leaveRemaining/${id}`);
                const data = await response.json();
                setRemainingLeaves(data);
            } catch (error) {
                console.error("Error fetching remaining leaves:", error);
            }
        };

        fetchRemainingLeaves();
    }, []);

    const handleInputChange = (e:any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e:any) => {
        e.preventDefault();

        const remainingLeaveCount = remainingLeaves ? remainingLeaves[formData.leaveType].remaining:0;
        console.log(remainingLeaveCount);

        const startDate:any = new Date(formData.startDate);
        const endDate:any = new Date(formData.endDate);

    let differenceInDays = 0;
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        // Exclude Saturdays (6) and Sundays (0)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            differenceInDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Check if the user has sufficient leave balance for selected number of days
    if (remainingLeaveCount < differenceInDays) {
        return toast.error("You don't have enough leave balance for selected number of days");
    }

    // Check if start date is before end date
    if (startDate > endDate) {
        return toast.error("End date should be after start date");
    }

    // Check if start and end dates are in the past
    const today = new Date().setHours(0, 0, 0, 0);
    if (startDate < today || endDate < today) {
        return toast.error("Start and end dates should be in the future");
    }
    const userId:any = localStorage.getItem("id");
    const companyCode:any = localStorage.getItem("cc");
    const formDataToSend = new FormData();
    formDataToSend.append('user_id', userId);
    formDataToSend.append('start_date', formData.startDate);
    formDataToSend.append('end_date', formData.endDate);
    formDataToSend.append('reason', formData.reason);
    formDataToSend.append('leave_type', formData.leaveType);
    formDataToSend.append('companyCode', companyCode);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/leaveApplication`, {
                method: "POST",
                body: formDataToSend,
            });
            const data = await response.json();
            if (data.status === "success") {
                setFormData({
                    leaveType: '',
                    startDate: '',
                    endDate: '',
                    reason: ''
                });
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error submitting leave application:", error);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className='flex'>
            <Sidebar />
            <div className='w-full '>
            <div className="container mx-auto p-8 lg:ml-16">
                <Toaster />
                <h1 className="lg:text-3xl sm:ml-8 ml-4 lg:ml-0 mt-12 lg:mt-0 text-xl font-bold text-gray-800 flex items-center mb-6">Apply For Leave</h1>
                <div>
                    <form onSubmit={handleSubmit} className='mt-12 max-w-xl'>
                        <div className="mb-4">
                            <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700">
                                Leave Type
                            </label>
                            <select
                                id="leaveType"
                                name="leaveType"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                                value={formData.leaveType}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Leave Type</option>
                                <option value="Sick Leave">Sick Leave</option>
                                <option value="Casual Leave">Casual Leave</option>
                                <option value="Privileged Leave">Privileged Leave</option>
                                <option value="Paternity Leave">Paternity Leave</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                End Date
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                                Reason
                            </label>
                            <input
                                type="text"
                                id="reason"
                                name="reason"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                                placeholder="Enter your reason"
                                value={formData.reason}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className='flex mt-8'>
                            <Link href="/leave" className='w-full'><button
                                type="button"
                                className="py-2 px-4 w-32 border rounded-md text-white bg-green-500 hover:bg-green-600"
                            >
                                Go Back
                            </button>
                            </Link>
                            <button
                                type="submit"
                                className="py-2 px-4 w-32 border rounded-md text-white bg-blue-500 hover:bg-blue-600"
                            >
                                Submit
                            </button>

                        </div>
                    </form>
                </div>
            </div>
            <Footer />
            </div>
        </div>
    );
};

export default LeaveApply;
