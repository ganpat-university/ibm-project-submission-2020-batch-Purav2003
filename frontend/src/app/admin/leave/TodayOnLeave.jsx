"use client";
import React, { useState, useEffect } from 'react';
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import Loading from "../../../loading"

const TodayOnLeave = () => {
    const [leave, setLeave] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page

    const fetchLeave = async () => {
        const companyCode = localStorage.getItem("companyCode");
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/todayOnLeave/${companyCode}`);
        const data = await response.json();
        setLeave(data);
        setLoading(false);
        console.log(data);
    }

    useEffect(() => {
        fetchLeave();
    }, []);

    // Get current items


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = leave.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(leave.length / itemsPerPage);
    // Change page
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
    <div className='py-4 px-12 w-[40%]'>
      <h1 className='font-bold text-2xl pb-4'>Today on Leave</h1>
      {loading ? (
                <Loading />
            ) : currentItems.length===0?            <h1 className="text-center text-sm m-12 pt-8">No one is one Leave Today 🎉 </h1>:(
                <div className='w-full'>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentItems.map((data, index) => (
                                <tr key={data.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{data?.user_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{data?.user}</td>
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
            )}
    </div>
  );
}

export default TodayOnLeave;