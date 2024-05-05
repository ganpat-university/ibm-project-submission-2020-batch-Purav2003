"use client";
import React, { useState, useEffect, SyntheticEvent } from 'react';
import { FcGoogle } from "react-icons/fc";
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import helloImage from '../../assets/images/login.jpg';
import logo from '../../assets/images/logo.png';
import { Button, Input, Space } from 'antd';

const ForgotPassword = () => {
    const [formData, setFormData] = useState({
        password: '',
        repassword: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleLoginClick = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (formData.password === '' || formData.repassword === '') {
            toast.error("All fields are required");
            return;
        }
        if (formData.password !== formData.repassword) {
            toast.error("Passwords do not match");
            return;
        }
        const email = localStorage.getItem("ForgotEmail");
        const dataToSend = {
            password: formData.password,
            email: email
        };
        console.log(dataToSend);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/forgotPassword/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });

            const data = await response.json();       
            if (data.status === 'success') {
                localStorage.clear()
                toast.success("Password Reset Successfully");
                window.location.replace("/login")
            } else {
                toast.error(data.message || data.error);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(()=>{
        const otpVerified = localStorage.getItem("forgotOtpVerified");
        if(!otpVerified){
            window.location.replace("/forgot-password/validation")
        }
    })

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Toaster />

            {/* <div className="hidden lg:block w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${helloImage.src})` }}></div> */}
            <div className='w-full min-h-screen items-center flex justify-center'>
                <div className="lg:w-1/2 p-12 items-center p-16 mx-auto bg-white rounded-lg shadow-lg">
                    <h1 className="text-3xl font-extrabold text-gray-800">Reset Password</h1>
                    <form className="mt-8">
                        {/* Email Input */}
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                            <Input.Password placeholder="Enter Password"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                                id="password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />

                        </div>

                        {/* Password Input */}
                        <div className="mb-4">
                            <label htmlFor="repassword" className="block text-sm font-medium text-gray-600">Retype Password</label>
                            <Input.Password placeholder="Retype Password"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                                id="repassword"
                                value={formData.repassword}
                                onChange={handleInputChange}
                            />

                        </div>

                        {/* Login Button */}
                        <div><Link href="/profile">
                            <button
                                type="button"
                                className="px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:ring focus:border-blue-300"
                            >
                                Go Back
                            </button>
                            </Link>
                            <button
                                type="button"
                                onClick={handleLoginClick}
                                className="px-4 ml-8 py-2 text-white bg-green-700 rounded-md hover:bg-green-800 focus:outline-none focus:ring focus:border-green-300"
                            >
                                Reset Password
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;