"use client";
import React, { useState, useEffect } from "react";
import { IoMdRefresh } from "react-icons/io";
import Loading from "../../../loading"
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast, Toaster } from "react-hot-toast";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";


interface UserData {
    id: string;
    email: string;
    mobile: string;
    password: string;
    companyCode: string;
    name: string;
    department: string;
    profilePhoto: string;
    status: string;    
}
const AllUsers = () => {
    const [data, setData] = useState<UserData[] | undefined>(undefined);
    const [loading, setLoading] = useState(false)
    const [authData, setAuthData] = useState()
    const [selectedValue, setSelectedValue] = useState('Request Approved');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const handleButtonClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleItemClick = (value:any) => {
        setSelectedValue(value);
        setIsDropdownOpen(false);
    };


    const apiUrlData = selectedValue === 'All Users' ? 'all' : selectedValue === 'Request Approved' ? 'approved' : selectedValue === 'Request Denied' ? 'rejected' : 'all'
    const fetchData = async () => {

        let companyCode:any = localStorage.getItem("companyCode");
        let idAsInt = parseInt(companyCode, 10);
        const API_URL = `${process.env.NEXT_PUBLIC_BASE_URI}/${apiUrlData}/${idAsInt}`;
        console.log(API_URL);
        const token = localStorage.getItem("token")
        // alert(token)
        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `${token}`,
                },
            });
            const data_new: UserData[] = await response.json();
            console.log(data_new)

            if (Array.isArray(data_new) && data_new.length > 0) {
                setData(data_new);
                console.log(data)
            }
            else {
                setData([])
            }
            setLoading(false)
        } catch (error) {
            console.error(error);
        }
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages =  data? Math.ceil(data?.length / itemsPerPage) :1;
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

    const deleteUser = (id: string) => async () => {
        const API_URL = `${process.env.NEXT_PUBLIC_BASE_URI}/del/${id}`;
        console.log(API_URL);
        const token = localStorage.getItem("token")
        // alert(token)
        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `${token}`,
                },
            });
            const authResponse = await response.json();
            setAuthData(authResponse)
            console.log(authResponse)
            if (authResponse?.status === "success") {
                fetchData();
                toast.success("User Deleted Successfully")
            }
            else {
                toast.error("Error Deleting User")
            }

        } catch (error) {
            console.error(error);
        }
    }

    const editProfile = async (id:any) => {
        window.location.replace(`/admin/dashboard/edit/${id}`)

    }
    useEffect(() => {
        setLoading(true)
        const token = localStorage.getItem("token")
        const companyName = localStorage.getItem("companyName")
        if (!token) {
            window.location.replace('/login')
        }
        if (!companyName) {
            window.location.replace('/dashboard')

        }
        fetchData();
    }, [authData, apiUrlData]);
    return (
        <div className="py-4 px-12">
            <Toaster />
            <div className="flex justify-between">
                {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.js"></script> */}

                <div>
                    <button
                        id="dropdownDefaultButton"
                        data-dropdown-toggle="dropdown"
                        className="text-black pr-5 py-2.5 text-center inline-flex items-center"
                        type="button"
                        onClick={handleButtonClick}
                    >
                        <span className="ms-3">{selectedValue}</span>
                        <svg
                            className="w-2.5 h-2.5 ms-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 10 6"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m1 1 4 4 4-4"
                            />
                        </svg>
                    </button>
                    {isDropdownOpen && (
                        <div
                            id="dropdown"
                            className="z-10 bg-gray-300 absolute divide-y divide-gray-100 rounded-lg shadow w-44  mt-2"
                        >
                            <ul
                                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                aria-labelledby="dropdownDefaultButton"
                            >
                                <li>
                                    <a
                                        className="block hover:cursor-pointer px-4 py-2 hover:bg-gray-100 text-black"
                                        onClick={() => handleItemClick('All Users')}
                                    >
                                        All Users
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="block hover:cursor-pointer px-4 py-2 hover:bg-gray-100 text-black"
                                        onClick={() => handleItemClick('Request Approved')}
                                    >
                                        Request Approved
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="block hover:cursor-pointer px-4 py-2 hover:bg-gray-100 text-black"
                                        onClick={() => handleItemClick('Request Denied')}
                                    >
                                        Request Denied
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
                <button onClick={fetchData} className="bg-gray-200 w-12 h-12 rounded-lg mb-2 flex justify-center items-center"><IoMdRefresh className="text-2xl" /></button>
            </div>
            {loading ? <Loading />

                :currentItems?.length===0?<div className="text-center p-16 text-gray-500">NO DATA</div>:
                <div className="overflow-auto"> <table className="table-striped w-full text-sm text-gray-500 text-white overflow-scroll">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 text-white">
                        <tr>
                            <th scope="col" className="text-center px-6 py-3">
                                ID
                            </th>
                            <th scope="col" className="text-center px-6 py-3">
                                Photo
                            </th>
                            <th scope="col" className="text-center px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="text-center px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="text-center px-6 py-3">
                                Mobile
                            </th>
                            <th scope="col" className="text-center px-6 py-3">
                                Department
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#eee]  overflow-scroll">
                        {currentItems?.map((item: UserData) => (
                            <tr key={item.id} className="p-4  text-[#4a4a4a] items-center">

                                <td className="p-4 text-center">{item.id}</td>
                                <td className="text-center justify-center flex p-4"><img src={`http://localhost:8000${item.profilePhoto}`} className="w-12 h-12 rounded-full object-cover" /></td>
                                <td className="p-4 text-center">{item.name}</td>
                                <td className="p-4 text-center">{item.email}</td>
                                <td className="p-4 text-center">{item.mobile}</td>
                                <td className="p-4 text-center">{item.department}</td>
                                <td>
                                    <button><FaRegEdit className="text-lg" onClick={() => { editProfile(item.id) }} /></button>
                                    <button className="pl-4" onClick={deleteUser(item.id)}><RiDeleteBin6Line className="text-lg" /></button>
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
    );
}

export default AllUsers;