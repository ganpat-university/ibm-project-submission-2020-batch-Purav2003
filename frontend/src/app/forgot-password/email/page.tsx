"use client";
import React, { useState, useEffect, SyntheticEvent } from 'react';
import { FcGoogle } from "react-icons/fc";
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import helloImage from '../../assets/images/login.jpg';
import logo from '../../assets/images/logo.png';

const ForgotPassEmail = () => {
    const [formData, setFormData] = useState({
        email: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleLoginClick = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (formData.email === '') {
            toast.error("Email is required");
            return;
        }
        localStorage.setItem("ForgotEmail",formData.email)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/forgotPassEmail/${formData.email}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log(data);
            if (data.status === 'success') {
                toast.success(data.message);
                window.location.replace('/forgot-password/validation');
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        localStorage.clear()
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Toaster />

            {/* <div className="hidden lg:block w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${helloImage.src})` }}></div> */}
<div className='w-full min-h-screen items-center flex justify-center'>
            <div className="lg:w-1/2 p-12 items-center p-16 mx-auto bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-extrabold text-gray-800">Forgot Password</h1>
                <form className="mt-8">
                    {/* Email Input */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    

                    {/* Login Button */}
                    <button
                        type="button"
                        onClick={handleLoginClick}
                        className="px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        Send OTP
                    </button>

                  
                </form>
            </div>
        </div>
        </div>
    );
};

export default ForgotPassEmail;
