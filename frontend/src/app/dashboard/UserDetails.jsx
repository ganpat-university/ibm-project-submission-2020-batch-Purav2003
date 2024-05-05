"use client";
import { useState, useEffect } from "react";
import { IoHandLeftOutline } from "react-icons/io5";
import { ImTree } from "react-icons/im";
import { LiaUsersSolid } from "react-icons/lia";
import Loading from "../../loading";

const UserDetails = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const id = localStorage.getItem("id");
        const API_URL = `${process.env.NEXT_PUBLIC_BASE_URI}/user/${id}`;
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            });
            const data_new = await response.json();
            if(data_new){
                setData(data_new);
            }
            else{
                window.location.replace("/login");        
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.replace("/login");
        }
        const userData = localStorage.getItem("isAuthorized");

        if (userData === "sendRequest") {
            window.location.replace("/landing");
        }

        fetchData();
    }, []);

    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-4 sm:mx-8 md:mx-12 lg:mx-16">
                    <div className="shadow shadow-lg rounded-lg flex p-4 bg-[#FEF4E4] items-center">
                        <img
                            src={`http://localhost:8000${data?.profilePhoto}`}
                            className="h-8 object-cover w-8 lg:w-16 lg:h-16 rounded-full"
                            alt="Profile"
                        />
                        <div>
                            <h1 className="text-xl font-bold pl-4">{data?.name}</h1>
                        </div>
                    </div>

                    <div className="shadow shadow-lg rounded-lg flex text-black bg-[rgba(0,125,0,0.3)] p-4 items-center">
                        <div className="lg:p-4 p-2 bg-green-500 rounded-full">
                            <IoHandLeftOutline className="lg:text-3xl text-lg text-white" />
                        </div>
                        <div>
                            <h1 className="text-sm lg:text-xl font-bold pl-4">
                                Employee ID
                                <br />
                                <span className="text-sm font-thin">#{data?.id}</span>
                            </h1>
                        </div>
                    </div>

                    <div className="shadow shadow-lg rounded-lg flex text-black bg-[rgba(63,122,244,0.3)] p-4 items-center">
                        <div className="p-2 lg:p-4 bg-[rgb(63,122,244)] rounded-full">
                            <LiaUsersSolid className="lg:text-3xl text-lg text-white " />
                        </div>
                        <div>
                            <h1 className="lg:text-xl text-sm font-bold pl-4">
                                Company Name
                                <br />
                                <span className="text-sm font-thin">{data?.company}</span>
                            </h1>
                        </div>
                    </div>

                    <div className="shadow shadow-lg rounded-lg flex text-black bg-[rgba(135,17,237,0.3)] p-4 items-center">
                        <div className="lg:p-4 p-2 bg-[rgb(135,17,237)] rounded-full">
                            <ImTree className="lg:text-3xl text-lg text-white" />
                        </div>
                        <div>
                            <h1 className="lg:text-xl text-sm font-bold pl-4">
                                Department
                                <br />
                                <span className="text-sm font-thin">{data?.department}</span>
                            </h1>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDetails;
