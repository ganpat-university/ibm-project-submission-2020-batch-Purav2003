"use client";
import Adminnavbar from "@/app/AdminNavbar";
import React, { useState, useEffect } from "react";
import Loading from "@/loading";
import Link from "next/link";
interface UserData {
    id: string;
    email: string;
    mobile: string;
    password: string;
    companyCode: string;
    name:any;
    department: any;
    profilePhoto: any;
    createdAt: any;
    updatedAt: any;    
}

const Users = () => {
    const [data, setData] = useState<UserData[] | undefined>(undefined);
    const [searchData, setSearchData] = useState<UserData[] | undefined>(undefined);

    const [loading, setLoading] = useState(false)

    const fetchData = async () => {

        let companyCode:any = localStorage.getItem("companyCode");
        let idAsInt = parseInt(companyCode, 10);
        const API_URL = `${process.env.NEXT_PUBLIC_BASE_URI}/approved/${idAsInt}`;
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

    const handleSearchChange =  (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value;
        console.log(search)
        if (search === "") {
            fetchData();
        }
        else {
            let filteredData = data?.filter((item) => {
                return item.name.toLowerCase().includes(search.toLowerCase()) || 
                item.email.toLowerCase().includes(search.toLowerCase()) || 
                item.mobile.includes(search.toLowerCase()) || 
                item.department.toLowerCase().includes(search.toLowerCase())
            });
            setData(filteredData);
            if(filteredData?.length===0){
                setSearchData([])
            }
            
        }
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
    }, []);
    return (
        <>
            <Adminnavbar />
            <br /><br /><br /><br />
            <div className="w-full items-center justify-center flex">
            <input
                            type="text"
                            id="search"
                            className="lg:w-[40%] w-[80%] flex px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                            placeholder="Search"
                            onChange={handleSearchChange}
                            required
                        />
            </div><br></br><br></br>
          { loading?<Loading />:data?.length===0?
                      <h1 className="text-center m-12 pt-8">There are no Users </h1>

          :<div className="grid grid-cols-1 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 ">

                {
                data?.map((item,index) => {
                        return (
                            <Link href={`/admin/users/${item.id}`} key={index}><div className="lg:ml-12 border border-gray-300 border-dashed pt-4 lg:w-64 mb-4 rounded-lg bg-gray-50">
                                <div className="flex flex-col items-center pb-10">
                                    <img className="w-[130px] h-[130px] mb-3 items-center object-cover rounded-full shadow-lg" src={`http://localhost:8000${item.profilePhoto}`} alt="User image" />
                                    <div className="text-left items-left">
                                    <span className="text-sm text-gray-700">Name: {item.name}</span><br></br>
                                    <span className="text-sm text-gray-700 ">Department: {item.department}</span>
                                    </div>
                                    <div className="mt-4">
                                        <Link href={`/admin/users/${item.id}`} className="items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">View Full Profile</Link>
                                    </div>
                                </div>
                            </div></Link>
                        )
                    })
                }

            </div>}
        </>
    )
}

export default Users;
