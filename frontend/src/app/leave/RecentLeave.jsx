"use client"
import React, { useState, useEffect } from 'react';
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import Loading from "../../loading"
const RecentLeave = () => {
  const [leave, setLeave] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  const fetchLeave = async () => {
    const id = localStorage.getItem('id');
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/leaveHistory/${id}`);
    const data = await response.json();
    setLeave(data);
    setLoading(false);
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
    <div className="container mx-auto p-8">
      <h1 className="text-lg font-semibold text-gray-800 mb-6">This Month&apos;s Leave Applications</h1>
      {loading ? (
        <Loading />
      ) : currentItems.length === 0 ? <div className="text-center p-16 text-gray-500">No Leave Application this month</div> : (
        <div className='w-full '>
          <div className='w-full overflow-x-auto'>
          <table className="min-w-full  divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Leave ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.map((data, index) => (
                <tr key={data.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{data?.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{data.leave_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{data.start_date.split('-').reverse().join('-')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{data.end_date.split('-').reverse().join('-')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{data.reason}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center`}>{data.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
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

export default RecentLeave;
