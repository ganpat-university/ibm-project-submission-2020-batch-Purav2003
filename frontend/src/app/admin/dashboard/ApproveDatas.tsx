"use client";
import React, { useState, useEffect } from "react";
import { IoCheckmark } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

interface UserData {
    id: string;
    email: string;
    mobile: string;
    password: string;
    companyCode: string;
    isAuthorized: string;
    name: string;
    department: string;
    profilePhoto: string;
    createdAt: string;
    updatedAt: string;    
}

const ApproveData = () => {
    const [data, setData] = useState<UserData[] | undefined>(undefined);
    const [approveData, setApproveData] = useState<UserData[]>([]);
    const [authData, setAuthData] = useState()
    const fetchData = async () => {
        let companyCode = localStorage.getItem("companyCode");
        let idAsInt = parseInt(companyCode || "0", 10);
        const API_URL = `${process.env.NEXT_PUBLIC_BASE_URI}/all/${idAsInt}`;
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            });
            const data_new: UserData[] = await response.json();

            if (Array.isArray(data_new) && data_new.length > 0) {
                setData(data_new);
                const newApproveData = data_new.filter(
                    (item) => item.isAuthorized === "sendRequest"
                );
                setApproveData(newApproveData);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const approve = (id: string) => async () => {
        const API_URL = `${process.env.NEXT_PUBLIC_BASE_URI}/access/${id}`;
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
            const authResponse:any = response.json();
            setAuthData(authResponse)
            console.log(authResponse)

            fetchData();
            // if (authData?.status === "success"){
            // }
        } catch (error) {
            console.error(error);
        }
    }

    const deny = (id: string) => async () => {
        const API_URL = `${process.env.NEXT_PUBLIC_BASE_URI}/deny/${id}`;
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
            const authResponse:any = response.json();
            setAuthData(authResponse)
            console.log(authResponse)

            fetchData();
            // if (authData?.status === "success"){
            // }
        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        const token = localStorage.getItem("token");
        const companyName = localStorage.getItem("companyName");
        if (!token) {
            window.location.replace("/login");
        }
        if (!companyName) {
            window.location.replace("/dashboard");
        }
        fetchData();
    }, [authData]);

    return (
        <>
        {approveData?.length > 0 ? (
        <div className="py-4 px-12 ">
            <h1 className="font-bold text-2xl pb-4">Pending Requests</h1>
        <div className="overflow-auto">
                <table className="table-striped w-full text-sm text-gray-500 text-white overflow-scroll">
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
                            <th>

                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#eee]  overflow-scroll">
                        {approveData?.map((item: UserData) => (
                            <tr key={item.id} className="p-4  text-[#4a4a4a] ">

                                <td className="p-4 text-center">{item.id}</td>
                                <td className="text-center justify-center flex p-4"><img src={`http://localhost:8000${item.profilePhoto}`} className="w-12 h-12 rounded-full object-cover" /></td>
                                <td className="p-4 text-center">{item.name}</td>
                                <td className="p-4 text-center">{item.email}</td>
                                <td className="p-4 text-center">{item.mobile}</td>
                                <td className="p-4 text-center">{item.department}</td>
                                <td className="text-center">
                                    <button className="btn border px-4 py-2 border-green-500 text-white rounded-md bg-green-500" onClick={approve(item.id)}>
                                        <IoCheckmark className="text-xl"/></button>
                                        
                                    <button className="btn border ml-2 px-4 py-2 border-red-500 text-white rounded-md bg-red-500" onClick={deny(item.id)}>
                                        <RxCross2 className="text-xl"/></button>
                                        
                                        </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                <br></br><br></br>
             
        </div>): (
            <div>
                {/* <h1 className="text-center m-12">There are no Pending Requests </h1> */}
            </div>
        )}</>
    );
};

export default ApproveData;
